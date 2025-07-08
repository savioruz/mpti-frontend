import type { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { MoreHorizontal, Edit, Trash2, Eye, ImageIcon } from "lucide-react"
import type { Field } from "@/lib/field"
import type { Location } from "@/lib/location"

export function createFieldColumns(
  locations: Location[],
  onView: (field: Field) => void,
  onEdit: (field: Field) => void,
  onDelete: (fieldId: string) => void,
  actionLoading: boolean
): ColumnDef<Field>[] {
  
  const getLocationName = (locationId: string) => {
    const location = locations.find(loc => loc.id === locationId)
    return location?.name || 'Unknown Location'
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    }).format(price)
  }

  return [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "location_id",
      header: "Location",
      cell: ({ row }) => (
        <div>{getLocationName(row.getValue("location_id"))}</div>
      ),
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => (
        <Badge variant="secondary">{row.getValue("type")}</Badge>
      ),
    },
    {
      accessorKey: "price",
      header: "Price/Hour",
      cell: ({ row }) => (
        <div>{formatPrice(row.getValue("price"))}</div>
      ),
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => {
        const description = row.getValue("description") as string
        return (
          <div className="max-w-xs truncate">
            {description || '-'}
          </div>
        )
      },
    },
    {
      accessorKey: "images",
      header: "Images",
      cell: ({ row }) => {
        const images = row.getValue("images") as string[] || []
        return (
          <div className="flex items-center gap-1">
            <ImageIcon className="h-4 w-4" />
            <span className="text-sm text-muted-foreground">
              {images.length}
            </span>
          </div>
        )
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const field = row.original
        
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0" disabled={actionLoading}>
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onView(field)}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(field)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Field
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Field
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete the field "{field.name}". This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => onDelete(field.id)}>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]
}
