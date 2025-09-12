"use client";

import {
  Mail,
  MapPin,
  Phone,
  MessageCircle,
  Globe,
  Facebook,
  Instagram,
} from "lucide-react";

interface BusinessContactInfoProps {
  address?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  websiteUrl?: string;
  facebookUrl?: string;
  instagramUrl?: string;
}

export default function BusinessContactInfo({
  address,
  email,
  phone,
  whatsapp,
  websiteUrl,
  facebookUrl,
  instagramUrl,
}: BusinessContactInfoProps) {
  const contacts = [
    address && {
      label: "Dirección",
      value: address,
      icon: <MapPin size={20} className="text-blue-600" />,
      link: null,
    },
    phone && {
      label: "Teléfono",
      value: phone,
      icon: <Phone size={20} className="text-green-600" />,
      link: `tel:${phone}`,
    },
    whatsapp && {
      label: "WhatsApp",
      value: whatsapp,
      icon: <MessageCircle size={20} className="text-green-500" />,
      link: `https://wa.me/${whatsapp.replace(/\D/g, "")}`,
      external: true,
    },
    email && {
      label: "Correo",
      value: email,
      icon: <Mail size={20} className="text-red-600" />,
      link: `mailto:${email}`,
    },
    websiteUrl && {
      label: "Sitio web",
      value: websiteUrl.replace(/^https?:\/\//, ""),
      icon: <Globe size={20} className="text-indigo-600" />,
      link: websiteUrl,
      external: true,
    },
    facebookUrl && {
      label: "Facebook",
      value: "Perfil de Facebook",
      icon: <Facebook size={20} className="text-blue-700" />,
      link: facebookUrl,
      external: true,
    },
    instagramUrl && {
      label: "Instagram",
      value: "Perfil de Instagram",
      icon: <Instagram size={20} className="text-pink-500" />,
      link: instagramUrl,
      external: true,
    },
  ].filter(Boolean);

  if (contacts.length === 0) return null;

  return (
    <section aria-labelledby="contact-heading" className="mt-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {contacts.map((contact, idx) =>
          contact ? (
              <div
                key={idx}
                className="flex items-center gap-4 p-4 bg-white shadow-sm rounded-lg hover:shadow-md transition cursor-pointer"
              >
                <div className="flex-shrink-0">{contact.icon}</div>
                <div className="flex flex-col">
                  <span className="text-gray-500 text-sm">{contact.label}</span>
                  {contact.link ? (
                    <a
                      href={contact.link}
                      target={contact.external ? "_blank" : "_self"}
                      rel={contact.external ? "noopener noreferrer" : undefined}
                      className="text-gray-800 font-medium hover:text-blue-600 transition"
                    >
                      {contact.value}
                    </a>
                  ) : (
                    <span className="text-gray-800 font-medium">
                      {contact.value}
                    </span>
                  )}
                </div>
              </div>
          ) : (
            <></>
          )
        )}
      </div>
    </section>
  );
}
