import { Link } from "react-router";
import { Star, ShoppingCart, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/providers/trpc";
import { useState } from "react";

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    slug: string;
    shortDescription: string | null;
    price: string;
    originalPrice: string | null;
    image: string | null;
    type: "subscription" | "one_time";
    billingPeriod: "monthly" | "yearly" | "lifetime" | null;
    rating: string | null;
    reviewCount: number | null;
    salesCount: number | null;
    categoryName: string | null;
    isFeatured: "yes" | "no";
  };
  cartId?: number;
  onAddToCart?: () => void;
}

export default function ProductCard({ product, cartId, onAddToCart }: ProductCardProps) {
  const [added, setAdded] = useState(false);
  const addItem = trpc.cart.addItem.useMutation({
    onSuccess: () => {
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
      onAddToCart?.();
    },
  });

  const handleAddToCart = () => {
    if (!cartId) return;
    addItem.mutate({ cartId, productId: product.id, quantity: 1 });
  };

  const discount = product.originalPrice
    ? Math.round(
        ((parseFloat(product.originalPrice) - parseFloat(product.price)) /
          parseFloat(product.originalPrice)) *
          100
      )
    : 0;

  const billingLabel =
    product.type === "subscription"
      ? product.billingPeriod === "yearly"
        ? "/year"
        : "/month"
      : " one-time";

  return (
    <div className="group relative glass-surface-light rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(123,44,191,0.3)]">
      {/* Image */}
      <Link to={`/products/${product.slug}`} className="block relative">
        <div className="aspect-video overflow-hidden">
          <img
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>
        {discount > 0 && (
          <span className="absolute top-3 left-3 bg-[#9D4EDD] text-white text-xs font-bold px-2 py-1 rounded-md">
            -{discount}%
          </span>
        )}
        {product.isFeatured === "yes" && (
          <span className="absolute top-3 right-3 bg-[#7B2CBF] text-white text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1">
            <Zap className="w-3 h-3" />
            FEATURED
          </span>
        )}
      </Link>

      {/* Content */}
      <div className="p-4">
        <div className="text-xs text-[#9D4EDD] font-medium mb-1">
          {product.categoryName}
        </div>
        <Link to={`/products/${product.slug}`}>
          <h3 className="text-white font-semibold text-base mb-1 group-hover:text-[#E0AAFF] transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>
        <p className="text-gray-400 text-xs mb-3 line-clamp-2">
          {product.shortDescription}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${
                  i < Math.round(parseFloat(product.rating ?? "0"))
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-600"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-400">
            {product.rating} ({product.reviewCount})
          </span>
        </div>

        {/* Price & CTA */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-white font-bold text-lg">
              ${product.price}
            </span>
            <span className="text-[#9D4EDD] text-xs ml-1">{billingLabel}</span>
            {product.originalPrice && (
              <span className="text-gray-500 text-xs line-through ml-2">
                ${product.originalPrice}
              </span>
            )}
          </div>
          {cartId && (
            <Button
              size="sm"
              onClick={handleAddToCart}
              disabled={addItem.isPending || added}
              className={`${
                added
                  ? "bg-green-600 hover:bg-green-700"
                  : "btn-gradient"
              } text-white text-xs px-3 py-1.5 rounded-lg`}
            >
              <ShoppingCart className="w-3.5 h-3.5 mr-1" />
              {added ? "Added" : "Add"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
