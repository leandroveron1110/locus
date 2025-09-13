"use client";
import React, { useEffect, useState, useMemo } from "react";
import { CartItem, useCartStore } from "../../stores/useCartStore";
import { Option, Product } from "../../types/catlog";
import { fetchMenuProducDetaillByProductId } from "../../api/catalog-api";
import OptionGroup from "../product/components/OptionGroup";
import QuantitySelector from "../product/components/QuantitySelector";
import ProductHeader from "../product/components/ProductHeader";

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

  // Fetch producto actualizado
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

  // Agrupar opciones seleccionadas
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
  }, [product, selectedOptions]);

  const basePrice = useMemo(() => Number(product?.finalPrice || 0), [product]);

  const optionsTotal = useMemo(() => {
    return Object.values(selected)
      .flat()
      .reduce((acc, opt) => acc + Number(opt.priceFinal || 0), 0);
  }, [selected]);

  const total = useMemo(
    () => (basePrice + optionsTotal) * count,
    [basePrice, optionsTotal, count]
  );

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
        return { ...prev, [groupId]: [...current, option] };
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
        value: Number(opt.priceFinal),
      }));
    editItem(item.cartItemId, { quantity: count, selectedOptions: newOptions });
    onClose();
  };

  if (!product) {
    return (
      <div className="p-6 text-center text-gray-500">Cargando producto...</div>
    );
  }

  return (
    <div className="space-y-6 bg-white rounded-2xl p-5 sm:p-6 shadow-md">
      {/* Nombre y descripción */}
      <ProductHeader product={product} />


      {/* Opciones */}
      {product.hasOptions && product.optionGroups.length > 0 && (
        <div className="space-y-5">
          {product.optionGroups.map((group) => (
            <OptionGroup
              key={group.id}
              group={group}
              selected={selected[group.id] || []}
              toggleOption={(gId, option) =>
                toggleOption(gId, option, group.maxQuantity || 1)
              }
              currencyMask={product.currencyMask}
            />
          ))}
        </div>
      )}

      {/* Selector de cantidad y total */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-4">
        <QuantitySelector
          count={count}
          increase={() => setCount((c) => c + 1)}
          decrease={() => setCount((c) => Math.max(1, c - 1))}
        />
        <div className="text-lg sm:text-xl font-bold text-gray-900">
          Total: {product.currencyMask} {total.toFixed(2)}
        </div>
      </div>

      {/* Botones */}
      <div className="flex flex-col sm:flex-row gap-3 mt-4">
        <button
          onClick={handleSave}
          className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition"
        >
          Guardar cambios
        </button>
        <button
          onClick={onClose}
          className="flex-1 text-gray-600 hover:underline py-3 rounded-xl border border-gray-200"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
