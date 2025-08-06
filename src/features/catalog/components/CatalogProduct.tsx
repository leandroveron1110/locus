import React from "react";
import { Star } from "lucide-react";
import { Product } from "../types/catlog";

interface Props {
  product: Product;
  onClick: () => void;
}

export default function CatalogProduct({ product, onClick }: Props) {
  return (
    <li
      onClick={onClick}
      className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col justify-between hover:shadow-lg transition-shadow duration-300 cursor-pointer"
    >
      <div>
        <h4 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h4>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{product.description}</p>
      </div>

      <div className="flex items-center justify-between mt-auto">
        <div className="flex items-center space-x-2">
          <Star className="text-yellow-400" size={18} />
          <span className="text-gray-700 font-medium">{product.rating.toFixed(1)}</span>
        </div>

        <div className="text-right">
          <span className="text-xl font-bold text-gray-900">
            {product.currencyMask} {Number(product.finalPrice).toFixed(2)}
          </span>
          {product.discountAmount !== "0" && (
            <div className="text-sm line-through text-gray-400">
              {product.currencyMask} {Number(product.originalPrice).toFixed(2)}
            </div>
          )}
        </div>
      </div>
    </li>
  );
}
