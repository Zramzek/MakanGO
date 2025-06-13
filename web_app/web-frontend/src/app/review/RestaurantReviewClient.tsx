"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { SearchIcon } from "lucide-react";
import { useAuth } from "../utils/AuthContext";
import MainLayout from "../components/MainLayout";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { FormEvent, useEffect, useState } from "react";
import { Restaurant } from "../services/restaurant";
import RestaurantCard from "../components/RestaurantCard";
import EmptyState from "../components/EmptyStatePlacelist";

interface HeroSectionProps {
  isAuthenticated: boolean;
}

function HeroSection({ isAuthenticated }: HeroSectionProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRestaurants() {
      try {
        setLoading(true);
        const querySnapshot = await getDocs(collection(db, "Restaurant"));
        const fetchedRestaurants = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Restaurant[];
        setRestaurants(fetchedRestaurants);
      } catch (err) {
        console.error("Error fetching restaurants:", err);
        setError("Gagal memuat restoran.");
      } finally {
        setLoading(false);
      }
    }

    fetchRestaurants();
  }, []);

  useEffect(() => {
    const filterRestaurants = () => {
      try {
        const filtered = restaurants.filter((restaurant) => {
          const nameMatch =
            !searchTerm ||
            restaurant.name.toLowerCase().includes(searchTerm.toLowerCase());
          return nameMatch;
        });

        const sortedResults = [...filtered].sort((a, b) => {
          switch (sortBy) {
            case "rating":
              return (b.rating || 0) - (a.rating || 0);
            case "reviews":
              return (b.reviews || 0) - (a.reviews || 0);
            case "name":
              return a.name.localeCompare(b.name);
            case "newest":
            default:
              return 0; // Assume Firestore returns newest first
          }
        });

        setFilteredRestaurants(sortedResults);
      } catch (error) {
        console.error("Error filtering restaurants:", error);
        setFilteredRestaurants([]);
      }
    };

    filterRestaurants();
  }, [restaurants, searchTerm, sortBy]);

  const handleSearchSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      console.log("All search fields are empty");
      return;
    }
    // Trigger filtering via state update (already handled by useEffect)
    console.log(`Searching for: ${searchTerm}`);
  };

  const handleDetailRestaurant = (restaurantId: string) => {
    if (!isAuthenticated) {
      router.push("/auth/login");
    } else {
      router.push(`/restaurants/${restaurantId}`);
    }
  };

  return (
    <section className="bg-gradient-to-b from-[#FADBD8] via-[#FDF0EF] to-[#FDF2F2] py-16 md:py-20 text-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-8xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-800 mb-3 sm:mb-4 leading-tight">
            Bingung mau Makan apa?
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-8 sm:mb-10">
            Temukan beragam review di MakanGo
          </p>

          <form
            onSubmit={handleSearchSubmit}
            className="bg-white p-2 rounded-xl shadow-xl ring-1 ring-gray-200/50 focus-within:ring-2 focus-within:ring-red-500 transition-all duration-150 ease-in-out mb-8"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center">
                <SearchIcon className="text-gray-500 ml-3 mr-2 h-5 w-5 flex-shrink-0" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Cari nama restoran..."
                  className="w-full py-2 text-gray-700 focus:outline-none text-sm placeholder-gray-400 bg-transparent"
                />
              </div>
            </div>
            <button
              type="submit"
              className="hidden"
              aria-label="Search"
            ></button>
          </form>

          {/* Results Section */}
          <div className="bg-white rounded-lg shadow-sm border-2 border-dashed border-red-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-black">
                {searchTerm ? "Hasil Pencarian" : "Tempat Terpopuler!"}
              </h2>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-black">Diurut berdasarkan:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="text-sm border border-gray-300 text-black rounded px-3 py-1 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                >
                  <option value="newest">Baru dibuat</option>
                  <option value="rating">Rating Tertinggi</option>
                  <option value="reviews">Ulasan Terbanyak</option>
                  <option value="name">Nama A-Z</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-600"></div>
                <p className="ml-2 text-gray-600">Memuat restoran...</p>
              </div>
            ) : error ? (
              <p className="text-center text-red-500 font-medium">{error}</p>
            ) : filteredRestaurants.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredRestaurants.map((restaurant) => (
                  <RestaurantCard
                    key={restaurant.id}
                    restaurant={restaurant}
                    onClick={() => handleDetailRestaurant(restaurant.id)}
                  />
                ))}
              </div>
            ) : (
              <EmptyState />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function KulinerCategoriesSection({
  isAuthenticated,
}: {
  isAuthenticated: boolean;
}) {
  const router = useRouter();
  const categories = [
    { name: "Terdekat", icon: "/assets/kategori_terdekat.png" },
    { name: "Nusantara", icon: "/assets/kategori_nusantara.png" },
    { name: "Bakmie", icon: "/assets/kategori_bakmie.png" },
    { name: "Jepanese", icon: "/assets/kategori_japanese.png" },
    { name: "Chinese", icon: "/assets/kategori_chinese.png" },
    { name: "Jajanan", icon: "/assets/kategori_jajanan.png" },
    { name: "Minuman", icon: "/assets/kategori_minuman.png" },
    { name: "Sarapan", icon: "/assets/kategori_sarapan.png" },
    { name: "Penutup", icon: "/assets/kategori_sweets.png" },
    { name: "Cepat saji", icon: "/assets/kategori_cepatsaji.png" },
    { name: "Seafood", icon: "/assets/kategori_seafoods.png" },
    { name: "Makanan sehat", icon: "/assets/kategori_makanansehat.png" },
  ];

  const handleCategoryClick = (categoryName: string) => {
    if (!isAuthenticated) {
      router.push("/auth/login");
    } else {
      router.push(`/category/${categoryName.toLowerCase()}`);
    }
  };

  return (
    <section className="py-12 md:py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-10 md:mb-12">
          Aneka Kuliner Menarik
        </h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 md:gap-6">
          {categories.map((category) => (
            <button
              key={category.name}
              onClick={() => handleCategoryClick(category.name)}
              className={`flex flex-col items-center p-3 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center ${
                isAuthenticated ? "bg-white" : "bg-gray-200 cursor-not-allowed"
              }`}
              disabled={!isAuthenticated}
            >
              <Image
                src={category.icon}
                alt={category.name}
                width={64}
                height={64}
                className="object-contain mb-2"
              />
              <span className="text-sm font-medium text-gray-700">
                {category.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();

  if (authLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-screen">
          <p className="text-gray-600">Loading...</p>
        </div>
      </MainLayout>
    );
  }

  const isAuthenticated = !!user;

  return (
    <MainLayout
      title="MakanGo - Review Makanan & Restoran"
      description="Cari review makanan, restoran, kuliner populer dan menarik di MakanGo."
    >
      <HeroSection isAuthenticated={isAuthenticated} />
      <KulinerCategoriesSection isAuthenticated={isAuthenticated} />
    </MainLayout>
  );
}
