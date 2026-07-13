import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { AlertTriangle, HeartHandshake, CheckCircle, Info, Package } from "lucide-react";
import type { MultiUseBalance } from "@shared/schema";

type SexMarker = "AMAB" | "AFAB" | "AXAB";
type RoleBalance = "receptive" | "penetrative" | "versatile";
type ContactZone = "oral" | "anal" | "vaginal" | "frontal" | "neovaginal";
type ProcreativeMode = "barrier-only" | "procreative-permeable" | "fertility-only";

interface PartnerConfig {
  sexMarker: SexMarker;
  roleBalance: RoleBalance;
  contactZones: ContactZone[];
  procreativeMode: ProcreativeMode;
}

const defaultPartner: PartnerConfig = {
  sexMarker: "AXAB",
  roleBalance: "versatile",
  contactZones: [],
  procreativeMode: "barrier-only",
};

const sexMarkerOptions: { value: SexMarker; label: string }[] = [
  { value: "AMAB", label: "AMAB (assigned male at birth)" },
  { value: "AFAB", label: "AFAB (assigned female at birth)" },
  { value: "AXAB", label: "AXAB (intersex / X assignment)" },
];

const roleOptions: { value: RoleBalance; label: string }[] = [
  { value: "receptive", label: "Receptive" },
  { value: "penetrative", label: "Penetrative" },
  { value: "versatile", label: "Versatile" },
];

const zoneOptions: { value: ContactZone; label: string }[] = [
  { value: "oral", label: "Oral" },
  { value: "anal", label: "Anal" },
  { value: "vaginal", label: "Vaginal" },
  { value: "frontal", label: "Frontal" },
  { value: "neovaginal", label: "Neovaginal" },
];

const procreativeOptions: { value: ProcreativeMode; label: string }[] = [
  { value: "barrier-only", label: "Barrier-only (no fluid exchange)" },
  { value: "procreative-permeable", label: "Procreative-permeable" },
  { value: "fertility-only", label: "Fertility-only" },
];

const relationshipOptions = [
  { value: "romance", label: "Romance" },
  { value: "marriage", label: "Marriage" },
  { value: "networking", label: "Networking" },
  { value: "friendship", label: "Friendship" },
];

function buildBalance(p: PartnerConfig, who: string): MultiUseBalance {
  const balanceCode = `${who}:${p.sexMarker}:${p.roleBalance}:${p.contactZones.slice().sort().join("-") || "none"}:${p.procreativeMode}`;
  return {
    roleBalance: p.roleBalance,
    contactZones: p.contactZones,
    procreativeMode: p.procreativeMode,
    affirmingCareStatus: "not-specified",
    intersexVariations: [],
    consultRequiredCount: 0,
    activeFoldId: null,
    balanceCode,
    variationCustomizations: {},
  };
}

function PartnerFields({
  title,
  config,
  onChange,
}: {
  title: string;
  config: PartnerConfig;
  onChange: (next: PartnerConfig) => void;
}) {
  const toggleZone = (zone: ContactZone) => {
    const has = config.contactZones.includes(zone);
    onChange({
      ...config,
      contactZones: has
        ? config.contactZones.filter((z) => z !== zone)
        : [...config.contactZones, zone],
    });
  };

  return (
    <Card className="border-secondary/40">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-1.5 block">Sex marker (recorded birth assignment)</label>
          <Select value={config.sexMarker} onValueChange={(v) => onChange({ ...config, sexMarker: v as SexMarker })}>
            <SelectTrigger data-testid={`select-sexmarker-${title}`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sexMarkerOptions.map((o) => (
                <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium mb-1.5 block">Role balance</label>
          <Select value={config.roleBalance} onValueChange={(v) => onChange({ ...config, roleBalance: v as RoleBalance })}>
            <SelectTrigger data-testid={`select-role-${title}`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {roleOptions.map((o) => (
                <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Contact zones</label>
          <div className="grid grid-cols-2 gap-2">
            {zoneOptions.map((o) => (
              <label key={o.value} className="flex items-center gap-2 text-sm cursor-pointer">
                <Checkbox
                  checked={config.contactZones.includes(o.value)}
                  onCheckedChange={() => toggleZone(o.value)}
                  data-testid={`checkbox-zone-${title}-${o.value}`}
                />
                {o.label}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium mb-1.5 block">Procreative mode</label>
          <Select value={config.procreativeMode} onValueChange={(v) => onChange({ ...config, procreativeMode: v as ProcreativeMode })}>
            <SelectTrigger data-testid={`select-procreative-${title}`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {procreativeOptions.map((o) => (
                <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}

export default function JointProtectionOrder() {
  const { toast } = useToast();
  const [relationshipContext, setRelationshipContext] = useState("romance");
  const [self, setSelf] = useState<PartnerConfig>({ ...defaultPartner });
  const [partner, setPartner] = useState<PartnerConfig>({ ...defaultPartner });
  const [notes, setNotes] = useState("");
  const [mutualConsent, setMutualConsent] = useState(false);
  const [honesty, setHonesty] = useState(false);
  const [confirmation, setConfirmation] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: async () => {
      const orderNumber = `TSO-GP-${Date.now()}`;
      const payload = {
        orderNumber,
        relationshipContext,
        selfSexMarker: self.sexMarker,
        partnerSexMarker: partner.sexMarker,
        selfBalance: buildBalance(self, "self"),
        partnerBalance: buildBalance(partner, "partner"),
        mutualConsentAttestation: mutualConsent,
        honestyAttestation: honesty,
        notes: notes.trim() ? notes.trim() : undefined,
      };
      const res = await apiRequest("POST", "/api/joint-protection-orders", payload);
      return (await res.json()) as { orderNumber: string };
    },
    onSuccess: (data) => {
      setConfirmation(data.orderNumber);
      toast({
        title: "Joint design spec captured",
        description: `Order ${data.orderNumber} recorded as an open-source design specification.`,
      });
    },
    onError: (err: any) => {
      const msg: string = err?.message || "";
      const needsAuth = msg.startsWith("401");
      toast({
        title: needsAuth ? "Please sign in first" : "Could not capture joint order",
        description: needsAuth
          ? "You need to be signed in as a co-operator to capture a joint order."
          : msg || "Please check both attestations and try again.",
        variant: "destructive",
      });
    },
  });

  const canSubmit = mutualConsent && honesty && !mutation.isPending;
  const markersDiffer = self.sexMarker !== partner.sexMarker;

  if (confirmation) {
    return (
      <Card className="border-green-500/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
            <CheckCircle className="h-6 w-6" /> Joint design spec captured
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm">
            Your joint barrier-protection design has been recorded as order{" "}
            <span className="font-mono font-semibold">{confirmation}</span>. Because no
            manufacturing partner has signed on yet, this is captured as an open-source
            CC BY-SA 4.0 design specification for both partners' anatomies — not a shipment.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/manufacturing">
              <Button variant="outline" size="sm" data-testid="link-manufacturing">
                <Package className="h-4 w-4 mr-1.5" /> How sourcing works
              </Button>
            </Link>
            <Link href="/inclusive-ordering">
              <Button variant="outline" size="sm" data-testid="link-inclusive-ordering">
                <Info className="h-4 w-4 mr-1.5" /> Fine-tune a full order
              </Button>
            </Link>
            <Button
              size="sm"
              onClick={() => {
                setConfirmation(null);
                setMutualConsent(false);
                setHonesty(false);
                setNotes("");
              }}
              data-testid="button-new-joint-order"
            >
              Configure another
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Alert className="border-amber-500/50 bg-amber-50 dark:bg-amber-950/30">
        <AlertTriangle className="h-4 w-4 text-amber-600" />
        <AlertDescription className="text-sm">
          <span className="font-semibold">Operational status:</span> No manufacturing
          partner has signed on yet. Every joint order is captured as an open-source
          CC BY-SA 4.0 design specification for both partners — sizing and fit only,
          never a shipment or a charge.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HeartHandshake className="h-5 w-5" /> Joint Protection Order
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Once you've matched with someone, the two of you can capture a single
            barrier-protection design configured for <span className="font-medium">both</span> of
            your anatomies — one side for your fit, one for your partner's. Partners of
            any sex markers are welcome; each side is configured independently.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Relationship context</label>
            <Select value={relationshipContext} onValueChange={setRelationshipContext}>
              <SelectTrigger className="max-w-xs" data-testid="select-relationship-context">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {relationshipOptions.map((o) => (
                  <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <PartnerFields title="Your fit" config={self} onChange={setSelf} />
            <PartnerFields title="Your partner's fit" config={partner} onChange={setPartner} />
          </div>

          {markersDiffer && (
            <Alert className="border-secondary/40">
              <Info className="h-4 w-4" />
              <AlertDescription className="text-sm">
                You've configured two different sex markers. Markers describe recorded
                birth assignment, not anatomy — the fit that matters is the per-side
                role, zones, and procreative mode you set above.
              </AlertDescription>
            </Alert>
          )}

          <div>
            <label className="text-sm font-medium mb-1.5 block">Notes (optional)</label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Anything the design should account for…"
              maxLength={500}
              data-testid="textarea-joint-notes"
            />
          </div>

          <div className="space-y-3 rounded-md border border-border p-4">
            <label className="flex items-start gap-2 text-sm cursor-pointer">
              <Checkbox
                checked={mutualConsent}
                onCheckedChange={(c) => setMutualConsent(c === true)}
                data-testid="checkbox-mutual-consent"
              />
              <span>
                We both consent to this joint order. Both partners have agreed to the
                configuration above together.
              </span>
            </label>
            <label className="flex items-start gap-2 text-sm cursor-pointer">
              <Checkbox
                checked={honesty}
                onCheckedChange={(c) => setHonesty(c === true)}
                data-testid="checkbox-honesty"
              />
              <span>
                The information in this order is honest and accurate to the best of our
                knowledge.
              </span>
            </label>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={() => mutation.mutate()}
              disabled={!canSubmit}
              data-testid="button-submit-joint-order"
            >
              {mutation.isPending ? "Capturing…" : "Capture joint design spec"}
            </Button>
            <Badge variant="secondary">Spec only — no charge</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
