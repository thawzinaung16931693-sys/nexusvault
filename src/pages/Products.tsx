import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import { trpc } from "@/providers/trpc";
import { useAuth } from "@/hooks/useAuth";
import ProductCard from "@/components/products/ProductCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal, Grid3X3, LayoutList, X } from "lucide-react";

export default function Products() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "");
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);

  const { data: categories } = trpc.category.list.useQuery();
  const { data: products, isLoading } = trpc.product.list.useQuery({
    categorySlug: selectedCategory || undefined,
    search: search || undefined,
    sort: sortBy,
  });

  const sessionId = localStorage.getItem("cartSessionId") || undefined;
  const { data: cartData } = trpc.cart.get.useQuery(
    user?.id ? { userId: user.id } : sessionId ? { sessionId } : undefined
  );
  const cartId = cartData?.id;

  useEffect(() => {
    if (cartData?.id && !localStorage.getItem("cartSessionId")) {
      const sid = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
      localStorage.setItem("cartSessionId", sid);
    }
  }, [cartData]);

  const sortOptions = [
    { value: "featured", label: "Featured" },
    { value: "price-asc", label: "Price: Low to High" },
    { value: "price-desc", label: "Price: High to Low" },
    { value: "rating", label: "Highest Rated" },
    { value: "newest", label: "Newest" },
  ];

  return (
    <div className="relative z-10 min-h-screen pt-20 pb-10 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 font-['Space_Grotesk']">
            All <span className="gradient-text">Products</span>
          </h1>
          <p className="text-gray-400">{products?.length ?? 0} digital products available</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 bg-[#1a0a2e]/50 border-[#7B2CBF]/30 text-white placeholder:text-gray-500 focus:border-[#9D4EDD]" />
            {search && <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"><X className="w-4 h-4" /></button>}
          </div>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-4 py-2 rounded-lg bg-[#1a0a2e]/50 border border-[#7B2CBF]/30 text-white text-sm focus:border-[#9D4EDD] focus:outline-none">
            {sortOptions.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" onClick={() => setViewMode("grid")} className={viewMode === "grid" ? "bg-[#7B2CBF]/30 text-[#9D4EDD]" : "text-gray-500"}><Grid3X3 className="w-4 h-4" /></Button>
            <Button variant="ghost" size="icon" onClick={() => setViewMode("list")} className={viewMode === "list" ? "bg-[#7B2CBF]/30 text-[#9D4EDD]" : "text-gray-500"}><LayoutList className="w-4 h-4" /></Button>
          </div>
          <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="border-[#7B2CBF]/30 text-[#E0AAFF] hover:bg-[#7B2CBF]/20">
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>

        {showFilters && (
          <div className="glass-surface-light rounded-xl p-4 mb-6 flex flex-wrap gap-2">
            <Button variant="ghost" size="sm" onClick={() => setSelectedCategory("")} className={!selectedCategory ? "bg-[#7B2CBF]/30 text-[#9D4EDD]" : "text-gray-400"}>All</Button>
            {categories?.map((cat) => (
              <Button key={cat.id} variant="ghost" size="sm" onClick={() => setSelectedCategory(cat.slug)} className={selectedCategory === cat.slug ? "bg-[#7B2CBF]/30 text-[#9D4EDD]" : "text-gray-400"}>{cat.name}</Button>
            ))}
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <div key={i} className="glass-surface-light rounded-xl h-80 animate-pulse" />)}
          </div>
        ) : products?.length === 0 ? (
          <div className="text-center py-20"><p className="text-gray-400 text-lg">No products found.</p></div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products?.map((product) => <ProductCard key={product.id} product={product} cartId={cartId} />)}
          </div>
        ) : (
          <div className="space-y-4">
            {products?.map((product) => (
              <div key={product.id} className="glass-surface-light rounded-xl p-4 flex gap-4 hover:scale-[1.01] transition-transform">
                <div className="w-32 h-20 rounded-lg overflow-hidden flex-shrink-0">
                  <img src={product.image || "/placeholder.svg"} alt={product.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-[#9D4EDD] font-medium mb-0.5">{product.categoryName}</div>
                  <h3 className="text-white font-semibold text-sm mb-1 truncate">{product.name}</h3>
                  <p className="text-gray-400 text-xs line-clamp-2">{product.shortDescription}</p>
                </div>
                <div className="flex flex-col items-end justify-between flex-shrink-0">
                  <span className="text-white font-bold">${product.price}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
