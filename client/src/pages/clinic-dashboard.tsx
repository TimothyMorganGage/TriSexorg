import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Package, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  Truck,
  RefreshCw,
  Plus,
  Minus,
  Search,
  Filter,
  Calendar,
  MapPin,
  Users,
  DollarSign,
  ShoppingCart,
  Warehouse,
  Bell,
  Heart
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface InventoryItem {
  id: number;
  productId: number;
  productName: string;
  category: string;
  currentStock: number;
  minimumThreshold: number;
  maximumCapacity: number;
  unitCost: number;
  lastRestock: string;
  expirationDate?: string;
  batchNumber: string;
  supplier: string;
  location: string;
  status: 'in_stock' | 'low_stock' | 'out_of_stock' | 'expired' | 'recalled';
  customConfiguration?: {
    lengthRange: string;
    material: string;
    features: string[];
  };
}

interface StockAlert {
  id: number;
  itemId: number;
  itemName: string;
  alertType: 'low_stock' | 'expiring' | 'recalled' | 'reorder_needed';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  createdAt: string;
  acknowledged: boolean;
}

interface RestockOrder {
  id: number;
  items: {
    itemId: number;
    itemName: string;
    quantity: number;
    unitCost: number;
  }[];
  supplier: string;
  orderDate: string;
  expectedDelivery: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
  totalCost: number;
}

