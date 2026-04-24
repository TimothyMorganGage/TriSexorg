import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, Shield, Network, Trash2, Plus, Loader2, Lock, Heart } from "lucide-react";
import type { TrisexportPartnerSlot } from "@shared/schema";

const BARRIER_OPTIONS = [
  { v: "full", label: "Full barriers throughout", color: "bg-green-500" },
  { v: "partial", label: "Partial / some acts unbarriered", color: "bg-amber-500" },
  { v: "none", label: "No barriers", color: "bg-red-500" },
  { v: "unknown", label: "Unclear / can't recall", color: "bg-slate-400" },
];
const CONSENT_OPTIONS = [
  { v: "enthusiastic", label: "Enthusiastic & negotiated", color: "bg-green-500" },
  { v: "negotiated", label: "Negotiated baseline", color: "bg-emerald-500" },
  { v: "ambiguous", label: "Ambiguous in retrospect", color: "bg-amber-500" },
  { v: "regretted", label: "Regretted but consensual", color: "bg-orange-500" },
  { v: "violated", label: "Boundaries violated", color: "bg-red-600" },
];
const DISEASE_OPTIONS = [
  { v: "known-negative", label: "Known recent-negative test", color: "bg-green-500" },
  { v: "known-positive", label: "Known positive (managed)", color: "bg-purple-500" },
  { v: "untested", label: "Untested / unknown", color: "bg-amber-500" },
  { v: "declined", label: "Declined to disclose", color: "bg-slate-500" },
];

interface Lattice {
  slotsUsed: number;
  slotsAvailable: number;
  consentBreakdown: Record<string, number>;
  barrierBreakdown: Record<string, number>;
  diseaseVectorBreakdown: Record<string, number>;
  fluidBondedCount: number;
  recommendsTesting: boolean;
}

