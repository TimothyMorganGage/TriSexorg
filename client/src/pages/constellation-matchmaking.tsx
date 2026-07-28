import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Sparkles,
  ShieldCheck,
  Heart,
  Lock,
  Users,
  Eye,
  EyeOff,
  Info,
  Loader2,
  PlusCircle,
  AlertTriangle,
  MessageSquare,
  KeyRound,
  Check,
  X as XIcon,
  Copy,
  Mail,
} from "lucide-react";
import {
  insertConstellationProfileSchema,
  type ConstellationProfile,
  type ConstellationContactRequest,
} from "@shared/schema";

const RELATIONSHIP_STRUCTURES: Array<{ value: string; label: string; blurb: string }> = [
  { value: "solo-poly", label: "Solo polyamory", blurb: "Multiple partners, no nesting / cohabitation as a relationship anchor." },
  { value: "hierarchical-poly", label: "Hierarchical polyamory", blurb: "Primary / secondary / etc. structure. Optional veto-posture field appears." },
  { value: "non-hierarchical-poly", label: "Non-hierarchical polyamory", blurb: "Multiple partners treated as co-equal; no primary." },
  { value: "relationship-anarchy", label: "Relationship anarchy", blurb: "Each connection negotiated on its own terms; no hierarchy applied across them." },
  { value: "open", label: "Open relationship", blurb: "Anchor pair plus negotiated outside connections." },
  { value: "swinging", label: "Swinging", blurb: "Recreational partner exchange, often within a paired primary structure." },
  { value: "monogamish", label: "Monogamish", blurb: "Mostly monogamous with explicit, negotiated exceptions." },
  { value: "unsure-exploring", label: "Unsure / exploring", blurb: "Figuring it out. Valid; no pressure to pick a label." },
];

const METAMOUR_PREFS: Array<{ value: string; label: string; blurb: string }> = [
  { value: "kitchen-table", label: "Kitchen-table", blurb: "Want to know and meet metamours; whole-polycule social closeness." },
  { value: "parallel", label: "Parallel", blurb: "Aware they exist, no contact required; partners run side-by-side." },
  { value: "garden-party", label: "Garden-party", blurb: "Occasional, low-key metamour contact at shared events." },
  { value: "dadt", label: "DADT (don't ask / don't tell)", blurb: "No information exchanged about other partners. Higher operational risk; surfaced here for honesty, not endorsement." },
];

const CONSENT_CADENCES: Array<{ value: string; label: string }> = [
  { value: "immediately", label: "Immediately — disclose any new partner before sexual contact" },
  { value: "weekly", label: "Weekly check-in cadence" },
  { value: "case-by-case", label: "Case-by-case as negotiated per partner" },
  { value: "never-required", label: "Not required by my current agreements" },
];

const STI_CADENCES: Array<{ value: string; label: string }> = [
  { value: "every-3-months", label: "Every 3 months (recommended default for active polycules)" },
  { value: "every-6-months", label: "Every 6 months" },
  { value: "every-12-months", label: "Every 12 months" },
  { value: "after-each-new-partner", label: "After each new sexual partner" },
];

const BARRIER_POSTURES: Array<{ value: string; label: string }> = [
  { value: "barriers-with-all", label: "Barriers with all partners" },
  { value: "barriers-with-non-fluid-bonded", label: "Barriers with non-fluid-bonded partners only" },
  { value: "case-by-case", label: "Case-by-case negotiation per partner" },
  { value: "prefer-not-to-disclose", label: "Prefer not to disclose here" },
];

const VISIBILITY_OPTIONS: Array<{ value: string; label: string; icon: typeof Eye }> = [
  { value: "nobody", label: "Nobody — profile hidden by default, only contactable manually", icon: EyeOff },
  { value: "matched-partners-only", label: "Matched partners only (after a mutual match)", icon: Lock },
  { value: "declared-metamours", label: "Declared metamours of partners I'm matched with", icon: Users },
  { value: "cooperative-members", label: "All verified cooperative members", icon: Eye },
];

type FormValues = {
  displayName: string;
  pronouns: string;
  ageRangeMin: number;
  ageRangeMax: number;
  relationshipStructure: string;
  currentPartnerCount: number | null;
  metamourDisclosurePreference: string;
  hierarchyPosture: string;
  consentDisclosureCadence: string;
  stiTestingCadenceCommitment: string;
  barrierUsePosture: string;
  polyculeVisibility: string;
  vetoPosture: string;
  notLookingFor: string;
  bio: string;
  contactHandle: string;
  metamourDisclosureAttestation: boolean;
  stiCadenceAttestation: boolean;
  noOutingAttestation: boolean;
  honestyAttestation: boolean;
  consentToBeContacted: boolean;
};

const STRUCTURE_LABEL = (v: string) => RELATIONSHIP_STRUCTURES.find((r) => r.value === v)?.label ?? v;
const METAMOUR_LABEL = (v: string) => METAMOUR_PREFS.find((r) => r.value === v)?.label ?? v;

export default function ConstellationPeople() {
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [revealedManageToken, setRevealedManageToken] = useState<string | null>(null);
  const [revealedRequesterToken, setRevealedRequesterToken] = useState<string | null>(null);
  const [contactDialogProfile, setContactDialogProfile] = useState<ConstellationProfile | null>(null);
  const [contactForm, setContactForm] = useState({
    requesterDisplayName: "",
    requesterContactHandle: "",
    message: "",
    honestyAttestation: false,
    noOutingAttestation: false,
  });
  const [manageTokenInput, setManageTokenInput] = useState("");
  const [activeManageToken, setActiveManageToken] = useState<string | null>(null);
  const [requesterTokenInput, setRequesterTokenInput] = useState("");
  const [activeRequesterToken, setActiveRequesterToken] = useState<string | null>(null);

  const copy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({ title: `${label} copied`, description: "Save it somewhere safe — it won't be shown again." });
    } catch {
      toast({ title: "Copy failed", description: "Select the token and copy manually.", variant: "destructive" });
    }
  };

  const { data: profiles = [], isLoading } = useQuery<ConstellationProfile[]>({
    queryKey: ["/api/constellation-profiles"],
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(insertConstellationProfileSchema) as never,
    defaultValues: {
      displayName: "",
      pronouns: "",
      ageRangeMin: 18,
      ageRangeMax: 22,
      relationshipStructure: "",
      currentPartnerCount: null,
      metamourDisclosurePreference: "",
      hierarchyPosture: "",
      consentDisclosureCadence: "",
      stiTestingCadenceCommitment: "",
      barrierUsePosture: "",
      polyculeVisibility: "matched-partners-only",
      vetoPosture: "",
      notLookingFor: "",
      bio: "",
      contactHandle: "",
      metamourDisclosureAttestation: false,
      stiCadenceAttestation: false,
      noOutingAttestation: false,
      honestyAttestation: false,
      consentToBeContacted: false,
    },
  });

  const structure = form.watch("relationshipStructure");
  const showHierarchy = structure === "hierarchical-poly";

  const createMutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const payload = {
        ...values,
        pronouns: values.pronouns.trim() || null,
        hierarchyPosture: showHierarchy ? values.hierarchyPosture.trim() || null : null,
        vetoPosture: showHierarchy ? values.vetoPosture.trim() || null : null,
        bio: values.bio.trim() || null,
        contactHandle: values.contactHandle.trim() || null,
        currentPartnerCount:
          typeof values.currentPartnerCount === "number" && !Number.isNaN(values.currentPartnerCount)
            ? values.currentPartnerCount
            : null,
      };
      const res = await apiRequest("POST", "/api/constellation-profiles", payload);
      return (await res.json()) as { id: number; status: string; manageToken: string };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/constellation-profiles"] });
      setRevealedManageToken(data.manageToken);
      toast({
        title: "Profile submitted (pending)",
        description: "Save your one-time management token before closing this page.",
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

  // Contact-request mutation (per-match consent gate)
  const contactMutation = useMutation({
    mutationFn: async ({ profileId, body }: { profileId: number; body: typeof contactForm }) => {
      const res = await apiRequest("POST", `/api/constellation-profiles/${profileId}/contact-requests`, body);
      return (await res.json()) as { id: number; status: string; requesterToken: string };
    },
    onSuccess: (data) => {
      setRevealedRequesterToken(data.requesterToken);
      setContactDialogProfile(null);
      setContactForm({
        requesterDisplayName: "",
        requesterContactHandle: "",
        message: "",
        honestyAttestation: false,
        noOutingAttestation: false,
      });
      toast({ title: "Request submitted", description: "Save your requester token to poll status later." });
    },
    onError: (err: any) => {
      toast({ title: "Request failed", description: err?.message ?? "Please retry.", variant: "destructive" });
    },
  });

  // Owner-side: load manage view by token.
  const manageView = useQuery<{ profile: ConstellationProfile; requests: ConstellationContactRequest[] }>({
    queryKey: [`/api/constellation-profiles/manage/${activeManageToken}`],
    enabled: !!activeManageToken,
  });

  const decideMutation = useMutation({
    mutationFn: async ({ requestId, action }: { requestId: number; action: "accept" | "decline" }) => {
      const res = await apiRequest(
        "POST",
        `/api/constellation-profiles/manage/${activeManageToken}/requests/${requestId}`,
        { action },
      );
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/constellation-profiles/manage/${activeManageToken}`] });
    },
  });

  // Requester-side: poll status by requesterToken.
  const requesterStatus = useQuery<{
    id: number;
    status: string;
    targetProfileId: number;
    ownerDisplayName: string | null;
    ownerContactHandle: string | null;
  }>({
    queryKey: [`/api/constellation-contact-requests/${activeRequesterToken}`],
    enabled: !!activeRequesterToken,
  });

  // Per-page SEO: title + meta description while this page is mounted.
  useEffect(() => {
    const previousTitle = document.title;
    document.title =
      "Constellation Matchmaking — Ethical Non-Monogamy Dating with Consent-First Spiritual Justice | TriSex.org";
    const meta = document.querySelector('meta[name="description"]');
    const previousDescription = meta?.getAttribute("content") ?? null;
    meta?.setAttribute(
      "content",
      "Consent-first matchmaking for polyamorous, open, and relationship-anarchist community. No algorithms, no outing, no fabricated profiles — connection held to spiritual justice: consent as sacred, honesty as covenant.",
    );
    return () => {
      document.title = previousTitle;
      if (previousDescription !== null) meta?.setAttribute("content", previousDescription);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Intersex Healthcare Affirmation — shared frame across matchmaking surfaces */}
        <Alert className="bg-white dark:bg-gray-950 border-2 border-black dark:border-white">
          <Heart className="h-5 w-5 text-black dark:text-white" />
          <AlertDescription className="ml-2 text-black dark:text-white">
            <strong>Intersex Healthcare IS Everyone's Affirmation:</strong> This sibling
            surface centers intersex anatomy as the universal baseline. Trans,
            non-binary, genderqueer, and quare embodiment are all respected by design.
          </AlertDescription>
        </Alert>

        {/* Header */}
        <div className="text-center space-y-3">
          <Badge className="bg-primary/15 text-primary border border-primary/30">
            <Sparkles className="w-3 h-3 mr-1" /> Matchmaking with Spiritual Justice · CC BY-SA 4.0
          </Badge>
          <h1 className="text-4xl font-bold font-display">Constellation Matchmaking</h1>
          <p className="text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Many stars, one sky. Constellation Matchmaking treats connection as a
            practice of <strong>spiritual justice</strong>: consent held as sacred,
            honesty as covenant, and no one's existence disclosed without their
            blessing. It serves members whose love takes the shape of a constellation —
            polyamorous, open, monogamish, relationship-anarchist, or simply
            many-connected. Sibling to{" "}
            <a href="/good-people" className="underline">Good People</a> (which is
            monogamy-only by design); the two surfaces are kept honestly separate
            rather than pretending one tuning fits both.
          </p>
          <p className="text-xs text-muted-foreground max-w-2xl mx-auto">
            Honesty note: "magic" here means the care in the ritual — the consent
            gates, the covenants, the protection of every member's privacy. There is no
            algorithmic matching, no compatibility scoring, and no supernatural claim.
          </p>
        </div>

        {/* Honesty banner */}
        <Alert className="border-2 border-amber-500/60 bg-amber-50 dark:bg-amber-950/30" data-testid="poly-honesty-banner">
          <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          <AlertTitle className="text-amber-900 dark:text-amber-100">
            Empty by default. No fabricated profiles. No synthetic matches.
          </AlertTitle>
          <AlertDescription className="ml-0 mt-2 text-amber-900 dark:text-amber-100 leading-relaxed space-y-2">
            <p>
              The directory below is empty until real members submit. There are no
              seeded profiles, no decorative "23 polyamorous members near you" counters,
              and no inferred profiles built from anyone's behaviour. Submissions land
              as <strong>pending</strong> and are reviewed by stewards before they
              appear publicly.
            </p>
            <p>
              <strong>What is never shown to other members without an explicit per-match
              toggle:</strong> your current partner count, your contact handle, your
              precise location, and any field you skipped. Poly status is grounds for
              custody loss in some jurisdictions; this platform treats outing as the
              real-world harm it is.
            </p>
          </AlertDescription>
        </Alert>

        {/* Two-surface boundary card */}
        <Card className="border-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Info className="h-5 w-5 text-primary" />
              <CardTitle className="text-xl font-display">How this surface differs from Good People</CardTitle>
            </div>
            <CardDescription>
              Operational differences, not moral ones. The infrastructure is different
              because the relationship structures are different.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="p-4 rounded-md border bg-muted/30">
                <h3 className="font-semibold mb-2">Good People (/good-people)</h3>
                <ul className="space-y-1 text-muted-foreground leading-relaxed">
                  <li>• Closed-dyad assumptions throughout</li>
                  <li>• 2-year age-range cap, hard-coded</li>
                  <li>• Monthly STI screening default</li>
                  <li>• Progressive-stage barrier work optimised for two people</li>
                  <li>• No metamour disclosure tooling</li>
                  <li>• Genealogical verification (GEDCOM) prevents incest within 8 degrees</li>
                </ul>
              </div>
              <div className="p-4 rounded-md border-2 border-primary/40 bg-primary/5">
                <h3 className="font-semibold mb-2">Constellation People (here)</h3>
                <ul className="space-y-1 text-muted-foreground leading-relaxed">
                  <li>• Continuous-exposure risk modelling</li>
                  <li>• ±2-year age-range cap (max − min ≤ 4, minimum ≥ 18), hard-coded — matches Good People</li>
                  <li>• Shorter STI testing cadence options (every 3 / 6 / 12 months / after each new partner)</li>
                  <li>• Metamour disclosure preference: kitchen-table / parallel / garden-party / DADT</li>
                  <li>• Consent disclosure cadence and barrier posture declared up-front</li>
                  <li>• Optional hierarchy & veto posture (only for hierarchical-poly)</li>
                  <li>• Polycule visibility chosen by you, default most-private</li>
                </ul>
              </div>
            </div>
            <p className="text-xs text-muted-foreground italic pt-3">
              A member uses one surface at a time. Cross-surface profile mirroring is
              not provided. See{" "}
              <a href="/monogamy-economics" className="underline">/monogamy-economics</a>{" "}
              for the operational-scope reasoning.
            </p>
          </CardContent>
        </Card>

        {/* Data-collection promises */}
        <Card className="border-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <CardTitle className="text-xl font-display">How we handle your data</CardTitle>
            </div>
            <CardDescription>The promises that govern every field on the form below.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed">
              <li><strong className="text-foreground">Opt-in per field.</strong> Skipping is always allowed. Sparse profiles are valid; the directory must work for people who only share a little.</li>
              <li><strong className="text-foreground">Self-declared, not inferred.</strong> We never derive your relationship structure from your behaviour or partner data. We always ask.</li>
              <li><strong className="text-foreground">No outing.</strong> Partner count and contact handle are stripped from the directory feed entirely. They are only revealed after you toggle disclosure on a specific match.</li>
              <li><strong className="text-foreground">Retention minimisation.</strong> Old partner counts are aged out on a 12-month rolling window unless you explicitly pin them for STI-network use.</li>
              <li><strong className="text-foreground">Honest empty state.</strong> No fabricated members. The directory says "empty" when it is empty.</li>
              <li><strong className="text-foreground">Server-enforced attestations.</strong> Five checkboxes (metamour-disclosure posture, STI cadence commitment, no-outing of other members, honesty, consent to be contacted) are validated server-side; a submission that misses any of them is rejected with a 400.</li>
            </ul>
          </CardContent>
        </Card>

        {/* Directory */}
        <Card className="border-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <CardTitle className="text-xl font-display">Active profiles</CardTitle>
            </div>
            <CardDescription>
              The directory stays empty until real members submit. Pending submissions
              are not shown.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading…
              </div>
            ) : profiles.length === 0 ? (
              <div className="py-8 space-y-4">
                <p className="text-sm text-center text-muted-foreground">
                  No active profiles yet. This is the honest state of the directory today.
                </p>
                <div className="text-xs text-muted-foreground bg-muted/30 border rounded-md p-3 max-w-xl mx-auto space-y-2">
                  <p>
                    <strong>Already submitted?</strong> Use the sections below this card to manage what you've
                    started — they work even while the directory is empty:
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>
                      <strong>Owners</strong> — paste your one-time management token in
                      {" "}<em>"Manage my profile (owner)"</em> to see and act on incoming contact requests.
                    </li>
                    <li>
                      <strong>Requesters</strong> — paste your one-time requester token in
                      {" "}<em>"Check my request status"</em> to see if the recipient has accepted yet.
                    </li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {profiles.map((p) => (
                  <div key={p.id} className="p-4 rounded-md border bg-muted/30 space-y-2" data-testid={`profile-${p.id}`}>
                    <div className="flex justify-between items-start gap-2 flex-wrap">
                      <div>
                        <h3 className="font-semibold">{p.displayName}{p.pronouns ? <span className="text-xs text-muted-foreground ml-2">({p.pronouns})</span> : null}</h3>
                        <p className="text-xs text-muted-foreground">Age range sought: {p.ageRangeMin}–{p.ageRangeMax}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{STRUCTURE_LABEL(p.relationshipStructure)}</Badge>
                        <Button size="sm" variant="outline" onClick={() => setContactDialogProfile(p)} data-testid={`button-request-${p.id}`}>
                          <MessageSquare className="h-3.5 w-3.5 mr-1" /> Request to connect
                        </Button>
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-2 text-xs">
                      <p><strong>Metamour preference:</strong> {METAMOUR_LABEL(p.metamourDisclosurePreference)}</p>
                      <p><strong>STI cadence:</strong> {p.stiTestingCadenceCommitment.replace(/-/g, " ")}</p>
                      <p><strong>Barrier posture:</strong> {p.barrierUsePosture.replace(/-/g, " ")}</p>
                      <p><strong>Consent disclosure:</strong> {p.consentDisclosureCadence.replace(/-/g, " ")}</p>
                    </div>
                    {p.bio && <p className="text-sm text-foreground/80 leading-relaxed">{p.bio}</p>}
                    {p.notLookingFor && (
                      <p className="text-xs text-muted-foreground"><strong>Not looking for:</strong> {p.notLookingFor}</p>
                    )}
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
                <PlusCircle className="h-5 w-5 text-primary" />
                <CardTitle className="text-xl font-display">Submit your profile</CardTitle>
              </div>
              <Button onClick={() => setShowForm(!showForm)} variant="outline" data-testid="button-toggle-poly-form">
                {showForm ? "Hide form" : "Open form"}
              </Button>
            </div>
            <CardDescription>
              Every field below is opt-in except the ones marked with *. Submissions
              land as <strong>pending</strong> until manually reviewed by stewards.
            </CardDescription>
          </CardHeader>
          {showForm && (
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit((v) => createMutation.mutate(v))}
                  className="space-y-5"
                >
                  <FormField control={form.control} name="displayName" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Display name *</FormLabel>
                      <FormControl><Input {...field} data-testid="input-poly-display-name" /></FormControl>
                      <FormDescription>How you'd like to appear in the directory. Doesn't need to be your legal name.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="pronouns" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pronouns</FormLabel>
                      <FormControl><Input placeholder="optional — e.g. they/them, she/her, ze/zir" {...field} data-testid="input-poly-pronouns" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="relationshipStructure" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Relationship structure *</FormLabel>
                      <FormDescription>Self-declared. Free to change at any time.</FormDescription>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-poly-structure"><SelectValue placeholder="Choose how you describe your relationship structure" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {RELATIONSHIP_STRUCTURES.map((s) => (
                            <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {field.value && (
                        <p className="text-xs text-muted-foreground mt-1 italic">{RELATIONSHIP_STRUCTURES.find((s) => s.value === field.value)?.blurb}</p>
                      )}
                      <FormMessage />
                    </FormItem>
                  )} />

                  {showHierarchy && (
                    <div className="grid md:grid-cols-2 gap-4 p-4 rounded-md border bg-muted/30">
                      <FormField control={form.control} name="hierarchyPosture" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Hierarchy posture</FormLabel>
                          <FormControl><Input placeholder="open to being a primary / secondary / nesting / non-nesting / comet — your own words" {...field} data-testid="input-poly-hierarchy" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="vetoPosture" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Veto posture</FormLabel>
                          <FormControl><Input placeholder="veto rights for existing partners? — your own framing" {...field} data-testid="input-poly-veto" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                  )}

                  <FormField control={form.control} name="metamourDisclosurePreference" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Metamour disclosure preference *</FormLabel>
                      <FormDescription>How much contact you want with your partners' other partners.</FormDescription>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-poly-metamour"><SelectValue placeholder="Choose your metamour posture" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {METAMOUR_PREFS.map((s) => (
                            <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {field.value && (
                        <p className="text-xs text-muted-foreground mt-1 italic">{METAMOUR_PREFS.find((s) => s.value === field.value)?.blurb}</p>
                      )}
                      <FormMessage />
                    </FormItem>
                  )} />

                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="consentDisclosureCadence" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Consent disclosure cadence *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-poly-consent-cadence"><SelectValue placeholder="How often you disclose new partners to existing ones" /></SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {CONSENT_CADENCES.map((s) => (
                              <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="stiTestingCadenceCommitment" render={({ field }) => (
                      <FormItem>
                        <FormLabel>STI testing cadence commitment *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-poly-sti-cadence"><SelectValue placeholder="How often you commit to test" /></SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {STI_CADENCES.map((s) => (
                              <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>

                  <FormField control={form.control} name="barrierUsePosture" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Barrier-use posture across the polycule *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-poly-barrier"><SelectValue placeholder="Declared, not enforced" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {BARRIER_POSTURES.map((s) => (
                            <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>Feeds into the TriSexPort partner-network lattice if you opt in.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="polyculeVisibility" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Polycule visibility *</FormLabel>
                      <FormDescription>Who can see that you're on this surface. Default is most-private.</FormDescription>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-poly-visibility"><SelectValue /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {VISIBILITY_OPTIONS.map((s) => (
                            <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="ageRangeMin" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Age range — minimum *</FormLabel>
                        <FormControl>
                          <Input type="number" min={18} {...field} onChange={(e) => field.onChange(parseInt(e.target.value, 10))} data-testid="input-poly-age-min" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="ageRangeMax" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Age range — maximum *</FormLabel>
                        <FormControl>
                          <Input type="number" min={18} {...field} onChange={(e) => field.onChange(parseInt(e.target.value, 10))} data-testid="input-poly-age-max" />
                        </FormControl>
                        <FormDescription>±2-year cap from the minimum you choose. Maximum − minimum must be ≤ 4. Minimum must be ≥ 18. Same cap as Good People.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>

                  <FormField control={form.control} name="currentPartnerCount" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current partner count</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          placeholder="optional — leave blank for 'prefer not to say'"
                          value={field.value ?? ""}
                          onChange={(e) => {
                            const v = e.target.value;
                            field.onChange(v === "" ? null : parseInt(v, 10));
                          }}
                          data-testid="input-poly-partner-count"
                        />
                      </FormControl>
                      <FormDescription>
                        Stored privately for your own STI-network risk modelling. <strong>Never shown to other
                        members.</strong> Skip this if you'd prefer.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="notLookingFor" render={({ field }) => (
                    <FormItem>
                      <FormLabel>What you're not looking for *</FormLabel>
                      <FormControl><Textarea rows={3} placeholder="e.g. no triads, no closed polycules, no DADT, no hierarchy, no fluid-bonding asks early on…" {...field} data-testid="textarea-poly-not-looking-for" /></FormControl>
                      <FormDescription>At least as important as what you are looking for. Free text.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="bio" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bio</FormLabel>
                      <FormControl><Textarea rows={4} placeholder="optional — anything you'd like potential matches to know" {...field} data-testid="textarea-poly-bio" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="contactHandle" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact handle</FormLabel>
                      <FormControl><Input placeholder="optional — Signal / Matrix / email of your choice" {...field} data-testid="input-poly-contact" /></FormControl>
                      <FormDescription>
                        Stored privately. <strong>Never returned by the public directory feed.</strong>
                        Released only through the per-match consent gate below: another member requests to
                        connect, and your handle is revealed to them only if you accept.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <div className="space-y-3 p-4 rounded-md border-2 border-primary/40 bg-primary/5">
                    <p className="text-sm font-semibold">All five attestations must be checked to submit.</p>
                    {[
                      { name: "metamourDisclosureAttestation", label: "The metamour-disclosure preference I have selected is my actual current posture and I will honour it in good faith." },
                      { name: "stiCadenceAttestation", label: "I commit to the STI testing cadence I selected and will update my profile if my cadence changes." },
                      { name: "noOutingAttestation", label: "I will not out other members of this surface — not by linking profiles, screenshotting, sharing partner counts, or cross-posting their existence to monogamy-only spaces, partners, family, or any third party." },
                      { name: "honestyAttestation", label: "Everything in this profile is truthful. No fabricated partner counts, no exaggerated postures, no claims I cannot back up." },
                      { name: "consentToBeContacted", label: "I consent to receive contact requests through the per-match consent gate. I understand my contact handle is not exposed in the directory itself and is revealed to a requester only if I accept their request." },
                    ].map(({ name, label }) => (
                      <FormField key={name} control={form.control} name={name as keyof FormValues} render={({ field }) => (
                        <FormItem className="flex items-start gap-2 space-y-0">
                          <FormControl>
                            <Checkbox checked={!!field.value} onCheckedChange={field.onChange} data-testid={`checkbox-poly-${name}`} />
                          </FormControl>
                          <Label className="text-xs leading-relaxed cursor-pointer">{label}</Label>
                        </FormItem>
                      )} />
                    ))}
                  </div>

                  <Button type="submit" disabled={createMutation.isPending} data-testid="button-submit-poly" className="w-full">
                    {createMutation.isPending ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Submitting…</> : "Submit profile (lands as pending)"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          )}
        </Card>

        {/* Owner side: manage my requests via manageToken */}
        <Card className="border-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <KeyRound className="h-5 w-5 text-primary" />
              <CardTitle className="text-xl font-display">Manage my profile (owner)</CardTitle>
            </div>
            <CardDescription>
              Paste the one-time management token you received when submitting your profile to see and act on
              contact requests. Honest scope: the token is stored server-side (in plain form) so the server can
              recognise it, shown to you exactly once at submission, and never returned by any public endpoint —
              treat it like a password.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                placeholder="Paste manage token (UUID)"
                value={manageTokenInput}
                onChange={(e) => setManageTokenInput(e.target.value)}
                data-testid="input-manage-token"
              />
              <Button
                onClick={() => setActiveManageToken(manageTokenInput.trim() || null)}
                disabled={!manageTokenInput.trim()}
                data-testid="button-load-manage"
              >
                Load my requests
              </Button>
              {activeManageToken && (
                <Button variant="outline" onClick={() => { setActiveManageToken(null); setManageTokenInput(""); }}>
                  Clear
                </Button>
              )}
            </div>
            {activeManageToken && manageView.isLoading && (
              <p className="text-sm text-muted-foreground flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Loading…</p>
            )}
            {activeManageToken && manageView.isError && (
              <Alert variant="destructive"><AlertDescription>Invalid management token, or no profile matches it.</AlertDescription></Alert>
            )}
            {manageView.data && (
              <div className="space-y-3">
                <div className="p-3 rounded-md border bg-muted/20 text-sm">
                  <p><strong>Profile:</strong> {manageView.data.profile.displayName}</p>
                  <p className="text-xs text-muted-foreground">Status: <Badge variant="outline">{manageView.data.profile.status}</Badge></p>
                </div>
                {manageView.data.requests.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">No contact requests yet.</p>
                ) : (
                  manageView.data.requests.map((r) => (
                    <div key={r.id} className="p-3 rounded-md border space-y-2" data-testid={`manage-request-${r.id}`}>
                      <div className="flex justify-between items-start flex-wrap gap-2">
                        <div>
                          <p className="font-semibold text-sm">{r.requesterDisplayName}</p>
                          <p className="text-xs text-muted-foreground">Submitted: {new Date(r.createdAt as any).toLocaleString()}</p>
                        </div>
                        <Badge variant={r.status === "accepted" ? "default" : r.status === "declined" ? "destructive" : "outline"}>
                          {r.status}
                        </Badge>
                      </div>
                      {r.message && <p className="text-sm text-foreground/80">{r.message}</p>}
                      {r.status === "accepted" && (
                        <div className="text-xs p-2 rounded bg-primary/10 border border-primary/30 flex items-center gap-2">
                          <Mail className="h-3.5 w-3.5" />
                          <span>Their contact handle: <strong>{r.requesterContactHandle}</strong></span>
                        </div>
                      )}
                      {r.status === "pending" && (
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => decideMutation.mutate({ requestId: r.id, action: "accept" })} disabled={decideMutation.isPending} data-testid={`button-accept-${r.id}`}>
                            <Check className="h-3.5 w-3.5 mr-1" /> Accept
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => decideMutation.mutate({ requestId: r.id, action: "decline" })} disabled={decideMutation.isPending} data-testid={`button-decline-${r.id}`}>
                            <XIcon className="h-3.5 w-3.5 mr-1" /> Decline
                          </Button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Requester side: check status by requesterToken */}
        <Card className="border-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <KeyRound className="h-5 w-5 text-primary" />
              <CardTitle className="text-xl font-display">Check my request status</CardTitle>
            </div>
            <CardDescription>
              If you submitted a contact request, paste the requester token you were given to see whether the
              recipient has accepted. The recipient's contact handle is revealed only after they accept.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                placeholder="Paste requester token (UUID)"
                value={requesterTokenInput}
                onChange={(e) => setRequesterTokenInput(e.target.value)}
                data-testid="input-requester-token"
              />
              <Button
                onClick={() => setActiveRequesterToken(requesterTokenInput.trim() || null)}
                disabled={!requesterTokenInput.trim()}
                data-testid="button-check-status"
              >
                Check status
              </Button>
              {activeRequesterToken && (
                <Button variant="outline" onClick={() => { setActiveRequesterToken(null); setRequesterTokenInput(""); }}>
                  Clear
                </Button>
              )}
            </div>
            {activeRequesterToken && requesterStatus.isLoading && (
              <p className="text-sm text-muted-foreground flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Loading…</p>
            )}
            {activeRequesterToken && requesterStatus.isError && (
              <Alert variant="destructive"><AlertDescription>Invalid requester token.</AlertDescription></Alert>
            )}
            {requesterStatus.data && (
              <div className="p-3 rounded-md border space-y-2" data-testid="requester-status-display">
                <p className="text-sm">Status: <Badge variant={requesterStatus.data.status === "accepted" ? "default" : requesterStatus.data.status === "declined" ? "destructive" : "outline"}>{requesterStatus.data.status}</Badge></p>
                {requesterStatus.data.status === "accepted" && requesterStatus.data.ownerContactHandle ? (
                  <div className="text-xs p-2 rounded bg-primary/10 border border-primary/30 flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5" />
                    <span>
                      <strong>{requesterStatus.data.ownerDisplayName}</strong> has accepted. Their contact handle:{" "}
                      <strong>{requesterStatus.data.ownerContactHandle}</strong>
                    </span>
                  </div>
                ) : requesterStatus.data.status === "declined" ? (
                  <p className="text-xs text-muted-foreground">The recipient has declined this request. Please respect their decision.</p>
                ) : (
                  <p className="text-xs text-muted-foreground">Still pending. Check back later — the recipient has not acted yet.</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

      </div>

      {/* Per-match contact-request Dialog */}
      <Dialog open={!!contactDialogProfile} onOpenChange={(open) => { if (!open) setContactDialogProfile(null); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Request to connect with {contactDialogProfile?.displayName}</DialogTitle>
            <DialogDescription>
              Your contact handle is stored privately and is <strong>only</strong> revealed to{" "}
              {contactDialogProfile?.displayName} if they accept. They are never shown your name or handle
              unless you submit this form.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label className="text-sm">Your display name *</Label>
              <Input
                value={contactForm.requesterDisplayName}
                onChange={(e) => setContactForm({ ...contactForm, requesterDisplayName: e.target.value })}
                data-testid="input-contact-display-name"
              />
            </div>
            <div>
              <Label className="text-sm">Your contact handle *</Label>
              <Input
                placeholder="Signal / Matrix / email of your choice"
                value={contactForm.requesterContactHandle}
                onChange={(e) => setContactForm({ ...contactForm, requesterContactHandle: e.target.value })}
                data-testid="input-contact-handle"
              />
            </div>
            <div>
              <Label className="text-sm">Short message (optional)</Label>
              <Textarea
                rows={3}
                value={contactForm.message}
                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                data-testid="textarea-contact-message"
              />
            </div>
            <div className="space-y-2 p-3 rounded-md border-2 border-primary/40 bg-primary/5">
              <div className="flex items-start gap-2">
                <Checkbox
                  checked={contactForm.honestyAttestation}
                  onCheckedChange={(v) => setContactForm({ ...contactForm, honestyAttestation: !!v })}
                  data-testid="checkbox-contact-honesty"
                />
                <Label className="text-xs leading-relaxed cursor-pointer">
                  The display name and contact handle above are mine. I am not impersonating anyone.
                </Label>
              </div>
              <div className="flex items-start gap-2">
                <Checkbox
                  checked={contactForm.noOutingAttestation}
                  onCheckedChange={(v) => setContactForm({ ...contactForm, noOutingAttestation: !!v })}
                  data-testid="checkbox-contact-no-outing"
                />
                <Label className="text-xs leading-relaxed cursor-pointer">
                  I will not out this member — not by screenshotting, linking their profile, or sharing their
                  existence on this surface to anyone, regardless of whether they accept or decline.
                </Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setContactDialogProfile(null)}>Cancel</Button>
            <Button
              onClick={() => contactDialogProfile && contactMutation.mutate({ profileId: contactDialogProfile.id, body: contactForm })}
              disabled={
                contactMutation.isPending ||
                !contactForm.requesterDisplayName.trim() ||
                !contactForm.requesterContactHandle.trim() ||
                !contactForm.honestyAttestation ||
                !contactForm.noOutingAttestation
              }
              data-testid="button-submit-contact-request"
            >
              {contactMutation.isPending ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Submitting…</> : "Submit request"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* One-time manageToken reveal */}
      <Dialog open={!!revealedManageToken} onOpenChange={(open) => { if (!open) setRevealedManageToken(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><KeyRound className="h-5 w-5" /> Your one-time management token</DialogTitle>
            <DialogDescription>
              This token is shown <strong>once</strong>. Copy it now and store it somewhere only you can access
              (password manager, encrypted note). You will need it to view and accept contact requests once
              stewards approve your profile. Losing it means you cannot manage your profile.
            </DialogDescription>
          </DialogHeader>
          {revealedManageToken && (
            <div className="space-y-3">
              <div className="p-3 rounded border bg-muted/30 font-mono text-xs break-all" data-testid="revealed-manage-token">
                {revealedManageToken}
              </div>
              <Button onClick={() => copy(revealedManageToken, "Manage token")} className="w-full" data-testid="button-copy-manage-token">
                <Copy className="h-4 w-4 mr-2" /> Copy to clipboard
              </Button>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setRevealedManageToken(null)}>I've saved it — close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* One-time requesterToken reveal */}
      <Dialog open={!!revealedRequesterToken} onOpenChange={(open) => { if (!open) setRevealedRequesterToken(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><KeyRound className="h-5 w-5" /> Your one-time requester token</DialogTitle>
            <DialogDescription>
              This token is shown <strong>once</strong>. Copy it now. You will use it later in the
              "Check my request status" section to see if the recipient has accepted. Their contact handle is
              only revealed to you on acceptance.
            </DialogDescription>
          </DialogHeader>
          {revealedRequesterToken && (
            <div className="space-y-3">
              <div className="p-3 rounded border bg-muted/30 font-mono text-xs break-all" data-testid="revealed-requester-token">
                {revealedRequesterToken}
              </div>
              <Button onClick={() => copy(revealedRequesterToken, "Requester token")} className="w-full" data-testid="button-copy-requester-token">
                <Copy className="h-4 w-4 mr-2" /> Copy to clipboard
              </Button>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setRevealedRequesterToken(null)}>I've saved it — close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
