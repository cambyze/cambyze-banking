import React, { useState } from "react";
import logo from "../assets/cambyze_icon.png";
import AddressModal from "./OpenStreetMap.jsx";
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useNavigate } from "react-router-dom";
import i18n from "../i18n";
import { useTranslation } from 'react-i18next';

function Carousel() {
  const { t } = useTranslation();
  const items = [
    { 
      title: t('HomePage.carousel.availability_Title'), 
      desc: t('HomePage.carousel.availability_Desc'),
      color: "bg-blue-100 text-blue-600",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    { 
      title: t('HomePage.carousel.newService_Title'), 
      desc: t('HomePage.carousel.newService_Desc'),
      color: "bg-green-100 text-green-600",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <rect width="16" height="20" x="4" y="2" rx="4" />
          <path d="M8 6h8M8 10h8M8 14h8" />
        </svg>
      )
    },
    { 
      title: t('HomePage.carousel.support_Title'), 
      desc: t('HomePage.carousel.support_Desc'),
      color: "bg-yellow-100 text-yellow-600",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636a9 9 0 11-12.728 0M12 3v9l4 2" />
        </svg>
      )
    },
    { 
      title: t('HomePage.carousel.security_Title'), 
      desc: t('HomePage.carousel.security_Desc'),
      color: "bg-purple-100 text-purple-600",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 11c1.104 0 2-.896 2-2V7a2 2 0 10-4 0v2c0 1.104.896 2 2 2zm6 2v5a2 2 0 01-2 2H8a2 2 0 01-2-2v-5a6 6 0 1112 0z" />
        </svg>
      )
    },
    { 
      title: t('HomePage.carousel.special_Offer_Title'), 
      desc: t('HomePage.carousel.special_Offer_Desc'),
      color: "bg-pink-100 text-pink-600",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 1.343-3 3 0 2.25 3 5 3 5s3-2.75 3-5c0-1.657-1.343-3-3-3z" />
        </svg>
      )
    }
  ];

  const [start, setStart] = React.useState(0);
  const [cardsToShow, setCardsToShow] = React.useState(1);

  React.useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 1024) setCardsToShow(3);
      else if (window.innerWidth >= 768) setCardsToShow(2);
      else setCardsToShow(1);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const canPrev = start > 0;
  const canNext = start + cardsToShow < items.length;

  return (
    <div className="relative flex items-center">
      <button
        onClick={() => setStart(start - 1)}
        disabled={!canPrev}
        className={`absolute left-0 z-10 bg-white border rounded-full shadow p-2 transition hover:bg-blue-100 disabled:opacity-30 disabled:cursor-not-allowed`}
        style={{ top: "50%", transform: "translateY(-50%)" }}
        aria-label="Précédent"
      >
        <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <div className="flex gap-6 mx-10 w-full justify-center">
        {items.slice(start, start + cardsToShow).map((item, idx) => (
          <div
            key={item.title}
            className={`min-w-[260px] max-w-xs border rounded-2xl shadow-sm p-6 flex flex-col items-start relative bg-white hover:shadow-lg transition-shadow duration-200`}
            style={{ borderBottom: `1px solid` }}
          >
            <div className={`rounded-full p-3 mb-4 ${item.color} flex items-center justify-center`}>
              {item.icon}
            </div>
            <span className="absolute top-4 right-4 bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full shadow-sm">New</span>
            <h4 className="text-lg font-semibold mb-2">{item.title}</h4>
            <p className="text-gray-600 text-sm">{item.desc}</p>
          </div>
        ))}
      </div>
      <button
        onClick={() => setStart(start + 1)}
        disabled={!canNext}
        className={`absolute right-0 z-10 bg-white border rounded-full shadow p-2 transition hover:bg-blue-100 disabled:opacity-30 disabled:cursor-not-allowed`}
        style={{ top: "50%", transform: "translateY(-50%)" }}
        aria-label="Suivant"
      >
        <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}


