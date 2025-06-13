import React from "react";
import Sidebar from "../components/sidebar";
import ProfileForm from "../components/profileForm";
import MainLayout from "@/app/components/MainLayout";

const DetailProfilePage = () => {
  return (
    <MainLayout
      title="MakanGo - Review Makanan & Restoran"
      description="Cari review makanan, restoran, kuliner populer dan menarik di MakanGo."
    >
      <div className="flex min-h-screen">
        <Sidebar active="detail" />
        <main className="flex-1 bg-gray-50 p-10">
          <h2 className="text-2xl font-bold text-red-600 mb-6">
            Detail Profil
          </h2>
          <ProfileForm />
        </main>
      </div>
    </MainLayout>
  );
};

export default DetailProfilePage;
