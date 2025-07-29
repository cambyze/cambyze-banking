import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from 'react-router-dom';


export default function ForgotPsw() {
  const { t } = useTranslation();
    const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [status, setStatus] = useState("idle");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSendEmail = async (e) => {
      e.preventDefault();
      setStatus("sending");
      setError("");

      const res = await fetch("/forgottenPsw", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ mail: email }).toString(),
    });
    navigate("/Login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#e3eafc] via-[#f5f8ff] to-[#c9d6f7]">
      <div className="bg-white/90 rounded-2xl shadow-xl p-8 border border-[#e3eafc] max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-[#4A6FA5]">
          {t("ForgotPsw.Login_Form_Forget_Password")}
        </h2>

        <p className="mb-6 text-gray-600">
          {t("ForgotPsw.Reset_Description")}
        </p>

        {error && (
          <p className="text-red-500 text-sm text-center mb-4">{error}</p>
        )}
        <form className="space-y-4" onSubmit={handleSendEmail}>
          <input
            type="email"
            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#4A6FA5] outline-none text-sm"
            placeholder={t("ForgotPsw.Login_Form_Email")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={status === "sending"}
            className={`w-full py-2 rounded-lg ${
              status === "sending"
                ? "bg-gray-400"
                : "bg-[#4A6FA5] hover:bg-[#365a8c]"
            } text-white font-semibold text-sm shadow transition`}
          >
            {status === "sending"
              ? t("ForgotPsw.Sending")
              : t("ForgotPsw.Send_Reset_Link")}
          </button>
        </form>
      </div>
    </div>
  );
}