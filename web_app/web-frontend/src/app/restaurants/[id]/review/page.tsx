"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getRestaurantById, Restaurant } from "../../../services/restaurant";
import { useAuth } from "../../../utils/AuthContext";
import { FaStar, FaCamera, FaVideo, FaArrowLeft } from "react-icons/fa";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import Image from "next/image";
import MainLayout from "../../../components/MainLayout";

export default function RestaurantReviewPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const id = params?.id as string;

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [description, setDescription] = useState("");
  const [foodRating, setFoodRating] = useState(0);
  const [serviceRating, setServiceRating] = useState(0);
  const [ambianceRating, setAmbianceRating] = useState(0);
  const [photos, setPhotos] = useState<File[]>([]);
  const [video, setVideo] = useState<File | null>(null);

  useEffect(() => {
    if (!user) {
      router.push(`/restaurants/${id}`);
      return;
    }

    const fetchRestaurant = async () => {
      try {
        const restaurantData = await getRestaurantById(id);
        setRestaurant(restaurantData);
      } catch (error) {
        console.error("Error fetching restaurant:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, [id, user, router]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newPhotos = Array.from(e.target.files);
      setPhotos((prev) => [...prev, ...newPhotos].slice(0, 5)); // Max 5 photos
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVideo(e.target.files[0]);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const removeVideo = () => {
    setVideo(null);
  };

  const renderStarRating = (
    rating: number,
    setRating: (rating: number) => void,
    label: string
  ) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            className={`text-2xl ${
              star <= rating ? "text-yellow-400" : "text-gray-300"
            } hover:text-yellow-400 transition-colors`}
          >
            <FaStar />
          </button>
        ))}
      </div>
    </div>
  );

  const uploadPhotos = async (): Promise<string[]> => {
    const photoUrls: string[] = [];

    for (let i = 0; i < photos.length; i++) {
      const photo = photos[i];
      const photoRef = ref(
        storage,
        `reviews/${user!.uid}/${Date.now()}_photo_${i}.${photo.name
          .split(".")
          .pop()}`
      );

      try {
        const snapshot = await uploadBytes(photoRef, photo);
        const downloadURL = await getDownloadURL(snapshot.ref);
        photoUrls.push(downloadURL);
      } catch (error) {
        console.error(`Error uploading photo ${i}:`, error);
        throw new Error(`Gagal mengupload foto ${i + 1}`);
      }
    }

    return photoUrls;
  };

  const uploadVideo = async (): Promise<string> => {
    if (!video) return "";

    const videoRef = ref(
      storage,
      `reviews/${user!.uid}/${Date.now()}_video.${video.name.split(".").pop()}`
    );

    try {
      const snapshot = await uploadBytes(videoRef, video);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (error) {
      console.error("Error uploading video:", error);
      throw new Error("Gagal mengupload video");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !restaurant) return;

    if (
      !description.trim() ||
      foodRating === 0 ||
      serviceRating === 0 ||
      ambianceRating === 0
    ) {
      alert("Mohon lengkapi semua field yang diperlukan");
      return;
    }

    setSubmitting(true);

    try {
      const averageRating = (foodRating + serviceRating + ambianceRating) / 3;

      // Upload photos and video to Firebase Storage
      let photoUrls: string[] = [];
      let videoUrl = "";

      if (photos.length > 0) {
        photoUrls = await uploadPhotos();
      }

      if (video) {
        videoUrl = await uploadVideo();
      }

      // Save review to Firestore with actual URLs
      await addDoc(collection(db, "Review"), {
        restaurantId: id,
        userId: user.uid,
        description: description.trim(),
        likes: 0,
        ambianceRating,
        foodRating,
        serviceRating,
        averageRating,
        photoUrls,
        videoUrl,
        createdAt: Timestamp.now(),
      });

      alert("Ulasan berhasil ditambahkan!");
      router.push(`/restaurants/${id}`);
    } catch (error) {
      console.error("Error adding review:", error);
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Gagal menambahkan ulasan. Coba lagi.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat...</p>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Restoran tidak ditemukan</p>
        </div>
      </div>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 py-6">
          {/* Header */}
          <div className="mb-6">
            <button
              onClick={() => router.back()}
              className="flex items-center text-gray-600 hover:text-gray-800 mb-4"
            >
              <FaArrowLeft className="mr-2" />
              Kembali
            </button>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Beri tahu kami tentang pengalaman kuliner Anda
            </h1>
            <div className="flex items-center">
              <Image
                width={200}
                height={200}
                src={`/${restaurant.imagePath}`}
                alt={restaurant.name}
                className="w-16 h-16 rounded-lg object-cover mr-4"
              />
              <div>
                <h2 className="font-semibold text-black text-lg">
                  {restaurant.name}
                </h2>
                <p className="text-gray-600 text-sm">{restaurant.address}</p>
              </div>
            </div>
          </div>

          {/* Review Form */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <form onSubmit={handleSubmit}>
              {/* Description */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tulis ulasan lebih lengkap
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tulis ulasan Anda disini..."
                  className="w-full p-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                  rows={4}
                  maxLength={500}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {description.length}/500
                </p>
              </div>

              {/* Ratings */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-black mb-4">
                  Rating
                </h3>
                {renderStarRating(foodRating, setFoodRating, "Makanan")}
                {renderStarRating(serviceRating, setServiceRating, "Pelayanan")}
                {renderStarRating(ambianceRating, setAmbianceRating, "Suasana")}
              </div>

              {/* Photo/Video Upload */}
              <div className="mb-6">
                <h3 className="text-lg text-black font-semibold mb-4">
                  Tambahkan Foto atau Video
                </h3>
                <p className="text-sm text-gray-600 mb-4">Opsional</p>

                <div className="flex space-x-4 mb-4">
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                    <div className="flex items-center px-4 py-2 border border-red-600 text-red-600 rounded-full hover:bg-red-50 transition-colors">
                      <FaCamera className="mr-2" />
                      Tambah foto
                    </div>
                  </label>

                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleVideoUpload}
                      className="hidden"
                    />
                    <div className="flex items-center px-4 py-2 border border-red-600 text-red-600 rounded-full hover:bg-red-50 transition-colors">
                      <FaVideo className="mr-2" />
                      Tambah video
                    </div>
                  </label>
                </div>

                {/* Photo Preview */}
                {photos.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {photos.map((photo, index) => (
                      <div key={index} className="relative">
                        <Image
                          width={100}
                          height={100}
                          src={URL.createObjectURL(photo)}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removePhoto(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Video Preview */}
                {video && (
                  <div className="relative mb-4">
                    <video
                      src={URL.createObjectURL(video)}
                      className="w-full h-48 object-cover rounded-lg"
                      controls
                    />
                    <button
                      type="button"
                      onClick={removeVideo}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-full transition-colors"
              >
                {submitting ? "Mengirim ulasan..." : "Kirim ulasan"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
