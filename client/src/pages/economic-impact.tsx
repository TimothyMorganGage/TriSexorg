import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  DollarSign,
  Heart,
  Calculator,
  AlertTriangle,
  BookOpen,
  TrendingDown,
} from "lucide-react";

interface ScenarioInputs {
  barrierEfficacy: number;
  consistentUseRate: number;
  partnersPerYear: number;
  perContactTransmissionProb: number;
  baselinePrevalence: number;
  dalyPerInfection: number;
}

const DEFAULT_BASELINE: ScenarioInputs = {
  barrierEfficacy: 0.82,
  consistentUseRate: 0.67,
  partnersPerYear: 3.8,
  perContactTransmissionProb: 0.15,
  baselinePrevalence: 0.05,
  dalyPerInfection: 0.5,
};

const DEFAULT_INTERVENTION: ScenarioInputs = {
  barrierEfficacy: 0.82,
  consistentUseRate: 0.67,
  partnersPerYear: 1.0,
  perContactTransmissionProb: 0.15,
  baselinePrevalence: 0.05,
  dalyPerInfection: 0.5,
};

function expectedDalyPerPersonYear(s: ScenarioInputs) {
  const effectiveProtection = s.barrierEfficacy * s.consistentUseRate;
  const perPartnerInfectionProb =
    1 - Math.pow(1 - s.perContactTransmissionProb * (1 - effectiveProtection), 1) *
    (1 - s.baselinePrevalence) -
    s.baselinePrevalence * (1 - (1 - s.perContactTransmissionProb * (1 - effectiveProtection)));
  const annualInfectionProb = 1 - Math.pow(1 - Math.max(0, perPartnerInfectionProb), s.partnersPerYear);
  return annualInfectionProb * s.dalyPerInfection;
}

