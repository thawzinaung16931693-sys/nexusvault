import { Routes, Route } from "react-router";
import AuroraBackground from "@/components/aurora/AuroraBackground";
import Navbar from "@/components/layout/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Categories from "./pages/Categories";
import Orders from "./pages/Orders";
import Admin from "./pages/Admin";

export default function App() {
  return (
    <div className="relative min-h-screen bg-[#0D0221]">
      <AuroraBackground />
      <div className="relative z-10">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:slug" element={<ProductDetail />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
}
