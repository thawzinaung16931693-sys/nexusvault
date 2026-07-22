import { useParams, Link } from "react-router";
import { trpc } from "@/providers/trpc";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Star,
  ShoppingCart,
  ArrowLeft,
  Check,
  Zap,
  Calendar,
  Globe,
  Shield,
  Clock,
} from "lucide-react";
import { useState } from "react";

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [added, setAdded] = useState(false);

  const { data: product, isLoading } = trpc.product.bySlug.useQuery(
    { slug: slug! },
    { enabled: !!slug }
  );

  const { data: relatedProducts } = trpc.product.list.useQuery(
    { categorySlug: product?.categorySlug || undefined },
    { enabled: !!product }
  );

  const sessionId = localStorage.getItem("cartSessionId") || undefined;
  const { data: cartData } = trpc.cart.get.useQuery(
    sessionId ? { sessionId } : undefined
  );
  const cartId = cartData?.id;

  const addItem = trpc.cart.addItem.useMutation({
    onSuccess: () => {
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    },
  });

  if (isLoading) {
    return (
      <div className="relative z-10 min-h-screen pt-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="glass-surface-light rounded-2xl h-96 animate-pulse" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="relative z-10 min-h-screen pt-24 px-4 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Product Not Found</h1>
          <Link to="/products">
            <Button className="btn-gradient text-white">Browse Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  const features: string[] = product.features ? JSON.parse(product.features) : [];
  const discount = product.originalPrice
    ? Math.round(((parseFloat(product.originalPrice) - parseFloat(product.price)) / parseFloat(product.originalPrice)) * 100)
    : 0;

  const billingLabel = product.type === "subscription"
    ? product.billingPeriod === "yearly" ? "/year" : "/month"
    : " one-time";

  const filteredRelated = relatedProducts?.filter((p) => p.id !== product.id).slice(0, 3);

  return (
    <div className="relative z-10 min-h-screen pt-20 pb-10 px-4">
      <div className="max-w-5xl mx-auto">
        <Link to="/products" className="inline-flex items-center gap-2 text-gray-400 hover:text-[#9D4EDD] transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Products
        </Link>

        <div className="glass-surface rounded-2xl overflow-hidden">
          <div className="relative aspect-video">
            <img src={product.image || "/placeholder.svg"} alt={product.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0D0221] via-transparent to-transparent" />
            {discount > 0 && <Badge className="absolute top-4 left-4 bg-[#9D4EDD] text-white">-{discount}% OFF</Badge>}
            {product.isFeatured === "yes" && <Badge className="absolute top-4 right-4 bg-[#7B2CBF] text-white flex items-center gap-1"><Zap className="w-3 h-3" /> FEATURED</Badge>}
          </div>

          <div className="p-6 md:p-8">
            <div className="text-[#9D4EDD] text-sm font-medium mb-2">{product.categoryName}</div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-3 font-['Space_Grotesk']">{product.name}</h1>
            <p className="text-gray-300 mb-6 leading-relaxed">{product.description}</p>

            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span>{product.rating} ({product.reviewCount} reviews)</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <ShoppingCart className="w-4 h-4 text-[#9D4EDD]" />
                <span>{product.salesCount} sold</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Calendar className="w-4 h-4 text-[#9D4EDD]" />
                <span className="capitalize">{product.type}</span>
              </div>
            </div>

            {features.length > 0 && (
              <div className="mb-8">
                <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#9D4EDD]" />
                  What's Included
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {features.map((feat, i) => (
                    <div key={i} className="flex items-center gap-2 text-gray-300 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#9D4EDD]" />
                      {feat}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
              <div className="glass-surface-light rounded-lg p-3 flex items-center gap-3">
                <Globe className="w-5 h-5 text-[#9D4EDD]" />
                <div><div className="text-white text-xs font-medium">Global Access</div><div className="text-gray-500 text-[10px]">Use anywhere</div></div>
              </div>
              <div className="glass-surface-light rounded-lg p-3 flex items-center gap-3">
                <Shield className="w-5 h-5 text-[#9D4EDD]" />
                <div><div className="text-white text-xs font-medium">Secure License</div><div className="text-gray-500 text-[10px]">Instant delivery</div></div>
              </div>
              <div className="glass-surface-light rounded-lg p-3 flex items-center gap-3">
                <Clock className="w-5 h-5 text-[#9D4EDD]" />
                <div><div className="text-white text-xs font-medium">{product.type === "subscription" ? "Auto-Renews" : "Lifetime"}</div><div className="text-gray-500 text-[10px]">{product.billingPeriod === "yearly" ? "Annual billing" : "Monthly billing"}</div></div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6 border-t border-[#7B2CBF]/20">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-white">${product.price}</span>
                  <span className="text-[#9D4EDD] text-sm">{billingLabel}</span>
                </div>
                {product.originalPrice && <span className="text-gray-500 text-sm line-through">${product.originalPrice}</span>}
              </div>
              {cartId && (
                <Button size="lg" onClick={() => addItem.mutate({ cartId, productId: product.id, quantity: 1 })} disabled={addItem.isPending || added} className={`${added ? "bg-green-600 hover:bg-green-700" : "btn-gradient"} text-white px-8 py-3 rounded-xl text-base font-semibold`}>
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  {added ? "Added to Cart!" : "Add to Cart"}
                </Button>
              )}
            </div>
          </div>
        </div>

        {filteredRelated && filteredRelated.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-bold text-white mb-6 font-['Space_Grotesk']">You Might Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {filteredRelated.map((p) => (
                <Link key={p.id} to={`/products/${p.slug}`} className="glass-surface-light rounded-xl overflow-hidden hover:scale-[1.02] transition-transform">
                  <div className="aspect-video">
                    <img src={p.image || "/placeholder.svg"} alt={p.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-3">
                    <h3 className="text-white font-medium text-sm mb-1">{p.name}</h3>
                    <span className="text-[#9D4EDD] font-bold text-sm">${p.price}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
