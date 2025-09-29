interface Props {
  business: { id: string; name: string; logoUrl?: string; description?: string };
}

export const BusinessHeader = ({ business }: Props) => (
  <header className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
    {business.logoUrl && (
      <img
        src={business.logoUrl}
        alt={business.name}
        className="w-24 h-24 object-cover rounded-xl shadow-md"
      />
    )}
    <div>
      <h1 className="text-2xl font-bold">{business.name}</h1>
      {business.description && (
        <p className="text-gray-600 text-sm">{business.description}</p>
      )}
    </div>
  </header>
);
