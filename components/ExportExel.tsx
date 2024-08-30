"use client";

import React from "react";
import { Button } from "./ui/button";
import * as XLSX from "xlsx";
import { useReactTable } from "@tanstack/react-table";
import { usePathname } from "next/navigation";
import { updateOrderStatuses } from "@/lib/actions/order.action";

interface ExportExcelProps {
  table: ReturnType<typeof useReactTable<OrderType>>;
}
const ExportExcel: React.FC<ExportExcelProps> = ({ table }) => {
  const pathname = usePathname();
  const handleExport = async () => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;

    if (selectedRows.length === 0) {
      alert("Please select rows to export.");
      return;
    }

    // Prepare data for export, filtering only the specified columns
    const exportData = selectedRows.map((row) => {
      const {
        name,
        color,
        size,
        quantity,
        totalAmount,
        createdAt,
        phone,
        shippingAdress,
        city,
      } = row.original;
      return {
        Name: name,
        Color: color,
        Size: size,
        Quantity: quantity,
        price: totalAmount,
        phone: phone,
        city: city,
        shippingAdress: shippingAdress,
        CreatedAt: createdAt
          ? new Intl.DateTimeFormat("fr", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }).format(new Date(createdAt))
          : "N/A",
      };
    });

    // Create a new workbook and a new worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(exportData);

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");

    // Export the workbook to an Excel file
    XLSX.writeFile(workbook, "orders.xlsx");
    // Update the status of exported orders to "exported"
    const orderIds = selectedRows.map((row) => row.original._id);
    await updateOrderStatus(orderIds, "exporte");
  };

  // Function to update the status of the orders
  const updateOrderStatus = async (orderIds: string[], status: string) => {
    try {
      await updateOrderStatuses({
        orderIds,
        newStatus: status,
        path: pathname,
      });

      alert("Order statuses updated to 'exported'.");
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("There was an error updating the order status.");
    }
  };
  //TODO: we must change the status of the orders after exporting the data to excel
  return <Button onClick={handleExport}>Export to Excel</Button>;
};

export default ExportExcel;
