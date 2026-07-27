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
  Leaf,
  Zap,
  BookOpen,
  ArrowRight,
  Sprout,
  Flower2,
  Shapes,
  Ruler,
  Scale,
  ShieldCheck
} from "lucide-react";
import { Link } from "wouter";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  INTERSEX_VARIATIONS,
  INTERSEX_CATEGORIES,
  FITTING_PARAMS,
  getApplicableParams,
  getAssignmentMarkers,
  type AssignmentMarker,
} from "@/data/intersex-variations";

const ZONE_LABELS: Record<string, string> = {
  oral: "Oral",
  anal: "Anal",
  vaginal: "Vaginal",
  frontal: "Frontal",
  neovaginal: "Neovaginal",
};

const MARKER_STYLES: Record<AssignmentMarker, string> = {
  AMAB: "bg-sky-100 text-sky-700 border-sky-300 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-500/40",
  AFAB: "bg-pink-100 text-pink-700 border-pink-300 dark:bg-pink-950/40 dark:text-pink-300 dark:border-pink-500/40",
  AXAB: "bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-500/40",
};

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
  const [catalogueSearch, setCatalogueSearch] = useState<string>("");
  const [catalogueMarker, setCatalogueMarker] = useState<"ALL" | AssignmentMarker>("ALL");
  const [legalSexNow, setLegalSexNow] = useState<string | null>(null);
  const [birthMarker, setBirthMarker] = useState<"AMAB" | "AFAB" | "AXAB" | "not-sure" | null>(null);
  const [genderIdentity, setGenderIdentity] = useState<string | null>(null);
  const [genderSelfDescribe, setGenderSelfDescribe] = useState("");
  const [isIntersex, setIsIntersex] = useState<boolean | null>(null);

  const browseByBirthMarker = (marker: "AMAB" | "AFAB" | "AXAB" | "ALL") => {
    setCatalogueMarker(marker);
    document
      .getElementById("full-catalogue")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const [isVegan, setIsVegan] = useState<boolean>(true);

  const pricingTiers: BulkPricingTier[] = [
    { minQuantity: 1, maxQuantity: 49, pricePerUnit: 5.99, savingsPercent: 0, label: "Individual" },
    { minQuantity: 50, maxQuantity: 99, pricePerUnit: 3.49, savingsPercent: 42, label: "Small Bulk" },
    { minQuantity: 100, maxQuantity: 249, pricePerUnit: 1.99, savingsPercent: 67, label: "Community" },
    { minQuantity: 250, maxQuantity: 499, pricePerUnit: 1.29, savingsPercent: 78, label: "Clinic" },
    { minQuantity: 500, maxQuantity: null, pricePerUnit: 0.99, savingsPercent: 83, label: "Cooperative" },
  ];

  const getProductPackages = (): ProductPackage[] => [
    {
      id: "protection-basics",
      name: "Universal Protection Package",
      category: isVegan ? "Barrier Protection • 100% Vegan" : "Barrier Protection • Upcycled Traditional",
      basePrice: 5.99,
      description: isVegan 
        ? "Complete barrier protection with custom sizing, 100% vegan plant-based materials, and enhanced features"
        : "Complete barrier protection with custom sizing, upcycled animal-derived materials from farm/fishery/pharmacy waste streams + plant botanicals",
      icon: Package,
      features: isVegan ? [
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
      ] : [
        "♻️ Upcycled from farm/fishery/pharmacy waste - Zero new animal products",
        "60+ custom sizes (A0-H16) - Intersex anatomy baseline",
        "Recycled plastic + lanolin (upcycled wool processing waste)",
        "Beeswax-enhanced lubrication (apiary byproduct)",
        "Beeswax & plant durability coating (sustainable beekeeping waste)",
        "pH balancing (botanical extracts + propolis from hive waste)",
        "Biodegradable (plant fibers + chitosan from shellfish processing waste)",
        "Natural colorants (cochineal waste, plant extracts)",
        "Easy removal safety tab",
        "Body temperature responsive",
        "Honey (excess apiary production) & essential oil scents",
        "Propolis antimicrobial (beekeeping byproduct)",
        "Ultra-thin wall construction",
        "Textured surface options",
        "All-gender inclusive design",
        "Compostable beeswax packaging (apiary waste)"
      ],
    },
    {
      id: "super-sides-barriers",
      name: "Super Sides 🥰 Oral Barriers",
      category: isVegan ? "MSM Oral Protection • 100% Vegan" : "MSM Oral Protection • Upcycled Traditional",
      basePrice: 5.99,
      description: isVegan 
        ? "Democratically owned by MSM 'sides' cooperative - Premium vegan oral protection for men who have sex with men"
        : "Democratically owned by MSM 'sides' cooperative - Premium oral protection using upcycled farm/apiary waste materials for men who have sex with men",
      icon: Heart,
      cooperative: "MSM Sides Cooperative",
      democraticOwnership: true,
      features: isVegan ? [
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
      ] : [
        "♻️ Upcycled apiary waste - Zero new animal production",
        "Ultra-thin oral barrier material (0.02mm)",
        "Natural flavors (excess honey, mint, vanilla, unflavored)",
        "Large coverage area (10\" x 10\")",
        "Enhanced grip edges for positioning",
        "Compatible with all natural lubricants",
        "Latex-free hypoallergenic polymer with beeswax (apiary byproduct)",
        "Cooperative dividend program for members",
        "Democratic governance voting rights",
        "MSM community health data contribution",
        "Peer education materials included",
        "Discreet cooperative branding",
        "Fellatio-optimized thickness",
        "Rimming-safe propolis coating (beekeeping waste)",
        "Includes comprehensive MSM sexual health guide",
        "Support for side-focused sexual practices"
      ],
    },
    {
      id: "nanoheal-treatment",
      name: "NanoHeal ⚧️ STI Treatment System",
      category: isVegan ? "Advanced Healthcare • 100% Vegan" : "Advanced Healthcare • Upcycled Traditional",
      basePrice: 5.99,
      description: isVegan
        ? "Revolutionary 100% vegan intersectional naturopathic lubricant with plant-based STI treatment capabilities"
        : "Revolutionary intersectional naturopathic lubricant combining upcycled apiary/pharmacy waste (honey, propolis, royal jelly) with plant botanicals for STI treatment",
      icon: Sparkles,
      features: isVegan ? [
        "⚠️ EXPERIMENTAL — no clinical trial has been conducted; not FDA-approved; not a treatment",
        "Earlier copy claimed fabricated efficacy rates (97% HSV, 95% Chlamydia/Gonorrhea, 89% HPV, 93% Syphilis, 91% Trichomoniasis, 96% Candida, 87% HIV) — all removed",
        "Earlier copy falsely claimed 'FDA breakthrough therapy designation' and 'WHO universal STI prevention recognition' — neither exists; removed",
        "🌱 100% Vegan formulation — pure plant botanicals",
        "Trans hormone therapy compatibility — informal report only, not pharmacologically tested",
        "Intersex anatomy pH-conscious formulation",
        "Two Spirit ceremonial plants (White Sage, Sweetgrass)",
        "Latinx curanderismo botanicals (Hierba Buena, Romero, Ruda)",
        "Afrocentric plant healing (Shea Butter, Moringa, Black Seed Oil)",
        "Asian plant medicine (Ginseng, Reishi, Astragalus)",
        "Plant-based propolis alternative (Pine resin compounds)",
        "Vegan aloe vera gel matrix",
        "Maple syrup antimicrobial (replaces honey)",
        "Creative Commons BY-SA 4.0 licensed formulation"
      ] : [
        "⚠️ EXPERIMENTAL — no clinical trial has been conducted; not FDA-approved; not a treatment",
        "Earlier copy claimed fabricated efficacy rates (97% HSV, 95% Chlamydia/Gonorrhea, 89% HPV, 93% Syphilis, 91% Trichomoniasis, 96% Candida, 87% HIV) — all removed",
        "Earlier copy falsely claimed 'FDA breakthrough therapy designation' and 'WHO universal STI prevention recognition' — neither exists; removed",
        "♻️ Upcycled apiary/pharmacy waste — no new animal production",
        "Trans hormone therapy compatibility — informal report only, not pharmacologically tested",
        "Intersex anatomy pH-conscious formulation",
        "Two Spirit ceremonial plants (White Sage, Sweetgrass)",
        "Latinx curanderismo botanicals (Hierba Buena, Romero, Ruda)",
        "Afrocentric healing (Shea, Moringa, Black Seed Oil, upcycled royal jelly)",
        "Asian medicine (Ginseng, Reishi, Astragalus, apiary waste bee pollen)",
        "Raw Manuka honey (excess apiary production, antimicrobial)",
        "Propolis nanoparticles (beekeeping waste, traditionally antiviral)",
        "Royal jelly (apiary surplus)",
        "Aloe vera + excess honey gel matrix",
        "Beeswax sustained-release carriers (apiary byproduct)",
        "Creative Commons BY-SA 4.0 licensed formulation"
      ],
    },
    {
      id: "sustainable-materials",
      name: "Premium Sustainable Materials",
      category: isVegan ? "Eco-Conscious Options • 100% Vegan" : "Eco-Conscious Options • Upcycled Traditional",
      basePrice: 5.99,
      description: isVegan
        ? "Advanced 100% vegan eco-friendly material upgrades for environmental protection"
        : "Advanced upcycled materials from textile/farm/fishery/apiary waste streams (silk, lanolin, chitosan, beeswax) with plant-based ingredients",
      icon: Leaf,
      features: isVegan ? [
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
      ] : [
        "♻️ Upcycled waste - Textile/farm/fishery/apiary byproducts",
        "Ocean plastic recovery materials (95% recycled)",
        "Natural blend (plant polymers + lanolin from wool processing waste)",
        "Medical-grade silicone with beeswax coating (apiary byproduct)",
        "Hemp fiber + silk protein (textile processing waste)",
        "Graphene-enhanced with chitosan (shellfish processing waste)",
        "Propolis (beekeeping waste) + plant antimicrobial",
        "Smart temperature-responsive upcycled materials",
        "Biodegradable (plant + chitosan from fishery waste)",
        "Carbon-neutral upcycling manufacturing",
        "Compostable beeswax-coated packaging (apiary surplus)",
        "Zero-waste circular supply chain",
        "Marine debris + fishery waste reduction",
        "Circular economy waste upcycling",
        "Renewable energy production",
        "Fair trade upcycled material sourcing"
      ],
    },
    {
      id: "smart-features",
      name: "Smart Health Technology",
      category: isVegan ? "Connected Healthcare • 100% Vegan Hardware" : "Connected Healthcare • Upcycled Materials",
      basePrice: 5.99,
      description: isVegan
        ? "Integration with health systems and smart monitoring features using vegan-friendly electronics"
        : "Integration with health systems and smart monitoring features with sensor coatings from upcycled apiary/pharmaceutical waste",
      icon: Zap,
      features: isVegan ? [
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
        "Wise Time TriSexs creative commons time tracking",
        "Real-time usage analytics",
        "Automated reorder reminders",
        "Health data privacy encryption",
        "HIPAA-compliant data storage",
        "Federated data portability",
        "Plant-based sensor coatings"
      ] : [
        "♻️ Upcycled protective coatings - Apiary/pharmaceutical waste",
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
        "Wise Time TriSexs creative commons time tracking",
        "Real-time usage analytics",
        "Automated reorder reminders",
        "Health data privacy encryption",
        "HIPAA-compliant data storage",
        "Federated data portability",
        "Beeswax sensor coating (apiary surplus waste)"
      ],
    },
  ];

  const productPackages = getProductPackages();

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
          {/* Intersex Healthcare Affirmation */}
          <Alert className="mb-8 bg-white dark:bg-gray-950 border-2 border-black dark:border-white">
            <Heart className="h-5 w-5 text-black dark:text-white" />
            <AlertDescription className="ml-2 text-black dark:text-white">
              <strong>Intersex Healthcare IS Everyone's Affirmation:</strong> All products use intersex anatomy as the sizing baseline—trans, non-binary, genderqueer, and quare embodiment are all respected within this participatory budgeting framework. There is no separate "transgender healthcare" category—TriSex Perfect Protection serves ALL bodies by design.
            </AlertDescription>
          </Alert>

          {/* Intersex Bodily Autonomy — advocacy position */}
          <Card className="mb-8 border-2 border-primary/30 bg-gradient-to-br from-amber-50 via-white to-primary/5 dark:from-amber-950/20 dark:via-gray-950 dark:to-primary/10" data-testid="card-bodily-autonomy">
            <CardHeader>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <Badge className="bg-primary/15 text-primary border border-primary/30 text-xs">
                  <Scale className="w-3 h-3 mr-1" /> Advocacy position — not yet law
                </Badge>
              </div>
              <CardTitle className="text-2xl lg:text-3xl flex items-center gap-2">
                <ShieldCheck className="w-7 h-7 text-primary shrink-0" />
                Intersex Bodily Autonomy
              </CardTitle>
              <CardDescription className="text-base mt-2 max-w-3xl">
                TriSex.org calls for a <strong>federal right to bodily autonomy for intersex people</strong>:
                the right to grow up with your body intact and to decide for yourself about any
                medically unnecessary, irreversible surgery meant only to force an intersex body into a
                binary sex model.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert className="bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-500/40">
                <AlertDescription className="text-sm text-amber-900 dark:text-amber-200">
                  <strong>To be honest about the law:</strong> no U.S. federal statute establishes this
                  right yet — this is the change we advocate for. It rests on the principles of informed
                  consent and bodily integrity, and on the human-rights positions of the UN, the WHO,
                  Physicians for Human Rights, Human Rights Watch, and interACT, which all call for
                  deferring these procedures until the person is old enough to consent for themselves.
                  Malta banned them in 2015; several U.S. children's hospitals have pledged to stop or
                  delay. It is a patchwork, not a settled federal right — yet.
                </AlertDescription>
              </Alert>
              <div className="grid sm:grid-cols-3 gap-3">
                {[
                  {
                    title: "Consent first",
                    body: "No irreversible, medically unnecessary surgery on an intersex child who cannot yet consent.",
                  },
                  {
                    title: "Body intact",
                    body: "The right to grow up whole and choose any surgery — or none — for yourself.",
                  },
                  {
                    title: "Self-determination",
                    body: "Your sex characteristics are yours to define, never something to be corrected into a binary.",
                  },
                ].map((item) => (
                  <div key={item.title} className="rounded-lg border bg-white/70 dark:bg-gray-950/40 p-3">
                    <div className="flex items-center gap-1.5 font-semibold text-sm mb-1">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                      {item.title}
                    </div>
                    <p className="text-xs text-muted-foreground leading-snug">{item.body}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-lg border-2 border-primary/30 bg-primary/5 dark:bg-primary/10 p-4">
                <div className="flex items-center gap-2 font-semibold mb-1">
                  <Heart className="w-5 h-5 text-primary shrink-0" />
                  Trans people who live as binary are entitled to order anything they want
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Living binary — as a woman, as a man, however she/he/they live — never limits your
                  access to a single product in this catalogue. There is no gatekeeping, no proof of
                  anatomy, no eligibility test, and no separate "binary" or "non-binary" SKU line. Every
                  product is sized from the intersex-anatomy baseline and is yours to order, configure,
                  and fit exactly how you want it — for you and your partner(s).
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Offerings for AMAB / AFAB / AXAB Intersex People */}
          <Card className="mb-12 border-2 border-primary/30 bg-gradient-to-br from-primary/5 via-white to-amber-50 dark:from-primary/10 dark:via-gray-950 dark:to-amber-950/20" data-testid="card-marker-offerings">
            <CardHeader>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <Badge className="bg-primary/15 text-primary border border-primary/30 text-xs">
                  <Shapes className="w-3 h-3 mr-1" /> 86 named intersex variations · 8 categories
                </Badge>
                <Badge variant="outline" className="text-xs">Per-variation custom orders</Badge>
              </div>
              <CardTitle className="text-2xl lg:text-3xl">
                Offerings for AMAB, AFAB & AXAB Intersex People
              </CardTitle>
              <CardDescription className="text-base mt-2 max-w-3xl">
                Intersex bodies are assigned a sex marker at birth — but that marker rarely matches
                the body's actual anatomy. Every package below is sized from the same 86-variation
                catalogue, so the same Universal Protection, Super Sides Oral Barriers, NanoHeal
                lubricant, sustainable materials, and smart-health products serve all three
                assignment pathways without fragmenting the catalogue into a separate "men's,"
                "women's," or "intersex" SKU line.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                {[
                  {
                    marker: "AMAB",
                    expansion: "Assigned Male At Birth",
                    accent: "border-sky-300 dark:border-sky-500/40 bg-sky-50/60 dark:bg-sky-950/20",
                    accentText: "text-sky-700 dark:text-sky-300",
                    pathways: "Often 46,XY DSD pathways: PAIS, MAIS, 5α-reductase, hypospadias spectrum, micropenis, chordee, diphallia, penoscrotal transposition, Klinefelter (47,XXY).",
                    fits: [
                      "Inverted Sleeve sized to your shaft length & girth (30–200 mm)",
                      "Urethral position select for distal / mid-shaft / proximal / perineal hypospadias",
                      "Anchor pattern (standard / wide / asymmetric / strap) for penoscrotal & bifid scrotum",
                      "Dual-sleeve option (1 or 2) for diphallia",
                      "Shorter-default sleeves for micropenis & post-orchiectomy bodies",
                    ],
                    count: "≈ 24 catalogue variations commonly assigned M",
                  },
                  {
                    marker: "AFAB",
                    expansion: "Assigned Female At Birth",
                    accent: "border-pink-300 dark:border-pink-500/40 bg-pink-50/60 dark:bg-pink-950/20",
                    accentText: "text-pink-700 dark:text-pink-300",
                    pathways: "Often 46,XX DSD pathways: classic & non-classic CAH, MRKH, Müllerian agenesis, longitudinal/transverse vaginal septa, uterine didelphys, clitoromegaly, ovotesticular DSD, Turner (45,X).",
                    fits: [
                      "Cup-Pouch sized to canal depth (30–180 mm) for shortened, blind-ending or constructed canals",
                      "Canal-girth slider (80–150 mm) for variable receptive fits",
                      "Frontal sliders for clitoromegaly & virilized phenotypes",
                      "Shallower-depth defaults for MRKH, cervico-vaginal agenesis, CAIS, Swyer, Turner",
                      "Wing-Extended Dam for oral-frontal & oral-vulva acts",
                    ],
                    count: "≈ 28 catalogue variations commonly assigned F",
                  },
                  {
                    marker: "AXAB",
                    expansion: "Assigned X / Intersex At Birth",
                    accent: "border-amber-300 dark:border-amber-500/40 bg-amber-50/60 dark:bg-amber-950/20",
                    accentText: "text-amber-700 dark:text-amber-300",
                    pathways: "Legally recordable in some jurisdictions (Germany, Australia, Aotearoa NZ, Iceland, Argentina, India third-gender, parts of Canada). Often ovotesticular DSD, mixed gonadal dysgenesis, 46,XX/46,XY chimerism, ambiguous external genitalia.",
                    fits: [
                      "No presumed default zone — both Inverted Sleeve and Cup-Pouch are first-class options",
                      "Multi-fold balance (versatile / receptive / penetrative) selectable per session",
                      "Open zone selection across oral / anal / vaginal / frontal / neovaginal",
                      "Variation-specific sliders for asymmetric external anatomy",
                      "Amber consult flag offered for any variation where measurement matters",
                    ],
                    count: "≈ 34 catalogue variations where M/F assignment is itself contested",
                  },
                ].map((card) => (
                  <div
                    key={card.marker}
                    className={`p-5 rounded-lg border-2 ${card.accent} flex flex-col h-full`}
                    data-testid={`marker-card-${card.marker.toLowerCase()}`}
                  >
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className={`text-3xl font-black ${card.accentText}`}>{card.marker}</span>
                      <span className="text-gray-500 text-xs font-mono">{card.expansion}</span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-xs italic mb-3 leading-relaxed">
                      {card.pathways}
                    </p>
                    <ul className="space-y-1.5 mb-3 flex-1">
                      {card.fits.map((fit) => (
                        <li key={fit} className="flex items-start gap-2 text-xs text-gray-700 dark:text-gray-300 leading-snug">
                          <CheckCircle2 className={`h-3.5 w-3.5 ${card.accentText} mt-0.5 flex-shrink-0`} />
                          <span>{fit}</span>
                        </li>
                      ))}
                    </ul>
                    <Badge variant="outline" className="text-[10px] self-start">
                      {card.count}
                    </Badge>
                  </div>
                ))}
              </div>

              <div className="grid sm:grid-cols-3 gap-3 mb-6">
                <Link href="/inclusive-ordering">
                  <Button className="w-full" data-testid="cta-marker-configure">
                    <Shapes className="mr-2 h-4 w-4" />
                    Open the configurator
                  </Button>
                </Link>
                <Link href="/anatomy-scanning">
                  <Button variant="outline" className="w-full" data-testid="cta-marker-scan">
                    <Ruler className="mr-2 h-4 w-4" />
                    Body-measurement scan
                  </Button>
                </Link>
                <Link href="/infinitely-affirmative-protection">
                  <Button variant="ghost" className="w-full" data-testid="cta-marker-affirmative">
                    <Heart className="mr-2 h-4 w-4" />
                    Affirmative protection
                  </Button>
                </Link>
              </div>

              <Alert className="border-2 border-dashed border-amber-500/60 bg-amber-50 dark:bg-amber-950/20">
                <AlertDescription className="text-amber-900 dark:text-amber-200 text-xs leading-relaxed space-y-1.5">
                  <div className="font-semibold">Honesty notes — sex-marker offerings</div>
                  <p>
                    <strong>AMAB / AFAB / AXAB are recorded sex-marker assignments, not anatomy
                    descriptors.</strong> Many intersex people are assigned M or F at birth despite
                    intersex bodies, often without their own informed consent and sometimes
                    accompanied by surgical "normalization" the person did not request. AXAB / "X"
                    is legally available in only some jurisdictions.
                  </p>
                  <p>
                    The category counts above are TriSex.org's own grouping of how the 86 variations
                    in our co-operator-assembled catalogue most commonly map to assignment pathways.
                    They are not clinical statistics, not population estimates, and not a registry.
                    Your variation may sit in more than one card or none of them.
                  </p>
                  <p>
                    Every fitting note in the configurator is a design hypothesis. TriSex.org has
                    not manufactured custom-fit units for every named variation, has not measured
                    barrier integrity across these specific anatomies, and is not claiming an
                    off-the-shelf fit. Variation selection is self-reported, not stored or shared
                    outside the order summary, and not used for any registry, research, or
                    insurance purpose.
                  </p>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Legal sex + gender identity helper for people with gender-affirming care */}
          <Card className="mb-12 border-2 border-violet-300 dark:border-violet-500/40 bg-gradient-to-br from-violet-50/60 via-white to-pink-50/50 dark:from-violet-950/20 dark:via-gray-950 dark:to-pink-950/10" data-testid="card-affirming-care-helper">
            <CardHeader>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <Badge className="bg-violet-100 text-violet-700 border border-violet-300 dark:bg-violet-950/40 dark:text-violet-300 dark:border-violet-500/40 text-xs">
                  <Heart className="w-3 h-3 mr-1" /> Gender-affirming care welcome here
                </Badge>
                <Badge variant="outline" className="text-xs">Optional · nothing stored</Badge>
              </div>
              <CardTitle className="text-2xl lg:text-3xl">
                Your legal sex, your birth marker & your gender — three different things
              </CardTitle>
              <CardDescription className="text-base mt-2 max-w-3xl">
                If you've had (or are having) gender-affirming care, your <strong>current legal
                sex</strong>, the <strong>marker recorded at birth</strong>, and your{" "}
                <strong>gender identity</strong> may all be different — and being intersex can sit
                alongside any chosen gender. Answer as much or as little as you like; only the
                birth marker changes what you see below, because product fit follows your body,
                never your paperwork.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-3 gap-5">
                <div className="space-y-2">
                  <Label className="font-semibold">1 · Current legal sex</Label>
                  <p className="text-xs text-muted-foreground">
                    The marker on your documents today — affirming care often includes updating it.
                  </p>
                  <div className="flex flex-wrap gap-1.5" role="group" aria-label="Current legal sex">
                    {["F", "M", "X / non-binary marker", "Mixed documents", "Prefer not to say"].map((opt) => (
                      <Button
                        key={opt}
                        type="button"
                        size="sm"
                        variant={legalSexNow === opt ? "default" : "outline"}
                        aria-pressed={legalSexNow === opt}
                        onClick={() => setLegalSexNow(legalSexNow === opt ? null : opt)}
                        data-testid={`legal-sex-${opt.toLowerCase().replace(/[^a-z]+/g, "-")}`}
                      >
                        {opt}
                      </Button>
                    ))}
                  </div>
                  {legalSexNow && (
                    <p className="text-xs text-violet-700 dark:text-violet-300">
                      Noted — no product in this catalogue is gated by legal sex.
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="font-semibold">2 · Marker recorded at birth</Label>
                  <p className="text-xs text-muted-foreground">
                    This is the only answer that filters the catalogue, because the variation cards
                    are grouped by birth-assignment pathway. Picking AMAB or AFAB never hides
                    AXAB-tagged variations — states without an X marker recorded intersex people as
                    M or F regardless of their bodies.
                  </p>
                  <div className="flex flex-wrap gap-1.5" role="group" aria-label="Marker recorded at birth">
                    {([
                      { value: "AFAB", label: "AFAB" },
                      { value: "AMAB", label: "AMAB" },
                      { value: "AXAB", label: "AXAB / X" },
                      { value: "not-sure", label: "Not sure / it's complicated" },
                    ] as const).map((opt) => (
                      <Button
                        key={opt.value}
                        type="button"
                        size="sm"
                        variant={birthMarker === opt.value ? "default" : "outline"}
                        aria-pressed={birthMarker === opt.value}
                        onClick={() => {
                          const next = birthMarker === opt.value ? null : opt.value;
                          setBirthMarker(next);
                          setCatalogueMarker(
                            next && next !== "not-sure" ? next : "ALL",
                          );
                        }}
                        data-testid={`birth-marker-${opt.value.toLowerCase()}`}
                      >
                        {opt.label}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="font-semibold">3 · Gender identity (chosen, always yours)</Label>
                  <p className="text-xs text-muted-foreground">
                    Intersex is a body, not a gender — you can be intersex <em>and</em> any of these.
                  </p>
                  <div className="flex flex-wrap gap-1.5" role="group" aria-label="Gender identity">
                    {["Woman", "Man", "Non-binary", "Genderqueer", "Agender", "Two-Spirit", "Self-describe"].map((opt) => (
                      <Button
                        key={opt}
                        type="button"
                        size="sm"
                        variant={genderIdentity === opt ? "default" : "outline"}
                        aria-pressed={genderIdentity === opt}
                        onClick={() => setGenderIdentity(genderIdentity === opt ? null : opt)}
                        data-testid={`gender-identity-${opt.toLowerCase().replace(/[^a-z]+/g, "-")}`}
                      >
                        {opt}
                      </Button>
                    ))}
                  </div>
                  {genderIdentity === "Self-describe" && (
                    <Input
                      value={genderSelfDescribe}
                      onChange={(e) => setGenderSelfDescribe(e.target.value)}
                      placeholder="Your words, your gender"
                      aria-label="Self-described gender identity"
                      maxLength={80}
                      data-testid="input-gender-self-describe"
                    />
                  )}
                  <div className="flex flex-wrap gap-1.5 pt-1" role="group" aria-label="Intersex connection">
                    {([
                      { value: true, label: "I am intersex" },
                      { value: false, label: "I'm not / not sure" },
                    ] as const).map((opt) => (
                      <Button
                        key={String(opt.value)}
                        type="button"
                        size="sm"
                        variant={isIntersex === opt.value ? "secondary" : "ghost"}
                        className="border"
                        aria-pressed={isIntersex === opt.value}
                        onClick={() => setIsIntersex(isIntersex === opt.value ? null : opt.value)}
                        data-testid={`intersex-${opt.value ? "yes" : "no"}`}
                      >
                        {opt.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              {(legalSexNow || birthMarker || genderIdentity || isIntersex !== null) && (
                <div className="p-4 rounded-lg border-2 border-violet-300/70 dark:border-violet-500/30 bg-white/70 dark:bg-gray-950/50 space-y-3" data-testid="helper-result">
                  <p className="text-sm leading-relaxed">
                    {isIntersex === true && genderIdentity && genderIdentity !== "Self-describe" && (
                      <>You can be intersex and a {genderIdentity.toLowerCase()} — full stop. </>
                    )}
                    {isIntersex === true && genderIdentity === "Self-describe" && genderSelfDescribe.trim() && (
                      <>You can be intersex and {genderSelfDescribe.trim()} — full stop. </>
                    )}
                    {legalSexNow && birthMarker && birthMarker !== "not-sure" && (
                      <>
                        Your current legal sex ({legalSexNow}) and your birth marker ({birthMarker}) don't
                        have to match, and neither one decides your fit.{" "}
                      </>
                    )}
                    Every product here is sized from your actual anatomy in the configurator —
                    hormonal and surgical affirming care are first-class fit inputs there, not
                    exceptions.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {birthMarker && birthMarker !== "not-sure" ? (
                      <Button
                        size="sm"
                        onClick={() => browseByBirthMarker(birthMarker)}
                        data-testid="cta-helper-browse-marker"
                      >
                        <Shapes className="mr-1.5 h-4 w-4" />
                        Browse the {birthMarker} variation catalogue
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => browseByBirthMarker("ALL")}
                        data-testid="cta-helper-browse-all"
                      >
                        <Shapes className="mr-1.5 h-4 w-4" />
                        Browse all 86 variations
                      </Button>
                    )}
                    <Link href="/inclusive-ordering">
                      <Button size="sm" variant="outline" data-testid="cta-helper-configurator">
                        <ArrowRight className="mr-1.5 h-4 w-4" />
                        Open the configurator (affirming-care aware)
                      </Button>
                    </Link>
                  </div>
                </div>
              )}

              <Alert className="border-2 border-dashed border-violet-400/60 bg-violet-50/60 dark:bg-violet-950/20">
                <AlertDescription className="text-xs leading-relaxed text-violet-900 dark:text-violet-200">
                  <strong>Honesty note:</strong> these answers live only on this page while it's open —
                  nothing is stored, sent, or attached to any account or order. They exist purely to
                  route you to the right part of the catalogue. Legal sex is never used to gate,
                  verify, or restrict anything on TriSex.org.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Full catalogue — all 86 named variations */}
          <Card id="full-catalogue" className="mb-12 border-2 border-primary/20" data-testid="card-full-catalogue">
            <CardHeader>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <Badge className="bg-primary/15 text-primary border border-primary/30 text-xs">
                  <Shapes className="w-3 h-3 mr-1" /> Full catalogue · all {INTERSEX_VARIATIONS.length} variations
                </Badge>
                <Badge variant="outline" className="text-xs">Grouped by category</Badge>
              </div>
              <CardTitle className="text-2xl lg:text-3xl">
                Every named variation, in full
              </CardTitle>
              <CardDescription className="text-base mt-2 max-w-3xl">
                The three cards above are our grouping of how these variations tend to map to a
                recorded sex marker. Below is the complete catalogue — every one of the{" "}
                {INTERSEX_VARIATIONS.length} named variations, with the assignment markers we place it
                under, the contact zones it affects, whether we suggest a fitting consult, its design
                fitting note, and the exact configurator controls that appear for it. Search by name
                or filter by marker to jump to yours.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-3 mb-5">
                <Input
                  value={catalogueSearch}
                  onChange={(e) => setCatalogueSearch(e.target.value)}
                  placeholder="Search variations (e.g. CAH, MRKH, hypospadias, Klinefelter)…"
                  className="sm:max-w-md"
                  data-testid="input-catalogue-search"
                />
                <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter variations by recorded birth assignment marker">
                  {(["ALL", "AMAB", "AFAB", "AXAB"] as const).map((m) => (
                    <Button
                      key={m}
                      type="button"
                      size="sm"
                      variant={catalogueMarker === m ? "default" : "outline"}
                      onClick={() => setCatalogueMarker(m)}
                      data-testid={`filter-catalogue-${m.toLowerCase()}`}
                    >
                      {m === "ALL" ? "All markers" : m}
                    </Button>
                  ))}
                </div>
              </div>

              {(() => {
                const q = catalogueSearch.trim().toLowerCase();
                const matches = INTERSEX_VARIATIONS.filter((v) => {
                  const markers = getAssignmentMarkers(v);
                  // Anti-binarist filtering: filtering by AMAB or AFAB always also
                  // includes AXAB-tagged variations, because in jurisdictions with no
                  // X marker on IDs, intersex people were recorded M or F regardless
                  // of their bodies. A binary filter must never hide those variations.
                  const markerOk =
                    catalogueMarker === "ALL" ||
                    markers.includes(catalogueMarker) ||
                    (catalogueMarker !== "AXAB" && markers.includes("AXAB"));
                  const searchOk =
                    q === "" ||
                    v.name.toLowerCase().includes(q) ||
                    (v.alsoKnownAs?.toLowerCase().includes(q) ?? false) ||
                    v.id.toLowerCase().includes(q);
                  return markerOk && searchOk;
                });
                const categoriesWithMatches = INTERSEX_CATEGORIES.map((cat) => ({
                  ...cat,
                  items: matches.filter((v) => v.category === cat.id),
                })).filter((cat) => cat.items.length > 0);

                if (matches.length === 0) {
                  return (
                    <div className="text-center py-10 text-muted-foreground text-sm" data-testid="catalogue-empty">
                      No variations match your search. Try a different name or clear the filters.
                    </div>
                  );
                }

                return (
                  <>
                    <p className="text-xs text-muted-foreground mb-3" data-testid="catalogue-count">
                      Showing {matches.length} of {INTERSEX_VARIATIONS.length} variations
                      {catalogueMarker === "AXAB"
                        ? " assigned AXAB / X"
                        : catalogueMarker !== "ALL"
                          ? ` assigned ${catalogueMarker} — plus every AXAB-tagged variation, because states without an X marker recorded intersex people as M or F regardless of their bodies`
                          : ""}
                      {q ? ` matching "${catalogueSearch.trim()}"` : ""}.
                    </p>
                    <Accordion type="multiple" className="w-full">
                      {categoriesWithMatches.map((cat) => (
                        <AccordionItem key={cat.id} value={cat.id} data-testid={`catalogue-category-${cat.id}`}>
                          <AccordionTrigger className="text-left hover:no-underline">
                            <div className="flex flex-col items-start pr-3">
                              <span className="font-semibold text-base">
                                {cat.label}{" "}
                                <span className="text-muted-foreground font-normal">
                                  ({cat.items.length})
                                </span>
                              </span>
                              <span className="text-xs text-muted-foreground font-normal mt-0.5">
                                {cat.blurb}
                              </span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="grid md:grid-cols-2 gap-3 pt-1">
                              {cat.items.map((v) => {
                                const markers = getAssignmentMarkers(v);
                                const params = getApplicableParams(v);
                                return (
                                  <div
                                    key={v.id}
                                    className="rounded-lg border bg-white/60 dark:bg-gray-950/40 p-4 flex flex-col"
                                    data-testid={`catalogue-variation-${v.id}`}
                                  >
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                      <h4 className="font-semibold text-sm leading-snug">{v.name}</h4>
                                      {v.consultRequired ? (
                                        <Badge variant="outline" className="shrink-0 text-[10px] border-amber-400 text-amber-700 dark:text-amber-300">
                                          Consult suggested
                                        </Badge>
                                      ) : (
                                        <Badge variant="outline" className="shrink-0 text-[10px] border-emerald-400 text-emerald-700 dark:text-emerald-300">
                                          Standard fit
                                        </Badge>
                                      )}
                                    </div>
                                    {v.alsoKnownAs && (
                                      <p className="text-xs text-muted-foreground italic mb-2">
                                        Also known as: {v.alsoKnownAs}
                                      </p>
                                    )}
                                    <div className="flex flex-wrap gap-1 mb-2">
                                      {markers.map((m) => (
                                        <span
                                          key={m}
                                          className={`text-[10px] font-medium px-1.5 py-0.5 rounded border ${MARKER_STYLES[m]}`}
                                        >
                                          {m}
                                        </span>
                                      ))}
                                    </div>
                                    <div className="mb-2">
                                      <div className="text-[10px] uppercase tracking-wide text-muted-foreground mb-1">
                                        Contact zones
                                      </div>
                                      <div className="flex flex-wrap gap-1">
                                        {v.relevantZones.map((z) => (
                                          <Badge key={z} variant="secondary" className="text-[10px]">
                                            {ZONE_LABELS[z] ?? z}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                    <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed mb-2 flex-1">
                                      {v.fittingNote}
                                    </p>
                                    <div>
                                      <div className="text-[10px] uppercase tracking-wide text-muted-foreground mb-1">
                                        Configurator controls
                                      </div>
                                      <div className="flex flex-wrap gap-1">
                                        {params.map((pid) => (
                                          <span
                                            key={pid}
                                            className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20"
                                          >
                                            {FITTING_PARAMS[pid].label}
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </>
                );
              })()}

              <Alert className="mt-6 border-2 border-dashed border-amber-500/60 bg-amber-50 dark:bg-amber-950/20">
                <AlertDescription className="text-amber-900 dark:text-amber-200 text-xs leading-relaxed space-y-1.5">
                  <div className="font-semibold">Honesty notes — full catalogue</div>
                  <p>
                    Every fitting note and configurator control below is a <strong>design
                    hypothesis</strong> assembled by co-operators, not a clinical spec. TriSex.org has
                    not manufactured custom-fit units for every named variation and is not claiming an
                    off-the-shelf fit. "Consult suggested" means measurement matters for that anatomy —
                    it is never a gate on ordering.
                  </p>
                  <p>
                    The marker tags (AMAB / AFAB / AXAB) describe a <strong>recorded birth
                    assignment</strong>, not your anatomy or identity, and a variation may appear under
                    more than one marker. Nothing here is a diagnosis, a registry, or population data,
                    and your selection is never stored or shared beyond your own order summary.
                  </p>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Header */}
          <div className="text-center mb-12">
            {/* Vegan vs Traditional Toggle */}
            <div className="flex justify-center items-center gap-4 mb-6">
              <button
                onClick={() => setIsVegan(true)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                  isVegan 
                    ? 'bg-green-600 text-white shadow-lg scale-105' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                data-testid="button-vegan-mode"
              >
                <Sprout className="h-5 w-5" />
                100% Vegan
              </button>
              <button
                onClick={() => setIsVegan(false)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                  !isVegan 
                    ? 'bg-amber-600 text-white shadow-lg scale-105' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                data-testid="button-traditional-mode"
              >
                <Flower2 className="h-5 w-5" />
                Upcycled Traditional
              </button>
            </div>

            <h1 className="text-4xl lg:text-5xl font-bold text-neutral mb-4">
              Bulk Order Products & Services
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Cooperative pricing achieves <span className="font-bold text-primary">$0.99/unit</span> when ordering 500+ units. 
              All features included. {isVegan ? '100% vegan plant-based materials.' : 'Upcycled animal waste from farms, hunts, fisheries & pharmacies + plant botanicals.'} Volume discounts for community health.
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
                    <Heart className="h-5 w-5 text-primary" />
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
                  <Link href="/wiki" aria-label="Read the wiki article on cooperative ownership">
                    <Button variant="outline" size="sm" className="w-full">
                      Read about cooperative ownership <ArrowRight className="ml-2 h-3 w-3" />
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
