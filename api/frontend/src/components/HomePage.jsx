import React, { useState } from "react";
import logo from "../assets/cambyze_icon.png";


function Carousel() {
  const items = [
    { 
      title: "Disponibilité", 
      desc: "Nous sommes disponibles du lundi au samedi de 8h à 20h.",
      color: "bg-blue-100 text-blue-600",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    { 
      title: "Nouveau service", 
      desc: "Découvrez notre application mobile améliorée.",
      color: "bg-green-100 text-green-600",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <rect width="16" height="20" x="4" y="2" rx="4" />
          <path d="M8 6h8M8 10h8M8 14h8" />
        </svg>
      )
    },
    { 
      title: "Support client", 
      desc: "Support client réactif et personnalisé.",
      color: "bg-yellow-100 text-yellow-600",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636a9 9 0 11-12.728 0M12 3v9l4 2" />
        </svg>
      )
    },
    { 
      title: "Sécurité", 
      desc: "Vos données sont protégées avec les dernières technologies.",
      color: "bg-purple-100 text-purple-600",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 11c1.104 0 2-.896 2-2V7a2 2 0 10-4 0v2c0 1.104.896 2 2 2zm6 2v5a2 2 0 01-2 2H8a2 2 0 01-2-2v-5a6 6 0 1112 0z" />
        </svg>
      )
    },
    { 
      title: "Offre spéciale", 
      desc: "Ouvrez un compte et bénéficiez d’un bonus de bienvenue !",
      color: "bg-pink-100 text-pink-600",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 1.343-3 3 0 2.25 3 5 3 5s3-2.75 3-5c0-1.657-1.343-3-3-3z" />
        </svg>
      )
    }
  ];

  // Responsive: 1 card on mobile, 2 on md, 3 on lg+
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
            style={{ borderTop: `4px solid` }}
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
  const [status, setStatus] = useState("idle");

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
          <h2 className="text-5xl font-bold mb-6 leading-tight">CAMBYZE BANKING</h2>
          <p className="text-lg text-gray-600 mb-8">
            Join our bank.
          </p>
          <a
            href="#account"
            className="inline-block px-8 py-3 bg-[#8EB4E3] text-white text-lg font-medium rounded-lg shadow hover:bg-blue-500 transition-colors"
          >
            Get a new bank account
          </a>
        </div>
      </section>
      {/* OpenStreetMap  Button*/}






      {/* Services Section */}
      <section id="services" className="bg-white py-16">
        <div className="container mx-auto px-6">
          <h3 className="text-3xl font-semibold text-center mb-12">Our Services</h3>
          <div className="grid gap-8 grid-cols-1 md:grid-cols-3">
            <div className="p-6 border rounded-lg shadow hover:shadow-lg transition-shadow">
              <h4 className="text-xl font-semibold mb-3">Bank account</h4>
              <p className="text-gray-600">Perform deposits and withdraws</p>
              <p className="text-gray-600">Ask for an overdraft</p>
            </div>
            <div className="p-6 border rounded-lg shadow hover:shadow-lg transition-shadow">
              <h4 className="text-xl font-semibold mb-3">Saving account</h4>
              <p className="text-gray-600">save your money</p>
            </div>
            <div className="p-6 border rounded-lg shadow hover:shadow-lg transition-shadow">
              <h4 className="text-xl font-semibold mb-3">Monthly statement</h4>
              <p className="text-gray-600">Check your monthly operations</p>
            </div>
          </div>
        </div>
      </section>
      {/* Carrousel Section */}
      <section className="bg-[#f5f8fc] py-16">
        <div className="container mx-auto px-6">
          <h3 className="text-3xl font-semibold text-center mb-10">What's New?</h3>
          <Carousel />
        </div>
      </section>
      {/* About Section */}
      <section id="about" className="bg-gray-100 py-16">
        <div className="container mx-auto px-6 text-center">
          <h3 className="text-3xl font-semibold mb-6">About Us</h3>
          <p className="max-w-3xl mx-auto text-gray-700 leading-relaxed">
            Cambyze Bank is here to support you in your projects.
          </p>
        </div>
      </section>

      {/* Bank account creation Section */}
      <section id="account" className="bg-white py-16">
        <div className="container mx-auto px-6">
          <h3 className="text-3xl font-semibold text-center mb-6">Create your bank account</h3>
          {/* On submit calls the api which create*/}
          <form onSubmit={handleSubmit} className="max-w-xl mx-auto grid gap-6">
            <input name="name"
              type="text"
              placeholder="Your Name"
              className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input name="email"
              type="email"
              placeholder="Your Email"
              className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="w-full px-6 py-3 bg-[#8EB4E3] text-white text-lg font-medium rounded-lg shadow hover:bg-[#76a0c9] transition-colors"
              disabled={status === "creating"}
            >
              {status === "creating"
                ? "Creating…"
                : status === "Bank account created"
                  ? "Bank account created"
                  : "Create account"}
            </button>
            {status === "error" && (
              <p className="text-red-600 text-center">
                Oops! Something went wrong.
              </p>
            )}
          </form>
        </div>
      </section>

    </div>
  );
}
