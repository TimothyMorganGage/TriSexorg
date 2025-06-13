import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Save, Box } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Product } from "@shared/schema";

interface ProductConfig {
  productId: number;
  widthCategory: string;
  lengthCategory: string;
  material: string;
  features: string[];
  customMeasurements?: {
    baseGirth: number;
    midGirth: number;
    headGirth: number;
    length: number;
  };
}

export default function Products() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedConfig, setSelectedConfig] = useState<ProductConfig>({
    productId: 1,
    widthCategory: "C",
    lengthCategory: "3",
    material: "ocean_plastic_hydrogel",
    features: ["enhanced_lubrication"],
  });

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const configurationMutation = useMutation({
    mutationFn: async (config: any) => {
      const response = await apiRequest("POST", "/api/configurations", config);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Configuration Saved",
        description: "Your product configuration has been saved successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/configurations"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const orderMutation = useMutation({
    mutationFn: async (orderData: any) => {
      // First create configuration
      const configResponse = await apiRequest("POST", "/api/configurations", {
        userId: user?.id,
        productId: selectedConfig.productId,
        size: `${selectedConfig.widthCategory}${selectedConfig.lengthCategory}`,
        material: selectedConfig.material,
        features: selectedConfig.features,
        status: "ordered",
      });
      const config = await configResponse.json();
      
      // Then create order
      const orderResponse = await apiRequest("POST", "/api/orders", {
        userId: user?.id,
        configurationId: config.id,
        totalAmount: calculatePrice().toString(),
        status: "pending",
      });
      return orderResponse.json();
    },
    onSuccess: () => {
      toast({
        title: "Order Placed",
        description: "Your order has been placed successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const calculatePrice = () => {
    const basePrice = selectedConfig.material === "ocean_plastic_hydrogel" ? 29.99 : 34.99;
    const featurePrice = selectedConfig.features.length * 5.00;
    return basePrice + featurePrice;
  };

  const handleSaveConfiguration = () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to save your configuration.",
        variant: "destructive",
      });
      return;
    }

    configurationMutation.mutate({
      userId: user.id,
      productId: selectedConfig.productId,
      size: `${selectedConfig.widthCategory}${selectedConfig.lengthCategory}`,
      material: selectedConfig.material,
      features: selectedConfig.features,
      status: "draft",
    });
  };

  const handleAddToOrder = () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to place an order.",
        variant: "destructive",
      });
      return;
    }

    orderMutation.mutate({});
  };

  const widthCategories = [
    { value: "A", label: "A Series", range: "45-47mm", description: "Ultra snug" },
    { value: "B", label: "B Series", range: "47-49mm", description: "Snug" },
    { value: "C", label: "C Series", range: "49-51mm", description: "Standard" },
    { value: "D", label: "D Series", range: "51-53mm", description: "Comfortable" },
    { value: "E", label: "E Series", range: "53-55mm", description: "Roomy" },
    { value: "F", label: "F Series", range: "55-57mm", description: "Extra roomy" },
    { value: "G", label: "G Series", range: "57-60mm", description: "Ultra roomy" },
    { value: "H", label: "H Series", range: "60mm+", description: "Maximum" },
  ];

  const lengthCategories = [
    { value: "1", label: "1 Series", range: "160mm", description: "Shorter" },
    { value: "3", label: "3 Series", range: "170mm", description: "Standard" },
    { value: "5", label: "5 Series", range: "180mm", description: "Longer" },
  ];

  const materialOptions = [
    {
      value: "ocean_plastic_hydrogel",
      label: "Ocean Plastic + Hydrogel",
      description: "Eco-friendly with enhanced comfort",
      price: 29.99,
    },
    {
      value: "natural_blend",
      label: "Natural Blend",
      description: "Plant-based materials only",
      price: 34.99,
    },
  ];

  const featureOptions = [
    { value: "enhanced_lubrication", label: "Enhanced lubrication", price: 5.00 },
    { value: "durability_coating", label: "Extra durability coating", price: 5.00 },
    { value: "textured_surface", label: "Textured surface options", price: 5.00 },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl lg:text-4xl font-bold text-neutral mb-4">
            Customize Your Protection
          </h1>
          <p className="text-xl text-gray-600">
            Personalize every aspect of your protection for optimal comfort and safety
          </p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid lg:grid-cols-2">
            <div className="p-8 lg:p-12">
              <h3 className="text-2xl font-semibold text-neutral mb-8">
                Product Configuration
              </h3>
              
              {/* Width Category Selection */}
              <div className="mb-8">
                <Label className="text-sm font-medium text-neutral mb-4 block">
                  Width Category (Girth)
                </Label>
                <RadioGroup
                  value={selectedConfig.widthCategory}
                  onValueChange={(value) =>
                    setSelectedConfig({ ...selectedConfig, widthCategory: value })
                  }
                >
                  <div className="grid grid-cols-4 gap-2">
                    {widthCategories.map((option) => (
                      <div key={option.value} className="relative">
                        <RadioGroupItem
                          value={option.value}
                          id={`width-${option.value}`}
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor={`width-${option.value}`}
                          className={`p-3 border-2 rounded-xl text-center cursor-pointer transition-colors block ${
                            selectedConfig.widthCategory === option.value
                              ? "border-primary bg-primary/5"
                              : "border-gray-200 hover:border-primary"
                          }`}
                        >
                          <div className="font-bold text-lg">{option.value}</div>
                          <div className="text-xs text-gray-600 mt-1">
                            {option.range}
                          </div>
                          <div className="text-xs text-gray-500">
                            {option.description}
                          </div>
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>

              {/* Length Category Selection */}
              <div className="mb-8">
                <Label className="text-sm font-medium text-neutral mb-4 block">
                  Length Category
                </Label>
                <RadioGroup
                  value={selectedConfig.lengthCategory}
                  onValueChange={(value) =>
                    setSelectedConfig({ ...selectedConfig, lengthCategory: value })
                  }
                >
                  <div className="grid grid-cols-3 gap-3">
                    {lengthCategories.map((option) => (
                      <div key={option.value} className="relative">
                        <RadioGroupItem
                          value={option.value}
                          id={`length-${option.value}`}
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor={`length-${option.value}`}
                          className={`p-4 border-2 rounded-xl text-center cursor-pointer transition-colors block ${
                            selectedConfig.lengthCategory === option.value
                              ? "border-primary bg-primary/5"
                              : "border-gray-200 hover:border-primary"
                          }`}
                        >
                          <div className="font-bold text-lg">{option.value}</div>
                          <div className="text-sm font-medium">{option.label}</div>
                          <div className="text-xs text-gray-600 mt-1">
                            {option.range}
                          </div>
                          <div className="text-xs text-gray-500">
                            {option.description}
                          </div>
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>
              
              {/* Material Selection */}
              <div className="mb-8">
                <Label className="text-sm font-medium text-neutral mb-4 block">
                  Material Options
                </Label>
                <RadioGroup
                  value={selectedConfig.material}
                  onValueChange={(value) =>
                    setSelectedConfig({ ...selectedConfig, material: value })
                  }
                >
                  <div className="space-y-3">
                    {materialOptions.map((option) => (
                      <div key={option.value} className="relative">
                        <RadioGroupItem
                          value={option.value}
                          id={option.value}
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor={option.value}
                          className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-colors ${
                            selectedConfig.material === option.value
                              ? "border-primary bg-primary/5"
                              : "border-gray-200 hover:border-primary"
                          }`}
                        >
                          <div className="flex-1">
                            <div className="font-medium flex items-center justify-between">
                              {option.label}
                              <Badge variant="secondary">${option.price}</Badge>
                            </div>
                            <div className="text-sm text-gray-600">
                              {option.description}
                            </div>
                          </div>
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>
              
              {/* Features */}
              <div className="mb-8">
                <Label className="text-sm font-medium text-neutral mb-4 block">
                  Additional Features
                </Label>
                <div className="space-y-3">
                  {featureOptions.map((option) => (
                    <div key={option.value} className="flex items-center space-x-3">
                      <Checkbox
                        id={option.value}
                        checked={selectedConfig.features.includes(option.value)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedConfig({
                              ...selectedConfig,
                              features: [...selectedConfig.features, option.value],
                            });
                          } else {
                            setSelectedConfig({
                              ...selectedConfig,
                              features: selectedConfig.features.filter(
                                (f) => f !== option.value
                              ),
                            });
                          }
                        }}
                      />
                      <Label htmlFor={option.value} className="flex-1 cursor-pointer">
                        <div className="flex justify-between items-center">
                          <span>{option.label}</span>
                          <Badge variant="outline">+${option.price}</Badge>
                        </div>
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <Separator className="mb-6" />
              
              <div className="flex items-center justify-between mb-6">
                <span className="text-lg font-semibold">Total Price:</span>
                <span className="text-2xl font-bold text-primary">
                  ${calculatePrice().toFixed(2)}
                </span>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={handleAddToOrder}
                  disabled={orderMutation.isPending}
                  className="flex-1"
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  {orderMutation.isPending ? "Processing..." : "Add to Order"}
                </Button>
                <Button
                  onClick={handleSaveConfiguration}
                  disabled={configurationMutation.isPending}
                  variant="outline"
                  className="flex-1"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {configurationMutation.isPending ? "Saving..." : "Save Configuration"}
                </Button>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-8 lg:p-12 flex items-center justify-center">
              <div className="text-center">
                <div className="w-32 h-32 bg-white rounded-full shadow-lg flex items-center justify-center mx-auto mb-6">
                  <Box className="text-primary h-16 w-16" />
                </div>
                <h4 className="text-xl font-semibold text-neutral mb-3">3D Preview</h4>
                <p className="text-gray-600 mb-4">
                  Your custom product will be rendered here
                </p>
                <Card>
                  <CardContent className="p-4 text-left">
                    <div className="text-sm text-gray-600 space-y-2">
                      <div className="flex justify-between">
                        <span>Size:</span>
                        <span className="font-medium capitalize">
                          {selectedConfig.size} (
                          {sizeOptions.find((s) => s.value === selectedConfig.size)?.range}
                          )
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Material:</span>
                        <span className="font-medium">
                          {materialOptions.find((m) => m.value === selectedConfig.material)?.label}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Features:</span>
                        <span className="font-medium">
                          {selectedConfig.features.length || "None"}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
