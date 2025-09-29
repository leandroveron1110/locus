import { formatPrice } from "@/features/common/utils/formatPrice";

interface Props {
  product: { id: string; name: string; price: number; imageUrl?: string };
}

export const MenuProductCard = ({ product }: Props) => (
  <div className="bg-white rounded-2xl shadow-md p-4 hover:shadow-lg transition">
    {product.imageUrl && (
      <img
        src={product.imageUrl}
        alt={product.name}
        className="w-full h-40 object-cover rounded-xl mb-3"
      />
    )}
    <h3 className="text-lg font-medium">{product.name}</h3>
    <p className="text-gray-800 font-bold">{formatPrice(product.price)}</p>
  </div>
);
