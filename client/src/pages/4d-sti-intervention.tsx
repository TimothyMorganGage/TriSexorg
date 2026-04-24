import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Droplets,
  AlertTriangle,
  Microscope,
  Waves,
  Clock,
  Heart,
  BookOpen,
  Activity,
  MapPin,
} from "lucide-react";

const PATHOGEN_TARGETS = [
  "Chlamydia trachomatis",
  "Neisseria gonorrhoeae",
  "Treponema pallidum",
  "HIV-1/2",
  "HPV (high-risk types)",
  "HSV-1/2",
];

const FOUR_D_AXES = [
  {
    axis: "Spatial",
    description:
      "Where samples are taken — wastewater catchments, clinic catchments, community-collected pools.",
  },
  {
    axis: "Temporal",
    description:
      "How often, with what latency to result, and how long aggregated trend windows are.",
  },
  {
    axis: "Pathogen-specific",
    description:
      "Per-organism assay sensitivity, specificity, and limit of detection — never the same across STIs.",
  },
  {
    axis: "Equity / consent",
    description:
      "Who consented to be sampled, who is excluded, and who has access to the resulting alerts and treatment.",
  },
];

const CITATION_SLOTS = [
  "Per-pathogen wastewater assay sensitivity / specificity / limit of detection (peer-reviewed).",
  "Population denominators and catchment maps for any geographic alert (public-health agency source).",
  "Consent and data-governance framework for community-collected sampling.",
  "Real-time data feed identifier and refresh cadence (operational source).",
  "Treatment-access pathway for any region where an alert would be issued.",
];

