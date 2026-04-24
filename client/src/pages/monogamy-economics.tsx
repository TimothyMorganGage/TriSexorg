import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertTriangle,
  DollarSign,
  Heart,
  Lock,
  Users,
  Calculator,
  Activity,
  Target,
  BookOpen,
} from "lucide-react";

const COST_CATEGORIES = [
  "STI testing (annual)",
  "Barrier protection",
  "PrEP medication (if applicable)",
  "Additional vaccinations",
  "Expected STI treatment",
  "Emotional / therapy support",
];

export default function MonogamyEconomics() {
  const [networkSize, setNetworkSize] = useState(2);
  const [perContactProb, setPerContactProb] = useState(0.2);
  const [baselinePrevalence, setBaselinePrevalence] = useState(0.001);

  const annualNetworkRisk = useMemo(() => {
    const exposureProb = baselinePrevalence * (1 - Math.pow(1 - perContactProb, Math.max(0, networkSize - 1)));
    return Math.min(1, Math.max(0, exposureProb));
  }, [networkSize, perContactProb, baselinePrevalence]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:to-blue-900 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <Alert className="mb-6 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/40 border-purple-200">
          <Heart className="h-5 w-5 text-black dark:text-white" />
          <AlertDescription className="ml-2 text-black dark:text-white">
            <strong>Intersex Healthcare IS Everyone's Affirmation:</strong> This page centers intersex anatomy as the universal baseline. Trans, non-binary, genderqueer, and quare embodiment are all respected within this framework. There is no separate "transgender healthcare" category — every parameter applies to ALL bodies.
          </AlertDescription>
        </Alert>

        <Alert className="mb-6 border-amber-500 bg-amber-50 dark:bg-amber-950/30">
          <AlertTriangle className="h-5 w-5 text-amber-700 dark:text-amber-400" />
          <AlertDescription className="text-sm text-amber-900 dark:text-amber-200">
            <strong>This page is methodology + policy, not measured outcomes.</strong> Earlier versions presented dollar ranges (e.g., "monogamy $470–$2,110/yr vs open relationship $5,700–$33,700/yr"), DALY ranges (e.g., "monogamy 0.01–0.05 DALY/lifetime vs open network 0.5–2.0"), and lifetime economic impacts (up to "$300,000 per person") as if they were established findings. They were not — none cited a study, none came from TriSex.org data. They have been removed and replaced with (a) a live transmission-network calculator you control and (b) cost-category lists where real numbers belong only after a citation is attached.
          </AlertDescription>
        </Alert>

        <div className="text-center mb-12">
          <div className="flex justify-center mb-4 text-6xl">⚧️</div>
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
            The Econometrics of Monogamy vs. Non-Monogamy
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Why TriSex.org maintains exclusive focus on monogamous relationships — framework, parametric model, and policy.
          </p>
        </div>

        <Alert className="mb-8 border-2 border-blue-500 bg-blue-50 dark:bg-blue-950">
          <Lock className="h-5 w-5 text-blue-600" />
          <AlertDescription className="text-blue-900 dark:text-blue-100">
            <strong>TriSex.org Policy:</strong> This platform exclusively serves monogamous relationship structures. We do not provide products, services, or support for polyamorous, open, or non-monogamous arrangements. The policy is grounded in transmission-network mathematics (calculator below) and in the operational reality that custom-fit barrier work optimizes for closed dyads. It is a platform-design choice, not a moral judgment about other relationship structures.
          </AlertDescription>
        </Alert>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl">
              <Calculator className="h-6 w-6 mr-2 text-purple-600" />
              Econometric Cost Categories
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              These are the legitimate cost categories any relationship-structure comparison must account for. They were enumerated in the previous version of this page; what changed is that the dollar ranges below each category were removed because they were uncited.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <CategoryList
                icon={<DollarSign className="h-5 w-5 mr-2 text-green-600" />}
                title="Direct Medical Costs"
                items={[
                  "STI testing frequency and costs",
                  "Treatment expenses for infections",
                  "PrEP medication costs (HIV prevention)",
                  "Vaccination expenses (HPV, Hepatitis A/B)",
                  "Specialist consultations",
                  "Long-term health complications",
                ]}
              />
              <CategoryList
                icon={<Activity className="h-5 w-5 mr-2 text-red-600" />}
                title="Network Effects &amp; Exposure Risk"
                items={[
                  "Transmission probability across network nodes",
                  "Exponential exposure multiplication",
                  "Unknown partner histories",
                  "Asymptomatic carrier rates",
                  "Testing window gaps",
                  "Behavioral risk cascades",
                ]}
              />
              <CategoryList
                icon={<Users className="h-5 w-5 mr-2 text-orange-600" />}
                title="Time &amp; Opportunity Costs"
                items={[
                  "Increased testing appointment time",
                  "Relationship negotiation complexity",
                  "Coordination and scheduling overhead",
                  "Conflict resolution resources",
                ]}
              />
              <CategoryList
                icon={<Target className="h-5 w-5 mr-2 text-blue-600" />}
                title="Long-Term Economic Impact"
                items={[
                  "Fertility complications from STIs",
                  "Chronic illness management costs",
                  "Disability-adjusted life years (DALYs)",
                  "Insurance premium impacts",
                ]}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8 border-2 border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl text-red-700 dark:text-red-400">
              <AlertTriangle className="h-6 w-6 mr-2" />
              Transmission-Network Calculator
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              The math here is real. The values are yours to set. Network exposure grows with the number of people connected within your sexual-contact graph.
            </p>

            <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded font-mono text-xs">
              <p>P(annual exposure) ≈ baselinePrevalence × (1 − (1 − perContactProb)^(networkSize − 1))</p>
              <p className="mt-2 text-muted-foreground">
                Simplified, well-mixed approximation. Real epidemiology uses contact graphs, temporal windows, and per-pathogen parameters.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <NumericField
                label="Network size (people in your contact graph)"
                value={networkSize}
                step={1}
                min={2}
                onChange={setNetworkSize}
                testid="network-size"
              />
              <NumericField
                label="Per-contact transmission probability"
                value={perContactProb}
                step={0.01}
                min={0}
                max={1}
                onChange={setPerContactProb}
                testid="per-contact-prob"
              />
              <NumericField
                label="Baseline prevalence in network"
                value={baselinePrevalence}
                step={0.001}
                min={0}
                max={1}
                onChange={setBaselinePrevalence}
                testid="baseline-prevalence"
              />
            </div>

            <div className="p-4 rounded-lg border-2 border-red-300 bg-white dark:bg-gray-800 mt-4 text-center">
              <p className="text-xs text-muted-foreground">Computed annual exposure probability</p>
              <p className="text-3xl font-bold text-red-600">
                {(annualNetworkRisk * 100).toFixed(2)}%
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                A monogamous dyad (networkSize = 2) collapses the (1 − perContactProb)^(n−1) term to a single contact, which after a comprehensive testing window and fluid-bonding approaches the prevalence of new external exposure (i.e., near zero if both partners stay closed).
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl">
              <DollarSign className="h-6 w-6 mr-2 text-green-600" />
              Annual Cost Comparison
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              The previous version showed three columns of dollar ranges. They are removed. The category list remains. Real numbers belong here only when a study or operational dataset is cited.
            </p>
            <div className="space-y-2">
              {COST_CATEGORIES.map((cat) => (
                <div
                  key={cat}
                  className="flex items-center justify-between p-3 border-2 border-dashed border-amber-400 rounded bg-amber-50/40 dark:bg-amber-950/10"
                >
                  <span className="text-sm">{cat}</span>
                  <Badge variant="outline">Citation needed</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl">
              <Activity className="h-6 w-6 mr-2 text-purple-600" />
              DALY Impact — Methodology Only
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p className="text-muted-foreground">
              DALYs measure disease burden by combining years of life lost to premature death with years lived with disability (YLL + YLD). Comparing relationship structures requires per-pathogen disability weights, age weighting (or its rejection — current GBD practice does not age-weight), and time-discount choices. None of those parameters can be filled in honestly without source citations.
            </p>
            <p className="text-muted-foreground">
              For per-person DALY estimates by scenario, use the calculator on the <a href="/economic-impact" className="text-primary underline">Economic Impact</a> page — every input is yours to control and every number is shown as derived.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8 border-2 border-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl text-blue-700 dark:text-blue-400">
              <Target className="h-6 w-6 mr-2" />
              Why TriSex.org Exclusively Serves Monogamous Relationships
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              <strong className="text-foreground">Network mathematics:</strong> custom-fit barrier work and 4D STI tracking optimize for closed dyads where the testing-window-then-fluid-bond pattern is operationally meaningful. In open networks, that pattern doesn't apply, and the barrier-efficacy assumptions in our products were not designed against open-network exposure curves.
            </p>
            <p>
              <strong className="text-foreground">Operational scope, not moral judgment:</strong> polyamory and open relationships work for many people. They require different infrastructure — more frequent testing, different consent-disclosure tooling, and risk models that assume continuous external exposure. TriSex.org does not provide that infrastructure and does not pretend its monogamy-tuned tooling fits those structures. Members in those structures are better served by platforms designed for them.
            </p>
            <p>
              <strong className="text-foreground">No claim of superiority:</strong> nothing on this page argues that monogamy produces better outcomes for any individual. The argument is narrower: the platform's tools were built for one structure, and operating them on a different structure would silently misrepresent the protection they offer.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8 border-2 border-yellow-500">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl text-yellow-700 dark:text-yellow-400">
              <AlertTriangle className="h-6 w-6 mr-2" />
              Operational Note on "Separated" or Open-Relationship Dating
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              The previous version of this section listed prescriptive "do not date" rules. Those have been removed because they framed personal relationship choices as platform-issued directives. The operational reality TriSex.org cares about is narrower:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>The fluid-bonding workflow assumes a closed dyad after a testing window. If either partner has an active sexual contact outside the dyad, the workflow's assumptions don't hold.</li>
              <li>"Separated" status is operationally ambiguous for the testing-window calculation; the calculator above treats network size honestly regardless of legal status.</li>
              <li>Members are responsible for their own disclosures. The platform's role is to make the network-size and exposure math transparent, not to dictate who anyone may date.</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-2xl">
              <BookOpen className="h-6 w-6 mr-2" />
              Citation Slots
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {[
              "Per-pathogen per-contact transmission probabilities (with confidence intervals).",
              "Per-pathogen disability weights from current GBD methodology.",
              "Cost ranges for STI testing, treatment, PrEP, and vaccination by jurisdiction.",
              "Empirical relationship-structure cohort data (peer-reviewed).",
              "Cost-per-DALY thresholds for cost-effectiveness conclusions (WHO-CHOICE / ICER).",
            ].map((slot, i) => (
              <div
                key={i}
                className="p-3 border-2 border-dashed border-amber-400 rounded bg-amber-50/40 dark:bg-amber-950/10"
              >
                <Badge variant="outline" className="mb-1">
                  Citation needed
                </Badge>
                <p className="text-foreground">{slot}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function CategoryList({
  icon,
  title,
  items,
}: {
  icon: React.ReactNode;
  title: string;
  items: string[];
}) {
  return (
    <div>
      <h3 className="font-semibold text-lg mb-2 flex items-center">
        {icon}
        {title}
      </h3>
      <ul className="space-y-1 text-sm text-muted-foreground">
        {items.map((it) => (
          <li key={it}>• {it}</li>
        ))}
      </ul>
    </div>
  );
}

function NumericField({
  label,
  value,
  onChange,
  step,
  min,
  max,
  testid,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  step?: number;
  min?: number;
  max?: number;
  testid?: string;
}) {
  return (
    <div>
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <Input
        type="number"
        value={value}
        step={step}
        min={min}
        max={max}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
        className="mt-1"
        data-testid={`input-${testid}`}
      />
    </div>
  );
}
