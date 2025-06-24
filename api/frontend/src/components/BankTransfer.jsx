import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../App';
import { data, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';


export default function BankTransfer() {
    const { user } = useContext(AuthContext);
    const { t } = useTranslation();
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [Status, setStatus] = useState('personal');
    const [emitterId, setEmitterId] = useState('');
    const [receiverId, setReceiverId] = useState('');
    const [amount, setAmount] = useState('');
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
          type: account.accountType === '1' ? t('Account.Banking') : t('Account.Saving'),
          balance: account.balanceAmount || 0,
          overdraft: account.overdraftAmount || 0,
      }))
    : [];
            setAccounts(formattedAccounts);
            setError(null);
        } catch (err) {
            console.error('Error fetching accounts:', err);
            setError(t('Account.Set_Error_Loading_Account'));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        console.log("fetchAccounts called");
        fetchAccounts();
    }, [user?.personId]);


    const handleBankTransfer = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/BankTransfer', {
                method: 'POST',
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams({ amount: amount, SendAccount: emitterId, ReceiveAccount: receiverId }).toString()
            });
                if (!response.ok) {
                    throw new Error(`HTTP Error: ${response.status}`);
            }
            alert(t('Account.Transfer_Success'));
            navigate('/Account');
            const result = await response.text();
            if (!response.ok || result.startsWith("Error")) {
                alert(result || t('Account.Transfer_Error'));
                setError(result || t('Account.Set_Error_Loading_Account'));
            } else {
                alert(result || t('Account.Transfer_Success'));
                navigate('/Account');
            }
        } catch (error) {
            console.error('Error during bank transfer:', error);
            alert(t('Account.Transfer_Error'));
            setError(t('Account.Set_Error_Loading_Account'));
        }
    }

    function handlePersonalTransfer() {
        return (
            <form
                className="bg-white shadow-md rounded-xl p-8 mt-8 max-w-md mx-auto"
                onSubmit={e => { e.preventDefault(); setStatus('idle'); }}
            >
                <h3 className="text-2xl font-bold mb-6 text-gray-800">Virement interne</h3>
                <label className="block mb-1 text-gray-500 text-sm">Compte émetteur</label>
                <select
                    className="w-full p-3 border border-gray-200 rounded-lg mb-5 focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
                    value={emitterId}
                    onChange={e => {
                        setEmitterId(e.target.value);
                        if (e.target.value === receiverId) setEmitterId('');
                    }}
                >
                    <option value="">Sélectionner le compte émetteur</option>
                    {accounts.map(account => (
                        <option key={account.id} value={account.id} name='emitterId'>
                            {account.type} - {account.accountNumber} - {account.balance} €
                        </option>
                    ))}
                </select>
                <label className="block mb-1 text-gray-500 text-sm">Compte bénéficiaire</label>
                <select
                    className="w-full p-3 border border-gray-200 rounded-lg mb-5 focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
                    name='receiverId'
                    value={receiverId}
                    onChange={e => setReceiverId(e.target.value)}
                    disabled={!emitterId}
                >
                    <option value="">Sélectionner le compte bénéficiaire</option>
                    {accounts
                        .filter(account => account.id !== emitterId)
                        .map(account => (
                            <option key={account.id} value={account.id}>
                                {account.type} - {account.accountNumber}  - {account.balance} €
                            </option>
                        ))}
                </select>
                <label className="block mb-1 text-gray-500 text-sm">Montant</label>
                <input
                    type="number"
                    name='amount'
                    className="w-full p-3 border border-gray-200 rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
                    onChange={e => setAmount(e.target.value)}
                />
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                    onClick={handleBankTransfer}
                    disabled={!emitterId || !receiverId}
                >
                    Effectuer le virement
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
                <h3 className="text-2xl font-bold mb-6 text-gray-800">Virement externe</h3>
                <label className="block mb-1 text-gray-500 text-sm">Nom du bénéficiaire</label>
                <input
                    type="text"
                    className="w-full p-3 border border-gray-200 rounded-lg mb-5 focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
                    name='emitterId'
                    onChange={e => setEmitterId(e.target.value)}
                />
                <label className="block mb-1 text-gray-500 text-sm">Compte émetteur</label>
                <select className="w-full p-3 border border-gray-200 rounded-lg mb-5 focus:outline-none focus:ring-2 focus:ring-blue-200 transition">
                    <option value="">Sélectionner le compte émetteur</option>
                    {accounts.map(account => (
                        <option key={account.id} value={account.id}>
                            {account.type} - {account.accountNumber} - {account.balance} €
                        </option>
                    ))}
                </select>
                <label className="block mb-1 text-gray-500 text-sm">IBAN</label>
                <input
                    name='receiverId'
                    type="text"
                    onChange={e => setAmount(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-lg mb-5 focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
                />
                <label className="block mb-1 text-gray-500 text-sm">Montant</label>
                <input
                    name='amount'
                    type="number"
                    className="w-full p-3 border border-gray-200 rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
                />
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                    onClick={handleBankTransfer}
                >
                    Effectuer le virement
                </button>
            </form>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-10">
            <div className="max-w-xl mx-auto flex flex-col items-center">
                <h2 className="text-3xl font-bold mb-8 text-gray-800">Effectuer un virement bancaire</h2>
                <div className="flex gap-4 mb-8">
                    <button
                        className={`px-6 py-3 rounded-lg font-semibold transition ${
                            Status === 'personal'
                                ? 'bg-blue-600 text-white'
                                : 'bg-white border border-blue-600 text-blue-600 hover:bg-blue-50'
                        }`}
                        onClick={() => setStatus('personal')}
                    >
                        Vers un compte personnel 1
                    </button>
                    <button
                        className={`px-6 py-3 rounded-lg font-semibold transition ${
                            Status === 'external'
                                ? 'bg-blue-600 text-white'
                                : 'bg-white border border-blue-600 text-blue-600 hover:bg-blue-50'
                        }`}
                        onClick={() => setStatus('external')}
                    >
                        Vers un compte externe
                    </button>
                </div>
                {Status === 'external' && handleExternalTransfer()}
                {Status === 'personal' && handlePersonalTransfer()}
            </div>
        </div>
    );
}