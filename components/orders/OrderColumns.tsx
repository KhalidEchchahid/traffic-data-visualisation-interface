"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "../ui/checkbox";
import OrderStatus from "../OrderStatus";

export const columns: ColumnDef<OrderType>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <div>{row.original.name}</div>,
  },
  {
    accessorKey: "color",
    header: "Color",
    cell: ({ row }) => <div>{row.original.color}</div>,
  },
  {
    accessorKey: "size",
    header: "Size",
    cell: ({ row }) => (
      <p className="text-sm text-gray-700 font-medium">{row.original.size}</p>
    ),
  },
  {
    accessorKey: "city",
    header: "City",
    cell: ({ row }) => (
      <p className="text-sm text-gray-700 font-medium">{row.original.city}</p>
    ),
  },
  {
    accessorKey: "Adress",
    header: "Adress",
    cell: ({ row }) => (
      <p className="text-sm text-gray-700 font-medium">
        {row.original.shippingAdress}
      </p>
    ),
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
    cell: ({ row }) => (
      <p className="text-sm text-gray-700 font-medium">
        {row.original.quantity}
      </p>
    ),
  },
  {
    accessorKey: "totalAmount",
    header: "TotalAmount",
    cell: ({ row }) => (
      <p className="text-sm text-gray-700 font-medium">
        {row.original.totalAmount}
      </p>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "CreatedAt",
    cell: ({ row }) => {
      const createdAt = row.original.createdAt;
      return (
        <p className="text-sm text-gray-600 italic">
          {createdAt
            ? new Intl.DateTimeFormat("fr", {
                year: "numeric",
                month: "long",
                day: "numeric",
              }).format(new Date(createdAt))
            : "تاريخ غير متوفر"}
        </p>
      );
    },
  },
  {
    accessorKey: "status",
    header: () => <div>status</div>,
    cell: ({ row }) => {
      return (
        <OrderStatus
          orderId={row.original._id}
          initialStatus={row.original.status}
        />
      );
    },
  },
];
