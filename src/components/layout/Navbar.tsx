import { useState } from "react";
import { Link, useLocation } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { trpc } from "@/providers/trpc";
import {
  ShoppingCart,
  User,
  LogOut,
  Menu,
  X,
  Shield,
  Hexagon,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const isAdmin = user?.role === "admin";
  const isHome = location.pathname === "/";

  const sessionId = localStorage.getItem("cartSessionId") || undefined;
  const { data: cartData } = trpc.cart.get.useQuery(
    sessionId ? { sessionId } : undefined,
    { enabled: true, refetchInterval: 3000 }
  );
  const cartCount = cartData?.items?.length ?? 0;

  const navLinks = [
    { href: "/products", label: "Products" },
    { href: "/categories", label: "Categories" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isHome
          ? "bg-transparent"
          : "glass-surface-light border-b border-[#7B2CBF]/20"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <Hexagon className="w-8 h-8 text-[#9D4EDD] group-hover:text-[#E0AAFF] transition-colors" />
            <span className="text-xl font-bold text-white font-['Space_Grotesk'] tracking-wide">
              Lotaya<span className="text-[#9D4EDD]"> Digital Store</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`text-sm font-medium transition-colors hover:text-[#9D4EDD] ${
                  location.pathname.startsWith(link.href)
                    ? "text-[#9D4EDD]"
                    : "text-gray-300"
                }`}
              >
                {link.label}
              </Link>
            ))}
            {isAdmin && (
              <Link
                to="/admin"
                className={`text-sm font-medium transition-colors hover:text-[#9D4EDD] flex items-center gap-1 ${
                  location.pathname.startsWith("/admin")
                    ? "text-[#9D4EDD]"
                    : "text-gray-300"
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                Admin
              </Link>
            )}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/products">
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-300 hover:text-[#9D4EDD] hover:bg-[#7B2CBF]/20"
              >
                <Search className="w-4 h-4" />
              </Button>
            </Link>

            <Link to="/cart">
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-300 hover:text-[#9D4EDD] hover:bg-[#7B2CBF]/20 relative"
              >
                <ShoppingCart className="w-4 h-4" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#9D4EDD] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg glass-surface-light">
                  <User className="w-4 h-4 text-[#9D4EDD]" />
                  <span className="text-sm text-gray-200 font-medium">
                    {user?.name || "User"}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={logout}
                  className="text-gray-400 hover:text-red-400 hover:bg-red-400/10"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <Link to="/login">
                <Button className="btn-gradient text-white text-sm px-4 py-2 rounded-lg">
                  Sign In
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile menu */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-gray-300 hover:text-[#9D4EDD]"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {menuOpen && (
        <div className="md:hidden glass-surface border-t border-[#7B2CBF]/30">
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMenuOpen(false)}
                className="block text-gray-300 hover:text-[#9D4EDD] font-medium"
              >
                {link.label}
              </Link>
            ))}
            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 text-gray-300 hover:text-[#9D4EDD] font-medium"
              >
                <Shield className="w-4 h-4" />
                Admin Dashboard
              </Link>
            )}
            <div className="pt-3 border-t border-[#7B2CBF]/20 flex items-center gap-3">
              <Link to="/cart" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 text-gray-300">
                <ShoppingCart className="w-4 h-4" />
                Cart ({cartCount})
              </Link>
            </div>
            {isAuthenticated ? (
              <button
                onClick={() => {
                  logout();
                  setMenuOpen(false);
                }}
                className="flex items-center gap-2 text-red-400"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            ) : (
              <Link to="/login" onClick={() => setMenuOpen(false)} className="block">
                <Button className="btn-gradient text-white w-full">Sign In</Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
