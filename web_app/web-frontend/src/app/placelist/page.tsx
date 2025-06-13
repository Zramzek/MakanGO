"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import MainLayout from "../components/MainLayout";
import EmptyState from "../components/EmptyStatePlacelist";
import {
  PlaceList,
  getUserPlaceList,
  createPlaceList,
} from "../services/placelist";
import { useAuth } from "../utils/AuthContext";
import Image from "next/image";

export default function PlaceListPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [placeLists, setPlaceLists] = useState<PlaceList[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [isPublic, setIsPublic] = useState(false);

  useEffect(() => {
    fetchPlaceLists();
  }, []);

  const fetchPlaceLists = async () => {
    setLoading(true);
    try {
      if (user) {
        const data = await getUserPlaceList(user.uid);
        setPlaceLists(data ? [data] : []);
      }
    } catch (error) {
      console.error("Failed to fetch PlaceLists:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSavePlaceList = async () => {
    if (!title.trim()) {
      alert("Title is required");
      return;
    }

    if (!user) {
      alert("User not authenticated");
      return;
    }

    try {
      const newPlaceList = await createPlaceList(
        user.uid,
        title,
        notes,
        isPublic
      );
      if (newPlaceList) {
        setPlaceLists([...placeLists, newPlaceList]);
        setTitle(""); // Reset form
        setNotes("");
        setIsPublic(false);
      }
    } catch (error) {
      console.error("Failed to save PlaceList:", error);
      alert("Failed to create PlaceList");
    }
  };

  const handleDetailPlaceList = (placeListId: string) => {
    router.push(`/placelists/${placeListId}`); // Adjust route as needed
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
              <span>Beranda</span>
              <span>›</span>
              <span className="text-red-600 font-medium">Daftar Tempat</span>
            </nav>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Daftarkan Tempat Kesukaanmu!
            </h1>
          </div>

          {/* Create PlaceList Form */}
          <div className="bg-white rounded-lg shadow-sm border-2 border-dashed border-red-200 p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              {/* Title Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Daftar Tempat
                </label>
                <input
                  type="text"
                  placeholder="Rencana jalan-jalan"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                />
              </div>

              {/* Notes Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Catatan
                </label>
                <input
                  type="text"
                  placeholder="Tambah Catatan"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                />
              </div>

              {/* Public Toggle and Submit */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <span className="text-sm text-gray-700 mr-2">Publik</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isPublic}
                      onChange={(e) => setIsPublic(e.target.checked)}
                      className="sr-only"
                    />
                    <div
                      className={`w-11 h-6 rounded-full transition-colors ${
                        isPublic ? "bg-red-600" : "bg-gray-300"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                          isPublic ? "translate-x-5" : "translate-x-0"
                        } mt-0.5 ml-0.5`}
                      ></div>
                    </div>
                  </label>
                </div>
                <button
                  onClick={handleSavePlaceList}
                  className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Simpan
                </button>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="bg-white rounded-lg shadow-sm border-2 border-dashed border-red-200 p-6">
            <h2 className="text-xl font-semibold text-black mb-6">
              Daftar Tempat Saya
            </h2>
            {placeLists.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {placeLists.map((placeList) => (
                  <div
                    key={placeList.id}
                    onClick={() => handleDetailPlaceList(placeList.id)}
                    className="bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <Image
                      className="w-full h-32 object-cover rounded-lg mb-4"
                      src="/assets/card_mcd.png"
                      alt="Place List Image"
                      width={400}
                      height={200}
                    />
                    <h3 className="text-lg font-semibold text-gray-800">
                      {placeList.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {placeList.notes || "No notes"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {placeList.isPublic ? "Public" : "Private"} • Created:{" "}
                      {new Date(placeList.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-500">
                      {placeList.restaurantId.length} restaurant
                      {placeList.restaurantId.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState />
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
