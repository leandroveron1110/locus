// SkeletonGallery.tsx
export const SkeletonGallery = () => {
  return (
    <div className="grid grid-cols-3 gap-2 animate-pulse">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-xl"
        ></div>
      ))}
    </div>
  );
};