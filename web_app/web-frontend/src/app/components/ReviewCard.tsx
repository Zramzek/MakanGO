import Image from "next/image";

export default function ReviewCard() {
  return (
    <div className="border p-4 rounded-xl shadow-sm">
      <div className="flex items-center gap-3 mb-2">
        <Image
          src="/assets/placeholder.png"
          alt="user"
          width={40}
          height={40}
          className="rounded-full"
        />
        <div>
          <p className="font-semibold">Potretmakanan</p>
          <p className="text-xs text-gray-500">20 Januari 2025</p>
        </div>
      </div>
      <p className="text-sm text-gray-700 mb-2">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt.
      </p>
      <div className="flex gap-2">
        <Image
          src="/assets/placeholder.png"
          alt="review"
          width={80}
          height={80}
          className="rounded-lg"
        />
        <Image
          src="/assets/placeholder.png"
          alt="review"
          width={80}
          height={80}
          className="rounded-lg"
        />
      </div>
    </div>
  );
}
