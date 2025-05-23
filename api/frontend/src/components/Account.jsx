import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../App";
import { useNavigate } from "react-router-dom";
import i18n from "../i18n";
import { useTranslation } from 'react-i18next';

// Exemple de comptes (fallback si l'API ne répond pas)
const exampleAccounts = [
  {
    id: 1,
    type: "Banking",
    balance: 1520.75,
    overdraft: 500,
  },
  {
    id: 2,
    type: "Saving",
    balance: 3200.0,
    overdraft: 0,
  },
];

export default function Account() {
  const { user, logout } = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);
  const [userAccounts, setUserAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Rediriger vers la page d'accueil si non connecté
  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  // Récupérer les comptes bancaires de l'utilisateur
  useEffect(() => {
    if (user && user.personId) {
      fetchUserAccounts();
    }
  }, [user]);

  // Fonction pour récupérer les comptes de l'utilisateur
  const fetchUserAccounts = async () => {
    if (!user.personId) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/findBanByPerson?personId=${user.personId}`);
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Transforme les données reçues pour correspondre à notre format
      const formattedAccounts = Array.isArray(data) ? data.map(account => (
        console.log("1: ", account), {
        id: account.bankAccountNumber || `/!\``,
        type: account.accountType === "1" ? t("Account.Banking") : t("Account.Saving"),        
        balance: account.balanceAmount || 0,
        overdraft: account.overdraftAmount || 0,
      })) : [];
      
      setUserAccounts(formattedAccounts);
      setError(null);
    } catch (err) {
      console.error("Erreur lors de la récupération des comptes:", err);
      setError(t("Account.Set_Error_Loading_Account"));
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour créer un nouveau compte bancaire
  const createBankAccount = async (type) => {
    if (!user?.personId) {
      setError(t("Account.Set_Error_Missing_User_Id"));
      return;
    }
    
    try {
      const endpoint = type === "Saving" ? "/createSavingsAccount" : "/createBankAccount";
      
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ personId: user.personId }).toString()
      });
      
      if (!response.ok) {
        throw new Error(`Erreur: ${response.statusText}`);
      }
      
      // Après création réussie, rafraîchir la liste des comptes
      fetchUserAccounts();
      
    } catch (err) {
      console.error("Erreur lors de la création du compte:", err);
      setError(`Impossible de créer le compte ${type}. Veuillez réessayer.`, t('Account.Set_Error_Account_Creation', { type }));
    }
  };

  // Fonction pour gérer la déconnexion
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Si l'utilisateur n'est pas connecté et que la redirection n'a pas encore eu lieu
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center">
          <h2 className="text-2xl font-bold mb-2 text-[#4A6FA5]">{t("Account.Not_Connected_Title")}</h2>
          <p className="text-gray-600">{t("Account.Not_Connected_desc")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e3eafc] via-[#f5f8ff] to-[#c9d6f7] py-10 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header utilisateur */}
        <div className="bg-white/90 rounded-2xl shadow-xl p-8 border border-[#e3eafc] mb-8 flex flex-col items-center">
          <div className="flex flex-col items-center">
            <div className="text-2xl font-bold text-[#4A6FA5] mb-1">
              {user.firstName} {user.lastName}
            </div>
            <div className="text-gray-500 text-sm mb-2">{user.email}</div>
            {user.personId && (
              <div className="text-gray-400 text-xs mb-2">ID: {user.personId}</div>
            )}
            {/* <button 
              className="text-gray-400 hover:text-[#4A6FA5] text-sm"
              onClick={handleLogout}
            >
              {t("Account.Logout_Button")}
            </button> */}
          </div>
          <div className="mt-4 text-lg font-semibold text-gray-700">
            {t("Account.Welcome_desc")}
          </div>
          <div className="text-gray-500 text-sm">{t("Account.Manage_Your_Account")} </div>
        </div>

        {/* Message d'erreur */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold"> {t("Account.Error_Msg")} </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {/* Séparation discrète */}
        <div className="border-t border-[#e3eafc] mb-8"></div>

        {/* Titre pour les comptes réels */}
        <h2 className="text-xl font-bold text-[#4A6FA5] mb-4">{t("Account.Your_Account")} {user.personId ? `(ID: ${user.personId})` : ''}</h2>

        {/* Indicateur de chargement */}
        {loading && (
          <div className="flex justify-center my-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4A6FA5]"></div>
          </div>
        )}

        {/* Liste des comptes de l'utilisateur */}
        <div className="grid gap-6 md:grid-cols-2 mb-8">
          {userAccounts.length > 0 ? (
            userAccounts.map((account) => (
              console.log("2: ",account),
              <div
                key={account.id}
                className="bg-white rounded-xl shadow-xl p-6 border-2 border-[#8EB4E3]/60 flex flex-col transition-shadow hover:shadow-2xl"
              >
                <div className="flex items-center mb-2">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-[#8EB4E3]/20 text-[#4A6FA5] mr-2">
                    {account.type}
                  </span>
                  <span className="text-xs text-gray-500">#{account.id}</span>
                </div>
                <div className="text-3xl font-bold text-gray-800 mb-2">
                  {account.balance.toLocaleString("fr-FR", {
                    style: "currency",
                    currency: "EUR",
                  })}
                </div>
                {account.overdraft > 0 ? <div className="text-sm text-gray-500">
                  {t("Account.Overdraft_Allowed")}&nbsp;:{" "}
                  <span className="font-semibold text-[#4A6FA5]">
                    {account.overdraft.toLocaleString("fr-FR", {
                      style: "currency",
                      currency: "EUR",
                    })}
                  </span>
                </div> : null}
              </div>
            ))
          ) : !loading && (
            <div className="col-span-2 bg-white/80 p-6 rounded-xl shadow text-center">
              <p className="text-gray-500">{t("Account.No_Accounts")}</p>
            </div>
          )}
          
          {/* Card pour créer un nouveau compte */}
          <div
            className="bg-white rounded-xl shadow-lg p-6 border-2 border-dashed border-[#8EB4E3] flex flex-col items-center justify-center cursor-pointer hover:shadow-2xl hover:border-solid transition-all"
            title="Créer un nouveau compte"
            tabIndex={0}
            role="button"
            onClick={() => setShowModal(true)}
          >
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#e3eafc] mb-3">
              <span className="text-3xl text-[#4A6FA5] font-bold">+</span>
            </div>
            <div className="text-[#4A6FA5] font-semibold mb-1">{t("Account.New_Account")}</div>
            <div className="text-xs text-gray-500 text-center">{t("Account.Open_New_Account")}</div>
          </div>
        </div>
        
        {/* Titre pour les comptes d'exemple */}
        <h3 className="text-lg font-bold text-gray-500 mb-4">{t("Account.Create_New_Account")} </h3>
        
        {/* Liste des comptes d'exemple */}
        <div className="grid gap-6 md:grid-cols-2 opacity-60">
          {exampleAccounts.map((account) => (
            <div
              key={account.id}
              className="bg-white rounded-xl shadow p-6 border-2 border-[#8EB4E3]/30 flex flex-col"
            >
              <div className="flex items-center mb-2">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-[#8EB4E3]/20 text-[#4A6FA5] mr-2">
                  {account.type}
                </span>
                <span className="text-xs text-gray-400">(Exemple)</span>
              </div>
              <div className="text-3xl font-bold text-gray-600 mb-2">
                {account.balance.toLocaleString("fr-FR", {
                  style: "currency",
                  currency: "EUR",
                })}
              </div>
              <div className="text-sm text-gray-500">
                Découvert autorisé&nbsp;:{" "}
                <span className="font-semibold text-[#4A6FA5]">
                  {account.overdraft.toLocaleString("fr-FR", {
                    style: "currency",
                    currency: "EUR",
                  })}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal minimaliste */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-xs flex flex-col items-center">
            <h3 className="text-xl font-bold text-[#4A6FA5] mb-6"> {t('Account.Create_New_Account')} Créer un nouveau compte</h3>
            <button
              className="w-full mb-3 py-2 rounded-lg bg-[#e3eafc] text-[#4A6FA5] font-semibold hover:bg-[#d0dbf7] transition"
              onClick={() => {
                setShowModal(false);
                createBankAccount("Saving");
              }}
            >
              {t("Account.Saving_Account")}
            </button>
            {/* <button
              className="w-full mb-3 py-2 rounded-lg bg-[#e3eafc] text-[#4A6FA5] font-semibold hover:bg-[#d0dbf7] transition"
              onClick={() => {
                setShowModal(false);
                createBankAccount("Banking");
              }}
            >
              {t("Account.Checking_Account")}
            </button> */}
            <button
              className="mt-2 text-gray-400 hover:text-[#4A6FA5] text-sm"
              onClick={() => setShowModal(false)}
            >
              {t("Account.Cancel")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}