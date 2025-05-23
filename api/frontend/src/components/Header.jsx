import logo from "../assets/cambyze_icon.png";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../App";
import { useNavigate } from "react-router-dom";
import i18n from "../i18n";
import { useTranslation } from 'react-i18next';

export default function Header() {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [showLangs, setShowLangs] = useState(false);
    const { user, logout } = useContext(AuthContext);

    useEffect(() => {
      const userLang = navigator.language || navigator.userLanguage;
      const lang = userLang.split('-')[0];
      const supportedLanguages = ["en", "fr"];
      if (supportedLanguages.includes(lang)) {
        i18n.changeLanguage(lang);
      } else {
        i18n.changeLanguage("en");
      }
    }, []);


    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <header className="bg-white/80 backdrop-blur shadow-md transition-all duration-300">
            <div className="container mx-auto px-6 py-3 flex justify-between items-center">
                <a 
                    href="/" 
                    className="flex items-center space-x-3"
                    onClick={(e) => {
                        e.preventDefault();
                        navigate("/");
                    }}
                >
                    <img
                        src={logo}
                        alt="Cambyze Logo"
                        className="h-12 md:h-16 object-contain drop-shadow"
                    />
                </a>
                <nav>
                    <ul className="flex space-x-8 text-sm font-medium">
                        <li><a href="/#services" 
                                 className="inline-flex items-center px-4 py-1.5 rounded-full hover:underline transition">
                                {t('Header.Services')}
                            </a>
                        </li>
                        <li><a href="/#about" 
                              className="inline-flex items-center px-4 py-1.5 rounded-full hover:underline transition">
                                {t('Header.About')}
                            </a>
                        </li>
                        <li>
                          <div className="relative">
                            <button
                              className="flex items-center px-3 py-1.5 bg-white border border-gray-200 rounded-full shadow-sm text-sm font-semibold text-[#4A6FA5] hover:bg-gray-50 transition focus:outline-none"
                              onClick={() => setShowLangs((v) => !v)}
                              aria-haspopup="listbox"
                              aria-expanded={showLangs ? "true" : "false"}
                              type="button"
                            >
                              <span className="uppercase">{i18n.language}</span>
                              <svg className="ml-2 w-4 h-4 text-[#4A6FA5]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>
                            {showLangs && (
                              <ul
                                className="absolute right-0 mt-2 w-28 bg-white border border-gray-200 rounded-lg shadow-lg z-10"
                                role="listbox"
                              >
                                {["en", "fr"].filter(lng => lng !== i18n.language).map((lng) => (
                                  <li key={lng}>
                                    <button
                                      onClick={() => {
                                        i18n.changeLanguage(lng);
                                        setShowLangs(false);
                                      }}
                                      className="block w-full text-left px-4 py-2 text-sm text-[#4A6FA5] hover:bg-[#f0f4fa] rounded-lg transition"
                                      role="option"
                                    >
                                      {lng.toUpperCase()}
                                    </button>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        </li>
                        <li>
                            {user ? (
                                <div className="flex items-center space-x-4">
                                    <button 
                                        className="hover:underline text-[#4A6FA5] font-medium"
                                        onClick={() => navigate("/Account")}
                                    >
                                        {t('Header.account')}
                                    </button>
                                    <button
                                        className="text-xs px-3 py-1 rounded-full bg-[#f0f4fa] text-[#a54aa5] hover:bg-[#f7e3fc] transition-colors"
                                        onClick={handleLogout}
                                        title="Se déconnecter"
                                    >
                                        {t('Header.logout')}
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center space-x-4">
                                <button
                                    className="px-4 py-1.5 rounded-full bg-[#4A6FA5]/10 hover:bg-[#4A6FA5]/20 text-[#4A6FA5] font-medium transition-colors"
                                    onClick={() => navigate("/LoginRegiser")}
                                >
                                    {t('Header.login')}
                                </button>
                                <button
                                    className="px-4 py-1.5 rounded-full bg-[#4A6FA5]/10 hover:bg-[#4A6FA5]/20 text-[#4A6FA5] font-medium transition-colors"
                                    onClick={() => navigate("/LoginRegiser")}
                                >
                                    {t('Header.register')}
                                </button>
                                </div>
                            )}
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
}