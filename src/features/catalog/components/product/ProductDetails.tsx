// src/components/ProductDetails.tsx
"use client";

import React, { useState, useMemo, useCallback } from "react";
import { Option, Product } from "../../types/catlog";
import { useCartStore } from "../../stores/useCartStore";

import ProductHeader from "./components/ProductHeader";
import ProductOptions from "./components/ProductOptions";
import QuantitySelector from "./components/QuantitySelector";
import PriceSummary from "./components/PriceSummary";

interface Props {
  product: Product;
  onClose: () => void;
}

const ProductDetails = ({ product, onClose }: Props) => {
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, Option[]>
  >({});
  const [count, setCount] = useState<number>(1);
  const addToCart = useCartStore((state) => state.addToCart);

  const { finalPrice, currencyMask } = product;
  const basePrice = useMemo(() => Number(finalPrice) || 0, [finalPrice]);

  const optionsTotal = useMemo(() => {
    return Object.values(selectedOptions)
      .flat()
      .reduce((acc, option) => acc + (Number(option.priceFinal) || 0), 0);
  }, [selectedOptions]);

  const total = useMemo(
    () => (basePrice + optionsTotal) * count,
    [basePrice, optionsTotal, count]
  );

  const toggleOption = useCallback(
    (groupId: string, option: Option, max: number, multiple: boolean) => {
      setSelectedOptions((prev) => {
        const current = prev[groupId] || [];
        const isSelected = current.some((opt) => opt.id === option.id);

        if (isSelected) {
          return {
            ...prev,
            [groupId]: current.filter((opt) => opt.id !== option.id),
          };
        } else {
          if (multiple && current.length >= max) {
            return prev;
          }
          return {
            ...prev,
            [groupId]: multiple ? [...current, option] : [option],
          };
        }
      });
    },
    []
  );

  const handleAddToCart = useCallback(() => {
    const selectedOptionList = Object.values(selectedOptions)
      .flat()
      .map((opt) => ({
        id: opt.id,
        name: opt.name,
        value: `${(Number(opt.priceFinal) || 0).toFixed(2)}`,
      }));

    addToCart({
      product,
      selectedOptions: selectedOptionList,
      quantity: count,
    });
    onClose();
  }, [addToCart, product, selectedOptions, count, onClose]);

  const increaseCount = useCallback(() => setCount((c) => c + 1), []);
  const decreaseCount = useCallback(
    () => setCount((c) => Math.max(1, c - 1)),
    []
  );

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <ProductHeader product={product} />
      <ProductOptions
        product={product}
        selectedOptions={selectedOptions}
        toggleOption={toggleOption}
      />
      <QuantitySelector
        count={count}
        increase={increaseCount}
        decrease={decreaseCount}
      />
      <PriceSummary
        total={total}
        currencyMask={currencyMask}
        handleAddToCart={handleAddToCart}
      />
    </div>
  );
};

export default React.memo(ProductDetails);
