"use client";
// src/features/business/components/BusinessHeader.tsx

import React from "react";
import Image from "next/image";
import { Star } from "lucide-react";
import FollowButton from "./FollowButton";
import Title from "@/features/common/ui/Title";
import Description from "@/features/common/ui/Description";
import { useAuthStore } from "@/features/auth/store/authStore";

interface Props {
  fullDescription: string;
  logoUrl: string | undefined;
  name: string;
  businessId: string;
  ratingsCount: number | undefined;
}

export default function BusinessHeader({
  businessId,
  fullDescription,
  logoUrl,
  name,
  ratingsCount,
}: Props) {
  const user = useAuthStore((state) => state.user);

  const logoUrlBusiness = logoUrl || "/placeholder-logo.png";

  return (
    <div className="bg-white p-3 md:p-6 mb-6">
      <div className="flex flex-row items-start gap-6">
        {/* Logo */}
        <div className="relative w-24 h-24 md:w-28 md:h-28 flex-shrink-0 rounded-full overflow-hidden">
          <Image
            src={logoUrlBusiness}
            alt={`${name} logo`}
            fill
            className="object-cover"
            sizes="112px"
            priority
          />
        </div>

        {/* Información del negocio */}
        <div className="flex-1 text-left">
          <Title size="medium">{name.toUpperCase()}</Title>

          {fullDescription && (
            <Description lines={2}>{fullDescription}</Description>
          )}

          {/* Rating */}
          <div className="flex gap-1 mt-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={14}
                className={
                  i < Math.round(Number(ratingsCount) || 0)
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300"
                }
              />
            ))}
          </div>

          {user ? (
            <div className="mt-3">
              <FollowButton businessId={businessId} />
            </div>
          ) : (
            <></>
          )}
          {/* Botón de seguir */}
        </div>
      </div>
    </div>
  );
}
