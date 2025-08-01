import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { BetaDisclaimer } from "@/components/BetaDisclaimer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingCart, Save, Box, Ruler, Target, Zap, BookOpen, ArrowRight } from "lucide-react";
import { Link } from "wouter";
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
    customMeasurements: {
      baseGirth: 51,
      midGirth: 50,
      headGirth: 49,
      length: 6,
    },
  });

  const [useCustomMeasurements, setUseCustomMeasurements] = useState(false);

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
    { value: "0", label: "0\"", range: "0 inches", description: "Minimal" },
    { value: "1", label: "1\"", range: "1 inch", description: "Ultra compact" },
    { value: "2", label: "2\"", range: "2 inches", description: "Very short" },
    { value: "3", label: "3\"", range: "3 inches", description: "Short" },
    { value: "4", label: "4\"", range: "4 inches", description: "Compact" },
    { value: "5", label: "5\"", range: "5 inches", description: "Standard" },
    { value: "6", label: "6\"", range: "6 inches", description: "Average" },
    { value: "7", label: "7\"", range: "7 inches", description: "Above average" },
    { value: "8", label: "8\"", range: "8 inches", description: "Large" },
    { value: "9", label: "9\"", range: "9 inches", description: "Extra large" },
    { value: "10", label: "10\"", range: "10 inches", description: "XXL" },
    { value: "11", label: "11\"", range: "11 inches", description: "XXXL" },
    { value: "12", label: "12\"", range: "12 inches", description: "Exceptional" },
    { value: "13", label: "13\"", range: "13 inches", description: "Extraordinary" },
    { value: "14", label: "14\"", range: "14 inches", description: "Ultra" },
    { value: "15", label: "15\"", range: "15 inches", description: "Maximum" },
    { value: "16", label: "16\"", range: "16 inches", description: "Ultimate" },
  ];

  const materialOptions = [
    {
      value: "universal_plastic_hydrogel",
      label: "Universal Recycled Plastic + Hydrogel Composite",
      description: "All plastic waste types transformed into medical-grade materials",
      price: 29.99,
      sustainability: "95% recycled from ocean, municipal, industrial, and electronic waste",
      process: "Multi-source plastic collection with advanced depolymerization",
      sources: [
        "Ocean microplastics (PET, microfibers, packaging)",
        "Municipal plastic waste (bottles, containers, films)",
        "Industrial manufacturing scrap (injection molding waste)",
        "Post-consumer packaging (food containers, wrapping)",
        "Electronic waste plastics (device housings, cables)",
        "Automotive plastic components (bumpers, interior parts)",
        "Textile microfibers (synthetic clothing waste)",
        "Medical device plastic waste (sterilized collection)"
      ]
    },
    {
      value: "natural_blend",
      label: "Natural Blend",
      description: "Plant-based materials only",
      price: 34.99,
    },
    {
      value: "medical_silicone_platinum",
      label: "Medical Silicone (Platinum)",
      description: "Platinum-cured medical grade for sensitive anal areas",
      price: 42.99,
    },
    {
      value: "latex_free_polymer",
      label: "Latex-Free Advanced Polymer",
      description: "Hypoallergenic polymer for latex sensitivities",
      price: 38.99,
    },
    {
      value: "smart_conductive",
      label: "Smart Temperature Material",
      description: "Conductive fibers for temperature regulation",
      price: 54.99,
    },
    {
      value: "biodegradable_hemp",
      label: "Hemp Fiber Composite",
      description: "Industrial hemp fibers in biocompatible matrix",
      price: 36.99,
    },
    {
      value: "graphene_enhanced",
      label: "Graphene Enhanced",
      description: "Graphene particles for enhanced durability",
      price: 64.99,
    },
    {
      value: "antimicrobial_silver",
      label: "Silver Ion Antimicrobial",
      description: "Silver nanoparticles for infection prevention",
      price: 48.99,
    }
  ];

  const featureOptions = [
    { value: "enhanced_lubrication", label: "Enhanced long-lasting lubrication", price: 5.00 },
    { value: "durability_coating", label: "Extra durability coating", price: 5.00 },
    { value: "textured_surface", label: "Textured surface options", price: 5.00 },
    { value: "anal_comfort_ring", label: "Anal comfort ring design", price: 8.00 },
    { value: "tapered_tip", label: "Tapered insertion tip", price: 6.00 },
    { value: "flexible_shaft", label: "Ultra-flexible shaft", price: 7.00 },
    { value: "temperature_responsive", label: "Body temperature responsive", price: 12.00 },
    { value: "antimicrobial_coating", label: "Antimicrobial surface coating", price: 9.00 },
    { value: "ph_balancing", label: "pH balancing formula", price: 8.00 },
    { value: "easy_removal_tab", label: "Easy removal safety tab", price: 4.00 },
    { value: "gradual_expansion", label: "Gradual expansion design", price: 10.00 },
    { value: "nerve_numbing", label: "Mild nerve desensitizing", price: 7.00 },
    { value: "vibration_compatible", label: "Vibration device compatible", price: 15.00 },
    { value: "glow_in_dark", label: "Glow-in-the-dark material", price: 6.00 },
    { value: "custom_color", label: "Custom color selection", price: 8.00 },
    { value: "scented_options", label: "Natural scent options", price: 5.00 },
    { value: "biodegradable_rapid", label: "Rapid biodegradable formula", price: 9.00 },
    { value: "extra_thin_walls", label: "Ultra-thin wall construction", price: 11.00 },
    { value: "ribbed_texture", label: "Internal ribbed texture", price: 8.00 },
    { value: "warming_sensation", label: "Gentle warming sensation", price: 9.00 }
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
    <div className="min-h-screen bg-surface">
      <BetaDisclaimer />
      <div className="py-20">
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
              <h3 className="text-2xl font-semibold text-neutral mb-8 font-recoleta">
                Product Configuration
              </h3>
              
              <Tabs defaultValue="standard" className="mb-8">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="standard" className="flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Standard Sizing
                  </TabsTrigger>
                  <TabsTrigger value="custom" className="flex items-center gap-2">
                    <Ruler className="h-4 w-4" />
                    Custom Measurements
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="standard" className="space-y-6">
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
                  <div className="grid grid-cols-4 gap-2">
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
                </TabsContent>
                
                <TabsContent value="custom" className="space-y-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <div className="flex items-start gap-3">
                      <Zap className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-900 mb-1">Precision Measurement Guide</h4>
                        <p className="text-sm text-blue-700">
                          All measurements processed locally for privacy. Take measurements while fully aroused for best fit.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Custom Length Measurement */}
                  <div className="space-y-4">
                    <Label className="text-sm font-medium text-neutral">
                      Length (inches) - Base to tip, top side
                    </Label>
                    <div className="space-y-2">
                      <Slider
                        value={[selectedConfig.customMeasurements?.length || 6]}
                        onValueChange={(value) =>
                          setSelectedConfig({
                            ...selectedConfig,
                            customMeasurements: {
                              ...selectedConfig.customMeasurements!,
                              length: value[0]
                            }
                          })
                        }
                        min={0}
                        max={16}
                        step={0.25}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>0"</span>
                        <span className="font-medium">{selectedConfig.customMeasurements?.length || 6}"</span>
                        <span>16"</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Base Girth Measurement */}
                  <div className="space-y-4">
                    <Label className="text-sm font-medium text-neutral">
                      Base Girth (mm) - Circumference at base
                    </Label>
                    <div className="space-y-2">
                      <Slider
                        value={[selectedConfig.customMeasurements?.baseGirth || 51]}
                        onValueChange={(value) =>
                          setSelectedConfig({
                            ...selectedConfig,
                            customMeasurements: {
                              ...selectedConfig.customMeasurements!,
                              baseGirth: value[0]
                            }
                          })
                        }
                        min={40}
                        max={70}
                        step={0.5}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>40mm</span>
                        <span className="font-medium">{selectedConfig.customMeasurements?.baseGirth || 51}mm</span>
                        <span>70mm</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Mid Girth Measurement */}
                  <div className="space-y-4">
                    <Label className="text-sm font-medium text-neutral">
                      Mid Girth (mm) - Middle shaft circumference
                    </Label>
                    <div className="space-y-2">
                      <Slider
                        value={[selectedConfig.customMeasurements?.midGirth || 50]}
                        onValueChange={(value) =>
                          setSelectedConfig({
                            ...selectedConfig,
                            customMeasurements: {
                              ...selectedConfig.customMeasurements!,
                              midGirth: value[0]
                            }
                          })
                        }
                        min={40}
                        max={70}
                        step={0.5}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>40mm</span>
                        <span className="font-medium">{selectedConfig.customMeasurements?.midGirth || 50}mm</span>
                        <span>70mm</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Head Girth Measurement */}
                  <div className="space-y-4">
                    <Label className="text-sm font-medium text-neutral">
                      Head Girth (mm) - Glans circumference
                    </Label>
                    <div className="space-y-2">
                      <Slider
                        value={[selectedConfig.customMeasurements?.headGirth || 49]}
                        onValueChange={(value) =>
                          setSelectedConfig({
                            ...selectedConfig,
                            customMeasurements: {
                              ...selectedConfig.customMeasurements!,
                              headGirth: value[0]
                            }
                          })
                        }
                        min={40}
                        max={70}
                        step={0.5}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>40mm</span>
                        <span className="font-medium">{selectedConfig.customMeasurements?.headGirth || 49}mm</span>
                        <span>70mm</span>
                      </div>
                    </div>
                  </div>

                  {/* Anal Diameter Measurement */}
                  <div className="space-y-4">
                    <Label className="text-sm font-medium text-neutral">
                      Anal Opening Diameter (mm) - Relaxed state
                    </Label>
                    <div className="space-y-2">
                      <Slider
                        value={[selectedConfig.customMeasurements?.analDiameter || 25]}
                        onValueChange={(value) =>
                          setSelectedConfig({
                            ...selectedConfig,
                            customMeasurements: {
                              ...selectedConfig.customMeasurements!,
                              analDiameter: value[0]
                            }
                          })
                        }
                        min={15}
                        max={45}
                        step={0.5}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>15mm</span>
                        <span className="font-medium">{selectedConfig.customMeasurements?.analDiameter || 25}mm</span>
                        <span>45mm</span>
                      </div>
                    </div>
                  </div>

                  {/* Insertion Depth Preference */}
                  <div className="space-y-4">
                    <Label className="text-sm font-medium text-neutral">
                      Maximum Insertion Depth (mm)
                    </Label>
                    <div className="space-y-2">
                      <Slider
                        value={[selectedConfig.customMeasurements?.insertionDepth || 80]}
                        onValueChange={(value) =>
                          setSelectedConfig({
                            ...selectedConfig,
                            customMeasurements: {
                              ...selectedConfig.customMeasurements!,
                              insertionDepth: value[0]
                            }
                          })
                        }
                        min={40}
                        max={150}
                        step={2}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>40mm</span>
                        <span className="font-medium">{selectedConfig.customMeasurements?.insertionDepth || 80}mm</span>
                        <span>150mm</span>
                      </div>
                    </div>
                  </div>

                  {/* Flexibility Preference */}
                  <div className="space-y-4">
                    <Label className="text-sm font-medium text-neutral">
                      Material Flexibility (Shore Hardness)
                    </Label>
                    <div className="space-y-2">
                      <Slider
                        value={[selectedConfig.customMeasurements?.flexibility || 25]}
                        onValueChange={(value) =>
                          setSelectedConfig({
                            ...selectedConfig,
                            customMeasurements: {
                              ...selectedConfig.customMeasurements!,
                              flexibility: value[0]
                            }
                          })
                        }
                        min={10}
                        max={40}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>10 (Ultra Soft)</span>
                        <span className="font-medium">{selectedConfig.customMeasurements?.flexibility || 25} Shore A</span>
                        <span>40 (Firm)</span>
                      </div>
                    </div>
                  </div>

                  {/* Wall Thickness Control */}
                  <div className="space-y-4">
                    <Label className="text-sm font-medium text-neutral">
                      Wall Thickness (mm) - Barrier thickness
                    </Label>
                    <div className="space-y-2">
                      <Slider
                        value={[selectedConfig.customMeasurements?.wallThickness || 0.8]}
                        onValueChange={(value) =>
                          setSelectedConfig({
                            ...selectedConfig,
                            customMeasurements: {
                              ...selectedConfig.customMeasurements!,
                              wallThickness: value[0]
                            }
                          })
                        }
                        min={0.3}
                        max={2.0}
                        step={0.1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>0.3mm (Ultra Thin)</span>
                        <span className="font-medium">{selectedConfig.customMeasurements?.wallThickness || 0.8}mm</span>
                        <span>2.0mm (Thick)</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Calculated Size Code</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      Based on your measurements, we recommend size code: 
                      <span className="font-bold text-primary ml-1">CUSTOM-{Date.now().toString().slice(-4)}</span>
                    </p>
                    <p className="text-xs text-gray-500">
                      Custom measurements ensure perfect fit with ±0.5mm tolerance
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
              
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
                        <span>Size Code:</span>
                        <span className="font-medium">
                          {selectedConfig.widthCategory}{selectedConfig.lengthCategory}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Width:</span>
                        <span className="font-medium">
                          {widthCategories.find(w => w.value === selectedConfig.widthCategory)?.range}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Length:</span>
                        <span className="font-medium">
                          {lengthCategories.find(l => l.value === selectedConfig.lengthCategory)?.range}
                        </span>
                      </div>
                      {selectedConfig.customMeasurements && (
                        <>
                          <div className="flex justify-between">
                            <span>Custom Length:</span>
                            <span className="font-medium text-primary">
                              {selectedConfig.customMeasurements.length}"
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Base Girth:</span>
                            <span className="font-medium text-primary">
                              {selectedConfig.customMeasurements.baseGirth}mm
                            </span>
                          </div>
                        </>
                      )}
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

        {/* Related Wiki Articles */}
        <div className="mt-16 bg-gray-50 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Educational Resources
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Learn more about custom sizing, materials, and sexual health with our comprehensive guides
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-2 mb-2">
                    <Ruler className="h-5 w-5 text-primary" />
                    <Badge variant="outline" className="text-xs">Custom Sizing</Badge>
                  </div>
                  <CardTitle className="text-lg">Precision Sizing Guide</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Complete guide to fluck's 60+ custom sizes with measurement techniques and best practices.
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">18 min read</span>
                    <Link href="/wiki">
                      <Button variant="outline" size="sm" className="text-xs">
                        Read Article <ArrowRight className="ml-1 h-3 w-3" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-2 mb-2">
                    <Target className="h-5 w-5 text-primary" />
                    <Badge variant="outline" className="text-xs">Materials</Badge>
                  </div>
                  <CardTitle className="text-lg">Sustainable Materials</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Learn about ocean plastic recovery, biodegradable options, and material science innovations.
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">15 min read</span>
                    <Link href="/wiki">
                      <Button variant="outline" size="sm" className="text-xs">
                        Read Article <ArrowRight className="ml-1 h-3 w-3" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-2 mb-2">
                    <Zap className="h-5 w-5 text-primary" />
                    <Badge variant="outline" className="text-xs">Health</Badge>
                  </div>
                  <CardTitle className="text-lg">Sexual Health Education</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Comprehensive guide to anatomy diversity, inclusive terminology, and health best practices.
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">22 min read</span>
                    <Link href="/wiki">
                      <Button variant="outline" size="sm" className="text-xs">
                        Read Article <ArrowRight className="ml-1 h-3 w-3" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="text-center">
              <Link href="/wiki">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Browse All Wiki Articles
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
        </div>
    </div>
  );
}
