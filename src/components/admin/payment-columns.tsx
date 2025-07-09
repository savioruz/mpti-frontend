import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import type { PaymentResponse } from "@/lib/payment";
import { getPaymentStatusColor } from "@/lib/payment";
import React from "react";

export const paymentColumns = (
  statusFilterComponent?: React.ReactNode,
): ColumnDef<PaymentResponse>[] => [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <div
        className="font-medium cursor-pointer flex items-center"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Payment ID
        {column.getIsSorted() === "asc" ? (
          <span className="ml-1">▲</span>
        ) : column.getIsSorted() === "desc" ? (
          <span className="ml-1">▼</span>
        ) : null}
      </div>
    ),

    cell: ({ row }) => (
      <div className="font-medium font-mono text-sm">{row.getValue("id")}</div>
    ),

    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "transaction_id",
    header: ({ column }) => (
      <div
        className="font-medium cursor-pointer flex items-center"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Transaction ID
        {column.getIsSorted() === "asc" ? (
          <span className="ml-1">▲</span>
        ) : column.getIsSorted() === "desc" ? (
          <span className="ml-1">▼</span>
        ) : null}
      </div>
    ),

    cell: ({ row }) => (
      <div className="font-mono text-sm">{row.getValue("transaction_id")}</div>
    ),

    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "booking_id",
    header: ({ column }) => (
      <div
        className="font-medium cursor-pointer flex items-center"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Booking ID
        {column.getIsSorted() === "asc" ? (
          <span className="ml-1">▲</span>
        ) : column.getIsSorted() === "desc" ? (
          <span className="ml-1">▼</span>
        ) : null}
      </div>
    ),

    cell: ({ row }) => (
      <div className="font-mono text-sm">{row.getValue("booking_id")}</div>
    ),

    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "payment_method",
    header: ({ column }) => (
      <div
        className="font-medium cursor-pointer flex items-center"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Payment Method
        {column.getIsSorted() === "asc" ? (
          <span className="ml-1">▲</span>
        ) : column.getIsSorted() === "desc" ? (
          <span className="ml-1">▼</span>
        ) : null}
      </div>
    ),

    cell: ({ row }) => {
      const method = row.getValue("payment_method") as string;
      return <div className="capitalize">{method.replace("_", " ")}</div>;
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "payment_status",
    header: () => (
      <div className="flex flex-col">
        <span className="font-medium mb-1">Status</span>
        {statusFilterComponent}
      </div>
    ),

    enableHiding: true,
    cell: ({ row }) => {
      const status = row.getValue("payment_status") as string;
      return (
        <Badge className={getPaymentStatusColor(status as any)}>{status}</Badge>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => (
      <div
        className="font-medium cursor-pointer flex items-center"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Created
        {column.getIsSorted() === "asc" ? (
          <span className="ml-1">▲</span>
        ) : column.getIsSorted() === "desc" ? (
          <span className="ml-1">▼</span>
        ) : null}
      </div>
    ),

    cell: ({ row }) => {
      const date = new Date(row.getValue("created_at"));
      return <div>{date.toLocaleDateString()}</div>;
    },
    enableSorting: true,
    enableHiding: true,
    sortingFn: "datetime",
  },
  {
    accessorKey: "paid_at",
    header: ({ column }) => (
      <div
        className="font-medium cursor-pointer flex items-center"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Paid At
        {column.getIsSorted() === "asc" ? (
          <span className="ml-1">▲</span>
        ) : column.getIsSorted() === "desc" ? (
          <span className="ml-1">▼</span>
        ) : null}
      </div>
    ),

    cell: ({ row }) => {
      const paidAt = row.getValue("paid_at") as string;
      return paidAt ? (
        <div>{new Date(paidAt).toLocaleDateString()}</div>
      ) : (
        <div className="text-muted-foreground">-</div>
      );
    },
    enableSorting: true,
    enableHiding: true,
    sortingFn: "datetime",
  },
];
