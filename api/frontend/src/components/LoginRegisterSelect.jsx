import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../App";
import i18n from "../i18n";
import { useTranslation } from 'react-i18next';

export default function LoginRegisterSelect() {
    const [selected, setSelected] = useState("register");
    const [status, setStatus] = useState("idle");
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const { t } = useTranslation();


    const handleSubmitLogin = async (e) => {
      e.preventDefault();
      setStatus("authenticating");
      const form = e.target;
      const formData = new FormData(form);
      const email = formData.get("email");
      
      try {
        const res = await fetch("/login2", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({ mail: email }).toString(),
        });
        console.log(res);
        if (res.ok === true) {
          const success = await res.json();
          if (success) {
            const userData = {
              mail: success.mail,
              firstName: success.firstName,
              lastName: success.lastName, 
              personId: success.personId,
            };
            
            login(userData);
            setStatus("authenticated");
            form.reset();
            navigate("/Account");
          } else  {
            console.error("Échec de la connexion");
            throw new Error("Email non reconnu");
          }
        } else {
          throw new Error(await res.text());
        }
      } catch (err) {
        console.error("LogIn erro ", err);
        setStatus("error");
      }
    };

    const handleSubmitRegister = async (e) => {
      e.preventDefault();
      setStatus("registering");
      const form = e.target;
      const formData = new FormData(form);
      const firstName = formData.get("Name"); 
      const lastName = formData.get("FamilyName"); 
      const email = formData.get("email");
      const password = formData.get("password"); 
        
      try {
        const res = await fetch("/createPerson", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({ 
            firstName: firstName, 
            name: lastName,
            mail: email 
          }).toString(),
        });
        
        if (res.ok) {
          const personId = await res.text();
          if (personId) {
            const userData = {
              email: email,
              firstName: firstName,
              lastName: lastName,
              personId: personId 
            };
            
            login(userData);
            setStatus("registered");
            form.reset();
            navigate("/Account");
          } else {
            throw new Error("Échec de la création du compte");
          }
        } else {
          throw new Error(await res.text());
        }
      } catch (err) {
        console.error(err);
        setStatus("error");
      }
    };

    // Définir les couleurs selon le bouton sélectionné
    const bgGradient =
        selected === "login"
            ?  "from-[#f7e3fc] via-[#f8f5ff] to-[#e3c9f7]"
            : "from-[#e3eafc] via-[#f5f8ff] to-[#c9d6f7]";


    // detect the language of the browser 

    return (
        <div className={`min-h-screen flex flex-col bg-gradient-to-br ${bgGradient} text-gray-800 font-sans transition-colors duration-500`}>
            {/* Section principale */}
            <section className="flex-1 flex items-center justify-center px-4 py-12">
                <div className="text-center max-w-xl mx-auto bg-white/90 rounded-2xl shadow-xl p-8 border border-[#e3eafc]">
                    <h2 className="text-3xl md:text-4xl font-extrabold mb-4 leading-tight text-[#4A6FA5] drop-shadow">{t('Aplication.Entreprise_Name')}</h2>
                    <p className="text-base md:text-lg text-gray-600 mb-8">
                        {selected === "login"
                            ?  t('LoginRegister.Login_Title')
                            : t('LoginRegister.Register_Title')}
                    </p>

                    {/* Boutons de sélection */}
                    <div className="flex flex-row justify-center gap-2 mb-6">
                        <button
                            type="button"
                            onClick={() => setSelected("register")}
                            className={`px-4 py-1.5 text-xs font-semibold rounded-full border shadow-sm transition-all duration-200 focus:outline-none
                                ${selected === "register"
                                    ? "bg-[#4A6FA5] text-white border-[#4A6FA5] shadow-lg"
                                    : "bg-white text-[#4A6FA5] border-[#4A6FA5] hover:bg-[#f0f4fa]"}
                            `}
                        >
                            {t('LoginRegister.Register_Button')}
                        </button>
                        <button
                            type="button"
                            onClick={() => setSelected("login")}
                            className={`px-4 py-1.5 text-xs font-semibold rounded-full border shadow-sm transition-all duration-200 focus:outline-none
                                ${selected === "login"
                                    ? "bg-[#a54aa5] text-white border-[#a54aa5] shadow-lg"
                                    : "bg-white text-[#a54aa5] border-[#a54aa5] hover:bg-[#f8f0fa]"}
                            `}
                        >
                            {t('LoginRegister.Login_Button')}
                        </button>
                    </div>

                    {/* Formulaire selon le bouton sélectionné */}
                    {selected === "login" ? (
                        <form className="space-y-4 animate-fade-in" onSubmit={handleSubmitLogin}>
                            <input
                                type="email"
                                name="email"
                                placeholder={t('LoginRegister.Login_Form_Email')}
                                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#a54aa5] outline-none text-sm"
                                autoComplete="username"
                                required
                            />
                            <input
                                type="password"
                                name="password"
                                placeholder={t('LoginRegister.Login_Form_Email')}
                                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#a54aa5] outline-none text-sm"
                                //className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#4A6FA5] outline-none text-sm"
                                autoComplete="current-password"
                                required
                            />
                            <button
                                type="submit"
                                disabled={status === "authenticating"}
                                className={`w-full py-2 rounded-lg ${
                                    status === "authenticating" 
                                        ? "bg-gray-400" 
                                        : "bg-[#a54aa5] hover:bg-[#7c368c]"
                                } text-white font-semibold text-sm shadow transition`}
                            >
                                {status === "authenticating" ? t('LoginRegister.Login_Form_Button_Status_pending') : t('LoginRegister.Login_Form_Button_Status_Connecting')}
                            </button>
                            {status === "error" && (
                                <p className="text-red-500 text-sm text-center">
                                    {t('LoginRegister.Connection_Failed')}
                                </p>
                            )}
                        </form>
                    ) : (
                        <form className="space-y-4 animate-fade-in" onSubmit={handleSubmitRegister}>
                            <input
                                type="text"
                                name="FamilyName"
                                placeholder={t('LoginRegister.Register_Form_Family_Name')}
                                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#4A6FA5] outline-none text-sm"
                                autoComplete="family-name"
                                required
                            />
                            <input
                                type="text"
                                name="Name"
                                placeholder={t('LoginRegister.Register_Form_First_Name')}
                                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#4A6FA5] outline-none text-sm"
                                autoComplete="given-name"
                                required
                            />
                            <input
                                type="email"
                                name="email"
                                placeholder={t('LoginRegister.Register_Form_Email')}
                                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#4A6FA5] outline-none text-sm"
                                autoComplete="username"
                                required
                            />
                            <input
                                type="password"
                                name="password"
                                placeholder={t('LoginRegister.Register_Form_Password')}
                                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#4A6FA5] outline-none text-sm"
                                autoComplete="new-password"
                                required
                            />
                            <button
                                type="submit"
                                disabled={status === "registering"}
                                className={`w-full py-2 rounded-lg ${
                                    status === "registering" 
                                        ? "bg-gray-400" 
                                        : "bg-[#4A6FA5] hover:bg-[#365a8c]"
                                } text-white font-semibold text-sm shadow transition`}
                            >
                                {status === "registering" ? t('LoginRegister.Register_Form_Button_Status_pending') : t('LoginRegister.Register_Form_Button_Status_Connecting')}
                            </button>
                            {status === "error" && (
                                <p className="text-red-500 text-sm text-center">
                                    {t('LoginRegister.Inscription_Failed')}
                                </p>
                            )}
                        </form>
                    )}
                    <div className="text-xs text-gray-500 mt-6">
                        <p>
                            {t('LoginRegister.Condition_Of_Use.prefix')}&nbsp;
                            <a href="#" className="text-[#4A6FA5] hover:underline">{t('LoginRegister.Condition_Of_Use.terms')}</a> {t('LoginRegister.Condition_Of_Use.and')}&nbsp;
                            <a href="#" className="text-[#4A6FA5] hover:underline">{t('LoginRegister.Condition_Of_Use.privacy')}</a>.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
