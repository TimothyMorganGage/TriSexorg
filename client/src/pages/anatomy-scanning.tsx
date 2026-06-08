import { useState, useMemo, lazy, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { 
  Scan, 
  Camera, 
  Smartphone, 
  Download,
  Printer,
  CheckCircle,
  AlertTriangle,
  Eye,
  EyeOff,
  Lock,
  Globe,
  Languages,
  Zap,
  Heart,
  Search,
  Boxes,
  Info,
  Loader2
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  INTERSEX_VARIATIONS,
  INTERSEX_CATEGORIES,
  ASSIGNMENT_MARKERS,
  getAssignmentMarkers,
  type AssignmentMarker,
  type IntersexCategoryId,
} from "@/data/intersex-variations";

const AnatomicalModelViewer = lazy(() => import("@/components/AnatomicalModelViewer"));

const scanningSchema = z.object({
  anatomyType: z.array(z.string()).min(1, "Please select at least one anatomy type"),
  scanningMethod: z.string().min(1, "Please select scanning method"),
  privacyLevel: z.string().min(1, "Please select privacy level"),
  languagePreference: z.string().min(1, "Please select language"),
  culturalTerminology: z.string().optional(),
});

interface ScanDataType {
  captured: boolean;
}

export default function AnatomyScanning() {
  const [scanningStep, setScanningStep] = useState(1);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanData, setScanData] = useState<ScanDataType | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const { toast } = useToast();

  const [selectedVariationId, setSelectedVariationId] = useState<string | null>(null);
  const [librarySearch, setLibrarySearch] = useState("");
  const [libraryMarker, setLibraryMarker] = useState<AssignmentMarker | null>(null);
  const [libraryCategory, setLibraryCategory] = useState<IntersexCategoryId | null>(null);

  const filteredVariations = useMemo(() => {
    const q = librarySearch.trim().toLowerCase();
    return INTERSEX_VARIATIONS.filter((v) => {
      if (libraryCategory && v.category !== libraryCategory) return false;
      if (libraryMarker && !getAssignmentMarkers(v).includes(libraryMarker)) return false;
      if (q) {
        const hay = `${v.name} ${v.alsoKnownAs ?? ""} ${v.category}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [librarySearch, libraryMarker, libraryCategory]);

  const selectedVariation = useMemo(
    () => INTERSEX_VARIATIONS.find((v) => v.id === selectedVariationId) ?? null,
    [selectedVariationId]
  );

  const form = useForm({
    resolver: zodResolver(scanningSchema),
    defaultValues: {
      anatomyType: [] as string[],
      scanningMethod: "",
      privacyLevel: "maximum",
      languagePreference: "en",
      culturalTerminology: "",
    },
  });

  const anatomyTypes = [
    {
      id: "penis",
      label: "Penis/External",
      description: "External anatomy scanning for TriSex Perfect Protection (external)",
      scanPoints: ["Length", "Girth at base", "Girth at mid-shaft", "Girth at head", "Curvature", "Surface texture"],
      languages: ["English", "Spanish", "French", "Mandarin", "Arabic", "Swahili", "Cherokee", "Navajo"]
    },
    {
      id: "vagina",
      label: "Vaginal",
      description: "Internal anatomy scanning for TriSex Perfect Protection (internal)",
      scanPoints: ["Depth", "Width at entrance", "Width at mid-point", "Cervical position", "Muscle tone", "Sensitivity mapping"],
      languages: ["English", "Spanish", "Portuguese", "Hindi", "Tagalog", "Lakota", "Cree", "Inuktitut"]
    },
    {
      id: "anus",
      label: "Anal",
      description: "Anal anatomy scanning for specialized protection",
      scanPoints: ["Sphincter diameter", "Canal depth", "Muscle tension", "Sensitivity zones", "Texture mapping"],
      languages: ["English", "French", "German", "Russian", "Japanese", "Ojibwe", "Mohawk", "Quechua"]
    },
    {
      id: "front_hole",
      label: "Front Hole",
      description: "Inclusive anatomy scanning with respectful terminology",
      scanPoints: ["Custom measurements", "Comfort zones", "Texture preferences", "Sensitivity mapping"],
      languages: ["English", "Spanish", "ASL", "Michif", "Haida", "Tlingit", "Māori", "Hawaiian"]
    },
    {
      id: "multi_anatomy",
      label: "Multi-Anatomy",
      description: "Comprehensive scanning for intersex and transgender bodies",
      scanPoints: ["All relevant measurements", "Multi-zone mapping", "Comfort preferences", "Custom configurations"],
      languages: ["English", "Spanish", "French", "German", "Mandarin", "Cherokee", "Navajo", "Cree"]
    }
  ];

  const scanningMethods = [
    {
      id: "photogrammetry",
      label: "3D Photogrammetry",
      description: "Multiple photos processed into 3D model",
      accuracy: "Method-dependent; pending validation",
      status: "Not operational yet",
      privacy: "Local processing",
      equipment: "Smartphone camera"
    },
    {
      id: "structured_light",
      label: "Structured Light Scanning",
      description: "Professional-grade 3D scanning",
      accuracy: "Hardware-dependent; pending validation",
      status: "Not operational yet",
      privacy: "Clinic-based",
      equipment: "Clinical scanner"
    },
    {
      id: "ultrasound",
      label: "Medical Ultrasound",
      description: "Internal anatomy mapping via ultrasound",
      accuracy: "Operator-dependent; pending validation",
      status: "Not operational yet",
      privacy: "Medical standard",
      equipment: "Medical ultrasound"
    },
    {
      id: "manual_measurement",
      label: "Guided Manual Measurement",
      description: "Self-measurement with guided instructions",
      accuracy: "User-dependent; pending validation",
      status: "Not operational yet",
      privacy: "Completely private",
      equipment: "Measurement tools"
    }
  ];

  const nativeLanguages = [
    { code: "chr", name: "Cherokee (ᏣᎳᎩ)", family: "Iroquoian", speakers: 2000 },
    { code: "nav", name: "Navajo (Diné bizaad)", family: "Na-Dené", speakers: 170000 },
    { code: "lak", name: "Lakota", family: "Siouan", speakers: 2000 },
    { code: "cre", name: "Cree (ᓀᐦᐃᔭᐍᐏᐣ)", family: "Algonquian", speakers: 117000 },
    { code: "oji", name: "Ojibwe (ᐊᓂᔑᓈᐯᒧᐎᓐ)", family: "Algonquian", speakers: 90000 },
    { code: "moh", name: "Mohawk (Kanienʼkéha)", family: "Iroquoian", speakers: 3500 },
    { code: "iku", name: "Inuktitut (ᐃᓄᒃᑎᑐᑦ)", family: "Eskimo-Aleut", speakers: 40000 },
    { code: "hai", name: "Haida (X̱aad kíl)", family: "Language isolate", speakers: 20 },
    { code: "tli", name: "Tlingit (Lingít)", family: "Na-Dené", speakers: 200 },
    { code: "mic", name: "Michif", family: "Mixed language", speakers: 1000 }
  ];

  const startScanning = async () => {
    setIsScanning(true);
    setScanProgress(0);

    // Live 3D capture is not operational yet. To stay honest we never fabricate,
    // estimate, or store measurements — this flow generates no anatomical data.
    const steps = [
      { progress: 33, message: "Preparing a local, on-device scan environment..." },
      { progress: 66, message: "Live 3D capture is not operational yet..." },
      { progress: 100, message: "No measurements generated — nothing is fabricated." },
    ];

    for (const step of steps) {
      await new Promise(resolve => setTimeout(resolve, 1200));
      setScanProgress(step.progress);

      if (step.progress === 100) {
        setScanData({ captured: false });
        setScanningStep(4);
        toast({
          title: "Scan prototype",
          description: "Live 3D capture isn't available yet, so no measurements were generated.",
        });
      }
    }

    setIsScanning(false);
  };

  const onSubmit = (data: any) => {
    console.log("Scanning configuration:", data);
    setScanningStep(3);
  };

  return (
    <div className="min-h-screen bg-background text-foreground py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Intersex Healthcare Affirmation */}
        <Alert className="mb-8 bg-white dark:bg-gray-950 border-2 border-black dark:border-white">
          <Heart className="h-5 w-5 text-black dark:text-white" />
          <AlertDescription className="ml-2 text-black dark:text-white">
            <strong>Intersex Healthcare IS Everyone's Affirmation:</strong> 3D anatomy scanning uses intersex anatomy as the universal baseline—trans, non-binary, genderqueer, and quare embodiment are all respected within this participatory budgeting framework. There is no separate "transgender healthcare" category—TriSex Perfect Protection serves ALL bodies by design.
          </AlertDescription>
        </Alert>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-neon-pink rounded-xl flex items-center justify-center mr-4">
              <Scan className="h-8 w-8 text-black" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground">
                <span className="text-neon-pink">3D Anatomy Scanning</span>
              </h1>
              <p className="text-xl text-muted-foreground mt-2">
                Advanced Measurement Technology for Perfect Fit
              </p>
            </div>
          </div>
          
          <div className="flex justify-center space-x-4">
            <Badge variant="secondary" className="bg-neon-pink text-black">
              <Lock className="w-4 h-4 mr-1" />
              Private & Secure
            </Badge>
            <Badge variant="secondary" className="bg-aquamarine text-black">
              <Languages className="w-4 h-4 mr-1" />
              Native Languages Supported
            </Badge>
            <Badge variant="secondary" className="bg-primary text-black">
              <Printer className="w-4 h-4 mr-1" />
              3D Print Ready
            </Badge>
          </div>
        </div>

        {/* Scanning Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  scanningStep >= step 
                    ? "bg-neon-pink text-black" 
                    : "bg-muted text-muted-foreground"
                }`}>
                  {scanningStep > step ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <span className="font-medium">{step}</span>
                  )}
                </div>
                {step < 4 && (
                  <div className={`w-20 h-1 mx-2 ${
                    scanningStep > step ? "bg-neon-pink" : "bg-muted"
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-sm text-muted-foreground mt-2">
            <span>Configure</span>
            <span>Privacy</span>
            <span>Scan</span>
            <span>Results</span>
          </div>
        </div>

        {/* Step 1: Configure Scanning */}
        {scanningStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Configure Your Anatomy Scan</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  
                  <FormField
                    control={form.control}
                    name="anatomyType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Anatomy Type</FormLabel>
                        <p className="text-sm text-muted-foreground -mt-1 mb-1">
                          Select all that apply — co-operators can scan more than one anatomy type.
                        </p>
                        <div className="grid md:grid-cols-2 gap-4">
                          {anatomyTypes.map((type) => {
                            const selected = (field.value ?? []).includes(type.id);
                            return (
                            <div
                              key={type.id}
                              role="checkbox"
                              aria-checked={selected}
                              data-testid={`anatomy-type-${type.id}`}
                              className={`p-4 border border-border rounded-lg cursor-pointer transition-all ${
                                selected 
                                  ? "border-neon-pink bg-neon-pink/10" 
                                  : "hover:border-neon-pink/50"
                              }`}
                              onClick={() => {
                                const current = field.value ?? [];
                                field.onChange(
                                  selected
                                    ? current.filter((id: string) => id !== type.id)
                                    : [...current, type.id]
                                );
                              }}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-medium">{type.label}</h4>
                                {selected && (
                                  <CheckCircle className="h-5 w-5 text-neon-pink" />
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground mb-3">{type.description}</p>
                              <div className="space-y-1">
                                <h5 className="text-xs font-medium">Measurement Points:</h5>
                                <div className="flex flex-wrap gap-1">
                                  {type.scanPoints.slice(0, 3).map((point, idx) => (
                                    <Badge key={idx} variant="outline" className="text-xs">
                                      {point}
                                    </Badge>
                                  ))}
                                  {type.scanPoints.length > 3 && (
                                    <Badge variant="outline" className="text-xs">
                                      +{type.scanPoints.length - 3} more
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                            );
                          })}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="scanningMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Scanning Method</FormLabel>
                        <div className="grid md:grid-cols-2 gap-4">
                          {scanningMethods.map((method) => (
                            <div
                              key={method.id}
                              className={`p-4 border border-border rounded-lg cursor-pointer transition-all ${
                                field.value === method.id 
                                  ? "border-aquamarine bg-aquamarine/10" 
                                  : "hover:border-aquamarine/50"
                              }`}
                              onClick={() => field.onChange(method.id)}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-medium">{method.label}</h4>
                                {field.value === method.id && (
                                  <CheckCircle className="h-5 w-5 text-aquamarine" />
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground mb-3">{method.description}</p>
                              <div className="grid grid-cols-2 gap-2 text-xs">
                                <div>
                                  <span className="text-muted-foreground">Accuracy:</span>
                                  <span className="ml-1 font-medium">{method.accuracy}</span>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Status:</span>
                                  <span className="ml-1 font-medium">{method.status}</span>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Privacy:</span>
                                  <span className="ml-1 font-medium">{method.privacy}</span>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Equipment:</span>
                                  <span className="ml-1 font-medium">{method.equipment}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="languagePreference"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Language Preference</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select language" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="en">English</SelectItem>
                              <SelectItem value="es">Español</SelectItem>
                              <SelectItem value="fr">Français</SelectItem>
                              <SelectItem value="de">Deutsch</SelectItem>
                              <SelectItem value="zh">中文</SelectItem>
                              <SelectItem value="ja">日本語</SelectItem>
                              <SelectItem value="ar">العربية</SelectItem>
                              <SelectItem value="pt">Português</SelectItem>
                              <SelectItem value="hi">हिन्दी</SelectItem>
                              <SelectItem value="ru">Русский</SelectItem>
                              {nativeLanguages.map((lang) => (
                                <SelectItem key={lang.code} value={lang.code}>
                                  {lang.name} ({lang.speakers.toLocaleString()} speakers)
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="privacyLevel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Privacy Level</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select privacy level" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="maximum">Maximum - Local processing only</SelectItem>
                              <SelectItem value="high">High - Encrypted cloud processing</SelectItem>
                              <SelectItem value="standard">Standard - Secure healthcare protocols</SelectItem>
                              <SelectItem value="research">Research - Anonymous data contribution</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-neon-pink hover:bg-neon-pink/90 text-black"
                  >
                    Continue to Privacy Settings
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Privacy Settings */}
        {scanningStep === 2 && (
          <div className="space-y-6">
            <Card className="bg-white dark:bg-gray-950 border-2 border-black dark:border-white">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-purple-500 rounded-xl">
                    <Lock className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Privacy & Security Settings</h2>
                    <p className="text-muted-foreground">
                      Configure your data protection preferences. Your anatomical data is always 
                      encrypted and processed locally. You maintain complete control over your information.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="encryption" className="w-full">
              <TabsList className="grid grid-cols-5 mb-6">
                <TabsTrigger value="encryption">Encryption</TabsTrigger>
                <TabsTrigger value="storage">Data Storage</TabsTrigger>
                <TabsTrigger value="sharing">Sharing</TabsTrigger>
                <TabsTrigger value="consent">Consent</TabsTrigger>
                <TabsTrigger value="cultural">Cultural</TabsTrigger>
              </TabsList>

              <TabsContent value="encryption">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Lock className="h-5 w-5 text-green-600" />
                        Choose Your Encryption Methods
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <Alert className="bg-purple-50 dark:bg-purple-900/20 border-purple-200">
                        <Lock className="h-4 w-4 text-purple-600" />
                        <AlertDescription>
                          You have full control over how your data is encrypted. Choose the algorithms 
                          and key lengths that meet your security requirements. All options provide 
                          strong protection - advanced options are available for those with specific needs.
                        </AlertDescription>
                      </Alert>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <h4 className="font-semibold flex items-center gap-2">
                            <Lock className="h-4 w-4 text-blue-600" />
                            Symmetric Encryption (Data at Rest)
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            Choose how your scan data, product specifications, and monitoring data are encrypted when stored.
                          </p>
                          <div className="space-y-2">
                            {[
                              { algo: "AES-256-GCM", desc: "Industry standard, NIST approved", strength: "256-bit", recommended: true, selected: true },
                              { algo: "AES-256-CBC", desc: "Classic AES with cipher block chaining", strength: "256-bit", recommended: false, selected: false },
                              { algo: "ChaCha20-Poly1305", desc: "Modern, fast on mobile devices", strength: "256-bit", recommended: true, selected: false },
                              { algo: "Twofish", desc: "AES finalist, open source", strength: "256-bit", recommended: false, selected: false },
                              { algo: "Serpent", desc: "Conservative security margin", strength: "256-bit", recommended: false, selected: false },
                              { algo: "Camellia", desc: "ISO/IEC 18033-3 standard", strength: "256-bit", recommended: false, selected: false }
                            ].map((item, i) => (
                              <div key={i} className={`p-3 rounded-lg border cursor-pointer transition-all ${item.selected ? "border-green-500 bg-green-50 dark:bg-green-900/20" : "border-muted hover:border-green-300"}`}>
                                <div className="flex justify-between items-center">
                                  <div className="flex items-center gap-2">
                                    <input type="radio" name="symmetric" defaultChecked={item.selected} className="h-4 w-4" />
                                    <div>
                                      <span className="font-medium text-sm">{item.algo}</span>
                                      {item.recommended && <Badge className="ml-2 bg-blue-500 text-white text-xs">Recommended</Badge>}
                                    </div>
                                  </div>
                                  <Badge variant="outline">{item.strength}</Badge>
                                </div>
                                <p className="text-xs text-muted-foreground ml-6 mt-1">{item.desc}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h4 className="font-semibold flex items-center gap-2">
                            <Lock className="h-4 w-4 text-purple-600" />
                            Asymmetric Encryption (Key Exchange)
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            Choose how encryption keys are exchanged securely between your device and trusted parties.
                          </p>
                          <div className="space-y-2">
                            {[
                              { algo: "ECDH P-384", desc: "Elliptic curve Diffie-Hellman", strength: "384-bit", recommended: true, selected: true },
                              { algo: "ECDH P-521", desc: "Maximum elliptic curve security", strength: "521-bit", recommended: false, selected: false },
                              { algo: "X25519", desc: "Modern, constant-time implementation", strength: "255-bit", recommended: true, selected: false },
                              { algo: "RSA-4096", desc: "Traditional RSA encryption", strength: "4096-bit", recommended: false, selected: false },
                              { algo: "Curve448", desc: "High-security elliptic curve", strength: "448-bit", recommended: false, selected: false },
                              { algo: "Kyber-1024", desc: "Post-quantum resistant (experimental)", strength: "256-bit PQ", recommended: false, selected: false }
                            ].map((item, i) => (
                              <div key={i} className={`p-3 rounded-lg border cursor-pointer transition-all ${item.selected ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20" : "border-muted hover:border-purple-300"}`}>
                                <div className="flex justify-between items-center">
                                  <div className="flex items-center gap-2">
                                    <input type="radio" name="asymmetric" defaultChecked={item.selected} className="h-4 w-4" />
                                    <div>
                                      <span className="font-medium text-sm">{item.algo}</span>
                                      {item.recommended && <Badge className="ml-2 bg-purple-500 text-white text-xs">Recommended</Badge>}
                                    </div>
                                  </div>
                                  <Badge variant="outline">{item.strength}</Badge>
                                </div>
                                <p className="text-xs text-muted-foreground ml-6 mt-1">{item.desc}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Eye className="h-5 w-5 text-amber-600" />
                        Hash Functions & Integrity Verification
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-3 gap-4">
                        {[
                          { algo: "SHA-256", desc: "NIST standard, widely compatible", strength: "256-bit", use: "General hashing", selected: true },
                          { algo: "SHA-384", desc: "Higher security variant", strength: "384-bit", use: "Sensitive data", selected: false },
                          { algo: "SHA-512", desc: "Maximum SHA-2 security", strength: "512-bit", use: "Critical data", selected: false },
                          { algo: "BLAKE2b", desc: "Faster than SHA, equally secure", strength: "512-bit", use: "High performance", selected: false },
                          { algo: "BLAKE3", desc: "Newest, fastest secure hash", strength: "256-bit", use: "Modern systems", selected: false },
                          { algo: "SHA3-256", desc: "Post-SHA-2 NIST standard", strength: "256-bit", use: "Future-proof", selected: false }
                        ].map((item, i) => (
                          <div key={i} className={`p-3 rounded-lg border cursor-pointer transition-all ${item.selected ? "border-amber-500 bg-amber-50 dark:bg-amber-900/20" : "border-muted hover:border-amber-300"}`}>
                            <div className="flex items-center gap-2 mb-2">
                              <input type="radio" name="hash" defaultChecked={item.selected} className="h-4 w-4" />
                              <span className="font-medium text-sm">{item.algo}</span>
                            </div>
                            <p className="text-xs text-muted-foreground mb-2">{item.desc}</p>
                            <div className="flex justify-between">
                              <Badge variant="outline" className="text-xs">{item.strength}</Badge>
                              <Badge variant="secondary" className="text-xs">{item.use}</Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Globe className="h-5 w-5 text-cyan-600" />
                        Transport Layer Security
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <h4 className="font-semibold">TLS Version</h4>
                          <div className="space-y-2">
                            {[
                              { version: "TLS 1.3", desc: "Latest, fastest, most secure", status: "Recommended", selected: true },
                              { version: "TLS 1.2", desc: "Wide compatibility", status: "Supported", selected: false }
                            ].map((item, i) => (
                              <div key={i} className={`p-3 rounded-lg border ${item.selected ? "border-cyan-500 bg-cyan-50 dark:bg-cyan-900/20" : "border-muted"}`}>
                                <div className="flex justify-between items-center">
                                  <div className="flex items-center gap-2">
                                    <input type="radio" name="tls" defaultChecked={item.selected} className="h-4 w-4" />
                                    <span className="font-medium">{item.version}</span>
                                  </div>
                                  <Badge variant={item.selected ? "default" : "secondary"}>{item.status}</Badge>
                                </div>
                                <p className="text-xs text-muted-foreground ml-6">{item.desc}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-4">
                          <h4 className="font-semibold">Cipher Suite Preference</h4>
                          <div className="space-y-2">
                            {[
                              { suite: "TLS_AES_256_GCM_SHA384", desc: "Maximum security", selected: true },
                              { suite: "TLS_CHACHA20_POLY1305_SHA256", desc: "Mobile optimized", selected: false },
                              { suite: "TLS_AES_128_GCM_SHA256", desc: "Balanced performance", selected: false }
                            ].map((item, i) => (
                              <div key={i} className="flex items-center gap-2 p-2 bg-muted/30 rounded">
                                <input type="checkbox" defaultChecked={item.selected} className="h-4 w-4" />
                                <div>
                                  <span className="font-mono text-xs">{item.suite}</span>
                                  <span className="text-xs text-muted-foreground ml-2">({item.desc})</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Lock className="h-5 w-5 text-red-600" />
                        Data-Specific Encryption Settings
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                          Customize encryption for each type of data. Different data types may have different security requirements.
                        </p>
                        <div className="space-y-3">
                          {[
                            { data: "Anatomical Scan Data", current: "AES-256-GCM", options: ["AES-256-GCM", "ChaCha20-Poly1305", "Twofish"], sensitivity: "Critical" },
                            { data: "Product Specifications", current: "AES-256-GCM", options: ["AES-256-GCM", "AES-256-CBC", "Camellia"], sensitivity: "High" },
                            { data: "3D Model Files", current: "ChaCha20-Poly1305", options: ["ChaCha20-Poly1305", "AES-256-GCM", "Serpent"], sensitivity: "High" },
                            { data: "Order History", current: "AES-256-CBC", options: ["AES-256-CBC", "AES-256-GCM", "Twofish"], sensitivity: "Medium" },
                            { data: "STI Monitoring Data", current: "AES-256-GCM", options: ["AES-256-GCM", "ChaCha20-Poly1305", "Serpent"], sensitivity: "Critical" },
                            { data: "Health Outcomes Tracking", current: "AES-256-GCM", options: ["AES-256-GCM", "ChaCha20-Poly1305", "Twofish"], sensitivity: "Critical" },
                            { data: "EHR Sync Data", current: "AES-256-GCM", options: ["AES-256-GCM", "ChaCha20-Poly1305"], sensitivity: "Critical" },
                            { data: "Partner Communications", current: "ChaCha20-Poly1305", options: ["ChaCha20-Poly1305", "AES-256-GCM"], sensitivity: "High" }
                          ].map((item, i) => (
                            <div key={i} className="p-4 border rounded-lg">
                              <div className="flex justify-between items-center mb-2">
                                <div className="flex items-center gap-2">
                                  <Lock className="h-4 w-4 text-muted-foreground" />
                                  <span className="font-medium">{item.data}</span>
                                </div>
                                <Badge className={
                                  item.sensitivity === "Critical" ? "bg-red-500 text-white" :
                                  item.sensitivity === "High" ? "bg-orange-500 text-white" :
                                  "bg-yellow-500 text-black"
                                }>
                                  {item.sensitivity}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-4">
                                <Select defaultValue={item.current}>
                                  <SelectTrigger className="w-48">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {item.options.map((opt, j) => (
                                      <SelectItem key={j} value={opt}>{opt}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <span className="text-xs text-muted-foreground">Currently: {item.current}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-green-50 dark:bg-green-900/20 border-green-200">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <CheckCircle className="h-6 w-6 text-green-600 mt-1" />
                        <div>
                          <h4 className="font-semibold mb-2">Current Encryption Configuration</h4>
                          <div className="grid md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Symmetric:</span>
                              <div className="font-medium">AES-256-GCM</div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Key Exchange:</span>
                              <div className="font-medium">ECDH P-384</div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Hash:</span>
                              <div className="font-medium">SHA-256</div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Transport:</span>
                              <div className="font-medium">TLS 1.3</div>
                            </div>
                          </div>
                          <Button className="mt-4" size="sm">
                            <Lock className="h-4 w-4 mr-2" />
                            Apply Encryption Settings
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="storage">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Download className="h-5 w-5 text-blue-600" />
                      Data Storage & Retention
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-3 gap-4">
                      {[
                        { title: "Scan Images", retention: "Deleted Immediately", location: "Device Only", icon: Camera },
                        { title: "3D Model", retention: "Until Printing Complete", location: "Local + Encrypted Cloud", icon: Scan },
                        { title: "Measurements", retention: "30 Days (Optional)", location: "Encrypted Vault", icon: Lock },
                        { title: "Printing Specs", retention: "Until Delivery", location: "Manufacturing Partner", icon: Printer },
                        { title: "Order History", retention: "Your Choice", location: "Your Account", icon: CheckCircle },
                        { title: "Analytics", retention: "Never Collected", location: "N/A", icon: Eye }
                      ].map((item, i) => (
                        <Card key={i} className="border-t-4 border-t-blue-500">
                          <CardContent className="p-4">
                            <item.icon className="h-6 w-6 text-blue-600 mb-2" />
                            <div className="font-semibold text-sm mb-1">{item.title}</div>
                            <div className="text-xs text-muted-foreground mb-1">
                              <span className="font-medium">Retention:</span> {item.retention}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              <span className="font-medium">Location:</span> {item.location}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-blue-600" />
                        Data Deletion Options
                      </h4>
                      <div className="grid md:grid-cols-3 gap-4">
                        <Button variant="outline" size="sm">
                          <EyeOff className="h-4 w-4 mr-2" />
                          Delete After Print
                        </Button>
                        <Button variant="outline" size="sm">
                          <Lock className="h-4 w-4 mr-2" />
                          Keep in Vault
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600 border-red-300">
                          <AlertTriangle className="h-4 w-4 mr-2" />
                          Delete All Now
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="sharing">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="h-5 w-5 text-purple-600" />
                      Data Sharing Preferences
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="font-semibold">Sharing Controls</h4>
                        {[
                          { partner: "3D Printing Partner", purpose: "Manufacturing only", status: "Required", editable: false },
                          { partner: "Healthcare Provider", purpose: "TriSex Perfect Protection records", status: "Optional", editable: true },
                          { partner: "Partner/Spouse", purpose: "Shared ordering", status: "Disabled", editable: true },
                          { partner: "Research (Anonymous)", purpose: "Size analytics", status: "Disabled", editable: true },
                          { partner: "Quality Assurance", purpose: "Product improvement", status: "Enabled", editable: true }
                        ].map((share, i) => (
                          <div key={i} className="p-3 bg-muted/30 rounded-lg flex justify-between items-center">
                            <div>
                              <div className="font-medium text-sm">{share.partner}</div>
                              <div className="text-xs text-muted-foreground">{share.purpose}</div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant={share.status === "Required" ? "default" : share.status === "Enabled" ? "secondary" : "outline"}>
                                {share.status}
                              </Badge>
                              {share.editable && (
                                <Button size="sm" variant="ghost" className="h-6 px-2">
                                  Edit
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="space-y-4">
                        <h4 className="font-semibold">Connected Accounts</h4>
                        {[
                          { account: "TriSex.org Account", connected: true, syncs: "Product orders, preferences" },
                          { account: "Healthcare Portal (Epic/MyChart)", connected: false, syncs: "Medical records" },
                          { account: "Apple Health", connected: false, syncs: "Health data" }
                        ].map((acc, i) => (
                          <div key={i} className="p-3 bg-muted/30 rounded-lg">
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-medium text-sm">{acc.account}</span>
                              <Badge variant={acc.connected ? "default" : "outline"}>
                                {acc.connected ? "Connected" : "Not Connected"}
                              </Badge>
                            </div>
                            <div className="text-xs text-muted-foreground">{acc.syncs}</div>
                          </div>
                        ))}
                        <Button variant="outline" size="sm" className="w-full">
                          Manage Connected Accounts
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="consent">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      Consent Management
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      {[
                        { 
                          consent: "Anatomical Scanning Consent", 
                          desc: "I consent to having my anatomy scanned for custom product creation",
                          required: true,
                          granted: true
                        },
                        { 
                          consent: "Data Processing Consent", 
                          desc: "I consent to encrypted processing of my scan data",
                          required: true,
                          granted: true
                        },
                        { 
                          consent: "Manufacturing Partner Sharing", 
                          desc: "I consent to sharing encrypted specifications with printing partners",
                          required: true,
                          granted: true
                        },
                        { 
                          consent: "Product Improvement Research", 
                          desc: "I consent to anonymized data use for product improvement",
                          required: false,
                          granted: false
                        },
                        { 
                          consent: "Marketing Communications", 
                          desc: "I consent to receiving updates about new products and features",
                          required: false,
                          granted: false
                        },
                        { 
                          consent: "Third-Party Research", 
                          desc: "I consent to anonymized data sharing with academic researchers",
                          required: false,
                          granted: false
                        }
                      ].map((item, i) => (
                        <div key={i} className="p-4 border rounded-lg flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium">{item.consent}</span>
                              {item.required && <Badge variant="outline" className="text-xs">Required</Badge>}
                            </div>
                            <p className="text-sm text-muted-foreground">{item.desc}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            {item.granted ? (
                              <Badge className="bg-green-500 text-white">Granted</Badge>
                            ) : (
                              <Badge variant="outline">Not Granted</Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <Card className="bg-green-50 dark:bg-green-900/20 border-green-200">
                        <CardContent className="p-4">
                          <h4 className="font-semibold mb-2 flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            Your Rights
                          </h4>
                          <ul className="text-sm space-y-1 text-muted-foreground">
                            <li>• Right to access your data</li>
                            <li>• Right to data portability</li>
                            <li>• Right to erasure ("right to be forgotten")</li>
                            <li>• Right to withdraw consent</li>
                            <li>• Right to lodge complaints</li>
                          </ul>
                        </CardContent>
                      </Card>
                      <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200">
                        <CardContent className="p-4">
                          <h4 className="font-semibold mb-2 flex items-center gap-2">
                            <Lock className="h-4 w-4 text-blue-600" />
                            Compliance
                          </h4>
                          <ul className="text-sm space-y-1 text-muted-foreground">
                            <li>• HIPAA (US Healthcare)</li>
                            <li>• GDPR (European Union)</li>
                            <li>• PIPEDA (Canada)</li>
                            <li>• CCPA (California)</li>
                            <li>• Indigenous Data Sovereignty</li>
                          </ul>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="cultural">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Languages className="h-5 w-5 text-amber-600" />
                      Cultural & Language Preferences
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="font-semibold">Anatomical Terminology</h4>
                        <p className="text-sm text-muted-foreground mb-4">
                          Choose how anatomical terms appear throughout your experience. 
                          We respect diverse cultural and personal preferences.
                        </p>
                        {[
                          { term: "Medical/Clinical", desc: "Standard medical terminology" },
                          { term: "Inclusive/Gender-Neutral", desc: "Gender-affirming language" },
                          { term: "Traditional/Cultural", desc: "Cultural community terms" },
                          { term: "Custom Preferences", desc: "Define your own terms" }
                        ].map((pref, i) => (
                          <div key={i} className="p-3 bg-muted/30 rounded-lg flex justify-between items-center">
                            <div>
                              <div className="font-medium text-sm">{pref.term}</div>
                              <div className="text-xs text-muted-foreground">{pref.desc}</div>
                            </div>
                            <input type="radio" name="terminology" className="h-4 w-4" defaultChecked={i === 1} />
                          </div>
                        ))}
                      </div>
                      <div className="space-y-4">
                        <h4 className="font-semibold">Indigenous Language Support</h4>
                        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 mb-4">
                          <p className="text-sm">
                            TriSex.org partners with Indigenous language preservation initiatives 
                            to provide culturally appropriate translations and terminology.
                          </p>
                        </div>
                        <div className="space-y-2">
                          {nativeLanguages.slice(0, 6).map((lang, i) => (
                            <div key={i} className="p-2 bg-muted/30 rounded flex justify-between items-center">
                              <div>
                                <span className="font-medium text-sm">{lang.name}</span>
                                <div className="text-xs text-muted-foreground">{lang.family} • {lang.speakers.toLocaleString()} speakers</div>
                              </div>
                              <Badge variant="outline">Available</Badge>
                            </div>
                          ))}
                        </div>
                        <Button variant="outline" size="sm" className="w-full">
                          View All Languages ({nativeLanguages.length}+)
                        </Button>
                      </div>
                    </div>
                    <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Heart className="h-4 w-4 text-purple-600" />
                        Cultural Safety Commitment
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        We recognize that anatomical language carries cultural significance. Our platform 
                        was developed in consultation with Indigenous communities, Two-Spirit elders, 
                        transgender advocates, and intersex organizations to ensure respectful, 
                        accurate, and affirming terminology across all cultures.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <div className="flex space-x-4">
              <Button 
                variant="outline" 
                onClick={() => setScanningStep(1)}
              >
                Back to Configuration
              </Button>
              <Button 
                onClick={() => setScanningStep(3)}
                className="flex-1 bg-neon-pink hover:bg-neon-pink/90 text-black"
              >
                Accept Privacy Terms & Start Scanning
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Scanning Process */}
        {scanningStep === 3 && (
          <div className="space-y-6">
            <Card className="bg-gradient-to-r from-cyan-50 to-teal-50 dark:from-cyan-900/20 dark:to-teal-900/20 border-cyan-200">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-cyan-500 rounded-xl">
                    <Scan className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold mb-2">3D Anatomy Scanning</h2>
                    <p className="text-muted-foreground">
                      Live 3D capture is not operational yet. When it is, processing will happen 
                      locally on your device. Until then this flow generates no measurements.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {!isScanning ? (
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Camera className="h-5 w-5 text-cyan-600" />
                      Scanning Instructions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center mb-6">
                      <div className="w-24 h-24 bg-cyan-100 dark:bg-cyan-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Camera className="h-12 w-12 text-cyan-600" />
                      </div>
                      <h3 className="text-lg font-semibold">Prepare Your Device</h3>
                    </div>
                    <div className="space-y-3">
                      {[
                        { step: 1, instruction: "Ensure good lighting - natural daylight is best", icon: Eye },
                        { step: 2, instruction: "Position the device in front of the anatomy", icon: Smartphone },
                        { step: 3, instruction: "Hold steady while scanning runs", icon: Scan },
                        { step: 4, instruction: "Follow on-screen positioning guides", icon: CheckCircle },
                        { step: 5, instruction: "Review captured data before confirmation", icon: Lock }
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                          <div className="w-8 h-8 bg-cyan-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                            {item.step}
                          </div>
                          <item.icon className="h-5 w-5 text-cyan-600" />
                          <span className="text-sm">{item.instruction}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lock className="h-5 w-5 text-green-600" />
                      Scan Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="h-5 w-5 text-amber-600" />
                        <span className="font-semibold">Live scanning not operational yet</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        We don't fabricate measurements. Until on-device 3D capture is available, 
                        this step won't produce any anatomical data. You can still walk through the 
                        flow to see exactly what a real scan would measure.
                      </p>
                    </div>
                    <Button 
                      onClick={startScanning}
                      className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-3"
                    >
                      <Zap className="mr-2 h-5 w-5" />
                      Begin 3D Scanning
                    </Button>
                  </CardContent>
                </Card>

                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Smartphone className="h-5 w-5 text-purple-600" />
                      Supported Scanning Methods
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-4 gap-4">
                      {[
                        { method: "Smartphone Camera", desc: "iOS 14+ or Android 10+" },
                        { method: "Tablet Scanner", desc: "iPad Pro LiDAR" },
                        { method: "Clinical Scanner", desc: "Partner clinic network" },
                        { method: "Manual Entry", desc: "Guided self-measurement" }
                      ].map((item, i) => (
                        <Card key={i} className="border-t-4 border-t-gray-300">
                          <CardContent className="p-4 text-center">
                            <Smartphone className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                            <div className="font-semibold text-sm mb-1">{item.method}</div>
                            <div className="text-xs text-muted-foreground mb-2">{item.desc}</div>
                            <div className="flex justify-center gap-2">
                              <Badge variant="outline" className="text-xs">Not operational yet</Badge>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="p-8">
                  <div className="text-center space-y-6">
                    <div className="w-32 h-32 bg-cyan-100 dark:bg-cyan-900/30 rounded-full flex items-center justify-center mx-auto animate-pulse">
                      <Scan className="h-16 w-16 text-cyan-600" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold mb-2">Checking Scan Availability</h3>
                      <p className="text-muted-foreground">No anatomical data is being captured</p>
                    </div>
                    <div className="max-w-md mx-auto space-y-4">
                      <Progress value={scanProgress} className="h-4" />
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-bold text-cyan-600">{scanProgress}%</span>
                      </div>
                    </div>
                    <div className="grid md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                      {[
                        { phase: "Initialize", icon: Lock, complete: scanProgress >= 20 },
                        { phase: "Capture", icon: Camera, complete: scanProgress >= 40 },
                        { phase: "Process", icon: Scan, complete: scanProgress >= 60 },
                        { phase: "Validate", icon: CheckCircle, complete: scanProgress >= 80 },
                        { phase: "Generate", icon: Printer, complete: scanProgress >= 95 },
                        { phase: "Complete", icon: Download, complete: scanProgress >= 100 }
                      ].map((phase, i) => (
                        <div key={i} className={`p-3 rounded-lg border ${phase.complete ? "bg-green-50 dark:bg-green-900/20 border-green-200" : "bg-muted/30 border-muted"}`}>
                          <phase.icon className={`h-6 w-6 mx-auto mb-1 ${phase.complete ? "text-green-600" : "text-muted-foreground"}`} />
                          <div className={`text-xs font-medium ${phase.complete ? "text-green-700" : "text-muted-foreground"}`}>
                            {phase.phase}
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground max-w-md mx-auto">
                      {scanProgress < 66 && "Preparing a local, on-device scan environment..."}
                      {scanProgress >= 66 && scanProgress < 100 && "Live 3D capture is not operational yet..."}
                      {scanProgress === 100 && "No measurements were generated — this prototype does not fabricate data."}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex space-x-4">
              <Button 
                variant="outline" 
                onClick={() => setScanningStep(2)}
                disabled={isScanning}
              >
                Back to Privacy Settings
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Scan Results */}
        {scanningStep === 4 && scanData && (
          <div className="space-y-6">
            <Card className="bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-300 dark:border-amber-700">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-amber-500 rounded-xl">
                    <AlertTriangle className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold mb-2">No Measurements Generated</h2>
                    <p className="text-muted-foreground">
                      Live 3D anatomy capture is not operational yet, so this prototype does not 
                      fabricate, estimate, or store any body measurements. When real scanning is 
                      available, your data will be processed locally and shown here — nothing is 
                      invented in the meantime.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="results" className="w-full">
              <TabsList className="grid grid-cols-5 mb-6">
                <TabsTrigger value="results">Scan Results</TabsTrigger>
                <TabsTrigger value="ehr">EHR Integration</TabsTrigger>
                <TabsTrigger value="sti">STI Tracking</TabsTrigger>
                <TabsTrigger value="3d-models">3D Models</TabsTrigger>
                <TabsTrigger value="printing">3D Printing</TabsTrigger>
              </TabsList>

              <TabsContent value="results">
                <div className="space-y-6">
                  <div className="grid md:grid-cols-4 gap-4">
                    <Card className="border-t-4 border-t-muted">
                      <CardContent className="p-4 text-center">
                        <div className="text-3xl font-bold text-muted-foreground mb-1">—</div>
                        <div className="text-sm text-muted-foreground">Primary Dimension</div>
                      </CardContent>
                    </Card>
                    <Card className="border-t-4 border-t-muted">
                      <CardContent className="p-4 text-center">
                        <div className="text-3xl font-bold text-muted-foreground mb-1">—</div>
                        <div className="text-sm text-muted-foreground">Secondary Dimension</div>
                      </CardContent>
                    </Card>
                    <Card className="border-t-4 border-t-muted">
                      <CardContent className="p-4 text-center">
                        <div className="text-3xl font-bold text-muted-foreground mb-1">—</div>
                        <div className="text-sm text-muted-foreground">Tertiary Dimension</div>
                      </CardContent>
                    </Card>
                    <Card className="border-t-4 border-t-muted">
                      <CardContent className="p-4 text-center">
                        <div className="text-3xl font-bold text-muted-foreground mb-1">—</div>
                        <div className="text-sm text-muted-foreground">Fit Confidence</div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          Measurement Details
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {[
                          { metric: "Length (relaxed)", value: "—", accuracy: "Pending" },
                          { metric: "Girth (base)", value: "—", accuracy: "Pending" },
                          { metric: "Girth (mid-shaft)", value: "—", accuracy: "Pending" },
                          { metric: "Girth (head)", value: "—", accuracy: "Pending" },
                          { metric: "Curvature angle", value: "—", accuracy: "Pending" },
                          { metric: "Surface texture", value: "—", accuracy: "Pending" }
                        ].map((item, i) => (
                          <div key={i} className="flex justify-between items-center p-2 bg-muted/30 rounded">
                            <span className="text-sm">{item.metric}</span>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{item.value}</span>
                              <Badge variant="outline" className="text-xs">{item.accuracy}</Badge>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Lock className="h-5 w-5 text-blue-600" />
                          TriSex Perfect Protection Recommendations
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {[
                          { product: "External Barrier (Standard)" },
                          { product: "External Barrier (Textured)" },
                          { product: "Internal Barrier" },
                          { product: "Oral Barrier" }
                        ].map((item, i) => (
                          <div key={i} className="p-3 bg-muted/30 rounded-lg">
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-medium text-sm">{item.product}</span>
                              <Badge variant="outline">Awaiting scan</Badge>
                            </div>
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>Size: —</span>
                              <span>Generated from a real scan only</span>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="ehr">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="h-5 w-5 text-blue-600" />
                      Electronic Health Record (EHR) Integration
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-200">
                      <Lock className="h-4 w-4 text-blue-600" />
                      <AlertDescription>
                        Sync your TriSex Perfect Protection specifications and STI testing data with your healthcare 
                        provider's electronic health records for coordinated care and healthy outcomes tracking.
                      </AlertDescription>
                    </Alert>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="font-semibold">Supported EHR Systems</h4>
                        {[
                          { system: "Epic MyChart", status: "not connected", features: "Planned integration", icon: "🏥" },
                          { system: "Cerner", status: "not connected", features: "Planned integration", icon: "🏥" },
                          { system: "Athenahealth", status: "not connected", features: "Planned integration", icon: "🏥" },
                          { system: "Allscripts", status: "not connected", features: "Planned integration", icon: "🏥" },
                          { system: "eClinicalWorks", status: "not connected", features: "Planned integration", icon: "🏥" },
                          { system: "NextGen Healthcare", status: "not connected", features: "Planned integration", icon: "🏥" }
                        ].map((ehr, i) => (
                          <div key={i} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{ehr.icon}</span>
                              <div>
                                <div className="font-medium text-sm">{ehr.system}</div>
                                <div className="text-xs text-muted-foreground">{ehr.features}</div>
                              </div>
                            </div>
                            <Badge variant={ehr.status === "connected" ? "default" : ehr.status === "available" ? "secondary" : "outline"}>
                              {ehr.status}
                            </Badge>
                          </div>
                        ))}
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-semibold">Data Sync Options</h4>
                        {[
                          { data: "TriSex Perfect Protection Specifications", sync: "Not active", privacy: "Encrypted" },
                          { data: "STI Test Results", sync: "Not active", privacy: "HIPAA Compliant" },
                          { data: "Treatment Outcomes", sync: "Not active", privacy: "Provider Access" },
                          { data: "Product Usage Analytics", sync: "Not active", privacy: "Anonymized" },
                          { data: "DALY Impact Metrics", sync: "Not active", privacy: "Aggregate Only" }
                        ].map((item, i) => (
                          <div key={i} className="p-3 bg-muted/30 rounded-lg">
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-medium text-sm">{item.data}</span>
                              <Badge variant="secondary">{item.sync}</Badge>
                            </div>
                            <div className="text-xs text-muted-foreground">Privacy: {item.privacy}</div>
                          </div>
                        ))}
                        <Button className="w-full">
                          <Globe className="h-4 w-4 mr-2" />
                          Configure EHR Sync
                        </Button>
                      </div>
                    </div>

                    <Card className="bg-green-50 dark:bg-green-900/20 border-green-200">
                      <CardContent className="p-4">
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          FHIR R4 Compliant
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          TriSex.org uses HL7 FHIR R4 standards for healthcare interoperability, 
                          ensuring seamless data exchange with any compliant EHR system. Your data 
                          remains yours - we facilitate secure sharing, never ownership.
                        </p>
                      </CardContent>
                    </Card>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="sti">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Heart className="h-5 w-5 text-red-600" />
                      STI Tracking & Healthy Outcomes
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-4 gap-4">
                      {[
                        { metric: "Days Since Last Test", value: "—", status: "good", target: "<90" },
                        { metric: "Protection Usage Rate", value: "—", status: "good", target: ">95%" },
                        { metric: "Partner Notifications", value: "—", status: "good", target: "100%" },
                        { metric: "DALY Impact Score", value: "—", status: "good", target: "Positive" }
                      ].map((item, i) => (
                        <Card key={i} className={`border-t-4 ${item.status === "excellent" || item.status === "positive" ? "border-t-green-500" : item.status === "good" ? "border-t-blue-500" : "border-t-yellow-500"}`}>
                          <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold mb-1">{item.value}</div>
                            <div className="text-xs text-muted-foreground mb-2">{item.metric}</div>
                            <Badge variant="secondary" className="text-xs">Target: {item.target}</Badge>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Recent Test Results (via MyChart)</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {([] as Array<{ test: string; result: string; date: string; source: string }>).map((item, i) => (
                            <div key={i} className="p-3 bg-muted/30 rounded-lg">
                              <div className="flex justify-between items-center mb-1">
                                <span className="font-medium text-sm">{item.test}</span>
                                <Badge className={item.result === "Negative" || item.result === "Immune" || item.result === "Not Detected" ? "bg-green-500 text-white" : "bg-yellow-500 text-black"}>
                                  {item.result}
                                </Badge>
                              </div>
                              <div className="flex justify-between text-xs text-muted-foreground">
                                <span>{item.date}</span>
                                <span>{item.source}</span>
                              </div>
                            </div>
                          ))}
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Healthy Outcomes Tracking</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="p-4 bg-muted/30 rounded-lg border border-border mb-4">
                            <div className="flex items-center gap-2 mb-2">
                              <AlertTriangle className="h-5 w-5 text-amber-600" />
                              <span className="font-semibold">No health data yet</span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Outcomes appear here once you connect real testing records. We don't 
                              assign a health status without your own data.
                            </p>
                          </div>
                          {[
                            { outcome: "Barrier Effectiveness", score: "—", trend: "stable" },
                            { outcome: "TriSex Perfect Protection Compliance", score: "—", trend: "stable" },
                            { outcome: "Partner Communication", score: "—", trend: "stable" },
                            { outcome: "Testing Adherence", score: "—", trend: "stable" }
                          ].map((item, i) => (
                            <div key={i} className="flex justify-between items-center p-2 bg-muted/30 rounded">
                              <span className="text-sm">{item.outcome}</span>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{item.score}</span>
                                <Badge variant="outline" className="text-xs">
                                  {item.trend === "up" ? "↑" : item.trend === "down" ? "↓" : "→"}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="3d-models">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Scan className="h-5 w-5 text-purple-600" />
                      Interactive 3D Anatomical Models
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <Alert className="bg-white dark:bg-gray-950 border-2 border-black dark:border-white">
                      <Heart className="h-4 w-4 text-purple-600" />
                      <AlertDescription>
                        <strong>Intersex Healthcare IS Everyone's Affirmation:</strong> These educational 3D models 
                        center intersex anatomy as the universal baseline—trans, non-binary, genderqueer, and quare 
                        embodiment are all respected within this participatory budgeting framework.
                      </AlertDescription>
                    </Alert>

                    <div className="grid lg:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Boxes className="h-5 w-5 text-purple-600" />
                            Anatomical Diversity Library
                          </CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {INTERSEX_VARIATIONS.length} named intersex variations across {INTERSEX_CATEGORIES.length} categories,
                            grounded in the platform's open Inclusive Ordering dataset. Select one to load its schematic 3D fit-form.
                          </p>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                              className="pl-8"
                              placeholder="Search variations…"
                              value={librarySearch}
                              onChange={(e) => setLibrarySearch(e.target.value)}
                              data-testid="input-library-search"
                            />
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            <Button type="button" size="sm" variant={libraryMarker === null ? "default" : "outline"} onClick={() => setLibraryMarker(null)} data-testid="button-marker-all">All</Button>
                            {ASSIGNMENT_MARKERS.map((m) => (
                              <Button key={m.id} type="button" size="sm" variant={libraryMarker === m.id ? "default" : "outline"} onClick={() => setLibraryMarker(m.id)} data-testid={`button-marker-${m.id}`}>{m.label}</Button>
                            ))}
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            <Button type="button" size="sm" variant={libraryCategory === null ? "secondary" : "ghost"} onClick={() => setLibraryCategory(null)} data-testid="button-category-all">All categories</Button>
                            {INTERSEX_CATEGORIES.map((c) => (
                              <Button key={c.id} type="button" size="sm" variant={libraryCategory === c.id ? "secondary" : "ghost"} onClick={() => setLibraryCategory(c.id)} data-testid={`button-category-${c.id}`}>{c.label}</Button>
                            ))}
                          </div>
                          <div className="text-xs text-muted-foreground" data-testid="text-library-count">{filteredVariations.length} shown</div>
                          <ScrollArea className="h-[420px] pr-3">
                            <div className="space-y-2">
                              {filteredVariations.map((v) => {
                                const markers = getAssignmentMarkers(v);
                                const selected = v.id === selectedVariationId;
                                return (
                                  <button
                                    key={v.id}
                                    type="button"
                                    onClick={() => setSelectedVariationId(v.id)}
                                    className={`w-full text-left rounded-lg border p-3 transition hover:border-purple-400 ${selected ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20" : "border-border"}`}
                                    data-testid={`button-variation-${v.id}`}
                                  >
                                    <div className="flex items-start justify-between gap-2 mb-1.5">
                                      <span className="font-medium text-sm">{v.name}</span>
                                      {v.consultRequired && <Badge variant="outline" className="text-[10px] shrink-0">Consult</Badge>}
                                    </div>
                                    <div className="flex flex-wrap gap-1">
                                      {markers.map((mk) => <Badge key={mk} variant="secondary" className="text-[10px]">{mk}</Badge>)}
                                      {v.relevantZones.map((z) => <Badge key={z} variant="outline" className="text-[10px] capitalize">{z}</Badge>)}
                                    </div>
                                  </button>
                                );
                              })}
                              {filteredVariations.length === 0 && (
                                <p className="text-sm text-muted-foreground py-6 text-center">No variations match your filters.</p>
                              )}
                            </div>
                          </ScrollArea>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg" data-testid="text-selected-variation">
                            {selectedVariation ? selectedVariation.name : "Schematic 3D Fit-Form"}
                          </CardTitle>
                          {selectedVariation && (
                            <p className="text-sm text-muted-foreground">
                              {INTERSEX_CATEGORIES.find((c) => c.id === selectedVariation.category)?.label}
                            </p>
                          )}
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <Suspense fallback={<div className="h-[360px] flex items-center justify-center rounded-lg border"><Loader2 className="h-6 w-6 animate-spin text-purple-600" /></div>}>
                            <AnatomicalModelViewer variation={selectedVariation} />
                          </Suspense>
                          {selectedVariation ? (
                            <div className="space-y-3">
                              <div>
                                <div className="text-sm font-medium mb-1">Fitting note</div>
                                <p className="text-sm text-muted-foreground">{selectedVariation.fittingNote}</p>
                              </div>
                              {selectedVariation.consultRequired && (
                                <Alert>
                                  <Info className="h-4 w-4" />
                                  <AlertDescription className="text-sm">
                                    A one-to-one fitting consult is recommended for this variation.
                                  </AlertDescription>
                                </Alert>
                              )}
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground">
                              Select a variation from the library to parameterise the fit-form with its default measurements.
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Viewer Capabilities</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {[
                            { feature: "360° rotation", desc: "Drag to orbit the model from any angle", available: true },
                            { feature: "Zoom", desc: "Scroll or pinch to zoom in and out", available: true },
                            { feature: "Layer visibility", desc: "Toggle external fit-form and receptive canal", available: true },
                            { feature: "Wireframe mode", desc: "Reveal the underlying geometry", available: true },
                            { feature: "Auto-rotate & reset", desc: "Spin the model or return to the default view", available: true },
                            { feature: "AR / VR overlay", desc: "Augmented / virtual reality viewing", available: false }
                          ].map((item, i) => (
                            <div key={i} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                              <div>
                                <span className="font-medium text-sm">{item.feature}</span>
                                <div className="text-xs text-muted-foreground">{item.desc}</div>
                              </div>
                              {item.available ? (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              ) : (
                                <Badge variant="outline" className="text-xs">Not available</Badge>
                              )}
                            </div>
                          ))}
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Educational Modules</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {[
                            { module: "Anatomy Fundamentals", level: "Beginner" },
                            { module: "Intersex Variations", level: "Intermediate" },
                            { module: "Gender-Affirming Care", level: "All Levels" },
                            { module: "Protection Fit Guide", level: "Practical" },
                            { module: "Partner Communication", level: "Essential" }
                          ].map((item, i) => (
                            <div key={i} className="p-3 bg-muted/30 rounded-lg">
                              <div className="flex justify-between items-center mb-1">
                                <span className="font-medium text-sm">{item.module}</span>
                                <Badge variant="secondary">{item.level}</Badge>
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Curriculum in development
                              </div>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    </div>

                    <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200">
                      <h4 className="font-semibold mb-2">How these models are made</h4>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <p>
                          Each fit-form is generated procedurally in your browser from the selected
                          variation's default fitting parameters — sleeve length and girth, and receptive
                          canal depth and girth — in the platform's open Inclusive Ordering dataset.
                        </p>
                        <p>
                          They are deliberately schematic: proportional envelopes for product fitting, not
                          photorealistic medical models or scans of any person.
                        </p>
                        <p>
                          The dataset and these generated forms are released under CC BY-SA 4.0. No external
                          "accuracy council" reviews them; corrections are made in the open via the dataset.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="printing">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Printer className="h-5 w-5 text-teal-600" />
                      3D Printing & Production
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-3 gap-4">
                      {[
                        { stage: "Specifications", status: "waiting", icon: Printer },
                        { stage: "Material Selection", status: "waiting", icon: Printer },
                        { stage: "Partner Selection", status: "waiting", icon: AlertTriangle },
                        { stage: "Production", status: "waiting", icon: Printer },
                        { stage: "Quality Check", status: "waiting", icon: Eye },
                        { stage: "Shipping", status: "waiting", icon: Download }
                      ].map((item, i) => (
                        <Card key={i} className={`border-t-4 ${item.status === "complete" ? "border-t-green-500" : item.status === "pending" ? "border-t-yellow-500" : "border-t-gray-300"}`}>
                          <CardContent className="p-4 text-center">
                            <item.icon className={`h-8 w-8 mx-auto mb-2 ${item.status === "complete" ? "text-green-600" : item.status === "pending" ? "text-yellow-600" : "text-gray-400"}`} />
                            <div className="font-semibold text-sm">{item.stage}</div>
                            <Badge variant={item.status === "complete" ? "default" : item.status === "pending" ? "secondary" : "outline"} className="mt-2">
                              {item.status}
                            </Badge>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Cooperative Print Partners</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200">
                            <p className="text-sm text-muted-foreground">
                              No print partners have been onboarded yet. We don't list partners, 
                              ratings, or turnaround times that don't exist. See the Manufacturing 
                              page for the current sourcing status.
                            </p>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Material Options</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {[
                            { material: "Medical-Grade Silicone", properties: "Hypoallergenic, flexible" },
                            { material: "Natural Latex Alternative", properties: "Sustainable, biodegradable" },
                            { material: "TPE (Thermoplastic)", properties: "Latex-free, recyclable" },
                            { material: "Bio-based Polymer", properties: "Plant-derived, eco-friendly" }
                          ].map((item, i) => (
                            <div key={i} className="p-3 bg-muted/30 rounded-lg">
                              <div className="flex justify-between items-center mb-1">
                                <span className="font-medium text-sm">{item.material}</span>
                              </div>
                              <div className="text-xs text-muted-foreground">{item.properties}</div>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    </div>

                    <div className="space-y-2">
                      <Button className="w-full" disabled data-testid="button-order-print">
                        <Printer className="mr-2 h-4 w-4" />
                        Ordering unavailable — no print partners onboarded yet
                      </Button>
                      <p className="text-xs text-muted-foreground text-center">
                        We won't take a print order until a real cooperative print partner is onboarded.
                        See the Manufacturing page for current sourcing status.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
}