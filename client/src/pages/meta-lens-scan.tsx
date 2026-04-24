import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import {
  Glasses,
  ScanLine,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  Trash2,
  Package,
  Ruler,
  Eye,
  Info,
} from "lucide-react";
import type { Product } from "@shared/schema";

interface MetaLensScan {
  id: number;
  userId: number;
  sourceDevice: string;
  anatomyType: string;
  capturedAt: string;
  lengthMm: number | null;
  girthMm: number | null;
  widthMm: number | null;
  depthMm: number | null;
  rawTranscript: string | null;
  scanImageRef: string | null;
  measurementMethod: string;
  confidenceLevel: string;
  notes: string | null;
  generatedConfigId: number | null;
  status: string;
  createdAt: string;
}

const SOURCE_DEVICES = [
  { value: "ray-ban-meta", label: "Ray-Ban Meta smart glasses" },
  { value: "oakley-meta", label: "Oakley Meta HSTN" },
  { value: "meta-view-app", label: "Meta View companion app" },
  { value: "manual-meta-ai", label: "Meta AI (chat / WhatsApp)" },
];

const MEASUREMENT_METHODS = [
  { value: "meta-ai-photo-tape", label: "Photographed a flexible tape against the body, asked Meta AI to read mm/in" },
  { value: "meta-ai-verbal", label: "Asked Meta AI verbally while looking at a tape measure" },
  { value: "manual-tape-via-glasses", label: "Hands-free measurement (used glasses POV, recorded reading manually)" },
];

const ANATOMY_TYPES = [
  { value: "penis", label: "Penis (length + girth)" },
  { value: "vagina", label: "Vagina / front-hole (width + depth)" },
  { value: "anus", label: "Anus (width)" },
  { value: "front_hole", label: "Front-hole" },
  { value: "multi_anatomy", label: "Multi-anatomy (intersex baseline)" },
];

