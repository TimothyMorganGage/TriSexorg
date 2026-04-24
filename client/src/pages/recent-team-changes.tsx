import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Activity, Globe, Network, Camera, Video, Megaphone, Users, X as XIcon,
  Rss, ExternalLink, ArrowRight, ShieldAlert, GitBranch, BookOpen,
} from "lucide-react";
import { FediverseShare } from "@/components/FediverseShare";

interface PulseEntry {
  feature: string;
  count: number;
  route: string;
  category: string;
}
interface PulseResponse {
  pulse: PulseEntry[];
  generatedAt: string;
  methodology: string;
}

const crossPollination: Array<{
  platform: string;
  protocol: string;
  url: string;
  status: "active-share" | "gated" | "outreach" | "passive";
  notes: string;
  icon: any;
  color: string;
}> = [
  {
    platform: "Mastodon (ActivityPub)",
    protocol: "ActivityPub",
    url: "https://joinmastodon.org",
    status: "active-share",
    notes: "Open share dialog renders pre-formatted post + content warning. No automatic publishing — user copies and posts on their chosen instance.",
    icon: Network,
    color: "bg-indigo-500",
  },
  {
    platform: "Bluesky (AT Protocol)",
    protocol: "AT Protocol",
    url: "https://bsky.app",
    status: "gated",
    notes: "Cross-posting gated until either (a) the user attests Adult Content is disabled on their account OR (b) Bluesky/AT Protocol publicly compensates depicted persons. Attestation is recorded server-side.",
    icon: Globe,
    color: "bg-blue-500",
  },
  {
    platform: "Pixelfed",
    protocol: "ActivityPub",
    url: "https://pixelfed.org",
    status: "active-share",
    notes: "Share dialog produces an image-first caption + link. No automatic publishing.",
    icon: Camera,
    color: "bg-purple-500",
  },
  {
    platform: "Loops",
    protocol: "ActivityPub (video)",
    url: "https://loops.video",
    status: "active-share",
    notes: "Share dialog produces a video caption + link. No automatic publishing.",
    icon: Video,
    color: "bg-green-500",
  },
  {
    platform: "Truth Social",
    protocol: "Mastodon-API (no ActivityPub federation)",
    url: "https://truthsocial.com",
    status: "active-share",
    notes: "Share dialog produces a 500-char-trim post. Truth Social runs a Mastodon-compatible API but does not federate via ActivityPub, so reach is limited to the Truth Social network. Co-op pricing for Truth+ subscribers is in early outreach.",
    icon: Megaphone,
    color: "bg-red-600",
  },
  {
    platform: "Hylo",
    protocol: "Cooperative-owned (no federation)",
    url: "https://hylo.com",
    status: "active-share",
    notes: "Open-source, cooperative-owned community infrastructure. Share dialog produces a discussion/resource/project post with content-warning slot.",
    icon: Users,
    color: "bg-amber-600",
  },
  {
    platform: "X (Twitter)",
    protocol: "X API (proprietary)",
    url: "https://x.com",
    status: "gated",
    notes: "Cross-posting gated until either (a) the user attests Adult Content is disabled AND uses qool.wtf NFT Studio for attribution, OR (b) X publicly compensates depicted persons. Co-op pricing for X Premium is in early outreach.",
    icon: XIcon,
    color: "bg-black",
  },
];

interface ChangeEntry {
  date: string;
  area: string;
  summary: string;
  type: "honesty-refactor" | "feature" | "policy" | "infra";
}

