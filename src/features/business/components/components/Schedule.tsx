"use client";

import { Clock } from "lucide-react";
import { useSchedule } from "../../hooks/useSchedule";

interface Props {
  businessId: string;
}

const daysES: Record<string, string> = {
  MONDAY: "Lunes",
  TUESDAY: "Martes",
  WEDNESDAY: "Miércoles",
  THURSDAY: "Jueves",
  FRIDAY: "Viernes",
  SATURDAY: "Sábado",
  SUNDAY: "Domingo",
};

export default function Schedule({ businessId }: Props) {
  const { data, isLoading, isError } = useSchedule(businessId);

  if (isLoading) return <p>Cargando horarios...</p>;
  if (isError || !data) return null;

  return (
    <section className="mt-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <Clock size={20} /> Horarios de atención
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-gray-700 text-sm">
        {Object.entries(data).map(([day, intervals]) => (
          <div
            key={day}
            className="bg-blue-50 rounded-lg p-3 flex flex-col items-start shadow-sm"
          >
            <span className="font-semibold text-blue-700 mb-1">
              {daysES[day] ?? day}
            </span>
            <div className="flex flex-wrap gap-2">
              {intervals.map((interval: string) => (
                <span
                  key={interval}
                  className="bg-blue-200 text-blue-900 rounded-full px-3 py-1 text-xs font-medium"
                >
                  {interval}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
