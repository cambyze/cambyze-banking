import { AuthContext } from "../App";
import { useContext, useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import AddressModal from './OpenStreetMap';

export default function Profile() {
    const { t } = useTranslation();
    const { user } = useContext(AuthContext);
    const [userData, setUserData] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [addressModalOpen, setAddressModalOpen] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState(null);

    const fetchUserData = async () => {
        try {
            const response = await fetch(`/seeProfile?personId=${user.personId}`);
            if (!response.ok) {
                throw new Error("Failed to fetch user data");
            }
            const data = await response.json();
            console.log("Fetched user data:", data);
            setUserData(data);
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    }

    const HandleUdpate = async () => {
        try {
            const response = await fetch("/updateProfile", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams({ 
                    personId: userData.id, 
                    name: userData.name, 
                    email: userData.email, 
                    password: userData.password,
                    Street: streetNumber + " " + street,
                    city: city,
                    state: state,
                    country: country,
                    secondaryAddress: secondaryAddress
                }).toString(),
            });
        } catch (error) {
            console.error("Error updating user data:", error);
        }
    }

    useEffect(() => {
        fetchUserData();
    }, []);

    const updateProfile = () => {
        return (
            <div>
                {showModal && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-2xl transition-all">
                      <div className="flex items-center justify-between mb-4 border-b pb-2">
                        <h2>Update Profile</h2>
                        <div className="flex justify-end">
                            <button className="text-lg font-medium text-red-500" onClick={() => setShowModal(false)}>X</button>
                        </div>
                      </div>
                      <p>modal</p>
                      <form onSubmit={HandleUdpate}>
                        <div className="mb-4">
                          <label className="block text-gray-700">Name:</label>
                            <input type="text" value={userData.name} 
                                onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                                className="w-full px-3 py-2 border rounded"
                            />
                            <input type="text" value={userData.name} 
                                onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                                className="w-full px-3 py-2 border rounded"
                            />
                            <input type="text" value={userData.name} 
                                onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                                className="w-full px-3 py-2 border rounded"
                            />
                            <button
                                type="button"
                                onClick={() => setAddressModalOpen(true)}
                                className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-left text-sm focus:ring-2 focus:ring-[#4A6FA5] outline-none"
                            >
                                    {selectedAddress ? selectedAddress : t('LoginRegister.Register_Form_Address') }
                                </button>
                            {addressModalOpen && (
                                <AddressModal
                                    isOpen={addressModalOpen}
                                    onRequestClose={() => setAddressModalOpen(false)}
                                    onAddressSelected={(data) => {
                                        setSelectedAddress(data.full);
                                        setAddressModalOpen(false);
                                        setAddress(data);
                                    }}
                                />
                            )}
                        </div>
                      </form>
                    </div>
                  </div>
                )}
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <div className="mb-6 flex items-center justify-center">
                <h2 className="text-2xl font-semibold mb-4">User Profile</h2>
            </div>
            {userData ? (
                <div>
                    <p><strong>ID:</strong> {userData.personId} </p>
                    <p><strong>Name:</strong> {userData.name}</p>
                    <p><strong>Family Name:</strong> {userData.familyName}</p>
                    <p><strong>Email:</strong> {userData.email}</p>
                    <p><strong>Password:</strong> ***</p>
                    <p><strong>Address:</strong> {userData.adress.street + " " + userData.adress.city + 
                    ", " + userData.adress.state + ", " + userData.adress.country}</p>
                    <div className="flex items-center justify-center">
                        <button 
                            onClick={() => setShowModal(true)} 
                            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                            Update Profile
                        </button>
                        <button
                          className="mt-4 px-6 py-2 bg-white text-[#4A6FA5] rounded-lg hover:bg-[#] transition"
                          onClick={ () => navigate("/resetPassword") }
                          >
                          {t("Account.Change_Password")}
                        </button>
                    </div>
                    {updateProfile()}
                </div>
            ) : (
                <div className="flex items-center justify-center">
                    <p className="animate-pulse">Loading...</p>
                </div>
            )}
            {console.log("userData:", userData)}
        </div>
    )

}