export default function FourDSTIIntervention() {
  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <Alert className="mb-6 bg-white dark:bg-gray-950 border-2 border-black dark:border-white">
          <Heart className="h-5 w-5 text-black dark:text-white" />
          <AlertDescription className="ml-2 text-black dark:text-white">
            <strong>Intersex Healthcare IS Everyone's Affirmation:</strong> Surveillance methodology centers intersex anatomy as the universal baseline. Every assay, denominator, and treatment pathway must serve ALL bodies — there is no separate "transgender surveillance" stream.
          </AlertDescription>
        </Alert>

        <Alert className="mb-8 border-amber-500 bg-amber-50 dark:bg-amber-950/30">
          <AlertTriangle className="h-5 w-5 text-amber-700 dark:text-amber-400" />
          <AlertDescription className="text-sm text-amber-900 dark:text-amber-200">
            <strong>This page is methodology, not surveillance output.</strong> An earlier version of this page presented invented neighborhood names ("Downtown Core", "Westside Communities", "Industrial District"), fake lat/lng "hotspots", made-up population counts, fabricated assay sensitivity / specificity numbers ("97.3% / 94.8%"), false "current alerts" naming pathogens and risk trends, and a chart whose values were a setInterval randomly drifting every 10 seconds — labeled as "real-time data". Fabricated public-health data is uniquely dangerous: people can act on it. All of it has been removed. This page now describes the framework only. Real STI surveillance data on TriSex.org would require a public-health partner, consented data flows, and citations attached to every figure.
          </AlertDescription>
        </Alert>

        <div className="text-center mb-10">
          <div className="flex items-center justify-center mb-4">
            <Droplets className="h-10 w-10 text-primary mr-3" />
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
              4D STI Intervention — Framework
            </h1>
          </div>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Spatial × Temporal × Pathogen × Equity. The four dimensions any honest STI-surveillance program must explicitly account for.
          </p>
        </div>

        <Tabs defaultValue="framework" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="framework">Framework</TabsTrigger>
            <TabsTrigger value="methods">Sampling Methods</TabsTrigger>
            <TabsTrigger value="response">Response Tiers</TabsTrigger>
            <TabsTrigger value="citations">Citation Slots</TabsTrigger>
          </TabsList>

          <TabsContent value="framework">
            <Card>
              <CardHeader>
                <CardTitle>The Four Dimensions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {FOUR_D_AXES.map((a) => (
                  <div key={a.axis} className="p-4 border rounded">
                    <p className="font-semibold">{a.axis}</p>
                    <p className="text-sm text-muted-foreground mt-1">{a.description}</p>
                  </div>
                ))}
                <Alert className="border-blue-300 bg-blue-50 dark:bg-blue-950/30">
                  <AlertDescription className="text-xs text-blue-900 dark:text-blue-200">
                    Equity sits as a co-equal axis on purpose. Surveillance that produces alerts for catchments without a treatment-access pathway is harm-producing, not health-producing.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="methods">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Waves className="mr-2 h-5 w-5 text-primary" />
                  Sampling-Method Categories
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  These are the categories of method any 4D program would draw from. Specific assay parameters (sensitivity, specificity, limit of detection, turnaround time) are pathogen-and-platform specific and must be cited from the assay manufacturer or peer-reviewed validation. None are listed here.
                </p>
                <MethodBlock
                  icon={<Activity className="h-4 w-4 mr-2" />}
                  name="Wastewater-based epidemiology (WBE)"
                  notes="Pooled signal from a wastewater catchment. Useful for population-level trends; requires careful denominator estimation (contributing population, sewer-shed boundaries) and de-identification."
                />
                <MethodBlock
                  icon={<Microscope className="h-4 w-4 mr-2" />}
                  name="Consented community sampling"
                  notes="Community health workers + members opt in to provide samples. Stronger consent profile than passive WBE; weaker geographic coverage."
                />
                <MethodBlock
                  icon={<Clock className="h-4 w-4 mr-2" />}
                  name="Clinic-derived case reporting"
                  notes="Aggregated reportable-disease feeds from partner clinics. Subject to test-seeking-behavior bias."
                />
                <div>
                  <p className="text-sm font-semibold mb-2">Pathogen targets in scope</p>
                  <div className="flex flex-wrap gap-2">
                    {PATHOGEN_TARGETS.map((p) => (
                      <Badge key={p} variant="outline">
                        {p}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="response">
            <Card>
              <CardHeader>
                <CardTitle>Response-Tier Framework</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p className="text-muted-foreground">
                  Earlier versions of this page printed specific numeric thresholds ("Low 0–15%, Critical &gt;60%") and matching response timings ("0–6 hours" for critical) without citing what the percentages measured or what authority would mobilize. Those have been removed. The category structure remains, intentionally unparameterized:
                </p>
                {["Routine surveillance", "Enhanced outreach", "Targeted intervention", "Public-health emergency coordination"].map(
                  (tier, i) => (
                    <div key={tier} className="p-3 border rounded">
                      <p className="font-semibold">
                        Tier {i + 1}: {tier}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Threshold, response time, and mobilized resources must be set by the partnering public-health authority — not by TriSex.org unilaterally.
                      </p>
                    </div>
                  ),
                )}
              </CardContent>
            </Card>

            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="flex items-center text-base">
                  <MapPin className="mr-2 h-4 w-4" />
                  Geographic alerts — currently none
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  No regions, no hotspots, no coordinates. Alerts only render here when a connected public-health partner publishes them through a documented, citation-linked feed.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="citations">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Citation Slots
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {CITATION_SLOTS.map((slot, i) => (
                  <div
                    key={i}
                    className="p-3 border-2 border-dashed border-amber-400 rounded bg-amber-50/40 dark:bg-amber-950/10"
                  >
                    <Badge variant="outline" className="mb-1">
                      Citation needed
                    </Badge>
                    <p>{slot}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function MethodBlock({
  icon,
  name,
  notes,
}: {
  icon: React.ReactNode;
  name: string;
  notes: string;
}) {
  return (
    <div className="p-3 border rounded">
      <p className="font-semibold flex items-center">
        {icon}
        {name}
      </p>
      <p className="text-xs text-muted-foreground mt-1">{notes}</p>
    </div>
  );
}
