import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { createContext, useState, useEffect } from "react";
import HomePage from './components/HomePage.jsx';
import Footer from './components/footer.jsx';
import Header from './components/Header.jsx';
import LoginRegisterSelect from './components/LoginRegisterSelect.jsx';
import Account from "./components/Account.jsx";
import ForgotPsw from "./components/ForgotPsw.jsx";
import AccountDetails from "./components/AccountDetails.jsx";
import BankTransfer from "./components/BankTransfer.jsx";
import ResetPassword from "./components/RessetPsw.jsx";
import TestServices from "./components/TestServices.jsx";
import Profile from "./components/Profile.jsx";
export const AuthContext = createContext();

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

  const login = (userData) => setUser(userData);
  const logout = () => setUser(null);

  return (
    <BrowserRouter>
      <AuthContext.Provider value={{ user, login, logout }}>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          {/* <Route path="/LoginRegiser" element={<LoginRegisterSelect />} /> */}
          <Route path="/Register" element={<LoginRegisterSelect />} />
          <Route path="/Login" element={<LoginRegisterSelect />} />
          <Route path="/Home" element={<HomePage />} />
          <Route path="/Account" element={<Account />} />
          <Route path="/ForgotPsw" element={<ForgotPsw />} />
          <Route path="/account/:id" element={<AccountDetails />} />
          <Route path="/bank-transfer" element={<BankTransfer />} />
          <Route path="/resetPassword" element={<ResetPassword />} />
          <Route path="/testServices" element={<TestServices />} />
          <Route path="/profile" element={<Profile />} />
          {/* <Route path="/forget-password" element={<ForgetPassword />} /> */}
          <Route path="*" element={<div><text>404 Not Found</text></div>} />
        </Routes>
        <Footer />
      </AuthContext.Provider>
    </BrowserRouter>
  );
}


export default App;