import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Plus, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import { createLocation } from "@/lib/location";

const LocationManagements: React.FC = () => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    latitude: "",
    longitude: "",
  });
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
    show: boolean;
  }>({
    type: "success",
    message: "",
    show: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message, show: true });
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Validasi input
      if (!form.name.trim() || !form.description.trim() || !form.latitude || !form.longitude) {
        showNotification("error", "Semua field harus diisi!");
        return;
      }

      // Validasi koordinat
      const lat = Number(form.latitude);
      const lng = Number(form.longitude);
      
      if (isNaN(lat) || isNaN(lng)) {
        showNotification("error", "Koordinat harus berupa angka yang valid!");
        return;
      }

      console.log("Sending location data:", {
        name: form.name.trim(),
        description: form.description.trim(),
        latitude: lat,
        longitude: lng,
      });

      // Panggil API untuk membuat lokasi baru
      const result = await createLocation({
        name: form.name.trim(),
        description: form.description.trim(),
        latitude: lat,
        longitude: lng,
      });

      console.log("Location created successfully:", result);
      
      // Reset form setelah berhasil
      setForm({ name: "", description: "", latitude: "", longitude: "" });
      showNotification("success", "Lokasi berhasil ditambahkan!");
      
    } catch (err: any) {
      console.error("Error creating location:", err);
      showNotification("error", err.message || "Gagal menambahkan lokasi. Silakan coba lagi.");
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

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold">Manajemen Lokasi</h1>
          </div>
        </div>

        {/* Main Card */}
        <Card className="w-full">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Plus className="w-5 h-5 text-blue-600" />
              <CardTitle className="text-xl">Tambah Lokasi Baru</CardTitle>
            </div>
            <CardDescription>
              Silakan isi form berikut untuk menambahkan lokasi baru ke dalam sistem
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6" onSubmit={handleSubmit}>
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
                    className="w-full"
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
                    className="w-full min-h-[100px]"
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
                    className="w-full"
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
                    className="w-full"
                    required
                  />
                </div>
              </div>

              {/* Koordinat Info */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-800 mb-2">Informasi Koordinat</h3>
                <p className="text-sm text-blue-700">
                  Koordinat saat ini: {form.latitude && form.longitude ? 
                    `${form.latitude}, ${form.longitude}` : 
                    'Belum diisi'
                  }
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  Pastikan koordinat yang dimasukkan akurat untuk lokasi yang dimaksud
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4" />
                  {loading ? "Menyimpan..." : "Simpan Lokasi"}
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={() => {
                    setForm({ name: "", description: "", latitude: "", longitude: "" });
                  }}
                >
                  <ArrowLeft className="w-4 h-4" />
                  Reset Form
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default LocationManagements;