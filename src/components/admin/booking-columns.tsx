import type { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import type { BookingResponse } from "@/lib/booking"
import React from "react"

export const bookingColumns = (
  statusFilterComponent?: React.ReactNode
): ColumnDef<BookingResponse>[] => [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <div 
        className="font-medium cursor-pointer flex items-center" 
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        ID
        {column.getIsSorted() === "asc" ? (
          <span className="ml-1">▲</span>
        ) : column.getIsSorted() === "desc" ? (
          <span className="ml-1">▼</span>
        ) : null}
      </div>
    ),
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("id")}</div>
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "field_id",
    header: ({ column }) => (
      <div 
        className="font-medium cursor-pointer flex items-center" 
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Field Name
        {column.getIsSorted() === "asc" ? (
          <span className="ml-1">▲</span>
        ) : column.getIsSorted() === "desc" ? (
          <span className="ml-1">▼</span>
        ) : null}
      </div>
    ),
    cell: ({ row }) => {
      const booking = row.original;
      return (
        <div>{booking.field_name || row.getValue("field_id")}</div>
      );
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "booking_date",
    header: ({ column }) => (
      <div 
        className="font-medium cursor-pointer flex items-center" 
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Date
        {column.getIsSorted() === "asc" ? (
          <span className="ml-1">▲</span>
        ) : column.getIsSorted() === "desc" ? (
          <span className="ml-1">▼</span>
        ) : null}
      </div>
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("booking_date"))
      return <div>{date.toLocaleDateString()}</div>
    },
    enableSorting: true,
    enableHiding: true,
    sortingFn: "datetime",
  },
  {
    accessorKey: "start_time",
    header: ({ column }) => (
      <div 
        className="font-medium cursor-pointer flex items-center" 
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Time
        {column.getIsSorted() === "asc" ? (
          <span className="ml-1">▲</span>
        ) : column.getIsSorted() === "desc" ? (
          <span className="ml-1">▼</span>
        ) : null}
      </div>
    ),
    cell: ({ row }) => {
      const startTime = row.getValue("start_time") as string
      const endTime = row.original.end_time
      return <div>{startTime} - {endTime}</div>
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "total_price",
    header: ({ column }) => (
      <div 
        className="font-medium cursor-pointer flex items-center" 
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Price
        {column.getIsSorted() === "asc" ? (
          <span className="ml-1">▲</span>
        ) : column.getIsSorted() === "desc" ? (
          <span className="ml-1">▼</span>
        ) : null}
      </div>
    ),
    cell: ({ row }) => {
      const price = row.getValue("total_price") as number
      return <div>Rp {price.toLocaleString()}</div>
    },
    enableSorting: true,
    enableHiding: true,
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
      const date = new Date(row.getValue("created_at"))
      return <div>{date.toLocaleDateString()}</div>
    },
    enableSorting: true,
    enableHiding: true,
    sortingFn: "datetime",
  },
  {
    accessorKey: "status",
    header: () => (
      <div className="flex flex-col">
        {statusFilterComponent}
      </div>
    ),
    enableHiding: true,
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
          case "paid":
            return "bg-green-100 text-green-800"
          case "pending":
            return "bg-yellow-100 text-yellow-800"
          case "cancelled":
            return "bg-red-100 text-red-800"
          case "expired":
            return "bg-gray-100 text-gray-800"
          case "completed":
            return "bg-blue-100 text-blue-800"
          default:
            return "bg-gray-100 text-gray-800"
        }
      }
      return (
        <Badge className={getStatusColor(status)}>
          {status}
        </Badge>
      )
    },
  },
]