export default function ClinicDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const queryClient = useQueryClient();

  // Fetch inventory data
  const { data: inventory = [], isLoading: inventoryLoading } = useQuery({
    queryKey: ['/api/clinic-inventory'],
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  // Fetch stock alerts
  const { data: alerts = [], isLoading: alertsLoading } = useQuery({
    queryKey: ['/api/stock-alerts'],
    refetchInterval: 15000 // Refresh every 15 seconds
  });

  // Fetch restock orders
  const { data: orders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ['/api/restock-orders']
  });

  // Update stock mutation
  const updateStockMutation = useMutation({
    mutationFn: (data: { itemId: number; newQuantity: number; notes?: string }) =>
      apiRequest(`/api/clinic-inventory/${data.itemId}/update-stock`, {
        method: 'POST',
        body: JSON.stringify({ quantity: data.newQuantity, notes: data.notes })
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/clinic-inventory'] });
      queryClient.invalidateQueries({ queryKey: ['/api/stock-alerts'] });
    }
  });

  // Create restock order mutation
  const createRestockOrderMutation = useMutation({
    mutationFn: (data: { items: { itemId: number; quantity: number }[]; supplier: string }) =>
      apiRequest('/api/restock-orders', {
        method: 'POST',
        body: JSON.stringify(data)
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/restock-orders'] });
      setSelectedItems([]);
    }
  });

  // Acknowledge alert mutation
  const acknowledgeAlertMutation = useMutation({
    mutationFn: (alertId: number) =>
      apiRequest(`/api/stock-alerts/${alertId}/acknowledge`, {
        method: 'POST'
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/stock-alerts'] });
    }
  });

  // Filter inventory based on search and filters
  const filteredInventory = inventory.filter((item: InventoryItem) => {
    const matchesSearch = item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.batchNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "all" || item.category === filterCategory;
    const matchesStatus = filterStatus === "all" || item.status === filterStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Calculate dashboard metrics
  const dashboardMetrics = {
    totalItems: inventory.length,
    lowStockItems: inventory.filter((item: InventoryItem) => item.currentStock <= item.minimumThreshold).length,
    outOfStockItems: inventory.filter((item: InventoryItem) => item.status === 'out_of_stock').length,
    expiringItems: inventory.filter((item: InventoryItem) => {
      if (!item.expirationDate) return false;
      const daysUntilExpiry = Math.ceil((new Date(item.expirationDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
      return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
    }).length,
    totalValue: inventory.reduce((sum: number, item: InventoryItem) => sum + (item.currentStock * item.unitCost), 0),
    pendingOrders: orders.filter((order: RestockOrder) => order.status === 'pending' || order.status === 'confirmed').length
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_stock': return 'bg-green-100 text-green-800';
      case 'low_stock': return 'bg-yellow-100 text-yellow-800';
      case 'out_of_stock': return 'bg-red-100 text-red-800';
      case 'expired': return 'bg-gray-100 text-gray-800';
      case 'recalled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAlertSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-blue-100 text-blue-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStockAdjustment = (itemId: number, adjustment: number) => {
    const item = inventory.find((i: InventoryItem) => i.id === itemId);
    if (item) {
      const newQuantity = Math.max(0, item.currentStock + adjustment);
      updateStockMutation.mutate({ itemId, newQuantity });
    }
  };

  const handleBulkRestock = () => {
    if (selectedItems.length === 0) return;

    const items = selectedItems.map(itemId => {
      const item = inventory.find((i: InventoryItem) => i.id === itemId);
      return {
        itemId,
        quantity: item ? Math.max(10, item.maximumCapacity - item.currentStock) : 10
      };
    });

    // Group by supplier for efficiency
    const supplierGroups = items.reduce((groups: any, item) => {
      const inventoryItem = inventory.find((i: InventoryItem) => i.id === item.itemId);
      const supplier = inventoryItem?.supplier || 'Default Supplier';
      if (!groups[supplier]) groups[supplier] = [];
      groups[supplier].push(item);
      return groups;
    }, {});

    Object.entries(supplierGroups).forEach(([supplier, supplierItems]) => {
      createRestockOrderMutation.mutate({
        items: supplierItems as { itemId: number; quantity: number }[],
        supplier
      });
    });
  };

  const criticalAlerts = alerts.filter((alert: StockAlert) => 
    alert.severity === 'critical' && !alert.acknowledged
  );

  return (
    <div className="min-h-screen bg-surface py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Intersex Healthcare Affirmation */}
        <Alert className="mb-8 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200">
          <Heart className="h-5 w-5 text-purple-600" />
          <AlertDescription className="ml-2">
            <strong>Intersex Healthcare IS Everyone's Affirmation:</strong> Clinic inventory centers intersex anatomy as the universal baseline—trans, non-binary, genderqueer, and quare embodiment are all respected within this participatory budgeting framework. There is no separate "transgender healthcare" category—all clinical products serve ALL bodies by design.
          </AlertDescription>
        </Alert>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground font-recoleta mb-2">
              Clinic Inventory Management
            </h1>
            <p className="text-xl text-muted-foreground font-coolvetica">
              Real-time inventory tracking and automated restock management
            </p>
          </div>
          <div className="flex items-center space-x-4">
            {criticalAlerts.length > 0 && (
              <Alert className="border-red-200 bg-red-50 max-w-sm">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  {criticalAlerts.length} critical alert{criticalAlerts.length > 1 ? 's' : ''} require immediate attention
                </AlertDescription>
              </Alert>
            )}
            <Button onClick={() => queryClient.invalidateQueries()} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Data
            </Button>
          </div>
        </div>

        {/* Dashboard Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Package className="h-5 w-5 text-blue-600" />
                <div>
                  <div className="text-2xl font-bold">{dashboardMetrics.totalItems}</div>
                  <div className="text-sm text-muted-foreground">Total Items</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <div>
                  <div className="text-2xl font-bold">{dashboardMetrics.lowStockItems}</div>
                  <div className="text-sm text-muted-foreground">Low Stock</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <div>
                  <div className="text-2xl font-bold">{dashboardMetrics.outOfStockItems}</div>
                  <div className="text-sm text-muted-foreground">Out of Stock</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-orange-600" />
                <div>
                  <div className="text-2xl font-bold">{dashboardMetrics.expiringItems}</div>
                  <div className="text-sm text-muted-foreground">Expiring Soon</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                <div>
                  <div className="text-2xl font-bold">${dashboardMetrics.totalValue.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Total Value</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Truck className="h-5 w-5 text-purple-600" />
                <div>
                  <div className="text-2xl font-bold">{dashboardMetrics.pendingOrders}</div>
                  <div className="text-sm text-muted-foreground">Pending Orders</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="inventory" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="inventory" className="flex items-center gap-2">
              <Warehouse className="h-4 w-4" />
              Inventory
            </TabsTrigger>
            <TabsTrigger value="alerts" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Alerts ({alerts.filter((a: StockAlert) => !a.acknowledged).length})
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              Restock Orders
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="inventory" className="space-y-6">
            {/* Search and Filters */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex-1 min-w-[300px]">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search products, batch numbers, or suppliers..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="external_protection">External Protection</SelectItem>
                      <SelectItem value="internal_protection">Internal Protection</SelectItem>
                      <SelectItem value="lubricants">Lubricants</SelectItem>
                      <SelectItem value="testing_kits">Testing Kits</SelectItem>
                      <SelectItem value="treatment">Treatment</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="in_stock">In Stock</SelectItem>
                      <SelectItem value="low_stock">Low Stock</SelectItem>
                      <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                      <SelectItem value="expired">Expired</SelectItem>
                    </SelectContent>
                  </Select>

                  {selectedItems.length > 0 && (
                    <Button onClick={handleBulkRestock} className="ml-auto">
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Restock Selected ({selectedItems.length})
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Inventory List */}
            <div className="space-y-4">
              {filteredInventory.map((item: InventoryItem) => (
                <Card key={item.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(item.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedItems(prev => [...prev, item.id]);
                            } else {
                              setSelectedItems(prev => prev.filter(id => id !== item.id));
                            }
                          }}
                          className="rounded"
                        />
                        <div>
                          <h3 className="font-semibold text-lg">{item.productName}</h3>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span>Batch: {item.batchNumber}</span>
                            <span>Supplier: {item.supplier}</span>
                            <span>Location: {item.location}</span>
                          </div>
                          {item.customConfiguration && (
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {item.customConfiguration.lengthRange}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {item.customConfiguration.material}
                              </Badge>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-6">
                        <div className="text-center">
                          <div className="text-sm text-muted-foreground">Current Stock</div>
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStockAdjustment(item.id, -1)}
                              disabled={item.currentStock <= 0}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="font-bold text-lg min-w-[60px] text-center">
                              {item.currentStock}
                            </span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStockAdjustment(item.id, 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>

                        <div className="text-center">
                          <div className="text-sm text-muted-foreground">Stock Level</div>
                          <Progress 
                            value={(item.currentStock / item.maximumCapacity) * 100} 
                            className="w-24 h-2 mt-1"
                          />
                          <div className="text-xs text-muted-foreground mt-1">
                            {item.minimumThreshold} - {item.maximumCapacity}
                          </div>
                        </div>

                        <div className="text-center">
                          <div className="text-sm text-muted-foreground">Status</div>
                          <Badge className={getStatusColor(item.status)}>
                            {item.status.replace('_', ' ').toUpperCase()}
                          </Badge>
                        </div>

                        <div className="text-center">
                          <div className="text-sm text-muted-foreground">Unit Cost</div>
                          <div className="font-bold">${item.unitCost.toFixed(2)}</div>
                        </div>

                        {item.expirationDate && (
                          <div className="text-center">
                            <div className="text-sm text-muted-foreground">Expires</div>
                            <div className="text-sm">
                              {new Date(item.expirationDate).toLocaleDateString()}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-4">
            {alerts.map((alert: StockAlert) => (
              <Alert 
                key={alert.id} 
                className={`${alert.acknowledged ? 'opacity-50' : ''} ${
                  alert.severity === 'critical' ? 'border-red-200 bg-red-50' : 
                  alert.severity === 'high' ? 'border-orange-200 bg-orange-50' : 
                  alert.severity === 'medium' ? 'border-yellow-200 bg-yellow-50' : 
                  'border-blue-200 bg-blue-50'
                }`}
              >
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium">{alert.itemName}</span>
                      <Badge className={getAlertSeverityColor(alert.severity)}>
                        {alert.severity.toUpperCase()}
                      </Badge>
                      <Badge variant="outline">
                        {alert.alertType.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>
                    <p>{alert.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(alert.createdAt).toLocaleString()}
                    </p>
                  </div>
                  {!alert.acknowledged && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => acknowledgeAlertMutation.mutate(alert.id)}
                    >
                      Acknowledge
                    </Button>
                  )}
                </AlertDescription>
              </Alert>
            ))}
          </TabsContent>

          <TabsContent value="orders" className="space-y-4">
            {orders.map((order: RestockOrder) => (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="font-recoleta">
                      Order #{order.id} - {order.supplier}
                    </CardTitle>
                    <Badge className={
                      order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                      order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'confirmed' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }>
                      {order.status.toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-3">Order Items:</h4>
                      <div className="space-y-2">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-sm">
                            <span>{item.itemName}</span>
                            <span>{item.quantity} × ${item.unitCost.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Order Date:</span>
                        <span>{new Date(order.orderDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Expected Delivery:</span>
                        <span>{new Date(order.expectedDelivery).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between font-bold">
                        <span>Total Cost:</span>
                        <span>${order.totalCost.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="font-recoleta">Inventory Turnover</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Fast Moving Items</span>
                      <span className="font-bold">23 items</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Slow Moving Items</span>
                      <span className="font-bold">8 items</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Average Turnover Rate</span>
                      <span className="font-bold">4.2x/month</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="font-recoleta">Cost Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Monthly Inventory Cost</span>
                      <span className="font-bold">${(dashboardMetrics.totalValue * 0.08).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Waste from Expiration</span>
                      <span className="font-bold">$2,340</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Cost Savings (Automation)</span>
                      <span className="font-bold text-green-600">+$8,920</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}