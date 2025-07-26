import BusinessProfile from "@/features/business/components/BusinessProfile";


interface Props {
  params: {
    businessId: string;
  };
}

export default function BusinessPage({ params }: Props) {
  const { businessId } = params;

  return (
    <div>
      <BusinessProfile businessId={businessId} />
      {/* Podés agregar más componentes que reciban businessId */}
    </div>
  );
}
