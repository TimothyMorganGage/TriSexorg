import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Share2, Globe, Network, Camera, Video, Copy, CheckCircle, Megaphone, Users, X as XIcon, ShieldAlert, Lock, Loader2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface FediverseShareProps {
  title: string;
  description?: string;
  url?: string;
  hashtags?: string[];
  contentWarning?: string;
  imagePrompt?: string;
}

export function FediverseShare({
  title,
  description,
  url,
  hashtags = [],
  contentWarning = "sexual health (educational)",
  imagePrompt
}: FediverseShareProps) {
  const [copied, setCopied] = useState<string | null>(null);
  const [xPornOptOut, setXPornOptOut] = useState(true);
  const [bskyHandle, setBskyHandle] = useState("");
  const [bskyAdultDisabled, setBskyAdultDisabled] = useState(false);
  const [xHandleInput, setXHandleInput] = useState("");
  const [xAdultDisabled, setXAdultDisabled] = useState(false);
  const [xUsesQool, setXUsesQool] = useState(false);
  const [qoolHandle, setQoolHandle] = useState("");
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: bskyPolicy } = useQuery<{ compensationActive: boolean; rationale: string }>({
    queryKey: ['/api/bluesky/policy'],
  });
  const { data: bskyAttestation } = useQuery<{ id: number; blueskyHandle: string; adultContentDisabled: boolean; attestedAt: string } | null>({
    queryKey: ['/api/bluesky/attestation'],
    enabled: !!user,
  });

  const blueskyAllowed = (bskyPolicy?.compensationActive === true) || (!!bskyAttestation && bskyAttestation.adultContentDisabled);

  const attestMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/bluesky/attestation", {
        blueskyHandle: bskyHandle,
        adultContentDisabled: bskyAdultDisabled,
      });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/bluesky/attestation'] });
      toast({ title: "Bluesky attestation recorded", description: "Cross-posting to Bluesky is now unlocked." });
    },
    onError: (e: any) => toast({ title: "Could not record attestation", description: e.message, variant: "destructive" }),
  });

  const revokeMutation = useMutation({
    mutationFn: async () => {
      if (!bskyAttestation) return;
      await apiRequest("POST", `/api/bluesky/attestation/${bskyAttestation.id}/revoke`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/bluesky/attestation'] });
      toast({ title: "Attestation revoked", description: "Bluesky cross-posting is gated again." });
    },
  });

  const { data: xPolicy } = useQuery<{ compensationActive: boolean; rationale: string; qoolStudioUrl: string; qoolStudioDisclosure: string }>({
    queryKey: ['/api/x/policy'],
  });
  const { data: xAttestation } = useQuery<{ id: number; xHandle: string; adultContentDisabled: boolean; usesQoolNftStudio: boolean; qoolStudioHandle: string | null } | null>({
    queryKey: ['/api/x/attestation'],
    enabled: !!user,
  });
  const xAllowed = (xPolicy?.compensationActive === true) || (!!xAttestation && xAttestation.adultContentDisabled && xAttestation.usesQoolNftStudio);

  const xAttestMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/x/attestation", {
        xHandle: xHandleInput,
        adultContentDisabled: xAdultDisabled,
        usesQoolNftStudio: xUsesQool,
        qoolStudioHandle: qoolHandle || null,
      });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/x/attestation'] });
      toast({ title: "X attestation recorded", description: "X cross-posting is now unlocked." });
    },
    onError: (e: any) => toast({ title: "Could not record attestation", description: e.message, variant: "destructive" }),
  });

  const xRevokeMutation = useMutation({
    mutationFn: async () => {
      if (!xAttestation) return;
      await apiRequest("POST", `/api/x/attestation/${xAttestation.id}/revoke`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/x/attestation'] });
      toast({ title: "Attestation revoked", description: "X cross-posting is gated again." });
    },
  });

  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const hashtagString = hashtags.map(tag => `#${tag}`).join(' ');
  const xPostBase = `${title}\n\n${description ? description + '\n\n' : ''}${hashtagString}\n\n${shareUrl}`;
  const xPost = xPornOptOut
    ? `[Educational sexual-health post — please mark your account "Hide sensitive content: ON" before viewing]\n\n${xPostBase}`
    : xPostBase;
  const xIntentUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(xPost)}`;

  const platforms = {
    bluesky: {
      name: "Bluesky",
      icon: Globe,
      color: "bg-blue-500",
      post: `${title}\n\n${description || ''}\n\n${hashtagString}\n\n${shareUrl}`,
      instructions: "1. Copy the post text\n2. Visit bsky.app\n3. Create a new post\n4. Paste and share!"
    },
    mastodon: {
      name: "Mastodon",
      icon: Network,
      color: "bg-indigo-500",
      post: `${title}\n\n${description || ''}\n\n${hashtagString}\n\n${shareUrl}`,
      instructions: `1. Copy the post text\n2. Visit your Mastodon instance\n3. Create a new post\n4. Add content warning: "${contentWarning}"\n5. Paste and share!`
    },
    pixelfed: {
      name: "Pixelfed",
      icon: Camera,
      color: "bg-purple-500",
      post: `${title}\n\n${hashtagString}`,
      instructions: `1. Copy the caption text\n2. Visit pixelfed.social or your instance\n3. Upload an image${imagePrompt ? ` (${imagePrompt})` : ''}\n4. Paste caption\n5. Add link: ${shareUrl}\n6. Share!`
    },
    loops: {
      name: "Loops",
      icon: Video,
      color: "bg-green-500",
      post: `${title}\n\n${hashtagString}`,
      instructions: `1. Copy the caption text\n2. Visit loops.video\n3. Upload a video\n4. Paste caption\n5. Add link: ${shareUrl}\n6. Share!`
    },
    truthsocial: {
      name: "Truth Social",
      icon: Megaphone,
      color: "bg-red-600",
      post: `${title}\n\n${description || ''}\n\n${hashtagString}\n\n${shareUrl}`,
      instructions: `1. Copy the post (Truths are limited to 500 chars — trim if needed)\n2. Visit truthsocial.com or open the app\n3. Tap "Create a Truth"\n4. Paste and post!\n\nNote: Truth Social runs a Mastodon-compatible API but does not federate via ActivityPub, so reach is limited to the Truth Social network.`
    },
    hylo: {
      name: "Hylo",
      icon: Users,
      color: "bg-amber-600",
      post: `${title}\n\n${description || ''}\n\n${hashtagString}\n\n${shareUrl}`,
      instructions: `1. Copy the post text\n2. Visit hylo.com and open your group (or join the TriSex.org group)\n3. Click "Create" → choose Discussion, Resource, or Project as the post type\n4. Paste the text into the body, set a topic, and add a content warning if needed\n5. Post to your group, a federation, or to Public\n\nHylo is open-source, cooperative-owned community infrastructure — a strong fit for cooperative governance discussions grounded in the LETS Framework.`
    },
    x: {
      name: "X (Twitter)",
      icon: XIcon,
      color: "bg-black",
      post: xPost,
      instructions: `1. Copy the post (X limit: 280 chars free / 25,000 X Premium — trim if needed)\n2. Click "Open X with this post" below, OR visit x.com\n3. Verify your settings: Privacy → "Hide sensitive content" should be ON if you opted out of adult content\n4. Post the Tweet\n\nPRIVACY NOTE: TriSex.org never publishes scan or product-fit data to X. Sharing here is text/link only.`
    }
  };

  const copyToClipboard = async (text: string, platformName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(platformName);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" data-testid="button-share-fediverse">
          <Share2 className="h-4 w-4 mr-2" />
          Share to Fediverse
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Share2 className="h-5 w-5 mr-2" />
            Share to Federated Networks
          </DialogTitle>
          <DialogDescription>
            Choose a platform and copy the pre-formatted post. Federation protects against platform monopolies.
          </DialogDescription>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-4 mt-4">
          {Object.entries(platforms).map(([key, platform]) => {
            const Icon = platform.icon;
            const isCopied = copied === platform.name;
            
            return (
              <Card key={key} className="border-2">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <div className={`${platform.color} p-2 rounded-lg`}>
                        <Icon className="h-4 w-4 text-white" />
                      </div>
                      <h3 className="font-semibold">{platform.name}</h3>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => copyToClipboard(platform.post, platform.name)}
                      variant={isCopied ? "default" : "outline"}
                      data-testid={`button-copy-${key}`}
                    >
                      {isCopied ? (
                        <>
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-1" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="bg-muted p-3 rounded-lg mb-3 text-sm font-mono whitespace-pre-wrap max-h-32 overflow-y-auto">
                    {platform.post}
                  </div>

                  <div className="text-xs text-muted-foreground whitespace-pre-line">
                    {platform.instructions}
                  </div>

                  {key === "bluesky" && (
                    <div className="mt-3 space-y-2 border-t pt-3">
                      {blueskyAllowed ? (
                        <div className="flex items-start gap-2 text-xs text-green-700 dark:text-green-400">
                          <CheckCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                          <div>
                            <strong>Bluesky cross-posting unlocked</strong>
                            {bskyPolicy?.compensationActive ? (
                              <p>The platform-level gate is OFF — Bluesky / AT Protocol now compensates depicted persons.</p>
                            ) : (
                              <p>You attested that <code>@{bskyAttestation?.blueskyHandle}</code> has adult content disabled.</p>
                            )}
                            {bskyAttestation && (
                              <Button size="sm" variant="ghost" className="h-6 px-2 mt-1 text-xs" onClick={() => revokeMutation.mutate()} data-testid="button-revoke-bsky-attestation">
                                Revoke attestation
                              </Button>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="flex items-start gap-2 text-xs">
                            <Lock className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                            <div className="text-amber-800 dark:text-amber-300">
                              <strong>Bluesky share is gated.</strong> TriSex.org only allows posting to Bluesky if you have <em>adult content disabled</em> on your Bluesky account, OR until Bluesky / the AT Protocol publicly compensates individuals depicted in pornographic content on the network. Neither is currently in place.
                            </div>
                          </div>
                          {!user ? (
                            <p className="text-xs text-muted-foreground">Log in to attest and unlock Bluesky sharing.</p>
                          ) : (
                            <>
                              <div>
                                <Label htmlFor="bsky-handle" className="text-xs">Your Bluesky handle</Label>
                                <Input
                                  id="bsky-handle"
                                  value={bskyHandle}
                                  onChange={e => setBskyHandle(e.target.value)}
                                  placeholder="yourname.bsky.social"
                                  className="h-8 text-sm"
                                  data-testid="input-bsky-handle"
                                />
                              </div>
                              <div className="flex items-center justify-between gap-2">
                                <Label htmlFor="bsky-adult-disabled" className="text-xs cursor-pointer">
                                  I have set <strong>Moderation → Adult Content</strong> to <strong>OFF (Disabled)</strong> on @{bskyHandle || "my-handle"}
                                </Label>
                                <Switch
                                  id="bsky-adult-disabled"
                                  checked={bskyAdultDisabled}
                                  onCheckedChange={setBskyAdultDisabled}
                                  data-testid="switch-bsky-adult-disabled"
                                />
                              </div>
                              <Button
                                size="sm"
                                className="w-full"
                                disabled={!bskyHandle || !bskyAdultDisabled || attestMutation.isPending}
                                onClick={() => attestMutation.mutate()}
                                data-testid="button-bsky-attest"
                              >
                                {attestMutation.isPending ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <ShieldAlert className="h-4 w-4 mr-1" />}
                                Attest & unlock Bluesky sharing
                              </Button>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {key === "x" && (
                    <div className="mt-3 space-y-2 border-t pt-3">
                      <div className="flex items-center justify-between gap-2">
                        <Label htmlFor="x-porn-opt-out" className="text-xs cursor-pointer">
                          I have <strong>opted out of adult content</strong> on X (recommended for sexual-health posts)
                        </Label>
                        <Switch
                          id="x-porn-opt-out"
                          checked={xPornOptOut}
                          onCheckedChange={setXPornOptOut}
                          data-testid="switch-x-porn-opt-out"
                        />
                      </div>

                      {xAllowed ? (
                        <>
                          <div className="flex items-start gap-2 text-xs text-green-700 dark:text-green-400 border-t pt-2">
                            <CheckCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                            <div>
                              <strong>X cross-posting unlocked</strong>
                              {xPolicy?.compensationActive ? (
                                <p>The platform-level gate is OFF — X now compensates depicted persons.</p>
                              ) : (
                                <p>You attested @{xAttestation?.xHandle} has adult content disabled and uses qool.wtf NFT Studio.</p>
                              )}
                              {xAttestation && (
                                <Button size="sm" variant="ghost" className="h-6 px-2 mt-1 text-xs" onClick={() => xRevokeMutation.mutate()} data-testid="button-revoke-x-attestation">
                                  Revoke attestation
                                </Button>
                              )}
                            </div>
                          </div>
                          <Button
                            size="sm"
                            className="w-full"
                            onClick={() => window.open(xIntentUrl, "_blank", "noopener,noreferrer")}
                            data-testid="button-open-x-intent"
                          >
                            <XIcon className="h-4 w-4 mr-1" /> Open X with this post
                          </Button>
                        </>
                      ) : (
                        <div className="space-y-2 border-t pt-2">
                          <div className="flex items-start gap-2 text-xs">
                            <Lock className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                            <div className="text-amber-800 dark:text-amber-300">
                              <strong>X share is gated.</strong> TriSex.org only allows posting to X if you (1) have <em>adult content disabled</em> on X <strong>AND</strong> (2) use the <a href={xPolicy?.qoolStudioUrl ?? "https://qool.wtf"} target="_blank" rel="noopener noreferrer" className="underline">qool.wtf NFT Studio</a> for creative-control / on-chain attribution of depicted persons — OR until X publicly compensates individuals depicted in pornographic content on the platform. Neither is currently in place.
                            </div>
                          </div>
                          <p className="text-[11px] text-muted-foreground italic">
                            Disclosure: {xPolicy?.qoolStudioDisclosure}
                          </p>
                          {!user ? (
                            <p className="text-xs text-muted-foreground">Log in to attest and unlock X sharing.</p>
                          ) : (
                            <>
                              <div>
                                <Label htmlFor="x-handle" className="text-xs">Your X handle</Label>
                                <Input id="x-handle" value={xHandleInput} onChange={e => setXHandleInput(e.target.value)} placeholder="yourhandle" className="h-8 text-sm" data-testid="input-x-handle" />
                              </div>
                              <div className="flex items-center justify-between gap-2">
                                <Label htmlFor="x-adult-disabled" className="text-xs cursor-pointer">
                                  I have set X <strong>Settings → Privacy & safety → Content you see → Adult content</strong> to <strong>OFF</strong>
                                </Label>
                                <Switch id="x-adult-disabled" checked={xAdultDisabled} onCheckedChange={setXAdultDisabled} data-testid="switch-x-adult-disabled" />
                              </div>
                              <div className="flex items-center justify-between gap-2">
                                <Label htmlFor="x-uses-qool" className="text-xs cursor-pointer">
                                  I use <a href="https://qool.wtf" target="_blank" rel="noopener noreferrer" className="underline">qool.wtf NFT Studio</a> for attribution of depicted persons
                                </Label>
                                <Switch id="x-uses-qool" checked={xUsesQool} onCheckedChange={setXUsesQool} data-testid="switch-x-uses-qool" />
                              </div>
                              <div>
                                <Label htmlFor="qool-handle" className="text-xs">qool.wtf studio handle / wallet (optional)</Label>
                                <Input id="qool-handle" value={qoolHandle} onChange={e => setQoolHandle(e.target.value)} placeholder="qool.wtf/yourstudio or 0x…" className="h-8 text-sm" data-testid="input-qool-handle" />
                              </div>
                              <Button
                                size="sm"
                                className="w-full"
                                disabled={!xHandleInput || !xAdultDisabled || !xUsesQool || xAttestMutation.isPending}
                                onClick={() => xAttestMutation.mutate()}
                                data-testid="button-x-attest"
                              >
                                {xAttestMutation.isPending ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <ShieldAlert className="h-4 w-4 mr-1" />}
                                Attest both conditions & unlock X sharing
                              </Button>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-4 p-4 bg-green-50 dark:bg-green-950 border border-green-500/50 rounded-lg">
          <div className="flex items-start space-x-2">
            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <strong className="text-green-900 dark:text-green-100">Why Federation Matters:</strong>
              <p className="text-green-800 dark:text-green-200 mt-1">
                By sharing on decentralized platforms (AT Protocol & ActivityPub), you help prevent corporate monopolies from controlling sexual health conversations. Your content stays yours, and no single company can silence our cooperative community.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
