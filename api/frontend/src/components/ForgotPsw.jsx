import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function ForgotPsw() {
  const { t } = useTranslation();

  const [step, setStep] = useState(1); // 1=email, 2=code, 3=new password 4=success
  const [status, setStatus] = useState("idle");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");

  const handleSendEmail = async (e) => {
    e.preventDefault();
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ email }).toString(),
      });
      if (res.ok) {
        setStep(2);
      } else {
        setError(t("LoginRegister.Connection_Failed"));
      }
    } catch (err) {
      setError(t("LoginRegister.Connection_Failed"));
    } finally {
      setStatus("idle");
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      if (res.ok) {
        setStep(3);
      } else {
        setError(t("Code invalide ou expiré"));
      }
    } catch {
      setError(t("Erreur de vérification du code"));
    } finally {
      setStatus("idle");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: newPassword }),
      });
      if (res.ok) {
        setStep(4); // Fin du processus
      } else {
        setError(t("Échec de la réinitialisation"));
      }
    } catch {
      setError(t("Erreur réseau"));
    } finally {
      setStatus("idle");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#e3eafc] via-[#f5f8ff] to-[#c9d6f7]">
      <div className="bg-white/90 rounded-2xl shadow-xl p-8 border border-[#e3eafc] max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-[#4A6FA5]">
          {t("LoginRegister.Login_Form_Forget_Password")}
        </h2>

        <p className="mb-6 text-gray-600">
          {step === 1 && t("Entrez votre adresse e-mail pour recevoir un lien de réinitialisation.")}
          {step === 2 && t("Entrez le code reçu par email.")}
          {step === 3 && t("Choisissez un nouveau mot de passe.")}
        </p>

        {error && (
          <p className="text-red-500 text-sm text-center mb-4">{error}</p>
        )}

        {step === 1 && (
          <form className="space-y-4" onSubmit={handleSendEmail}>
            <input
              type="email"
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#4A6FA5] outline-none text-sm"
              placeholder={t("LoginRegister.Login_Form_Email")}
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
                ? t("Envoi en cours…")
                : t("Envoyer le lien de réinitialisation")}
            </button>
          </form>
        )}

        {step === 2 && (
          <form className="space-y-4" onSubmit={handleVerifyCode}>
            <input
              type="text"
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#4A6FA5] outline-none text-sm"
              placeholder={t("Entrez le code reçu par email")}
              value={code}
              onChange={(e) => setCode(e.target.value)}
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
                ? t("Vérification…")
                : t("Vérifier le code")}
            </button>
          </form>
        )}

        {step === 3 && (
          <form className="space-y-4" onSubmit={handleResetPassword}>
            <input
              type="password"
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#4A6FA5] outline-none text-sm"
              placeholder={t("Nouveau mot de passe")}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
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
                ? t("Réinitialisation…")
                : t("Réinitialiser le mot de passe")}
            </button>
          </form>
        )}

        {step === 4 && (
          <div className="text-green-600 text-center font-semibold">
            {t("Votre mot de passe a été réinitialisé avec succès !")}
          </div>
        )}
      </div>
    </div>
  );
}