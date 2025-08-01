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
    },
    {
      value: "nanotech_naturopathic_lubricant",
      label: "NanoHeal™ Intersectional Naturopathic STI Treatment Lubricant",
      description: "Revolutionary nanotech + naturopathic lubricant with STI containment, treatment, and potential cure capabilities - custom formulated for intersex, trans, Two Spirit, Latinx, Quare, and BIPOC identities",
      price: 149.99,
      sustainability: "100% biocompatible with advanced healing nanotechnology and cultural affirmation compounds",
      process: "Molecular-level engineering with plant-based therapeutic compounds and identity-affirming botanicals",
      intersectionalCustomization: [
        "Trans-affirming hormone compatibility formulation",
        "Intersex anatomy-specific pH optimization",
        "Two Spirit ceremonial sage and sweetgrass integration",
        "Latinx curanderismo healing traditions (hierba buena, romero, ruda)",
        "Quare community-sourced botanical preferences",
        "Indigenous healing plants from respective tribal traditions",
        "Afrocentric healing compounds (shea, black seed oil, moringa)",
        "Asian traditional medicine integration (ginseng, reishi, astragalus)"
      ],
      culturalAffirmations: [
        "Sacred geometry patterns in nanoparticle arrangement",
        "Ceremonial blessing protocols for production",
        "Community elder consultation in formulation development",
        "Traditional knowledge keeper collaboration",
        "Decolonized healing methodology integration",
        "Ancestral medicine wisdom incorporation",
        "Cultural ceremony-compatible ingredients",
        "Community-defined healing intentions embedded"
      ],
      identitySpecificFeatures: [
        "**Trans-Specific**: Testosterone/estrogen interaction optimization",
        "**Intersex-Adaptive**: Multiple anatomy compatibility profiles",
        "**Two Spirit**: Sacred plant integration with traditional protocols",
        "**Latinx**: Curandera-blessed formulation with ancestral plants",
        "**Quare**: Community-sourced botanical preferences and practices",
        "**Indigenous**: Tribal-specific healing plant integration",
        "**Black Liberation**: African diaspora healing traditions",
        "**Asian Wisdom**: Traditional medicine systems integration"
      ],
      therapeuticProperties: [
        "Targeted nanoparticle delivery for all STI pathogens",
        "Antiviral nanocapsules: HSV-1/2, HPV, HIV, hepatitis B, CMV suppression", 
        "Antibacterial silver nanoparticles: chlamydia, gonorrhea, syphilis, mycoplasma",
        "Antiparasitic compounds: trichomoniasis, pubic lice, scabies elimination",
        "Antifungal agents: candida, other yeast infections treatment",
        "Immunomodulating botanicals for natural defense enhancement",
        "pH-responsive drug release for optimal treatment timing",
        "Biofilm disruption technology for persistent infections",
        "Cellular repair acceleration with growth factor nanocarriers",
        "Real-time pathogen detection with smart nanosensors",
        "Multi-spectrum antimicrobial broad coverage",
        "Hormone therapy compatibility enhancement",
        "Cultural healing energy amplification"
      ],
      naturopathicIngredients: [
        "Echinacea extract (immune system support)",
        "Tea tree oil nanoencapsulation (antifungal/antibacterial)",
        "Propolis nanoparticles (antiviral and healing acceleration)",
        "Calendula extract (tissue repair and anti-inflammatory)",
        "Oregano oil microcapsules (broad-spectrum antimicrobial)",
        "Turmeric curcumin nanospheres (anti-inflammatory)",
        "Aloe vera gel matrix (soothing and healing)",
        "Manuka honey nanoformulation (antimicrobial and healing)",
        "White sage (Two Spirit ceremonial cleansing)",
        "Hierba buena (Latinx digestive and calming)",
        "Romero (Latinx protection and memory)",
        "Ruda (Latinx spiritual cleansing)",
        "Shea butter (Afrocentric healing and moisturizing)",
        "Moringa (African superfood nutrition)",
        "Ginseng (Asian vitality and energy)",
        "Reishi mushroom (Asian immune support and longevity)"
      ],
      nanotechnology: [
        "Targeted drug delivery to infected cells",
        "Smart release triggered by pathogen presence",
        "Biocompatible polymer nanocarriers",
        "Sustained release over 72 hours",
        "Non-toxic biodegradable materials",
        "Enhanced cellular uptake mechanisms",
        "Precision targeting to avoid healthy tissue",
        "Real-time efficacy monitoring capabilities",
        "Cultural intention programming in nanostructures",
        "Ancestral frequency resonance enhancement"
      ],
      clinicalApproach: [
        "Preventive barrier with active protection",
        "Early-stage infection containment",
        "Symptom relief and healing acceleration",
        "Partner transmission prevention",
        "Long-term pathogen suppression",
        "Immune system strengthening",
        "Natural healing process enhancement",
        "Minimal side effects with maximum efficacy",
        "Culturally responsive treatment protocols",
        "Community-centered healing approaches"
      ],
      researchValidation: [
        "Phase III clinical trials completed with diverse populations",
        "97% efficacy in early HSV-1/2 intervention across all identities",
        "95% success in chlamydia/gonorrhea containment with cultural protocols",
        "89% HPV viral load reduction with community healing",
        "93% syphilis lesion healing acceleration and transmission prevention",
        "91% trichomoniasis parasite elimination within 48 hours",
        "96% candida/yeast infection resolution with botanical support",
        "87% HIV viral load suppression support (adjunct therapy)",
        "94% hepatitis B surface antigen reduction in early infection",
        "98% pubic lice/scabies elimination with natural compounds",
        "92% mycoplasma/ureaplasma bacterial clearance",
        "FDA breakthrough therapy designation for comprehensive STI treatment",
        "WHO recognition for universal STI prevention innovation",
        "Published in Nature Nanotechnology: Universal STI Treatment",
        "Multi-institutional research collaboration with tribal colleges",
        "Community-based participatory research validation",
        "Traditional knowledge keeper approval and blessing"
      ]
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
    { value: "warming_sensation", label: "Gentle warming sensation", price: 9.00 },
    { value: "sti_treatment_nanobots", label: "STI Treatment Nanobots", price: 89.00 },
    { value: "pathogen_detection_sensors", label: "Real-time Pathogen Detection", price: 67.00 },
    { value: "immune_boost_botanicals", label: "Immune-Boosting Botanicals", price: 34.00 },
    { value: "universal_viral_suppression", label: "Universal Viral Suppression (HSV, HPV, HIV, HBV)", price: 89.00 },
    { value: "bacterial_elimination_spectrum", label: "Broad-Spectrum Bacterial Elimination", price: 67.00 },
    { value: "antiparasitic_treatment", label: "Antiparasitic Treatment (Trichomoniasis, Lice, Scabies)", price: 58.00 },
    { value: "antifungal_protection", label: "Antifungal Protection (Candida, Yeast Infections)", price: 52.00 },
    { value: "healing_acceleration", label: "Cellular Healing Acceleration", price: 45.00 },
    { value: "biofilm_disruption", label: "Biofilm Disruption Technology", price: 52.00 },
    { value: "smart_drug_release", label: "Smart Drug Release System", price: 73.00 },
    { value: "trans_hormone_compatibility", label: "Trans Hormone Therapy Compatibility", price: 45.00 },
    { value: "intersex_anatomy_optimization", label: "Intersex Anatomy Optimization", price: 56.00 },
    { value: "two_spirit_ceremonial_integration", label: "Two Spirit Ceremonial Plant Integration", price: 67.00 },
    { value: "latinx_curanderismo_botanicals", label: "Latinx Curanderismo Healing Botanicals", price: 52.00 },
    { value: "quare_community_botanicals", label: "Quare Community-Sourced Botanicals", price: 48.00 },
    { value: "indigenous_tribal_plants", label: "Indigenous Tribal Healing Plants", price: 78.00 },
    { value: "afrocentric_healing_compounds", label: "Afrocentric Healing Compounds", price: 58.00 },
    { value: "asian_traditional_medicine", label: "Asian Traditional Medicine Integration", price: 62.00 },
    { value: "cultural_affirmation_frequencies", label: "Cultural Affirmation Frequencies", price: 43.00 },
    { value: "ancestral_blessing_protocols", label: "Ancestral Blessing Protocols", price: 71.00 }
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
                      
                      {/* Show detailed info for NanoHeal product */}
                      {selectedConfig.material === "nanotech_naturopathic_lubricant" && (
                        <div className="mt-4 space-y-3">
                          <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                            <h4 className="font-semibold text-blue-900 mb-2">🔬 NanoHeal™ Intersectional Technology</h4>
                            <div className="space-y-2 text-sm text-blue-800">
                              <div><strong>Universal STI Treatment:</strong> 90%+ efficacy against all major STIs</div>
                              <div><strong>Coverage:</strong> Viral, bacterial, parasitic, and fungal infections</div>
                              <div><strong>Delivery System:</strong> Smart nanoparticles with cultural intention programming</div>
                              <div><strong>Clinical Status:</strong> FDA breakthrough therapy for comprehensive STI treatment</div>
                            </div>
                          </div>
                          <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-400">
                            <h4 className="font-semibold text-purple-900 mb-2">🏳️‍⚧️ Identity Affirmation Features</h4>
                            <div className="space-y-1 text-sm text-purple-800">
                              <div><strong>Trans:</strong> Hormone therapy compatibility optimization</div>
                              <div><strong>Intersex:</strong> Multiple anatomy-specific pH profiles</div>
                              <div><strong>Two Spirit:</strong> Sacred sage and sweetgrass integration</div>
                              <div><strong>Latinx:</strong> Curanderismo healing botanicals</div>
                              <div><strong>Quare:</strong> Community-sourced plant preferences</div>
                              <div><strong>BIPOC:</strong> Ancestral healing traditions integration</div>
                            </div>
                          </div>
                          <div className="p-4 bg-red-50 rounded-lg border-l-4 border-red-400">
                            <h4 className="font-semibold text-red-900 mb-2">🦠 Universal STI Coverage</h4>
                            <div className="text-sm text-red-800 grid grid-cols-2 gap-2">
                              <div><strong>Viral:</strong> HSV-1/2 (97%), HPV (89%), HIV support (87%), HBV (94%)</div>
                              <div><strong>Bacterial:</strong> Chlamydia (95%), Gonorrhea (95%), Syphilis (93%)</div>
                              <div><strong>Parasitic:</strong> Trichomoniasis (91%), Lice (98%), Scabies (98%)</div>
                              <div><strong>Fungal:</strong> Candida (96%), Yeast infections (96%)</div>
                            </div>
                          </div>
                          <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
                            <h4 className="font-semibold text-green-900 mb-2">🌿 Intersectional Botanicals</h4>
                            <div className="text-sm text-green-800">
                              <div className="mb-2"><strong>Traditional Healing:</strong> White Sage • Hierba Buena • Romero • Ruda</div>
                              <div className="mb-2"><strong>Afrocentric Compounds:</strong> Shea Butter • Moringa • Black Seed Oil</div>
                              <div><strong>Asian Medicine:</strong> Ginseng • Reishi • Astragalus</div>
                            </div>
                          </div>
                        </div>
                      )}
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
