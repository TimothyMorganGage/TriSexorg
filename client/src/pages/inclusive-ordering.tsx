import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { MultiUseBalance, Order } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { PrecisionSizing } from "@/components/MyONESizing";
import { 
  ShoppingCart, 
  Heart,
  Users,
  CheckCircle,
  Package,
  Truck,
  Settings,
  Info,
  Search
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  INTERSEX_VARIATIONS,
  INTERSEX_CATEGORIES,
  FITTING_PARAMS,
  getApplicableParams,
  getDefaultCustomization,
  ASSIGNMENT_MARKERS,
  getAssignmentMarkers,
  countVariationsByMarker,
  type AssignmentMarker,
  type FittingParamId,
  type FittingParamValue,
  type IntersexVariation,
} from "@/data/intersex-variations";

interface BrandingPreference {
  id: string;
  name: string;
  description: string;
  logoVariant: boolean;
  packaging: string;
  messaging: string;
}

type RoleBalance = "receptive" | "penetrative" | "versatile";
type ProcreativeMode = "barrier-only" | "procreative-permeable" | "fertility-only";
type AffirmingCareStatus =
  | "not-specified"
  | "no-affirming-care"
  | "hormonal"
  | "surgical"
  | "surgical-and-hormonal"
  | "self-describe";

const AFFIRMING_CARE_OPTIONS: Array<{ value: AffirmingCareStatus; label: string; helper: string }> = [
  {
    value: "not-specified",
    label: "Prefer not to specify",
    helper: "We fit to the measurements and variations you provide, nothing assumed.",
  },
  {
    value: "no-affirming-care",
    label: "No gender-affirming care — fit my body as it is",
    helper: "Your intersex anatomy is the baseline; no surgical or hormonal history is assumed.",
  },
  {
    value: "hormonal",
    label: "Hormonal affirming care",
    helper: "Tissue changes from hormones (e.g. growth, softening) are factored into the fit.",
  },
  {
    value: "surgical",
    label: "Surgical affirming care",
    helper: "Post-surgical anatomy — scar-aware surfaces and appropriate anchors are offered.",
  },
  {
    value: "surgical-and-hormonal",
    label: "Surgical + hormonal affirming care",
    helper: "Both surgical and hormonal history are factored into the fit.",
  },
  {
    value: "self-describe",
    label: "Self-describe below",
    helper: "Tell us in your own words so the fit matches your body.",
  },
];

const CONTACT_ZONES = [
  { id: "oral", label: "Oral (mouth-side contact, throat coating)" },
  { id: "anal", label: "Anal (rectal canal or oral-anal)" },
  { id: "vaginal", label: "Endosex vaginal canal" },
  { id: "frontal", label: "Frontal opening / front hole (transmasc, non-binary, intersex frontal anatomy)" },
  { id: "neovaginal", label: "Post-vaginoplasty neovagina (shallower depth honoured)" },
] as const;

type ContactZoneId = typeof CONTACT_ZONES[number]["id"];

interface FoldState {
  id: string;
  glyph: string;
  name: string;
  metaphor: string;
  acts: string;
  zonesCovered: ContactZoneId[];
  reFoldStep: string;
}

const FOLD_LIBRARY: FoldState[] = [
  {
    id: "folded-square",
    glyph: "▢",
    name: "Folded Square",
    metaphor: "Storage / wallet fold — the resting state, like a closed origami crane.",
    acts: "Idle. Not in contact. Used between acts as a clean re-set point.",
    zonesCovered: [],
    reFoldStep: "Flatten. Smooth corners. Hold by the outer tab so the inner face never touches a partner.",
  },
  {
    id: "wing-dam",
    glyph: "▭",
    name: "Wing-Extended Dam",
    metaphor: "Crane unfolded into wide wings — a planar barrier sheet held flat across a contact surface.",
    acts: "Oral-vulva, oral-anal (rim), oral-frontal — any external mouth-on-skin act.",
    zonesCovered: ["oral", "anal", "vaginal", "frontal", "neovaginal"],
    reFoldStep: "Pull the two opposite tabs outward; the central panel pops flat. Anchor with finger loops on each tab.",
  },
  {
    id: "inverted-sleeve",
    glyph: "◖",
    name: "Inverted Sleeve",
    metaphor: "Wing folds inward and rolls into a tube — a hollow origami straw, closed at one end.",
    acts: "Penetrative role: shaft-side cover for penises, T-dicks, micropenises, or post-phalloplasty shafts.",
    zonesCovered: ["vaginal", "anal", "frontal", "neovaginal"],
    reFoldStep: "Lift the central panel, invert through the anchor ring, roll downward like an origami waterbomb base.",
  },
  {
    id: "cup-pouch",
    glyph: "◓",
    name: "Cup-Pouch",
    metaphor: "Sleeve everted and re-pinched at the base — a receiving cup, like an origami fortune-teller flipped inside-out.",
    acts: "Receptive role: lines a vaginal canal, neovagina, frontal opening, or anal canal as an internal barrier.",
    zonesCovered: ["vaginal", "neovaginal", "frontal", "anal"],
    reFoldStep: "Push the sleeve's closed end through itself; fold the rim outward so the new outer face was previously the unused side.",
  },
  {
    id: "hammock-cradle",
    glyph: "◡",
    name: "Hammock-Cradle",
    metaphor: "Two opposite tabs anchored, central panel suspended — a slung origami hammock spanning two contact zones at once.",
    acts: "Two-zone simultaneous coverage: e.g. oral + frontal, or oral + anal, where one partner is bridging two acts.",
    zonesCovered: ["oral", "anal", "vaginal", "frontal", "neovaginal"],
    reFoldStep: "Anchor first tab to upper zone, second tab to lower zone; let central panel sag into a U so it hugs both surfaces.",
  },
  {
    id: "finger-cot",
    glyph: "◉",
    name: "Finger Cot Spire",
    metaphor: "Single corner pulled into a tall cone — an origami spire, sealed-tip and narrow.",
    acts: "Manual / digital contact: covers a finger or thumb for internal exploration without changing units.",
    zonesCovered: ["vaginal", "anal", "frontal", "neovaginal"],
    reFoldStep: "Pinch one corner up, twist 90° so it crowns into a sealed cone; the rest of the unit hangs as a skirt-anchor at the wrist.",
  },
];

