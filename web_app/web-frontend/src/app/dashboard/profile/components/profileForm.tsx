"use client";

import React, { useState, useEffect } from "react";
import { FaEdit } from "react-icons/fa";
import { getUserById, updateUser, User } from "@/app/services/user";
import { useAuth } from "../../../utils/AuthContext"; // Adjust import path as needed

const ProfileForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const { user: authUser } = useAuth();

  useEffect(() => {
    const loadUserData = async () => {
      if (!authUser?.uid) return;

      try {
        const userData = await getUserById(authUser.uid);
        if (userData) {
          setUser(userData);
          setFormData({
            name: userData.name,
            username: userData.username,
            email: userData.email,
          });
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [authUser?.uid]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!user?.id) return;

    setIsSaving(true);
    try {
      const success = await updateUser(user.id, {
        name: formData.name,
        username: formData.username,
      });

      if (success) {
        setUser((prev) =>
          prev
            ? { ...prev, name: formData.name, username: formData.username }
            : null
        );
        alert("Profile updated successfully!");
      } else {
        alert("Failed to update profile. Please try again.");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("An error occurred while saving. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-10 flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-10 flex gap-12 items-start">
      {/* Form Section */}
      <div className="flex-1 space-y-6">
        <section>
          <h3 className="font-semibold text-gray-700 mb-2">
            Info Profil <span title="Informasi profil pengguna">ⓘ</span>
          </h3>
          <InputField
            name="name"
            label="Nama"
            value={formData.name}
            onChange={handleChange}
            disabled={false}
          />
          <InputField
            name="username"
            label="Username"
            value={formData.username}
            onChange={handleChange}
            disabled={false}
          />
        </section>

        <section>
          <h3 className="font-semibold text-red-600 mb-2">
            Info Pribadi <span title="Informasi pribadi pengguna">ⓘ</span>
          </h3>
          <InputField
            name="email"
            label="Email"
            value={formData.email}
            onChange={handleChange}
            disabled={true}
          />
        </section>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-gradient-to-r from-red-500 to-red-600 text-white font-bold py-2 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? "Menyimpan..." : "Simpan"}
        </button>
      </div>
    </div>
  );
};

type InputProps = {
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
};

const InputField: React.FC<InputProps> = ({
  name,
  label,
  value,
  onChange,
  disabled = false,
}) => (
  <div className="mb-4">
    <label className="text-sm text-gray-600 block mb-1">{label}</label>
    <div className="relative">
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full border rounded-full px-4 py-2 pr-10 focus:outline-none text-black focus:ring-2 focus:ring-red-300 ${
          disabled ? "bg-gray-100 cursor-not-allowed text-gray-500" : ""
        }`}
      />
      {!disabled && (
        <FaEdit className="absolute right-3 top-2.5 text-gray-400" />
      )}
    </div>
  </div>
);

export default ProfileForm;
