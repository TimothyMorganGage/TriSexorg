import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  GitFork,
  Sprout,
  Users,
  BookOpen,
  ShieldCheck,
  Scale,
  ExternalLink,
  AlertTriangle,
  Handshake,
} from "lucide-react";

const PILLARS = [
  {
    id: "opportunity-unity-reality",
    letters: "O.U.R.",
    title: "Opportunity Unity Reality",
    icon: Handshake,
    blurb:
      "Every fork is an opportunity, every adopter adds unity, and honesty keeps it reality. Plans are labelled as plans; only shipped, verifiable features are described as real.",
    commitments: [
      "Opportunity: anyone may fork this app and its data models under CC BY-SA 4.0 — no permission needed, no gatekeeping.",
      "Unity: forks stay connected through the adopter registry and federated syndication rather than central control.",
      "Reality: no fabricated partnerships, capacity numbers, or member counts — here or in any fork that carries the OUR name.",
    ],
  },
  {
    id: "open-united-resources",
    letters: "O.U.R.",
    title: "Open United Resources",
    icon: BookOpen,
    blurb:
      "The whole resource base — source code, schemas, the 86-variation catalogue, fold sequences, wiki content — is open and shared alike, so united communities never start from zero.",
    commitments: [
      "Full source and database schema are copyable via Remix; the Inclusive Ordering Framework is a documented public surface.",
      "Share-alike: derivative designs and data stay CC BY-SA 4.0, so improvements flow back to everyone.",
      "Resources are pooled, not hoarded — the LETS mutual-credit framing applies to knowledge as much as goods.",
    ],
  },
  {
    id: "our-universal-resilience",
    letters: "O.U.R.",
    title: "Our Universal Resilience",
    icon: Sprout,
    blurb:
      "A movement that lives in many independent copies cannot be shut down, bought out, or quietly rewritten. Forks are the resilience plan.",
    commitments: [
      "No single point of failure: if this instance disappears, every fork keeps the catalogue, the wiki, and the cooperative model alive.",
      "Regional chapters, translations, and specialized-community forks are encouraged, not merely tolerated.",
      "Privacy-preserving verification (passkeys, wallet age checks) travels with the code — resilience includes member safety.",
    ],
  },
  {
    id: "obviously-unitarian-research",
    letters: "O.U.R.",
    title: "Obviously Unitarian Research",
    icon: Users,
    blurb:
      "Research here is unitarian in the plain sense: one equal community of cooperators, no role hierarchy, no researcher/subject divide — and it is obvious because every method is public.",
    commitments: [
      "Every cooperator is an equal contributor; there are no admin, clinic-staff, or consumer castes anywhere in the data model.",
      "Evidence claims cite public sources (NIH NLM, NCCIH) and design hypotheses are labelled as hypotheses, never as medical advice.",
      "Findings, schemas, and methods are published in the open so any fork can replicate, challenge, or extend them.",
    ],
  },
];

export default function OurPlans() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-gray-900 dark:to-emerald-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-10">
        <div className="text-center space-y-4">
          <Badge variant="outline" className="text-sm" data-testid="badge-our-plans">
            Opportunity Unifying Resource Plans — a forkable vision
          </Badge>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white" data-testid="text-our-plans-title">
            OUR Plans
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Opportunity Unifying Resource Plans: four readings of the same three letters, all describing
            what happens when you fork this app — Opportunity Unity Reality, Open United Resources, Our
            Universal Resilience, and Obviously Unitarian Research.
          </p>
        </div>

        <Alert className="border-amber-400 dark:border-amber-600" data-testid="alert-plans-honesty">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>These are plans, honestly labelled as plans</AlertTitle>
          <AlertDescription>
            The OUR pillars describe intent and direction, not existing programs, funding, or partner
            organizations. What already exists and works is linked below (Remix, the Inclusive Ordering
            Framework, the adopter registry); everything else on this page is a commitment we hold
            ourselves — and any fork carrying the OUR name — to.
          </AlertDescription>
        </Alert>

        <div className="grid md:grid-cols-2 gap-6">
          {PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <Card key={pillar.id} id={pillar.id} data-testid={`card-pillar-${pillar.id}`}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Icon className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                    <div>
                      <Badge variant="secondary" className="mb-1">{pillar.letters}</Badge>
                      <CardTitle className="text-xl">{pillar.title}</CardTitle>
                    </div>
                  </div>
                  <CardDescription className="pt-2">{pillar.blurb}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300 list-disc pl-5">
                    {pillar.commitments.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="border-2 border-emerald-500" data-testid="card-fork-the-app">
          <CardHeader>
            <div className="flex items-center gap-3">
              <GitFork className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              <CardTitle className="text-2xl">Fork the app</CardTitle>
            </div>
            <CardDescription>
              The OUR plans only work if forking is real. It is — today, in two ways:
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg border bg-white dark:bg-gray-950">
                <h3 className="font-semibold mb-1 flex items-center gap-2">
                  <GitFork className="h-4 w-4" /> Fork everything
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Remix the whole platform on Replit — full source, database schema, wiki content, and
                  cooperative tooling — then make it yours.
                </p>
                <Link href="/remix-replit">
                  <Button variant="outline" size="sm" data-testid="button-remix-replit">
                    How to remix <ExternalLink className="h-3 w-3 ml-2" />
                  </Button>
                </Link>
              </div>
              <div className="p-4 rounded-lg border bg-white dark:bg-gray-950">
                <h3 className="font-semibold mb-1 flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4" /> Fork the framework
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Adopt just the Inclusive Ordering Framework — the versioned, CC BY-SA 4.0 public API for
                  the variation catalogue, fitting params, and multi-use balance schema.
                </p>
                <Link href="/fork-the-framework">
                  <Button variant="outline" size="sm" data-testid="button-fork-framework">
                    Framework docs <ExternalLink className="h-3 w-3 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
              <Scale className="h-4 w-4 shrink-0" />
              Licence for all of it: Creative Commons BY-SA 4.0 — attribute the source, share derivatives
              alike. Self-report your fork at the{" "}
              <Link href="/inclusive-ordering-registry" className="underline" data-testid="link-registry">
                adopter registry
              </Link>
              .
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
