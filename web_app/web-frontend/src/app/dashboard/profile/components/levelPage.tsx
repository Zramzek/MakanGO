"use client";

import React, { useState, useEffect } from "react";
import { getUserById, User } from "@/app/services/user";
import { useAuth } from "../../../utils/AuthContext"; // Adjust import path as needed
import Image from "next/image";

const LevelPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user: authUser } = useAuth(); // Assuming you have an auth context

  // Level configuration
  const levels = [
    { level: 1, requiredXP: 0, label: "Level 1", image: "/assets/bronze.png" },
    { level: 2, requiredXP: 10, label: "Level 2", image: "/assets/silver.png" },
    { level: 3, requiredXP: 50, label: "Level 3", image: "/assets/gold.png" },
    {
      level: 4,
      requiredXP: 100,
      label: "Level 4",
      image: "/assets/purple.png",
    },
    { level: 5, requiredXP: 1000, label: "Level 5", image: "/assets/red.png" },
  ];

  const getCurrentXP = () => {
    return user?.jumlah_review * 10 || 0;
  };

  const getNextLevelXP = () => {
    const currentLevel = user?.level || 1;
    const nextLevel = levels.find((l) => l.level > currentLevel);
    return nextLevel
      ? nextLevel.requiredXP
      : levels[levels.length - 1].requiredXP;
  };

  const getXPNeededForNextLevel = () => {
    const currentXP = getCurrentXP();
    const nextLevelXP = getNextLevelXP();
    return Math.max(0, nextLevelXP - currentXP);
  };

  const getProgressPercentage = () => {
    const currentLevel = user?.level || 1;
    const currentXP = getCurrentXP();

    if (currentLevel >= 5) return 100; // Max level reached

    const currentLevelXP =
      levels.find((l) => l.level === currentLevel)?.requiredXP || 0;
    const nextLevelXP = getNextLevelXP();
    const progressXP = currentXP - currentLevelXP;
    const totalNeededXP = nextLevelXP - currentLevelXP;

    return Math.min(100, Math.max(0, (progressXP / totalNeededXP) * 100));
  };

  useEffect(() => {
    const loadUserData = async () => {
      if (!authUser?.uid) return;

      try {
        const userData = await getUserById(authUser.uid);
        if (userData) {
          setUser(userData);
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [authUser?.uid]);

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-lg shadow p-6 flex items-center justify-center">
          <div>Loading...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-lg shadow p-6 flex items-center justify-center">
          <div>User data not found</div>
        </div>
      </div>
    );
  }

  const currentXP = getCurrentXP();
  const xpNeeded = getXPNeededForNextLevel();
  const progressPercentage = getProgressPercentage();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-red-600 mb-2">Level</h1>
      </div>

      {/* Level Card */}
      <div className="bg-white rounded-lg shadow p-6">
        {/* Current Level Display */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Image
              src={levels[user.level - 1].image}
              alt="Level Icon"
              width={60}
              height={60}
              className="rounded-full"
            />
            <div>
              <h2 className="font-semibold text-black text-lg">
                Level {user.level} • {currentXP} XP
              </h2>
            </div>
          </div>
          {user.level < 5 && (
            <div className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-medium">
              {xpNeeded} XP ke Level {user.level + 1}
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            {levels.map((level) => (
              <div key={level.level} className="flex flex-col items-center">
                <div
                  className={`w-4 h-4 rounded-full border-2 ${
                    user.level >= level.level
                      ? "bg-red-500 border-red-500"
                      : "bg-gray-300 border-gray-300"
                  }`}
                />
                <div className="text-xs text-gray-600 mt-1 text-center">
                  <div className="font-medium">{level.label}</div>
                  <div>{level.requiredXP} XP</div>
                </div>
              </div>
            ))}
          </div>

          {/* Progress Line */}
          <div className="relative mt-4 mb-2">
            <div
              className="absolute top-0 left-0 w-full h-1 bg-gray-300 rounded"
              style={{ top: "-18px" }}
            />
            <div
              className="absolute top-0 left-0 h-1 bg-red-500 rounded transition-all duration-300"
              style={{
                top: "-18px",
                width: `${(user.level - 1) * 25 + progressPercentage * 0.25}%`,
              }}
            />
          </div>
        </div>

        {/* Review History Section */}
        <div className="bg-gray-100 rounded-lg p-8 text-center">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Riwayat</h3>

          <div className="mb-6">
            <Image
              src="/assets/Spot-Ilustrations.png"
              alt="Level Person"
              width={250}
              height={190}
              className="mx-auto"
            />
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-gray-800">
              Riwayat Anda kosong!
            </h4>
            <p className="text-gray-600 text-sm">
              Anda belum memiliki ulasan, mulailah membuatnya
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LevelPage;
