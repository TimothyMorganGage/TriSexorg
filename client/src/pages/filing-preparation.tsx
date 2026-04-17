import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import {
  FileText,
  Download,
  AlertTriangle,
  CheckCircle,
  Clock,
  Plus,
  Building2,
  Loader2,
  ExternalLink,
  ShieldCheck,
  Trash2,
  FileWarning,
} from "lucide-react";

interface SupportedForm {
  id: string;
  name: string;
  description: string;
  agency: string;
  method: string;
  estimatedTime: string;
}

interface FilingDocument {
  id: number;
  userId: number;
  formType: string;
  entityName: string;
  status: string;
  documentBody: string;
  payload: string | null;
  taxYear: number | null;
  jurisdiction: string | null;
  confirmationNumber: string | null;
  agencyResponse: string | null;
  generatedAt: string;
  submittedAt: string | null;
  acknowledgedAt: string | null;
  notes: string | null;
}

const STATUS_INFO: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "destructive"; color: string }> = {
  drafted:      { label: "Drafted",       variant: "secondary", color: "text-slate-600" },
  reviewed:     { label: "Reviewed",      variant: "outline",   color: "text-blue-600" },
  submitted:    { label: "Submitted",     variant: "default",   color: "text-amber-600" },
  acknowledged: { label: "Acknowledged",  variant: "default",   color: "text-purple-600" },
  approved:     { label: "Approved",      variant: "default",   color: "text-green-600" },
  rejected:     { label: "Rejected",      variant: "destructive", color: "text-red-600" },
  withdrawn:    { label: "Withdrawn",     variant: "outline",   color: "text-slate-500" },
};

