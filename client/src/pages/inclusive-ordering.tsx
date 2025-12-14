import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

import { PrecisionSizing } from "@/components/MyONESizing";
import { 
  ShoppingCart, 
  Heart,
  Users,
  CheckCircle,
  Package,
  Truck,
  Settings,
  Info
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface BrandingPreference {
  id: string;
  name: string;
  description: string;
  logoVariant: boolean;
  packaging: string;
  messaging: string;
}

export default function InclusiveOrdering() {
  const [brandingPreference, setBrandingPreference] = useState("pride-inclusive");
  const [orderStep, setOrderStep] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

  const brandingOptions: BrandingPreference[] = [
    {
      id: "pride-inclusive",
      name: "Pride Inclusive (Default)",
      description: "Full Progress Pride flag integration supporting 2SLGBTIQA+ sexual creativity and reproductive justice",
      logoVariant: true,
      packaging: "Progress Pride packaging celebrating anatomical diversity",
      messaging: "Supporting sexual creativity and reproductive autonomy for all identities"
    },
    {
      id: "health-focused",
      name: "Health-Focused Neutral",
      description: "Medical and reproductive justice messaging without pride-specific visual elements",
      logoVariant: false,
      packaging: "Clean medical packaging with reproductive health messaging",
      messaging: "Advancing reproductive justice through precision sexual health"
    },
    {
      id: "minimalist",
      name: "Minimalist Design",
      description: "Simple, professional design honoring anatomical diversity for all customers",
      logoVariant: false,
      packaging: "Minimal design with inclusive sizing information",
      messaging: "Precision-fit protection supporting sexual creativity"
    }
  ];

  const products = [
    {
      id: "external-protection",
      name: "TriSex.org External Protection",
      description: "Custom-fit external protection with precision sizing for better love-making",
      priceRange: "$12-18 per unit",
      customization: "60+ size options, multiple materials"
    },
    {
      id: "internal-protection",
      name: "TriSex.org Internal Protection",
      description: "Innovative internal protection designed for all anatomies",
      priceRange: "$15-22 per unit",
      customization: "Anatomy-specific sizing, biocompatible materials"
    },
    {
      id: "dental-dams",
      name: "TriSex.org Dental Protection",
      description: "Premium dental dams for oral protection",
      priceRange: "$8-12 per unit",
      customization: "Multiple sizes, flavored and unflavored options"
    }
  ];

  const getCurrentBranding = () => {
    return brandingOptions.find(option => option.id === brandingPreference) || brandingOptions[0];
  };

  const renderOrderStep = () => {
    switch (orderStep) {
      case 1:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="mr-2 h-5 w-5" />
                Choose Your Experience
              </CardTitle>
              <p className="text-muted-foreground">
                Select how you'd like to experience TriSex.org's branding and messaging
              </p>
            </CardHeader>
            <CardContent>
              <RadioGroup value={brandingPreference} onValueChange={setBrandingPreference}>
                {brandingOptions.map((option) => (
                  <div key={option.id} className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value={option.id} id={option.id} />
                      <Label htmlFor={option.id} className="font-medium cursor-pointer">
                        {option.name}
                      </Label>
                    </div>
                    <div className="ml-6 space-y-2">
                      <p className="text-sm text-muted-foreground">
                        {option.description}
                      </p>
                      <div className="grid md:grid-cols-2 gap-4 text-xs">
                        <div>
                          <strong>Packaging:</strong> {option.packaging}
                        </div>
                        <div>
                          <strong>Messaging:</strong> {option.messaging}
                        </div>
                      </div>
                    </div>
                    <Separator className="my-4" />
                  </div>
                ))}
              </RadioGroup>

              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                      Your Privacy & Preferences
                    </h4>
                    <p className="text-sm text-blue-700 dark:text-blue-200">
                      Your branding preference is completely private and affects only your order experience. 
                      This choice doesn't impact product quality, pricing, or shipping. You can change this 
                      preference for future orders at any time.
                    </p>
                  </div>
                </div>
              </div>

              <Button 
                onClick={() => setOrderStep(2)} 
                className="w-full mt-6"
              >
                Continue to Products
              </Button>
            </CardContent>
          </Card>
        );

      case 2:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="mr-2 h-5 w-5" />
                Select Your Product
              </CardTitle>
              <div className="flex items-center space-x-2 mt-2">
                <Badge variant="outline">
                  {getCurrentBranding().name}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {products.map((product) => (
                  <div 
                    key={product.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedProduct === product.id 
                        ? "border-primary bg-primary/5" 
                        : "hover:border-primary/50"
                    }`}
                    onClick={() => setSelectedProduct(product.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{product.name}</h3>
                      <div className="text-sm font-medium text-primary">
                        {product.priceRange}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {product.description}
                    </p>
                    <div className="text-xs text-muted-foreground">
                      <strong>Customization:</strong> {product.customization}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex space-x-3 mt-6">
                <Button 
                  variant="outline" 
                  onClick={() => setOrderStep(1)}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button 
                  onClick={() => setOrderStep(3)} 
                  disabled={!selectedProduct}
                  className="flex-1"
                >
                  Continue to Sizing
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case 3:
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="mr-2 h-5 w-5" />
                  Custom Sizing & Configuration
                </CardTitle>
                <div className="flex items-center space-x-2 mt-2">
                  <Badge variant="outline">
                    {getCurrentBranding().name}
                  </Badge>
                  <Badge variant="secondary">
                    {products.find(p => p.id === selectedProduct)?.name}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <PrecisionSizing />
              </CardContent>
            </Card>

            <div className="flex space-x-3">
              <Button 
                variant="outline" 
                onClick={() => setOrderStep(2)}
                className="flex-1"
              >
                Back to Products
              </Button>
              <Button 
                onClick={() => setOrderStep(4)}
                className="flex-1"
              >
                Add to Cart
              </Button>
            </div>
          </div>
        );

      case 4:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ShoppingCart className="mr-2 h-5 w-5" />
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-center">
                  <div className="text-7xl transform hover:scale-110 transition-transform duration-300">
                    ⚧️
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b">
                    <span className="font-medium">Experience Preference:</span>
                    <Badge variant="outline">{getCurrentBranding().name}</Badge>
                  </div>
                  
                  <div className="flex justify-between items-center pb-3 border-b">
                    <span className="font-medium">Product:</span>
                    <span>{products.find(p => p.id === selectedProduct)?.name}</span>
                  </div>
                  
                  <div className="flex justify-between items-center pb-3 border-b">
                    <span className="font-medium">Packaging Style:</span>
                    <span className="text-sm">{getCurrentBranding().packaging}</span>
                  </div>
                  
                  <div className="flex justify-between items-center pb-3 border-b">
                    <span className="font-medium">Messaging:</span>
                    <span className="text-sm">{getCurrentBranding().messaging}</span>
                  </div>
                </div>

                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-green-900 dark:text-green-100">
                      Order Configured Successfully
                    </span>
                  </div>
                  <p className="text-sm text-green-700 dark:text-green-200">
                    Your order has been configured according to your preferences. 
                    All packaging and messaging will respect your chosen experience.
                  </p>
                </div>

                <div className="flex space-x-3">
                  <Button 
                    variant="outline" 
                    onClick={() => setOrderStep(3)}
                    className="flex-1"
                  >
                    Modify Order
                  </Button>
                  <Button className="flex-1">
                    <Truck className="mr-2 h-4 w-4" />
                    Proceed to Checkout
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Intersex Healthcare Affirmation */}
        <Alert className="mb-8 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200">
          <Heart className="h-5 w-5 text-purple-600" />
          <AlertDescription className="ml-2">
            <strong>Intersex Healthcare IS Everyone's Affirmation:</strong> Inclusive ordering centers intersex anatomy as the universal baseline—trans, non-binary, genderqueer, and quare embodiment are all respected within this participatory budgeting framework. There is no separate "transgender healthcare" category—all orders serve ALL bodies by design.
          </AlertDescription>
        </Alert>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="text-6xl transform hover:scale-110 transition-transform duration-300">
              ⚧️
            </div>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4 font-cinzel">
            Sexual Creativity & Reproductive Justice Ordering
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-coolvetica">
            Supporting anatomical diversity and reproductive autonomy through precision sizing. {getCurrentBranding().messaging}
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3, 4].map((step) => (
              <div 
                key={step}
                className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  step <= orderStep 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {step < orderStep ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <span className="text-sm font-medium">{step}</span>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Preferences</span>
            <span>Products</span>
            <span>Sizing</span>
            <span>Summary</span>
          </div>
        </div>

        {/* Main Content */}
        {renderOrderStep()}

        {/* Footer Notice */}
        <Card className="mt-12 bg-muted/30">
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
              <Heart className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h4 className="font-medium mb-1 font-cinzel">Sexual Creativity & Reproductive Justice</h4>
                <p className="text-sm text-muted-foreground font-coolvetica">
                  TriSex.org champions sexual creativity through precision sizing that honors anatomical diversity. 
                  Our reproductive justice approach ensures everyone can access products that support 
                  their bodily autonomy, sexual expression, and reproductive choices with dignity and respect.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}