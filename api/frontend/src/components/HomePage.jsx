import React, { useState } from "react";
import logo from "../assets/cambyze_icon.png"; 

export default function HomePage() {
  const [status, setStatus] = useState("idle");

  // Function called when submiting the contact button
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    const form = e.target;
    const formData = new URLSearchParams(new FormData(form));

    try {
      const res = await fetch("/contact", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData.toString(),
      });
      if (res.ok) {
        setStatus("sent");
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
      {/* Header */}
      <header className="bg-[#8EB4E3] text-white shadow">
  <div className="container mx-auto px-6 py-4 flex justify-between items-center">
    <a href="/" className="flex items-center space-x-3">
      <img
        src={logo}
        alt="Cambyze Logo"
        className="h-16 md:h-20 object-contain"
      />
    </a>
    <nav>
      <ul className="flex space-x-8 text-sm font-medium">
        <li><a href="#services" className="hover:underline">Services</a></li>
        <li><a href="#about" className="hover:underline">About</a></li>
        <li><a href="#contact" className="hover:underline">Contact</a></li>
      </ul>
    </nav>
  </div>
</header>

      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center bg-gray-50 px-6 py-20">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-5xl font-bold mb-6 leading-tight">Transform Your Digital Presence</h2>
          <p className="text-lg text-gray-600 mb-8">
            We design and build modern web and mobile experiences that drive growth and engagement for your business.
          </p>
          <a
            href="#contact"
            className="inline-block px-8 py-3 bg-[#8EB4E3] text-white text-lg font-medium rounded-lg shadow hover:bg-blue-500 transition-colors"
          >
            Get Started
          </a>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="bg-white py-16">
        <div className="container mx-auto px-6">
          <h3 className="text-3xl font-semibold text-center mb-12">Our Services</h3>
          <div className="grid gap-8 grid-cols-1 md:grid-cols-3">
            <div className="p-6 border rounded-lg shadow hover:shadow-lg transition-shadow">
              <h4 className="text-xl font-semibold mb-3">Web Design</h4>
              <p className="text-gray-600">Custom responsive websites tailored to your brand and audience.</p>
            </div>
            <div className="p-6 border rounded-lg shadow hover:shadow-lg transition-shadow">
              <h4 className="text-xl font-semibold mb-3">Mobile Development</h4>
              <p className="text-gray-600">High-quality mobile apps for iOS and Android platforms.</p>
            </div>
            <div className="p-6 border rounded-lg shadow hover:shadow-lg transition-shadow">
              <h4 className="text-xl font-semibold mb-3">SEO & Analytics</h4>
              <p className="text-gray-600">Improve your visibility online and track your digital growth.</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="bg-gray-100 py-16">
        <div className="container mx-auto px-6 text-center">
          <h3 className="text-3xl font-semibold mb-6">About Us</h3>
          <p className="max-w-3xl mx-auto text-gray-700 leading-relaxed">
            Cambyze is a team of passionate developers and designers committed to delivering high-impact digital solutions. We work closely with our clients to bring ideas to life and drive business results.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="bg-white py-16">
        <div className="container mx-auto px-6">
          <h3 className="text-3xl font-semibold text-center mb-6">Contact Us</h3>
          {/* On submit calls the api which sends mail*/}
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
            <textarea name="message"
              placeholder="Your Message"
              rows="5"
              className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
            <button
              type="submit"
              className="w-full px-6 py-3 bg-[#8EB4E3] text-white text-lg font-medium rounded-lg shadow hover:bg-[#76a0c9] transition-colors"
              disabled={status === "sending"}
            >
              {status === "sending"
                ? "Sending…"
                : status === "sent"
                ? "Sent!"
                : "Send Message"}
            </button>
            {status === "error" && (
              <p className="text-red-600 text-center">
                Oops! Something went wrong.
              </p>
            )}
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#8EB4E3] text-white">
        <div className="container mx-auto px-6 py-6 text-center">
          &copy; {new Date().getFullYear()} Cambyze. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
