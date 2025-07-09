import { createFileRoute } from "@tanstack/react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DataTable } from "@/components/ui/data-table";
import { Plus, Loader2, RefreshCw, X } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

import {
  getAllFields,
  createField,
  updateField,
  deleteField,
  uploadFieldImages,
  deleteFieldImage,
  type Field,
  type CreateFieldPayload,
  type UpdateFieldPayload,
} from "@/lib/field";
import { getAllLocations, type Location } from "@/lib/location";
import { createFieldColumns } from "@/components/admin/field-columns";

export const Route = createFileRoute("/admin/fields")({
  component: FieldManagement,
});

function FieldManagement() {
  const [fields, setFields] = useState<Field[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [editingField, setEditingField] = useState<Field | null>(null);
  const [viewingField, setViewingField] = useState<Field | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location_id: "",
    price: 0,
    type: "",
    images: [] as string[],
  });

  // Field types
  const fieldTypes = [
    "Football",
    "Basketball",
    "Tennis",
    "Badminton",
    "Volleyball",
    "Futsal",
    "Other",
  ];

  // Load data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [fieldsResponse, locationsResponse] = await Promise.all([
        getAllFields({ limit: 100 }),
        getAllLocations({ limit: 100 }),
      ]);
      setFields(fieldsResponse.data.fields);
      setLocations(locationsResponse.data.locations);
    } catch (error: any) {
      toast.error(error.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      location_id: "",
      price: 0,
      type: "",
      images: [],
    });
    setEditingField(null);
  };

  // Handle create
  const handleCreate = async () => {
    if (
      !formData.name ||
      !formData.location_id ||
      !formData.type ||
      formData.price <= 0
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: CreateFieldPayload = {
        name: formData.name,
        description: formData.description,
        location_id: formData.location_id,
        price: formData.price,
        type: formData.type,
      };

      await createField(payload);
      toast.success("Field created successfully");
      setIsCreateDialogOpen(false);
      resetForm();
      loadData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create field");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle edit
  const handleEdit = (field: Field) => {
    setEditingField(field);
    setFormData({
      name: field.name,
      description: field.description,
      location_id: field.location_id,
      price: field.price,
      type: field.type,
      images: field.images || [],
    });
    setIsEditDialogOpen(true);
  };

  // Handle update
  const handleUpdate = async () => {
    if (
      !editingField ||
      !formData.name ||
      !formData.location_id ||
      !formData.type ||
      formData.price <= 0
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: UpdateFieldPayload = {
        name: formData.name,
        description: formData.description,
        location_id: formData.location_id,
        price: formData.price,
        type: formData.type,
      };

      await updateField(editingField.id, payload);
      toast.success("Field updated successfully");
      setIsEditDialogOpen(false);
      resetForm();
      loadData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update field");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete
  const handleDelete = async (field: Field) => {
    setActionLoading(true);
    try {
      await deleteField(field.id);
      toast.success("Field deleted successfully");
      loadData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete field");
    } finally {
      setActionLoading(false);
    }
  };

  // Handle view
  const handleView = (field: Field) => {
    setViewingField(field);
    setIsViewDialogOpen(true);
  };

  // Handle edit - wrapper for column action
  const handleEditColumn = (field: Field) => {
    handleEdit(field);
  };

  // Handle delete - wrapper for column action
  const handleDeleteColumn = async (fieldId: string) => {
    const field = fields.find((f) => f.id === fieldId);
    if (field) {
      await handleDelete(field);
    }
  };

  // Handle image upload
  const handleImageUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    // Validate files
    for (const file of fileArray) {
      if (file.size > maxSize) {
        toast.error(`File ${file.name} is too large. Maximum size is 5MB.`);
        return;
      }
      if (!allowedTypes.includes(file.type)) {
        toast.error(`File ${file.name} is not a supported image type.`);
        return;
      }
    }

    // If we're editing an existing field, upload immediately
    if (editingField) {
      try {
        const response = await uploadFieldImages(editingField.id, fileArray);
        if (response.data && Array.isArray(response.data)) {
          const newImages = [...(formData.images || []), ...response.data];
          setFormData((prev) => ({ ...prev, images: newImages }));
          toast.success("Images uploaded successfully");
          loadData(); // Refresh the fields list
        }
      } catch (error: any) {
        toast.error(error.response?.data?.error || "Failed to upload images");
      }
    } else {
      // For new fields, we'll store as file URLs for preview
      const imageUrls = await Promise.all(
        fileArray.map((file) => {
          return new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target?.result as string);
            reader.readAsDataURL(file);
          });
        }),
      );

      setFormData((prev) => ({
        ...prev,
        images: [...(prev.images || []), ...imageUrls],
      }));
    }
  };

  // Handle image remove
  const handleImageRemove = async (imageUrl: string) => {
    if (editingField) {
      try {
        await deleteFieldImage(editingField.id, imageUrl);
        const newImages = formData.images.filter((img) => img !== imageUrl);
        setFormData((prev) => ({ ...prev, images: newImages }));
        toast.success("Image removed successfully");
        loadData(); // Refresh the fields list
      } catch (error: any) {
        toast.error(error.response?.data?.error || "Failed to remove image");
      }
    } else {
      // For new fields, just remove from local state
      const newImages = formData.images.filter((img) => img !== imageUrl);
      setFormData((prev) => ({ ...prev, images: newImages }));
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Field Management</h1>
          <p className="text-muted-foreground">
            Manage fields, pricing, and availability
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={loadData} disabled={loading}>
            <RefreshCw
              className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Add Field
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New Field</DialogTitle>
                <DialogDescription>
                  Add a new field to your location. Make sure to fill in all
                  required fields.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Field Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="e.g., Field A, Court 1"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="location">Location *</Label>
                  <Select
                    value={formData.location_id}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, location_id: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a location" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((location) => (
                        <SelectItem key={location.id} value={location.id}>
                          {location.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="type">Field Type *</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, type: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select field type" />
                    </SelectTrigger>
                    <SelectContent>
                      {fieldTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="price">Price per Hour (IDR) *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        price: parseInt(e.target.value) || 0,
                      }))
                    }
                    placeholder="100000"
                    min="0"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Optional description of the field"
                    rows={3}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="images">Images</Label>
                  <div className="space-y-2">
                    <Input
                      id="images"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e.target.files)}
                      className="cursor-pointer"
                    />

                    {formData.images && formData.images.length > 0 && (
                      <div className="grid grid-cols-3 gap-2">
                        {formData.images.map((image, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={image}
                              alt={`Field image ${index + 1}`}
                              className="w-full h-20 object-cover rounded border"
                            />

                            <Button
                              variant="destructive"
                              size="sm"
                              className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => handleImageRemove(image)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleCreate} disabled={isSubmitting}>
                  {isSubmitting && (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  )}
                  Create Field
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Fields table */}
      <Card>
        <CardHeader>
          <CardTitle>Fields ({fields.length} total)</CardTitle>
          <CardDescription>
            Manage your sports fields and their configurations
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <DataTable
              columns={createFieldColumns(
                locations,
                handleView,
                handleEditColumn,
                handleDeleteColumn,
                actionLoading,
              )}
              data={fields}
              searchKey="name"
              searchPlaceholder="Search fields by name..."
            />
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Field</DialogTitle>
            <DialogDescription>
              Update the field information. Make sure to fill in all required
              fields.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Field Name *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="e.g., Field A, Court 1"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-location">Location *</Label>
              <Select
                value={formData.location_id}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, location_id: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((location) => (
                    <SelectItem key={location.id} value={location.id}>
                      {location.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-type">Field Type *</Label>
              <Select
                value={formData.type}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, type: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select field type" />
                </SelectTrigger>
                <SelectContent>
                  {fieldTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-price">Price per Hour (IDR) *</Label>
              <Input
                id="edit-price"
                type="number"
                value={formData.price}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    price: parseInt(e.target.value) || 0,
                  }))
                }
                placeholder="100000"
                min="0"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Optional description of the field"
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-images">Images</Label>
              <div className="space-y-2">
                <Input
                  id="edit-images"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e.target.files)}
                  className="cursor-pointer"
                />

                {formData.images && formData.images.length > 0 && (
                  <div className="grid grid-cols-3 gap-2">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image}
                          alt={`Field image ${index + 1}`}
                          className="w-full h-20 object-cover rounded border"
                        />

                        <Button
                          variant="destructive"
                          size="sm"
                          className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleImageRemove(image)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              Update Field
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Field Details</DialogTitle>
            <DialogDescription>
              View detailed information about this field
            </DialogDescription>
          </DialogHeader>
          {viewingField && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Field Name</Label>
                  <p className="text-sm text-muted-foreground">
                    {viewingField.name}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Location</Label>
                  <p className="text-sm text-muted-foreground">
                    {locations.find(
                      (loc) => loc.id === viewingField.location_id,
                    )?.name || "Unknown Location"}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Field Type</Label>
                  <p className="text-sm text-muted-foreground">
                    {viewingField.type}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Price per Hour</Label>
                  <p className="text-sm text-muted-foreground">
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    }).format(viewingField.price)}
                  </p>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Description</Label>
                <p className="text-sm text-muted-foreground">
                  {viewingField.description || "No description provided"}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium">
                  Images ({viewingField.images?.length || 0})
                </Label>
                {viewingField.images && viewingField.images.length > 0 ? (
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {viewingField.images.map((image, index) => (
                      <div key={index} className="aspect-square">
                        <img
                          src={image}
                          alt={`Field image ${index + 1}`}
                          className="w-full h-full object-cover rounded border"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground mt-2">
                    No images uploaded
                  </p>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsViewDialogOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
