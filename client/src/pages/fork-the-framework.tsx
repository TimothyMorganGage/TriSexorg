import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  ADOPTED_SURFACES,
  INCLUSIVE_ORDERING_FRAMEWORK_VERSION,
  INCLUSIVE_ORDERING_FRAMEWORK_LICENCE,
  INCLUSIVE_ORDERING_FRAMEWORK_SOURCE_OF_TRUTH,
} from "@shared/inclusive-ordering";
import {
  INTERSEX_VARIATIONS,
  INTERSEX_CATEGORIES,
  ASSIGNMENT_MARKERS,
  countVariationsByMarker,
} from "@/data/intersex-variations";
import {
  GitFork,
  Code,
  ShieldCheck,
  ExternalLink,
  Copy,
  Check,
  BookOpen,
  Scale,
  Users,
  Database,
  AlertTriangle,
} from "lucide-react";

const PUBLIC_API = [
  { name: "INTERSEX_VARIATIONS", kind: "const", summary: "Array of 86 named intersex variations with category, relevant zones, fitting note, and consult-required flag." },
  { name: "INTERSEX_CATEGORIES", kind: "const", summary: "8 grouping categories with id, label, and short blurb." },
  { name: "FITTING_PARAMS", kind: "const", summary: "Controlled vocabulary of fitting controls (slider/select/switch/text) with default values and zone applicability." },
  { name: "getApplicableParams(variation)", kind: "fn", summary: "Returns the FittingParamId list applicable to the given variation, derived from its relevant zones plus universals." },
  { name: "getDefaultCustomization(variation)", kind: "fn", summary: "Returns the default values for every applicable param for a variation, including the consultRequired switch." },
  { name: "ASSIGNMENT_MARKERS", kind: "const", summary: "AMAB / AFAB / AXAB triad with expansion, label, and per-marker honesty blurb." },
  { name: "getAssignmentMarkers(variation)", kind: "fn", summary: "Returns the recorded-birth-assignment marker(s) for a variation, using a category default plus per-variation overrides." },
  { name: "countVariationsByMarker(marker)", kind: "fn", summary: "Returns the count of variations whose assignment includes the given marker (overlapping)." },
  { name: "multiUseBalanceSchema", kind: "zod", summary: "Zod schema describing the persisted JSON shape on the orders table — covers role balance, contact zones, procreative mode, intersex variations, per-variation custom params, and fold-state index." },
  { name: "ADOPTED_SURFACES", kind: "const", summary: "Catalogue of surfaces an adopter can claim adherence to (catalogue, marker-filter, fitting-params, multi-use-balance, fold-sequence, schema)." },
];

const SAMPLE_USAGE = `// In your app, after copying shared/inclusive-ordering/ and
// client/src/data/intersex-variations.ts under matching paths:
import {
  INTERSEX_VARIATIONS,
  ASSIGNMENT_MARKERS,
  getAssignmentMarkers,
  getDefaultCustomization,
  multiUseBalanceSchema,
  INCLUSIVE_ORDERING_FRAMEWORK_VERSION,
} from "@shared/inclusive-ordering";

// Filter the catalogue by recorded birth assignment:
const afabOnly = INTERSEX_VARIATIONS.filter((v) =>
  getAssignmentMarkers(v).includes("AFAB"),
);

// Persist an order in the canonical multi-use-balance shape:
const order = multiUseBalanceSchema.parse({
  roleBalance: "versatile",
  contactZones: ["oral", "anal", "vaginal"],
  procreativeMode: "barrier-only",
  selectedVariations: ["cais", "mrkh"],
  variationCustomizations: {
    cais: getDefaultCustomization(INTERSEX_VARIATIONS.find((v) => v.id === "cais")!),
    mrkh: getDefaultCustomization(INTERSEX_VARIATIONS.find((v) => v.id === "mrkh")!),
  },
  currentFoldIndex: 0,
});`;

const ADOPTER_CHECKLIST = [
  "Use the canonical 86-variation catalogue (or a documented subset / superset using the same identifier scheme).",
  "Preserve the AMAB / AFAB / AXAB marker triad with the same overlap semantics — variations spanning more than one assignment must appear under each.",
  "Surface the same honesty notes (paraphrasing allowed; meaning preserved) — markers describe recorded birth assignment, not anatomy; counts are not clinical stats; fitting notes are design hypotheses, not medical advice.",
  "Honour the CC BY-SA 4.0 licence: attribute \"TriSex.org Inclusive Ordering Framework\" and share derivative data under the same licence.",
  "Self-report adoption at /inclusive-ordering-registry on this app — even pending entries help map the federated network.",
];

