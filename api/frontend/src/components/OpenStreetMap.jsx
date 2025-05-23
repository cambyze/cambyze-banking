import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";

const LocationPicker = ({ setPosition }) => {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });
  return null;
};

const AddressModal = ({ isOpen, onRequestClose, onAddressSelected }) => {
  const [position, setPosition] = useState(null);
  const [address, setAddress] = useState("");
  const [manualAddress, setManualAddress] = useState("");
  const [manualCity, setManualCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const fetchAddress = async (lat, lon) => {
    try {
      const res = await axios.get("https://nominatim.openstreetmap.org/reverse", {
        params: {
          lat,
          lon,
          format: "json",
          addressdetails: 1,
        },
      });
      const data = res.data;
      setAddress(data.display_name);
      if (data.address) {
        setManualAddress(data.address.road || "");
        setManualCity(data.address.city || data.address.town || data.address.village || "");
        setPostalCode(data.address.postcode || "");
      }
    } catch (err) {
      console.error("Erreur lors du reverse geocoding :", err);
    }
  };

  const searchAddress = async (query) => {
    if (!query) return;
    try {
      const res = await axios.get("https://nominatim.openstreetmap.org/search", {
        params: {
          q: query,
          format: "json",
          addressdetails: 1,
          limit: 5,
        },
      });
      setSuggestions(res.data);
    } catch (err) {
      console.error("Erreur de recherche :", err);
    }
  };

  const handleSuggestionClick = (place) => {
    const lat = parseFloat(place.lat);
    const lon = parseFloat(place.lon);
    const display = place.display_name;

    setManualAddress(place.address.road || "");
    setManualCity(place.address.city || place.address.town || place.address.village || "");
    setPostalCode(place.address.postcode || "");
    setPosition({ lat, lng: lon });
    setAddress(display);
    setSuggestions([]);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      const query = [manualAddress, postalCode, manualCity].filter(Boolean).join(", ");
      searchAddress(query);
    }, 500);
    return () => clearTimeout(timer);
  }, [manualAddress, manualCity, postalCode]);

  const handleConfirm = () => {
    const finalAddress = address || `${manualAddress}, ${postalCode}, ${manualCity}`;
    if (position || (manualAddress && manualCity && postalCode)) {
      onAddressSelected({
        lat: position?.lat ?? null,
        lon: position?.lng ?? null,
        address: finalAddress,
      });
      onRequestClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-2xl transition-all">
        <div className="flex items-center justify-between mb-4 border-b pb-2">
          <h2 className="text-lg font-medium text-gray-800">Choisir un emplacement</h2>
          <button
            onClick={onRequestClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            ✕
          </button>
        </div>

        <div className="h-80 rounded overflow-hidden mb-4">
          <MapContainer
            center={position || [48.8566, 2.3522]}
            zoom={13}
            style={{ height: "100%", width: "100%" }}
            className="rounded"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />
            <LocationPicker
              setPosition={async (latlng) => {
                setPosition(latlng);
                await fetchAddress(latlng.lat, latlng.lng);
              }}
            />
            {position && <Marker position={position} />}
          </MapContainer>
        </div>

        {address && (
          <p className="text-sm text-gray-600 mb-4">
            <span className="font-medium">Adresse détectée :</span> {address}
          </p>
        )}

        <div className="mb-4 relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">Adresse manuelle</label>
          <input
            type="text"
            value={manualAddress}
            onChange={(e) => setManualAddress(e.target.value)}
            className="w-full border rounded px-3 py-2 mb-2"
            placeholder="Ex : 10 rue de Rivoli"
          />
          {suggestions.length > 0 && (
            <ul className="border rounded bg-white shadow absolute z-10 w-full mt-1 max-h-40 overflow-auto">
              {suggestions.map((place, index) => (
                <li
                  key={index}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                  onClick={() => handleSuggestionClick(place)}
                >
                  {place.display_name}
                </li>
              ))}
            </ul>
          )}
          <input
            type="text"
            value={manualCity}
            onChange={(e) => setManualCity(e.target.value)}
            className="w-full border rounded px-3 py-2 mb-2"
            placeholder="Ville"
          />
          <input
            type="text"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="Code postal"
          />
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onRequestClose}
            className="px-4 py-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
          >
            Annuler
          </button>
          <button
            onClick={handleConfirm}
            disabled={!position && !(manualAddress && manualCity && postalCode)}
            className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Confirmer
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddressModal;

// export default AddressModal;


// // import React, { useState } from "react";
// // import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
// // import "leaflet/dist/leaflet.css";
// // import axios from "axios";

// // const LocationPicker = ({ setPosition }) => {
// //   useMapEvents({
// //     click(e) {
// //       setPosition(e.latlng);
// //     },
// //   });
// //   return null;
// // };

// // const AddressModal = ({ isOpen, onRequestClose, onAddressSelected }) => {
// //   const [position, setPosition] = useState(null);
// //   const [address, setAddress] = useState("");
// //   const [manualAddress, setManualAddress] = useState("");
// //   const [manualCity, setManualCity] = useState("");

// //   const fetchAddress = async (lat, lon) => {
// //     const res = await axios.get("https://nominatim.openstreetmap.org/reverse", {
// //       params: {
// //         lat,
// //         lon,
// //         format: "json",
// //       },
// //     });
// //     setAddress(res.data.display_name);
// //   };

// //   // const handleConfirm = () => {
// //   //   if (position && address) {
// //   //     onAddressSelected({
// //   //       lat: position.lat,
// //   //       lon: position.lng,
// //   //       address,
// //   //     });
// //   //     onRequestClose();
// //   //   }
// //   // };
// //   const handleConfirm = () => {
// //   let finalAddress = address;

// //   if (manualAddress || manualCity) {
// //     finalAddress = `${manualAddress}, ${manualCity}`;
// //   }

// //   if (position || (manualAddress && manualCity)) {
// //     onAddressSelected({
// //       lat: position?.lat ?? null,
// //       lon: position?.lng ?? null,
// //       address: finalAddress,
// //     });
// //     onRequestClose();
// //   }
// // };


// //   if (!isOpen) return null;

// //   return (
// //     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
// //       <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-2xl transition-all">
// //         <div className="flex items-center justify-between mb-4 border-b pb-2">
// //           <h2 className="text-lg font-medium text-gray-800">Choisir un emplacement</h2>
// //           <button
// //             onClick={onRequestClose}
// //             className="text-gray-400 hover:text-gray-600 transition"
// //           >
// //             ✕
// //           </button>
// //         </div>

// //         <div className="h-80 rounded overflow-hidden mb-4">
// //           <MapContainer
// //             center={[48.8566, 2.3522]}
// //             zoom={13}
// //             style={{ height: "100%", width: "100%" }}
// //             className="rounded"
// //           >
// //             <TileLayer
// //               url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
// //               attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
// //             />
// //             <LocationPicker
// //               setPosition={async (latlng) => {
// //                 setPosition(latlng);
// //                 await fetchAddress(latlng.lat, latlng.lng);
// //               }}
// //             />
// //             {position && <Marker position={position} />}
// //           </MapContainer>
// //         </div>

// //         {address && (
// //           <p className="text-sm text-gray-600 mb-4">
// //             <span className="font-medium">Adresse détectée :</span> {address}
// //           </p>
// //         )}
// //         <div className="mb-4">
// //           <label className="block text-sm font-medium text-gray-700 mb-1">Adresse manuelle</label>
// //           <input
// //             type="text"
// //             value={manualAddress}
// //             onChange={(e) => setManualAddress(e.target.value)}
// //             className="w-full border rounded px-3 py-2 mb-2"
// //             placeholder="Ex : 10 rue de Rivoli"
// //           />
// //           <input
// //             type="text"
// //             value={manualCity}
// //             onChange={(e) => setManualCity(e.target.value)}
// //             className="w-full border rounded px-3 py-2"
// //             placeholder="Ville"
// //           />
// //         </div>


// //         <div className="flex justify-end space-x-3">
// //           <button
// //             onClick={onRequestClose}
// //             className="px-4 py-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
// //           >
// //             Annuler
// //           </button>
// //           <button
// //             onClick={handleConfirm}
// //             disabled={!position}
// //             className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
// //           >
// //             Confirmer
// //           </button>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default AddressModal;