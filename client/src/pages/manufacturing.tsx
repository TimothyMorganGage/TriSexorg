import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Factory,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  PlusCircle,
  Loader2,
  Globe,
  CheckCircle2,
  Scale,
  Eye,
  HandHeart,
  Package,
} from "lucide-react";
import { insertManufacturingPartnerSchema, type ManufacturingPartner } from "@shared/schema";

const PRODUCT_CATEGORIES = [
  { value: "external-barriers", label: "External barriers (sleeve / shaft condoms)" },
  { value: "internal-barriers", label: "Internal barriers (cup-pouch / receptive)" },
  { value: "oral-dams", label: "Oral dams (wing-extended / Sheer Glyde-style)" },
  { value: "lubricants", label: "Lubricants (water- / silicone- / hybrid-base)" },
  { value: "custom-sizing", label: "Custom sizing / variable-size production" },
  { value: "packaging", label: "Packaging, labelling, fulfilment" },
  { value: "other", label: "Other (please describe in notes)" },
];

const ORG_TYPE_OPTIONS = [
  { value: "cooperative", label: "Cooperative (member-owned)" },
  { value: "b-corp", label: "B-Corp / certified social enterprise" },
  { value: "nonprofit", label: "Non-profit / NGO" },
  { value: "for-profit", label: "For-profit company" },
  { value: "informal", label: "Informal / unincorporated workshop" },
];