const teamChangesLog: ChangeEntry[] = [
  { date: "2026-04-24", area: "Recent Team Changes", type: "feature", summary: "New feed page launched: Pulse (real co-op feature counts), Cross-Pollination (federated outposts + ethics gates), and this changelog." },
  { date: "2026-04-24", area: "clinic-dashboard", type: "honesty-refactor", summary: "Removed hard-coded analytics: Inventory Turnover (23/8/4.2x) and Cost Analysis ($2,340 waste / +$8,920 savings / 8% inventory-cost multiplier). Replaced with empty-state cards naming each removed placeholder." },
  { date: "2026-04-23", area: "products / terms-of-service / materials-science / anatomy-scanning / clinics / natural-lubricants", type: "honesty-refactor", summary: "Stripped fabricated NanoHeal STI efficacy %s (97/95/89/93/91/96/87), false 'FDA breakthrough therapy' + 'WHO recognition' claims; killed '97.8% STI prevention efficacy' guarantee + '$0.99/unit, 83% savings'; zeroed sustainability metrics, scanning-method 'accuracy' %s (98/99/99.5/95/90), and Healthy Outcomes scores; flipped 5 ISO/ASTM/FDA/USP/RoHS standards from 'Certified' to 'Not yet certified — earlier copy falsely listed Certified'; emptied fake MyChart HIV/Chlamydia/Syphilis-Negative test results; replaced fabricated clinic benefits (95% / 30% / 50%) with 'Pending — earlier copy claimed X without data'; softened 'GMP-certified production line' to planned." },
  { date: "2026-04-22", area: "bad-coop-dashboard / social-integration", type: "honesty-refactor", summary: "Removed 4 fake 'Community Health Advocates' with ratings/sessions; 6 fake legal-template download counts (3,210–12,453 range); fabricated 45–92% module progress; four invented recent-activity entries; fabricated upcoming tasks; four fake forum post counts; fake video-course completion %s. Zeroed Bluesky/Mastodon/Pixelfed/Loops follower / post / engagement / reach numbers and removed four fabricated cross-platform posts with invented likes/shares/views." },
  { date: "2026-04-21", area: "wiki / meta-platforms / newsletter / infinitely-affirmative / trisex-stablecoin / 4d-sti-intervention / open-books / monogamy-economics / economic-impact / analytics / good-people / peer-mentor / interactive-stories", type: "honesty-refactor", summary: "Multi-page sweep replacing fabricated stats with parametric calculators, methodology framing, citation slots, and amber honesty banners naming each removed fabrication." },
  { date: "2026-04-20", area: "filing-preparation", type: "feature", summary: "Filing Preparation system for the $BAD cooperative — generates downloadable, filing-ready packets for IRS / financial compliance with explicit disclaimers (member-source income ≥85% threshold for 501(c)(12), 10%+ beneficial owner reporting)." },
  { date: "2026-04-19", area: "social-integration / FediverseShare", type: "feature", summary: "Truth Social added as a share target alongside Bluesky, Mastodon, Pixelfed, Loops, Hylo, and X. Co-op pricing interest registry for X Premium and Truth+ subscribers." },
  { date: "2026-04-18", area: "boundaries-background-check / sniffies-policy / trisexport / herbal-knowledge / meta-lens-scan", type: "feature", summary: "Boundaries opt-in via WhatsApp/Signal; Sniffies platform-access ethics gate; recent-6 partner lattice for testing recommendations; AHG-grounded peer-reviewed herbal entries; Meta Lens scan-to-product workflow." },
  { date: "2026-04-17", area: "FediverseShare (Bluesky / X gates)", type: "policy", summary: "Cross-posting to Bluesky and X is gated by user attestation (adult content disabled, qool.wtf attribution for X) OR by platform-level compensation policy for depicted persons. Attestations are revocable." },
];