const FORM_FIELD_DEFS: Record<string, { key: string; label: string; placeholder?: string; type?: string; section?: string }[]> = {
  "1024": [
    { section: "Identity", key: "ein", label: "EIN (Employer Identification Number)", placeholder: "XX-XXXXXXX" },
    { key: "address", label: "Mailing address", placeholder: "Street" },
    { key: "cityStateZip", label: "City, State, ZIP" },
    { key: "country", label: "Country", placeholder: "United States" },
    { key: "contactName", label: "Contact person name" },
    { key: "contactPhone", label: "Contact telephone" },
    { key: "formationDate", label: "Date organization was formed", type: "date" },
    { key: "formationState", label: "State of formation" },
    { key: "fiscalYearEnd", label: "Fiscal year-end month", placeholder: "December" },
    { section: "Structure", key: "entityType", label: "Entity type", placeholder: "corporation | llc | trust | association" },
    { section: "Exemption", key: "exemptSection", label: "Exemption section requested", placeholder: "501(c)(12)" },
    { key: "coopJustification", label: "Cooperative justification (≥85% member-source income)", type: "textarea" },
    { key: "activitiesNarrative", label: "Narrative of activities", type: "textarea" },
    { section: "Financials", key: "memberReceipts", label: "Current-year member receipts ($)" },
    { key: "nonMemberReceipts", label: "Current-year non-member receipts ($)" },
    { key: "totalExpenses", label: "Current-year total expenses ($)" },
    { key: "memberPercent", label: "Member-source income %", placeholder: "85+" },
    { section: "Signature", key: "signerName", label: "Signer name" },
    { key: "signerTitle", label: "Signer title" },
  ],
  "1099-DIV": [
    { section: "Payer (Cooperative)", key: "payerEin", label: "Payer EIN" },
    { key: "payerAddress", label: "Payer street address" },
    { key: "payerCityStateZip", label: "Payer city, state, ZIP" },
    { key: "payerPhone", label: "Payer phone" },
    { section: "Recipient (Member)", key: "recipientName", label: "Recipient name" },
    { key: "recipientAddress", label: "Recipient street address" },
    { key: "recipientCityStateZip", label: "Recipient city, state, ZIP" },
    { key: "recipientTin", label: "Recipient TIN (SSN/EIN)", placeholder: "Collect via W-9 first" },
    { key: "accountNumber", label: "Account / member ID (optional)" },
    { section: "Amounts", key: "box1a", label: "Box 1a — Total ordinary dividends ($)" },
    { key: "box1b", label: "Box 1b — Qualified dividends ($)" },
    { key: "box2a", label: "Box 2a — Total capital gain distributions ($)" },
    { key: "box3", label: "Box 3 — Nondividend distributions ($)" },
    { key: "box4", label: "Box 4 — Federal income tax withheld ($)" },
    { key: "box5", label: "Box 5 — Section 199A dividends ($)" },
    { section: "Signature", key: "signerName", label: "Signer name" },
    { key: "signerTitle", label: "Signer title" },
  ],
  "FinCEN-107": [
    { section: "Filing", key: "filingType", label: "Filing type", placeholder: "initial | renewal | reregistration" },
    { section: "Registrant", key: "ein", label: "EIN" },
    { key: "dba", label: "DBA / trade name" },
    { key: "formationDate", label: "Date of formation", type: "date" },
    { key: "formationState", label: "State of formation" },
    { key: "principalAddress", label: "Principal place of business" },
    { key: "mailingAddress", label: "Mailing address (if different)" },
    { section: "Activities", key: "actMoneyTransmitter", label: "Money transmitter? (true/false)", placeholder: "true" },
    { key: "actVirtualCurrency", label: "Convertible virtual currency admin/exchanger? (true/false)", placeholder: "true" },
    { key: "actStoredValue", label: "Prepaid access provider/seller? (true/false)" },
    { section: "Operations", key: "statesOfOperation", label: "States of operation", placeholder: "comma-separated" },
    { key: "grossVolume", label: "Estimated 12-mo gross transaction volume ($)" },
    { key: "txnCount", label: "Estimated 12-mo transaction count" },
    { key: "branchCount", label: "Number of branches" },
    { key: "agentCount", label: "Number of agents" },
    { section: "Owner / Control (10%+)", key: "owner1Name", label: "Owner 1 — Name" },
    { key: "owner1Title", label: "Owner 1 — Title" },
    { key: "owner1Ssn", label: "Owner 1 — SSN/ITIN" },
    { key: "owner1Dob", label: "Owner 1 — Date of birth", type: "date" },
    { key: "owner1Address", label: "Owner 1 — Address" },
    { key: "owner1Pct", label: "Owner 1 — Ownership %" },
    { section: "AML Program", key: "amlPolicy", label: "Written AML policy in place? (true/false)" },
    { key: "amlOfficer", label: "Designated AML officer? (true/false)" },
    { key: "amlOfficerName", label: "AML compliance officer name" },
    { key: "amlTraining", label: "Ongoing training program? (true/false)" },
    { key: "amlAudit", label: "Independent audit scheduled? (true/false)" },
    { key: "ctrFiling", label: "CTR filing process for >$10k? (true/false)" },
    { key: "sarFiling", label: "SAR filing process for suspicious activity? (true/false)" },
    { section: "Signature", key: "signerName", label: "Signer name" },
    { key: "signerTitle", label: "Signer title" },
  ],
  "State-MTL": [
    { section: "Identity", key: "ein", label: "EIN" },
    { key: "dba", label: "DBA / trade name" },
    { key: "nmlsId", label: "NMLS ID (recommended)" },
    { key: "fincenMsbId", label: "FinCEN MSB Registration #" },
    { section: "Principal Office", key: "principalAddress", label: "Street address" },
    { key: "principalCityStateZip", label: "City, State, ZIP" },
    { key: "principalPhone", label: "Phone" },
    { section: "Activities", key: "activityDescription", label: "Description of in-state activity", type: "textarea" },
    { key: "estimatedVolume", label: "Estimated annual in-state volume ($)" },
    { key: "agentCount", label: "Number of agents in-state" },
    { key: "custodyModel", label: "Customer-funds custody model", type: "textarea" },
    { key: "bondAmount", label: "Surety bond amount ($)" },
    { section: "Key Person 1", key: "keyPerson1Name", label: "Name" },
    { key: "keyPerson1Title", label: "Title" },
    { key: "keyPerson1Address", label: "Address" },
    { key: "keyPerson1Prints", label: "FBI fingerprints submitted? (true/false)" },
    { key: "keyPerson1Credit", label: "Credit report authorization signed? (true/false)" },
    { section: "Fees", key: "appFee", label: "Application fee ($)" },
    { key: "invFee", label: "Investigation fee ($)" },
    { key: "licenseFee", label: "First-year license fee ($)" },
    { section: "Signature", key: "signerName", label: "Signer name" },
    { key: "signerTitle", label: "Signer title" },
  ],
};