// Publicly verifiable real-world manufacturers in the sexual-health protection space.
// Listed as RESEARCH CANDIDATES only — not contacted, no agreement, no implied partnership.
// Every fact here can be checked against the company's own public website (linked).
// Entries are sorted by closest fit to the TriSex.org custom-sizing brief.
const RESEARCH_CANDIDATES: Array<{
  name: string;
  country: string;
  url: string;
  whatTheyMake: string;
  whyCandidate: string;
  ccBySaFit: string;
  status: "not-contacted";
}> = [
  {
    name: "ONE Condoms — MyONE Custom Fit",
    country: "United States",
    url: "https://myone.com",
    whatTheyMake:
      "Latex external condoms in 60+ custom-fit sizes, plus standard product lines. MyONE Custom Fit is the only FDA-cleared custom-sized condom line on the US market.",
    whyCandidate:
      "Custom-sizing is their entire premise and they already operate variable-size SKU production at retail scale — closest practical match to the TriSex.org 60+ fit brief.",
    ccBySaFit:
      "Unknown. ONE is for-profit and has not publicly committed to share-alike on design derivatives. Would need outreach + covenant negotiation; their sizing chart is already public, which is a constructive starting point.",
    status: "not-contacted",
  },
  {
    name: "Karex Berhad",
    country: "Malaysia",
    url: "https://www.karex.com.my",
    whatTheyMake:
      "World's largest condom manufacturer by volume (publicly listed on Bursa Malaysia). Contract-manufactures for many global brands and government health programmes; latex and non-latex lines.",
    whyCandidate:
      "Largest production capacity globally with established contract-manufacturing channels. Could absorb cooperative volume without requiring a new factory. Operates under WHO/UNFPA prequalification on some lines.",
    ccBySaFit:
      "Publicly traded for-profit; would not unilaterally release IP. CC BY-SA covenant would have to be scoped to TriSex.org-spec orders only (designs we ship to them, which are already CC BY-SA, not their own moulds).",
    status: "not-contacted",
  },
  {
    name: "Glyde Health",
    country: "Australia",
    url: "https://glydehealth.com",
    whatTheyMake:
      "Vegan, fair-trade latex external condoms. Manufacturer of Sheer Glyde Dams — one of the few dental dams designed and marketed specifically for safer oral sex (rather than repurposed dentistry product).",
    whyCandidate:
      "Direct match for the oral-barriers product line. Already publishes ingredient and supply-chain information. Smaller scale = easier covenant conversation than a mass manufacturer.",
    ccBySaFit:
      "Public sustainability and fair-trade commitments suggest cultural alignment with share-alike values. Still requires explicit covenant — no agreement exists.",
    status: "not-contacted",
  },
  {
    name: "Sustain Natural (Grove Collaborative)",
    country: "United States",
    url: "https://www.grove.co/catalog/brand/sustain/",
    whatTheyMake:
      "Fair-trade-sourced latex condoms, vaginal lubricants, and intimate-care products. Acquired by Grove Collaborative (a public-benefit corporation, US).",
    whyCandidate:
      "Parent company is a US PBC with a published environmental impact methodology — closer to cooperative reporting norms than typical CPG. Multi-category coverage (barriers + lubricants).",
    ccBySaFit:
      "PBC structure means they publicly report on social commitments, which is procedurally compatible with our public-spec-sheet requirement. CC BY-SA on designs still needs separate negotiation.",
    status: "not-contacted",
  },
  {
    name: "Lorals",
    country: "United States",
    url: "https://mylorals.com",
    whatTheyMake:
      "FDA-cleared single-use latex underwear designed specifically as an oral-sex barrier. The only category of its kind currently sold at scale.",
    whyCandidate:
      "Most direct candidate for the oral-barriers / wing-extended-dam product family. Already operates the unusual regulatory pathway (FDA clearance for an oral-sex barrier) that we would otherwise have to navigate from scratch.",
    ccBySaFit:
      "Privately held for-profit. Would need explicit covenant on derivative designs; their FDA clearance is a proprietary asset they would not relicence wholesale.",
    status: "not-contacted",
  },
  {
    name: "Good Clean Love",
    country: "United States",
    url: "https://goodcleanlove.com",
    whatTheyMake:
      "Body-safe, bio-matched personal lubricants (Almost Naked, BioNude, Restore). Certified B-Corp.",
    whyCandidate:
      "B-Corp status means they already publish third-party-audited social and environmental performance — procedurally aligned with our public-spec-sheet requirement. Multi-pH product range usable across the catalogue.",
    ccBySaFit:
      "B-Corp framework supports transparency but does not by itself imply share-alike licensing of formulations. Would need explicit covenant.",
    status: "not-contacted",
  },
  {
    name: "Sliquid",
    country: "United States",
    url: "https://sliquid.com",
    whatTheyMake:
      "Vegan, glycerin-free, paraben-free water- and silicone-based personal lubricants. Full ingredient disclosure on every product.",
    whyCandidate:
      "Already publishes full ingredient lists publicly — the cultural baseline for our public-spec-sheets attestation is already met. Wide pH/formulation range.",
    ccBySaFit:
      "Public ingredient disclosure is the closest existing practice to our public-spec-sheets requirement of any candidate on this list. Formal CC BY-SA licensing of formulations would still need negotiation.",
    status: "not-contacted",
  },
];

type FormValues = {
  companyName: string;
  country: string;
  websiteUrl: string;
  productCategories: string[];
  description: string;
  organisationType: string;
  contactEmail: string;
  shareAlikeDesignsAttestation: boolean;
  publicSpecSheetsAttestation: boolean;
  fairLabourAttestation: boolean;
  ccBySaCompliance: boolean;
  honestyAttestation: boolean;
  submittedBy: string;
  notes: string;
};

export default function Manufacturing() {
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);

  const { data: partners = [], isLoading } = useQuery<ManufacturingPartner[]>({
    queryKey: ["/api/manufacturing-partners"],
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(insertManufacturingPartnerSchema.extend({})) as never,
    defaultValues: {
      companyName: "",
      country: "",
      websiteUrl: "",
      productCategories: [],
      description: "",
      organisationType: "",
      contactEmail: "",
      shareAlikeDesignsAttestation: false,
      publicSpecSheetsAttestation: false,
      fairLabourAttestation: false,
      ccBySaCompliance: false,
      honestyAttestation: false,
      submittedBy: "",
      notes: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const payload = {
        ...values,
        contactEmail: values.contactEmail.trim() || null,
        organisationType: values.organisationType || null,
        submittedBy: values.submittedBy.trim() || null,
        notes: values.notes.trim() || null,
      };
      return await apiRequest("POST", "/api/manufacturing-partners", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/manufacturing-partners"] });
      toast({
        title: "Submission recorded",
        description: "Your manufacturer application has been recorded as pending. Stewards will review.",
      });
      form.reset();
      setShowForm(false);
    },
    onError: (err: any) => {
      toast({
        title: "Submission failed",
        description: err?.message ?? "Please confirm all five attestations are checked.",
        variant: "destructive",
      });
    },
  });

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Header */}
        <div className="text-center space-y-3">
          <Badge className="bg-primary/15 text-primary border border-primary/30">
            <Factory className="w-3 h-3 mr-1" /> Manufacturing Sourcing · CC BY-SA 4.0
          </Badge>
          <h1 className="text-4xl font-bold font-display">Sourcing the Manufacturing</h1>
          <p className="text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Honest scaffolding for getting TriSex.org-spec products actually made. No
            partnerships are signed yet. The page documents the candidates we have
            researched, the covenant any partner must accept, and the form by which a
            real manufacturer (or you, on behalf of one) can apply.
          </p>
        </div>

        {/* Operational honesty banner */}
        <Alert className="border-2 border-amber-500/60 bg-amber-50 dark:bg-amber-950/30" data-testid="manufacturing-honesty-banner">
          <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          <AlertTitle className="text-amber-900 dark:text-amber-100">
            No signed manufacturers. The ordering flow is currently design-spec capture only.
          </AlertTitle>
          <AlertDescription className="text-amber-900 dark:text-amber-100 mt-2 space-y-2 leading-relaxed">
            <p>
              Every name listed below is a <strong>research candidate</strong> — a
              publicly verifiable real-world company that <em>could</em> plausibly fulfil
              part of this catalogue under the right covenant. None of them have been
              contacted. None of them have agreed to anything. We are not pretending
              they have.
            </p>
            <p>
              The point of publishing this list is to be transparent about the
              cooperative's actual sourcing position, and to invite real conversations.
              If you represent (or know) a manufacturer who could fulfil
              TriSex.org-spec orders under CC&nbsp;BY-SA&nbsp;4.0–compatible terms, the
              self-application form at the bottom of this page is the entry point.
            </p>
          </AlertDescription>
        </Alert>

        {/* The Covenant */}
        <Card className="border-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Scale className="h-6 w-6 text-primary" />
              <CardTitle className="text-2xl font-display">Manufacturing Partner Covenant</CardTitle>
            </div>
            <CardDescription>
              The five conditions any manufacturer must accept to be listed as a verified
              TriSex.org partner. All five are enforced server-side at submission.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              {
                icon: ShieldCheck,
                title: "1. CC BY-SA 4.0 compliance on TriSex.org designs",
                body: "All product designs we send (sizing tables, fold sequences, multi-use balance specs, intersex-variation fitting parameters) remain CC BY-SA 4.0. Any derivative designs the manufacturer creates while fulfilling our orders inherit the same licence and are publicly published.",
              },
              {
                icon: Eye,
                title: "2. Share-alike on derivative designs",
                body: "If the manufacturer adapts, refines, or extends our designs for production (mould tweaks, material substitutions, tolerance corrections), those adaptations are published back to the cooperative under CC BY-SA 4.0 so other forks can use the improvements too.",
              },
              {
                icon: Globe,
                title: "3. Public spec sheets",
                body: "Material composition, dimensions, batch QA pass rates, and ingredient lists are publicly published per SKU. Sliquid-style full disclosure is the cultural baseline. No private formulations behind the cooperative's products.",
              },
              {
                icon: HandHeart,
                title: "4. Fair-labour attestation",
                body: "Production conducted under fair-labour conditions — living wage, freedom of association, no forced or child labour, safe workplace. Third-party audit (B-Corp, Fair Trade, WRAP, or equivalent) preferred but a credible internal attestation is acceptable for pending status.",
              },
              {
                icon: CheckCircle2,
                title: "5. Honesty attestation",
                body: "No fabricated capacity numbers, no fake certifications, no implied partnerships beyond what has actually been agreed in writing. Same rule the rest of the platform runs on.",
              },
            ].map(({ icon: Icon, title, body }) => (
              <div key={title} className="flex items-start gap-3 p-4 rounded-md border bg-muted/30">
                <Icon className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold mb-1">{title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Research candidates */}
        <Card className="border-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Package className="h-6 w-6 text-primary" />
              <CardTitle className="text-2xl font-display">Research Candidates</CardTitle>
            </div>
            <CardDescription>
              Publicly verifiable real-world manufacturers that the cooperative could
              approach. <strong>None have been contacted.</strong> Each entry can be
              cross-checked against the company's own public website (linked).
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {RESEARCH_CANDIDATES.map((c) => (
              <div key={c.name} className="p-4 rounded-md border bg-muted/30 space-y-3" data-testid={`candidate-${c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}>
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-lg">{c.name}</h3>
                    <p className="text-xs text-muted-foreground">{c.country}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="border-amber-500/60 text-amber-700 dark:text-amber-300 text-xs">
                      Research candidate · not contacted
                    </Badge>
                    <a href={c.url} target="_blank" rel="noopener noreferrer" className="text-xs inline-flex items-center gap-1 text-primary hover:underline" aria-label={`${c.name} website (opens in new tab)`}>
                      <ExternalLink className="h-3 w-3" />
                      Website
                    </a>
                  </div>
                </div>
                <div className="grid md:grid-cols-3 gap-3 text-sm">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">What they make</p>
                    <p className="text-foreground/80 leading-snug">{c.whatTheyMake}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">Why a candidate</p>
                    <p className="text-foreground/80 leading-snug">{c.whyCandidate}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">CC BY-SA fit (honest)</p>
                    <p className="text-foreground/80 leading-snug">{c.ccBySaFit}</p>
                  </div>
                </div>
              </div>
            ))}
            <p className="text-xs text-muted-foreground italic pt-2">
              Listing on this page is research, not endorsement. Each company described
              here has its own brand, governance, and policies that are not affiliated
              with TriSex.org.
            </p>
          </CardContent>
        </Card>

        {/* Verified partners (DB-backed) */}
        <Card className="border-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-6 w-6 text-primary" />
              <CardTitle className="text-2xl font-display">Verified Manufacturing Partners</CardTitle>
            </div>
            <CardDescription>
              Submissions that have completed the five attestations and been verified by
              stewards. Empty by default — and we will keep it empty until real partners
              sign on.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading…
              </div>
            ) : partners.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p className="text-sm">
                  No verified manufacturing partners yet. This is the honest state of
                  sourcing today.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {partners.map((p) => (
                  <div key={p.id} className="p-4 rounded-md border bg-muted/30" data-testid={`partner-${p.id}`}>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold">{p.companyName}</h3>
                      <Badge variant={p.status === "verified" ? "default" : "outline"}>
                        {p.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{p.country}</p>
                    <p className="text-sm text-foreground/80">{p.description}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {p.productCategories.map((cat) => (
                        <Badge key={cat} variant="secondary" className="text-xs">{cat}</Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Application form */}
        <Card className="border-2 border-primary/40">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PlusCircle className="h-6 w-6 text-primary" />
                <CardTitle className="text-2xl font-display">Self-Apply as a Manufacturing Partner</CardTitle>
              </div>
              <Button onClick={() => setShowForm(!showForm)} variant="outline" data-testid="button-toggle-manufacturing-form">
                {showForm ? "Hide form" : "Open form"}
              </Button>
            </div>
            <CardDescription>
              For manufacturers (or people authorised to represent one) who can meet all
              five covenant conditions. Entries land as <strong>pending</strong> until
              manually verified by stewards.
            </CardDescription>
          </CardHeader>
          {showForm && (
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit((v) => createMutation.mutate(v))}
                  className="space-y-5"
                >
                  <FormField control={form.control} name="companyName" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company name *</FormLabel>
                      <FormControl><Input {...field} data-testid="input-mfg-company-name" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="country" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country *</FormLabel>
                        <FormControl><Input {...field} data-testid="input-mfg-country" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="websiteUrl" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Public website *</FormLabel>
                        <FormControl><Input type="url" placeholder="https://" {...field} data-testid="input-mfg-website" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>

                  <FormField control={form.control} name="productCategories" render={() => (
                    <FormItem>
                      <FormLabel>Product categories you can fulfil *</FormLabel>
                      <FormDescription>Select every category the company can actually produce today.</FormDescription>
                      <div className="grid sm:grid-cols-2 gap-2 mt-2">
                        {PRODUCT_CATEGORIES.map((cat) => (
                          <FormField key={cat.value} control={form.control} name="productCategories" render={({ field }) => {
                            const checked = field.value?.includes(cat.value);
                            return (
                              <label className="flex items-start gap-2 p-2 rounded-md border hover:bg-muted/40 cursor-pointer">
                                <Checkbox
                                  checked={checked}
                                  onCheckedChange={(c) => {
                                    if (c) field.onChange([...(field.value ?? []), cat.value]);
                                    else field.onChange((field.value ?? []).filter((v: string) => v !== cat.value));
                                  }}
                                  data-testid={`checkbox-mfg-category-${cat.value}`}
                                />
                                <span className="text-sm">{cat.label}</span>
                              </label>
                            );
                          }} />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="organisationType" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Organisation type</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-mfg-org-type"><SelectValue placeholder="Optional — choose if relevant" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {ORG_TYPE_OPTIONS.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="description" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Brief description of your operation *</FormLabel>
                      <FormControl><Textarea rows={4} placeholder="What do you make, at what scale, with what materials, where are your facilities, what certifications do you hold." {...field} data-testid="textarea-mfg-description" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="contactEmail" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact email</FormLabel>
                        <FormControl><Input type="email" {...field} data-testid="input-mfg-contact-email" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="submittedBy" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Submitted by</FormLabel>
                        <FormControl><Input placeholder="Your name / role" {...field} data-testid="input-mfg-submitted-by" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>

                  <FormField control={form.control} name="notes" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional notes</FormLabel>
                      <FormControl><Textarea rows={3} placeholder="Anything relevant we should know — capacity, MOQ, certifications, lead times, prior cooperative work." {...field} data-testid="textarea-mfg-notes" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <div className="space-y-3 p-4 rounded-md border-2 border-primary/40 bg-primary/5">
                    <p className="text-sm font-semibold">All five attestations must be checked to submit.</p>
                    {[
                      { name: "ccBySaCompliance", label: "We accept CC BY-SA 4.0 on all TriSex.org designs we receive and on derivative designs we create while fulfilling orders." },
                      { name: "shareAlikeDesignsAttestation", label: "Any adaptations or refinements we make to TriSex.org designs will be published back under CC BY-SA 4.0." },
                      { name: "publicSpecSheetsAttestation", label: "We will publicly publish material composition, dimensions, batch QA pass rates, and full ingredient lists per SKU." },
                      { name: "fairLabourAttestation", label: "Production is conducted under fair-labour conditions (living wage, freedom of association, no forced or child labour, safe workplace)." },
                      { name: "honestyAttestation", label: "Everything stated in this submission is truthful. No fabricated capacity, no fake certifications, no implied partnerships beyond what has actually been agreed in writing." },
                    ].map(({ name, label }) => (
                      <FormField key={name} control={form.control} name={name as keyof FormValues} render={({ field }) => (
                        <FormItem className="flex items-start gap-2 space-y-0">
                          <FormControl>
                            <Checkbox checked={!!field.value} onCheckedChange={field.onChange} data-testid={`checkbox-mfg-${name}`} />
                          </FormControl>
                          <Label className="text-xs leading-relaxed cursor-pointer">{label}</Label>
                        </FormItem>
                      )} />
                    ))}
                  </div>

                  <Button type="submit" disabled={createMutation.isPending} data-testid="button-submit-mfg" className="w-full">
                    {createMutation.isPending ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Submitting…</> : "Submit application (lands as pending)"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          )}
        </Card>

      </div>
    </div>
  );
}
