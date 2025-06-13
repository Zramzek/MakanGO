// src/app/components/RestaurantDetail.tsx
import Image from "next/image";
import { Restaurant } from "@/app/services/restaurant";
import ReviewList from "./ReviewList";

export default function RestaurantDetail({
  restaurant,
}: {
  restaurant: Restaurant;
}) {
  const { name, address, category, imagePath, rating, reviews, time } =
    restaurant;

  const handleSavePlace = () => console.log("Saved place");
  const handleGetDirection = () => console.log("Getting directions");

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="rounded-xl overflow-hidden shadow">
        <Image
          src={imagePath || "/assets/placeholder.png"}
          alt={name}
          width={800}
          height={400}
          className="w-full h-60 object-cover"
        />
        <div className="p-4 space-y-3">
          <h1 className="text-2xl font-bold">{name}</h1>
          <p className="text-gray-600">{category}</p>
          <p className="text-sm text-gray-500">🕒 {time}</p>
          <p className="text-sm text-gray-500">📍 {address}</p>

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-2">
              <div className="bg-red-500 text-white px-2 py-1 rounded text-sm font-semibold">
                ⭐ {rating.toFixed(1)}
              </div>
              <span className="text-sm text-gray-500">({reviews})</span>
            </div>
            <div className="space-x-2">
              <button
                onClick={handleSavePlace}
                className="px-4 py-2 border rounded-lg text-sm"
              >
                Simpan Tempat
              </button>
              <button
                onClick={handleGetDirection}
                className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm"
              >
                Dapatkan Arah
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <button className="bg-red-500 text-white px-4 py-2 rounded">
          Tambah Ulasan
        </button>
      </div>

      <ReviewList />
    </div>
  );
}
