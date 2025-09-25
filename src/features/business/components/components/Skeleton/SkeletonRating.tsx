// src/features/business/components/Skeleton/SkeletonRating.tsx
import React from "react";

export const SkeletonRating: React.FC = () => (
  <div className="p-4 space-y-4 rounded-lg bg-gray-100 animate-pulse">
    <div className="h-6 w-1/3 bg-gray-200 rounded"></div>
    <div className="h-4 w-1/4 bg-gray-200 rounded"></div>
  </div>
);