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

  return (
    <div className="space-y-5">
      {imageUrl && (
        <div className="relative w-full h-56 rounded-2xl overflow-hidden shadow-md border border-gray-200">
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            loading="eager"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>
      )}

      <div>
        <h2 className="text-xl md:text-2xl lg:text-3xl font-extrabold text-gray-900 tracking-tight mb-3">
          {name}
        </h2>

          <div className="flex items-center text-[11px] text-gray-700 font-medium">
            {Number(rating || 0)}
            <Star size={12} className="ml-1 text-yellow-400 fill-yellow-400" />
          </div>


        {description && (
          <p className="text-sm md:text-base text-gray-600 leading-relaxed">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
