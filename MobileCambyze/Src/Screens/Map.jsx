import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Modal,
  Dimensions,
} from "react-native";
import { WebView } from "react-native-webview";
import colors from "../Constants/colors";

const screenHeight = Dimensions.get("window").height;

export default function Map({ isOpen, onClose }) {
  const [address, setAddress] = useState("");
  const webViewRef = React.useRef(null);

  const leafletHTML = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <style>
          html, body, #map { height: 100%; margin: 0; padding: 0; }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <script>
          const map = L.map('map').setView([48.7842, 2.2949], 17);
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
          }).addTo(map);

          let marker = null;

          function addMarker(lat, lon, text = "") {
            if (marker) map.removeLayer(marker);
            marker = L.marker([lat, lon]).addTo(map).bindPopup(text).openPopup();
            map.setView([lat, lon], 17);
          }

          map.on('click', async function(e) {
            const lat = e.latlng.lat;
            const lon = e.latlng.lng;

            try {
              const response = await fetch(\`https://nominatim.openstreetmap.org/reverse?lat=\${lat}&lon=\${lon}&format=json\`);
              const data = await response.json();
              const address = data.display_name;
              addMarker(lat, lon, address);

              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: "addressSelected",
                lat,
                lon,
                address
              }));
            } catch (err) {
              console.error("Reverse geocoding failed", err);
            }
          });
        </script>
      </body>
    </html>
  `;

  const handleWebViewMessage = (event) => {
    const data = JSON.parse(event.nativeEvent.data);
    if (data.type === "addressSelected") {
      console.log("Adresse sélectionnée :", data.address);
    }
  };

  return (
    <Modal animationType="slide" transparent={true} visible={isOpen} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Carte Interactive</Text>
          <WebView
            ref={webViewRef}
            originWhitelist={["*"]}
            source={{ html: leafletHTML }}
            style={styles.webView}
            onMessage={handleWebViewMessage}
          />
          <TextInput
            placeholder="Rechercher une adresse"
            value={address}
            onChangeText={setAddress}
            style={styles.input}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.searchButton}
              onPress={() =>
                webViewRef.current?.postMessage(JSON.stringify({ type: "search", address }))
              }
            >
              <Text style={styles.buttonText}>Rechercher</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.buttonText}>Fermer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: colors.background,
    borderRadius: 10,
    padding: 20,
    width: "90%",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginBottom: 10,
  },
  webView: {
    width: "100%",
    height: screenHeight * 0.4,
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 10,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: colors.textInputBorder,
    borderRadius: 8,
    padding: 10,
    backgroundColor: colors.textInputBackground,
    color: colors.textInputText,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  searchButton: {
    flex: 1,
    backgroundColor: colors.buttonBackGround,
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginRight: 5,
  },
  closeButton: {
    flex: 1,
    backgroundColor: colors.SecondaryButtonBackground,
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginLeft: 5,
  },
  buttonText: {
    color: colors.buttonText,
    fontWeight: "bold",
  },
});


// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   ScrollView,
//   StyleSheet,
//   TextInput,
//   TouchableOpacity,
//   Modal,
//   Animated,
//     Button,
//   Dimensions
// } from "react-native";
// import { useNavigation } from "@react-navigation/native";
// import { useTranslation } from "react-i18next";
// import colors from "../Constants/colors";
// import { WebView } from 'react-native-webview';
// const screenHeight = Dimensions.get('window').height;


// export default function Map({ isOpen, onClose }) {

//   // const leafletHTML = `
//   //   <!DOCTYPE html>
//   //   <html>
//   //     <head>
//   //       <meta name="viewport" content="width=device-width, initial-scale=1.0">
//   //       <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
//   //       <style>
//   //         html, body, #map { height: 100%; margin: 0; padding: 0; }
//   //       </style>
//   //     </head>
//   //     <body>
//   //       <div id="map"></div>
//   //       <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
//   //       <script>
//   //         const lat = 48.784273577503534;
//   //         const lon = 2.2949140808995425;
    
//   //         const map = L.map('map').setView([lat, lon], 17);
//   //         L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//   //           attribution: '© OpenStreetMap contributors'
//   //         }).addTo(map);
    
//   //         L.marker([lat, lon])
//   //           .addTo(map)
//   //           .bindPopup("Cambyze Consulting<br>14 Avenue Jean Perrin, 92330 Sceaux")
//   //           .openPopup();
//   //       </script>
//   //     </body>
//   //   </html>
//   // `;

//   const leafletHTML = `
//     <!DOCTYPE html>
//     <html>
//       <head>
//         <meta name="viewport" content="width=device-width, initial-scale=1.0">
//         <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
//         <style>
//           html, body, #map { height: 100%; margin: 0; padding: 0; }
//         </style>
//       </head>
//       <body>
//         <div id="map"></div>
//         <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
//         <script>
//           const map = L.map('map').setView([48.7842, 2.2949], 17);
//           L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//             attribution: '© OpenStreetMap contributors'
//           }).addTo(map);

//           let marker = null;

//           function addMarker(lat, lon, text = "") {
//             if (marker) map.removeLayer(marker);
//             marker = L.marker([lat, lon]).addTo(map).bindPopup(text).openPopup();
//             map.setView([lat, lon], 17);
//           }

//           // Click handler
//           map.on('click', async function(e) {
//             const lat = e.latlng.lat;
//             const lon = e.latlng.lng;

//             try {
//               const response = await fetch(\`https://nominatim.openstreetmap.org/reverse?lat=\${lat}&lon=\${lon}&format=json\`);
//               const data = await response.json();
//               const address = data.display_name;
//               addMarker(lat, lon, address);

//               // Envoie l'adresse à React Native
//               window.ReactNativeWebView.postMessage(JSON.stringify({
//                 type: "addressSelected",
//                 lat,
//                 lon,
//                 address
//               }));
//             } catch (err) {
//               console.error("Reverse geocoding failed", err);
//             }
//           });

//           // Listen from React Native
//           document.addEventListener("message", async function(event) {
//             const msg = JSON.parse(event.data);
//             if (msg.type === "search") {
//               const address = msg.address;
//               try {
//                 const response = await fetch(\`https://nominatim.openstreetmap.org/search?q=\${encodeURIComponent(address)}&format=json&limit=1\`);
//                 const results = await response.json();
//                 if (results.length > 0) {
//                   const { lat, lon, display_name } = results[0];
//                   addMarker(lat, lon, display_name);
//                   window.ReactNativeWebView.postMessage(JSON.stringify({
//                     type: "addressSelected",
//                     lat,
//                     lon,
//                     address: display_name
//                   }));
//                 } else {
//                   alert("Adresse non trouvée.");
//                 }
//               } catch (err) {
//                 alert("Erreur lors de la recherche de l'adresse.");
//               }
//             }
//           });
//         </script>
//       </body>
//     </html>
//   `;



//   const [address, setAddress] = useState("");
//   const webViewRef = React.useRef(null);

//   const handleWebViewMessage = (event) => {
//     const data = JSON.parse(event.nativeEvent.data);
//     if (data.type === "addressSelected") {
//       console.log("Adresse sélectionnée :", data.address);
//       console.log("Coordonnées :", data.lat, data.lon);
//       // Ici, tu peux mettre à jour ton formulaire, stocker, etc.
//     }
//   };

//   return ( 
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//         <Text style={{ fontSize: 20, marginBottom: 20 }}>Map Component</Text>
//         <Modal
//           animationType="slide"
//           transparent={true}
//           visible={isOpen}
//           onRequestClose={onClose}
//         >
//           {/* Fond semi-transparent */}
//           <View style={styles.modalOverlay}>
//             <Text style={{ fontSize: 24, marginBottom: 20 }}>Map Modal</Text>
//             <View style={styles.WebViewStyle}>
//               {/* <WebView source={{ html: leafletHTML }} style={{ height: screenHeight * 0.4 }} /> */}
//               <WebView
//                 ref={webViewRef}
//                 originWhitelist={['*']}
//                 source={{ html: leafletHTML }}
//                 style={{ height: screenHeight * 0.4 }}
//                 onMessage={handleWebViewMessage}
//               />
//               {/* <WebView source={{ uri: 'https://reactnative.dev/' }} style={{ height: screenHeight * 0.5 }} />; */}
//             </View>
//             {/* <View style={styles.WebViewStyle}> */}
//               {/* <WebView
//                 source={{ uri: 'https://translate.google.fr/?hl=fr&sl=en&tl=fr&op=translate' }}
//                 //style={styles.webView}
//                 style={{ height: screenHeight * 0.4 }}
//               /> */}
//               <TextInput
//                 placeholder="Entrer une adresse"
//                 value={address}
//                 onChangeText={setAddress}
//                 style={{ backgroundColor: 'white', padding: 10, margin: 10 }}
//               />
//               <Button title="Rechercher" onPress={() =>  
//                 webViewRef.current?.postMessage(JSON.stringify({ type: 'search', address })) } />
//               <Button title="Fermer la carte" onPress={onClose} />
//             {/* </View> */}
//           </View>
//         </Modal>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.9)', // Opacité du fond,
//     //backgroundColor: 'rgba(0,0,0,0.5)', // Opacité du fond
//     //justifyContent: 'center',
//     //alignItems: 'center',
//     // padding: 20,
//     // margin: 20,
//   },
//   modalContent: {
//     // backgroundColor: 'white',
//     // borderRadius: 10,
//     overflow: 'hidden',
//     // width: '100%',
//     // maxHeight: screenHeight * 0.85,
//   },
//   webView: {
//     //width: '100%',
//     //height: screenHeight * 0.7,
//   },
//   WebViewStyle: {
//     flex: 1,
//   }
// });
