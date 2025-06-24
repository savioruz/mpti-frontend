import React, { useEffect, useState } from "react";
import { getAllLocations } from "@/lib/location";
import type { Location } from "@/lib/location";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Eye } from "lucide-react";
import LocationDetail from "./detail-locations";

const LocationList: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

  useEffect(() => {
    fetchLocations();
  }, []);

  async function fetchLocations() {
    setLoading(true);
    setError(null);
    try {
      const res = await getAllLocations({
        limit: 100,
        page: 1,
      });
      setLocations(res.data.locations);
      setTotalItems(res.data.total_items);
    } catch (err: any) {
      setError(err.message || "Failed to fetch locations");
    } finally {
      setLoading(false);
    }
  }

  const handleLocationClick = (location: Location) => {
    setSelectedLocation(location);
  };

  const handleBackToList = () => {
    setSelectedLocation(null);
  };

  const handleLocationUpdated = () => {
    fetchLocations(); // Refresh list
    // Update selected location
    if (selectedLocation) {
      const updatedLocation = locations.find(loc => loc.id === selectedLocation.id);
      if (updatedLocation) {
        setSelectedLocation(updatedLocation);
      }
    }
  };

  const handleLocationDeleted = () => {
    fetchLocations(); // Refresh list
    setSelectedLocation(null); // Back to list
  };

  // Jika ada location yang dipilih, tampilkan detail
  if (selectedLocation) {
    return (
      <LocationDetail
        location={selectedLocation}
        onBack={handleBackToList}
        onLocationUpdated={handleLocationUpdated}
        onLocationDeleted={handleLocationDeleted}
      />
    );
  }

  // Tampilkan list locations
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">List Semua Lokasi</h1>
        <Button
          onClick={fetchLocations}
          disabled={loading}
          variant="outline"
          className="flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">Loading...</span>
        </div>
      )}

      {error && (
        <Card className="bg-red-50 border-red-200">
          <CardContent className="pt-6">
            <p className="text-red-600">{error}</p>
          </CardContent>
        </Card>
      )}

      {!loading && !error && (
        <>
          <div className="mb-4">
            <p className="text-gray-600">
              Total lokasi: <span className="font-semibold">{totalItems}</span>
            </p>
          </div>

          {locations.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-gray-500">
                  Belum ada lokasi yang tersimpan.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {locations.map((loc) => (
                <Card
                  key={loc.id}
                  className="hover:shadow-lg transition-shadow cursor-pointer group"
                  onClick={() => handleLocationClick(loc)}
                >
                  <CardHeader>
                    <CardTitle className="text-lg flex justify-between items-start">
                      {loc.name}
                      <Eye className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {loc.description}
                    </p>
                    <div className="space-y-1">
                      <p className="text-xs text-gray-500">
                        📍 Koordinat: {loc.latitude}, {loc.longitude}
                      </p>
                      <p className="text-xs text-gray-400">
                        🕒 Dibuat: {new Date(loc.created_at).toLocaleString("id-ID")}
                      </p>
                      <p className="text-xs text-gray-400">
                        ✏️ Update: {new Date(loc.updated_at).toLocaleString("id-ID")}
                      </p>
                    </div>
                    <div className="mt-3 pt-3 border-t">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full flex items-center gap-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLocationClick(loc);
                        }}
                      >
                        <Eye className="w-4 h-4" />
                        Lihat Detail
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </>
  );
};

export default LocationList;