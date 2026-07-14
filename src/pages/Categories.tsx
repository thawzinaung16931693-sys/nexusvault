import { Link } from "react-router";
import { trpc } from "@/providers/trpc";
import { ArrowRight, Hexagon } from "lucide-react";

export default function Categories() {
  const { data: categories, isLoading } = trpc.category.list.useQuery();
  const { data: products } = trpc.product.list.useQuery({});

  const productCountByCategory = new Map<number, number>();
  products?.forEach((p) => {
    const count = productCountByCategory.get(p.categoryId) || 0;
    productCountByCategory.set(p.categoryId, count + 1);
  });

  return (
    <div className="relative z-10 min-h-screen pt-20 pb-10 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 font-['Space_Grotesk']">
            Product <span className="gradient-text">Categories</span>
          </h1>
          <p className="text-gray-400 max-w-lg mx-auto">
            Browse our digital products organized by category. Find exactly what you need.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="glass-surface-light rounded-xl h-32 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categories?.map((cat) => (
              <Link
                key={cat.id}
                to={`/products?category=${cat.slug}`}
                className="group glass-surface rounded-xl p-6 flex items-center gap-5 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(123,44,191,0.3)]"
              >
                <div
                  className="w-16 h-16 rounded-xl flex items-center justify-center text-white text-2xl font-bold flex-shrink-0 transition-transform group-hover:scale-110"
                  style={{
                    backgroundColor: cat.color ? `${cat.color}30` : "rgba(123, 44, 191, 0.2)",
                    border: `1px solid ${cat.color || "#7B2CBF"}`,
                  }}
                >
                  <Hexagon className="w-8 h-8" style={{ color: cat.color || "#7B2CBF" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold text-lg mb-1 group-hover:text-[#E0AAFF] transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-gray-400 text-sm line-clamp-1">{cat.description}</p>
                  <div className="text-[#9D4EDD] text-xs mt-1 font-medium">
                    {productCountByCategory.get(cat.id) || 0} products
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-[#9D4EDD] transition-colors flex-shrink-0" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