export default function MetaLensScanPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("instructions");

  // Import form
  const [sourceDevice, setSourceDevice] = useState("ray-ban-meta");
  const [anatomyType, setAnatomyType] = useState("penis");
  const [measurementMethod, setMeasurementMethod] = useState("meta-ai-photo-tape");
  const [confidenceLevel, setConfidenceLevel] = useState("medium");
  const [capturedAt, setCapturedAt] = useState(new Date().toISOString().slice(0, 16));
  const [lengthMm, setLengthMm] = useState("");
  const [girthMm, setGirthMm] = useState("");
  const [widthMm, setWidthMm] = useState("");
  const [depthMm, setDepthMm] = useState("");
  const [rawTranscript, setRawTranscript] = useState("");
  const [notes, setNotes] = useState("");

  const { data: scans = [], isLoading } = useQuery<MetaLensScan[]>({
    queryKey: ['/api/meta-lens-scans'],
    enabled: !!user,
  });

  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ['/api/products'],
  });

  const importMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/meta-lens-scans", {
        sourceDevice, anatomyType, measurementMethod, confidenceLevel,
        capturedAt: new Date(capturedAt).toISOString(),
        lengthMm: lengthMm || null,
        girthMm: girthMm || null,
        widthMm: widthMm || null,
        depthMm: depthMm || null,
        rawTranscript: rawTranscript || null,
        notes: notes || null,
      });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/meta-lens-scans'] });
      setLengthMm(""); setGirthMm(""); setWidthMm(""); setDepthMm("");
      setRawTranscript(""); setNotes("");
      setActiveTab("scans");
      toast({ title: "Scan imported", description: "Now generate a product configuration from it." });
    },
    onError: (e: any) => toast({ title: "Import failed", description: e.message, variant: "destructive" }),
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-background py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="p-8 text-center">
              <Glasses className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Log in to import Meta Lens scans</h2>
              <p className="text-muted-foreground">Your scans become your custom-fit product configurations.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <Glasses className="h-9 w-9" />
            Meta Lens → Custom-Fit Products
          </h1>
          <p className="text-lg text-muted-foreground">
            Use your Ray-Ban Meta or Oakley Meta glasses to measure, then generate intersex-baseline custom-fit barriers from the scan.
          </p>
        </div>

        <Alert className="border-blue-500 bg-blue-50 dark:bg-blue-950/30">
          <Info className="h-5 w-5 text-blue-600" />
          <AlertTitle className="font-bold text-blue-900 dark:text-blue-200">How this honestly works</AlertTitle>
          <AlertDescription className="text-sm space-y-2 text-blue-800 dark:text-blue-200">
            <p>
              Meta does not expose body-measurement data through a public API — Ray-Ban Meta glasses, Oakley Meta HSTN, and the Meta View app cannot stream structured measurements directly to TriSex.org. <strong>This is an import flow:</strong> you use Meta AI on your glasses (or in chat) to read a flexible tape measure, then transfer the numbers here.
            </p>
            <p>
              Photos taken via Meta View stay on your device. We only store the numeric measurements, the method you used, and an optional verbatim transcript of what Meta AI said — never raw images unless you choose to attach a reference URL.
            </p>
          </AlertDescription>
        </Alert>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="instructions" data-testid="tab-instructions">Capture Guide</TabsTrigger>
            <TabsTrigger value="import" data-testid="tab-import">Import Measurement</TabsTrigger>
            <TabsTrigger value="scans" data-testid="tab-scans">
              My Scans {scans.length > 0 && <Badge variant="secondary" className="ml-2">{scans.length}</Badge>}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="instructions" className="space-y-4 mt-6">
            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Eye className="h-5 w-5" />Method A: photo + tape (recommended)</CardTitle>
                  <CardDescription>Highest accuracy. Uses your glasses' camera + Meta AI vision.</CardDescription>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <ol className="list-decimal pl-5 space-y-1.5">
                    <li>Wrap a flexible tape measure (sewing-style, cm/mm) around or along the body part.</li>
                    <li>Hold the tape steady so the markings face your glasses.</li>
                    <li>Say <em>"Hey Meta, look and read the tape measure in millimeters."</em></li>
                    <li>Meta AI will speak the reading. Note it (or ask it to repeat).</li>
                    <li>Repeat for each measurement (length, girth, width, depth as needed).</li>
                    <li>Transfer the numbers into the <strong>Import</strong> tab here.</li>
                  </ol>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><ScanLine className="h-5 w-5" />Method B: hands-free POV</CardTitle>
                  <CardDescription>For solo measurement of areas you can't easily photograph.</CardDescription>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <ol className="list-decimal pl-5 space-y-1.5">
                    <li>Position a tape measure in your point-of-view through the glasses.</li>
                    <li>Look directly at the marking; record the value with the glasses' shutter button (creates a stamped photo).</li>
                    <li>Open Meta View on your phone, view the photo, manually note the reading.</li>
                    <li>Transfer to the <strong>Import</strong> tab.</li>
                  </ol>
                </CardContent>
              </Card>
            </div>

            <Alert className="border-amber-500 bg-amber-50 dark:bg-amber-950/30">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              <AlertTitle>Privacy reminders for Meta hardware</AlertTitle>
              <AlertDescription className="text-sm space-y-1">
                <p>• The capture LED on Ray-Ban / Oakley Meta glasses indicates recording — this is for <em>others' privacy</em>, not yours.</p>
                <p>• Meta AI requests are processed on Meta's cloud and may be retained per Meta's data policies. Avoid speaking sensitive identifiers aloud during measurement.</p>
                <p>• Use a private space. Never measure children. Anatomy on minors is out of scope and refused.</p>
                <p>• You can delete photos from Meta View at any time after transferring numbers here.</p>
              </AlertDescription>
            </Alert>

            <Card>
              <CardHeader>
                <CardTitle>Reference: TriSex.org measurement ranges</CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                <ul className="space-y-1">
                  <li>• <strong>Penis length:</strong> 114 – 292 mm (4.5″ – 11.5″)</li>
                  <li>• <strong>Penis girth (circumference):</strong> typically 100 – 165 mm</li>
                  <li>• <strong>Vaginal / front-hole width:</strong> 25 – 60 mm at relaxed entry</li>
                  <li>• <strong>Vaginal / front-hole depth:</strong> 80 – 180 mm</li>
                  <li>• <strong>Anal width (relaxed):</strong> 20 – 45 mm</li>
                </ul>
                <p className="mt-3 text-muted-foreground text-xs">Ranges include intersex anatomical baseline. If your measurement falls outside these ranges, the system will flag it for review rather than refusing — anatomy varies.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="import" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Import a Meta Lens measurement</CardTitle>
                <CardDescription>One scan = one anatomy area at one moment in time.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>Source device</Label>
                    <Select value={sourceDevice} onValueChange={setSourceDevice}>
                      <SelectTrigger data-testid="select-source-device"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {SOURCE_DEVICES.map(d => <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Anatomy area</Label>
                    <Select value={anatomyType} onValueChange={setAnatomyType}>
                      <SelectTrigger data-testid="select-anatomy"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {ANATOMY_TYPES.map(a => <SelectItem key={a.value} value={a.value}>{a.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="md:col-span-2">
                    <Label>Measurement method</Label>
                    <Select value={measurementMethod} onValueChange={setMeasurementMethod}>
                      <SelectTrigger data-testid="select-method"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {MEASUREMENT_METHODS.map(m => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>When captured</Label>
                    <Input type="datetime-local" value={capturedAt} onChange={e => setCapturedAt(e.target.value)} data-testid="input-captured-at" />
                  </div>
                  <div>
                    <Label>Confidence in reading</Label>
                    <Select value={confidenceLevel} onValueChange={setConfidenceLevel}>
                      <SelectTrigger data-testid="select-confidence"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High — clear tape, repeated reading</SelectItem>
                        <SelectItem value="medium">Medium — one reading, fairly clear</SelectItem>
                        <SelectItem value="low">Low — best estimate, will recheck</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                <div>
                  <Label className="flex items-center gap-2"><Ruler className="h-4 w-4" />Measurements (millimeters)</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                    <div>
                      <Label className="text-xs">Length</Label>
                      <Input type="number" value={lengthMm} onChange={e => setLengthMm(e.target.value)} placeholder="e.g. 152" data-testid="input-length" />
                    </div>
                    <div>
                      <Label className="text-xs">Girth</Label>
                      <Input type="number" value={girthMm} onChange={e => setGirthMm(e.target.value)} placeholder="e.g. 130" data-testid="input-girth" />
                    </div>
                    <div>
                      <Label className="text-xs">Width</Label>
                      <Input type="number" value={widthMm} onChange={e => setWidthMm(e.target.value)} placeholder="optional" data-testid="input-width" />
                    </div>
                    <div>
                      <Label className="text-xs">Depth</Label>
                      <Input type="number" value={depthMm} onChange={e => setDepthMm(e.target.value)} placeholder="optional" data-testid="input-depth" />
                    </div>
                  </div>
                </div>

                <div>
                  <Label>Verbatim transcript from Meta AI (optional)</Label>
                  <Textarea
                    rows={3}
                    value={rawTranscript}
                    onChange={e => setRawTranscript(e.target.value)}
                    placeholder='e.g., "The tape measure shows approximately 152 millimeters at the marker you indicated."'
                    data-testid="input-transcript"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Helpful if you want to recheck your reading later.</p>
                </div>

                <div>
                  <Label>Personal notes (optional)</Label>
                  <Textarea rows={2} value={notes} onChange={e => setNotes(e.target.value)} placeholder="anything you want to remember about this scan" data-testid="input-notes" />
                </div>

                <Button
                  onClick={() => importMutation.mutate()}
                  disabled={importMutation.isPending || (!lengthMm && !girthMm && !widthMm && !depthMm)}
                  data-testid="button-import-scan"
                >
                  {importMutation.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <ScanLine className="h-4 w-4 mr-2" />}
                  Import scan
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="scans" className="space-y-4 mt-6">
            {isLoading ? (
              <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin" /></div>
            ) : scans.length === 0 ? (
              <Card><CardContent className="p-8 text-center">
                <Glasses className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No scans yet. Import one from the <strong>Import</strong> tab.</p>
              </CardContent></Card>
            ) : (
              <div className="space-y-3">
                {scans.map(scan => (
                  <ScanRow key={scan.id} scan={scan} products={products} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function ScanRow({ scan, products }: { scan: MetaLensScan; products: Product[] }) {
  const { toast } = useToast();
  const [showGenerate, setShowGenerate] = useState(false);
  const [productId, setProductId] = useState<string>("");
  const [material, setMaterial] = useState("ocean_plastic_hydrogel");

  const compatibleProducts = products.filter(p => {
    const compat = p.bodyCompatibility || [];
    return compat.includes(scan.anatomyType) || compat.includes("multi_anatomy");
  });

  const generateMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", `/api/meta-lens-scans/${scan.id}/generate-configuration`, {
        productId: parseInt(productId),
        material,
      });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/meta-lens-scans'] });
      queryClient.invalidateQueries({ queryKey: ['/api/product-configurations'] });
      toast({ title: "Configuration created", description: "Draft saved to your product configurations. Review & order from the Products page." });
      setShowGenerate(false);
    },
    onError: (e: any) => toast({ title: "Generation failed", description: e.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async () => { await apiRequest("DELETE", `/api/meta-lens-scans/${scan.id}`); },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/meta-lens-scans'] });
      toast({ title: "Scan deleted" });
    },
  });

  return (
    <Card data-testid={`scan-row-${scan.id}`}>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <Badge variant="default"><Glasses className="h-3 w-3 mr-1" />{SOURCE_DEVICES.find(d => d.value === scan.sourceDevice)?.label || scan.sourceDevice}</Badge>
              <Badge variant="outline">{ANATOMY_TYPES.find(a => a.value === scan.anatomyType)?.label || scan.anatomyType}</Badge>
              <Badge variant={scan.confidenceLevel === "high" ? "default" : scan.confidenceLevel === "medium" ? "secondary" : "outline"}>
                Confidence: {scan.confidenceLevel}
              </Badge>
              {scan.generatedConfigId && <Badge className="bg-green-600"><CheckCircle2 className="h-3 w-3 mr-1" />Configured</Badge>}
            </div>
            <div className="text-sm flex flex-wrap gap-x-4 gap-y-1 mt-2">
              {scan.lengthMm != null && <span><strong>Length:</strong> {scan.lengthMm} mm</span>}
              {scan.girthMm != null && <span><strong>Girth:</strong> {scan.girthMm} mm</span>}
              {scan.widthMm != null && <span><strong>Width:</strong> {scan.widthMm} mm</span>}
              {scan.depthMm != null && <span><strong>Depth:</strong> {scan.depthMm} mm</span>}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Captured {format(new Date(scan.capturedAt), "MMM d, yyyy h:mm a")} · Method: {scan.measurementMethod}
            </div>
            {scan.rawTranscript && <div className="text-xs italic mt-1 text-muted-foreground">"{scan.rawTranscript}"</div>}
            {scan.notes && <div className="text-xs mt-1">{scan.notes}</div>}
          </div>
          <div className="flex gap-2 items-start">
            {!scan.generatedConfigId && (
              <Button size="sm" onClick={() => setShowGenerate(s => !s)} data-testid={`button-generate-${scan.id}`}>
                <Sparkles className="h-4 w-4 mr-1" />Generate product
              </Button>
            )}
            <Button size="sm" variant="ghost" onClick={() => { if (confirm("Delete this scan?")) deleteMutation.mutate(); }} data-testid={`button-delete-${scan.id}`}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {showGenerate && !scan.generatedConfigId && (
          <div className="border-t pt-3 space-y-3">
            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <Label>Compatible product</Label>
                <Select value={productId} onValueChange={setProductId}>
                  <SelectTrigger data-testid={`select-product-${scan.id}`}><SelectValue placeholder={`${compatibleProducts.length} compatible`} /></SelectTrigger>
                  <SelectContent>
                    {compatibleProducts.length === 0 && <SelectItem value="" disabled>No compatible products found</SelectItem>}
                    {compatibleProducts.map(p => (
                      <SelectItem key={p.id} value={String(p.id)}>
                        <Package className="h-3 w-3 inline mr-1" />{p.name} — ${p.basePrice}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Material</Label>
                <Select value={material} onValueChange={setMaterial}>
                  <SelectTrigger data-testid={`select-material-${scan.id}`}><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ocean_plastic_hydrogel">Ocean-plastic hydrogel</SelectItem>
                    <SelectItem value="natural_blend">Natural blend</SelectItem>
                    <SelectItem value="bio_silicone">Bio-silicone</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={() => generateMutation.mutate()} disabled={!productId || generateMutation.isPending} data-testid={`button-confirm-generate-${scan.id}`}>
              {generateMutation.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Sparkles className="h-4 w-4 mr-2" />}
              Create draft configuration
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
