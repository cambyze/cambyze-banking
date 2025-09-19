import React, { useState, useEffect } from "react";
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

export default function Map({ isOpen, onClose, onAddressChange }) {
  const [address, setAddress] = useState("");
  const [webViewKey, setWebViewKey] = useState(0);
  const webViewRef = React.useRef(null);

  useEffect(() => {
    if (onAddressChange) {
      onAddressChange(address);
    }
  }, [address, onAddressChange]);

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
      <div id="map" style="height: 100%; width: 100%; background-color: lightgray;"></div>
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

        document.addEventListener("message", async function(event) {
          const msg = JSON.parse(event.data);
          if (msg.type === "search") {
            const address = msg.address;
            try {
              const response = await fetch(\`https://nominatim.openstreetmap.org/search?q=\${encodeURIComponent(address)}&format=json&limit=1\`);
              const results = await response.json();
              if (results.length > 0) {
                const { lat, lon, display_name } = results[0];
                addMarker(lat, lon, display_name);
                window.ReactNativeWebView.postMessage(JSON.stringify({
                  type: "addressSelected",
                  lat,
                  lon,
                  address: display_name
                }));
              } else {
                alert("Adresse non trouvée.");
              }
            } catch (err) {
              alert("Erreur lors de la recherche de l'adresse.");
            }
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
    <Modal
      animationType="slide"
      transparent={false}
      visible={isOpen}
      onRequestClose={onClose}
    >
              {/* <WebView source={{ html: leafletHTML }} style={{ height: screenHeight * 0.4 }} /> */}
      {/* <View style={styles.modalOverlay}> */}
        {/* <View style={[styles.modalContent, { flex: 1 }]}> */}
          <Text style={styles.title}>Carte Interactive</Text>
          <WebView
            key={webViewKey}
            ref={webViewRef}
            originWhitelist={["*"]}
            source={{ html: leafletHTML }}
            style={styles.webView}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            onMessage={(event) => {
              console.log("Message reçu depuis la WebView :", event.nativeEvent.data);
              handleWebViewMessage(event);
            }}
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
        {/* </View> */}
      {/* </View> */}
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