const FILES_TO_COPY = [
  { path: "shared/inclusive-ordering/index.ts", purpose: "Stable public-API barrel — re-exports the framework's named surface." },
  { path: "client/src/data/intersex-variations.ts", purpose: "Catalogue, fitting params, assignment-marker derivation. Single source of truth for the 86 variations." },
  { path: "shared/schema.ts (orders + multiUseBalanceSchema sections)", purpose: "Drizzle table for orders and the Zod schema for the multi-use-balance JSON shape." },
];

export default function ForkTheFramework() {
  const [copied, setCopied] = useState(false);

  const copySample = async () => {
    try {
      await navigator.clipboard.writeText(SAMPLE_USAGE);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard not available */
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/5 text-xs uppercase tracking-wide">
            <GitFork className="h-3.5 w-3.5" /> Fork the framework
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold">Inclusive Ordering Framework</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            The data, types, and UX vocabulary TriSex.org uses to fit protection products to anatomical
            diversity, with intersex anatomy as the universal baseline. Open-source, CC BY-SA 4.0,
            ready for your app.
          </p>
          <div className="flex flex-wrap justify-center gap-2 pt-2">
            <Badge variant="outline">v{INCLUSIVE_ORDERING_FRAMEWORK_VERSION}</Badge>
            <Badge variant="outline">{INCLUSIVE_ORDERING_FRAMEWORK_LICENCE}</Badge>
            <Badge variant="outline">{INTERSEX_VARIATIONS.length} variations</Badge>
            <Badge variant="outline">{INTERSEX_CATEGORIES.length} categories</Badge>
            <Badge variant="outline">{ASSIGNMENT_MARKERS.length} markers</Badge>
          </div>
        </div>

        {/* Honesty alert */}
        <Alert className="border-amber-500/40 bg-amber-50 dark:bg-amber-950/20 text-amber-900 dark:text-amber-100">
          <AlertTriangle className="h-4 w-4 !text-amber-600 dark:!text-amber-400" />
          <AlertTitle className="text-amber-900 dark:text-amber-100">Honesty notes are part of the framework — not optional</AlertTitle>
          <AlertDescription className="text-sm space-y-1 mt-2 text-amber-900/90 dark:text-amber-100/90">
            <p>If you adopt this framework, you also adopt these honesty rules:</p>
            <ul className="list-disc pl-5 space-y-0.5">
              <li>AMAB / AFAB / AXAB describe recorded birth assignment, not anatomy.</li>
              <li>AXAB ("Assigned X / Intersex At Birth") is legal in only some jurisdictions.</li>
              <li>Variation counts per marker are intentional groupings, not clinical statistics.</li>
              <li>Fitting notes are design hypotheses for protection sizing, never medical advice.</li>
              <li>Selection is self-reported only — no biometric verification is implied.</li>
            </ul>
          </AlertDescription>
        </Alert>

        {/* What is in it */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" /> What you get
            </CardTitle>
            <CardDescription>The framework currently exposes {PUBLIC_API.length} stable symbols.</CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-3">
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">Catalogue & categories</h4>
              <div className="flex flex-wrap gap-1">
                {INTERSEX_CATEGORIES.map((c) => {
                  const count = INTERSEX_VARIATIONS.filter((v) => v.category === c.id).length;
                  return (
                    <Badge key={c.id} variant="secondary" className="text-xs">
                      {c.label} <span className="ml-1 opacity-70">({count})</span>
                    </Badge>
                  );
                })}
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">Sex-marker assignment</h4>
              <div className="flex flex-wrap gap-1">
                {ASSIGNMENT_MARKERS.map((m) => (
                  <Badge key={m.id} variant="secondary" className="text-xs">
                    {m.label} <span className="ml-1 opacity-70">({countVariationsByMarker(m.id)})</span>
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Public API table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" /> Public API
            </CardTitle>
            <CardDescription>
              All symbols are exported from <code className="text-xs px-1 py-0.5 rounded bg-muted">@shared/inclusive-ordering</code>.
              Implementation lives in <code className="text-xs px-1 py-0.5 rounded bg-muted">client/src/data/intersex-variations.ts</code>
              {" "}and <code className="text-xs px-1 py-0.5 rounded bg-muted">shared/schema.ts</code>.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border rounded divide-y text-sm">
              {PUBLIC_API.map((sym) => (
                <div key={sym.name} className="grid grid-cols-[8rem_1fr] gap-3 p-3" data-testid={`api-symbol-${sym.name}`}>
                  <div className="space-y-1">
                    <code className="text-xs font-mono break-all">{sym.name}</code>
                    <div>
                      <Badge variant="outline" className="text-[10px]">{sym.kind}</Badge>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">{sym.summary}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Sample usage */}
        <Card>
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" /> Sample usage
              </CardTitle>
              <CardDescription>Copy this snippet into your app once the files are in place.</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={copySample}
              data-testid="copy-sample-usage"
              className="shrink-0"
            >
              {copied ? <Check className="h-4 w-4 mr-1.5" /> : <Copy className="h-4 w-4 mr-1.5" />}
              {copied ? "Copied" : "Copy"}
            </Button>
          </CardHeader>
          <CardContent>
            <pre className="text-[11px] leading-relaxed p-3 rounded border bg-muted/40 overflow-x-auto">
              <code>{SAMPLE_USAGE}</code>
            </pre>
          </CardContent>
        </Card>

        {/* Files to copy */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitFork className="h-5 w-5" /> Files to copy
            </CardTitle>
            <CardDescription>Mirror these paths in your repository to keep the import surface stable.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {FILES_TO_COPY.map((f) => (
              <div key={f.path} className="border rounded p-3 text-xs space-y-1" data-testid={`file-${f.path}`}>
                <code className="font-mono break-all">{f.path}</code>
                <p className="text-muted-foreground">{f.purpose}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Adopter checklist */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5" /> Adopter checklist
            </CardTitle>
            <CardDescription>What an app needs to claim "powered by Inclusive Ordering".</CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="space-y-2 text-sm list-decimal pl-5">
              {ADOPTER_CHECKLIST.map((item, i) => (
                <li key={i} data-testid={`checklist-item-${i}`}>{item}</li>
              ))}
            </ol>
          </CardContent>
        </Card>

        {/* Adopted-surfaces vocabulary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" /> Adopted-surfaces vocabulary
            </CardTitle>
            <CardDescription>
              When you self-report at the registry, you'll declare which of these surfaces you use.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-3">
            {ADOPTED_SURFACES.map((s) => (
              <div key={s.id} className="border rounded p-3 text-xs space-y-1" data-testid={`surface-${s.id}`}>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{s.label}</span>
                  <code className="text-[10px] px-1 py-0.5 rounded bg-muted">{s.id}</code>
                </div>
                <p className="text-muted-foreground">{s.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Licence */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5" /> Licence: {INCLUSIVE_ORDERING_FRAMEWORK_LICENCE}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2 text-muted-foreground">
            <p>
              The Inclusive Ordering Framework is released under{" "}
              <a
                href="https://creativecommons.org/licenses/by-sa/4.0/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline inline-flex items-center gap-1"
              >
                Creative Commons Attribution-ShareAlike 4.0 International
                <ExternalLink className="h-3 w-3" />
              </a>
              . You are free to share and adapt the data, schema, and types — including for commercial use —
              provided you attribute the source ("TriSex.org Inclusive Ordering Framework") and license your
              derivative under the same terms.
            </p>
            <p>
              Source of truth: <code className="text-xs">{INCLUSIVE_ORDERING_FRAMEWORK_SOURCE_OF_TRUTH}</code>
            </p>
          </CardContent>
        </Card>

        {/* CTAs */}
        <div className="flex flex-wrap gap-3 justify-center">
          <Link href="/inclusive-ordering-registry">
            <Button data-testid="cta-registry">
              <Users className="h-4 w-4 mr-1.5" /> Self-report your adoption
            </Button>
          </Link>
          <Link href="/inclusive-ordering">
            <Button variant="outline" data-testid="cta-configurator">
              <Database className="h-4 w-4 mr-1.5" /> Try the configurator
            </Button>
          </Link>
          <Link href="/domain-purchase">
            <Button variant="outline" data-testid="cta-remix">
              <GitFork className="h-4 w-4 mr-1.5" /> Remix to Replit
            </Button>
          </Link>
          <Link href="/our-plans">
            <Button variant="outline" data-testid="cta-our-plans">
              <BookOpen className="h-4 w-4 mr-1.5" /> OUR Plans
            </Button>
          </Link>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          Framework version {INCLUSIVE_ORDERING_FRAMEWORK_VERSION} · Public surface kept stable across patch releases.
          Breaking changes require a major version bump and a migration note here.
        </p>
      </div>
    </div>
  );
}
