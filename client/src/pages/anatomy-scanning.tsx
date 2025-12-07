import { useState } from "react";
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
  Upload,
  Download,
  Shield,
  Printer,
  CheckCircle,
  AlertTriangle,
  Eye,
  EyeOff,
  Lock,
  Globe,
  Languages,
  Zap,
  Heart
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const scanningSchema = z.object({
  anatomyType: z.string().min(1, "Please select anatomy type"),
  scanningMethod: z.string().min(1, "Please select scanning method"),
  privacyLevel: z.string().min(1, "Please select privacy level"),
  languagePreference: z.string().min(1, "Please select language"),
  culturalTerminology: z.string().optional(),
});

interface ScanDataType {
  measurements: {
    primary: string;
    secondary: string;
    tertiary: string;
  };
  customFit: string;
  printingSpecs: string;
}

export default function AnatomyScanning() {
  const [scanningStep, setScanningStep] = useState(1);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanData, setScanData] = useState<ScanDataType | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(scanningSchema),
    defaultValues: {
      anatomyType: "",
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
      description: "External anatomy scanning for custom-fit external protection",
      scanPoints: ["Length", "Girth at base", "Girth at mid-shaft", "Girth at head", "Curvature", "Surface texture"],
      languages: ["English", "Spanish", "French", "Mandarin", "Arabic", "Swahili", "Cherokee", "Navajo"]
    },
    {
      id: "vagina",
      label: "Vaginal",
      description: "Internal anatomy scanning for custom-fit internal protection",
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
      accuracy: "98%",
      time: "5-10 minutes",
      privacy: "Local processing",
      equipment: "Smartphone camera"
    },
    {
      id: "structured_light",
      label: "Structured Light Scanning",
      description: "Professional-grade 3D scanning",
      accuracy: "99.5%",
      time: "2-5 minutes",
      privacy: "Clinic-based",
      equipment: "Clinical scanner"
    },
    {
      id: "ultrasound",
      label: "Medical Ultrasound",
      description: "Internal anatomy mapping via ultrasound",
      accuracy: "95%",
      time: "10-15 minutes",
      privacy: "Medical standard",
      equipment: "Medical ultrasound"
    },
    {
      id: "manual_measurement",
      label: "Guided Manual Measurement",
      description: "Self-measurement with guided instructions",
      accuracy: "90%",
      time: "15-20 minutes",
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
    
    // Simulate scanning process
    const intervals = [
      { progress: 20, message: "Initializing secure scanning environment..." },
      { progress: 40, message: "Capturing anatomical data points..." },
      { progress: 60, message: "Processing 3D measurements..." },
      { progress: 80, message: "Applying cultural terminology preferences..." },
      { progress: 95, message: "Generating custom-fit specifications..." },
      { progress: 100, message: "Scan complete! Ready for 3D printing." }
    ];

    for (const interval of intervals) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setScanProgress(interval.progress);
      
      if (interval.progress === 100) {
        setScanData({
          measurements: {
            primary: "127mm",
            secondary: "34mm",
            tertiary: "28mm"
          },
          customFit: "Generated",
          printingSpecs: "Ready"
        });
        setScanningStep(4);
        toast({
          title: "Scanning Complete",
          description: "Your custom measurements are ready for 3D printing.",
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
        <Alert className="mb-8 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200">
          <Heart className="h-5 w-5 text-purple-600" />
          <AlertDescription className="ml-2">
            <strong>Intersex Healthcare IS Everyone's Affirmation:</strong> 3D anatomy scanning uses intersex anatomy as the universal baseline—trans, non-binary, genderqueer, and quare embodiment are all respected within this participatory budgeting framework. There is no separate "transgender healthcare" category—custom-fit products serve ALL bodies by design.
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
              <Shield className="w-4 h-4 mr-1" />
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
                        <div className="grid md:grid-cols-2 gap-4">
                          {anatomyTypes.map((type) => (
                            <div
                              key={type.id}
                              className={`p-4 border border-border rounded-lg cursor-pointer transition-all ${
                                field.value === type.id 
                                  ? "border-neon-pink bg-neon-pink/10" 
                                  : "hover:border-neon-pink/50"
                              }`}
                              onClick={() => field.onChange(type.id)}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-medium">{type.label}</h4>
                                {field.value === type.id && (
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
                          ))}
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
                                  <span className="text-muted-foreground">Time:</span>
                                  <span className="ml-1 font-medium">{method.time}</span>
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
            <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200">
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
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-green-600" />
                      End-to-End Encryption
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200">
                          <div className="flex items-center gap-2 mb-2">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            <span className="font-semibold">AES-256 Encryption</span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Military-grade encryption for all anatomical scan data. Your measurements 
                            are encrypted before leaving your device.
                          </p>
                        </div>
                        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200">
                          <div className="flex items-center gap-2 mb-2">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            <span className="font-semibold">Zero-Knowledge Architecture</span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            We cannot access your raw scan data. Only encrypted specifications 
                            are transmitted for 3D printing.
                          </p>
                        </div>
                        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200">
                          <div className="flex items-center gap-2 mb-2">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            <span className="font-semibold">Local Processing</span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            All 3D model generation happens on your device. No raw images or 
                            biometric data leaves your phone or computer.
                          </p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <h4 className="font-semibold">Encryption Status</h4>
                        <div className="space-y-3">
                          {[
                            { layer: "Device Encryption", status: "Active", strength: "AES-256" },
                            { layer: "Transport Layer (TLS)", status: "Active", strength: "TLS 1.3" },
                            { layer: "At-Rest Encryption", status: "Active", strength: "AES-256-GCM" },
                            { layer: "Key Management", status: "Active", strength: "ECDH P-384" },
                            { layer: "Hash Verification", status: "Active", strength: "SHA-256" }
                          ].map((enc, i) => (
                            <div key={i} className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                              <div>
                                <div className="font-medium text-sm">{enc.layer}</div>
                                <div className="text-xs text-muted-foreground">{enc.strength}</div>
                              </div>
                              <Badge className="bg-green-500 text-white">{enc.status}</Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
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
                        { title: "Measurements", retention: "30 Days (Optional)", location: "Encrypted Vault", icon: Shield },
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
                          { partner: "Healthcare Provider", purpose: "Custom fit records", status: "Optional", editable: true },
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
                          { account: "Apple Health", connected: false, syncs: "Health data" },
                          { account: "BAD Co-op Dashboard", connected: true, syncs: "Cooperative benefits" }
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
                            <Shield className="h-4 w-4 text-blue-600" />
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
                      Advanced photogrammetry technology captures precise measurements for your 
                      custom-fit protection products. All processing happens locally on your device.
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
                        { step: 2, instruction: "Position device 12-18 inches from anatomy", icon: Smartphone },
                        { step: 3, instruction: "Hold steady - scanning takes 10-15 seconds", icon: Scan },
                        { step: 4, instruction: "Follow on-screen positioning guides", icon: CheckCircle },
                        { step: 5, instruction: "Review captured data before confirmation", icon: Shield }
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
                      <Shield className="h-5 w-5 text-green-600" />
                      Pre-Scan Checklist
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      {[
                        { check: "Camera permissions enabled", status: true },
                        { check: "Local storage available (50MB)", status: true },
                        { check: "Privacy mode activated", status: true },
                        { check: "Encryption keys generated", status: true },
                        { check: "Cultural terminology loaded", status: true },
                        { check: "Offline processing ready", status: true }
                      ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                          <span className="text-sm">{item.check}</span>
                          <Badge className={item.status ? "bg-green-500 text-white" : "bg-yellow-500 text-black"}>
                            {item.status ? "Ready" : "Pending"}
                          </Badge>
                        </div>
                      ))}
                    </div>
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span className="font-semibold">System Ready</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        All checks passed. You may begin scanning when ready.
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
                        { method: "Smartphone Camera", accuracy: "98%", time: "30 sec", desc: "iOS 14+ or Android 10+", available: true },
                        { method: "Tablet Scanner", accuracy: "99%", time: "20 sec", desc: "iPad Pro LiDAR", available: true },
                        { method: "Clinical Scanner", accuracy: "99.9%", time: "10 sec", desc: "Partner clinic network", available: true },
                        { method: "Manual Entry", accuracy: "95%", time: "5 min", desc: "Guided self-measurement", available: true }
                      ].map((item, i) => (
                        <Card key={i} className={`border-t-4 ${item.available ? "border-t-purple-500" : "border-t-gray-300"}`}>
                          <CardContent className="p-4 text-center">
                            <Smartphone className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                            <div className="font-semibold text-sm mb-1">{item.method}</div>
                            <div className="text-xs text-muted-foreground mb-2">{item.desc}</div>
                            <div className="flex justify-center gap-2">
                              <Badge variant="secondary" className="text-xs">{item.accuracy}</Badge>
                              <Badge variant="outline" className="text-xs">{item.time}</Badge>
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
                      <h3 className="text-2xl font-bold mb-2">Scanning in Progress</h3>
                      <p className="text-muted-foreground">Please hold your device steady</p>
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
                        { phase: "Initialize", icon: Shield, complete: scanProgress >= 20 },
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
                      {scanProgress < 20 && "Initializing secure scanning environment with end-to-end encryption..."}
                      {scanProgress >= 20 && scanProgress < 40 && "Capturing high-resolution anatomical data points using photogrammetry..."}
                      {scanProgress >= 40 && scanProgress < 60 && "Processing 3D mesh and calculating precise measurements..."}
                      {scanProgress >= 60 && scanProgress < 80 && "Validating data integrity and applying cultural terminology preferences..."}
                      {scanProgress >= 80 && scanProgress < 100 && "Generating custom-fit specifications for 3D printing..."}
                      {scanProgress === 100 && "Scan complete! Your custom specifications are ready."}
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
            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-green-500 rounded-xl">
                    <CheckCircle className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Scan Complete - Custom Specifications Ready</h2>
                    <p className="text-muted-foreground">
                      Your anatomical measurements have been securely processed. Custom-fit products 
                      are ready for 3D printing and can be synced with your healthcare records.
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
                    <Card className="border-t-4 border-t-green-500">
                      <CardContent className="p-4 text-center">
                        <div className="text-3xl font-bold text-green-600 mb-1">{scanData.measurements.primary}</div>
                        <div className="text-sm text-muted-foreground">Primary Dimension</div>
                      </CardContent>
                    </Card>
                    <Card className="border-t-4 border-t-blue-500">
                      <CardContent className="p-4 text-center">
                        <div className="text-3xl font-bold text-blue-600 mb-1">{scanData.measurements.secondary}</div>
                        <div className="text-sm text-muted-foreground">Secondary Dimension</div>
                      </CardContent>
                    </Card>
                    <Card className="border-t-4 border-t-purple-500">
                      <CardContent className="p-4 text-center">
                        <div className="text-3xl font-bold text-purple-600 mb-1">{scanData.measurements.tertiary}</div>
                        <div className="text-sm text-muted-foreground">Tertiary Dimension</div>
                      </CardContent>
                    </Card>
                    <Card className="border-t-4 border-t-pink-500">
                      <CardContent className="p-4 text-center">
                        <div className="text-3xl font-bold text-pink-600 mb-1">99.2%</div>
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
                          { metric: "Length (relaxed)", value: "127mm", accuracy: "±0.5mm" },
                          { metric: "Girth (base)", value: "118mm", accuracy: "±0.3mm" },
                          { metric: "Girth (mid-shaft)", value: "112mm", accuracy: "±0.3mm" },
                          { metric: "Girth (head)", value: "108mm", accuracy: "±0.3mm" },
                          { metric: "Curvature angle", value: "8° left", accuracy: "±1°" },
                          { metric: "Surface texture", value: "Standard", accuracy: "N/A" }
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
                          <Shield className="h-5 w-5 text-blue-600" />
                          Custom Fit Recommendations
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {[
                          { product: "External Barrier (Standard)", size: "Custom-127", fit: "Perfect", stock: true },
                          { product: "External Barrier (Textured)", size: "Custom-127T", fit: "Perfect", stock: true },
                          { product: "Internal Barrier", size: "Custom-INT", fit: "Excellent", stock: true },
                          { product: "Oral Barrier", size: "Standard", fit: "Universal", stock: true }
                        ].map((item, i) => (
                          <div key={i} className="p-3 bg-muted/30 rounded-lg">
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-medium text-sm">{item.product}</span>
                              <Badge className="bg-green-500 text-white">{item.fit}</Badge>
                            </div>
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>Size: {item.size}</span>
                              <span>{item.stock ? "In Stock" : "Made to Order"}</span>
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
                      <Shield className="h-4 w-4 text-blue-600" />
                      <AlertDescription>
                        Sync your custom-fit specifications and STI testing data with your healthcare 
                        provider's electronic health records for coordinated care and healthy outcomes tracking.
                      </AlertDescription>
                    </Alert>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="font-semibold">Supported EHR Systems</h4>
                        {[
                          { system: "Epic MyChart", status: "connected", features: "Full integration", icon: "🏥" },
                          { system: "Cerner", status: "available", features: "STI tracking", icon: "🏥" },
                          { system: "Athenahealth", status: "available", features: "Results sharing", icon: "🏥" },
                          { system: "Allscripts", status: "available", features: "Care coordination", icon: "🏥" },
                          { system: "eClinicalWorks", status: "available", features: "STI tracking", icon: "🏥" },
                          { system: "NextGen Healthcare", status: "coming", features: "Q2 2026", icon: "🏥" }
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
                          { data: "Custom Fit Specifications", sync: "On Order", privacy: "Encrypted" },
                          { data: "STI Test Results", sync: "Real-time", privacy: "HIPAA Compliant" },
                          { data: "Treatment Outcomes", sync: "Weekly", privacy: "Provider Access" },
                          { data: "Product Usage Analytics", sync: "Optional", privacy: "Anonymized" },
                          { data: "DALY Impact Metrics", sync: "Monthly", privacy: "Aggregate Only" }
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
                        { metric: "Days Since Last Test", value: "23", status: "good", target: "<90" },
                        { metric: "Protection Usage Rate", value: "98%", status: "excellent", target: ">95%" },
                        { metric: "Partner Notifications", value: "100%", status: "excellent", target: "100%" },
                        { metric: "DALY Impact Score", value: "+2.3", status: "positive", target: "Positive" }
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
                          {[
                            { test: "HIV Antibody/Antigen", result: "Negative", date: "Nov 15, 2025", source: "Epic MyChart" },
                            { test: "Chlamydia/Gonorrhea", result: "Negative", date: "Nov 15, 2025", source: "Epic MyChart" },
                            { test: "Syphilis RPR", result: "Negative", date: "Nov 15, 2025", source: "Epic MyChart" },
                            { test: "Hepatitis B Surface Ag", result: "Immune", date: "Oct 1, 2025", source: "Epic MyChart" },
                            { test: "HPV (if applicable)", result: "Not Detected", date: "Sep 20, 2025", source: "Epic MyChart" }
                          ].map((item, i) => (
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
                          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 mb-4">
                            <div className="flex items-center gap-2 mb-2">
                              <CheckCircle className="h-5 w-5 text-green-600" />
                              <span className="font-semibold">Excellent Sexual Health Status</span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Your consistent protection usage and regular testing contribute to 
                              positive DALY outcomes for yourself and your community.
                            </p>
                          </div>
                          {[
                            { outcome: "Barrier Effectiveness", score: "99.7%", trend: "stable" },
                            { outcome: "Custom Fit Compliance", score: "100%", trend: "up" },
                            { outcome: "Partner Communication", score: "95%", trend: "up" },
                            { outcome: "Testing Adherence", score: "100%", trend: "stable" }
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
                    <Alert className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200">
                      <Heart className="h-4 w-4 text-purple-600" />
                      <AlertDescription>
                        <strong>Intersex Healthcare IS Everyone's Affirmation:</strong> These educational 3D models 
                        center intersex anatomy as the universal baseline—trans, non-binary, genderqueer, and quare 
                        embodiment are all respected within this participatory budgeting framework.
                      </AlertDescription>
                    </Alert>

                    <div className="grid md:grid-cols-3 gap-4">
                      <h4 className="md:col-span-3 font-semibold text-lg">Anatomical Diversity Library</h4>
                      {[
                        { model: "Intersex Spectrum Models", desc: "Complete anatomical variations as foundational baseline", count: 47, featured: true },
                        { model: "Two-Spirit Anatomy", desc: "Indigenous gender expressions and embodiment", count: 12, featured: true },
                        { model: "Gay Male Anatomy", desc: "MSM-specific anatomical education", count: 8, featured: false },
                        { model: "Queer Embodiment", desc: "Fluid and non-categorical anatomical forms", count: 15, featured: false },
                        { model: "Lesbian Anatomy", desc: "WLW-specific anatomical education", count: 10, featured: false },
                        { model: "Bisexual Bodies", desc: "Multi-partner anatomical considerations", count: 6, featured: false },
                        { model: "Trans Feminine", desc: "Pre/post-surgical anatomical variations", count: 24, featured: true },
                        { model: "Trans Masculine", desc: "Pre/post-surgical anatomical variations", count: 22, featured: true },
                        { model: "Non-Binary Anatomy", desc: "Beyond binary anatomical presentations", count: 18, featured: false },
                        { model: "Genderqueer Bodies", desc: "Gender-expansive anatomical forms", count: 14, featured: false },
                        { model: "Quare Embodiment", desc: "Black queer anatomical perspectives", count: 11, featured: true },
                        { model: "Latinx Anatomy", desc: "Culturally-informed anatomical education", count: 9, featured: false }
                      ].map((item, i) => (
                        <Card key={i} className={`border-l-4 ${item.featured ? "border-l-purple-500" : "border-l-gray-300"}`}>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <span className="font-semibold text-sm">{item.model}</span>
                              {item.featured && <Badge className="bg-purple-500 text-white text-xs">Featured</Badge>}
                            </div>
                            <p className="text-xs text-muted-foreground mb-2">{item.desc}</p>
                            <div className="flex justify-between items-center">
                              <Badge variant="outline" className="text-xs">{item.count} models</Badge>
                              <Button size="sm" variant="ghost" className="h-6 px-2 text-xs">
                                View 3D
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Interactive Features</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {[
                            { feature: "360° Rotation", desc: "View from any angle" },
                            { feature: "Layer Visibility", desc: "Toggle anatomical layers" },
                            { feature: "Measurement Tools", desc: "Compare with your scan" },
                            { feature: "Annotation Mode", desc: "Add personal notes" },
                            { feature: "AR Overlay", desc: "View in augmented reality" },
                            { feature: "VR Compatible", desc: "Immersive learning experience" }
                          ].map((item, i) => (
                            <div key={i} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                              <div>
                                <span className="font-medium text-sm">{item.feature}</span>
                                <div className="text-xs text-muted-foreground">{item.desc}</div>
                              </div>
                              <CheckCircle className="h-4 w-4 text-green-500" />
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
                            { module: "Anatomy Fundamentals", lessons: 12, duration: "2 hrs", level: "Beginner" },
                            { module: "Intersex Variations", lessons: 8, duration: "1.5 hrs", level: "Intermediate" },
                            { module: "Gender-Affirming Care", lessons: 10, duration: "2 hrs", level: "All Levels" },
                            { module: "Protection Fit Guide", lessons: 6, duration: "45 min", level: "Practical" },
                            { module: "Partner Communication", lessons: 5, duration: "30 min", level: "Essential" }
                          ].map((item, i) => (
                            <div key={i} className="p-3 bg-muted/30 rounded-lg">
                              <div className="flex justify-between items-center mb-1">
                                <span className="font-medium text-sm">{item.module}</span>
                                <Badge variant="secondary">{item.level}</Badge>
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {item.lessons} lessons • {item.duration}
                              </div>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    </div>

                    <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200">
                      <h4 className="font-semibold mb-2">Community-Created Content</h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        These 3D models were developed in collaboration with intersex advocates, 
                        Two-Spirit elders, trans healthcare providers, and queer community educators. 
                        All content is reviewed by the TriSex.org Anatomical Accuracy Council.
                      </p>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Upload className="h-4 w-4 mr-2" />
                          Submit Model
                        </Button>
                        <Button variant="outline" size="sm">
                          Join Review Council
                        </Button>
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
                        { stage: "Specifications", status: "complete", icon: CheckCircle },
                        { stage: "Material Selection", status: "complete", icon: CheckCircle },
                        { stage: "Partner Selection", status: "pending", icon: AlertTriangle },
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
                          {[
                            { partner: "Portland Maker Collective", location: "OR, USA", rating: 4.9, turnaround: "3-5 days" },
                            { partner: "Bay Area 3D Co-op", location: "CA, USA", rating: 4.8, turnaround: "2-4 days" },
                            { partner: "NYC Fabrication Lab", location: "NY, USA", rating: 4.7, turnaround: "4-6 days" },
                            { partner: "Chicago Print Works", location: "IL, USA", rating: 4.8, turnaround: "3-5 days" }
                          ].map((item, i) => (
                            <div key={i} className="p-3 bg-muted/30 rounded-lg">
                              <div className="flex justify-between items-center mb-1">
                                <span className="font-medium text-sm">{item.partner}</span>
                                <Badge variant="secondary">★ {item.rating}</Badge>
                              </div>
                              <div className="flex justify-between text-xs text-muted-foreground">
                                <span>{item.location}</span>
                                <span>{item.turnaround}</span>
                              </div>
                            </div>
                          ))}
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Material Options</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {[
                            { material: "Medical-Grade Silicone", properties: "Hypoallergenic, flexible", price: "$$$" },
                            { material: "Natural Latex Alternative", properties: "Sustainable, biodegradable", price: "$$" },
                            { material: "TPE (Thermoplastic)", properties: "Latex-free, recyclable", price: "$$" },
                            { material: "Bio-based Polymer", properties: "Plant-derived, eco-friendly", price: "$$$" }
                          ].map((item, i) => (
                            <div key={i} className="p-3 bg-muted/30 rounded-lg">
                              <div className="flex justify-between items-center mb-1">
                                <span className="font-medium text-sm">{item.material}</span>
                                <Badge variant="outline">{item.price}</Badge>
                              </div>
                              <div className="text-xs text-muted-foreground">{item.properties}</div>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    </div>

                    <div className="flex space-x-4">
                      <Button variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Download Specifications
                      </Button>
                      <Button className="bg-teal-500 hover:bg-teal-600 text-white flex-1">
                        <Printer className="mr-2 h-4 w-4" />
                        Select Print Partner & Order
                      </Button>
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