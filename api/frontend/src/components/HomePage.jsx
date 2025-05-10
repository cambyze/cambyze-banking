import React, { useState } from "react";
import logo from "../assets/cambyze_icon.png";

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
              <li><a href="#account" className="hover:underline">Account</a></li>
            </ul>
          </nav>
        </div>
      </header>

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

      {/* Footer */}
      <footer className="bg-[#8EB4E3] text-white">
        <div className="container mx-auto px-6 py-6 text-center">
          &copy; {new Date().getFullYear()} Cambyze. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
