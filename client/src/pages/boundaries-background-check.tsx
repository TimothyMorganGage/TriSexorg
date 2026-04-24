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
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  MessageCircle,
  Lock,
  ExternalLink,
  Loader2,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Clock,
} from "lucide-react";

interface Consent {
  id: number;
  userId: number;
  platform: "whatsapp" | "signal";
  handle: string;
  scope: string;
  purpose: string | null;
  consentStatement: string;
  consentedAt: string;
  expiresAt: string | null;
  revokedAt: string | null;
}

const SCOPE_OPTIONS = [
  { value: "boundaries-conflict", label: "Boundaries / consent conflict review (partner-initiated)" },
  { value: "moderator-review", label: "Moderator-initiated background check (forum / event)" },
  { value: "partner-history", label: "Partner-history confirmation (mutually requested)" },
  { value: "sti-disclosure", label: "STI disclosure cross-verification (clinic-supervised)" },
  { value: "co-op-trust-circle", label: "$BAD co-op trust-circle membership review" },
];

const STANDARD_CONSENT = (platform: string, handle: string, scope: string) => `I, the holder of ${platform} account "${handle}", give TriSex.org's authorized boundaries-review process explicit, time-limited, revocable consent to:

1. Contact me on ${platform} (and only ${platform}) to request information related to: ${scope}.
2. Receive my own voluntary, written response on ${platform} as evidence in a boundaries-conflict review.
3. Store the fact of this consent (platform, handle, scope, purpose, timestamp) on TriSex.org's servers.

TriSex.org will NOT:
- Read my message history without my response
- Pull any data from ${platform} via its API
- Share my handle with the general public
- Use this consent for any scope other than the one listed above

I understand I can revoke this consent at any time on my TriSex.org account, and that revocation stops future contact but does not erase prior responses I have already sent.`;