export default function HomePage() {
  const { t } = useTranslation();
  const [status, setStatus] = useState("idle");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const navigate = useNavigate();
  
  const handleAddressSelected = (data) => {
    console.log("Selected Address:", data);
    setSelectedAddress(data);
    // Here you could send data to backend
  };

  // Function called when submiting the account creation button
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("creating");
    const form = e.target;
    const formData = new URLSearchParams(new FormData(form));

    try {
      const res = await fetch("/createBankAccount", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData.toString(),
      });
      if (res.ok) {
        setStatus("Bank account created");
        form.reset();
      } else {
        throw new Error(await res.text());
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-800 font-sans">
      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center bg-gray-50 px-6 py-20">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-5xl font-bold mb-6 leading-tight">{t('Aplication.Entreprise_Name')}</h2>
          <p className="text-lg text-gray-600 mb-8">
            Join our bank.
          </p>
          <button
            //className="hover:underline text-[#4A6FA5]"
            className="inline-block px-8 py-3 bg-[#8EB4E3] text-white text-lg font-medium rounded-lg shadow hover:bg-blue-500 transition-colors"
            onClick={() => navigate("/LoginRegiser")}
          >
            {t('HomePage.Get_New_Account')}
          </button>
        </div>
      </section>
        <div className="max-w-2xl mx-auto my-12 p-6 bg-gray-50 rounded-xl shadow-sm">
  <h3 className="text-xl font-semibold mb-4 text-center">Sélectionnez une adresse </h3>
  <div className="flex flex-col items-center gap-4">
    <button
      onClick={() => setModalOpen(true)}
      className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors"
    >
      Choisir une adresse sur la carte 
    </button>

    {selectedAddress && (
      <div className="w-full mt-6 bg-white rounded-lg shadow p-4 border">
        <h4 className="text-lg font-semibold text-gray-800 mb-2">Adresse sélectionnée :</h4>
        <p className="text-gray-600 mb-3">{selectedAddress.address}</p>
        <div className="flex items-center text-sm text-gray-500 gap-4">
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2"
              viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18m9-9H3" />
            </svg>
            <span>{selectedAddress.lat.toFixed(6)}</span>
          </div>
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2"
              viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h18" />
            </svg>
            <span>{selectedAddress.lon.toFixed(6)}</span>
          </div>
        </div>

        {/* Mini preview map */}
        <div className="mt-4 h-48 rounded overflow-hidden">
          <MapContainer
            key={`${selectedAddress.lat}-${selectedAddress.lon}`} // force un remount
            center={[selectedAddress.lat, selectedAddress.lon]}
            zoom={14}
            scrollWheelZoom={false}
            dragging={false}
            doubleClickZoom={false}
            zoomControl={false}
            className="w-full h-full z-0 pointer-events-none"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />
          <Marker position={[selectedAddress.lat, selectedAddress.lon]} />
          </MapContainer>
        </div>
      </div>
    )}

    <AddressModal
      isOpen={modalOpen}
      onRequestClose={() => setModalOpen(false)}
      onAddressSelected={handleAddressSelected}
    />
  </div>
</div>
      {/* Services Section */}
      <section id="services" className="bg-white py-16">
        <div className="container mx-auto px-6">
          <h3 className="text-3xl font-semibold text-center mb-12">{t('HomePage.cards.our_Services')}</h3>
          <div className="grid gap-8 grid-cols-1 md:grid-cols-3">
            <div className="p-6 border rounded-lg shadow hover:shadow-lg transition-shadow">
              <h4 className="text-xl font-semibold mb-3">{t('HomePage.cards.bank_account')}</h4>
              <p className="text-gray-600">{t('HomePage.cards.bank_account_desc')}</p>
              <p className="text-gray-600">{t('HomePage.cards.bank_account_desc_2')}</p>
            </div>
            <div className="p-6 border rounded-lg shadow hover:shadow-lg transition-shadow">
              <h4 className="text-xl font-semibold mb-3">{t('HomePage.cards.Savings_Account')}</h4>
              <p className="text-gray-600">{t('HomePage.cards.Savings_Account_desc')}</p>
            </div>
            <div className="p-6 border rounded-lg shadow hover:shadow-lg transition-shadow">
              <h4 className="text-xl font-semibold mb-3">{t('HomePage.cards.Monthtly_statement')}</h4>
              <p className="text-gray-600">{t('HomePage.cards.Monthtly_statement_desc')}</p>
            </div>
          </div>
        </div>
      </section>
      {/* Carrousel Section */}
      <section className="bg-[#f5f8fc] py-16">
        <div className="container mx-auto px-6">
          <h3 className="text-3xl font-semibold text-center mb-10">{t('HomePage.carousel.what_new')}</h3>
          <Carousel />
        </div>
      </section>
      {/* About Section */}
      <section id="about" className="bg-gray-100 py-16">
        <div className="container mx-auto px-6 text-center">
          <h3 className="text-3xl font-semibold mb-6">{t('HomePage.abbout_us')}</h3>
          <p className="max-w-3xl mx-auto text-gray-700 leading-relaxed">
            {t('HomePage.abbout_us_desc')}
          </p>
        </div>
      </section>
    </div>
  );
}
