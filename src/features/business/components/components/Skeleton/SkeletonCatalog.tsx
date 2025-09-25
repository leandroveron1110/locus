// src/features/catalog/components/SkeletonCatalog.tsx
import React from "react";

export const SkeletonCatalog: React.FC = () => (
  <div className="p-4 space-y-6 rounded-lg bg-gray-100 animate-pulse">
    {[...Array(3)].map((_, index) => (
      <div key={index} className="flex gap-4 items-center">
        <div className="h-16 w-16 bg-gray-200 rounded-md"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
          <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
        </div>
      </div>
    ))}
  </div>
);