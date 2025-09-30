// src/components/ProductOptions.tsx
"use client";
import React, { useCallback } from "react";
import { Product, Option } from "@/features/catalog/types/catlog";
import OptionGroup from "./OptionGroup";

interface Props {
  product: Product;
  selectedOptions: Record<string, Option[]>;
  toggleOption: (
    groupId: string,
    option: Option,
    max: number,
    multiple: boolean
  ) => void;
}

// ✅ Se crea un componente memorizado para evitar re-renderizados innecesarios.
const MemoizedOptionGroup = React.memo(OptionGroup);

export default function ProductOptions({
  product,
  selectedOptions,
  toggleOption,
}: Props) {
  // ✅ useCallback siempre se llama
  const memoizedToggleOption = useCallback(
    (groupId: string, option: Option, max: number, multiple: boolean) => {
      toggleOption(groupId, option, max, multiple);
    },
    [toggleOption]
  );

  // ahora sí la condición para render
  if (!product.optionGroups || product.optionGroups.length === 0) {
    return (
      <p className="text-gray-500 italic mb-6">
        Este producto no tiene opciones para seleccionar.
      </p>
    );
  }

  return (
    <div className="space-y-8 mb-6">
      {product.optionGroups.map((group) => (
        <MemoizedOptionGroup
          key={group.id}
          group={group}
          selected={selectedOptions[group.id] || []}
          toggleOption={memoizedToggleOption}
          currencyMask={product.currencyMask}
        />
      ))}
    </div>
  );
}
