"use client";
import React, { useEffect, useState, useMemo } from "react";
import { Option, Product } from "../types/catlog";

interface Props {
  product: Product;
}

export default function ProductDetails({ product }: Props) {
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, Option[]>
  >({});
  const [basePrice, setBasePrice] = useState<number>(0);
  const [count, setCount] = useState<number>(1);

  // Inicializa el precio base del producto
  useEffect(() => {
    if (product.finalPrice > 0) {
      setBasePrice(Number(product.finalPrice));
    }
  }, [product.finalPrice]);

  // Calcula el total de opciones seleccionadas
  const optionsTotal = useMemo(() => {
    return Object.values(selectedOptions)
      .flat()
      .reduce((acc, option) => acc + Number(option.priceFinal || 0), 0);
  }, [selectedOptions]);

  const total = useMemo(() => {
    return (basePrice + optionsTotal) * count;
  }, [basePrice, optionsTotal, count]);

  const toggleOption = (groupId: string, option: Option, max: number) => {
    setSelectedOptions((prev) => {
      const current = prev[groupId] || [];
      const alreadySelected = current.some((opt) => opt.id === option.id);

      if (alreadySelected) {
        return {
          ...prev,
          [groupId]: current.filter((opt) => opt.id !== option.id),
        };
      } else {
        if (current.length >= max) return prev;
        return {
          ...prev,
          [groupId]: [...current, option],
        };
      }
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          {product.name}
        </h2>
        <p className="text-gray-700 text-base">{product.description}</p>
      </div>

      {product.hasOptions && product.optionGroups.length > 0 && (
        <div className="space-y-6">
          {product.optionGroups.map((group) => {
            const selected = selectedOptions[group.id] || [];
            const max = group.maxQuantity;

            return (
              <div key={group.id}>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {group.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Seleccioná hasta {max}
                  </p>
                </div>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {group.options.map((option) => {
                    const isSelected = selected.some(
                      (opt) => opt.id === option.id
                    );
                    return (
                      <li
                        key={option.id}
                        className={`border p-3 rounded-lg cursor-pointer transition-colors ${
                          isSelected
                            ? "border-blue-600 bg-blue-50"
                            : "border-gray-300 hover:border-blue-400"
                        }`}
                        onClick={() => toggleOption(group.id, option, max)}
                      >
                        <div className="flex justify-between items-center">
                          <span>{option.name}</span>
                          <span className="text-sm text-gray-800">
                            +{product.currencyMask}
                            {Number(option.priceFinal).toFixed(2)}
                          </span>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      )}

      <div className="flex items-center space-x-4 mt-4">
        <span className="font-medium">Unidades</span>
        <button
          onClick={() => setCount((c) => Math.max(1, c - 1))}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          -
        </button>
        <span className="text-lg font-semibold">{count}</span>
        <button
          onClick={() => setCount((c) => c + 1)}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          +
        </button>
      </div>

      <div className="mt-4 text-xl font-bold">
        Total: {product.currencyMask} {total.toFixed(2)}
      </div>
    </div>
  );
}
