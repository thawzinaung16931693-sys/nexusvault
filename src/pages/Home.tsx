import { useEffect, useRef } from "react";
import { Link } from "react-router";
import { trpc } from "@/providers/trpc";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/products/ProductCard";
import { Zap, Shield, Globe, Cpu, ArrowRight, Hexagon, ChevronDown } from "lucide-react";

export default function Home() {
  const { user } = useAuth();
  const { data: featuredProducts } = trpc.product.list.useQuery({ featured: true });
  const { data: allProducts } = trpc.product.list.useQuery({});
  const { data: categories } = trpc.category.list.useQuery();

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

  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const onMouseMove = (e: MouseEvent) => {
      const rect = hero.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      const module = hero.querySelector(".hero-module") as HTMLElement;
      if (module) {
        module.style.transform = `perspective(2000px) rotateY(${x * 4}deg) rotateX(${-y * 4}deg)`;
      }
    };

    const onMouseLeave = () => {
      const module = hero.querySelector(".hero-module") as HTMLElement;
      if (module) {
        module.style.transform = "perspective(2000px) rotateY(0deg) rotateX(0deg)";
      }
    };

    hero.addEventListener("mousemove", onMouseMove);
    hero.addEventListener("mouseleave", onMouseLeave);
    return () => {
      hero.removeEventListener("mousemove", onMouseMove);
      hero.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  const stats = [
    { icon: Zap, label: "Products", value: allProducts?.length ?? 0 },
    { icon: Globe, label: "Categories", value: categories?.length ?? 0 },
    { icon: Cpu, label: "Active Users", value: "10K+" },
    { icon: Shield, label: "Uptime", value: "99.9%" },
  ];

  const features = [
    { icon: Zap, title: "Instant Access", desc: "Get immediate access to all digital products after purchase. No waiting, no delays." },
    { icon: Shield, title: "Secure Payments", desc: "Enterprise-grade encryption for all transactions. Your data is always protected." },
    { icon: Globe, title: "Global Availability", desc: "Access your subscriptions from anywhere in the world, on any device." },
    { icon: Cpu, title: "AI-Powered Tools", desc: "Cutting-edge AI and machine learning tools to supercharge your workflow." },
  ];

  return (
    <div className="relative min-h-screen">
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center px-4">
        <div className="hero-module relative w-[90vw] max-w-5xl h-[70vh] min-h-[500px] glass-surface rounded-2xl grid-overlay transition-transform duration-300 ease-out">
          <div className="absolute inset-0 rounded-2xl pointer-events-none" style={{
            boxShadow: "inset 0 0 60px rgba(123, 44, 191, 0.15), 0 0 80px rgba(123, 44, 191, 0.2)"
          }} />
          <div className="absolute top-6 right-6 flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs font-mono text-[#9D4EDD]">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              SYS: ONLINE
            </div>
            <div className="text-xs font-mono text-[#7B2CBF]">
              {featuredProducts?.length ?? 0} ASSETS ACTIVE
            </div>
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8">
            <div className="flex items-center gap-3 mb-6">
              <Hexagon className="w-12 h-12 text-[#9D4EDD]" />
              <span className="text-4xl md:text-5xl font-bold text-white font-['Space_Grotesk'] tracking-wider">
              LOTAYA<span className="text-[#9D4EDD]"> DIGITAL STORE</span>
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 font-['Space_Grotesk'] text-glow">
              YOUR DIGITAL STORE
            </h1>
            <p className="text-gray-400 text-base md:text-lg max-w-xl mb-8">
              Premium digital products, AI tools, media subscriptions, and creative software — all in one secure store.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/products">
                <Button className="btn-gradient text-white px-8 py-3 rounded-xl text-base font-semibold flex items-center gap-2 animate-pulse">
                  INITIALIZE SESSION
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/categories">
                <Button variant="outline" className="border-[#7B2CBF]/50 text-[#E0AAFF] hover:bg-[#7B2CBF]/20 px-8 py-3 rounded-xl">
                  Browse Categories
                </Button>
              </Link>
            </div>
          </div>
          <div className="absolute bottom-6 left-6 right-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat) => (
                <div key={stat.label} className="flex items-center gap-3 px-4 py-2 rounded-lg glass-surface-light">
                  <stat.icon className="w-5 h-5 text-[#9D4EDD]" />
                  <div>
                    <div className="text-white font-bold text-sm">{stat.value}</div>
                    <div className="text-gray-500 text-[10px] font-mono uppercase">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-500 animate-bounce">
          <span className="text-xs font-mono">SCROLL DOWN</span>
          <ChevronDown className="w-5 h-5" />
        </div>
      </section>

      <section className="relative z-10 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 font-['Space_Grotesk']">
              Featured <span className="gradient-text">Products</span>
            </h2>
            <p className="text-gray-400 max-w-lg mx-auto">
              Hand-picked digital products chosen for their exceptional quality and value.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts?.slice(0, 6).map((product) => (
              <ProductCard key={product.id} product={product} cartId={cartId} />
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 font-['Space_Grotesk']">
              Browse by <span className="gradient-text">Category</span>
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories?.map((cat) => (
              <Link key={cat.id} to={`/products?category=${cat.slug}`} className="group glass-surface-light rounded-xl p-6 text-center transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(123,44,191,0.3)]">
                <div className="w-12 h-12 rounded-lg mx-auto mb-3 flex items-center justify-center text-white text-xl font-bold" style={{ backgroundColor: cat.color || "#7B2CBF" }}>
                  {cat.name.charAt(0)}
                </div>
                <h3 className="text-white font-semibold text-sm mb-1 group-hover:text-[#E0AAFF] transition-colors">{cat.name}</h3>
                <p className="text-gray-500 text-xs">{cat.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 font-['Space_Grotesk']">
              Why <span className="gradient-text">Lotaya Digital Store</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feat) => (
              <div key={feat.title} className="glass-surface-light rounded-xl p-6 transition-all duration-300 hover:scale-105">
                <div className="w-10 h-10 rounded-lg bg-[#7B2CBF]/30 flex items-center justify-center mb-4">
                  <feat.icon className="w-5 h-5 text-[#9D4EDD]" />
                </div>
                <h3 className="text-white font-semibold mb-2">{feat.title}</h3>
                <p className="text-gray-400 text-sm">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 py-20 px-4">
        <div className="max-w-3xl mx-auto glass-surface rounded-2xl p-10 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 font-['Space_Grotesk']">
            Ready to Unlock Your Digital Potential?
          </h2>
          <p className="text-gray-400 mb-8">
            Join thousands of professionals who trust Lotaya Digital Store for their digital toolkit.
          </p>
          <Link to="/products">
            <Button className="btn-gradient text-white px-8 py-3 rounded-xl text-base font-semibold">
              Get Started Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      <footer className="relative z-10 border-t border-[#7B2CBF]/20 py-10 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Hexagon className="w-6 h-6 text-[#9D4EDD]" />
            <span className="text-lg font-bold text-white font-['Space_Grotesk']">
              Lotaya<span className="text-[#9D4EDD]"> Digital Store</span>
            </span>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <Link to="/products" className="hover:text-[#9D4EDD] transition-colors">Products</Link>
            <Link to="/categories" className="hover:text-[#9D4EDD] transition-colors">Categories</Link>
            <span>2026 Lotaya Digital Store. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