const statusBadge: Record<string, { label: string; className: string }> = {
  "active-share": { label: "Active share target", className: "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300" },
  "gated": { label: "Ethics-gated", className: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300" },
  "outreach": { label: "In outreach", className: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300" },
  "passive": { label: "Inbound only", className: "bg-muted text-muted-foreground" },
};

const typeBadge: Record<ChangeEntry["type"], { label: string; className: string; icon: any }> = {
  "honesty-refactor": { label: "Honesty refactor", className: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300", icon: ShieldAlert },
  "feature": { label: "New feature", className: "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300", icon: GitBranch },
  "policy": { label: "Policy", className: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300", icon: BookOpen },
  "infra": { label: "Infrastructure", className: "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300", icon: Activity },
};

export default function RecentTeamChanges() {
  const { data, isLoading } = useQuery<PulseResponse>({
    queryKey: ['/api/feed/recent-team'],
  });

  const maxCount = Math.max(1, ...(data?.pulse.map(p => p.count) ?? [1]));

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-6">
        <div className="flex items-start justify-between flex-wrap gap-4 mb-3">
          <div>
            <h1 className="text-3xl md:text-4xl font-recoleta font-bold mb-2">Recent Team Changes</h1>
            <p className="text-muted-foreground">
              A unified feed of what the cooperative is shipping, where it cross-pollinates, and what we just refactored — in the spirit of public-record style updates.
            </p>
          </div>
          <FediverseShare
            title="TriSex.org — Recent Team Changes"
            description="Live feed of cooperative feature usage, federated cross-pollination, and the ongoing honesty-refactor changelog."
            hashtags={["TriSex", "OpenCoop", "Federation", "SexualHealth"]}
          />
        </div>

        <Alert className="border-amber-500/40 bg-amber-50/40 dark:bg-amber-950/20">
          <ShieldAlert className="h-4 w-4 text-amber-700 dark:text-amber-400" />
          <AlertTitle className="text-amber-800 dark:text-amber-300">Honesty framing</AlertTitle>
          <AlertDescription className="text-xs text-amber-800/90 dark:text-amber-200/90">
            Pulse counts are computed live from the cooperative's storage interface — no telemetry pixel, no analytics SDK, no fabricated user counts. Cross-pollination shows where TriSex.org publishes (or is gated from publishing); follower / engagement / reach numbers on those external platforms are <strong>not displayed here</strong> because we don't measure them. Earlier builds of related dashboards listed fabricated reach numbers; those have been removed and named in the changelog below.
          </AlertDescription>
        </Alert>
      </div>

      <Tabs defaultValue="pulse" className="space-y-6">
        <TabsList className="grid grid-cols-3 w-full max-w-2xl">
          <TabsTrigger value="pulse" data-testid="tab-pulse">
            <Activity className="h-4 w-4 mr-2" /> Pulse
          </TabsTrigger>
          <TabsTrigger value="cross" data-testid="tab-cross">
            <Rss className="h-4 w-4 mr-2" /> Cross-Pollination
          </TabsTrigger>
          <TabsTrigger value="log" data-testid="tab-log">
            <GitBranch className="h-4 w-4 mr-2" /> Team Changes Log
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pulse" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="font-recoleta flex items-center gap-2">
                <Activity className="h-5 w-5" /> Most-Used Features
              </CardTitle>
              <CardDescription>
                Sorted by live row count. Tap a row to jump to the feature.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {[...Array(8)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
                </div>
              ) : !data ? (
                <p className="text-sm text-muted-foreground">Could not load feature pulse.</p>
              ) : (
                <div className="space-y-2">
                  {data.pulse.map(p => (
                    <Link
                      key={p.feature}
                      href={p.route}
                      className="block group"
                      data-testid={`pulse-row-${p.category}`}
                    >
                      <div className="flex items-center gap-3 p-3 rounded-lg border hover-elevate transition-colors">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium truncate group-hover:text-primary">{p.feature}</span>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <Badge variant="outline" className="text-[10px] uppercase">{p.category}</Badge>
                              <span className="text-lg font-bold tabular-nums" data-testid={`pulse-count-${p.category}`}>{p.count}</span>
                              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                            </div>
                          </div>
                          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary/70 rounded-full transition-all"
                              style={{ width: `${(p.count / maxCount) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
              {data && (
                <p className="text-xs text-muted-foreground mt-4 italic">
                  {data.methodology} Generated {new Date(data.generatedAt).toLocaleString()}.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cross" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="font-recoleta flex items-center gap-2">
                <Rss className="h-5 w-5" /> Cross-Pollination Map
              </CardTitle>
              <CardDescription>
                Federated outposts where TriSex.org content is shared, plus the ethics gates that govern each one.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {crossPollination.map(p => {
                const Icon = p.icon;
                const sb = statusBadge[p.status];
                return (
                  <div
                    key={p.platform}
                    className="flex items-start gap-3 p-3 rounded-lg border"
                    data-testid={`cross-row-${p.platform.toLowerCase().replace(/\W+/g, '-')}`}
                  >
                    <div className={`${p.color} p-2 rounded-lg flex-shrink-0`}>
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
                        <div>
                          <h3 className="font-semibold">{p.platform}</h3>
                          <p className="text-xs text-muted-foreground">{p.protocol}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={sb.className}>{sb.label}</Badge>
                          <a
                            href={p.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-xs underline text-muted-foreground hover:text-foreground"
                          >
                            Visit <ExternalLink className="h-3 w-3 ml-1" />
                          </a>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{p.notes}</p>
                    </div>
                  </div>
                );
              })}
              <div className="mt-4 p-4 border-2 border-dashed border-amber-500/40 bg-amber-50/30 dark:bg-amber-950/10 rounded text-sm">
                <p className="font-semibold text-amber-700 dark:text-amber-400 mb-1">Why no follower / reach / engagement numbers?</p>
                <p className="text-xs text-muted-foreground">
                  TriSex.org does not pull analytics from external platforms, and we never present invented numbers. The Social Integration page used to display fabricated Bluesky / Mastodon / Pixelfed / Loops follower / post / engagement / reach figures; those were removed in an earlier honesty refactor. Real cross-platform metrics will only appear here if and when each platform exposes a verifiable, free, federated stats API and the cooperative votes to wire it up.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="log" className="space-y-3">
          {teamChangesLog.map((c, i) => {
            const tb = typeBadge[c.type];
            const Icon = tb.icon;
            return (
              <Card key={i} data-testid={`change-entry-${i}`}>
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between flex-wrap gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <Badge className={tb.className}>
                        <Icon className="h-3 w-3 mr-1" /> {tb.label}
                      </Badge>
                      <span className="text-sm font-medium">{c.area}</span>
                    </div>
                    <span className="text-xs text-muted-foreground tabular-nums">{c.date}</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{c.summary}</p>
                </CardContent>
              </Card>
            );
          })}
          <p className="text-xs text-muted-foreground italic mt-4 px-2">
            Hand-curated changelog. Each entry corresponds to commits already pushed to the main branch and recorded in the project's working notes. No automated git-log scraping yet — when wired up, this list will be derived from actual commit metadata.
          </p>
        </TabsContent>
      </Tabs>
    </div>
  );
}
