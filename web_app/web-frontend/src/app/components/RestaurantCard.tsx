import Image from "next/image";
import { Restaurant } from "../services/restaurant";

interface RestaurantCardProps {
  restaurant: Restaurant;
  onClick?: () => void;
}

export default function RestaurantCard({
  restaurant,
  onClick,
}: RestaurantCardProps) {
  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
      onClick={onClick}
    >
      <div className="relative h-52 w-full">
        <Image
          src={`/${restaurant.imagePath}`}
          alt={restaurant.name}
          fill
          className="object-cover"
          onError={(e) => {
            e.currentTarget.src =
              "https://placehold.co/400x300/E5E7EB/9CA3AF?text=No+Image";
          }}
        />
      </div>

      <div className="p-4">
        <div className="mb-2">
          <span className="text-xs text-gray-500 block">
            Daftar Tempat Publik
          </span>
          <h3 className="text-lg font-semibold text-gray-800 mt-1 line-clamp-1">
            {restaurant.name}
          </h3>
          <p className="text-sm text-gray-600 mt-1">{restaurant.address}</p>
        </div>

        <p className="text-sm italic text-gray-600 mt-1">“Wow!”</p>
      </div>
    </div>
  );
}
