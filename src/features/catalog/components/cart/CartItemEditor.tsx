"use client";
import React, { useEffect, useState, useMemo } from "react";
import { CartItem, useCartStore } from "../../stores/useCartStore";
import { Option, Product } from "../../types/catlog";
import { fetchMenuProducDetaillByProductId } from "../../api/catalog-api";

interface Props {
  item: CartItem;
  onClose: () => void;
}

export default function CartItemEditor({ item, onClose }: Props) {
  const { selectedOptions = [], quantity: initialQuantity } = item;
  const [product, setProduct] = useState<Product | null>(null);
  const [count, setCount] = useState<number>(initialQuantity);
  const [selected, setSelected] = useState<Record<string, Option[]>>({});
  const editItem = useCartStore((state) => state.editItem);

  // Fetch product actualizado
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const freshProduct = await fetchMenuProducDetaillByProductId(
          item.product.id
        );
        setProduct(freshProduct);
      } catch (err) {
        console.error("Error al obtener producto actualizado:", err);
      }
    };

    fetchProduct();
  }, [item.product.id]);

  // Agrupar opciones seleccionadas solo cuando el producto esté cargado
  useEffect(() => {
    if (!product) return;

    const grouped: Record<string, Option[]> = {};
    for (const opt of selectedOptions) {
      const group = product.optionGroups.find((g) =>
        g.options.some((o) => o.id === opt.id)
      );
      if (group) {
        if (!grouped[group.id]) grouped[group.id] = [];
        const fullOption = group.options.find((o) => o.id === opt.id);
        if (fullOption) grouped[group.id].push(fullOption);
      }
    }

    setSelected(grouped);
  }, [product]);

  const basePrice = useMemo(() => Number(product?.finalPrice || 0), [product]);

  const optionsTotal = useMemo(() => {
    return Object.values(selected)
      .flat()
      .reduce((acc, opt) => acc + Number(opt.priceFinal || 0), 0);
  }, [selected]);

  const total = useMemo(() => {
    return (basePrice + optionsTotal) * count;
  }, [basePrice, optionsTotal, count]);

  const toggleOption = (groupId: string, option: Option, max: number) => {
    setSelected((prev) => {
      const current = prev[groupId] || [];
      const isSelected = current.some((o) => o.id === option.id);

      if (isSelected) {
        return {
          ...prev,
          [groupId]: current.filter((o) => o.id !== option.id),
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

  const handleSave = () => {
    if (!product) return;

    const newOptions = Object.values(selected)
      .flat()
      .map((opt) => ({
        id: opt.id,
        name: opt.name,
        value: `${product.currencyMask}${Number(opt.priceFinal).toFixed(2)}`,
      }));

    editItem(item.cartItemId, {
      quantity: count,
      selectedOptions: newOptions,
    });

    onClose();
  };

  if (!product) {
    return (
      <div className="p-4 text-center">Cargando producto actualizado...</div>
    );
  }

  return (
    <div className="space-y-6 p-4 border rounded shadow bg-white">
      <h2 className="text-2xl font-bold text-gray-900">{product.name}</h2>
      <p className="text-gray-700">{product.description}</p>

      {product.hasOptions && product.optionGroups.length > 0 && (
        <div className="space-y-4">
          {product.optionGroups.map((group) => {
            const groupSelected = selected[group.id] || [];
            const max = group.maxQuantity;

            return (
              <div key={group.id}>
                <div className="flex justify-between items-center mb-1">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {group.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Seleccioná hasta {max}
                  </p>
                </div>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {group.options.map((option) => {
                    const isSelected = groupSelected.some(
                      (o) => o.id === option.id
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

      <div className="flex mt-4">
        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Guardar cambios
        </button>
        <button
          onClick={onClose}
          className="ml-4 text-gray-600 hover:underline"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
