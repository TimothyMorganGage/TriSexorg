import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { BetaDisclaimer } from "@/components/BetaDisclaimer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ShoppingCart, 
  Package, 
  TrendingDown, 
  Users, 
  CheckCircle2, 
  Sparkles,
  Heart,
  Shield,
  Leaf,
  Zap,
  BookOpen,
  ArrowRight
} from "lucide-react";
import { Link } from "wouter";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface BulkPricingTier {
  minQuantity: number;
  maxQuantity: number | null;
  pricePerUnit: number;
  savingsPercent: number;
  label: string;
}

interface ProductPackage {
  id: string;
  name: string;
  category: string;
  basePrice: number;
  description: string;
  features: string[];
  icon: typeof Package;
  cooperative?: string;
  democraticOwnership?: boolean;
}

export default function Products() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedProduct, setSelectedProduct] = useState<string>("protection-basics");
  const [quantity, setQuantity] = useState<number>(500);

  const pricingTiers: BulkPricingTier[] = [
    { minQuantity: 1, maxQuantity: 49, pricePerUnit: 5.99, savingsPercent: 0, label: "Individual" },
    { minQuantity: 50, maxQuantity: 99, pricePerUnit: 3.49, savingsPercent: 42, label: "Small Bulk" },
    { minQuantity: 100, maxQuantity: 249, pricePerUnit: 1.99, savingsPercent: 67, label: "Community" },
    { minQuantity: 250, maxQuantity: 499, pricePerUnit: 1.29, savingsPercent: 78, label: "Clinic" },
    { minQuantity: 500, maxQuantity: null, pricePerUnit: 0.99, savingsPercent: 83, label: "Cooperative" },
  ];

  const productPackages: ProductPackage[] = [
    {
      id: "protection-basics",
      name: "Universal Protection Package",
      category: "Barrier Protection • 100% Vegan",
      basePrice: 5.99,
      description: "Complete barrier protection with custom sizing, 100% vegan plant-based materials, and enhanced features",
      icon: Shield,
      features: [
        "🌱 100% Vegan certified - No animal products",
        "60+ custom sizes (A0-H16) - Intersex anatomy baseline",
        "Plant-based recycled plastic + hydrogel composite",
        "Vegan long-lasting lubrication (plant oils)",
        "Plant-derived durability coating",
        "pH balancing formula (botanical extracts)",
        "Biodegradable rapid formula (plant fibers)",
        "Natural plant-based colorants",
        "Easy removal safety tab",
        "Body temperature responsive",
        "Essential oil scent options",
        "Plant-based antimicrobial coating (tea tree, neem)",
        "Ultra-thin wall construction",
        "Textured surface options",
        "All-gender inclusive design",
        "Compostable vegan packaging"
      ],
    },
    {
      id: "super-sides-barriers",
      name: "Super Sides 🥰 Oral Barriers",
      category: "MSM Oral Protection • 100% Vegan",
      basePrice: 5.99,
      description: "Democratically owned by MSM 'sides' cooperative - Premium vegan oral protection for men who have sex with men",
      icon: Heart,
      cooperative: "MSM Sides Cooperative",
      democraticOwnership: true,
      features: [
        "🌱 100% Vegan certified - Plant-based materials only",
        "Ultra-thin oral barrier material (0.02mm)",
        "Vegan flavored options (mint, vanilla, unflavored)",
        "Large coverage area (10\" x 10\")",
        "Enhanced grip edges for positioning",
        "Compatible with all vegan lubricants",
        "Latex-free hypoallergenic plant polymer",
        "Cooperative dividend program for members",
        "Democratic governance voting rights",
        "MSM community health data contribution",
        "Peer education materials included",
        "Discreet cooperative branding",
        "Fellatio-optimized thickness",
        "Rimming-safe plant-based antimicrobial coating",
        "Includes comprehensive MSM sexual health guide",
        "Support for side-focused sexual practices"
      ],
    },
    {
      id: "nanoheal-treatment",
      name: "NanoHeal ⚧️ STI Treatment System",
      category: "Advanced Healthcare • 100% Vegan",
      basePrice: 5.99,
      description: "Revolutionary 100% vegan intersectional naturopathic lubricant with plant-based STI treatment capabilities",
      icon: Sparkles,
      features: [
        "🌱 100% Vegan certified - Pure plant botanicals",
        "97% HSV-1/2 suppression efficacy",
        "95% Chlamydia/Gonorrhea containment",
        "89% HPV viral load reduction",
        "93% Syphilis healing acceleration",
        "91% Trichomoniasis elimination",
        "96% Candida/yeast infection resolution",
        "87% HIV viral load support (adjunct)",
        "Real-time pathogen detection sensors",
        "Smart drug release nanotechnology",
        "Trans hormone therapy compatibility",
        "Intersex anatomy pH optimization",
        "Two Spirit ceremonial plants (White Sage, Sweetgrass)",
        "Latinx curanderismo botanicals (Hierba Buena, Romero, Ruda)",
        "Afrocentric plant healing (Shea Butter, Moringa, Black Seed Oil)",
        "Asian plant medicine (Ginseng, Reishi, Astragalus)",
        "Plant-based propolis alternative (Pine resin compounds)",
        "Vegan aloe vera gel matrix",
        "Maple syrup antimicrobial (replaces honey)",
        "Cultural affirmation frequency programming",
        "Ancestral blessing protocols included",
        "FDA breakthrough therapy designation",
        "WHO universal STI prevention recognition",
        "72-hour sustained release formula",
        "Biofilm disruption technology",
        "Cellular healing acceleration",
        "Immune-boosting plant botanicals",
        "100% vegan biocompatible materials",
        "Creative Commons BY-SA 4.0 licensed"
      ],
    },
    {
      id: "sustainable-materials",
      name: "Premium Sustainable Materials",
      category: "Eco-Conscious Options • 100% Vegan",
      basePrice: 5.99,
      description: "Advanced 100% vegan eco-friendly material upgrades for environmental protection",
      icon: Leaf,
      features: [
        "🌱 100% Vegan certified - No animal testing or ingredients",
        "Ocean plastic recovery materials (95% recycled)",
        "Plant-based natural blend (soy, corn, sugarcane polymers)",
        "Medical-grade vegan silicone (petroleum-free)",
        "Hemp fiber composite construction",
        "Graphene-enhanced plant durability",
        "Plant-based antimicrobial treatment (neem, tea tree)",
        "Smart temperature-responsive plant materials",
        "Rapid biodegradable plant formula",
        "Carbon-neutral vegan manufacturing",
        "Compostable plant-based packaging",
        "Zero-waste supply chain",
        "Marine debris reduction contribution",
        "Circular economy participation",
        "Renewable energy production",
        "Fair trade vegan material sourcing"
      ],
    },
    {
      id: "smart-features",
      name: "Smart Health Technology",
      category: "Connected Healthcare • 100% Vegan Hardware",
      basePrice: 5.99,
      description: "Integration with health systems and smart monitoring features using vegan-friendly electronics",
      icon: Zap,
      features: [
        "🌱 100% Vegan hardware - No animal-derived components",
        "MyChart healthcare system connectivity",
        "Apple Health integration",
        "Google Calendar sync",
        "iCal/Outlook calendar support",
        "pureOS open-source compatibility",
        "iMessage notification support",
        "WhatsApp notification integration",
        "Smart break management system",
        "Cross-platform notification sync",
        "Sexual health tracking dashboard",
        "Partner network management",
        "4D STI exposure tracking",
        "DALY (Disability-Adjusted Life Years) metrics",
        "Mood and wellness correlation",
        "Wise Time Flucks creative commons time tracking",
        "Real-time usage analytics",
        "Automated reorder reminders",
        "Health data privacy encryption",
        "HIPAA-compliant data storage",
        "Federated data portability",
        "Plant-based sensor coatings"
      ],
    },
  ];

  const getCurrentTier = (qty: number): BulkPricingTier => {
    return pricingTiers.find(
      tier => qty >= tier.minQuantity && (tier.maxQuantity === null || qty <= tier.maxQuantity)
    ) || pricingTiers[0];
  };

  const currentTier = getCurrentTier(quantity);
  const totalPrice = (quantity * currentTier.pricePerUnit).toFixed(2);
  const savingsAmount = (quantity * (pricingTiers[0].pricePerUnit - currentTier.pricePerUnit)).toFixed(2);
  const selectedPackage = productPackages.find(p => p.id === selectedProduct);

  const handlePlaceOrder = () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to place a bulk order.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Order Initiated",
      description: `Bulk order for ${quantity} units at $${currentTier.pricePerUnit}/each has been added to your cart.`,
    });
  };

  return (
    <div className="min-h-screen bg-surface">
      <BetaDisclaimer />
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <Badge className="mb-4 text-lg px-6 py-2 bg-green-600 hover:bg-green-700">
              🌱 100% Vegan Certified
            </Badge>
            <h1 className="text-4xl lg:text-5xl font-bold text-neutral mb-4">
              Bulk Order Products & Services
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Cooperative pricing achieves <span className="font-bold text-primary">$0.99/unit</span> when ordering 500+ units. 
              All features included. 100% vegan plant-based materials. Volume discounts for community health.
            </p>
          </div>

          {/* Bulk Pricing Tiers Overview */}
          <Card className="mb-12 bg-gradient-to-br from-primary/5 to-purple-50 border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <TrendingDown className="h-6 w-6 text-primary" />
                Volume Discount Tiers
              </CardTitle>
              <CardDescription className="text-base">
                Larger orders unlock better pricing. Cooperative bulk orders reach our target of $0.99/unit.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {pricingTiers.map((tier, index) => (
                  <div
                    key={tier.label}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      quantity >= tier.minQuantity && (tier.maxQuantity === null || quantity <= tier.maxQuantity)
                        ? 'border-primary bg-white shadow-lg scale-105'
                        : 'border-gray-200 bg-white/50'
                    }`}
                    data-testid={`pricing-tier-${tier.label.toLowerCase()}`}
                  >
                    <div className="text-center">
                      <div className="font-semibold text-sm text-gray-600 mb-1">
                        {tier.label}
                      </div>
                      <div className="text-2xl font-bold text-primary mb-1">
                        ${tier.pricePerUnit}
                      </div>
                      <div className="text-xs text-gray-500 mb-2">
                        per unit
                      </div>
                      <div className="text-xs text-gray-600 mb-2">
                        {tier.minQuantity}{tier.maxQuantity ? `-${tier.maxQuantity}` : '+'} units
                      </div>
                      {tier.savingsPercent > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          Save {tier.savingsPercent}%
                        </Badge>
                      )}
                      {tier.pricePerUnit === 0.99 && (
                        <Badge className="mt-2 bg-green-600 text-white text-xs">
                          🎯 Target Price!
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Product Selection */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-neutral mb-6">
                Select Product Package
              </h2>

              <Tabs value={selectedProduct} onValueChange={setSelectedProduct}>
                <TabsList className="grid grid-cols-2 lg:grid-cols-5 mb-6 h-auto">
                  {productPackages.map((pkg) => {
                    const Icon = pkg.icon;
                    return (
                      <TabsTrigger
                        key={pkg.id}
                        value={pkg.id}
                        className="flex flex-col items-center gap-1 py-3 px-2 data-[state=active]:bg-primary data-[state=active]:text-white"
                        data-testid={`tab-${pkg.id}`}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="text-xs text-center leading-tight">
                          {pkg.name.split(' ').slice(0, 2).join(' ')}
                        </span>
                      </TabsTrigger>
                    );
                  })}
                </TabsList>

                {productPackages.map((pkg) => {
                  const Icon = pkg.icon;
                  return (
                    <TabsContent key={pkg.id} value={pkg.id}>
                      <Card>
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <div className="p-3 bg-primary/10 rounded-lg">
                                <Icon className="h-8 w-8 text-primary" />
                              </div>
                              <div>
                                <CardTitle className="text-xl mb-1">{pkg.name}</CardTitle>
                                <Badge variant="outline" className="text-xs">
                                  {pkg.category}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <CardDescription className="text-base mt-3">
                            {pkg.description}
                          </CardDescription>
                          {pkg.democraticOwnership && (
                            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                              <div className="flex items-center gap-2 text-sm font-semibold text-blue-900">
                                <Users className="h-4 w-4" />
                                {pkg.cooperative}
                              </div>
                              <p className="text-xs text-blue-700 mt-1">
                                Democratically owned • Member voting rights • Dividend sharing
                              </p>
                            </div>
                          )}
                        </CardHeader>
                        <CardContent>
                          <h3 className="font-semibold text-neutral mb-3 flex items-center gap-2">
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                            All Features Included
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {pkg.features.map((feature, idx) => (
                              <div
                                key={idx}
                                className="flex items-start gap-2 text-sm text-gray-700"
                                data-testid={`feature-${idx}`}
                              >
                                <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                                <span>{feature}</span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  );
                })}
              </Tabs>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Bulk Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Quantity Input */}
                  <div>
                    <Label htmlFor="quantity" className="text-sm font-medium mb-2 block">
                      Order Quantity
                    </Label>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="text-lg font-semibold"
                      data-testid="input-quantity"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Minimum: 1 unit • Cooperative pricing: 500+ units
                    </p>
                  </div>

                  <Separator />

                  {/* Current Tier Info */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Current Tier:</span>
                      <Badge variant="secondary" data-testid="text-current-tier">
                        {currentTier.label}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Price per Unit:</span>
                      <span className="text-lg font-bold text-primary" data-testid="text-price-per-unit">
                        ${currentTier.pricePerUnit}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Quantity:</span>
                      <span className="font-semibold" data-testid="text-quantity-display">
                        {quantity} units
                      </span>
                    </div>
                  </div>

                  <Separator />

                  {/* Pricing Breakdown */}
                  <div className="space-y-2">
                    {currentTier.savingsPercent > 0 && (
                      <>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-600">Subtotal (retail):</span>
                          <span className="line-through text-gray-400">
                            ${(quantity * pricingTiers[0].pricePerUnit).toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-green-600 font-medium">Bulk Savings ({currentTier.savingsPercent}%):</span>
                          <span className="text-green-600 font-semibold" data-testid="text-savings">
                            -${savingsAmount}
                          </span>
                        </div>
                      </>
                    )}
                    <div className="flex justify-between items-center pt-2 border-t-2">
                      <span className="text-lg font-semibold">Total:</span>
                      <span className="text-2xl font-bold text-primary" data-testid="text-total-price">
                        ${totalPrice}
                      </span>
                    </div>
                  </div>

                  {/* Call to Action */}
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={handlePlaceOrder}
                    disabled={!user}
                    data-testid="button-place-order"
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    {user ? "Add to Cart" : "Login to Order"}
                  </Button>

                  {!user && (
                    <p className="text-xs text-center text-gray-500">
                      Please <Link href="/auth"><a className="text-primary hover:underline">log in</a></Link> to place orders
                    </p>
                  )}

                  {/* Cooperative Benefits */}
                  {quantity >= 500 && (
                    <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="h-5 w-5 text-green-700" />
                        <span className="font-semibold text-green-900">Cooperative Benefits</span>
                      </div>
                      <ul className="text-xs text-green-800 space-y-1">
                        <li>✓ Target price achieved: $0.99/unit</li>
                        <li>✓ Community health impact</li>
                        <li>✓ Bulk shipping discounts</li>
                        <li>✓ Priority fulfillment</li>
                        <li>✓ Eligible for cooperative membership</li>
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Educational Resources */}
          <div className="mt-16 bg-gray-50 rounded-2xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Educational Resources
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Learn more about bulk ordering, cooperative ownership, and sexual health
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    Monogamy Economics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Compare annual costs: monogamy ($470-2,110) vs. non-monogamy ($5,700-33,700) with comprehensive analysis.
                  </p>
                  <Link href="/monogamy-economics">
                    <Button variant="outline" size="sm" className="w-full">
                      Read Analysis <ArrowRight className="ml-2 h-3 w-3" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    NanoHeal Wiki
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Revolutionary STI treatment technology with intersectional naturopathic healing approaches.
                  </p>
                  <Link href="/wiki">
                    <Button variant="outline" size="sm" className="w-full">
                      Explore Technology <ArrowRight className="ml-2 h-3 w-3" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Cooperative Ownership
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Learn about democratic ownership, member benefits, and how cooperatives lower costs for communities.
                  </p>
                  <Link href="/wiki">
                    <Button variant="outline" size="sm" className="w-full">
                      Learn More <ArrowRight className="ml-2 h-3 w-3" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
