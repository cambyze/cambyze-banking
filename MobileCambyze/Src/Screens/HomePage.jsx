import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Dimensions
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import colors from "../Constants/colors";
import { WebView } from 'react-native-webview';
import Map from "./Map";
const screenHeight = Dimensions.get('window').height;

function Carousel() {
  const { t } = useTranslation("homePage");
  const items = [
    {
      title: t("carousel.availability_Title"),
      desc: t("carousel.availability_Desc"),
      color: { backgroundColor: "#BFDBFE", color: "#2563EB" },
    },
    {
      title: t("carousel.newService_Title"),
      desc: t("carousel.newService_Desc"),
      color: { backgroundColor: "#BBF7D0", color: "#16A34A" },
    },
    {
      title: t("carousel.support_Title"),
      desc: t("carousel.support_Desc"),
      color: { backgroundColor: "#FEF3C7", color: "#D97706" },
    },
    {
      title: t("carousel.security_Title"),
      desc: t("carousel.security_Desc"),
      color: { backgroundColor: "#E9D5FF", color: "#9333EA" },
    },
    {
      title: t("carousel.special_Offer_Title"),
      desc: t("carousel.special_Offer_Desc"),
      color: { backgroundColor: "#FBCFE8", color: "#DB2777" },
    },
  ];

  return (
    <View style={styles.carousel}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {items.map((item, index) => (
          <View key={index} style={[styles.carouselItem, item.color]}>
            <Text style={[styles.carouselTitle, { color: item.color.color }]}>{item.title}</Text>
            <Text style={[styles.carouselDesc, { color: item.color.color }]}>{item.desc}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

export default function HomePage() {
  const navigation = useNavigation();
  const { t } = useTranslation("homePage");
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [MapSelected, setMapSelected] = useState(false);

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
      const lat = 48.784273577503534;
      const lon = 2.2949140808995425;

      const map = L.map('map').setView([lat, lon], 17);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      L.marker([lat, lon])
        .addTo(map)
        .bindPopup("Cambyze Consulting<br>14 Avenue Jean Perrin, 92330 Sceaux")
        .openPopup();
    </script>
  </body>
</html>
`;



  const sendMail = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://your-api.com/sendMailToUser", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ to, subject, body }).toString(),
      });
      const data = await res.json();
      setResult(data.message);
    } catch (e) {
      setResult("Erreur lors de l'envoi.");
    }
    setLoading(false);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Hero Section */}
      <View style={styles.hero}>
        <Text style={styles.title}>{t("Entreprise_Name")}</Text>
        <Text style={styles.subtitle}>{t("subtitle")}</Text>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate("LoginRegister")}
        >
          <Text style={styles.primaryButtonText}>{t("Get_New_Account")}</Text>
        </TouchableOpacity>
      </View>

      {/* Address Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t("address.title")}</Text>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => setMapSelected(!MapSelected)}
        >
          <Text style={styles.secondaryButtonText}>{t("address.openMap")}</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.secondaryButtonText}> {MapSelected ? "Fermer la carte" : "Ouvrir la carte" } </Text>
      <Map isOpen={MapSelected} onClose={() => setMapSelected(false)} />
      <View style={styles.WebViewStyle}>
        <WebView source={{ html: leafletHTML }} style={{ height: screenHeight * 0.4 }} />
        {/* <WebView source={{ uri: 'https://reactnative.dev/' }} style={{ height: screenHeight * 0.5 }} />; */}
      </View>

      {/* Services Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t("cards.our_Services")}</Text>
        <View style={styles.serviceList}>
          <Text style={styles.serviceItem}>{t("cards.bank_account")}</Text>
          <Text style={styles.serviceItem}>{t("cards.Savings_Account")}</Text>
          <Text style={styles.serviceItem}>{t("cards.Monthtly_statement")}</Text>
        </View>
      </View>

      {/* Carousel Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t("carousel.what_new")}</Text>
        <Carousel />
      </View>

      {/* About Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t("abbout_us")}</Text>
        <Text style={styles.text}>{t("abbout_us_desc")}</Text>
      </View>

      {/* Email Form Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t("emailForm.title")}</Text>
        <TextInput
          style={styles.input}
          placeholder={t("emailForm.recipientPlaceholder")}
          placeholderTextColor={colors.textInputPlaceholder}
          value={to}
          onChangeText={setTo}
        />
        <TextInput
          style={styles.input}
          placeholder={t("emailForm.subjectPlaceholder")}
          placeholderTextColor={colors.textInputPlaceholder}
          value={subject}
          onChangeText={setSubject}
        />
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder={t("emailForm.messagePlaceholder")}
          placeholderTextColor={colors.textInputPlaceholder}
          multiline
          value={body}
          onChangeText={setBody}
        />
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={sendMail}
          disabled={loading}
        >
          <Text style={styles.primaryButtonText}>
            {loading ? t("emailForm.sendingStatus") : t("emailForm.sendButton")}
          </Text>
        </TouchableOpacity>
        {result && <Text style={styles.result}>{result}</Text>}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 16 },
  hero: { alignItems: "center", marginBottom: 30 },
  title: { fontSize: 28, fontWeight: "bold", color: colors.textPrimary },
  subtitle: { fontSize: 16, color: colors.textSecondary, marginVertical: 10 },
  section: { marginBottom: 30 },
  sectionTitle: { fontSize: 20, fontWeight: "bold", color: colors.textPrimary, marginBottom: 10 },
  text: { fontSize: 14, color: colors.textSecondary, lineHeight: 20 },
  serviceList: { marginTop: 10 },
  serviceItem: { fontSize: 16, color: colors.textPrimary, marginBottom: 5 },
  input: {
    borderWidth: 1,
    borderColor: colors.textInputBorder,
    backgroundColor: colors.textInputBackground,
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
    color: colors.textInputText,
  },
  textArea: { height: 80 },
  primaryButton: {
    backgroundColor: colors.buttonBackGround,
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  primaryButtonText: { color: colors.buttonText, fontWeight: "bold" },
  secondaryButton: {
    backgroundColor: colors.SecondaryButtonBackground,
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  secondaryButtonText: { color: colors.SecondaryButtonText, fontWeight: "bold" },
  result: { marginTop: 10, color: "green", textAlign: "center" },
  carousel: {
    flexDirection: "row",
    marginVertical: 20,
    paddingHorizontal: 0,

  },
  carouselItem: {
    width: 220,
    padding: 20,
    marginHorizontal: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    alignItems: "center",
  },
  carouselTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 5,
  },
  carouselDesc: {
    fontSize: 14,
    textAlign: "center",
  },
  WebViewStyle: {
    flex: 1,
  }
});