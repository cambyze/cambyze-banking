import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../App";
import { useTranslation } from "react-i18next";

export default function AccountDetails() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const { t } = useTranslation();
  const [operations, setOperations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Remplacez l'URL par votre endpoint réel
    fetch(`/getOperations?accountId=${id}`)
      .then(res => res.json())
      .then(data => setOperations(data))
      .finally(() => setLoading(false));
  }, [id]);

  if (!user) return <div>{t("Account.Not_Connected_desc")}</div>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">{t("Dernières opérations du compte")} #{id}</h2>
      {loading ? (
        <div>Chargement…</div>
      ) : (
        <ul>
          {operations.map(op => (
            <li key={op.id} className="mb-2">
              <span>{op.date} - {op.label} : {op.amount} €</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}