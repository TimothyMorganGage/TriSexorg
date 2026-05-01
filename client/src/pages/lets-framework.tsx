import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Coins, Users, Scale, BookOpen, Network, Info, ExternalLink, AlertTriangle } from "lucide-react";
import { Link } from "wouter";

const lineage = [
  {
    year: "1983",
    name: "LETSystem (Comox Valley, BC)",
    by: "Michael Linton",
    note: "First formal Local Employment and Trading System. Members traded goods and services denominated in 'Green Dollars' on a mutual-credit ledger — every account starts at zero, debits and credits net to zero across the membership.",
  },
  {
    year: "1980",
    name: "Time Banks",
    by: "Edgar Cahn",
    note: "An hour of any member's labor exchanges for an hour of any other member's labor. Foundational principle: every person's time is valued equally.",
  },
  {
    year: "1991",
    name: "Ithaca HOURS",
    by: "Paul Glover (Ithaca, NY)",
    note: "Paper local currency pegged to one hour of work (~US$10 at issuance). Demonstrated that a printed local currency could circulate alongside national currency in a US town.",
  },
  {
    year: "2009",
    name: "Brixton Pound (B£)",
    by: "Transition Town Brixton",
    note: "UK community currency that introduced an electronic 'pay-by-text' tier. Showed that LETS-style local currency can run on commodity mobile infrastructure.",
  },
  {
    year: "ongoing",
    name: "Sardex",
    by: "Sardex SpA (Sardinia)",
    note: "Business-to-business mutual-credit circuit operating across thousands of Sardinian SMEs. Documents that mutual credit can scale to inter-firm trade, not just neighbour-to-neighbour exchange.",
  },
  {
    year: "ongoing",
    name: "hOurworld / TimeBanks.org",
    by: "Federated time-bank networks",
    note: "Open software stacks letting independent time-banks share members and balances across a federation, similar in spirit to ActivityPub for social networks.",
  },
];

const principles = [
  {
    title: "Mutual credit, not pre-funded balances",
    body: "Members open accounts at zero. A trade simultaneously credits the seller and debits the buyer in the local unit. The sum of all balances always equals zero. No external money is required to start trading.",
  },
  {
    title: "No interest on positive or negative balances",
    body: "Holding a positive balance does not earn interest; holding a negative balance does not accrue interest charges. This removes the incentive to hoard the unit and the pressure to extract from those temporarily in deficit.",
  },
  {
    title: "Bounded commitment, not unlimited debt",
    body: "Each member has a transparent commitment range (for example −100 to +100 units). Going beyond the range requires conversation with the membership, not a credit-score check.",
  },
  {
    title: "Public ledger, member governance",
    body: "Balances and trade volumes are visible to members so the system is auditable. Rules — commitment limits, dispute process, valuation conventions — are set by the membership, not by an outside issuer.",
  },
  {
    title: "Local first, federated second",
    body: "A LETS is rooted in a specific community of practice. Inter-LETS clearing — letting members of one circle trade with members of another — is layered on top, not assumed.",
  },
];

