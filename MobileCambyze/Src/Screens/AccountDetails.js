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

  if (!user) return <view>{t("AccountDetails.Not_Connected_desc")}</view>;

  return (
    <view className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">{t("AccountDetails.LastAccountOperations")} #{id}</h2>
      {loading ? (
            <view>{t("AccountDetails.Loading")}</view>
        ) : operations.length > 0 ? (
            <ul>
                {operations.map(op => (
                    <li key={op.operationDate}>{op.operationDate} - {op.operationType} : {op.amount} €</li>
                ))}
            </ul>
        ) : (
            <view className="text-red-500">{t("AccountDetails.NoOperationsFound")}</view>
      )}
    </view>
  );
}