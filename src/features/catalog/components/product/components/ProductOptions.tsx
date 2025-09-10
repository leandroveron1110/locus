// src/components/ProductOptions.tsx
"use client";
import React from "react";
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

export default function ProductOptions({
  product,
  selectedOptions,
  toggleOption,
}: Props) {
  if (
    !product.hasOptions ||
    !product.optionGroups ||
    product.optionGroups.length === 0
  ) {
    return (
      <p className="text-gray-500 italic mb-6">
        Este producto no tiene opciones para seleccionar.
      </p>
    );
  }

  return (
    <div className="space-y-8 mb-6">
      {product.optionGroups.map((group) => (
        <OptionGroup
          key={group.id}
          group={group}
          selected={selectedOptions[group.id] || []}
          toggleOption={toggleOption}
          currencyMask={product.currencyMask}
        />
      ))}
    </div>
  );
}
