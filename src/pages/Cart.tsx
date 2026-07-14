import { useState } from "react";
import { Link } from "react-router";
import { trpc } from "@/providers/trpc";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  PackageOpen,
  CheckCircle,
} from "lucide-react";

export default function Cart() {
  const { user } = useAuth();
  const [ordered, setOrdered] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");

  const sessionId = localStorage.getItem("cartSessionId") || undefined;
  const utils = trpc.useUtils();

  const { data: cart, isLoading } = trpc.cart.get.useQuery(
    user?.id ? { userId: user.id } : sessionId ? { sessionId } : undefined
  );

  const removeItem = trpc.cart.removeItem.useMutation({
    onSuccess: () => utils.cart.get.invalidate(),
  });

  const updateQty = trpc.cart.updateQuantity.useMutation({
    onSuccess: () => utils.cart.get.invalidate(),
  });

  const clearCart = trpc.cart.clear.useMutation({
    onSuccess: () => utils.cart.get.invalidate(),
  });

  const createOrder = trpc.order.create.useMutation({
    onSuccess: (data) => {
      setOrderNumber(data.orderNumber);
      setOrdered(true);
      utils.cart.get.invalidate();
    },
  });

  if (ordered) {
    return (
      <div className="relative z-10 min-h-screen pt-24 px-4 flex items-center justify-center">
        <div className="glass-surface rounded-2xl p-10 max-w-md w-full text-center">
          <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2 font-['Space_Grotesk']">
            Order Confirmed!
          </h1>
          <p className="text-gray-400 mb-2">
            Your order has been placed successfully.
          </p>
          <p className="text-[#9D4EDD] font-mono text-sm mb-6">
            Order: {orderNumber}
          </p>
          <div className="flex flex-col gap-3">
            <Link to="/products">
              <Button className="btn-gradient text-white w-full">
                Continue Shopping
              </Button>
            </Link>
            {user && (
              <Link to="/orders">
                <Button variant="outline" className="border-[#7B2CBF]/30 text-[#E0AAFF] w-full">
                  View My Orders
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="relative z-10 min-h-screen pt-24 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="glass-surface-light rounded-xl h-64 animate-pulse" />
        </div>
      </div>
    );
  }

  if (!cart?.items || cart.items.length === 0) {
    return (
      <div className="relative z-10 min-h-screen pt-24 px-4 flex items-center justify-center">
        <div className="glass-surface rounded-2xl p-10 max-w-md w-full text-center">
          <PackageOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2 font-['Space_Grotesk']">
            Your Cart is Empty
          </h1>
          <p className="text-gray-400 mb-6">
            Browse our collection and add products to your cart.
          </p>
          <Link to="/products">
            <Button className="btn-gradient text-white">
              <ShoppingCart className="w-4 h-4 mr-2" />
              Start Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const total = cart.items.reduce((sum, item) => {
    const price = parseFloat(item.productPrice ?? "0");
    return sum + price * item.quantity;
  }, 0);

  const handleCheckout = () => {
    if (!cart.items.length) return;
    createOrder.mutate({
      cartId: cart.id,
      items: cart.items.map((item) => ({
        productId: item.productId,
        productName: item.productName ?? "Product",
        price: item.productPrice ?? "0",
        quantity: item.quantity,
      })),
      totalAmount: total.toFixed(2),
      customerEmail: user?.email || undefined,
      customerName: user?.name || undefined,
    });
  };

  return (
    <div className="relative z-10 min-h-screen pt-20 pb-10 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6 font-['Space_Grotesk']">
          Shopping <span className="gradient-text">Cart</span>
        </h1>

        <div className="space-y-3 mb-6">
          {cart.items.map((item) => (
            <div key={item.id} className="glass-surface-light rounded-xl p-4 flex items-center gap-4">
              <div className="w-20 h-14 rounded-lg overflow-hidden flex-shrink-0">
                <img src={item.productImage || "/placeholder.svg"} alt={item.productName ?? ""} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <Link to={`/products/${item.productSlug}`} className="text-white font-medium text-sm hover:text-[#E0AAFF] transition-colors line-clamp-1">
                  {item.productName}
                </Link>
                <span className="text-[#9D4EDD] text-xs">
                  {item.productType === "subscription" ? `${item.productBillingPeriod}` : "One-time"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => item.quantity > 1 && updateQty.mutate({ cartId: cart.id, itemId: item.id, quantity: item.quantity - 1 })} className="w-7 h-7 rounded-md bg-[#1a0a2e] text-gray-300 hover:text-white flex items-center justify-center">
                  <Minus className="w-3 h-3" />
                </button>
                <span className="text-white text-sm w-6 text-center">{item.quantity}</span>
                <button onClick={() => updateQty.mutate({ cartId: cart.id, itemId: item.id, quantity: item.quantity + 1 })} className="w-7 h-7 rounded-md bg-[#1a0a2e] text-gray-300 hover:text-white flex items-center justify-center">
                  <Plus className="w-3 h-3" />
                </button>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-white font-semibold text-sm">
                  ${(parseFloat(item.productPrice ?? "0") * item.quantity).toFixed(2)}
                </div>
              </div>
              <button onClick={() => removeItem.mutate({ cartId: cart.id, itemId: item.id })} className="text-gray-500 hover:text-red-400 transition-colors flex-shrink-0">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        <div className="glass-surface rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-400">Subtotal</span>
            <span className="text-white font-semibold">${total.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-400">Tax</span>
            <span className="text-white font-semibold">Included</span>
          </div>
          <div className="flex items-center justify-between pt-4 border-t border-[#7B2CBF]/20 mb-6">
            <span className="text-white font-bold text-lg">Total</span>
            <span className="text-[#9D4EDD] font-bold text-xl">${total.toFixed(2)}</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button size="lg" onClick={handleCheckout} disabled={createOrder.isPending} className="btn-gradient text-white flex-1 rounded-xl">
              {createOrder.isPending ? "Processing..." : <>Complete Checkout<ArrowRight className="w-5 h-5 ml-2" /></>}
            </Button>
            <Button variant="outline" onClick={() => clearCart.mutate({ cartId: cart.id })} className="border-red-500/30 text-red-400 hover:bg-red-500/10 rounded-xl">
              <Trash2 className="w-4 h-4 mr-2" />
              Clear Cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
