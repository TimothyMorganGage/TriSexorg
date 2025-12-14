import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Heart,
  Droplets,
  Sparkles,
  Leaf,
  Award,
  Info,
  CheckCircle,
  Star
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Link } from "wouter";

export default function OralBarriers() {
  const [selectedSize, setSelectedSize] = useState("C5");
  const [selectedFlavor, setSelectedFlavor] = useState("mint_fresh");
  const [selectedMaterial, setSelectedMaterial] = useState("ultra_thin_premium");
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(["enhanced_lubrication"]);

  const sizeOptions = [
    { value: "A3", label: "A3", girth: "45-47mm", length: "3\"", description: "Compact fit" },
    { value: "A5", label: "A5", girth: "45-47mm", length: "5\"", description: "Compact, standard length" },
    { value: "B3", label: "B3", girth: "47-49mm", length: "3\"", description: "Snug, shorter" },
    { value: "B5", label: "B5", girth: "47-49mm", length: "5\"", description: "Snug fit" },
    { value: "C3", label: "C3", girth: "49-51mm", length: "3\"", description: "Standard, shorter" },
    { value: "C5", label: "C5", girth: "49-51mm", length: "5\"", description: "Standard fit (most popular)" },
    { value: "C7", label: "C7", girth: "49-51mm", length: "7\"", description: "Standard, longer" },
    { value: "D5", label: "D5", girth: "51-53mm", length: "5\"", description: "Comfortable fit" },
    { value: "D7", label: "D7", girth: "51-53mm", length: "7\"", description: "Comfortable, longer" },
    { value: "E5", label: "E5", girth: "53-55mm", length: "5\"", description: "Roomy fit" },
    { value: "E7", label: "E7", girth: "53-55mm", length: "7\"", description: "Roomy, longer" },
    { value: "F5", label: "F5", girth: "55-57mm", length: "5\"", description: "Extra roomy" },
    { value: "F7", label: "F7", girth: "55-57mm", length: "7\"", description: "Extra roomy, longer" },
    { value: "G7", label: "G7", girth: "57-60mm", length: "7\"", description: "Ultra roomy" },
    { value: "G9", label: "G9", girth: "57-60mm", length: "9\"", description: "Ultra roomy, extended" },
    { value: "H7", label: "H7", girth: "60mm+", length: "7\"", description: "Maximum fit" },
    { value: "H9", label: "H9", girth: "60mm+", length: "9\"", description: "Maximum, extended" },
  ];

  const flavorOptions = [
    { value: "unflavored", label: "Unflavored", description: "No added flavor, natural latex/polymer taste", price: 0 },
    { value: "mint_fresh", label: "Mint Fresh", description: "Cool peppermint for fresh sensation", price: 2.00 },
    { value: "strawberry_sweet", label: "Strawberry Sweet", description: "Natural strawberry essence", price: 2.00 },
    { value: "vanilla_cream", label: "Vanilla Cream", description: "Smooth vanilla with creamy undertones", price: 2.00 },
    { value: "chocolate_decadent", label: "Chocolate Decadent", description: "Rich cocoa flavor", price: 2.00 },
    { value: "citrus_burst", label: "Citrus Burst", description: "Tangy orange and lemon blend", price: 2.00 },
    { value: "banana_smooth", label: "Banana Smooth", description: "Sweet banana flavor", price: 2.00 },
    { value: "grape_fusion", label: "Grape Fusion", description: "Bold grape taste", price: 2.00 },
    { value: "watermelon_chill", label: "Watermelon Chill", description: "Refreshing watermelon with cooling effect", price: 2.00 },
    { value: "coconut_tropical", label: "Coconut Tropical", description: "Island coconut essence", price: 2.00 },
    { value: "mango_passion", label: "Mango Passion", description: "Exotic mango with passion fruit notes", price: 2.50 },
    { value: "champagne_luxury", label: "Champagne Luxury", description: "Sophisticated bubbly flavor", price: 3.50 },
  ];

  const materialOptions = [
    {
      value: "ultra_thin_premium",
      label: "Ultra-Thin Premium",
      description: "Maximum sensation with 0.03mm thickness",
      price: 24.99,
      features: ["Maximum sensitivity", "Heat transfer optimized", "Virtually undetectable"]
    },
    {
      value: "recycled_plastic_oral",
      label: "Recycled Plastic Oral Barrier",
      description: "Eco-friendly ocean plastic with enhanced oral lubrication",
      price: 19.99,
      features: ["95% recycled materials", "Waterway microplastic removal", "Sustainable choice"]
    },
    {
      value: "latex_free_hypoallergenic",
      label: "Latex-Free Hypoallergenic",
      description: "Polyisoprene for latex sensitivities",
      price: 27.99,
      features: ["No latex proteins", "Safe for allergies", "Soft feel"]
    },
    {
      value: "flavored_fusion",
      label: "Flavored Fusion",
      description: "Pre-infused flavor throughout material",
      price: 29.99,
      features: ["Long-lasting flavor", "No aftertaste", "Integrated throughout"]
    },
    {
      value: "smart_oral_sensors",
      label: "Smart Oral Sensors",
      description: "Temperature-responsive for optimal experience",
      price: 44.99,
      features: ["Heat-responsive", "Adjusts to body temp", "Enhanced comfort"]
    },
  ];

  const featureOptions = [
    { value: "enhanced_lubrication", label: "Enhanced Oral Lubrication", description: "Food-safe water-based lube, taste-neutral", price: 5.00 },
    { value: "flavored_lube", label: "Flavored Lubrication", description: "Matches your flavor choice", price: 7.00 },
    { value: "warming_sensation", label: "Warming Sensation", description: "Gentle warmth for enhanced pleasure", price: 8.00 },
    { value: "cooling_sensation", label: "Cooling Sensation", description: "Refreshing tingle effect", price: 8.00 },
    { value: "extra_smooth", label: "Extra Smooth Coating", description: "Silky finish for effortless glide", price: 6.00 },
    { value: "numbing_control", label: "Numbing Control (mild)", description: "Gentle desensitizer for gag reflex management", price: 12.00 },
    { value: "textured_external", label: "Textured External", description: "Ridges and bumps for giver's lips", price: 9.00 },
    { value: "glow_in_dark", label: "Glow in the Dark", description: "Fun luminescent design", price: 4.00 },
    { value: "antimicrobial_silver", label: "Silver Ion Protection", description: "Antimicrobial coating for added safety", price: 15.00 },
  ];

  const calculatePrice = () => {
    const selectedMaterialData = materialOptions.find(m => m.value === selectedMaterial);
    const basePrice = selectedMaterialData?.price || 24.99;
    
    const selectedFlavorData = flavorOptions.find(f => f.value === selectedFlavor);
    const flavorPrice = selectedFlavorData?.price || 0;
    
    const featuresPrice = selectedFeatures.reduce((total, feature) => {
      const featureData = featureOptions.find(f => f.value === feature);
      return total + (featureData?.price || 0);
    }, 0);
    
    return basePrice + flavorPrice + featuresPrice;
  };

  const toggleFeature = (featureValue: string) => {
    setSelectedFeatures(prev =>
      prev.includes(featureValue)
        ? prev.filter(f => f !== featureValue)
        : [...prev, featureValue]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:to-purple-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Intersex Healthcare Affirmation */}
        <Alert className="mb-8 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/40 border-purple-200">
          <Heart className="h-5 w-5 text-purple-600" />
          <AlertDescription className="ml-2">
            <strong>Intersex Healthcare IS Everyone's Affirmation:</strong> Oral barrier sizing centers intersex anatomy as the universal baseline—trans, non-binary, genderqueer, and quare embodiment are all respected within this participatory budgeting framework. There is no separate "transgender healthcare" category—MSM products serve ALL bodies by design.
          </AlertDescription>
        </Alert>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="text-6xl">👄</div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Oral Pleasure Barriers for MSM
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-4">
            Premium oral sex barriers designed specifically for men who have sex with men who exclusively practice fellatio. 
            Intersex-centered sizing, flavored options, and enhanced lubrication for maximum pleasure and protection.
          </p>
          <div className="bg-gradient-to-r from-pink-100 to-purple-100 dark:from-pink-950 dark:to-purple-950 rounded-lg p-4 max-w-2xl mx-auto mb-6">
            <p className="text-lg font-semibold text-pink-700 dark:text-pink-300">
              🥰 Cooperatively Owned by Super Sides
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              This product line is democratically owned and operated by the <strong>Super Sides 🥰</strong> cooperative—
              MSM community members who identify as oral-focused "sides" (non-penetrative sex practitioners). 
              Every purchase supports cooperative ownership and community health infrastructure.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <Badge variant="secondary" className="bg-pink-100 text-pink-800 px-4 py-2">
              <Heart className="w-4 h-4 mr-2" />
              Oral-Only Protection
            </Badge>
            <Badge variant="secondary" className="bg-purple-100 text-purple-800 px-4 py-2">
              <Sparkles className="w-4 h-4 mr-2" />
              60+ Size Options
            </Badge>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 px-4 py-2">
              <CheckCircle className="w-4 h-4 mr-2" />
              STI Prevention
            </Badge>
            <Badge variant="secondary" className="bg-green-100 text-green-800 px-4 py-2">
              <Leaf className="w-4 h-4 mr-2" />
              Eco-Friendly Options
            </Badge>
          </div>
        </div>

        {/* Why Oral Barriers for MSM */}
        <Card className="mb-8 border-2 border-pink-200">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl">
              <Info className="h-6 w-6 mr-2 text-pink-600" />
              Why Oral Barriers Matter for MSM
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-lg mb-2 flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                  STI Protection
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Prevents transmission of gonorrhea, chlamydia, syphilis through oral sex</li>
                  <li>• Reduces HIV transmission risk (though lower than anal contact)</li>
                  <li>• Protects against herpes (HSV-1 and HSV-2) oral-genital transmission</li>
                  <li>• Prevents HPV transmission (reduces throat/oral cancer risk)</li>
                  <li>• Blocks hepatitis A transmission from fecal-oral contact</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2 flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-purple-600" />
                  Enhanced Pleasure
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Ultra-thin materials maintain sensation and intimacy</li>
                  <li>• Flavored options make oral sex more enjoyable for the giver</li>
                  <li>• Lubrication enhances glide and reduces friction</li>
                  <li>• Removes anxiety about cleanliness, enabling relaxation</li>
                  <li>• Warming/cooling sensations add novel stimulation</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2 flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-blue-600" />
                  Intersex & Trans Inclusive
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• 60+ sizes accommodate all genital configurations</li>
                  <li>• No assumptions about anatomy based on gender identity</li>
                  <li>• Post-surgical anatomy fully supported</li>
                  <li>• Hormone therapy compatible (doesn't interfere with HRT)</li>
                  <li>• Naturally intersex anatomies centered in design</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2 flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-orange-600" />
                  Monogamy Support
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Enables safe oral sex during STI testing windows</li>
                  <li>• Protection while transitioning to fluid-bonded status</li>
                  <li>• Peace of mind for both partners</li>
                  <li>• Supports trust-building through demonstrated care</li>
                  <li>• Facilitates open communication about boundaries</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Product Configurator */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Configuration Panel */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Customize Your Oral Barrier</CardTitle>
                <CardDescription>
                  Design your perfect oral protection with intersex-centered sizing and flavor options
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="sizing" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="sizing">Sizing</TabsTrigger>
                    <TabsTrigger value="flavor">Flavor</TabsTrigger>
                    <TabsTrigger value="material">Material</TabsTrigger>
                    <TabsTrigger value="features">Features</TabsTrigger>
                  </TabsList>

                  {/* Sizing Tab */}
                  <TabsContent value="sizing" className="space-y-4">
                    <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg mb-4">
                      <h3 className="font-semibold mb-2 flex items-center">
                        <Info className="h-5 w-5 mr-2 text-blue-600" />
                        Intersex-Centered Sizing System
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Our sizing uses <strong>letter (girth)</strong> + <strong>number (length)</strong> format with no gender assumptions. 
                        All measurements accommodate intersex, trans, and naturally occurring anatomical diversity.
                      </p>
                    </div>

                    <RadioGroup value={selectedSize} onValueChange={setSelectedSize}>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {sizeOptions.map((size) => (
                          <div key={size.value} className="relative">
                            <RadioGroupItem
                              value={size.value}
                              id={size.value}
                              className="peer sr-only"
                            />
                            <Label
                              htmlFor={size.value}
                              className="flex flex-col p-3 border-2 rounded-lg cursor-pointer peer-data-[state=checked]:border-pink-600 peer-data-[state=checked]:bg-pink-50 dark:peer-data-[state=checked]:bg-pink-950 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                            >
                              <span className="font-bold text-lg">{size.label}</span>
                              <span className="text-xs text-muted-foreground">{size.girth}</span>
                              <span className="text-xs text-muted-foreground">{size.length} length</span>
                              <span className="text-xs mt-1">{size.description}</span>
                              {size.value === "C5" && (
                                <Badge variant="secondary" className="mt-2 text-xs">
                                  <Star className="h-3 w-3 mr-1" />
                                  Most Popular
                                </Badge>
                              )}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>

                    <div className="mt-4 p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        <strong>Need help finding your size?</strong> Visit our{" "}
                        <Link href="/anatomy-scanning" className="text-purple-600 hover:underline">
                          3D Scanning
                        </Link>{" "}
                        service for precise measurements, or check our{" "}
                        <Link href="/wiki" className="text-purple-600 hover:underline">
                          Wiki sizing guide
                        </Link>
                        .
                      </p>
                    </div>
                  </TabsContent>

                  {/* Flavor Tab */}
                  <TabsContent value="flavor" className="space-y-4">
                    <div className="bg-pink-50 dark:bg-pink-950 p-4 rounded-lg mb-4">
                      <h3 className="font-semibold mb-2 flex items-center">
                        <Sparkles className="h-5 w-5 mr-2 text-pink-600" />
                        Flavor Enhancements
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        All flavors are food-safe, sugar-free, and designed to enhance oral pleasure for the giver 
                        while maintaining full STI protection.
                      </p>
                    </div>

                    <RadioGroup value={selectedFlavor} onValueChange={setSelectedFlavor}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {flavorOptions.map((flavor) => (
                          <div key={flavor.value} className="relative">
                            <RadioGroupItem
                              value={flavor.value}
                              id={flavor.value}
                              className="peer sr-only"
                            />
                            <Label
                              htmlFor={flavor.value}
                              className="flex justify-between items-start p-3 border-2 rounded-lg cursor-pointer peer-data-[state=checked]:border-pink-600 peer-data-[state=checked]:bg-pink-50 dark:peer-data-[state=checked]:bg-pink-950 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                            >
                              <div className="flex-1">
                                <span className="font-semibold block">{flavor.label}</span>
                                <span className="text-xs text-muted-foreground block mt-1">
                                  {flavor.description}
                                </span>
                              </div>
                              <span className="text-sm font-bold text-pink-600 ml-2">
                                {flavor.price === 0 ? "Included" : `+$${flavor.price.toFixed(2)}`}
                              </span>
                            </Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                  </TabsContent>

                  {/* Material Tab */}
                  <TabsContent value="material" className="space-y-4">
                    <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg mb-4">
                      <h3 className="font-semibold mb-2 flex items-center">
                        <Leaf className="h-5 w-5 mr-2 text-green-600" />
                        Sustainable & Body-Safe Materials
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        All materials are rigorously tested for oral safety, hypoallergenic properties, and environmental impact. 
                        Choose recycled options to support waterway microplastic removal.
                      </p>
                    </div>

                    <RadioGroup value={selectedMaterial} onValueChange={setSelectedMaterial}>
                      <div className="space-y-3">
                        {materialOptions.map((material) => (
                          <div key={material.value} className="relative">
                            <RadioGroupItem
                              value={material.value}
                              id={material.value}
                              className="peer sr-only"
                            />
                            <Label
                              htmlFor={material.value}
                              className="flex justify-between items-start p-4 border-2 rounded-lg cursor-pointer peer-data-[state=checked]:border-green-600 peer-data-[state=checked]:bg-green-50 dark:peer-data-[state=checked]:bg-green-950 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                            >
                              <div className="flex-1">
                                <span className="font-semibold block text-lg">{material.label}</span>
                                <span className="text-sm text-muted-foreground block mt-1">
                                  {material.description}
                                </span>
                                <div className="flex flex-wrap gap-2 mt-2">
                                  {material.features.map((feature, idx) => (
                                    <Badge key={idx} variant="outline" className="text-xs">
                                      {feature}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              <span className="text-lg font-bold text-green-600 ml-4">
                                ${material.price.toFixed(2)}
                              </span>
                            </Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                  </TabsContent>

                  {/* Features Tab */}
                  <TabsContent value="features" className="space-y-4">
                    <div className="bg-purple-50 dark:bg-purple-950 p-4 rounded-lg mb-4">
                      <h3 className="font-semibold mb-2 flex items-center">
                        <Award className="h-5 w-5 mr-2 text-purple-600" />
                        Optional Enhancements
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Add specialized features to customize your oral barrier experience. Select multiple options.
                      </p>
                    </div>

                    <div className="space-y-3">
                      {featureOptions.map((feature) => (
                        <div
                          key={feature.value}
                          className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                          <Checkbox
                            id={feature.value}
                            checked={selectedFeatures.includes(feature.value)}
                            onCheckedChange={() => toggleFeature(feature.value)}
                            data-testid={`checkbox-${feature.value}`}
                          />
                          <div className="flex-1">
                            <Label htmlFor={feature.value} className="cursor-pointer">
                              <span className="font-semibold block">{feature.label}</span>
                              <span className="text-sm text-muted-foreground block mt-1">
                                {feature.description}
                              </span>
                            </Label>
                          </div>
                          <span className="text-sm font-bold text-purple-600">
                            +${feature.price.toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Your Oral Barrier</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Size:</span>
                    <span className="font-semibold">{selectedSize}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Flavor:</span>
                    <span className="font-semibold">
                      {flavorOptions.find(f => f.value === selectedFlavor)?.label}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Material:</span>
                    <span className="font-semibold">
                      {materialOptions.find(m => m.value === selectedMaterial)?.label}
                    </span>
                  </div>
                  {selectedFeatures.length > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Features:</span>
                      <span className="font-semibold">{selectedFeatures.length}</span>
                    </div>
                  )}
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-semibold">Total Price:</span>
                    <span className="text-2xl font-bold text-pink-600">
                      ${calculatePrice().toFixed(2)}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <Button
                      className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
                      size="lg"
                      data-testid="button-add-to-cart"
                    >
                      <CheckCircle className="mr-2 h-5 w-5" />
                      Add to Cart
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full"
                      asChild
                      data-testid="button-save-config"
                    >
                      <Link href="/login">
                        Save Configuration
                      </Link>
                    </Button>
                  </div>

                  <div className="mt-4 p-3 bg-pink-50 dark:bg-pink-950 rounded-lg">
                    <p className="text-xs text-pink-800 dark:text-pink-200 mb-2">
                      <strong>🥰 Super Sides Co-op Benefits:</strong><br />
                      You're supporting cooperative ownership by MSM who prioritize oral pleasure
                    </p>
                    <p className="text-xs text-green-800 dark:text-green-200">
                      <strong>🌍 Sustainability Impact:</strong><br />
                      Each purchase removes 100g of microplastics from waterways
                    </p>
                  </div>
                </div>

                <div className="border-t pt-4 space-y-2">
                  <h3 className="font-semibold text-sm mb-2">Package Includes:</h3>
                  <ul className="text-xs space-y-1 text-muted-foreground">
                    <li>✓ 12 barriers per box</li>
                    <li>✓ Discreet packaging</li>
                    <li>✓ Usage guide by Super Sides 🥰</li>
                    <li>✓ STI prevention tips</li>
                    <li>✓ Recyclable container</li>
                    <li>✓ Co-op membership info</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Super Sides Co-op Info */}
        <Card className="mt-8 border-2 border-pink-200 bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-950 dark:to-purple-950">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Heart className="h-6 w-6 mr-2 text-pink-600" />
              About the Super Sides 🥰 Cooperative
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              The <strong>Super Sides 🥰</strong> are a democratically-owned cooperative of MSM community members who 
              identify as "sides"—individuals who prioritize oral, manual, and other non-penetrative forms of sexual 
              expression. We created this product line to serve our specific needs and celebrate oral pleasure as a 
              complete, valid sexual practice.
            </p>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">Our Values</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Oral sex as primary, not secondary, pleasure</li>
                  <li>• Destigmatizing "side" identity in MSM communities</li>
                  <li>• Cooperative ownership and democratic governance</li>
                  <li>• Intersex and trans-inclusive product design</li>
                  <li>• Flavored barriers without shame or apology</li>
                  <li>• STI prevention as community care practice</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Co-op Membership Benefits</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Product development voting rights</li>
                  <li>• Dividend distributions from sales</li>
                  <li>• Discounted pricing on all barriers</li>
                  <li>• Free sexual health education workshops</li>
                  <li>• Community peer support network</li>
                  <li>• Representation in TriSex.org governance</li>
                </ul>
              </div>
            </div>

            <div className="bg-pink-100 dark:bg-pink-900 p-4 rounded-lg mt-4">
              <h3 className="font-semibold mb-2">Join the Super Sides 🥰 Co-op</h3>
              <p className="text-sm text-muted-foreground mb-3">
                We welcome all MSM who practice or want to explore oral-focused sexuality. Membership is free for 
                anyone committed to monogamous relationships and cooperative values.
              </p>
              <Button className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700">
                <Heart className="mr-2 h-4 w-4" />
                Join Super Sides Co-op
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Educational Footer */}
        <Card className="mt-8 border-2 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Droplets className="h-6 w-6 mr-2 text-blue-600" />
              Oral Sex Safety Education for MSM
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-2">
              Educational content curated by Super Sides 🥰 health education committee
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">STI Transmission via Oral Sex</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  While oral sex carries lower HIV transmission risk than anal sex, other STIs transmit readily:
                </p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• <strong>Gonorrhea & Chlamydia:</strong> Throat infections (pharyngeal) are common</li>
                  <li>• <strong>Syphilis:</strong> Oral sores can transmit to genitals and vice versa</li>
                  <li>• <strong>Herpes:</strong> HSV-1 (oral) and HSV-2 (genital) cross-transmit</li>
                  <li>• <strong>HPV:</strong> Causes throat/oral cancer; vaccine recommended</li>
                  <li>• <strong>Hepatitis A:</strong> Fecal-oral transmission if rimming occurs</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Best Practices for Oral Barrier Use</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Apply barrier before any genital contact begins</li>
                  <li>• Ensure adequate lubrication (use food-safe, water-based)</li>
                  <li>• Check for tears or damage before/during use</li>
                  <li>• Never reuse or flip barrier during session</li>
                  <li>• Dispose properly after use (wrap in tissue, trash)</li>
                  <li>• Wash hands thoroughly after removal</li>
                  <li>• Get regular oral/throat STI screening (swab test)</li>
                  <li>• Communicate with partners about testing status</li>
                </ul>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg mt-4">
              <h3 className="font-semibold mb-2">Monogamy & Oral Barriers</h3>
              <p className="text-sm text-muted-foreground">
                Even in monogamous relationships, oral barriers are recommended during the initial testing window (3 months) 
                and whenever there's any potential exposure. Once both partners test negative for all STIs, many couples 
                transition to barrier-free oral sex as part of fluid-bonding. Continue open communication about any changes 
                in risk status.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Related Resources */}
        <div className="mt-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Explore More</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="outline" asChild>
              <Link href="/products">
                All Protection Products
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/wiki">
                Sexual Health Wiki
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/4d-sti-intervention">
                4D STI Tracking
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/anatomy-scanning">
                3D Anatomy Scanning
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