export default function BoundariesBackgroundCheck() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("about");
  const [platform, setPlatform] = useState<"whatsapp" | "signal">("signal");
  const [handle, setHandle] = useState("");
  const [scope, setScope] = useState(SCOPE_OPTIONS[0].value);
  const [purpose, setPurpose] = useState("");
  const [expiresInDays, setExpiresInDays] = useState("180");
  const [agreedConsent, setAgreedConsent] = useState(false);

  const { data: consents = [], isLoading } = useQuery<Consent[]>({
    queryKey: ['/api/boundary-checks/consents'],
    enabled: !!user,
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      const expiresAt = expiresInDays === "never"
        ? null
        : new Date(Date.now() + parseInt(expiresInDays) * 86400000).toISOString();
      const scopeLabel = SCOPE_OPTIONS.find(o => o.value === scope)?.label || scope;
      const consentStatement = STANDARD_CONSENT(platform, handle, scopeLabel);
      const res = await apiRequest("POST", "/api/boundary-checks/consents", {
        platform, handle, scope, purpose, consentStatement, expiresAt,
      });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/boundary-checks/consents'] });
      setHandle("");
      setPurpose("");
      setAgreedConsent(false);
      setActiveTab("active");
      toast({ title: "Consent recorded", description: "Your opt-in is saved. You can revoke it any time." });
    },
    onError: (e: any) => toast({ title: "Failed to record consent", description: e.message, variant: "destructive" }),
  });

  const revokeMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("POST", `/api/boundary-checks/consents/${id}/revoke`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/boundary-checks/consents'] });
      toast({ title: "Consent revoked", description: "Future contact is stopped." });
    },
  });

  const messengerLink = (c: Consent) => {
    if (c.platform === "whatsapp") {
      const cleaned = c.handle.replace(/[^0-9]/g, "");
      return `https://wa.me/${cleaned}`;
    }
    return `https://signal.me/#p/${encodeURIComponent(c.handle)}`;
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="p-8 text-center">
              <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Log in to manage consents</h2>
              <p className="text-muted-foreground">Boundaries background-check consents are tied to your account so you can revoke them anytime.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const activeConsents = consents.filter(c => !c.revokedAt);
  const revokedConsents = consents.filter(c => c.revokedAt);

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <ShieldCheck className="h-9 w-9" />
            Boundaries Background-Check Consent
          </h1>
          <p className="text-lg text-muted-foreground">
            Opt in via WhatsApp or Signal to be reachable for sexual-boundaries conflict review. You stay in control — revoke any time.
          </p>
        </div>

        <Alert className="border-blue-500 bg-blue-50 dark:bg-blue-950/30" data-testid="alert-consent-honesty">
          <Lock className="h-5 w-5 text-blue-600" />
          <AlertTitle className="text-blue-900 dark:text-blue-200 font-bold">How this actually works (no surveillance)</AlertTitle>
          <AlertDescription className="text-blue-800 dark:text-blue-200 space-y-2 text-sm">
            <p>
              <strong>This is opt-in only and self-attested.</strong> TriSex.org does not connect to WhatsApp's or Signal's APIs. We do not read your messages, contacts, or status.
            </p>
            <p>
              When you opt in, we store: <em>platform, handle, the scope you authorized, the consent statement, and a timestamp.</em> If a boundaries-conflict review is opened that involves you, an authorized reviewer can contact you on that messenger using the deep link. Your reply is your own; you decide what to send.
            </p>
            <p>
              Signal is preferred — its end-to-end encryption and no-metadata-retention model is the most privacy-protective option for sensitive boundaries discussions.
            </p>
          </AlertDescription>
        </Alert>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="about" data-testid="tab-about">About</TabsTrigger>
            <TabsTrigger value="opt-in" data-testid="tab-opt-in">Opt In</TabsTrigger>
            <TabsTrigger value="active" data-testid="tab-active">
              My Consents {activeConsents.length > 0 && <Badge variant="secondary" className="ml-2">{activeConsents.length}</Badge>}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="about" className="space-y-4 mt-6">
            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><MessageCircle className="h-5 w-5 text-green-600" />WhatsApp</CardTitle>
                  <CardDescription>Best for: ubiquity. Most members can reach you.</CardDescription>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <div><strong>Encryption:</strong> End-to-end (Signal Protocol)</div>
                  <div><strong>Metadata retention:</strong> Meta retains contact graph & timestamps</div>
                  <div><strong>Required identifier:</strong> Phone number with country code (e.g., +14155551234)</div>
                  <div><strong>Privacy notes:</strong> Your phone number is visible to anyone you message. Consider using a separate WhatsApp Business number.</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><MessageCircle className="h-5 w-5 text-blue-600" />Signal <Badge>Recommended</Badge></CardTitle>
                  <CardDescription>Best for: privacy. Minimal metadata; nonprofit operator.</CardDescription>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <div><strong>Encryption:</strong> End-to-end (Signal Protocol, original)</div>
                  <div><strong>Metadata retention:</strong> None beyond account creation date</div>
                  <div><strong>Required identifier:</strong> Signal username (recommended) or phone number</div>
                  <div><strong>Privacy notes:</strong> Use a Signal username so your phone number is never disclosed. Set "Sealed Sender" to allow.</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>What kinds of background checks?</CardTitle>
                <CardDescription>You pick the scope at opt-in time. Each scope is a separate consent.</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  {SCOPE_OPTIONS.map(o => (
                    <li key={o.value} className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{o.label}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Alert className="border-amber-500 bg-amber-50 dark:bg-amber-950/30">
              <ShieldAlert className="h-5 w-5 text-amber-600" />
              <AlertTitle>Not a substitute for legal process</AlertTitle>
              <AlertDescription className="text-sm">
                This system is for <strong>community-level</strong> conflict resolution and trust-building. It is not a criminal background check, not admissible legal evidence by itself, and not a replacement for reporting violence to qualified authorities. If you are in danger, contact local emergency services and a domestic-violence hotline.
              </AlertDescription>
            </Alert>
          </TabsContent>

          <TabsContent value="opt-in" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Add a consent</CardTitle>
                <CardDescription>This records that you opt in to be contacted for one specific review scope.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>Platform</Label>
                    <Select value={platform} onValueChange={(v: any) => setPlatform(v)}>
                      <SelectTrigger data-testid="select-platform"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="signal">Signal (recommended)</SelectItem>
                        <SelectItem value="whatsapp">WhatsApp</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>{platform === "whatsapp" ? "Phone number (with country code)" : "Signal username or phone"}</Label>
                    <Input
                      value={handle}
                      onChange={e => setHandle(e.target.value)}
                      placeholder={platform === "whatsapp" ? "+14155551234" : "@yourname.42 or +1..."}
                      data-testid="input-handle"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label>Scope of consent</Label>
                    <Select value={scope} onValueChange={setScope}>
                      <SelectTrigger data-testid="select-scope"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {SCOPE_OPTIONS.map(o => (
                          <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="md:col-span-2">
                    <Label>Purpose / context (optional)</Label>
                    <Textarea
                      rows={2}
                      value={purpose}
                      onChange={e => setPurpose(e.target.value)}
                      placeholder="e.g., 'Active in $BAD co-op trust circle, available for member-initiated reviews.'"
                      data-testid="input-purpose"
                    />
                  </div>
                  <div>
                    <Label>Auto-revoke after</Label>
                    <Select value={expiresInDays} onValueChange={setExpiresInDays}>
                      <SelectTrigger data-testid="select-expires"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30 days</SelectItem>
                        <SelectItem value="90">90 days</SelectItem>
                        <SelectItem value="180">180 days (recommended)</SelectItem>
                        <SelectItem value="365">1 year</SelectItem>
                        <SelectItem value="never">Until I revoke manually</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                <div>
                  <Label className="text-sm font-bold">Consent statement (you must read and agree)</Label>
                  <pre className="bg-muted text-xs p-3 rounded mt-2 whitespace-pre-wrap font-mono max-h-60 overflow-auto">
{handle ? STANDARD_CONSENT(platform, handle, SCOPE_OPTIONS.find(o => o.value === scope)?.label || scope) : "Enter your handle above to see the personalized consent statement."}
                  </pre>
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    id="agree"
                    checked={agreedConsent}
                    onCheckedChange={setAgreedConsent}
                    data-testid="switch-agree"
                  />
                  <Label htmlFor="agree" className="cursor-pointer text-sm">
                    I have read the consent statement above and I agree.
                  </Label>
                </div>

                <Button
                  onClick={() => createMutation.mutate()}
                  disabled={!handle || !agreedConsent || createMutation.isPending}
                  data-testid="button-record-consent"
                >
                  {createMutation.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <ShieldCheck className="h-4 w-4 mr-2" />}
                  Record opt-in
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="active" className="space-y-4 mt-6">
            {isLoading ? (
              <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin" /></div>
            ) : activeConsents.length === 0 ? (
              <Card><CardContent className="p-8 text-center">
                <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No active consents. Add one on the <strong>Opt In</strong> tab.</p>
              </CardContent></Card>
            ) : (
              <div className="space-y-3">
                {activeConsents.map(c => {
                  const scopeLabel = SCOPE_OPTIONS.find(o => o.value === c.scope)?.label || c.scope;
                  const expired = c.expiresAt && new Date(c.expiresAt) < new Date();
                  return (
                    <Card key={c.id} data-testid={`consent-row-${c.id}`}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-4 flex-wrap">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <Badge variant={c.platform === "signal" ? "default" : "secondary"}>
                                <MessageCircle className="h-3 w-3 mr-1" />
                                {c.platform === "signal" ? "Signal" : "WhatsApp"}
                              </Badge>
                              {expired && <Badge variant="destructive">Expired</Badge>}
                              {!expired && <Badge variant="outline" className="text-green-700 border-green-500">Active</Badge>}
                            </div>
                            <div className="font-mono text-sm">{c.handle}</div>
                            <div className="text-sm mt-1"><strong>Scope:</strong> {scopeLabel}</div>
                            {c.purpose && <div className="text-xs text-muted-foreground mt-1">{c.purpose}</div>}
                            <div className="text-xs text-muted-foreground mt-2 flex items-center gap-3 flex-wrap">
                              <span className="flex items-center gap-1"><Clock className="h-3 w-3" />Opted in {format(new Date(c.consentedAt), "MMM d, yyyy")}</span>
                              {c.expiresAt && <span>Auto-revokes {format(new Date(c.expiresAt), "MMM d, yyyy")}</span>}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline" onClick={() => window.open(messengerLink(c), "_blank", "noopener,noreferrer")} data-testid={`button-link-${c.id}`}>
                              <ExternalLink className="h-4 w-4 mr-1" />Open chat
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => { if (confirm("Revoke this consent? Future contact will be stopped.")) revokeMutation.mutate(c.id); }} data-testid={`button-revoke-${c.id}`}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}

            {revokedConsents.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-muted-foreground mt-6">Revoked / historical</h3>
                {revokedConsents.map(c => (
                  <Card key={c.id} className="opacity-60">
                    <CardContent className="p-3 text-sm flex justify-between items-center">
                      <div>
                        <Badge variant="outline" className="mr-2">{c.platform}</Badge>
                        <span className="font-mono">{c.handle}</span>
                        <span className="text-xs text-muted-foreground ml-2">— revoked {c.revokedAt && format(new Date(c.revokedAt), "MMM d, yyyy")}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