export default function LetsFramework() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl space-y-6">
      <div className="flex items-start gap-3">
        <Coins className="h-8 w-8 text-amber-700 mt-1" />
        <div>
          <h1 className="text-3xl font-bold" data-testid="heading-lets-framework">Local Economy Trading Systems (LETS) Framework</h1>
          <p className="text-muted-foreground">A mutual-credit framework the TriSex.org co-operative is studying as a basis for Time Banking.</p>
        </div>
      </div>

      <Card className="border-amber-500 border-dashed bg-amber-50 dark:bg-amber-950/30">
        <CardHeader className="flex-row items-center gap-3">
          <AlertTriangle className="h-6 w-6 text-amber-700" />
          <div>
            <CardTitle className="text-amber-900 dark:text-amber-200">Framework page — not a live currency</CardTitle>
            <CardDescription>
              This page describes the LETS framework and the historical systems it draws on. TriSex.org has <strong>not</strong> launched a LETS, has <strong>not</strong> issued any units of account to members, has <strong>not</strong> operated a clearing circuit, and is <strong>not</strong> claiming any volume, membership, or transaction figures. Any numbers below are sourced from the named historical projects, not from TriSex.org.
            </CardDescription>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2"><BookOpen className="h-5 w-5" /><CardTitle>Why LETS, and why here</CardTitle></div>
        </CardHeader>
        <CardContent className="space-y-3 text-sm leading-relaxed">
          <p>
            A Local Economy (or Local Employment and Trading) System is a mutual-credit currency operated by and for a defined community. It lets members trade time, goods, and services with one another using a unit of account they themselves issue, without first having to acquire national currency.
          </p>
          <p>
            For a sexual-health co-operative, the framework is interesting for three concrete reasons:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Care work is undervalued in fiat markets.</strong> Peer mentoring, partner notification, accompaniment to a clinic, herbal preparation — all of these are real labour that LETS-style ledgers can record and reciprocate.</li>
            <li><strong>Members already share a community of practice.</strong> LETS works best when there is enough trust and shared context to make balances meaningful. Sexual-health co-operators meet that condition.</li>
            <li><strong>Mutual credit avoids the extraction loop.</strong> Because there is no interest and no outside issuer, value created by members stays inside the membership.</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2"><Scale className="h-5 w-5" /><CardTitle>Five operating principles</CardTitle></div>
          <CardDescription>What it means to call something a LETS, drawn from the lineage below.</CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="space-y-4">
            {principles.map((p, i) => (
              <li key={i} className="flex items-start gap-3">
                <Badge variant="outline" className="mt-0.5">{i + 1}</Badge>
                <div>
                  <p className="font-semibold">{p.title}</p>
                  <p className="text-sm text-muted-foreground">{p.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2"><Users className="h-5 w-5" /><CardTitle>Lineage we are reading from</CardTitle></div>
          <CardDescription>Named, verifiable projects — not TriSex.org metrics.</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {lineage.map((l) => (
              <li key={l.name} className="border-l-2 border-muted pl-4">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <Badge variant="secondary">{l.year}</Badge>
                  <p className="font-semibold">{l.name}</p>
                  <span className="text-xs text-muted-foreground">— {l.by}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{l.note}</p>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2"><Network className="h-5 w-5" /><CardTitle>How this could connect to existing TriSex.org features</CardTitle></div>
          <CardDescription>Mapping, not announcement. Each item is a design hypothesis the co-operative would have to ratify.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div>
            <p className="font-semibold">Time Banking page → LETS hour ledger</p>
            <p className="text-muted-foreground">An hour logged on the Time Banking page could become one credit unit, redeemable by any member for an hour of any other member's listed offering.</p>
          </div>
          <div>
            <p className="font-semibold">Forum + dividends → governance surface</p>
            <p className="text-muted-foreground">Commitment limits, dispute rules, and any decision to mint, freeze, or retire units would be discussed in the Community Forum and ratified through the same cooperative dividend / voting flow used elsewhere on the platform.</p>
          </div>
          <div>
            <p className="font-semibold">Honesty refactors → no fabricated balances</p>
            <p className="text-muted-foreground">Consistent with the platform-wide honesty refactors, no member balance, trade volume, or membership count will be displayed unless it has actually been recorded by the membership.</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2"><Info className="h-5 w-5" /><CardTitle>Further reading</CardTitle></div>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p className="text-muted-foreground">External links open in a new tab. TriSex.org is not affiliated with any of these projects and does not endorse their internal governance — they are listed as primary sources for the framework.</p>
          <div className="flex flex-wrap gap-2 pt-2">
            <Button asChild variant="outline" size="sm">
              <a href="https://www.appropriate-economics.org/materials/lets.html" target="_blank" rel="noopener noreferrer">
                Linton on LETSystem design <ExternalLink className="h-3 w-3 ml-1" />
              </a>
            </Button>
            <Button asChild variant="outline" size="sm">
              <a href="https://timebanks.org/" target="_blank" rel="noopener noreferrer">
                TimeBanks.org <ExternalLink className="h-3 w-3 ml-1" />
              </a>
            </Button>
            <Button asChild variant="outline" size="sm">
              <a href="https://hourworld.org/" target="_blank" rel="noopener noreferrer">
                hOurworld federation <ExternalLink className="h-3 w-3 ml-1" />
              </a>
            </Button>
            <Button asChild variant="outline" size="sm">
              <a href="https://en.wikipedia.org/wiki/Local_exchange_trading_system" target="_blank" rel="noopener noreferrer">
                LETS overview (Wikipedia) <ExternalLink className="h-3 w-3 ml-1" />
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Talk it through with the co-operative</CardTitle></CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button asChild variant="outline" size="sm" data-testid="link-forum"><Link href="/forum">Open the Community Forum</Link></Button>
          <Button asChild variant="outline" size="sm" data-testid="link-time-banking"><Link href="/wise-time">Wise Time TriSex (time tracking)</Link></Button>
        </CardContent>
      </Card>
    </div>
  );
}
