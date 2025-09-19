import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import { useTranslation } from 'react-i18next';
import PinBG from '../assets/PinBg.png';
import L from 'leaflet';

const LocationPicker = ({ setPosition }) => {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });
  return null;
};

const AddressModal = ({ isOpen, onRequestClose, onAddressSelected }) => {
  const { t } = useTranslation();
  const [position, setPosition] = useState(null);
  const [address, setAddress] = useState("");
  const [allAddress, setAllAddress] = useState([]);
  const [manualAddress, setManualAddress] = useState("");
  const [manualCity, setManualCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");
  const [streetNumber, setStreetNumber] = useState("");
  const [secondaryAddress, setSecondaryAddress] = useState("");
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
      setAllAddress(data);
      console.log("Reverse geocoding result:", data);
      // setAddress(data.address);
      if (data.address) {
        setManualAddress((data.address.house_number || "")+(data.address.house_number || "") + " " + (data.address.road || ""));
        setManualCity(data.address.city || data.address.town || data.address.village || "");
        setCountry(data.address.country || "");
        setPostalCode(data.address.postcode || "");
        setStreetNumber(data.address.house_number || "");
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

  const customIcon = L.icon({
    iconUrl: PinBG,
    iconSize: [30, 40], // adapte à la taille de ton image
    iconAnchor: [15, 40], // position de la pointe du marqueur
  });


  const handleSuggestionClick = (place) => {
    const lat = parseFloat(place.lat);
    const lon = parseFloat(place.lon);
    const display = place.display_name;

    setManualAddress(place.address.road || "");
    setManualCity((place.address.city || place.address.town || place.address.village || ""));
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
  const streetWithNumber = `${streetNumber ? streetNumber + ' ' : ''}${manualAddress}`.trim();
  const formattedFull = [streetWithNumber, postalCode, manualCity, country].filter(Boolean).join(', ');
  const finalAddress = formattedFull;
  if (position || (manualAddress && manualCity && postalCode)) {
    onAddressSelected({
      lat: position?.lat ?? null,
      lon: position?.lng ?? null,
      country: country,
      city: manualCity,
      postcode: postalCode,
      street: streetWithNumber,
      address: finalAddress, 
      full: formattedFull,  
    });
    onRequestClose();
  }
};
  // const handleConfirm = () => {
  //   const finalAddress = address || `${manualAddress}, ${postalCode}, ${manualCity}`;
  //   if (position || (manualAddress && manualCity && postalCode)) {
  //     onAddressSelected({
  //       lat: position?.lat ?? null,
  //       lon: position?.lng ?? null,
  //       address: finalAddress,
  //     });
  //     Fulladdress(finalAddress);
  //     onRequestClose();
  //   }
  // };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-2xl transition-all">
        <div className="flex items-center justify-between mb-4 border-b pb-2">
          <h2 className="text-lg font-medium text-gray-800">{t('Choose_Location_Title')}</h2>
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
            {position && <Marker position={position} icon={customIcon} />}
          </MapContainer>
        </div>

        {address && (
          <p className="text-sm text-gray-600 mb-4">
            <span className="font-medium">{t('Detected_Address_Label')}</span> {address}
          </p>
        )}

        <div className="mb-4 relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('Manual_Address_Label')}</label>
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
            placeholder={t('City_Label')}
          />
          <input
            type="text"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder={t('Postal_Code_Label')}
          />
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onRequestClose}
            className="px-4 py-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
          >
            {t('Cancel_Button')}
          </button>
          <button
            onClick={handleConfirm}
            disabled={!position && !(manualAddress && manualCity && postalCode)}
            className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {t('Confirm_Button')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddressModal;