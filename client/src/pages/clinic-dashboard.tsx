import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Package, TrendingUp, Clock, CheckCircle, 
  AlertTriangle, Settings, RefreshCw, 
  ShoppingCart, Users, Calendar, FileText 
} from "lucide-react";
import { useAuth } from "@/lib/auth";

export default function ClinicDashboard() {
  const { user } = useAuth();

  const { data: orderStats } = useQuery({
    queryKey: ["/api/analytics/orders"],
  });

  const { data: orders } = useQuery({
    queryKey: ["/api/orders", user?.id],
    queryFn: async () => {
      const response = await fetch(`/api/orders?clinicId=${user?.id}`);
      return response.json();
    },
    enabled: !!user && user.role === "clinic_staff",
  });

  if (!user || user.role !== "clinic_staff") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Clinic Access Required</h2>
            <p className="text-gray-600 mb-4">
              This dashboard is only available to clinic staff members.
            </p>
            <Button asChild>
              <a href="/partnership">Request Partnership</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "in_production":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getInventoryStatus = (count: number) => {
    if (count > 20) return { status: "In Stock", color: "text-green-600", icon: CheckCircle };
    if (count > 5) return { status: "Low Stock", color: "text-yellow-600", icon: AlertTriangle };
    return { status: "Out of Stock", color: "text-red-600", icon: AlertTriangle };
  };

  const inventoryItems = [
    { name: "Small Size (45-52mm)", material: "Ocean Plastic + Hydrogel", count: 24 },
    { name: "Medium Size (53-56mm)", material: "Ocean Plastic + Hydrogel", count: 8 },
    { name: "Large Size (57-64mm)", material: "Natural Blend", count: 31 },
    { name: "Small Size (45-52mm)", material: "Natural Blend", count: 15 },
    { name: "Medium Size (53-56mm)", material: "Natural Blend", count: 2 },
    { name: "Large Size (57-64mm)", material: "Ocean Plastic + Hydrogel", count: 19 },
  ];

  return (
    <div className="min-h-screen bg-surface py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="gradient-hero text-white rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Clinic Dashboard</h1>
              <p className="text-blue-100">{user.organizationName || "Healthcare Provider"}</p>
            </div>
            <Button className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-1">
                {orderStats?.activeOrders || 47}
              </div>
              <div className="text-sm text-gray-600">Active Orders</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-secondary mb-1">
                {orderStats?.monthlyOrders || 128}
              </div>
              <div className="text-sm text-gray-600">This Month</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-accent mb-1">95%</div>
              <div className="text-sm text-gray-600">Inventory Level</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-1">4.9</div>
              <div className="text-sm text-gray-600">Satisfaction</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="patients">Patients</TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Recent Orders</CardTitle>
                  <Button variant="outline" size="sm">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Refresh
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { id: "CFH-2024-0847", date: "March 15, 2024", status: "in_production" },
                    { id: "CFH-2024-0846", date: "March 14, 2024", status: "delivered" },
                    { id: "CFH-2024-0845", date: "March 13, 2024", status: "shipped" },
                    { id: "CFH-2024-0844", date: "March 12, 2024", status: "pending" },
                    { id: "CFH-2024-0843", date: "March 11, 2024", status: "delivered" },
                  ].map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Package className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium text-neutral">Order {order.id}</div>
                          <div className="text-sm text-gray-600">{order.date}</div>
                        </div>
                      </div>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status.replace("_", " ").toUpperCase()}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inventory" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Inventory Overview</CardTitle>
                  <Button>
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Reorder Inventory
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {inventoryItems.map((item, index) => {
                    const inventoryStatus = getInventoryStatus(item.count);
                    const StatusIcon = inventoryStatus.icon;
                    
                    return (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <StatusIcon className={`h-5 w-5 ${inventoryStatus.color}`} />
                          </div>
                          <div>
                            <div className="font-medium text-neutral">{item.name}</div>
                            <div className="text-sm text-gray-600">{item.material}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-neutral">{item.count} units</div>
                          <div className={`text-sm ${inventoryStatus.color}`}>
                            {inventoryStatus.status}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="mr-2 h-5 w-5" />
                    Order Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">This Week</span>
                      <span className="font-semibold">32 orders</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Last Week</span>
                      <span className="font-semibold">28 orders</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Growth</span>
                      <Badge className="bg-green-100 text-green-800">+14.3%</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="mr-2 h-5 w-5" />
                    Average Processing Time
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Order to Production</span>
                      <span className="font-semibold">2.1 days</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Production to Ship</span>
                      <span className="font-semibold">3.4 days</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total Delivery</span>
                      <Badge className="bg-blue-100 text-blue-800">5.5 days</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="patients" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5" />
                  Patient Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">
                    Patient Records
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Patient management features are available with full platform integration.
                  </p>
                  <Button variant="outline">
                    <Calendar className="mr-2 h-4 w-4" />
                    Schedule Consultation
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