function coerce(val: string): any {
  if (val === "true") return true;
  if (val === "false") return false;
  return val;
}

export default function FilingPreparation() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("forms");
  const [selectedFormId, setSelectedFormId] = useState<string>("");
  const [entityName, setEntityName] = useState("BAD Cooperative");
  const [taxYear, setTaxYear] = useState<string>(String(new Date().getFullYear() - 1));
  const [jurisdiction, setJurisdiction] = useState("");
  const [stablecoin, setStablecoin] = useState<string>("$BAD");
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const [previewDoc, setPreviewDoc] = useState<FilingDocument | null>(null);
  const [statusUpdate, setStatusUpdate] = useState<{ id: number; status: string; confirmationNumber: string; agencyResponse: string; notes: string } | null>(null);

  const { data: supportedForms = [] } = useQuery<SupportedForm[]>({
    queryKey: ['/api/filings/forms'],
  });

  const { data: filings = [], isLoading } = useQuery<FilingDocument[]>({
    queryKey: ['/api/filings'],
    enabled: !!user,
  });

  const generateMutation = useMutation({
    mutationFn: async () => {
      const data: Record<string, any> = {};
      Object.entries(fieldValues).forEach(([k, v]) => {
        if (v !== "") data[k] = coerce(v);
      });
      const res = await apiRequest("POST", "/api/filings/generate", {
        formType: selectedFormId,
        entityName,
        taxYear: taxYear ? parseInt(taxYear) : undefined,
        jurisdiction: jurisdiction || undefined,
        stablecoin,
        data,
      });
      return await res.json();
    },
    onSuccess: (doc: FilingDocument) => {
      queryClient.invalidateQueries({ queryKey: ['/api/filings'] });
      setPreviewDoc(doc);
      setActiveTab("my-filings");
      toast({ title: "Filing packet generated", description: "Review, download, then submit to the agency listed in the packet." });
    },
    onError: (e: any) => toast({ title: "Generation failed", description: e.message, variant: "destructive" }),
  });

  const updateStatusMutation = useMutation({
    mutationFn: async (input: { id: number; status: string; confirmationNumber?: string; agencyResponse?: string; notes?: string }) => {
      const res = await apiRequest("PATCH", `/api/filings/${input.id}/status`, {
        status: input.status,
        confirmationNumber: input.confirmationNumber || undefined,
        agencyResponse: input.agencyResponse || undefined,
        notes: input.notes || undefined,
      });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/filings'] });
      setStatusUpdate(null);
      toast({ title: "Status updated", description: "Real-world status saved." });
    },
    onError: (e: any) => toast({ title: "Update failed", description: e.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/filings/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/filings'] });
      setPreviewDoc(null);
      toast({ title: "Filing deleted" });
    },
  });

  const downloadFiling = (doc: FilingDocument) => {
    const blob = new Blob([doc.documentBody], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${doc.formType.replace(/[^a-z0-9-]/gi, "_")}_${doc.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const selectedForm = supportedForms.find(f => f.id === selectedFormId);
  const fields = selectedFormId ? FORM_FIELD_DEFS[selectedFormId] || [] : [];

  if (!user) {
    return (
      <div className="min-h-screen bg-background py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="p-8 text-center">
              <ShieldCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Log in to prepare filings</h2>
              <p className="text-muted-foreground">Filing Preparation requires a logged-in account so your packets and real-world status are saved to your record.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <Building2 className="h-9 w-9" />
            Filing Preparation — $BAD Cooperative
          </h1>
          <p className="text-lg text-muted-foreground">
            Generate real, downloadable, filing-ready packets for the $BAD stablecoin cooperative.
          </p>
        </div>

        <Alert className="border-amber-500 bg-amber-50 dark:bg-amber-950/30" data-testid="alert-honesty">
          <FileWarning className="h-5 w-5 text-amber-600" />
          <AlertTitle className="text-amber-900 dark:text-amber-200 font-bold">Honest Disclosure</AlertTitle>
          <AlertDescription className="text-amber-800 dark:text-amber-200 space-y-2">
            <p>
              <strong>TriSex.org does not file with the IRS, FinCEN, or any state regulator on your behalf.</strong>
              {" "}This system prepares packets that you — or your attorney/CPA — must review, sign, and submit yourself.
            </p>
            <p>
              Status fields below are <strong>real-world tracking</strong>: enter the actual confirmation number issued by the agency after you submit. Internal placeholders are not used.
            </p>
            <p>
              Money transmission without proper licensing is a criminal offense in most U.S. states. Consult licensed counsel before issuing or redeeming the $BAD stablecoin.
            </p>
          </AlertDescription>
        </Alert>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="forms" data-testid="tab-forms">Available Forms</TabsTrigger>
            <TabsTrigger value="generate" data-testid="tab-generate">Generate Packet</TabsTrigger>
            <TabsTrigger value="my-filings" data-testid="tab-my-filings">
              My Filings {filings.length > 0 && <Badge variant="secondary" className="ml-2">{filings.length}</Badge>}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="forms" className="space-y-4 mt-6">
            <div className="grid md:grid-cols-2 gap-4">
              {supportedForms.map(form => (
                <Card key={form.id} data-testid={`form-card-${form.id}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-lg">{form.name}</CardTitle>
                      <Badge variant="outline">{form.id}</Badge>
                    </div>
                    <CardDescription>{form.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div><strong>Agency:</strong> {form.agency}</div>
                    <div><strong>Method:</strong> {form.method}</div>
                    <div><strong>Timeline:</strong> {form.estimatedTime}</div>
                    <Button
                      className="w-full mt-3"
                      onClick={() => {
                        setSelectedFormId(form.id);
                        setFieldValues({});
                        setActiveTab("generate");
                      }}
                      data-testid={`button-prepare-${form.id}`}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Prepare this filing
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="generate" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Generate a filing packet</CardTitle>
                <CardDescription>Fill in known fields. Missing fields will appear as <code>[REQUIRED]</code> in the packet so you can complete them by hand.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>Form type</Label>
                    <Select value={selectedFormId} onValueChange={(v) => { setSelectedFormId(v); setFieldValues({}); }}>
                      <SelectTrigger data-testid="select-form-type"><SelectValue placeholder="Select a form" /></SelectTrigger>
                      <SelectContent>
                        {supportedForms.map(f => (
                          <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Entity name (the filer)</Label>
                    <Input value={entityName} onChange={e => setEntityName(e.target.value)} data-testid="input-entity-name" />
                  </div>
                  {(selectedFormId === "1099-DIV" || selectedFormId === "1024") && (
                    <div>
                      <Label>Tax year</Label>
                      <Input type="number" value={taxYear} onChange={e => setTaxYear(e.target.value)} data-testid="input-tax-year" />
                    </div>
                  )}
                  {selectedFormId === "State-MTL" && (
                    <div>
                      <Label>State (jurisdiction)</Label>
                      <Input value={jurisdiction} onChange={e => setJurisdiction(e.target.value)} placeholder="e.g., New York" data-testid="input-jurisdiction" />
                    </div>
                  )}
                  {(selectedFormId === "FinCEN-107" || selectedFormId === "State-MTL") && (
                    <div>
                      <Label>Stablecoin(s) covered by this filing</Label>
                      <Select value={stablecoin} onValueChange={setStablecoin}>
                        <SelectTrigger data-testid="select-stablecoin"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="$BAD">$BAD only</SelectItem>
                          <SelectItem value="$TRISEXORG">$TRISEXORG only</SelectItem>
                          <SelectItem value="$BAD + $TRISEXORG">$BAD + $TRISEXORG (both)</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground mt-1">Most state regulators expect a separate registration per distinct token. Generate one packet per coin if your counsel advises.</p>
                    </div>
                  )}
                </div>

                {selectedFormId && (
                  <>
                    <Separator />
                    <div className="space-y-3">
                      <h3 className="font-semibold">{selectedForm?.name} — Field data</h3>
                      <p className="text-sm text-muted-foreground">Leave blank if unknown — the packet will mark these fields <code>[REQUIRED]</code> for you to complete on paper or in the official portal.</p>
                      {(() => {
                        const sections: { name: string; items: typeof fields }[] = [];
                        let current: { name: string; items: typeof fields } | null = null;
                        fields.forEach(f => {
                          if (f.section) {
                            if (current) sections.push(current);
                            current = { name: f.section, items: [f] };
                          } else if (current) {
                            current.items.push(f);
                          } else {
                            current = { name: "Details", items: [f] };
                          }
                        });
                        if (current) sections.push(current);
                        return sections.map(sec => (
                          <div key={sec.name} className="space-y-2">
                            <h4 className="text-sm font-bold uppercase tracking-wide text-muted-foreground border-b pb-1">{sec.name}</h4>
                            <div className="grid md:grid-cols-2 gap-3">
                              {sec.items.map(f => (
                                <div key={f.key}>
                                  <Label className="text-xs">{f.label}</Label>
                                  {f.type === "textarea" ? (
                                    <Textarea
                                      rows={3}
                                      value={fieldValues[f.key] || ""}
                                      placeholder={f.placeholder}
                                      onChange={e => setFieldValues({ ...fieldValues, [f.key]: e.target.value })}
                                      data-testid={`field-${f.key}`}
                                    />
                                  ) : (
                                    <Input
                                      type={f.type || "text"}
                                      value={fieldValues[f.key] || ""}
                                      placeholder={f.placeholder}
                                      onChange={e => setFieldValues({ ...fieldValues, [f.key]: e.target.value })}
                                      data-testid={`field-${f.key}`}
                                    />
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        ));
                      })()}
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button
                        onClick={() => generateMutation.mutate()}
                        disabled={!selectedFormId || !entityName || generateMutation.isPending}
                        data-testid="button-generate"
                      >
                        {generateMutation.isPending ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <FileText className="h-4 w-4 mr-2" />
                        )}
                        Generate filing packet
                      </Button>
                      <Button variant="outline" onClick={() => setFieldValues({})}>Clear fields</Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="my-filings" className="space-y-4 mt-6">
            {isLoading ? (
              <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin" /></div>
            ) : filings.length === 0 ? (
              <Card><CardContent className="p-8 text-center">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No filings yet. Generate your first packet on the <strong>Generate Packet</strong> tab.</p>
              </CardContent></Card>
            ) : (
              <div className="space-y-3">
                {filings.map(doc => {
                  const status = STATUS_INFO[doc.status] || STATUS_INFO.drafted;
                  return (
                    <Card key={doc.id} data-testid={`filing-row-${doc.id}`}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-4 flex-wrap">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <Badge variant={status.variant} data-testid={`status-${doc.id}`}>{status.label}</Badge>
                              <Badge variant="outline">{doc.formType}</Badge>
                              {doc.taxYear && <Badge variant="secondary">TY {doc.taxYear}</Badge>}
                              {doc.jurisdiction && <Badge variant="secondary">{doc.jurisdiction}</Badge>}
                            </div>
                            <div className="font-semibold">{doc.entityName}</div>
                            <div className="text-xs text-muted-foreground mt-1 space-y-0.5">
                              <div className="flex items-center gap-2"><Clock className="h-3 w-3" />Generated {format(new Date(doc.generatedAt), "MMM d, yyyy h:mm a")}</div>
                              {doc.submittedAt && <div className="flex items-center gap-2"><CheckCircle className="h-3 w-3" />Submitted {format(new Date(doc.submittedAt), "MMM d, yyyy")}</div>}
                              {doc.confirmationNumber && <div><strong>Confirmation #:</strong> {doc.confirmationNumber}</div>}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <Button size="sm" variant="outline" onClick={() => setPreviewDoc(doc)} data-testid={`button-preview-${doc.id}`}>
                              <FileText className="h-4 w-4 mr-1" />Preview
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => downloadFiling(doc)} data-testid={`button-download-${doc.id}`}>
                              <Download className="h-4 w-4 mr-1" />Download
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => setStatusUpdate({
                                id: doc.id,
                                status: doc.status,
                                confirmationNumber: doc.confirmationNumber || "",
                                agencyResponse: doc.agencyResponse || "",
                                notes: doc.notes || "",
                              })}
                              data-testid={`button-update-status-${doc.id}`}
                            >
                              Update status
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => { if (confirm("Delete this filing record?")) deleteMutation.mutate(doc.id); }}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        {doc.agencyResponse && (
                          <div className="mt-2 p-2 bg-muted rounded text-xs"><strong>Agency response:</strong> {doc.agencyResponse}</div>
                        )}
                        {doc.notes && (
                          <div className="mt-2 p-2 bg-muted rounded text-xs"><strong>Notes:</strong> {doc.notes}</div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Preview dialog */}
        <Dialog open={!!previewDoc} onOpenChange={(o) => !o && setPreviewDoc(null)}>
          <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle>{previewDoc?.formType} — {previewDoc?.entityName}</DialogTitle>
              <DialogDescription>This is the exact text of your filing packet. Download to a file before submitting.</DialogDescription>
            </DialogHeader>
            <pre className="text-xs bg-muted p-4 rounded overflow-auto whitespace-pre-wrap font-mono flex-1">
              {previewDoc?.documentBody}
            </pre>
            <DialogFooter>
              <Button variant="outline" onClick={() => setPreviewDoc(null)}>Close</Button>
              {previewDoc && <Button onClick={() => downloadFiling(previewDoc)}><Download className="h-4 w-4 mr-2" />Download</Button>}
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Status update dialog */}
        <Dialog open={!!statusUpdate} onOpenChange={(o) => !o && setStatusUpdate(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update real-world filing status</DialogTitle>
              <DialogDescription>Record what actually happened with the agency. Confirmation numbers must come from the agency, not from TriSex.org.</DialogDescription>
            </DialogHeader>
            {statusUpdate && (
              <div className="space-y-3">
                <div>
                  <Label>Status</Label>
                  <Select value={statusUpdate.status} onValueChange={(v) => setStatusUpdate({ ...statusUpdate, status: v })}>
                    <SelectTrigger data-testid="select-update-status"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="drafted">Drafted</SelectItem>
                      <SelectItem value="reviewed">Reviewed (by counsel/CPA)</SelectItem>
                      <SelectItem value="submitted">Submitted to agency</SelectItem>
                      <SelectItem value="acknowledged">Acknowledged by agency</SelectItem>
                      <SelectItem value="approved">Approved / Determination received</SelectItem>
                      <SelectItem value="rejected">Rejected / Returned</SelectItem>
                      <SelectItem value="withdrawn">Withdrawn</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Confirmation # / Determination ID (from agency)</Label>
                  <Input value={statusUpdate.confirmationNumber} onChange={e => setStatusUpdate({ ...statusUpdate, confirmationNumber: e.target.value })} placeholder="e.g., MSB Reg # or IRS Letter #" data-testid="input-confirmation-number" />
                </div>
                <div>
                  <Label>Agency response (verbatim)</Label>
                  <Textarea rows={3} value={statusUpdate.agencyResponse} onChange={e => setStatusUpdate({ ...statusUpdate, agencyResponse: e.target.value })} data-testid="input-agency-response" />
                </div>
                <div>
                  <Label>Internal notes</Label>
                  <Textarea rows={2} value={statusUpdate.notes} onChange={e => setStatusUpdate({ ...statusUpdate, notes: e.target.value })} data-testid="input-notes" />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setStatusUpdate(null)}>Cancel</Button>
              <Button
                onClick={() => statusUpdate && updateStatusMutation.mutate(statusUpdate)}
                disabled={updateStatusMutation.isPending}
                data-testid="button-save-status"
              >
                {updateStatusMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><ExternalLink className="h-5 w-5" />Official agency portals</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>• IRS forms & e-services: <a className="underline" href="https://www.irs.gov" target="_blank" rel="noopener noreferrer">irs.gov</a></li>
              <li>• IRS FIRE (1099 e-filing): <a className="underline" href="https://fire.irs.gov" target="_blank" rel="noopener noreferrer">fire.irs.gov</a></li>
              <li>• FinCEN BSA E-Filing: <a className="underline" href="https://bsaefiling.fincen.treas.gov" target="_blank" rel="noopener noreferrer">bsaefiling.fincen.treas.gov</a></li>
              <li>• NMLS state licensing: <a className="underline" href="https://nationwidelicensingsystem.org" target="_blank" rel="noopener noreferrer">nationwidelicensingsystem.org</a></li>
              <li>• Free EIN application: <a className="underline" href="https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online" target="_blank" rel="noopener noreferrer">IRS EIN Online</a></li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
