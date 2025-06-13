import Image from "next/image";

interface EmptyStateProps {
  imageSrc?: string;
  title?: string;
  description?: string;
  actionButton?: React.ReactNode;
}

export default function EmptyState({
  imageSrc = "/assets/placelist-notfound.png",
  title = "Anda belum memiliki PlaceList",
  description = "Coba ubah kata kunci pencarian atau filter untuk menemukan tempat yang sesuai",
  actionButton,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="relative w-64 h-64 mb-6">
        <Image
          src={imageSrc}
          alt={title}
          fill
          className="object-contain"
          onError={(e) => {
            e.currentTarget.src =
              "https://placehold.co/300x300/E5E7EB/9CA3AF?text=No+Results";
          }}
        />
      </div>
      <h3 className="text-xl font-semibold text-gray-700 mb-2">{title}</h3>
      <p className="text-gray-500 text-center max-w-md mb-6">{description}</p>
      {actionButton && <div className="mt-4">{actionButton}</div>}
    </div>
  );
}
