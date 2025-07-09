import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
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
} from "@/components/ui/alert-dialog";
import { ArrowUpDown, Eye, Edit, Trash2, Loader2 } from "lucide-react";
import type { Location } from "@/lib/location";

interface LocationTableActionsProps {
  location: Location;
  onView: (location: Location) => void;
  onEdit: (location: Location) => void;
  onDelete: (id: string) => void;
  actionLoading: boolean;
}

function LocationTableActions({
  location,
  onView,
  onEdit,
  onDelete,
  actionLoading,
}: LocationTableActionsProps) {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onView(location)}
        disabled={actionLoading}
        className="border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300"
      >
        <Eye className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onEdit(location)}
        disabled={actionLoading}
        className="border-green-200 text-green-600 hover:bg-green-50 hover:text-green-700 hover:border-green-300"
      >
        <Edit className="h-4 w-4" />
      </Button>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            disabled={actionLoading}
            className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              location "{location.name}" and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={actionLoading}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => onDelete(location.id)}
              disabled={actionLoading}
            >
              {actionLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export function createLocationColumns(
  onView: (location: Location) => void,
  onEdit: (location: Location) => void,
  onDelete: (id: string) => void,
  actionLoading: boolean,
): ColumnDef<Location>[] {
  return [
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => {
        const description = row.getValue("description") as string;
        return (
          <div className="max-w-[300px] truncate">
            {description || (
              <span className="text-muted-foreground">No description</span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "coordinates",
      header: "Coordinates",
      cell: ({ row }) => {
        const location = row.original;
        return (
          <div className="text-sm">
            <div>Lat: {location.latitude.toFixed(6)}</div>
            <div>Lng: {location.longitude.toFixed(6)}</div>
          </div>
        );
      },
    },
    {
      accessorKey: "created_at",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Created At
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const date = new Date(row.getValue("created_at"));
        return <div>{date.toLocaleDateString()}</div>;
      },
    },
    {
      id: "actions",
      accessorKey: "actions",
      header: "Actions",
      enableHiding: false,
      cell: ({ row }) => {
        const location = row.original;
        return (
          <LocationTableActions
            location={location}
            onView={onView}
            onEdit={onEdit}
            onDelete={onDelete}
            actionLoading={actionLoading}
          />
        );
      },
    },
  ];
}
