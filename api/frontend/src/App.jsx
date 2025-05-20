import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { createContext, useState, useEffect } from "react";
import HomePage from './components/HomePage.jsx';
import Footer from './components/footer.jsx';
import Header from './components/Header.jsx';
import LoginRegisterSelect from './components/LoginRegisterSelect.jsx';
import Account from "./components/Account.jsx";
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
          <Route path="/LoginRegiser" element={<LoginRegisterSelect />} />
          <Route path="/Home" element={<HomePage />} />
          <Route path="/Account" element={<Account />} />
          <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
        <Footer />
      </AuthContext.Provider>
    </BrowserRouter>
  );
}

export default App;