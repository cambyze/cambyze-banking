import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthContext } from "../App";

export default function ResetPassword() {
    const [psw, setPsw] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [status, setStatus] = useState('idle');
    const {user} = useContext(AuthContext);
    
    const location = useLocation();
    const navigate = useNavigate();
    const { t } = useTranslation();

    console.log(user.mail, "mail from context in ResetPassword component");
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setError(t('RessetPsw.Passwords_Do_Not_Match'));
            return;
        }
        setStatus('submitting');
        setError('');
        setSuccess('');

        try {
            console.log(user.mail, "mail from context");
            const response = await fetch('/PswUpdate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({ mail: user.mail,  psw: psw, newPsw: newPassword }).toString(),
            });
            console.log(response, "response from server");
            if (response.ok) {
                setSuccess(t('RessetPsw.Password_Reset_Success'));
                navigate('/Login');
            } else {
                const data = await response.json();
                setError(data.message || t('RessetPsw.Password_Reset_Failed'));
            }
        } catch (err) {
            console.log( "network error See", err);
            setError(t('RessetPsw.Network_Error', err.message));
        } finally {
            setStatus('idle');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#e3eafc] via-[#f5f8ff] to-[#c9d6f7]">
            <div className="bg-white/90 rounded-2xl shadow-xl p-8 border border-[#e3eafc] max-w-md w-full">
                <h2 className="text-2xl font-bold mb-4 text-[#4A6FA5] text-center">
                    {t('RessetPsw.Reset_Password_Title')}
                </h2>
                
                {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
                {success && <p className="text-green-500 text-sm text-center mb-4">{success}</p>}

                <form onSubmit={handleSubmit} className="space-y-6">
                                        <div>
                        <label className="block text-sm font-medium text-gray-700" htmlFor="Password">
                            {t('RessetPsw.Password_Label')}
                        </label>
                        <input
                            id="Password"
                            type="password"
                            name="Password"
                            value={psw}
                            onChange={(e) => setPsw(e.target.value)}
                            required
                            className="mt-1 block w-full px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700" htmlFor="newPassword">
                            {t('RessetPsw.New_Password_Label')}
                        </label>
                        <input
                            id="newPassword"
                            type="password"
                            name="newPassword"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            className="mt-1 block w-full px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700" htmlFor="confirmPassword">
                            {t('RessetPsw.Confirm_Password_Label')}
                        </label>
                        <input
                            id="confirmPassword"
                            type="password"
                            name="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="mt-1 block w-full px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={status === 'submitting'}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#4A6FA5] hover:bg-[#3c5a8a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
                    >
                        {status === 'submitting' ? t('RessetPsw.Submitting_Button') : t('RessetPsw.Reset_Password_Button')}
                    </button>
                </form>
            </div>
        </div>
    );
}