export default function InclusiveOrdering() {
  const [brandingPreference, setBrandingPreference] = useState("pride-inclusive");
  const [orderStep, setOrderStep] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [roleBalance, setRoleBalance] = useState<RoleBalance>("versatile");
  const [contactZones, setContactZones] = useState<ContactZoneId[]>(["oral", "anal", "vaginal"]);
  const [procreativeMode, setProcreativeMode] = useState<ProcreativeMode>("barrier-only");
  const [affirmingCareStatus, setAffirmingCareStatus] = useState<AffirmingCareStatus>("not-specified");
  const [affirmingCareNotes, setAffirmingCareNotes] = useState("");
  const [currentFoldIndex, setCurrentFoldIndex] = useState(0);
  const [selectedVariations, setSelectedVariations] = useState<string[]>([]);
  const [variationSearch, setVariationSearch] = useState("");
  const [activeVariationCategory, setActiveVariationCategory] = useState<string>(INTERSEX_CATEGORIES[0].id);
  const [activeMarkerFilter, setActiveMarkerFilter] = useState<AssignmentMarker | "all">("all");
  const [variationCustomizations, setVariationCustomizations] = useState<
    Record<string, Record<string, FittingParamValue>>
  >({});

  const toggleVariation = (id: string) => {
    setSelectedVariations((prev) => {
      if (prev.includes(id)) {
        setVariationCustomizations((prevCustom) => {
          const next = { ...prevCustom };
          delete next[id];
          return next;
        });
        return prev.filter((v) => v !== id);
      }
      const variation = INTERSEX_VARIATIONS.find((v) => v.id === id);
      if (variation) {
        setVariationCustomizations((prevCustom) => ({
          ...prevCustom,
          [id]: getDefaultCustomization(variation),
        }));
      }
      return [...prev, id];
    });
  };

  const updateCustomization = (variationId: string, paramId: FittingParamId, value: FittingParamValue) => {
    setVariationCustomizations((prev) => ({
      ...prev,
      [variationId]: {
        ...(prev[variationId] ?? {}),
        [paramId]: value,
      },
    }));
  };

  const filteredVariations = INTERSEX_VARIATIONS.filter((v) => {
    const markerMatch =
      activeMarkerFilter === "all" || getAssignmentMarkers(v).includes(activeMarkerFilter);
    if (!markerMatch) return false;
    if (variationSearch.trim().length === 0) return v.category === activeVariationCategory;
    const q = variationSearch.toLowerCase();
    return v.name.toLowerCase().includes(q) || (v.alsoKnownAs?.toLowerCase().includes(q) ?? false);
  });

  const selectedVariationDetails = INTERSEX_VARIATIONS.filter((v) => selectedVariations.includes(v.id));
  const consultRequiredCount = selectedVariationDetails.filter((v) => v.consultRequired).length;
  const synthesizedZones = Array.from(
    new Set(selectedVariationDetails.flatMap((v) => v.relevantZones))
  );

  const { toast } = useToast();
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);

  const placeOrderMutation = useMutation({
    mutationFn: async () => {
      const balance: MultiUseBalance = {
        roleBalance,
        contactZones,
        procreativeMode,
        affirmingCareStatus,
        affirmingCareNotes: affirmingCareNotes.trim() || undefined,
        intersexVariations: selectedVariations,
        consultRequiredCount,
        activeFoldId: activeFold?.id ?? null,
        balanceCode: balanceConfigCode(),
        brandingPreference,
        variationCustomizations,
      };
      const productConfigId = selectedProduct
        ? Math.abs(
            selectedProduct.split("").reduce((a, c) => a + c.charCodeAt(0), 0)
          ) % 1000 + 1
        : 1;
      const res = await apiRequest("POST", "/api/orders", {
        userId: 1,
        configurationId: productConfigId,
        orderNumber: `TSO-${Date.now()}`,
        status: "pending",
        totalAmount: "0.00",
        notes: selectedProduct ? `Inclusive ordering: ${selectedProduct}` : null,
        brandingPreference,
        multiUseBalance: balance,
      });
      return (await res.json()) as Order;
    },
    onSuccess: (order) => {
      setPlacedOrder(order);
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      toast({
        title: "Order placed",
        description: `Order ${order.orderNumber} saved with the full multi-use balance configuration${
          consultRequiredCount > 0
            ? ` and ${consultRequiredCount} consult-flagged variation${consultRequiredCount === 1 ? "" : "s"}`
            : ""
        }.`,
      });
    },
    onError: (err: Error) => {
      toast({
        title: "Order could not be placed",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  const compatibleFolds = FOLD_LIBRARY.filter(
    (fold) =>
      fold.zonesCovered.length === 0 ||
      fold.zonesCovered.some((zone) => contactZones.includes(zone))
  );

  const safeFoldIndex = compatibleFolds.length === 0 ? 0 : currentFoldIndex % compatibleFolds.length;
  const activeFold = compatibleFolds[safeFoldIndex] ?? null;

  const cycleFold = (direction: 1 | -1) => {
    if (compatibleFolds.length === 0) return;
    setCurrentFoldIndex((prev) => {
      const next = (prev + direction + compatibleFolds.length) % compatibleFolds.length;
      return next;
    });
  };

  const toggleContactZone = (zoneId: ContactZoneId) => {
    setContactZones((prev) =>
      prev.includes(zoneId) ? prev.filter((z) => z !== zoneId) : [...prev, zoneId]
    );
  };

  const balanceConfigCode = () => {
    const zoneCode = contactZones.length > 0 ? contactZones.map((z) => z[0].toUpperCase()).sort().join("") : "—";
    const roleCode = roleBalance === "versatile" ? "V" : roleBalance === "receptive" ? "R" : "P";
    const procCode =
      procreativeMode === "barrier-only" ? "B" : procreativeMode === "procreative-permeable" ? "PP" : "FO";
    return `${roleCode}-${zoneCode}-${procCode}`;
  };

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

  const products: Array<{
    id: string;
    name: string;
    description: string;
    priceRange: string;
    customization: string;
    variants?: string[];
    honestyNote?: string;
  }> = [
    {
      id: "external-protection",
      name: "TriSex.org External Protection",
      description: "Custom-fit external protection with precision sizing — covers phallic anatomy across the full intersex range (penises, T-dicks / hormonally enlarged clitorises, micropenises, post-phalloplasty shafts, and ambiguous external genitalia) rather than assuming a single shape.",
      priceRange: "$12-18 per unit",
      customization: "60+ length and girth options, multiple materials, optional sleeve adapters for shorter or differently-shaped shafts",
      variants: [
        "Endosex penile shaft",
        "T-dick / hormonally enlarged clitoris (with shorter sleeve adapter)",
        "Micropenis / hypospadias-aware fit",
        "Post-phalloplasty / metoidioplasty shaft",
      ],
    },
    {
      id: "internal-protection",
      name: "TriSex.org Internal Protection",
      description: "Internal barrier sized to the actual receiving canal — not just an assumed vaginal canal opposite a phallus. Covers vaginal canals, front holes, post-vaginoplasty neovaginas, anal canals, and intersex internal-canal variants. Each variant has its own depth, width, and ring-tension profile.",
      priceRange: "$15-22 per unit",
      customization: "Per-anatomy depth (mm) and width (mm), inner-ring vs anchor-ring choice, biocompatible materials, optional shorter-depth fit for post-surgical canals or smaller frontal openings",
      variants: [
        "Endosex vaginal canal",
        "Frontal opening / front hole (transmasc, non-binary, intersex frontal anatomy)",
        "Post-vaginoplasty neovagina (shallower depth profile honoured)",
        "Anal canal (separate ring tension and length spec)",
        "Intersex internal-canal variants (e.g. partial canal, blind-ending pouch, urogenital sinus) — fitting consult required",
      ],
      honestyNote: "Earlier copy described this as 'innovative internal protection designed for all anatomies' without naming the actual variants — that wording erased intersex, transmasc, and post-surgical canal differences and is replaced here.",
    },
    {
      id: "dental-dams",
      name: "TriSex.org Oral Barriers",
      description: "Oral-health barriers covering the full range of oral contact — not only the historic 'dental dam over a vulva' use case. Each variant is sized and shaped for its actual contact surface (vulva, anus, penis shaft / glans, frontal opening, post-extraction or oral-surgery site).",
      priceRange: "$8-12 per unit",
      customization: "Square-sheet, contoured-sheet, finger-cot, glans-cap, and rim-collar formats; flavoured and unflavoured; latex-free and latex options; sized small / medium / large per surface",
      variants: [
        "Oral-vulva (classic dental-dam square — vulval contact)",
        "Oral-anal / rim (larger sheet, anchored grip pattern, anus contact)",
        "Oral-penile (glans cap or full-shaft sleeve — pre-cum and throat-coating barrier)",
        "Oral-frontal (sized for front-hole / T-dick contact, smaller contoured sheet)",
        "Oral-surgery / post-extraction shield (intra-oral wound coverage during recovery, not a sex-context use)",
      ],
      honestyNote: "Earlier copy framed this product as 'premium dental dams for oral protection' — that single-use framing left out oral-anal (rim), oral-penile, oral-frontal, and post-oral-surgery uses and is replaced here.",
    },
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
                    data-testid={`product-card-${product.id}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{product.name}</h3>
                      <div className="text-sm font-medium text-primary">
                        {product.priceRange}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {product.description}
                    </p>
                    {product.variants && product.variants.length > 0 && (
                      <div className="mb-3">
                        <div className="text-xs font-semibold text-foreground mb-1">
                          Anatomy / use-case variants:
                        </div>
                        <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                          {product.variants.map((variant) => (
                            <li key={variant}>{variant}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <div className="text-xs text-muted-foreground mb-2">
                      <strong>Customization:</strong> {product.customization}
                    </div>
                    {product.honestyNote && (
                      <div className="mt-3 p-2 border border-dashed border-amber-500/60 bg-amber-50/40 dark:bg-amber-900/10 rounded text-xs text-amber-900 dark:text-amber-200">
                        <strong>Honesty note:</strong> {product.honestyNote}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {selectedProduct && (
                <div className="mt-6 p-4 border rounded-lg bg-muted/30 space-y-5" data-testid="multi-use-balance-panel">
                  <div>
                    <h4 className="font-semibold mb-1 flex items-center">
                      <Settings className="mr-2 h-4 w-4" /> Multi-use balance
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      One unit, configured to flex across the roles, contact zones, and procreative
                      modes you actually use. The fitting profile, material thickness, and surface
                      treatment are tuned to whatever combination you select below.
                    </p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Role balance</Label>
                    <p className="text-xs text-muted-foreground mb-2">
                      How the same unit should perform if you flip roles inside one session.
                    </p>
                    <RadioGroup
                      value={roleBalance}
                      onValueChange={(value) => setRoleBalance(value as RoleBalance)}
                      className="space-y-2"
                    >
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="receptive" id="role-receptive" className="mt-1" />
                        <Label htmlFor="role-receptive" className="text-xs cursor-pointer leading-snug">
                          <span className="font-medium">Receptive only</span> — designed for being penetrated; inner
                          surface tuned for receiving comfort.
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="penetrative" id="role-penetrative" className="mt-1" />
                        <Label htmlFor="role-penetrative" className="text-xs cursor-pointer leading-snug">
                          <span className="font-medium">Penetrative only</span> — designed for penetrating; outer
                          surface tuned for the receiving partner's comfort.
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="versatile" id="role-versatile" className="mt-1" />
                        <Label htmlFor="role-versatile" className="text-xs cursor-pointer leading-snug">
                          <span className="font-medium">Versatile (flips mid-session)</span> — symmetric inner / outer
                          treatment so the unit performs equally if roles switch, without removing or replacing it.
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Contact zones the unit must cover</Label>
                    <p className="text-xs text-muted-foreground mb-2">
                      Pick every zone you want this single unit to be valid against. Material spec is
                      built to the strictest zone selected.
                    </p>
                    <div className="space-y-2">
                      {CONTACT_ZONES.map((zone) => (
                        <div key={zone.id} className="flex items-start space-x-2">
                          <Checkbox
                            id={`zone-${zone.id}`}
                            checked={contactZones.includes(zone.id)}
                            onCheckedChange={() => toggleContactZone(zone.id)}
                            className="mt-0.5"
                          />
                          <Label htmlFor={`zone-${zone.id}`} className="text-xs cursor-pointer leading-snug">
                            {zone.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Procreative balance</Label>
                    <p className="text-xs text-muted-foreground mb-2">
                      Whether this unit is barrier-only, sperm-permeable for trying-to-conceive, or
                      fertility-only with no STI barrier.
                    </p>
                    <RadioGroup
                      value={procreativeMode}
                      onValueChange={(value) => setProcreativeMode(value as ProcreativeMode)}
                      className="space-y-2"
                    >
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="barrier-only" id="proc-barrier" className="mt-1" />
                        <Label htmlFor="proc-barrier" className="text-xs cursor-pointer leading-snug">
                          <span className="font-medium">Barrier-only</span> — full sperm and STI barrier (default).
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="procreative-permeable" id="proc-permeable" className="mt-1" />
                        <Label htmlFor="proc-permeable" className="text-xs cursor-pointer leading-snug">
                          <span className="font-medium">Procreative-permeable</span> — sperm-permitted opening with
                          STI barrier still in place around the rest of the contact surface.{" "}
                          <span className="text-amber-700 dark:text-amber-300">
                            Experimental: not yet manufactured or independently validated.
                          </span>
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="fertility-only" id="proc-fertility" className="mt-1" />
                        <Label htmlFor="proc-fertility" className="text-xs cursor-pointer leading-snug">
                          <span className="font-medium">Fertility-only</span> — anatomical-fit aid for trying-to-conceive
                          with no STI barrier function. Use only with a partner whose recent STI status you have
                          jointly verified.
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="pt-2 border-t">
                    <Label className="text-sm font-medium">
                      Gender-affirming care (self-attested)
                    </Label>
                    <p className="text-xs text-muted-foreground mb-2">
                      Whether you have or have not had gender-affirming care, you can say so here so the
                      fit matches your body today — for you and your partner(s). This is entirely
                      self-declared, never verified, and optional. Your intersex anatomy is always the
                      baseline; affirming care is treated as one more variation, never a special case.
                    </p>
                    <RadioGroup
                      value={affirmingCareStatus}
                      onValueChange={(value) => setAffirmingCareStatus(value as AffirmingCareStatus)}
                      className="space-y-2"
                    >
                      {AFFIRMING_CARE_OPTIONS.map((option) => (
                        <div key={option.value} className="flex items-start space-x-2">
                          <RadioGroupItem
                            value={option.value}
                            id={`affirming-${option.value}`}
                            className="mt-1"
                            data-testid={`radio-affirming-${option.value}`}
                          />
                          <Label
                            htmlFor={`affirming-${option.value}`}
                            className="text-xs cursor-pointer leading-snug"
                          >
                            <span className="font-medium">{option.label}</span> — {option.helper}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                    {(affirmingCareStatus === "self-describe" ||
                      affirmingCareStatus === "surgical" ||
                      affirmingCareStatus === "surgical-and-hormonal" ||
                      affirmingCareStatus === "hormonal") && (
                      <div className="mt-3">
                        <Label htmlFor="affirming-notes" className="text-xs font-medium">
                          {affirmingCareStatus === "self-describe"
                            ? "Describe your anatomy and fitting needs"
                            : "Anything else about your fit (optional)"}
                        </Label>
                        <Textarea
                          id="affirming-notes"
                          value={affirmingCareNotes}
                          onChange={(e) => setAffirmingCareNotes(e.target.value.slice(0, 500))}
                          placeholder="e.g. scar-tissue sensitivity, anchor preferences, depth or reach that works for you and your partner(s)…"
                          className="mt-1 text-xs"
                          rows={3}
                          maxLength={500}
                          data-testid="input-affirming-notes"
                        />
                        <div className="flex justify-between items-center mt-1">
                          {affirmingCareStatus === "self-describe" &&
                          affirmingCareNotes.trim().length === 0 ? (
                            <p className="text-[10px] text-amber-700 dark:text-amber-300">
                              Please add a short description so we can fit you.
                            </p>
                          ) : (
                            <span />
                          )}
                          <p className="text-[10px] text-muted-foreground">
                            {affirmingCareNotes.length}/500
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3 pt-2 border-t">
                    <div>
                      <h4 className="font-semibold mb-1 flex items-center">
                        <Users className="mr-2 h-4 w-4" /> Intersex variation configurator (86 named variations)
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        Pick the intersex variation(s) that describe the body the unit is being fitted for.
                        Each variation maps to relevant contact zones and a fitting note. Multi-select is
                        intended for mosaic / chimeric bodies and for partners-of-different-bodies orders.
                        Variation names follow the Chicago Consensus 2006 DSD nomenclature, with overlay
                        labels from InterACT and Organisation Intersex International (OII).
                      </p>
                    </div>

                    <div className="relative">
                      <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                      <Input
                        placeholder="Search 86 variations (e.g. CAIS, MRKH, hypospadias, mosaic)…"
                        value={variationSearch}
                        onChange={(e) => setVariationSearch(e.target.value)}
                        className="pl-7 h-8 text-xs"
                        data-testid="variation-search-input"
                      />
                    </div>

                    <div className="space-y-1.5" data-testid="marker-filter-row">
                      <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
                        Filter by sex-marker assignment
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {[
                          { id: "all" as const, label: "All", count: INTERSEX_VARIATIONS.length, blurb: "Show every variation in the catalogue across all assignment pathways." },
                          ...ASSIGNMENT_MARKERS.map((m) => ({
                            id: m.id,
                            label: `${m.label} · ${m.expansion}`,
                            count: countVariationsByMarker(m.id),
                            blurb: m.blurb,
                          })),
                        ].map((opt) => {
                          const isActive = activeMarkerFilter === opt.id;
                          return (
                            <button
                              key={opt.id}
                              type="button"
                              onClick={() => setActiveMarkerFilter(opt.id)}
                              className={`px-2.5 py-1 rounded border text-xs transition-colors ${
                                isActive
                                  ? "border-primary bg-primary/10 text-foreground font-medium"
                                  : "border-muted-foreground/30 hover:border-primary/50 text-muted-foreground"
                              }`}
                              data-testid={`marker-filter-${opt.id}`}
                              title={opt.blurb}
                            >
                              {opt.label} <span className="opacity-70">({opt.count})</span>
                            </button>
                          );
                        })}
                      </div>
                      {activeMarkerFilter !== "all" && (
                        <p className="text-[10px] text-muted-foreground italic" data-testid="marker-filter-blurb">
                          {ASSIGNMENT_MARKERS.find((m) => m.id === activeMarkerFilter)?.blurb}{" "}
                          Counts overlap — variations assigned across more than one marker appear under each.
                        </p>
                      )}
                    </div>

                    {variationSearch.trim().length === 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {INTERSEX_CATEGORIES.map((cat) => {
                          const count = INTERSEX_VARIATIONS.filter((v) => v.category === cat.id).length;
                          const isActive = cat.id === activeVariationCategory;
                          return (
                            <button
                              key={cat.id}
                              type="button"
                              onClick={() => setActiveVariationCategory(cat.id)}
                              className={`px-2 py-1 rounded border text-xs transition-colors ${
                                isActive
                                  ? "border-primary bg-primary/10 text-foreground"
                                  : "border-muted-foreground/30 hover:border-primary/50 text-muted-foreground"
                              }`}
                              data-testid={`variation-category-${cat.id}`}
                            >
                              {cat.label} <span className="opacity-70">({count})</span>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {variationSearch.trim().length === 0 && (
                      <p className="text-[11px] text-muted-foreground italic">
                        {INTERSEX_CATEGORIES.find((c) => c.id === activeVariationCategory)?.blurb}
                      </p>
                    )}

                    <ScrollArea className="h-64 border rounded p-2 bg-background" data-testid="variation-scroll-area">
                      {filteredVariations.length === 0 ? (
                        <div className="text-xs text-muted-foreground p-2">
                          No variations match this search. Try another keyword, or clear the search to browse by category.
                        </div>
                      ) : (
                        <div className="space-y-1.5">
                          {filteredVariations.map((v) => {
                            const checked = selectedVariations.includes(v.id);
                            return (
                              <div
                                key={v.id}
                                className={`flex items-start gap-2 p-2 rounded border text-xs cursor-pointer transition-colors ${
                                  checked
                                    ? "border-primary bg-primary/5"
                                    : "border-transparent hover:border-muted-foreground/30"
                                }`}
                                onClick={() => toggleVariation(v.id)}
                                data-testid={`variation-row-${v.id}`}
                              >
                                <Checkbox
                                  checked={checked}
                                  onCheckedChange={() => toggleVariation(v.id)}
                                  className="mt-0.5"
                                  data-testid={`variation-check-${v.id}`}
                                />
                                <div className="flex-1 leading-snug">
                                  <div className="font-medium">
                                    {v.name}
                                    {v.consultRequired && (
                                      <Badge variant="outline" className="ml-2 text-[10px] border-amber-500 text-amber-700 dark:text-amber-300">
                                        consult
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="text-muted-foreground text-[11px] mt-0.5">{v.fittingNote}</div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </ScrollArea>

                    {selectedVariationDetails.length > 0 && (
                      <div className="space-y-2" data-testid="variation-customization-stack">
                        <div className="text-xs font-semibold flex items-center justify-between">
                          <span>Per-variation custom-order parameters</span>
                          <span className="text-[10px] text-muted-foreground font-normal">
                            One card per selected variation — each ships with its own fitting spec
                          </span>
                        </div>
                        {selectedVariationDetails.map((v) => {
                          const params = getApplicableParams(v);
                          const customs = variationCustomizations[v.id] ?? {};
                          return (
                            <div
                              key={v.id}
                              className="p-3 border rounded bg-background space-y-3"
                              data-testid={`variation-custom-card-${v.id}`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1">
                                  <div className="text-xs font-semibold leading-snug">{v.name}</div>
                                  <div className="text-[10px] text-muted-foreground mt-0.5">{v.fittingNote}</div>
                                </div>
                                <div className="flex items-center gap-1 shrink-0">
                                  {v.consultRequired && (
                                    <Badge variant="outline" className="text-[10px] border-amber-500 text-amber-700 dark:text-amber-300">
                                      consult
                                    </Badge>
                                  )}
                                  <button
                                    type="button"
                                    onClick={() => toggleVariation(v.id)}
                                    className="text-[10px] text-muted-foreground hover:text-foreground underline"
                                    data-testid={`variation-remove-${v.id}`}
                                  >
                                    remove
                                  </button>
                                </div>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {params.map((pid) => {
                                  const spec = FITTING_PARAMS[pid];
                                  const value = customs[pid] ?? spec.defaultValue;
                                  if (spec.kind === "slider") {
                                    const numericValue = typeof value === "number" ? value : Number(spec.defaultValue);
                                    return (
                                      <div key={pid} className="space-y-1.5" data-testid={`param-${v.id}-${pid}`}>
                                        <div className="flex items-center justify-between text-[11px]">
                                          <Label className="font-medium">{spec.label}</Label>
                                          <span className="font-mono text-muted-foreground">
                                            {numericValue}
                                            {spec.unit ? ` ${spec.unit}` : ""}
                                          </span>
                                        </div>
                                        <Slider
                                          min={spec.min}
                                          max={spec.max}
                                          step={spec.step}
                                          value={[numericValue]}
                                          onValueChange={(vals) =>
                                            updateCustomization(v.id, pid, vals[0] ?? spec.defaultValue as number)
                                          }
                                          data-testid={`slider-${v.id}-${pid}`}
                                        />
                                        {spec.helper && (
                                          <p className="text-[10px] text-muted-foreground italic">{spec.helper}</p>
                                        )}
                                      </div>
                                    );
                                  }
                                  if (spec.kind === "select") {
                                    const stringValue = typeof value === "string" ? value : String(spec.defaultValue);
                                    return (
                                      <div key={pid} className="space-y-1.5" data-testid={`param-${v.id}-${pid}`}>
                                        <Label className="font-medium text-[11px]">{spec.label}</Label>
                                        <Select
                                          value={stringValue}
                                          onValueChange={(val) => updateCustomization(v.id, pid, val)}
                                        >
                                          <SelectTrigger
                                            className="h-8 text-xs"
                                            data-testid={`select-${v.id}-${pid}`}
                                          >
                                            <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {spec.options?.map((opt) => (
                                              <SelectItem key={opt.value} value={opt.value} className="text-xs">
                                                {opt.label}
                                              </SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                        {spec.helper && (
                                          <p className="text-[10px] text-muted-foreground italic">{spec.helper}</p>
                                        )}
                                      </div>
                                    );
                                  }
                                  if (spec.kind === "boolean") {
                                    const boolValue = typeof value === "boolean" ? value : Boolean(spec.defaultValue);
                                    return (
                                      <div
                                        key={pid}
                                        className="flex items-start justify-between gap-2 p-2 rounded border bg-muted/30"
                                        data-testid={`param-${v.id}-${pid}`}
                                      >
                                        <div className="flex-1">
                                          <Label className="font-medium text-[11px] cursor-pointer">{spec.label}</Label>
                                          {spec.helper && (
                                            <p className="text-[10px] text-muted-foreground italic mt-0.5">{spec.helper}</p>
                                          )}
                                        </div>
                                        <Switch
                                          checked={boolValue}
                                          onCheckedChange={(checked) => updateCustomization(v.id, pid, checked)}
                                          data-testid={`switch-${v.id}-${pid}`}
                                        />
                                      </div>
                                    );
                                  }
                                  // text
                                  const textValue = typeof value === "string" ? value : "";
                                  return (
                                    <div key={pid} className="space-y-1.5" data-testid={`param-${v.id}-${pid}`}>
                                      <Label className="font-medium text-[11px]">{spec.label}</Label>
                                      <Input
                                        value={textValue}
                                        onChange={(e) => updateCustomization(v.id, pid, e.target.value)}
                                        className="h-8 text-xs"
                                        placeholder="(optional)"
                                        data-testid={`input-${v.id}-${pid}`}
                                      />
                                      {spec.helper && (
                                        <p className="text-[10px] text-muted-foreground italic">{spec.helper}</p>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {selectedVariationDetails.length > 0 && (
                      <div className="p-3 border rounded bg-background space-y-2" data-testid="variation-synthesis">
                        <div className="flex items-center justify-between">
                          <div className="text-xs font-semibold">
                            Synthesized fitting profile ({selectedVariationDetails.length}{" "}
                            variation{selectedVariationDetails.length === 1 ? "" : "s"} selected)
                          </div>
                          <button
                            type="button"
                            onClick={() => setSelectedVariations([])}
                            className="text-[11px] text-muted-foreground hover:text-foreground underline"
                            data-testid="variation-clear-button"
                          >
                            Clear all
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {selectedVariationDetails.map((v) => (
                            <Badge
                              key={v.id}
                              variant="secondary"
                              className="text-[10px] cursor-pointer"
                              onClick={() => toggleVariation(v.id)}
                              data-testid={`variation-chip-${v.id}`}
                            >
                              {v.name} ✕
                            </Badge>
                          ))}
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-[11px] pt-1 border-t">
                          <div>
                            <div className="font-medium text-muted-foreground mb-0.5">Relevant zones (union)</div>
                            <div className="flex flex-wrap gap-1">
                              {synthesizedZones.length === 0 ? (
                                <span className="text-muted-foreground italic">None</span>
                              ) : (
                                synthesizedZones.map((z) => (
                                  <Badge key={z} variant="outline" className="text-[10px]">
                                    {z}
                                  </Badge>
                                ))
                              )}
                            </div>
                          </div>
                          <div>
                            <div className="font-medium text-muted-foreground mb-0.5">Consult flag</div>
                            <div>
                              {consultRequiredCount > 0 ? (
                                <span className="text-amber-700 dark:text-amber-300">
                                  Fitting consult recommended ({consultRequiredCount} of{" "}
                                  {selectedVariationDetails.length} selected variation{selectedVariationDetails.length === 1 ? "" : "s"})
                                </span>
                              ) : (
                                <span className="text-muted-foreground">
                                  Standard fit usually applies; consult optional.
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="p-3 border border-dashed border-amber-500/60 bg-amber-50 dark:bg-amber-950/20 rounded text-[11px] text-amber-900 dark:text-amber-200 space-y-1">
                      <div className="font-semibold">Honesty notes — intersex variation configurator</div>
                      <p>
                        The 86 named variations are a working catalogue assembled from the Chicago Consensus
                        2006 DSD nomenclature, InterACT Advocates for Intersex Youth, Organisation Intersex
                        International (OII), and the archived Intersex Society of North America (ISNA).
                        TriSex.org has not independently validated the catalogue's medical accuracy or
                        completeness, and the count may grow as co-operators contribute.
                      </p>
                      <p>
                        Each fitting note is a <strong>design hypothesis</strong>. TriSex.org has not
                        manufactured custom-fit units for every named variation, has not measured barrier
                        integrity or comfort across these specific anatomies, and is not claiming that
                        selecting a variation here guarantees an off-the-shelf fit. Variations marked{" "}
                        <em>consult</em> mean a fitting conversation (Meta Lens scan or one-to-one
                        consultation) is recommended before the unit is configured for shipping.
                      </p>
                      <p>
                        Selecting a variation is <strong>self-reported</strong>. TriSex.org does not require
                        medical proof, does not store or share the selection outside the order summary, and
                        does not use the selection for any registry, research, or insurance purpose.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-background rounded border">
                    <span className="text-xs text-muted-foreground">Configured balance code</span>
                    <Badge variant="outline" data-testid="balance-config-code" className="font-mono">
                      {balanceConfigCode()}
                    </Badge>
                  </div>

                  <div className="space-y-3 pt-2 border-t">
                    <div>
                      <h4 className="font-semibold mb-1 flex items-center">
                        <Package className="mr-2 h-4 w-4" /> Origami fold sequence — "hammocks of the mind"
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        One physical unit, multiple named fold-states. A sexual puppeteer transitions the
                        unit through these origami-style folds during a session so a range of acts can be
                        served by the same one (or two) unit(s) — never by changing units mid-act.
                      </p>
                    </div>

                    {compatibleFolds.length === 0 ? (
                      <div className="p-3 border border-dashed border-muted-foreground/40 bg-muted/20 rounded text-xs text-muted-foreground">
                        Pick at least one contact zone above to see the fold states this unit can serve.
                      </div>
                    ) : (
                      <>
                        <div className="flex flex-wrap gap-2">
                          {compatibleFolds.map((fold, idx) => (
                            <button
                              key={fold.id}
                              type="button"
                              onClick={() => setCurrentFoldIndex(idx)}
                              className={`px-3 py-2 rounded border text-xs flex items-center gap-2 transition-colors ${
                                idx === safeFoldIndex
                                  ? "border-primary bg-primary/10 text-foreground"
                                  : "border-muted-foreground/30 hover:border-primary/50 text-muted-foreground"
                              }`}
                              data-testid={`fold-pill-${fold.id}`}
                            >
                              <span className="text-base leading-none">{fold.glyph}</span>
                              <span>{fold.name}</span>
                            </button>
                          ))}
                        </div>

                        {activeFold && (
                          <div className="p-4 bg-background border rounded-lg space-y-3" data-testid="active-fold-card">
                            <div className="flex items-start gap-4">
                              <div
                                className="w-16 h-16 rounded-md border-2 border-primary/40 bg-primary/5 flex items-center justify-center text-4xl"
                                aria-hidden
                              >
                                {activeFold.glyph}
                              </div>
                              <div className="flex-1 space-y-1">
                                <div className="flex items-center justify-between gap-2">
                                  <h5 className="font-semibold text-sm">
                                    Fold {safeFoldIndex + 1} of {compatibleFolds.length}: {activeFold.name}
                                  </h5>
                                  <div className="flex gap-1">
                                    <Button
                                      type="button"
                                      size="sm"
                                      variant="outline"
                                      className="h-7 px-2 text-xs"
                                      onClick={() => cycleFold(-1)}
                                      data-testid="fold-prev-button"
                                    >
                                      ← Prev fold
                                    </Button>
                                    <Button
                                      type="button"
                                      size="sm"
                                      variant="outline"
                                      className="h-7 px-2 text-xs"
                                      onClick={() => cycleFold(1)}
                                      data-testid="fold-next-button"
                                    >
                                      Next fold →
                                    </Button>
                                  </div>
                                </div>
                                <p className="text-xs text-muted-foreground italic">{activeFold.metaphor}</p>
                              </div>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-3 text-xs">
                              <div>
                                <div className="font-medium mb-1">Acts this fold serves</div>
                                <p className="text-muted-foreground">{activeFold.acts}</p>
                              </div>
                              <div>
                                <div className="font-medium mb-1">Re-fold step (puppeteer instruction)</div>
                                <p className="text-muted-foreground">{activeFold.reFoldStep}</p>
                              </div>
                            </div>

                            {activeFold.zonesCovered.length > 0 && (
                              <div className="text-xs">
                                <div className="font-medium mb-1">Zones this fold can be applied to</div>
                                <div className="flex flex-wrap gap-1">
                                  {activeFold.zonesCovered
                                    .filter((z) => contactZones.includes(z))
                                    .map((z) => (
                                      <Badge key={z} variant="secondary" className="text-[10px]">
                                        {CONTACT_ZONES.find((cz) => cz.id === z)?.label.split(" (")[0] ?? z}
                                      </Badge>
                                    ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        <div className="text-xs text-muted-foreground">
                          Suggested session sequence: start at <strong>Folded Square</strong>, transition
                          forward as acts change, return to <strong>Folded Square</strong> before any pause.
                          One unit can usually handle <strong>3–4 fold transitions</strong> before tactile
                          fatigue — for sessions with more transitions than that, plan a second unit.
                        </div>
                      </>
                    )}
                  </div>

                  <div className="p-3 border border-dashed border-amber-500/60 bg-amber-50/40 dark:bg-amber-900/10 rounded text-xs text-amber-900 dark:text-amber-200 space-y-1">
                    <p>
                      <strong>Honesty notes:</strong>
                    </p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>
                        Multi-use balance means <strong>one unit can flex across roles and zones inside a single
                        session</strong>. Each unit is still single-use per session and must be replaced between
                        partners or between sessions.
                      </li>
                      <li>
                        The <strong>origami fold sequence</strong> ("hammocks of the mind") is a design
                        hypothesis. TriSex.org has not manufactured a fold-cycling unit, has not measured
                        barrier integrity across fold transitions, and is not claiming that any specific
                        fold preserves STI-blocking efficacy. The named folds (Folded Square, Wing-Extended
                        Dam, Inverted Sleeve, Cup-Pouch, Hammock-Cradle, Finger Cot Spire) are
                        co-operator-designed shapes pending prototyping and independent validation.
                      </li>
                      <li>
                        The "3–4 fold transitions before tactile fatigue" guidance is a working
                        co-operator estimate for design conversations, not a measured product spec.
                      </li>
                      <li>
                        The <strong>Procreative-permeable</strong> mode is a design hypothesis — TriSex.org has not
                        manufactured it, has not run clinical validation on it, and is not claiming any conception
                        rate or STI-blocking efficacy for it.
                      </li>
                      <li>
                        The <strong>Fertility-only</strong> mode does not block STIs. Selecting it is not a substitute
                        for testing.
                      </li>
                    </ul>
                  </div>
                </div>
              )}

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
                  disabled={
                    !selectedProduct ||
                    contactZones.length === 0 ||
                    (affirmingCareStatus === "self-describe" && affirmingCareNotes.trim().length === 0)
                  }
                  className="flex-1"
                  data-testid="continue-to-sizing-button"
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

                  <div className="flex justify-between items-center pb-3 border-b">
                    <span className="font-medium">Role balance:</span>
                    <span className="text-sm capitalize">{roleBalance}</span>
                  </div>

                  <div className="flex justify-between items-start pb-3 border-b gap-3">
                    <span className="font-medium">Contact zones (one unit covers all):</span>
                    <span className="text-sm text-right">
                      {contactZones.length === 0
                        ? "—"
                        : contactZones
                            .map(
                              (z) =>
                                CONTACT_ZONES.find((cz) => cz.id === z)?.label.split(" (")[0] ?? z
                            )
                            .join(", ")}
                    </span>
                  </div>

                  <div className="flex justify-between items-center pb-3 border-b">
                    <span className="font-medium">Procreative mode:</span>
                    <span className="text-sm">
                      {procreativeMode === "barrier-only"
                        ? "Barrier-only (sperm + STI)"
                        : procreativeMode === "procreative-permeable"
                        ? "Procreative-permeable (experimental)"
                        : "Fertility-only (no STI barrier)"}
                    </span>
                  </div>

                  <div className="flex justify-between items-center pb-3 border-b">
                    <span className="font-medium">Balance code:</span>
                    <Badge variant="outline" className="font-mono">
                      {balanceConfigCode()}
                    </Badge>
                  </div>

                  {affirmingCareStatus !== "not-specified" && (
                    <div className="flex justify-between items-start pb-3 border-b gap-3">
                      <span className="font-medium">Affirming care (self-attested):</span>
                      <span className="text-sm text-right">
                        {AFFIRMING_CARE_OPTIONS.find((o) => o.value === affirmingCareStatus)?.label ??
                          affirmingCareStatus}
                        {affirmingCareNotes.trim() && (
                          <span className="block text-xs text-muted-foreground mt-0.5">
                            “{affirmingCareNotes.trim()}”
                          </span>
                        )}
                      </span>
                    </div>
                  )}

                  <div className="pb-3 border-b">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium">Intersex variations:</span>
                      <span className="text-xs text-muted-foreground">
                        {selectedVariationDetails.length === 0
                          ? "None selected (standard fit)"
                          : `${selectedVariationDetails.length} selected${
                              consultRequiredCount > 0 ? ` · ${consultRequiredCount} consult` : ""
                            }`}
                      </span>
                    </div>
                    {selectedVariationDetails.length > 0 && (
                      <div
                        className="flex flex-wrap gap-1"
                        data-testid="summary-variation-chips"
                      >
                        {selectedVariationDetails.map((v) => (
                          <Badge
                            key={v.id}
                            variant="secondary"
                            className="text-[10px]"
                          >
                            {v.name}
                            {v.consultRequired && (
                              <span className="ml-1 text-amber-700 dark:text-amber-300">
                                ★
                              </span>
                            )}
                          </Badge>
                        ))}
                      </div>
                    )}
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

                {placedOrder && (
                  <div
                    className="p-4 border border-dashed border-blue-500/60 bg-blue-50 dark:bg-blue-950/20 rounded space-y-2 text-sm"
                    data-testid="order-persisted-confirmation"
                  >
                    <div className="font-semibold text-blue-900 dark:text-blue-100">
                      Order persisted: {placedOrder.orderNumber} (id #{placedOrder.id})
                    </div>
                    <div className="text-xs text-blue-800 dark:text-blue-200">
                      The full multi-use balance configuration — role balance, contact zones,
                      procreative mode, intersex variation selection, consult flag count, active fold,
                      and balance code — is saved on the order record and visible at{" "}
                      <code className="font-mono">GET /api/orders/{placedOrder.id}</code>.
                    </div>
                    <div className="text-[11px] text-blue-700 dark:text-blue-300 italic">
                      Honesty: persisted to in-memory storage on this server instance only — not a
                      production fulfilment record, not shared with any third party, and cleared on
                      server restart.
                    </div>
                  </div>
                )}

                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => setOrderStep(3)}
                    className="flex-1"
                    disabled={placeOrderMutation.isPending}
                    data-testid="modify-order-button"
                  >
                    Modify Order
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={() => placeOrderMutation.mutate()}
                    disabled={placeOrderMutation.isPending}
                    data-testid="place-order-button"
                  >
                    <Truck className="mr-2 h-4 w-4" />
                    {placeOrderMutation.isPending
                      ? "Saving order…"
                      : placedOrder
                      ? "Re-save with current configuration"
                      : "Place order with this configuration"}
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
        <Alert className="mb-4 bg-white dark:bg-gray-950 border-2 border-black dark:border-white">
          <Heart className="h-5 w-5 text-black dark:text-white" />
          <AlertDescription className="ml-2 text-black dark:text-white">
            <strong>Intersex Healthcare IS Everyone's Affirmation:</strong> Inclusive ordering centers intersex anatomy as the universal baseline—trans, non-binary, genderqueer, and quare embodiment are all respected within this participatory budgeting framework. There is no separate "transgender healthcare" category—all orders serve ALL bodies by design.
          </AlertDescription>
        </Alert>

        {/* Operational status — honest framing of what an order currently is */}
        <Alert className="mb-8 border-2 border-amber-500/60 bg-amber-50 dark:bg-amber-950/30" data-testid="ordering-operational-status">
          <Info className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          <AlertDescription className="ml-2 text-amber-900 dark:text-amber-100">
            <strong>Operational status — please read before ordering.</strong> No
            CC&nbsp;BY-SA&nbsp;4.0–compatible manufacturing partners have signed on yet.
            For now, every order you submit here is captured as an open-source{" "}
            <strong>design specification</strong>, not a shipment: your sizing, fold-balance,
            variation overrides, and zone selections are recorded so a future signed
            manufacturer (or your own fork) can fulfil them. <strong>You will not be
            charged and nothing will ship today.</strong> See the{" "}
            <a href="/manufacturing" className="underline font-semibold" data-testid="link-manufacturing-from-banner">manufacturing
            sourcing page</a> for the current candidate list, the partner covenant, and
            self-application form.
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