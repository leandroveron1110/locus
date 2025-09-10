// src/components/ProductHeader.tsx
"use client";
import React from "react";
import { Star } from "lucide-react";
import { Product } from "@/features/catalog/types/catlog";

interface Props {
  product: Product;
}

export default function ProductHeader({ product }: Props) {
  const { imageUrl, name, rating, description } = product;
  const stars = Array.from({ length: 5 }, (_, i) => i + 1);

  return (
    <div className="space-y-5">
      {imageUrl && (
        <div className="relative w-full h-56 rounded-2xl overflow-hidden shadow-md border border-gray-200">
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>
      )}

      <div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight mb-3">
          {name}
        </h2>

        <div className="flex items-center gap-1 mb-3">
          {stars.map((s, i) => (
            <Star
              key={i}
              size={18}
              className={
                s <= Math.round(rating || 0)
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-300"
              }
            />
          ))}
          <span className="ml-2 text-gray-700 font-medium text-lg">
            {(rating || 0).toFixed(1)}
          </span>
        </div>

        {description && (
          <p className="text-gray-600 text-base leading-relaxed">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
