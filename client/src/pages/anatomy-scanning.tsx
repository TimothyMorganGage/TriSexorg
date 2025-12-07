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
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Scan className="mr-2 h-6 w-6 text-aquamarine" />
                Anatomy Scanning in Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-6">
                {!isScanning && (
                  <div>
                    <div className="w-32 h-32 bg-aquamarine/20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Camera className="h-16 w-16 text-aquamarine" />
                    </div>
                    <h3 className="text-xl font-medium mb-2">Ready to Begin Scanning</h3>
                    <p className="text-muted-foreground mb-6">
                      Follow the on-screen instructions for accurate measurement capture
                    </p>
                    <Button 
                      onClick={startScanning}
                      className="bg-aquamarine hover:bg-aquamarine/90 text-black px-8 py-3"
                    >
                      <Zap className="mr-2 h-5 w-5" />
                      Start Scanning Process
                    </Button>
                  </div>
                )}

                {isScanning && (
                  <div>
                    <div className="w-32 h-32 bg-aquamarine/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                      <Scan className="h-16 w-16 text-aquamarine" />
                    </div>
                    <h3 className="text-xl font-medium mb-4">Scanning Your Anatomy</h3>
                    <div className="max-w-md mx-auto">
                      <Progress value={scanProgress} className="h-3 mb-4" />
                      <p className="text-sm text-muted-foreground">
                        {scanProgress < 20 && "Initializing secure scanning environment..."}
                        {scanProgress >= 20 && scanProgress < 40 && "Capturing anatomical data points..."}
                        {scanProgress >= 40 && scanProgress < 60 && "Processing 3D measurements..."}
                        {scanProgress >= 60 && scanProgress < 80 && "Applying cultural terminology preferences..."}
                        {scanProgress >= 80 && scanProgress < 100 && "Generating custom-fit specifications..."}
                        {scanProgress === 100 && "Scan complete! Ready for 3D printing."}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Scan Results */}
        {scanningStep === 4 && scanData && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="mr-2 h-6 w-6 text-green-500" />
                Scan Complete - Custom Specifications Ready
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                    <span className="font-medium">Scanning completed successfully</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Your custom measurements have been processed and are ready for 3D printing.
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Measurements</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Primary dimension:</span>
                          <span className="font-medium">{scanData.measurements.primary}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Secondary dimension:</span>
                          <span className="font-medium">{scanData.measurements.secondary}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Tertiary dimension:</span>
                          <span className="font-medium">{scanData.measurements.tertiary}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Custom Fit</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <Badge className="bg-neon-pink text-black">Perfect Fit Calculated</Badge>
                        <p className="text-sm text-muted-foreground">
                          Comfort and safety optimized for your unique anatomy
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">3D Printing</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <Badge className="bg-aquamarine text-black">Ready for Production</Badge>
                        <p className="text-sm text-muted-foreground">
                          Specifications sent to sustainable 3D printing network
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Next Steps</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        <span>Measurements validated and secured</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        <span>Material selection confirmed</span>
                      </div>
                      <div className="flex items-center">
                        <AlertTriangle className="h-4 w-4 text-yellow-500 mr-2" />
                        <span>3D printing service selection pending</span>
                      </div>
                      <div className="flex items-center">
                        <AlertTriangle className="h-4 w-4 text-yellow-500 mr-2" />
                        <span>Quality verification before shipping</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Privacy Status</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <Lock className="h-4 w-4 text-neon-pink mr-2" />
                        <span>Data encrypted and secure</span>
                      </div>
                      <div className="flex items-center">
                        <EyeOff className="h-4 w-4 text-neon-pink mr-2" />
                        <span>No biometric data stored</span>
                      </div>
                      <div className="flex items-center">
                        <Languages className="h-4 w-4 text-neon-pink mr-2" />
                        <span>Cultural terminology respected</span>
                      </div>
                      <div className="flex items-center">
                        <Globe className="h-4 w-4 text-neon-pink mr-2" />
                        <span>Local processing completed</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Download Specifications
                  </Button>
                  <Button className="bg-neon-pink hover:bg-neon-pink/90 text-black">
                    <Printer className="mr-2 h-4 w-4" />
                    Proceed to 3D Printing
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}