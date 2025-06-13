import { ReactNode } from "react";
import Image from "next/image";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="w-full md:w-3/5 bg-gradient-to-b from-[#B80A00] to-[#dcb3b3] flex items-center justify-center p-6 md:p-10 order-2 md:order-1">
        <div className="flex flex-col justify-center items-center md:items-start text-white text-center md:text-left max-w-xl">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
            Bingung <label className="text-[#FEE0AD]">Mau</label>
          </h1>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
            <label className="text-[#FEE0AD]">Makan</label> Apa?
          </h1>
          <p className="text-md sm:text-lg mb-8">
            Lihat dulu review-nya di MakanGo! <br />
            Temukan rasa yang cocok, dan tinggalkan jejakmu lewat ulasan.
          </p>
          <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg mx-auto">
            <Image
              src="/assets/Group8491-1.png"
              alt="Woman with food"
              width={500}
              height={500}
              layout="responsive"
              className="object-contain"
            />
          </div>
        </div>
      </div>
      <div className="w-full md:w-2/5 bg-white flex items-center justify-center p-6 md:p-10 order-1 md:order-2">
        <div className="w-full max-w-sm md:max-w-md">{children}</div>
      </div>
    </div>
  );
}
