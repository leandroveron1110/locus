"use client";
import React, { useEffect, useState, useMemo } from "react";
import { Option, Product } from "../types/catlog";
import { useCartStore } from "../stores/useCartStore";
import { Star } from "lucide-react";

interface Props {
  product: Product;
  onClose: () => void;
}

export default function ProductDetails({ product, onClose }: Props) {
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, Option[]>
  >({});
  const [count, setCount] = useState<number>(1);
  const addToCart = useCartStore((state) => state.addToCart);

  const basePrice = useMemo(
    () => Number(product.finalPrice) || 0,
    [product.finalPrice]
  );

  const optionsTotal = useMemo(() => {
    return Object.values(selectedOptions)
      .flat()
      .reduce((acc, option) => acc + Number(option.priceFinal || 0), 0);
  }, [selectedOptions]);

  const total = useMemo(
    () => (basePrice + optionsTotal) * count,
    [basePrice, optionsTotal, count]
  );

  const toggleOption = (
    groupId: string,
    option: Option,
    max: number,
    multiple: boolean
  ) => {
    setSelectedOptions((prev) => {
      const current = prev[groupId] || [];
      const isSelected = current.some((opt) => opt.id === option.id);

      if (isSelected) {
        return {
          ...prev,
          [groupId]: current.filter((opt) => opt.id !== option.id),
        };
      } else {
        if (multiple) {
          if (current.length >= max) return prev;
          return {
            ...prev,
            [groupId]: [...current, option],
          };
        } else {
          return {
            ...prev,
            [groupId]: [option],
          };
        }
      }
    });
  };

  const handleAddToCart = () => {
    const selectedOptionList = Object.values(selectedOptions)
      .flat()
      .map((opt) => ({
        id: opt.id,
        name: opt.name,
        value: `${product.currencyMask}${Number(opt.priceFinal).toFixed(2)}`,
      }));

    addToCart({
      product,
      selectedOptions: selectedOptionList,
      quantity: count,
    });

    onClose();
  };

  const increaseCount = () => setCount((c) => c + 1);
  const decreaseCount = () => setCount((c) => Math.max(1, c - 1));

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Imagen arriba */}
      {product.imageUrl && (
        <div className="w-full h-[170px] rounded overflow-hidden border border-gray-200">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
            style={{ maxHeight: "170px" }}
          />
        </div>
      )}

      {/* Contenido abajo */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          {product.name}
        </h2>

        <div className="flex items-center gap-1 mb-4 text-yellow-400">
          <Star size={20} />
          <span className="text-gray-700 font-semibold text-lg">
            {product.rating.toFixed(1)}
          </span>
        </div>

        <p className="text-gray-700 text-base mb-6">{product.description}</p>

        {product.hasOptions && product.optionGroups.length > 0 ? (
          <div className="space-y-6 mb-6">
            {product.optionGroups.map((group) => {
              const selected = selectedOptions[group.id] || [];
              const max = group.maxQuantity || 1;
              const multiple = max > 1;

              return (
                <div key={group.id}>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {group.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Seleccioná {multiple ? `hasta ${max}` : "una opción"}
                    </p>
                  </div>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {group.options.map((option) => {
                      const isSelected = selected.some(
                        (opt) => opt.id === option.id
                      );
                      const reachedMax = !isSelected && selected.length >= max;

                      return (
                        <li
                          key={option.id}
                          role="checkbox"
                          aria-checked={isSelected}
                          tabIndex={0}
                          onClick={() =>
                            !reachedMax &&
                            toggleOption(group.id, option, max, multiple)
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              if (!reachedMax)
                                toggleOption(group.id, option, max, multiple);
                            }
                          }}
                          className={`border p-3 rounded-lg cursor-pointer transition-colors select-none
                            ${
                              isSelected
                                ? "border-blue-600 bg-blue-50"
                                : "border-gray-300 hover:border-blue-400"
                            }
                            ${reachedMax ? "opacity-50 cursor-not-allowed" : ""}
                          `}
                        >
                          <div className="flex justify-between items-center">
                            <span>{option.name}</span>
                            <span className="text-sm text-gray-800">
                              +{product.currencyMask}
                              {Number(option.priceFinal).toFixed(2)}
                            </span>
                          </div>
                          {option.images.length > 0 && (
                            <img
                              src={option.images[0]}
                              alt={option.name}
                              className="mt-2 w-16 h-16 object-cover rounded"
                            />
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-500 italic mb-6">
            Este producto no tiene opciones para seleccionar.
          </p>
        )}

        <div className="flex items-center space-x-4 mb-6">
          <span className="font-medium">Unidades</span>
          <button
            onClick={decreaseCount}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
            aria-label="Disminuir cantidad"
          >
            -
          </button>
          <span
            className="text-lg font-semibold"
            aria-live="polite"
            aria-atomic="true"
          >
            {count}
          </span>
          <button
            onClick={increaseCount}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
            aria-label="Aumentar cantidad"
          >
            +
          </button>
        </div>

        <div className="text-xl font-bold mb-6">
          Total: {product.currencyMask} {total.toFixed(2)}
        </div>

        <button
          onClick={handleAddToCart}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          aria-label="Agregar producto al carrito"
        >
          Agregar al carrito
        </button>
      </div>
    </div>
  );
}
