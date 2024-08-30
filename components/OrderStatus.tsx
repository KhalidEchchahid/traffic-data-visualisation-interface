"use client";

import { updateOrderStatus } from "@/lib/actions/order.action";
import { usePathname } from "next/navigation";
import { useState } from "react";

const statuses = [
  {
    value: "en attente",
    label: "En attente",
    color: "bg-yellow-500 text-white",
  }, // Pending
  { value: "confirme", label: "Confirmé", color: "bg-green-500 text-white" }, // Confirmed
  {
    value: "pas de reponse",
    label: "Pas de réponse",
    color: "bg-orange-500 text-white",
  }, // No reply
  { value: "annule", label: "Annulé", color: "bg-red-500 text-white" }, // Canceled
  { value: "exporte", label: "Exporté", color: "bg-blue-500 text-white" }, // Exported
];

interface Props {
  orderId: string;
  initialStatus: string;
}

const OrderStatus = ({ orderId, initialStatus }: Props) => {
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();

  const handleStatusChange = async (event: { target: { value: string } }) => {
    const newStatus = event.target.value;
    setLoading(true);
    try {
      await updateOrderStatus({
        orderId,
        newStatus,
        path: pathname,
      });
    } catch (error) {
      console.error("Failed to update order status", error);
    } finally {
      setLoading(false);
    }
  };

  const selectedStatus = statuses.find(
    (status) => status.value === initialStatus
  );

  return (
    <div className="flex items-center">
      <select
        value={initialStatus}
        onChange={handleStatusChange}
        disabled={loading}
        className={`border-none rounded-3xl px-3 py-1 text-sm font-medium focus:outline-none focus:ring-2  cursor-pointer ${selectedStatus?.color}`}
      >
        {statuses.map((statusOption) => (
          <option
            key={statusOption.value}
            value={statusOption.value}
            className={`bg-white text-black font-semibold`}
          >
            {statusOption.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default OrderStatus;
