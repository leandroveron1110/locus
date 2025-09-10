"use client";

import { Facebook, Globe, Instagram } from "lucide-react";

interface NetworksProps {
  websiteUrl?: string;
  facebookUrl?: string;
  instagramUrl?: string;
}

export default function Networks({
  facebookUrl,
  instagramUrl,
  websiteUrl,
}: NetworksProps) {
  const networks = [
    websiteUrl && {
      label: "Sitio web",
      icon: <Globe size={20} />,
      url: websiteUrl,
      bgColor: "bg-gray-100",
      hoverColor: "hover:bg-blue-100",
      textColor: "text-gray-700",
    },
    facebookUrl && {
      label: "Facebook",
      icon: <Facebook size={20} />,
      url: facebookUrl,
      bgColor: "bg-blue-50",
      hoverColor: "hover:bg-blue-200",
      textColor: "text-blue-700",
    },
    instagramUrl && {
      label: "Instagram",
      icon: <Instagram size={20} />,
      url: instagramUrl,
      bgColor: "bg-pink-50",
      hoverColor: "hover:bg-pink-200",
      textColor: "text-pink-600",
    },
  ].filter(Boolean);

  if (networks.length === 0) return null;

  return (
    <section aria-label="Redes sociales" className="mt-8">
      <div className="flex flex-wrap gap-4">
        {networks.map((network, idx) =>
          network ? (
            <>
              <a
                key={idx}
                href={network.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={network.label}
                className={`
              flex items-center justify-center w-12 h-12 rounded-full
              ${network.bgColor} ${network.hoverColor} ${network.textColor}
              shadow-sm hover:shadow-md transition
            `}
              >
                {network.icon}
              </a>
            </>
          ) : (
            <></>
          )
        )}
      </div>
    </section>
  );
}
