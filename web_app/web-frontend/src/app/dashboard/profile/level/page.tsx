import React from "react";
import Sidebar from "../components/sidebar";
import LevelPage from "../components/levelPage";
import MainLayout from "@/app/components/MainLayout";

const LevelProfilePage = () => {
  return (
    <MainLayout
      title="MakanGo - Review Makanan & Restoran"
      description="Cari review makanan, restoran, kuliner populer dan menarik di MakanGo."
    >
      <div className="flex min-h-screen">
        <Sidebar active="detail" />
        <main className="flex-1 bg-gray-50 p-10">
          <LevelPage />
        </main>
      </div>
    </MainLayout>
  );
};

export default LevelProfilePage;
