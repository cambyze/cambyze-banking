import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../App";
import { useTranslation } from "react-i18next";

export default function AccountDetails() {
  const { id } = useParams(); // Récupère l'ID depuis l'URL
  const { user } = useContext(AuthContext);
  const { t } = useTranslation();
  const [operations, setOperations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/monthlyBankStatement?ban=${id}`)
        .then(res => {
            if (!res.ok) {
                throw new Error(`API error: ${res.status} - ${res.statusText}`);
            }
            return res.json();
        })
        .then(data => {
            if (data && Array.isArray(data.operations)) {
                setOperations(data.operations);
            } else {
                console.error("Expected an array in 'operations' but received:", data);
                setOperations([]);
            }
        })
        .catch(err => console.error("Error fetching operations:", err))
        .finally(() => setLoading(false));
}, [id]);

  if (!user) return <div>{t("Account.Not_Connected_desc")}</div>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">{t("Dernières opérations du compte")} #{id}</h2>
      {loading ? (
            <div>Chargement…</div>
        ) : operations.length > 0 ? (
            <ul>
                {operations.map(op => (
                    <li key={op.operationDate}>{op.operationDate} - {op.operationType} : {op.amount} €</li>
                ))}
            </ul>
        ) : (
            <div className="text-red-500">Aucune opération trouvée ou une erreur s'est produite.</div>
      )}
    </div>
  );
}