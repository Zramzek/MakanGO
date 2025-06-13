"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import AuthLayout from "../../components/AuthLayout";
import { registerUser } from "../../services/auth"; // Adjust the import path as necessary
import { FirebaseError } from "firebase/app";

export default function Register() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Client-side validation
    if (name.length < 2) {
      setError("Nama harus memiliki minimal 2 karakter.");
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Format email tidak valid.");
      setLoading(false);
      return;
    }

    // Basic password strength validation
    if (
      password.length < 6 ||
      !/[A-Z]/.test(password) ||
      !/[0-9]/.test(password)
    ) {
      setError(
        "Kata sandi harus minimal 6 karakter, mengandung huruf besar, dan angka."
      );
      setLoading(false);
      return;
    }

    try {
      await registerUser(email, password, name);
      router.push("/auth/login");
    } catch (error: unknown) {
      const firebaseError = error as FirebaseError;
      if (firebaseError.code === "auth/email-already-in-use") {
        setError("Email sudah terdaftar. Silakan gunakan email lain.");
      } else if (firebaseError.code === "auth/weak-password") {
        setError("Kata sandi terlalu lemah. Gunakan minimal 6 karakter.");
      } else if (firebaseError.code === "auth/invalid-email") {
        setError("Format email tidak valid.");
      } else {
        setError(firebaseError.message || "Terjadi kesalahan saat pendaftaran");
      }
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <AuthLayout>
      <div className="flex justify-start items-center mb-6">
        <Image
          src="/assets/Group76.png"
          alt="MakanGo Logo"
          width={100}
          height={30}
          className="object-contain"
        />
      </div>

      <h3 className="text-2xl text-left text-gray-800 font-bold mb-1">
        Registrasi akun!
      </h3>
      <p className="text-gray-600 mb-6 text-left text-sm">
        Email yang Anda masukkan belum terdaftar.
      </p>

      {error && <p className="text-red-500 text-sm mb-4 text-left">{error}</p>}

      <form onSubmit={handleRegister} className="w-full space-y-4">
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">
            Nama lengkap <span className="text-red-600">*</span>
          </label>
          <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-red-500 focus-within:border-red-500">
            <User className="mr-2 text-gray-400" size={20} />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masukkan nama Anda"
              className="w-full outline-none text-gray-800 placeholder-gray-400 text-sm"
              required
              disabled={loading}
            />
          </div>
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">
            Email <span className="text-red-600">*</span>
          </label>
          <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-red-500 focus-within:border-red-500">
            <Mail className="mr-2 text-gray-400" size={20} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Masukkan email Anda"
              className="w-full outline-none text-gray-800 placeholder-gray-400 text-sm"
              required
              disabled={loading}
            />
          </div>
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">
            Kata sandi <span className="text-red-600">*</span>
          </label>
          <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-red-500 focus-within:border-red-500">
            <Lock className="mr-2 text-gray-400" size={20} />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan kata sandi Anda"
              className="w-full outline-none text-gray-800 placeholder-gray-400 text-sm"
              required
              disabled={loading}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="ml-2 text-gray-400 hover:text-gray-600"
              aria-label={
                showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"
              }
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-600 text-white py-2.5 rounded-lg hover:bg-red-700 transition duration-150 font-medium text-sm disabled:bg-red-400"
        >
          {loading ? "Mendaftar..." : "Daftar"}
        </button>
      </form>

      <p className="mt-6 text-gray-600 text-center text-sm">
        Anda telah memiliki akun?{" "}
        <Link
          href="/auth/login"
          className="text-red-600 hover:underline font-medium"
        >
          Masuk
        </Link>
      </p>
    </AuthLayout>
  );
}
