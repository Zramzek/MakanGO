// app/dashboard/page.tsx
"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Star, Edit3 } from "lucide-react";
import { useAuth } from "../utils/AuthContext";
import MainLayout from "../components/MainLayout";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useEffect, useState } from "react";
import { Restaurant } from "../interface/Restaurant";

function HeroSection({ isAuthenticated }: { isAuthenticated: boolean }) {
  const router = useRouter();

  const handleExplore = () => {
    if (!isAuthenticated) {
      router.push("/auth/login");
    } else {
      // Handle search logic for authenticated users (e.g., redirect to search results)
      console.log("Explore clicked");
      router.push("/search");
    }
  };

  return (
    <section className="relative bg-gradient-to-b from-[#B80A00] to-[#ffffff] text-white py-16 md:py-24 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="text-center md:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
              Bingung Mau <br className="hidden sm:block" />
              Makan Apa?
            </h1>
            <p className="text-lg sm:text-xl text-gray-200 mb-8">
              {isAuthenticated
                ? "Temukan rasa yang cocok dengan review di MakanGo!"
                : "Masuk untuk melihat review dan menemukan kuliner terbaik!"}
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
              {/* <div className="relative w-full sm:flex-grow">
                  <MapPin
                    size={20}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    placeholder="Ketik lokasi kamu"
                    className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                    disabled={!isAuthenticated}
                  />
                </div> */}
              <button
                onClick={handleExplore}
                className={`w-full sm:w-auto px-6 py-2.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                  isAuthenticated
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : "bg-gray-300 text-gray-700 cursor-not-allowed"
                }`}
              >
                Jelajahi
              </button>
            </div>
          </div>
          <div className="hidden md:flex justify-center items-center">
            <Image
              src="/assets/Group8491-1.png"
              alt="Kuliner lezat"
              width={550}
              height={550}
              className="object-contain"
              priority
            />
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

function PopularRestaurantSection({
  isAuthenticated,
}: {
  isAuthenticated: boolean;
}) {
  const router = useRouter();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
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
        setError("Gagal memuat tempat populer.");
      } finally {
        setLoading(false);
      }
    }

    fetchRestaurants();
  }, []);

  const handleAddReview = (restaurantId: string) => {
    if (!isAuthenticated) {
      router.push("/auth/login");
    } else {
      router.push(`/restaurants/${restaurantId}/review`);
    }
  };

  const handleDetailRestaurant = (
    e: React.MouseEvent | React.KeyboardEvent,
    restaurantId: string
  ) => {
    e.preventDefault();
    if (!isAuthenticated) {
      router.push("/auth/login");
    } else {
      router.push(`/restaurants/${restaurantId}`);
    }
  };

  // const normalizeImagePath = (path: string | undefined): string => {
  //   if (!path || !path.startsWith("https://")) {
  //     return "/assets/placeholder-detail.png";
  //   }
  //   return path;
  // };

  if (loading) {
    return (
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-600"></div>
            <p className="ml-2 text-gray-600">Memuat tempat populer...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-red-500 font-medium">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-3">
          Apa Saja Tempat Populer Terdekat?
        </h2>
        <p className="text-center text-gray-600 mb-10 md:mb-12">
          {isAuthenticated
            ? "Temukan koleksi hidangan populer, favorit lokal, dan penawaran terbaik di lingkungan Anda."
            : "Masuk untuk melihat tempat populer dan menulis ulasan!"}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {restaurants.length === 0 ? (
            <p className="text-center text-gray-600 font-medium col-span-full">
              Tidak ada tempat populer ditemukan.
            </p>
          ) : (
            restaurants.map((restaurant) => (
              <div
                key={restaurant.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col"
              >
                <div
                  role="button"
                  tabIndex={0}
                  className="cursor-pointer"
                  onClick={(e) => handleDetailRestaurant(e, restaurant.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      handleDetailRestaurant(e, restaurant.id);
                    }
                  }}
                >
                  <Image
                    role="button"
                    src={`/${restaurant.imagePath}`}
                    alt={restaurant.name}
                    width={400}
                    height={200}
                    className="w-full h-40 object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/assets/placeholder.jpg";
                      e.currentTarget.alt = "Placeholder Image";
                    }}
                  />
                </div>

                <div className="p-4 flex flex-col flex-grow">
                  <div className="flex items-center justify-between mb-1">
                    <span className="inline-flex items-center bg-yellow-400 text-white text-xs font-semibold px-2 py-0.5 rounded">
                      <Star size={12} className="mr-1 fill-current" />{" "}
                      {restaurant.rating?.toFixed(1) || "N/A"}
                    </span>
                    <span className="text-xs text-gray-500">
                      {restaurant.reviews || 0} Reviews
                    </span>
                  </div>
                  <h3 className="text-md font-semibold text-gray-800 mb-1 truncate">
                    {restaurant.name}
                  </h3>
                  <p className="text-xs text-gray-500 mb-1">
                    {restaurant.time || "Tidak tersedia"}
                  </p>
                  <p className="text-xs text-gray-500 mb-3">
                    {restaurant.category || "Tidak dikategorikan"}
                  </p>
                  <button
                    onClick={() => handleAddReview(restaurant.id)}
                    className={`mt-auto w-full px-4 py-2 rounded-md text-xs font-medium transition-colors flex items-center justify-center ${
                      isAuthenticated
                        ? "bg-red-100 text-red-700 hover:bg-red-200"
                        : "bg-gray-300 text-gray-700 cursor-not-allowed"
                    }`}
                    disabled={!isAuthenticated}
                  >
                    <Edit3 size={14} className="mr-1.5" /> Tambah ulasan
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

function WhyMakanGoSection({ isAuthenticated }: { isAuthenticated: boolean }) {
  const features = [
    {
      title: "Menemukan Tempat Makan",
      description:
        "Putuskan pilihan Anda dengan melihat apa yang dikatakan orang lain tentang restoran tersebut.",
      icon: "/assets/fitur-1.png",
    },
    {
      title: "Mengulas & Dapatkan XP",
      description: isAuthenticated
        ? "Bagikan pemikiran Anda dan dapatkan XP untuk setiap ulasan. Berbagi berarti peduli!"
        : "Masuk untuk mengulas dan dapatkan XP!",
      icon: "/assets/fitur-2.png",
    },
    {
      title: "Naik Level, Dapatkan Keuntungan!",
      description: isAuthenticated
        ? "Naik level untuk membuka hadiah dan fasilitas khusus."
        : "Masuk untuk naik level dan dapatkan keuntungan!",
      icon: "/assets/fitur-3.png",
    },
  ];

  return (
    <section className="py-12 md:py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-10 md:mb-12">
          Mengapa Menggunakan MakanGo?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-[#B80A00] text-white p-4 rounded-xl shadow-lg text-center flex flex-col items-center"
            >
              <Image
                src={feature.icon}
                alt={feature.title}
                width={400}
                height={300}
                className="object-contain mb-4"
              />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-200 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Dashboard() {
  const { user, loading } = useAuth();
  // const router = useRouter();

  if (loading) {
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
      <PopularRestaurantSection isAuthenticated={isAuthenticated} />
      <WhyMakanGoSection isAuthenticated={isAuthenticated} />
    </MainLayout>
  );
}
