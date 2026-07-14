import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { trpc } from "@/providers/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart3,
  Users,
  Package,
  ShoppingBag,
  TrendingUp,
  DollarSign,
  Shield,
  UserCheck,
  Pencil,
  Trash2,
  Search,
  ArrowLeft,
} from "lucide-react";
import { LOGIN_PATH } from "@/const";

export default function Admin() {
  const { user, isLoading: authLoading } = useAuth({
    redirectOnUnauthenticated: true,
    redirectPath: LOGIN_PATH,
  });
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [search, setSearch] = useState("");

  if (!authLoading && user?.role !== "admin") {
    return (
      <div className="relative z-10 min-h-screen pt-24 px-4 flex items-center justify-center">
        <div className="glass-surface rounded-2xl p-10 text-center max-w-md">
          <Shield className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-white mb-2">
            Access Denied
          </h1>
          <p className="text-gray-400 mb-4">
            You need admin privileges to access this page.
          </p>
          <Button onClick={() => navigate("/")} className="btn-gradient text-white">
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative z-10 min-h-screen pt-20 pb-10 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white font-['Space_Grotesk']">
              Admin <span className="gradient-text">Dashboard</span>
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Manage products, orders, and users
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate("/")}
            className="border-[#7B2CBF]/30 text-[#E0AAFF]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Store
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="glass-surface-light mb-6">
            <TabsTrigger value="overview" className="data-[state=active]:bg-[#7B2CBF]/30 data-[state=active]:text-[#9D4EDD]">
              <BarChart3 className="w-4 h-4 mr-1" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="products" className="data-[state=active]:bg-[#7B2CBF]/30 data-[state=active]:text-[#9D4EDD]">
              <Package className="w-4 h-4 mr-1" />
              Products
            </TabsTrigger>
            <TabsTrigger value="orders" className="data-[state=active]:bg-[#7B2CBF]/30 data-[state=active]:text-[#9D4EDD]">
              <ShoppingBag className="w-4 h-4 mr-1" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-[#7B2CBF]/30 data-[state=active]:text-[#9D4EDD]">
              <Users className="w-4 h-4 mr-1" />
              Users
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <OverviewTab />
          </TabsContent>
          <TabsContent value="products">
            <ProductsTab search={search} setSearch={setSearch} />
          </TabsContent>
          <TabsContent value="orders">
            <OrdersTab search={search} setSearch={setSearch} />
          </TabsContent>
          <TabsContent value="users">
            <UsersTab search={search} setSearch={setSearch} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function OverviewTab() {
  const { data: dashboard } = trpc.admin.dashboard.useQuery();
  const { data: products } = trpc.admin.products.useQuery();
  const { data: orders } = trpc.admin.orders.useQuery();

  const stats = [
    { label: "Total Users", value: dashboard?.users ?? 0, icon: Users, color: "#9D4EDD" },
    { label: "Products", value: dashboard?.products.total ?? 0, icon: Package, color: "#7B2CBF" },
    { label: "Total Orders", value: dashboard?.orders.total ?? 0, icon: ShoppingBag, color: "#5A189A" },
    { label: "Revenue", value: `$${parseFloat(dashboard?.orders.revenue ?? "0").toFixed(2)}`, icon: DollarSign, color: "#3C096C" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="glass-surface rounded-xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${stat.color}30` }}>
              <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-gray-400 text-xs">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="glass-surface rounded-xl p-6">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-[#9D4EDD]" />
          Recent Orders
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-400 border-b border-[#7B2CBF]/20">
                <th className="text-left py-2 px-3">Order #</th>
                <th className="text-left py-2 px-3">Customer</th>
                <th className="text-left py-2 px-3">Items</th>
                <th className="text-left py-2 px-3">Total</th>
                <th className="text-left py-2 px-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders?.slice(0, 5).map((order) => (
                <tr key={order.id} className="border-b border-[#7B2CBF]/10 hover:bg-[#1a0a2e]/30">
                  <td className="py-2 px-3 text-[#9D4EDD] font-mono">{order.orderNumber}</td>
                  <td className="py-2 px-3 text-gray-300">{order.customerName || "Guest"}</td>
                  <td className="py-2 px-3 text-gray-300">{order.itemCount}</td>
                  <td className="py-2 px-3 text-white font-medium">${order.totalAmount}</td>
                  <td className="py-2 px-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      order.status === "completed" ? "bg-green-500/20 text-green-400" :
                      order.status === "pending" ? "bg-yellow-500/20 text-yellow-400" :
                      "bg-red-500/20 text-red-400"
                    }`}>{order.status}</span>
                  </td>
                </tr>
              ))}
              {(!orders || orders.length === 0) && (
                <tr><td colSpan={5} className="py-8 text-center text-gray-500">No orders yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="glass-surface rounded-xl p-6">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <Package className="w-5 h-5 text-[#9D4EDD]" />
          Top Products
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products?.slice(0, 6).map((product) => (
            <div key={product.id} className="glass-surface-light rounded-lg p-4 flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                <img src={product.image || "/placeholder.svg"} alt={product.name} className="w-full h-full object-cover" />
              </div>
              <div className="min-w-0">
                <div className="text-white text-sm font-medium truncate">{product.name}</div>
                <div className="text-[#9D4EDD] text-xs">${product.price} - {product.salesCount} sales</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProductsTab({ search, setSearch }: { search: string; setSearch: (s: string) => void }) {
  const utils = trpc.useUtils();
  const { data: products, isLoading } = trpc.admin.products.useQuery();
  const deleteProduct = trpc.admin.deleteProduct.useMutation({
    onSuccess: () => {
      utils.admin.products.invalidate();
      utils.admin.dashboard.invalidate();
    },
  });

  const filtered = products?.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <Input placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 bg-[#1a0a2e]/50 border-[#7B2CBF]/30 text-white" />
      </div>
      <div className="glass-surface rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-400 border-b border-[#7B2CBF]/20 bg-[#1a0a2e]/50">
                <th className="text-left py-3 px-4">Product</th>
                <th className="text-left py-3 px-4">Category</th>
                <th className="text-left py-3 px-4">Price</th>
                <th className="text-left py-3 px-4">Type</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Sales</th>
                <th className="text-left py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered?.map((product) => (
                <tr key={product.id} className="border-b border-[#7B2CBF]/10 hover:bg-[#1a0a2e]/30">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                        <img src={product.image || "/placeholder.svg"} alt={product.name} className="w-full h-full object-cover" />
                      </div>
                      <span className="text-white font-medium truncate max-w-[150px]">{product.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-300">{product.categoryName}</td>
                  <td className="py-3 px-4 text-white font-medium">${product.price}</td>
                  <td className="py-3 px-4 text-gray-300 capitalize">{product.type}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${product.isActive === "yes" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                      {product.isActive === "yes" ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-300">{product.salesCount}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <button className="text-gray-400 hover:text-[#9D4EDD] transition-colors"><Pencil className="w-4 h-4" /></button>
                      <button onClick={() => { if (confirm("Delete this product?")) deleteProduct.mutate({ id: product.id }); }} className="text-gray-400 hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {(!filtered || filtered.length === 0) && (
                <tr><td colSpan={7} className="py-8 text-center text-gray-500">{isLoading ? "Loading..." : "No products found"}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function OrdersTab({ search, setSearch }: { search: string; setSearch: (s: string) => void }) {
  const utils = trpc.useUtils();
  const { data: orders, isLoading } = trpc.admin.orders.useQuery();
  const updateStatus = trpc.admin.updateOrderStatus.useMutation({
    onSuccess: () => {
      utils.admin.orders.invalidate();
      utils.admin.dashboard.invalidate();
    },
  });

  const filtered = orders?.filter((o) =>
    o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
    (o.customerName?.toLowerCase() || "").includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <Input placeholder="Search orders..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 bg-[#1a0a2e]/50 border-[#7B2CBF]/30 text-white" />
      </div>
      <div className="glass-surface rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-400 border-b border-[#7B2CBF]/20 bg-[#1a0a2e]/50">
                <th className="text-left py-3 px-4">Order #</th>
                <th className="text-left py-3 px-4">Customer</th>
                <th className="text-left py-3 px-4">Email</th>
                <th className="text-left py-3 px-4">Items</th>
                <th className="text-left py-3 px-4">Total</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Date</th>
                <th className="text-left py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered?.map((order) => (
                <tr key={order.id} className="border-b border-[#7B2CBF]/10 hover:bg-[#1a0a2e]/30">
                  <td className="py-3 px-4 text-[#9D4EDD] font-mono text-xs">{order.orderNumber}</td>
                  <td className="py-3 px-4 text-gray-300">{order.customerName || "Guest"}</td>
                  <td className="py-3 px-4 text-gray-300 text-xs">{order.customerEmail || "-"}</td>
                  <td className="py-3 px-4 text-gray-300">{order.itemCount}</td>
                  <td className="py-3 px-4 text-white font-medium">${order.totalAmount}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      order.status === "completed" ? "bg-green-500/20 text-green-400" :
                      order.status === "pending" ? "bg-yellow-500/20 text-yellow-400" :
                      order.status === "cancelled" ? "bg-red-500/20 text-red-400" :
                      "bg-gray-500/20 text-gray-400"
                    }`}>{order.status}</span>
                  </td>
                  <td className="py-3 px-4 text-gray-400 text-xs">{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "-"}</td>
                  <td className="py-3 px-4">
                    <select value={order.status} onChange={(e) => updateStatus.mutate({ orderId: order.id, status: e.target.value as any })} className="bg-[#1a0a2e] border border-[#7B2CBF]/30 text-gray-300 text-xs rounded px-2 py-1">
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="refunded">Refunded</option>
                    </select>
                  </td>
                </tr>
              ))}
              {(!filtered || filtered.length === 0) && (
                <tr><td colSpan={8} className="py-8 text-center text-gray-500">{isLoading ? "Loading..." : "No orders found"}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function UsersTab({ search, setSearch }: { search: string; setSearch: (s: string) => void }) {
  const utils = trpc.useUtils();
  const { data: users, isLoading } = trpc.admin.users.useQuery();
  const updateRole = trpc.admin.updateUserRole.useMutation({
    onSuccess: () => {
      utils.admin.users.invalidate();
      utils.admin.dashboard.invalidate();
    },
  });

  const filtered = users?.filter((u) =>
    (u.name?.toLowerCase() || "").includes(search.toLowerCase()) ||
    (u.email?.toLowerCase() || "").includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <Input placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 bg-[#1a0a2e]/50 border-[#7B2CBF]/30 text-white" />
      </div>
      <div className="glass-surface rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-400 border-b border-[#7B2CBF]/20 bg-[#1a0a2e]/50">
                <th className="text-left py-3 px-4">User</th>
                <th className="text-left py-3 px-4">Email</th>
                <th className="text-left py-3 px-4">Role</th>
                <th className="text-left py-3 px-4">Joined</th>
                <th className="text-left py-3 px-4">Last Sign In</th>
                <th className="text-left py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered?.map((u) => (
                <tr key={u.id} className="border-b border-[#7B2CBF]/10 hover:bg-[#1a0a2e]/30">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      {u.avatar ? (
                        <img src={u.avatar} alt={u.name || ""} className="w-8 h-8 rounded-full" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-[#7B2CBF]/30 flex items-center justify-center text-[#9D4EDD] text-xs font-bold">
                          {(u.name || "U").charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span className="text-white font-medium">{u.name || "Unnamed"}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-300 text-xs">{u.email || "-"}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium flex items-center gap-1 w-fit ${
                      u.role === "admin" ? "bg-[#9D4EDD]/20 text-[#9D4EDD]" : "bg-gray-500/20 text-gray-400"
                    }`}>
                      {u.role === "admin" ? <Shield className="w-3 h-3" /> : <UserCheck className="w-3 h-3" />}
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-400 text-xs">{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "-"}</td>
                  <td className="py-3 px-4 text-gray-400 text-xs">{u.lastSignInAt ? new Date(u.lastSignInAt).toLocaleDateString() : "-"}</td>
                  <td className="py-3 px-4">
                    <select value={u.role} onChange={(e) => updateRole.mutate({ id: u.id, role: e.target.value as "user" | "admin" })} className="bg-[#1a0a2e] border border-[#7B2CBF]/30 text-gray-300 text-xs rounded px-2 py-1">
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                </tr>
              ))}
              {(!filtered || filtered.length === 0) && (
                <tr><td colSpan={6} className="py-8 text-center text-gray-500">{isLoading ? "Loading..." : "No users found"}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
