import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  MapPin, 
  Edit3, 
  Trash2, 
  Save, 
  X, 
  ArrowLeft,
  CheckCircle,
  AlertCircle 
} from "lucide-react";
import { updateLocationById, deleteLocationById } from "@/lib/location";
import type { Location } from "@/lib/location";

interface LocationDetailProps {
  location: Location;
  onBack: () => void;
  onLocationUpdated: () => void;
  onLocationDeleted: () => void;
}

const LocationDetail: React.FC<LocationDetailProps> = ({
  location,
  onBack,
  onLocationUpdated,
  onLocationDeleted,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: location.name,
    description: location.description,
    latitude: location.latitude.toString(),
    longitude: location.longitude.toString(),
  });
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
    show: boolean;
  }>({
    type: "success",
    message: "",
    show: false,
  });

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message, show: true });
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEdit = () => {
    setIsEditing(true);
    setForm({
      name: location.name,
      description: location.description,
      latitude: location.latitude.toString(),
      longitude: location.longitude.toString(),
    });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setForm({
      name: location.name,
      description: location.description,
      latitude: location.latitude.toString(),
      longitude: location.longitude.toString(),
    });
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      // Validasi
      if (!form.name.trim() || !form.description.trim() || !form.latitude || !form.longitude) {
        showNotification("error", "Semua field harus diisi!");
        return;
      }

      const lat = Number(form.latitude);
      const lng = Number(form.longitude);
      
      if (isNaN(lat) || isNaN(lng)) {
        showNotification("error", "Koordinat harus berupa angka yang valid!");
        return;
      }

      if (lat < -90 || lat > 90) {
        showNotification("error", "Latitude harus antara -90 dan 90!");
        return;
      }

      if (lng < -180 || lng > 180) {
        showNotification("error", "Longitude harus antara -180 dan 180!");
        return;
      }

      await updateLocationById(location.id, {
        name: form.name.trim(),
        description: form.description.trim(),
        latitude: lat,
        longitude: lng,
      });

      showNotification("success", "Lokasi berhasil diupdate!");
      setIsEditing(false);
      onLocationUpdated();
    } catch (err: any) {
      showNotification("error", err.message || "Gagal mengupdate lokasi");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Apakah Anda yakin ingin menghapus lokasi "${location.name}"? Tindakan ini tidak dapat dibatalkan.`)) {
      return;
    }

    setLoading(true);
    try {
      await deleteLocationById(location.id);
      showNotification("success", "Lokasi berhasil dihapus!");
      setTimeout(() => {
        onLocationDeleted();
      }, 1000);
    } catch (err: any) {
      showNotification("error", err.message || "Gagal menghapus lokasi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Notification */}
      {notification.show && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg transition-all duration-300 ${
            notification.type === "success"
              ? "bg-green-600 text-white"
              : "bg-red-600 text-white"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          <span className="font-medium">{notification.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Button
            onClick={onBack}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </Button>
          <h1 className="text-3xl font-bold">Detail Lokasi</h1>
        </div>

        {!isEditing && (
          <div className="flex gap-2">
            <Button
              onClick={handleEdit}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Edit3 className="w-4 h-4" />
              Edit
            </Button>
            <Button
              onClick={handleDelete}
              variant="destructive"
              className="flex items-center gap-2"
              disabled={loading}
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </Button>
          </div>
        )}
      </div>

      {/* Main Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <MapPin className="w-6 h-6 text-blue-600" />
            <CardTitle className="text-2xl">
              {isEditing ? "Edit Lokasi" : location.name}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            // Edit Form
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nama Lokasi */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">
                    Nama Lokasi *
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Masukkan nama lokasi"
                    required
                  />
                </div>

                {/* Deskripsi - Full Width */}
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="description" className="text-sm font-medium">
                    Deskripsi *
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Masukkan deskripsi lokasi"
                    className="min-h-[100px]"
                    required
                  />
                </div>

                {/* Latitude */}
                <div className="space-y-2">
                  <Label htmlFor="latitude" className="text-sm font-medium">
                    Latitude *
                  </Label>
                  <Input
                    id="latitude"
                    name="latitude"
                    type="number"
                    step="any"
                    value={form.latitude}
                    onChange={handleChange}
                    placeholder="Contoh: -7.7956"
                    required
                  />
                </div>

                {/* Longitude */}
                <div className="space-y-2">
                  <Label htmlFor="longitude" className="text-sm font-medium">
                    Longitude *
                  </Label>
                  <Input
                    id="longitude"
                    name="longitude"
                    type="number"
                    step="any"
                    value={form.longitude}
                    onChange={handleChange}
                    placeholder="Contoh: 110.3695"
                    required
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <Button
                  onClick={handleUpdate}
                  disabled={loading}
                  className="flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {loading ? "Menyimpan..." : "Simpan Perubahan"}
                </Button>
                <Button
                  onClick={handleCancelEdit}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Batal
                </Button>
              </div>
            </div>
          ) : (
            // Detail View
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Informasi Dasar */}
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">Nama Lokasi</h3>
                    <p className="text-lg">{location.name}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">ID Lokasi</h3>
                    <p className="text-sm text-gray-600 font-mono">{location.id}</p>
                  </div>
                </div>

                {/* Koordinat */}
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">Koordinat</h3>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm">📍 Latitude: <span className="font-mono">{location.latitude}</span></p>
                      <p className="text-sm">📍 Longitude: <span className="font-mono">{location.longitude}</span></p>
                    </div>
                  </div>
                </div>

                {/* Deskripsi - Full Width */}
                <div className="md:col-span-2 space-y-2">
                  <h3 className="font-semibold text-gray-700">Deskripsi</h3>
                  <p className="text-gray-600 leading-relaxed">{location.description}</p>
                </div>

                {/* Timestamps */}
                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">Dibuat</h3>
                    <p className="text-sm text-gray-600">
                      🕒 {new Date(location.created_at).toLocaleString("id-ID")}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">Terakhir Diupdate</h3>
                    <p className="text-sm text-gray-600">
                      ✏️ {new Date(location.updated_at).toLocaleString("id-ID")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default LocationDetail;