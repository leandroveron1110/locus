// src/components/OrderCard.tsx
"use client";

import React, { useState } from "react";
import { Order } from "../../types/order";
import OrderHeader from "./components/OrderHeader";
import OrderDetailsSection from "./components/OrderDetailsSection";
import TransferPaymentSection from "./components/TransferPaymentSection";

interface Props {
  order: Order;
}

export default function OrderCard({ order }: Props) {
  const {
    paymentType,
    deliveryType,
    items,
    bussiness,
    total,
    createdAt,
    status,
    id,
    businessId,
    paymentStatus,
    paymentReceiptUrl,
  } = order;

  return (
    <div className="w-full max-w-lg mx-auto p-4 sm:p-6 rounded-xl bg-white shadow-sm border border-gray-200">
      <OrderHeader
        orderId={order.id}
        businessName={bussiness.name}
        businessAddress={bussiness.address}
        deliveryType={deliveryType}
        paymentType={paymentType}
        createdAt={createdAt}
        total={total}
        status={status}
      />

      <hr className="my-3 border-t border-dashed border-gray-200" />

      <OrderDetailsSection items={items} />

      {paymentType === "TRANSFER" && (
        <TransferPaymentSection
          orderId={id}
          businessId={businessId}
          paymentStatus={paymentStatus}
          paymentReceiptUrl={paymentReceiptUrl}
        />
      )}
    </div>
  );
}
