"use client";

import React from "react";
import { Button } from "./ui/button";
import * as XLSX from "xlsx";
import { useReactTable } from "@tanstack/react-table";

interface ExportExcelProps {
  table: ReturnType<typeof useReactTable<OrderType>>;
}
const ExportExcel: React.FC<ExportExcelProps> = ({ table }) => {
  const handleExport = () => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;

    if (selectedRows.length === 0) {
      alert("Please select rows to export.");
      return;
    }

    // Prepare data for export, filtering only the specified columns
    const exportData = selectedRows.map((row) => {
      const { name, color, size, quantity, totalAmount, createdAt , phone , shippingAdress , city } =
        row.original;
      return {
        Name: name,
        Color: color,
        Size: size,
        Quantity: quantity,
        price: totalAmount,
        phone: phone ,
        city: city , 
        shippingAdress : shippingAdress ,
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
  };

  return <Button onClick={handleExport}>Export to Excel</Button>;
};

export default ExportExcel;