export default function EconomicImpact() {
  const [activeTab, setActiveTab] = useState("calculator");
  const [baseline, setBaseline] = useState<ScenarioInputs>(DEFAULT_BASELINE);
  const [intervention, setIntervention] = useState<ScenarioInputs>(DEFAULT_INTERVENTION);
  const [dalyDollarValue, setDalyDollarValue] = useState(100000);
  const [enrolledMembers, setEnrolledMembers] = useState(0);

  const baselineDaly = useMemo(() => expectedDalyPerPersonYear(baseline), [baseline]);
  const interventionDaly = useMemo(() => expectedDalyPerPersonYear(intervention), [intervention]);
  const dalyDelta = baselineDaly - interventionDaly;
  const dollarDeltaPerPerson = dalyDelta * dalyDollarValue;
  const populationDalys = dalyDelta * enrolledMembers;
  const populationDollars = dollarDeltaPerPerson * enrolledMembers;

  const updateBaseline = (key: keyof ScenarioInputs, value: number) =>
    setBaseline((prev) => ({ ...prev, [key]: value }));
  const updateIntervention = (key: keyof ScenarioInputs, value: number) =>
    setIntervention((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <Alert className="mb-6 bg-white dark:bg-gray-950 border-2 border-black dark:border-white">
          <Heart className="h-5 w-5 text-black dark:text-white" />
          <AlertDescription className="ml-2 text-black dark:text-white">
            <strong>Intersex Healthcare IS Everyone's Affirmation:</strong> This calculator centers intersex anatomy as the universal baseline. Trans, non-binary, genderqueer, and quare embodiment are all respected within its parametric inputs. There is no separate "transgender healthcare" category — every parameter applies to ALL bodies.
          </AlertDescription>
        </Alert>

        <Alert className="mb-8 border-amber-500 bg-amber-50 dark:bg-amber-950/30">
          <AlertTriangle className="h-5 w-5 text-amber-700 dark:text-amber-400" />
          <AlertDescription className="text-sm text-amber-900 dark:text-amber-200">
            <strong>This page is a parametric calculator, not a measured outcome report.</strong> Earlier versions of this page presented numbers like "47% improvement from custom fit," "97.8% protection efficacy," "1.76 DALYs saved per couple per year," and "89,234 relationships extended" as if they were measured. None of those figures came from a study TriSex.org has run or cites. They have all been removed. Below, every input starts at a literature-derived ballpark or zero — you adjust them, and the math runs live. Citations belong in the boxes provided. Population totals stay at 0 until consented enrollment data is wired in.
          </AlertDescription>
        </Alert>

        <div className="text-center mb-10">
          <div className="flex items-center justify-center mb-4">
            <Calculator className="h-10 w-10 text-primary mr-3" />
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
              DALY &amp; Cost-Effectiveness Calculator
            </h1>
          </div>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Compare two scenarios using the WHO DALY framework. Adjust each input. The math is shown in plain form below each tab.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="calculator">Scenario Calculator</TabsTrigger>
            <TabsTrigger value="methodology">Methodology &amp; Formulas</TabsTrigger>
            <TabsTrigger value="citations">Citation Slots</TabsTrigger>
          </TabsList>

          <TabsContent value="calculator">
            <div className="grid lg:grid-cols-2 gap-6">
              <ScenarioCard
                title="Scenario A — Baseline"
                description="The comparison case. Defaults are illustrative ballparks, not measured outcomes."
                inputs={baseline}
                onChange={updateBaseline}
                dalyResult={baselineDaly}
                accent="muted"
              />
              <ScenarioCard
                title="Scenario B — Intervention"
                description="The case you want to evaluate. Adjust freely."
                inputs={intervention}
                onChange={updateIntervention}
                dalyResult={interventionDaly}
                accent="primary"
              />
            </div>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingDown className="mr-2 h-5 w-5 text-primary" />
                  Computed Difference (per person, per year)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg border bg-muted/30">
                    <p className="text-xs text-muted-foreground">DALYs averted per person/year</p>
                    <p className="text-2xl font-bold">{dalyDelta.toFixed(4)}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      = baseline DALY/yr − intervention DALY/yr
                    </p>
                  </div>
                  <div className="p-4 rounded-lg border bg-muted/30">
                    <Label htmlFor="dalyValue" className="text-xs text-muted-foreground">
                      Economic value per DALY ($)
                    </Label>
                    <Input
                      id="dalyValue"
                      type="number"
                      min={0}
                      value={dalyDollarValue}
                      onChange={(e) => setDalyDollarValue(Number(e.target.value) || 0)}
                      className="mt-1"
                      data-testid="input-daly-dollar-value"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      WHO suggests using country-specific GDP per capita; $100k is a common US ballpark.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg border bg-primary/10">
                    <p className="text-xs text-muted-foreground">$ averted per person/year</p>
                    <p className="text-2xl font-bold text-primary">
                      ${dollarDeltaPerPerson.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">= DALYs averted × $/DALY</p>
                  </div>
                </div>

                <div className="mt-6 grid md:grid-cols-3 gap-4 items-end">
                  <div>
                    <Label htmlFor="enrolled" className="text-sm">
                      Population multiplier — enrolled members
                    </Label>
                    <Input
                      id="enrolled"
                      type="number"
                      min={0}
                      value={enrolledMembers}
                      onChange={(e) => setEnrolledMembers(Number(e.target.value) || 0)}
                      className="mt-1"
                      data-testid="input-enrolled-members"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Stays at 0 until consented enrollment data is wired in.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg border">
                    <p className="text-xs text-muted-foreground">Population DALYs averted/yr</p>
                    <p className="text-xl font-bold">
                      {populationDalys.toLocaleString(undefined, { maximumFractionDigits: 1 })}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg border">
                    <p className="text-xs text-muted-foreground">Population $ averted/yr</p>
                    <p className="text-xl font-bold">
                      ${populationDollars.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </p>
                  </div>
                </div>

                <Alert className="mt-6 border-blue-300 bg-blue-50 dark:bg-blue-950/30">
                  <AlertDescription className="text-xs text-blue-900 dark:text-blue-200">
                    Output reflects the inputs you typed. Nothing here is a measured outcome of the TriSex.org platform until a published study or operational telemetry is cited in the next tab.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="methodology">
            <Card>
              <CardHeader>
                <CardTitle>Formulas Used</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <Block label="WHO DALY framework">
                  DALY = YLL + YLD<br />
                  YLL = years of life lost (premature mortality)<br />
                  YLD = years lived with disability (incidence × duration × disability weight)<br />
                  1 DALY = 1 lost year of healthy life.
                </Block>
                <Block label="Effective protection per encounter">
                  effectiveProtection = barrierEfficacy × consistentUseRate
                </Block>
                <Block label="Per-partner annual infection probability (simplified)">
                  P(infection | partner exposed) ≈ baselinePrevalence × (1 − (1 − perContactTransmissionProb × (1 − effectiveProtection)))
                  <br />
                  P(annual infection) = 1 − (1 − P_per_partner)^partnersPerYear
                </Block>
                <Block label="DALYs averted per person/year">
                  ΔDALY = baselineP × dalyPerInfection − interventionP × dalyPerInfection
                </Block>
                <Block label="Economic value">
                  $ averted = ΔDALY × $/DALY
                  <br />
                  Population $ = $ averted × enrolledMembers
                </Block>
                <p className="text-xs text-muted-foreground pt-2">
                  These formulas are deliberately simple — single-pathogen, well-mixed, no temporal discounting, no age weighting. They are useful for comparing scenarios on the same axis, not for forecasting public-health outcomes. For real epidemiological modeling, consult published transmission-network models (Anderson &amp; May; Garnett; current GBD methodology).
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
              <CardContent className="space-y-4 text-sm">
                <p className="text-muted-foreground">
                  TriSex.org has not run any of the studies that earlier versions of this page implied. Below are the slots where real citations belong before any of the underlying numbers can be presented as anything other than user inputs.
                </p>
                <div className="space-y-3">
                  {[
                    "Custom-fit barrier efficacy delta vs standard barriers (RCT or systematic review).",
                    "Consistent-use-rate evidence by product fit and population.",
                    "Per-contact transmission probability per pathogen (HIV, GC, CT, syphilis, HPV, HSV).",
                    "Disability weight per condition (GBD reference).",
                    "Cost-per-DALY thresholds by jurisdiction (WHO-CHOICE; ICER).",
                    "Population enrollment + consented-telemetry methodology.",
                  ].map((slot, i) => (
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
                </div>
                <Alert className="border-amber-500 bg-amber-50 dark:bg-amber-950/30 mt-4">
                  <DollarSign className="h-4 w-4 text-amber-700 dark:text-amber-400" />
                  <AlertDescription className="text-xs text-amber-900 dark:text-amber-200">
                    Stablecoin dividend, debt-impact, and "lifetimes saved" headlines from the previous version were removed. They depended on the same fabricated efficacy chain. Reintroducing them requires both (a) a real ledger of distributions and (b) cited efficacy parameters above.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function Block({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="font-semibold mb-1">{label}</p>
      <div className="bg-muted/40 p-3 rounded font-mono text-xs whitespace-pre-wrap">{children}</div>
    </div>
  );
}

function ScenarioCard({
  title,
  description,
  inputs,
  onChange,
  dalyResult,
  accent,
}: {
  title: string;
  description: string;
  inputs: ScenarioInputs;
  onChange: (key: keyof ScenarioInputs, value: number) => void;
  dalyResult: number;
  accent: "primary" | "muted";
}) {
  return (
    <Card className={accent === "primary" ? "border-primary/40" : ""}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <NumericInput
          label="Barrier efficacy (0–1)"
          value={inputs.barrierEfficacy}
          step={0.01}
          min={0}
          max={1}
          onChange={(v) => onChange("barrierEfficacy", v)}
          testid={`barrier-efficacy-${accent}`}
        />
        <NumericInput
          label="Consistent-use rate (0–1)"
          value={inputs.consistentUseRate}
          step={0.01}
          min={0}
          max={1}
          onChange={(v) => onChange("consistentUseRate", v)}
          testid={`consistent-use-${accent}`}
        />
        <NumericInput
          label="Partners per year"
          value={inputs.partnersPerYear}
          step={0.1}
          min={0}
          onChange={(v) => onChange("partnersPerYear", v)}
          testid={`partners-${accent}`}
        />
        <NumericInput
          label="Per-contact transmission probability (0–1)"
          value={inputs.perContactTransmissionProb}
          step={0.01}
          min={0}
          max={1}
          onChange={(v) => onChange("perContactTransmissionProb", v)}
          testid={`transmission-${accent}`}
        />
        <NumericInput
          label="Baseline prevalence in partner pool (0–1)"
          value={inputs.baselinePrevalence}
          step={0.001}
          min={0}
          max={1}
          onChange={(v) => onChange("baselinePrevalence", v)}
          testid={`prevalence-${accent}`}
        />
        <NumericInput
          label="DALYs per infection (disability-weighted years)"
          value={inputs.dalyPerInfection}
          step={0.01}
          min={0}
          onChange={(v) => onChange("dalyPerInfection", v)}
          testid={`daly-per-infection-${accent}`}
        />

        <div className="mt-4 p-3 rounded border bg-muted/40">
          <p className="text-xs text-muted-foreground">Expected DALYs per person/year</p>
          <p className="text-xl font-bold">{dalyResult.toFixed(4)}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function NumericInput({
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
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <Label className="text-sm">{label}</Label>
        <Input
          type="number"
          value={value}
          step={step}
          min={min}
          max={max}
          onChange={(e) => onChange(Number(e.target.value) || 0)}
          className="w-28 h-8 text-right"
          data-testid={`input-${testid}`}
        />
      </div>
      {typeof max === "number" && max <= 1 && (
        <Slider
          value={[value]}
          min={min ?? 0}
          max={max}
          step={step ?? 0.01}
          onValueChange={(v) => onChange(v[0])}
          data-testid={`slider-${testid}`}
        />
      )}
    </div>
  );
}
