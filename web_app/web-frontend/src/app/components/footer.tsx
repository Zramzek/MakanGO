import Image from "next/image"; // For logo and app mockups

export default function Footer() {
  return (
    <footer className="bg-[#B80A00] text-white">
      {" "}
      {/* Main red background from hero */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-7 lg:col-span-6 text-center md:text-left">
            {/* Replace with your actual logo - white version or adjust styling */}
            <Image
              src="/assets/Group-76-1.png"
              alt="MakanGo Logo"
              width={180}
              height={50}
              className="object-contain mb-6 mx-auto md:mx-0 filter brightness-0 invert"
            />
            <h3 className="text-2xl sm:text-3xl font-bold mb-3">
              Rasanya seperti memiliki kumpulan restoran enak di saku Anda
            </h3>
            <p className="text-base sm:text-lg text-gray-200 mb-6">
              Cari berbagai macam makanan, ulasan, dan fitur mengulas di
              MakanGo.
            </p>
            <div className="mt-10 md:mt-12 border-red-500 pt-6 text-gray-300">
              <p>
                &copy; {new Date().getFullYear()} MakanGo | ABP Kelompok 4. All
                rights reserved.
              </p>
            </div>
          </div>

          {/* Right Column: App Mockups */}
          <div className="md:col-span-5 lg:col-span-6 flex justify-center md:justify-end">
            <div className="relative flex items-end h-64 md:h-80">
              <Image
                src="/assets/footer-hp.png"
                alt="MakanGo App Mockup 1"
                width={300}
                height={700}
                className="object-contain relative z-10 transform -translate-x-4 md:-translate-x-8"
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
