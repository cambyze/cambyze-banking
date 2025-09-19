import { AuthContext } from "../App";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { useNavigate } from "react-router-dom";

export default function TestServices() {
    const { user } = useContext(AuthContext);
   // Fonction pour gérer le virement bancaire (externe)
   const handleBankTransfer = (e) => {
       if (e) e.preventDefault();
       // Ajoutez ici la logique pour effectuer le virement bancaire
       // Par exemple, un appel API ou une mise à jour d'état
       alert('Fonction de virement bancaire appelée. À implémenter.');
   };
   const { t } = useTranslation();
   const [accounts, setAccounts] = useState([]);
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState(null);
   const [Status, setStatus] = useState('personal');
   const [emitterId, setEmitterId] = useState('');
   const [receiverId, setReceiverId] = useState('');
   const [amount, setAmount] = useState('');
   const [newOverdraftAmount, setNewOverdraftAmount] = useState('');
   const navigate = useNavigate();

   const fetchAccounts = async () => {
          if (!user?.personId) return;
          console.log("fetchAccounts called for personId:", user.personId);
          setLoading(true);
          try {
              const response = await fetch(`/findBanByPerson?personId=${user.personId}`);
              if (!response.ok) {
                  console.error(`HTTP Error: ${response.status} - ${response.statusText}`);
                  throw new Error(`HTTP Error: ${response.status}`);
              }
              const data = await response.json();
              console.log("Fetched accounts:", data);
             const formattedAccounts = Array.isArray(data)
      ? data.map(account => ({
            id: account.bankAccountNumber || 'N/A',
            bankName: 'Cambyze Bank',
            accountNumber: account.bankAccountNumber || 'N/A',
            type: account.accountType === '1' ? t('BankTransfer.Banking') : t('BankTransfer.Saving'),
            balance: account.balanceAmount || 0,
            overdraft: account.overdraftAmount || 0,
        }))
      : [];
              setAccounts(formattedAccounts);
              setError(null);
          } catch (err) {
              console.error('Error fetching accounts:', err);
              setError(t('BankTransfer.Set_Error_Loading_Account'));
          } finally {
              setLoading(false);
          }
      };

    const handleUpdateOverdraft  = async ( bankAccountNumber,  newOverdraftAmount) => {
        console.log("handleUpdateOverdraft called with:", bankAccountNumber, newOverdraftAmount);
        if (!bankAccountNumber || !newOverdraftAmount) return;

        try {
            const response = await fetch(`/updateOverdraftAmount`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: new URLSearchParams({ 
                    ban : bankAccountNumber, 
                    newOverdraftAmount: newOverdraftAmount
                }).toString(),
            });
            console.log("Update overdraft response:", response);
            if (!response.ok) {
                throw new Error('Failed to update overdraft');
            }
        } catch (err) {
            console.error('Error updating overdraft:', err);
            alert('Erreur lors de la mise à jour du découvert.');
        return;
      }
      console.log("handleUpdateOverdraft completed");
      alert('Découvert mis à jour avec succès.');
    };

      useEffect(() => {
          console.log("fetchAccounts called");
          fetchAccounts();
      }, [user?.personId]);

      function OverdraftUpdate () {
        return (
            <form className="bg-white shadow-md rounded-xl p-8 mt-8 max-w-md mx-auto" onSubmit={e => { e.preventDefault(); setStatus('idle'); }} >
                <h3 className="text-2xl font-bold mb-6 text-gray-800">{t('BankTransfer.Update_Overdraft')}</h3>
                <label className="block mb-1 text-gray-500 text-sm">{t('BankTransfer.Select_Account')}</label>
                <select className="w-full p-3 border border-gray-200 rounded-lg mb-5 focus:outline-none focus:ring-2 focus:ring-blue-200 transition" onChange={e => setEmitterId(e.target.value)}>
                    <option value="">{t('BankTransfer.Select_Account')}</option>
                    {accounts.map(account => (
                        <option key={account.id} value={account.id}>
                            {account.type} - {account.accountNumber} - {account.balance} €
                        </option>
                    ))}
                </select>
                <label className="block mb-1 text-gray-500 text-sm">{t('BankTransfer.New_Overdraft_Amount')}</label>
                <input
                    name='newOverdraftAmount'
                    type="number"
                    value={newOverdraftAmount}
                    onChange={e => setNewOverdraftAmount(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
                />
                {/* {!emitterId || !newOverdraftAmount ? <p>enable</p>:<p>disable</p>} */}
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                    onClick={() => handleUpdateOverdraft(emitterId, newOverdraftAmount)}
                    // disabled={!emitterId || !newOverdraftAmount}
                >
                  {t('BankTransfer.Update_Overdraft_Button')}
                </button>
            </form>
        );
      }

      function handleExternalTransfer() {
        return ( 
            <form
                className="bg-white shadow-md rounded-xl p-8 mt-8 max-w-md mx-auto"
                
                onSubmit={e => { e.preventDefault(); setStatus('idle'); }}
            >
                <h3 className="text-2xl font-bold mb-6 text-gray-800">{t('BankTransfer.External_Transfer')}</h3>
                <label className="block mb-1 text-gray-500 text-sm">{t('BankTransfer.Beneficiary_Name')}</label>
  
                <label className="block mb-1 text-gray-500 text-sm">{t('BankTransfer.Emitter_Account')}</label>
                <select className="w-full p-3 border border-gray-200 rounded-lg mb-5 focus:outline-none focus:ring-2 focus:ring-blue-200 transition">
                    <option value="">{t('BankTransfer.Select_Emitter_Account')}</option>
                    {accounts.map(account => (
                        <option key={account.id} value={account.id}>
                            {account.type} - {account.accountNumber} - {account.balance} €
                        </option>
                    ))}
                </select>
                <input
                    type="text"
                    className="w-full p-3 border border-gray-200 rounded-lg mb-5 focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
                    name='emitterId'
                    onChange={e => setEmitterId(e.target.value)}
                />
                <label className="block mb-1 text-gray-500 text-sm">{t('BankTransfer.Amount')}</label>
                <input
                    name='amount'
                    type="number"
                    className="w-full p-3 border border-gray-200 rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
                    onChange={e => setAmount(e.target.value)}
                />
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                    onClick={handleBankTransfer}
                    disabled={!emitterId || !receiverId}
                >
                  {t('BankTransfer.Perform_Transfer')}
                </button>
            </form>
        );
    }


    function handleAddMoney() {
        return ( 
            <form
                className="bg-white shadow-md rounded-xl p-8 mt-8 max-w-md mx-auto"
                
                onSubmit={e => { e.preventDefault(); setStatus('idle'); }}
            >
                <h3 className="text-2xl font-bold mb-6 text-gray-800">{t('BankTransfer.Add_Money')}</h3>
                <label className="block mb-1 text-gray-500 text-sm">{t('BankTransfer.Emitter_Account')}</label>
                <select className="w-full p-3 border border-gray-200 rounded-lg mb-5 focus:outline-none focus:ring-2 focus:ring-blue-200 transition">
                    <option value="">{t('BankTransfer.Select_Emitter_Account')}</option>
                    {accounts.map(account => (
                        <option key={account.id} value={account.id}>
                            {account.type} - {account.accountNumber} - {account.balance} €
                        </option>
                    ))}
                </select>
                <label className="block mb-1 text-gray-500 text-sm">{t('BankTransfer.Amount')}</label>
                <input
                    name='amount'
                    type="number"
                    className="w-full p-3 border border-gray-200 rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
                    onChange={e => setAmount(e.target.value)}
                />
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                    onClick={handleBankTransfer}
                    disabled={!emitterId || !receiverId}
                >
                  {t('BankTransfer.Perform_Transfer')}
                </button>
            </form>
        );
    }




  
  
  return (
    <div>
      <h1>Test Services Page</h1>
      <p>This is a placeholder for the Test Services component.</p>
      <p>Test Achat</p>



      <p>Test Ajout money</p>
      {/* <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          onClick={handleBankTransfer}
          disabled={!emitterId || !receiverId}
      >
        {t('BankTransfer.Perform_Transfer')}
      </button> */}

        {/* <handleExternalTransfer /> */}
        {handleAddMoney()}

      <p>Test Virement (ajout de money)</p>
        {handleExternalTransfer()}
        <p>Test Update Overdraft</p>
        {OverdraftUpdate()}
         
    </div>
  );
}// src/components/TestServices.jsx