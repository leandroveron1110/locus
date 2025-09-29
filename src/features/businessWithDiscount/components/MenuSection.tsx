import { MenuProductCard } from "./MenuProductCard";

interface Props {
  section: { id: string; name: string; products: { id: string; name: string; price: number; imageUrl?: string }[] };
}

export const MenuSection = ({ section }: Props) => (
  <section className="space-y-4">
    <h2 className="text-xl font-semibold">{section.name}</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {section.products.map((product) => (
        <MenuProductCard key={product.id} product={product} />
      ))}
    </div>
  </section>
);
