import React from "react";
import Image from "next/image";

const ReviewEmptyState = () => {
  return (
    <div className="bg-white rounded-lg shadow p-10 flex flex-col items-center justify-center text-center">
      <Image src="/empty-review.png" alt="Empty review" className="w-40 mb-6" />
      <h3 className="text-lg font-semibold mb-2">Tulis ulasan pertama Anda!</h3>
      <p className="text-gray-500">
        Anda belum memiliki ulasan, mulailah membuatnya
      </p>
    </div>
  );
};

export default ReviewEmptyState;