export default function TriSexPort() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({
    pseudonym: "",
    encounterDate: new Date().toISOString().slice(0, 10),
    barrierUsage: "full",
    consentQuality: "enthusiastic",
    diseaseVectorStatus: "known-negative",
    partnerLastTestDate: "",
    partnerAnonymousHandle: "",
    fluidBondedFlag: false,
    notes: "",
  });

  const { data: slots = [], isLoading } = useQuery<TrisexportPartnerSlot[]>({
    queryKey: ['/api/trisexport'],
    enabled: !!user,
  });
  const { data: lattice } = useQuery<Lattice>({
    queryKey: ['/api/trisexport/lattice'],
    enabled: !!user,
  });

  const addSlot = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/trisexport", {
        ...form,
        partnerLastTestDate: form.partnerLastTestDate || null,
        partnerAnonymousHandle: form.partnerAnonymousHandle || null,
        notes: form.notes || null,
      });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/trisexport'] });
      queryClient.invalidateQueries({ queryKey: ['/api/trisexport/lattice'] });
      toast({ title: "Partner slot recorded", description: slots.length >= 6 ? "Oldest slot was rotated out (6-slot cap)." : "Lattice updated." });
      setShowAdd(false);
      setForm({ ...form, pseudonym: "", partnerLastTestDate: "", partnerAnonymousHandle: "", notes: "" });
    },
    onError: (e: any) => toast({ title: "Could not add slot", description: e.message, variant: "destructive" }),
  });

  const removeSlot = useMutation({
    mutationFn: async (id: number) => { await apiRequest("DELETE", `/api/trisexport/${id}`); },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/trisexport'] });
      queryClient.invalidateQueries({ queryKey: ['/api/trisexport/lattice'] });
      toast({ title: "Slot deleted" });
    },
  });

  if (!user) return (
    <div className="container mx-auto p-8 max-w-2xl"><Card><CardContent className="py-8 text-center">Log in to use TriSexPort.</CardContent></Card></div>
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl space-y-6">
      <div className="flex items-center gap-3">
        <Network className="h-8 w-8 text-purple-700" />
        <div>
          <h1 className="text-3xl font-bold" data-testid="heading-trisexport">TriSexPort — Recent 6 Partner Lattice</h1>
          <p className="text-muted-foreground">Map your 6 most recent sexual partners as a latticework of disease & consent vectors.</p>
        </div>
      </div>

      <Card className="border-amber-500 bg-amber-50 dark:bg-amber-950/30">
        <CardHeader className="flex-row items-start gap-3 pb-2">
          <AlertTriangle className="h-6 w-6 text-amber-700 mt-1 flex-shrink-0" />
          <div>
            <CardTitle className="text-amber-900 dark:text-amber-200">Privacy & honesty</CardTitle>
            <CardDescription className="text-amber-800 dark:text-amber-300">
              Entries are private to your account. <strong>Partners are not notified</strong> by adding them here — use the existing partner-notification flow on <a href="/partner-sti-tracking" className="underline">STI Tracking</a> if you want consent-based outreach. All disease & consent values are <strong>self-reported</strong>; TriSex.org does not verify them. The cap is exactly 6 slots — adding a 7th automatically rotates the oldest out (no silent retention).
            </CardDescription>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5" /> Lattice summary</CardTitle>
            <Badge variant="outline">{lattice?.slotsUsed ?? 0} / 6 slots used</Badge>
          </div>
        </CardHeader>
        <CardContent>
          {lattice && lattice.slotsUsed > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <div className="font-semibold mb-1">Barrier vectors</div>
                {BARRIER_OPTIONS.map(o => (
                  <div key={o.v} className="flex items-center justify-between py-0.5">
                    <span className="flex items-center gap-2"><span className={`w-2 h-2 rounded-full ${o.color}`} />{o.label}</span>
                    <span>{lattice.barrierBreakdown[o.v.replace("-", "")] ?? lattice.barrierBreakdown[o.v] ?? 0}</span>
                  </div>
                ))}
              </div>
              <div>
                <div className="font-semibold mb-1">Consent vectors</div>
                {CONSENT_OPTIONS.map(o => (
                  <div key={o.v} className="flex items-center justify-between py-0.5">
                    <span className="flex items-center gap-2"><span className={`w-2 h-2 rounded-full ${o.color}`} />{o.label}</span>
                    <span>{lattice.consentBreakdown[o.v] ?? 0}</span>
                  </div>
                ))}
              </div>
              <div>
                <div className="font-semibold mb-1">Disease vectors</div>
                {DISEASE_OPTIONS.map(o => {
                  const k = o.v === "known-negative" ? "knownNegative" : o.v === "known-positive" ? "knownPositive" : o.v;
                  return (
                    <div key={o.v} className="flex items-center justify-between py-0.5">
                      <span className="flex items-center gap-2"><span className={`w-2 h-2 rounded-full ${o.color}`} />{o.label}</span>
                      <span>{lattice.diseaseVectorBreakdown[k] ?? 0}</span>
                    </div>
                  );
                })}
                <div className="flex items-center justify-between py-0.5 mt-1 pt-1 border-t">
                  <span className="flex items-center gap-2"><Heart className="h-3 w-3" /> Fluid-bonded</span>
                  <span>{lattice.fluidBondedCount}</span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">No partners mapped yet. Add one to start the lattice.</p>
          )}
          {lattice?.recommendsTesting && (
            <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950/30 rounded text-sm flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-700 mt-0.5 flex-shrink-0" />
              <span>One or more entries combine non-full barriers with untested / undisclosed status. Consider STI testing — see <a href="/clinics" className="underline">clinics</a>.</span>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={() => setShowAdd(s => !s)} variant={showAdd ? "outline" : "default"} data-testid="button-toggle-add">
          {showAdd ? "Cancel" : <><Plus className="h-4 w-4 mr-1" /> Add a partner slot</>}
        </Button>
      </div>

      {showAdd && (
        <Card>
          <CardHeader><CardTitle>Add to lattice</CardTitle><CardDescription>Use a pseudonym you'll recognize. Real handles are optional and never federated.</CardDescription></CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div><Label>Pseudonym</Label><Input value={form.pseudonym} onChange={e => setForm({ ...form, pseudonym: e.target.value })} placeholder="e.g., 'River from May'" data-testid="input-pseudonym" /></div>
              <div><Label>Encounter date</Label><Input type="date" value={form.encounterDate} onChange={e => setForm({ ...form, encounterDate: e.target.value })} data-testid="input-encounter-date" /></div>
              <div>
                <Label>Barrier usage</Label>
                <Select value={form.barrierUsage} onValueChange={v => setForm({ ...form, barrierUsage: v })}>
                  <SelectTrigger data-testid="select-barrier"><SelectValue /></SelectTrigger>
                  <SelectContent>{BARRIER_OPTIONS.map(o => <SelectItem key={o.v} value={o.v}>{o.label}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label>Consent quality (your assessment)</Label>
                <Select value={form.consentQuality} onValueChange={v => setForm({ ...form, consentQuality: v })}>
                  <SelectTrigger data-testid="select-consent"><SelectValue /></SelectTrigger>
                  <SelectContent>{CONSENT_OPTIONS.map(o => <SelectItem key={o.v} value={o.v}>{o.label}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label>Their disease-vector status (self-reported by them)</Label>
                <Select value={form.diseaseVectorStatus} onValueChange={v => setForm({ ...form, diseaseVectorStatus: v })}>
                  <SelectTrigger data-testid="select-disease"><SelectValue /></SelectTrigger>
                  <SelectContent>{DISEASE_OPTIONS.map(o => <SelectItem key={o.v} value={o.v}>{o.label}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Their last STI test date (optional)</Label><Input type="date" value={form.partnerLastTestDate} onChange={e => setForm({ ...form, partnerLastTestDate: e.target.value })} data-testid="input-test-date" /></div>
              <div><Label>Anonymous handle for cross-lattice (optional)</Label><Input value={form.partnerAnonymousHandle} onChange={e => setForm({ ...form, partnerAnonymousHandle: e.target.value })} placeholder="opaque token" data-testid="input-anon-handle" /></div>
              <div className="flex items-center justify-between gap-2">
                <Label htmlFor="fluid-bonded">This partner is fluid-bonded with you</Label>
                <Switch id="fluid-bonded" checked={form.fluidBondedFlag} onCheckedChange={v => setForm({ ...form, fluidBondedFlag: v })} data-testid="switch-fluid-bonded" />
              </div>
            </div>
            <div><Label>Notes (optional)</Label><Textarea rows={2} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} data-testid="textarea-notes" /></div>
            <Button onClick={() => addSlot.mutate()} disabled={!form.pseudonym || addSlot.isPending} data-testid="button-submit-slot">
              {addSlot.isPending ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : null}
              {slots.length >= 6 ? "Add (will rotate oldest out)" : "Add to lattice"}
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {Array.from({ length: 6 }).map((_, i) => {
          const s = slots[i];
          if (!s) return (
            <Card key={`empty-${i}`} className="border-dashed opacity-60">
              <CardContent className="py-8 text-center text-muted-foreground text-sm">
                <Lock className="h-5 w-5 mx-auto mb-1" /> Empty slot {i + 1}
              </CardContent>
            </Card>
          );
          const barrier = BARRIER_OPTIONS.find(o => o.v === s.barrierUsage);
          const consent = CONSENT_OPTIONS.find(o => o.v === s.consentQuality);
          const disease = DISEASE_OPTIONS.find(o => o.v === s.diseaseVectorStatus);
          return (
            <Card key={s.id} data-testid={`card-slot-${s.id}`}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base">{s.pseudonym}</CardTitle>
                    <CardDescription className="text-xs">{new Date(s.encounterDate).toISOString().slice(0, 10)}{s.fluidBondedFlag ? " · 💞 fluid-bonded" : ""}</CardDescription>
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => removeSlot.mutate(s.id)} data-testid={`button-delete-slot-${s.id}`}><Trash2 className="h-4 w-4 text-red-600" /></Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-1 text-xs">
                <div className="flex items-center gap-2"><span className={`w-2 h-2 rounded-full ${barrier?.color}`} /> {barrier?.label}</div>
                <div className="flex items-center gap-2"><span className={`w-2 h-2 rounded-full ${consent?.color}`} /> {consent?.label}</div>
                <div className="flex items-center gap-2"><span className={`w-2 h-2 rounded-full ${disease?.color}`} /> {disease?.label}</div>
                {s.partnerLastTestDate && <div className="text-muted-foreground">Their last test: {new Date(s.partnerLastTestDate).toISOString().slice(0, 10)}</div>}
                {s.notes && <div className="text-muted-foreground italic">"{s.notes}"</div>}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {isLoading && <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Loading lattice…</div>}
    </div>
  );
}
