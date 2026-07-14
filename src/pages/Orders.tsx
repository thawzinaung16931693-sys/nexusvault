import { Link } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { trpc } from "@/providers/trpc";
import { Button } from "@/components/ui/button";
import {
  ShoppingBag,
  ArrowLeft,
  PackageOpen,
  Calendar,
  CreditCard,
} from "lucide-react";
import { LOGIN_PATH } from "@/const";

export default function Orders() {
  const { user, isLoading: authLoading } = useAuth({
    redirectOnUnauthenticated: true,
    redirectPath: LOGIN_PATH,
  });

  const { data: orders, isLoading } = trpc.order.myOrders.useQuery(undefined, {
    enabled: !!user,
  });

  if (authLoading || isLoading) {
    return (
      <div className="relative z-10 min-h-screen pt-24 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="glass-surface-light rounded-xl h-64 animate-pulse" />
        </div>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="relative z-10 min-h-screen pt-24 px-4 flex items-center justify-center">
        <div className="glass-surface rounded-2xl p-10 max-w-md w-full text-center">
          <PackageOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2 font-['Space_Grotesk']">
            No Orders Yet
          </h1>
          <p className="text-gray-400 mb-6">
            You haven't placed any orders yet.
          </p>
          <Link to="/products">
            <Button className="btn-gradient text-white">
              <ShoppingBag className="w-4 h-4 mr-2" />
              Start Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative z-10 min-h-screen pt-20 pb-10 px-4">
      <div className="max-w-3xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-[#9D4EDD] transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <h1 className="text-3xl font-bold text-white mb-6 font-['Space_Grotesk']">
          My <span className="gradient-text">Orders</span>
        </h1>

        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="glass-surface rounded-xl p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                <div>
                  <div className="text-[#9D4EDD] font-mono text-sm mb-1">
                    {order.orderNumber}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "-"}
                    </span>
                    <span className="flex items-center gap-1">
                      <CreditCard className="w-3 h-3" />
                      {order.itemCount} items
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-lg text-xs font-medium ${
                    order.status === "completed" ? "bg-green-500/20 text-green-400" :
                    order.status === "pending" ? "bg-yellow-500/20 text-yellow-400" :
                    order.status === "cancelled" ? "bg-red-500/20 text-red-400" :
                    "bg-gray-500/20 text-gray-400"
                  }`}>
                    {order.status}
                  </span>
                  <span className="text-white font-bold">${order.totalAmount}</span>
                </div>
              </div>
              <div className="space-y-2 pt-4 border-t border-[#7B2CBF]/20">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-sm">
                    <span className="text-gray-300">
                      {item.productName} <span className="text-gray-500">x{item.quantity}</span>
                    </span>
                    <span className="text-gray-400">${item.price}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
