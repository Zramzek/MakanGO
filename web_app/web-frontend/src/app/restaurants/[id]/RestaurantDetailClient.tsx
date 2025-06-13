/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Head from "next/head";
import Link from "next/link";
import {
  FaStar,
  FaUtensils,
  FaClock,
  FaMapMarkerAlt,
  FaPen,
  FaConciergeBell,
  FaSmile,
  FaBookmark,
  FaRegBookmark,
  FaUser,
} from "react-icons/fa";
import MainLayout from "../../components/MainLayout";
import AuthLayout from "../../components/AuthLayout";
import { useAuth } from "../../utils/AuthContext";
import { getRestaurantById, Restaurant } from "../../services/restaurant";
import { getReviewsByRestaurantId, Review } from "../../services/review";
import { getUserById, User } from "../../services/user";
import {
  removeRestaurantFromPlaceList,
  getUserPlaceList,
  addRestaurantToPlaceList,
} from "../../services/placelist";
import LikeButton from "@/app/components/LikeReview";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function RestaurantDetailClient({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { user } = useAuth();
  const router = useRouter();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [reviews, setReviews] = useState<(Review & { user?: User })[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);

  // ... existing code ... (all the useEffect, handlers, and JSX remain the same)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const restaurantData = await getRestaurantById(id);
        if (!restaurantData) {
          throw new Error("Restoran tidak ditemukan");
        }
        setRestaurant({
          ...restaurantData,
          category: Array.isArray(restaurantData.category)
            ? restaurantData.category.join(", ")
            : typeof restaurantData.category === "string"
            ? restaurantData.category
            : "Tidak ada kategori",
        });

        const reviewData = await getReviewsByRestaurantId(id);
        const reviewsWithUsers = await Promise.all(
          reviewData.map(async (review) => {
            const userData = await getUserById(review.userId);
            return { ...review, user: userData || undefined };
          })
        );
        setReviews(reviewsWithUsers);

        if (user) {
          const placelist = await getUserPlaceList(user.uid);
          const isInList = placelist?.restaurantId.includes(id);
          setIsBookmarked(Boolean(isInList));
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, user]);

  if (loading) {
    return (
      <AuthLayout>
        <div className="text-center py-10 bg-white">
          <p className="text-gray-600">Memuat...</p>
        </div>
      </AuthLayout>
    );
  }

  if (error || !restaurant) {
    return (
      <AuthLayout>
        <div className="text-center py-10 bg-white">
          <p className="text-red-500">{error || "Restoran tidak ditemukan"}</p>
          <button
            onClick={() => router.push("/dashboard")}
            className="mt-4 text-red-600 hover:underline"
          >
            Kembali ke Dashboard
          </button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <MainLayout
      title="MakanGo - Review Makanan & Restoran"
      description="Cari review makanan, restoran, kuliner populer dan menarik di MakanGo."
    >
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="utf-8" />
        <link
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"
          rel="stylesheet"
        />
      </Head>
      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 bg-white">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="text-xs text-gray-400 mb-3 select-none"
        >
          <ol className="flex space-x-1">
            <li>
              <Link href="/dashboard" className="hover:underline">
                Beranda
              </Link>
            </li>
            <li>
              <span className="mx-1 text-red-600 font-semibold">{">"}</span>
            </li>
            <li className="text-red-600 font-semibold">Detail Resto</li>
          </ol>
        </nav>

        {/* Image with rating */}
        <div className="relative rounded-xl overflow-hidden">
          <Image
            src={`/${restaurant.imagePath}`}
            alt={`Exterior photo of ${restaurant.name}`}
            width={600}
            height={200}
            className="w-full h-auto object-cover rounded-xl"
            priority
          />
          <div
            className="absolute bottom-4 right-4 bg-red-600 rounded-md px-3 py-1 flex items-center space-x-2 select-none"
            style={{ minWidth: "56px" }}
          >
            <FaStar className="text-white text-sm" />
            <span className="text-white font-semibold text-sm leading-none">
              {restaurant.rating.toFixed(1)}
            </span>
            <span className="text-white text-xs leading-none font-normal">
              {restaurant.reviews}
            </span>
          </div>
        </div>

        {/* Title and info */}
        <div className="mt-4">
          <h1 className="font-bold text-gray-900 text-lg sm:text-xl lg:text-2xl leading-tight">
            {restaurant.name}
          </h1>
          <div className="mt-1 text-gray-500 text-xs sm:text-sm space-y-1 select-none">
            <p className="flex items-center space-x-1">
              <FaUtensils className="text-gray-400" />
              <span>
                {(Array.isArray(restaurant.category) &&
                restaurant.category.length > 0
                  ? restaurant.category
                  : typeof restaurant.category === "string"
                  ? [restaurant.category]
                  : ["Tidak ada kategori"]
                ).join(", ")}
              </span>
            </p>
            <p className="flex items-center space-x-1">
              <FaClock className="text-gray-400" />
              <span>{restaurant.time}</span>
            </p>
            <p className="flex items-start space-x-1">
              <FaMapMarkerAlt className="text-gray-400 mt-[2px]" />
              <span>{restaurant.address}</span>
            </p>
          </div>
        </div>

        {/* Berkontribusi */}
        <div className="mt-6">
          <h2 className="font-semibold text-gray-900 text-sm sm:text-base mb-2 select-none">
            Berkontribusi
          </h2>
          {user ? (
            <div className="flex space-x-2">
              <button
                onClick={() => router.push(`/restaurants/${id}/review`)}
                className="inline-flex items-center bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-semibold px-4 py-1.5 rounded-full"
              >
                <FaPen className="mr-2 text-xs sm:text-sm" />
                Tambah ulasan
              </button>
              <button
                onClick={async () => {
                  if (!user) return;

                  let result;
                  if (isBookmarked) {
                    result = await removeRestaurantFromPlaceList(user.uid, id);
                    if (result) {
                      setIsBookmarked(false);
                    } else {
                      alert("Gagal menghapus restoran.");
                    }
                  } else {
                    result = await addRestaurantToPlaceList(user.uid, id);
                    if (result) {
                      setIsBookmarked(true);
                    } else {
                      alert("Gagal menyimpan restoran.");
                    }
                  }
                }}
                className={`inline-flex items-center ${
                  isBookmarked
                    ? "bg-red-100 border border-red-600 text-red-600"
                    : "bg-white border border-red-600 text-red-600 hover:bg-red-100"
                } text-xs sm:text-sm font-semibold px-4 py-1.5 rounded-full`}
              >
                {isBookmarked ? (
                  <>
                    <FaRegBookmark className="mr-2 text-xs sm:text-sm" />
                    Buang
                  </>
                ) : (
                  <>
                    <FaBookmark className="mr-2 text-xs sm:text-sm" />
                    Simpan
                  </>
                )}
              </button>
            </div>
          ) : (
            <p className="text-gray-600 text-xs sm:text-sm">
              Masuk untuk memberikan ulasan
            </p>
          )}
        </div>

        {/* Ulasan */}
        <div className="mt-6">
          <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-3 select-none">
            Ulasan
          </h3>
          {reviews.length === 0 ? (
            <p className="text-gray-600 text-xs sm:text-sm">
              Belum ada ulasan untuk restoran ini.
            </p>
          ) : (
            reviews.map((review) => (
              <article key={review.id} className="mb-6">
                <div className="flex items-center space-x-3 mb-1">
                  <div className="flex flex-col">
                    <div className="flex items-center space-x-2">
                      <FaUser className="w-10 h-10  rounded-full object-cover" />
                      <span className="font-semibold text-gray-900 text-xs sm:text-sm select-text">
                        {review.user?.username ||
                          review.user?.name ||
                          "Anonymous"}
                      </span>
                      <span className="bg-red-600 text-white text-[9px] sm:text-xs font-semibold rounded-full px-2 py-[1px] select-text">
                        Level {review.user?.level || 1}
                      </span>
                    </div>
                    <div className="flex space-x-2 text-[9px] sm:text-xs text-gray-400 select-text">
                      <span>{review.user?.jumlah_review || 0} Ulasan</span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2 text-[9px] sm:text-xs text-gray-400 mb-1 select-text">
                  <span className="flex items-center space-x-1">
                    <FaUtensils />
                    <span>Makanan: {review.foodRating.toFixed(1)}</span>
                  </span>
                  <span>·</span>
                  <span className="flex items-center space-x-1">
                    <FaConciergeBell />
                    <span>Pelayanan: {review.serviceRating.toFixed(1)}</span>
                  </span>
                  <span>·</span>
                  <span className="flex items-center space-x-1">
                    <FaSmile />
                    <span>Suasana: {review.ambianceRating.toFixed(1)}</span>
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 mb-1 leading-relaxed select-text">
                  {review.description}
                </p>
                <Link
                  href={`/restaurants/${id}/reviews/${review.id}`}
                  className="text-red-600 text-xs sm:text-sm font-semibold mb-2 inline-block select-text"
                >
                  Lebih banyak
                </Link>
                <div className="flex space-x-1 mb-2 select-none">
                  {/* {review.photoUrls.map((image, imgIndex) => (
                    <Image
                      key={imgIndex}
                      src={image}
                      alt={`Photo of food dish ${imgIndex + 1}`}
                      width={40}
                      height={40}
                      className="rounded-md object-cover w-10 h-10"
                    />
                  ))} */}
                </div>
                <time className="text-[9px] sm:text-xs text-red-600 font-semibold mb-1 block select-text">
                  {formatDate(review.createdAt.toString())}
                </time>
                <div className="flex items-center space-x-1 text-gray-400 text-xs select-none">
                  <LikeButton
                    reviewId={review.id}
                    initialLikes={review.likes}
                  />
                  {/* <span>{review.likes}</span> */}
                </div>
              </article>
            ))
          )}
          <Link
            href={`/restaurants/${id}/reviews`}
            className="text-red-600 font-semibold text-sm sm:text-base select-none inline-block"
          >
            Lihat Semua
          </Link>
        </div>
      </div>
    </MainLayout>
  );
}
