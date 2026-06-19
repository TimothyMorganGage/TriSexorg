import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Hand,
  Droplets,
  Leaf,
  Award,
  Info,
  CheckCircle,
  Star,
  Shield,
  AlertTriangle,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Link } from "wouter";

type BarrierType = "glove" | "finger_cot";

export default function HandBarriers() {
  const [barrierType, setBarrierType] = useState<BarrierType>("glove");
  const [selectedGloveSize, setSelectedGloveSize] = useState("M");
  const [selectedCotSize, setSelectedCotSize] = useState("CM");
  const [selectedMaterial, setSelectedMaterial] = useState("nitrile_standard");
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(["pre_lubricated"]);

  // Glove sizing follows standard hand-circumference sizing (measured around the
  // palm at the knuckles, excluding the thumb). No gender assumptions.
  const gloveSizeOptions = [
    { value: "XS", label: "XS", measure: "≤ 16 cm palm", description: "Extra small hands" },
    { value: "S", label: "S", measure: "16–18 cm palm", description: "Small hands" },
    { value: "M", label: "M", measure: "18–20 cm palm", description: "Medium (most common)" },
    { value: "L", label: "L", measure: "20–23 cm palm", description: "Large hands" },
    { value: "XL", label: "XL", measure: "23–25 cm palm", description: "Extra large hands" },
    { value: "XXL", label: "XXL", measure: "25 cm+ palm", description: "Maximum fit" },
  ];

  // Finger cots cover a single digit for fingering / single-digit penetration.
  const cotSizeOptions = [
    { value: "CS", label: "CS", measure: "≤ 1.6 cm digit", description: "Slim finger" },
    { value: "CM", label: "CM", measure: "1.6–1.9 cm digit", description: "Standard finger (most common)" },
    { value: "CL", label: "CL", measure: "1.9–2.2 cm digit", description: "Broad finger" },
    { value: "CXL", label: "CXL", measure: "2.2 cm+ digit", description: "Thumb / extra-broad" },
  ];

  const materialOptions = [
    {
      value: "nitrile_standard",
      label: "Nitrile (Latex-Free)",
      description: "Strong, puncture-resistant, latex-allergy safe. The default for manual play and fisting.",
      price: 12.99,
      features: ["No latex proteins", "High puncture resistance", "Compatible with silicone & water lube"],
    },
    {
      value: "polyisoprene_soft",
      label: "Polyisoprene (Latex-Free, Soft)",
      description: "Soft, stretchy synthetic with a skin-like feel for delicate manual stimulation.",
      price: 15.99,
      features: ["No latex proteins", "Soft tactile feel", "Good sensitivity"],
    },
    {
      value: "latex_classic",
      label: "Natural Latex",
      description: "Classic stretchy latex barrier. Not for latex allergies; use water-based lube only.",
      price: 9.99,
      features: ["High elasticity", "Snug second-skin fit", "Water-based lube only"],
    },
    {
      value: "recycled_nitrile",
      label: "Recycled-Content Nitrile",
      description: "Eco option blending reclaimed nitrile feedstock for a lower-footprint barrier.",
      price: 13.99,
      features: ["Lower-footprint sourcing", "Latex-free", "Powder-free"],
    },
  ];

  const featureOptions = [
    { value: "pre_lubricated", label: "Pre-Lubricated Interior", description: "Easier to put on; reduces friction on the wearer's skin", price: 3.0 },
    { value: "extended_cuff", label: "Extended / Gauntlet Cuff", description: "Longer cuff covering the wrist and forearm — for fisting and deeper manual play", price: 6.0 },
    { value: "extra_thick", label: "Extra-Thick (Fisting Grade)", description: "Reinforced thickness for durability during fisting", price: 5.0 },
    { value: "textured_fingertips", label: "Textured Fingertips", description: "Subtle ridges on the fingertips for added stimulation", price: 4.0 },
    { value: "powder_free", label: "Powder-Free", description: "No cornstarch powder — gentler on internal tissue (recommended)", price: 0.0 },
    { value: "antimicrobial_silver", label: "Silver Ion Coating", description: "Antimicrobial finish for added hygiene", price: 9.0 },
    { value: "smooth_seamless", label: "Smooth Seamless Finish", description: "No seams or rough edges against delicate tissue", price: 3.0 },
    { value: "color_pack", label: "Colour Pack", description: "Assorted colours to keep hands/partners/orifices visually distinct", price: 2.0 },
  ];

  const activeSizeOptions = barrierType === "glove" ? gloveSizeOptions : cotSizeOptions;
  const activeSize = barrierType === "glove" ? selectedGloveSize : selectedCotSize;
  const setActiveSize = barrierType === "glove" ? setSelectedGloveSize : setSelectedCotSize;
  const popularSize = barrierType === "glove" ? "M" : "CM";

  const calculatePrice = () => {
    const selectedMaterialData = materialOptions.find((m) => m.value === selectedMaterial);
    const basePrice = selectedMaterialData?.price || 12.99;
    // Finger cots use less material than full gloves.
    const typeFactor = barrierType === "finger_cot" ? 0.5 : 1;
    const featuresPrice = selectedFeatures.reduce((total, feature) => {
      const featureData = featureOptions.find((f) => f.value === feature);
      return total + (featureData?.price || 0);
    }, 0);
    return basePrice * typeFactor + featuresPrice;
  };

  const toggleFeature = (featureValue: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(featureValue) ? prev.filter((f) => f !== featureValue) : [...prev, featureValue],
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 dark:from-gray-900 dark:to-teal-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Operational honesty banner */}
        <Alert className="mb-6 bg-amber-50 dark:bg-amber-950/40 border-amber-300">
          <AlertTriangle className="h-5 w-5 text-amber-600" />
          <AlertDescription className="ml-2 text-amber-900 dark:text-amber-200">
            <strong>Operational status — design specs, not shipments.</strong> No manufacturing
            partner has signed on for hand barriers yet, so every configuration here is captured as
            an open-source (CC BY-SA 4.0) design specification rather than a stocked product. Prices
            are illustrative target costs, not live checkout amounts. See{" "}
            <Link href="/manufacturing" className="underline font-semibold">
              Manufacturing
            </Link>{" "}
            for how sourcing works.
          </AlertDescription>
        </Alert>

        {/* Intersex Healthcare Affirmation */}
        <Alert className="mb-8 bg-gradient-to-r from-teal-100 to-cyan-100 dark:from-teal-900/40 dark:to-cyan-900/40 border-teal-200">
          <Hand className="h-5 w-5 text-black dark:text-white" />
          <AlertDescription className="ml-2 text-black dark:text-white">
            <strong>Intersex Healthcare IS Everyone's Affirmation:</strong> Hand and finger barriers
            protect every body during manual sex. Sizing centres the hand and the digit, never
            gender — trans, non-binary, genderqueer, intersex, and quare embodiment are all
            respected by design.
          </AlertDescription>
        </Alert>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="text-6xl">🧤</div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent mb-4">
            Hand & Finger Barriers for Manual Sex
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-4">
            Gloves and finger cots for fingering, hand jobs, mutual masturbation, and fisting. A
            hand barrier protects delicate internal tissue from nails, cuts, and hangnails — and
            both partners from STI transmission through the skin of the hands.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Badge variant="secondary" className="bg-teal-100 text-teal-800 px-4 py-2">
              <Hand className="w-4 h-4 mr-2" />
              Fingering & Fisting
            </Badge>
            <Badge variant="secondary" className="bg-cyan-100 text-cyan-800 px-4 py-2">
              <Shield className="w-4 h-4 mr-2" />
              Latex-Free Options
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

        {/* Why Hand Barriers Matter */}
        <Card className="mb-8 border-2 border-teal-200">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl">
              <Info className="h-6 w-6 mr-2 text-teal-600" />
              Why Hand & Finger Barriers Matter
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
                  <li>• Reduces transmission of herpes (HSV) and HPV through skin-to-mucosa contact</li>
                  <li>• Lowers risk of passing gonorrhea, chlamydia, and syphilis via fingers</li>
                  <li>• Protects when there are cuts, hangnails, or eczema on the hands</li>
                  <li>• Limits hepatitis transmission during manual-anal play</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2 flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-cyan-600" />
                  Physical Safety
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Shields internal tissue from fingernail scratches and micro-tears</li>
                  <li>• Makes long nails, acrylics, or rough skin safer for a partner</li>
                  <li>• A smooth barrier glides better, reducing friction injury</li>
                  <li>• Extended-cuff gloves add durability and reach for fisting</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2 flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-blue-600" />
                  Hygiene & Cross-Contamination
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Change barriers between partners to avoid sharing fluids</li>
                  <li>• Change between orifices (e.g. anal → vaginal) to prevent infections</li>
                  <li>• Easy, mess-free cleanup — remove and dispose</li>
                  <li>• Keeps lube and bacteria off rings and jewellery</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2 flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-teal-600" />
                  Inclusive by Design
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Sizing centres the hand and digit, with no gender assumptions</li>
                  <li>• Works for every anatomy a hand might touch</li>
                  <li>• Latex-free choices for allergies and sensitivities</li>
                  <li>• Supports safe play during STI testing windows</li>
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
                <CardTitle className="text-2xl">Customise Your Hand Barrier</CardTitle>
                <CardDescription>
                  Choose a glove or finger cot, your size, material, and optional features.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="sizing" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="sizing">Type & Sizing</TabsTrigger>
                    <TabsTrigger value="material">Material</TabsTrigger>
                    <TabsTrigger value="features">Features</TabsTrigger>
                  </TabsList>

                  {/* Type & Sizing Tab */}
                  <TabsContent value="sizing" className="space-y-4">
                    <div className="bg-teal-50 dark:bg-teal-950 p-4 rounded-lg mb-4">
                      <h3 className="font-semibold mb-2 flex items-center">
                        <Hand className="h-5 w-5 mr-2 text-teal-600" />
                        Barrier Type
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        A <strong>glove</strong> covers the whole hand (fingering, hand jobs, mutual
                        masturbation, fisting). A <strong>finger cot</strong> covers a single digit
                        for lighter, single-finger play.
                      </p>
                      <RadioGroup
                        value={barrierType}
                        onValueChange={(v) => setBarrierType(v as BarrierType)}
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {[
                            { value: "glove", label: "Glove", hint: "Whole hand · fisting-capable" },
                            { value: "finger_cot", label: "Finger Cot", hint: "Single digit" },
                          ].map((opt) => (
                            <div key={opt.value} className="relative">
                              <RadioGroupItem value={opt.value} id={`type-${opt.value}`} className="peer sr-only" />
                              <Label
                                htmlFor={`type-${opt.value}`}
                                className="flex flex-col p-3 border-2 rounded-lg cursor-pointer peer-data-[state=checked]:border-teal-600 peer-data-[state=checked]:bg-teal-50 dark:peer-data-[state=checked]:bg-teal-950 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                data-testid={`radio-type-${opt.value}`}
                              >
                                <span className="font-bold text-lg">{opt.label}</span>
                                <span className="text-xs text-muted-foreground">{opt.hint}</span>
                              </Label>
                            </div>
                          ))}
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg mb-4">
                      <h3 className="font-semibold mb-2 flex items-center">
                        <Info className="h-5 w-5 mr-2 text-blue-600" />
                        {barrierType === "glove" ? "Glove Sizing (hand circumference)" : "Finger Cot Sizing (digit width)"}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {barrierType === "glove"
                          ? "Measure around your palm at the knuckles (not including the thumb)."
                          : "Measure the width of the finger you'll use at its widest point."}
                      </p>
                    </div>

                    <RadioGroup value={activeSize} onValueChange={setActiveSize}>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {activeSizeOptions.map((size) => (
                          <div key={size.value} className="relative">
                            <RadioGroupItem value={size.value} id={size.value} className="peer sr-only" />
                            <Label
                              htmlFor={size.value}
                              className="flex flex-col p-3 border-2 rounded-lg cursor-pointer peer-data-[state=checked]:border-teal-600 peer-data-[state=checked]:bg-teal-50 dark:peer-data-[state=checked]:bg-teal-950 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                              data-testid={`radio-size-${size.value}`}
                            >
                              <span className="font-bold text-lg">{size.label}</span>
                              <span className="text-xs text-muted-foreground">{size.measure}</span>
                              <span className="text-xs mt-1">{size.description}</span>
                              {size.value === popularSize && (
                                <Badge variant="secondary" className="mt-2 text-xs">
                                  <Star className="h-3 w-3 mr-1" />
                                  Most Common
                                </Badge>
                              )}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>

                    <div className="mt-4 p-4 bg-cyan-50 dark:bg-cyan-950 rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        <strong>Not sure of your size?</strong> A glove that's too tight tears; too
                        loose snags. When between sizes, size up for fisting and down for fine
                        fingering. See the{" "}
                        <Link href="/wiki" className="text-cyan-600 hover:underline">
                          Wiki sizing guide
                        </Link>
                        .
                      </p>
                    </div>
                  </TabsContent>

                  {/* Material Tab */}
                  <TabsContent value="material" className="space-y-4">
                    <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg mb-4">
                      <h3 className="font-semibold mb-2 flex items-center">
                        <Leaf className="h-5 w-5 mr-2 text-green-600" />
                        Body-Safe Materials
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Pick latex-free (nitrile or polyisoprene) if you or a partner has a latex
                        allergy. Latex pairs only with water-based lube; nitrile and polyisoprene are
                        fine with silicone lube too.
                      </p>
                    </div>

                    <RadioGroup value={selectedMaterial} onValueChange={setSelectedMaterial}>
                      <div className="space-y-3">
                        {materialOptions.map((material) => (
                          <div key={material.value} className="relative">
                            <RadioGroupItem value={material.value} id={material.value} className="peer sr-only" />
                            <Label
                              htmlFor={material.value}
                              className="flex justify-between items-start p-4 border-2 rounded-lg cursor-pointer peer-data-[state=checked]:border-green-600 peer-data-[state=checked]:bg-green-50 dark:peer-data-[state=checked]:bg-green-950 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                              data-testid={`radio-material-${material.value}`}
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
                        Add features to tailor your barrier. Select as many as you like.
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
                            {feature.price === 0 ? "Included" : `+$${feature.price.toFixed(2)}`}
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
                <CardTitle>Your Hand Barrier</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Type:</span>
                    <span className="font-semibold">
                      {barrierType === "glove" ? "Glove" : "Finger Cot"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Size:</span>
                    <span className="font-semibold">{activeSize}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Material:</span>
                    <span className="font-semibold">
                      {materialOptions.find((m) => m.value === selectedMaterial)?.label}
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
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-lg font-semibold">Target Price:</span>
                    <span className="text-2xl font-bold text-teal-600">
                      ${calculatePrice().toFixed(2)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-4">
                    Illustrative target cost per box — not a live checkout amount (see status banner above).
                  </p>

                  <div className="space-y-2">
                    <Button
                      className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700"
                      size="lg"
                      asChild
                      data-testid="button-capture-spec"
                    >
                      <Link href="/inclusive-ordering">
                        <CheckCircle className="mr-2 h-5 w-5" />
                        Capture as Design Spec
                      </Link>
                    </Button>

                    <Button variant="outline" className="w-full" asChild data-testid="button-save-config">
                      <Link href="/login">Save Configuration</Link>
                    </Button>
                  </div>

                  <div className="mt-4 p-3 bg-teal-50 dark:bg-teal-950 rounded-lg">
                    <p className="text-xs text-teal-800 dark:text-teal-200">
                      <strong>🤝 Open by design:</strong> Your configuration is recorded as a CC
                      BY-SA 4.0 specification anyone can manufacture — no lock-in.
                    </p>
                  </div>
                </div>

                <div className="border-t pt-4 space-y-2">
                  <h3 className="font-semibold text-sm mb-2">A box would include:</h3>
                  <ul className="text-xs space-y-1 text-muted-foreground">
                    <li>✓ Multiple barriers per box</li>
                    <li>✓ Discreet packaging</li>
                    <li>✓ Manual-sex safety guide</li>
                    <li>✓ Lube-compatibility chart</li>
                    <li>✓ Recyclable container</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Best Practices */}
        <Card className="mt-8 border-2 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Droplets className="h-6 w-6 mr-2 text-blue-600" />
              Best Practices for Manual Sex
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Before You Start</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Trim and file nails; consider cotton liners under gloves for long nails</li>
                  <li>• Remove rings and sharp jewellery</li>
                  <li>• Choose latex-free if anyone has a latex allergy</li>
                  <li>• Have plenty of compatible lube ready (water-based always works)</li>
                  <li>• Check the barrier for tears before use</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">During & After</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Use generous lube — more for anal play and fisting</li>
                  <li>• Change barriers between partners</li>
                  <li>• Change between orifices (anal → vaginal/front-hole) to avoid infection</li>
                  <li>• Never reuse a barrier; dispose after the session</li>
                  <li>• Wash hands after removal; go slow and check in often</li>
                </ul>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg mt-4">
              <h3 className="font-semibold mb-2">Lube Compatibility</h3>
              <p className="text-sm text-muted-foreground">
                <strong>Latex</strong> and <strong>polyisoprene</strong>: use water-based or
                silicone lube — never oil-based, which degrades them. <strong>Nitrile</strong> is the
                most chemical-resistant and works with water- and silicone-based lube. When in doubt,
                water-based lube is safe with every material here.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Related Resources */}
        <div className="mt-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Explore More</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="outline" asChild>
              <Link href="/products">All Protection Products</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/oral-barriers">Oral Barriers</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/wiki">Sexual Health Wiki</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/partner-sti-tracking">4D STI Tracking</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
