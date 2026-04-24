import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShieldAlert, Lock, CheckCircle, ExternalLink, Users, FileText } from "lucide-react";
import { Link } from "wouter";

interface SniffiesPolicy {
  platformName: string;
  proprietorEntity: string;
  compensationActive: boolean;
  compensationProgramUrl: string | null;
  gateStatement: string;
  harmContext: string;
  honestyDisclosures: string[];
  affectedPersonProcess: string;
  lastReviewed: string;
  verifiedBy: string | null;
  evidenceNotes: string | null;
}

export default function SniffiesPolicy() {
  const { data: policy } = useQuery<SniffiesPolicy>({ queryKey: ['/api/sniffies/policy'] });

  if (!policy) return <div className="container mx-auto p-8">Loading…</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl space-y-6">
      <div className="flex items-start gap-3">
        <ShieldAlert className="h-8 w-8 text-amber-700 mt-1" />
        <div>
          <h1 className="text-3xl font-bold" data-testid="heading-sniffies-policy">Sniffies Platform-Access Policy</h1>
          <p className="text-muted-foreground">A unilaterally published ethics gate governing whether {policy.proprietorEntity} may use TriSex.org.</p>
        </div>
      </div>

      <Card className={policy.compensationActive ? "border-green-500 bg-green-50 dark:bg-green-950/30" : "border-amber-500 bg-amber-50 dark:bg-amber-950/30"}>
        <CardHeader className="flex-row items-center gap-3">
          {policy.compensationActive ? <CheckCircle className="h-6 w-6 text-green-700" /> : <Lock className="h-6 w-6 text-amber-700" />}
          <div>
            <CardTitle className={policy.compensationActive ? "text-green-900 dark:text-green-200" : "text-amber-900 dark:text-amber-200"}>
              Status: {policy.compensationActive ? "Compensation program verified — Sniffies access GRANTED" : "Compensation program NOT verified — Sniffies access DENIED"}
            </CardTitle>
            <CardDescription>Last reviewed {policy.lastReviewed}{policy.verifiedBy ? ` by ${policy.verifiedBy}` : ""}.</CardDescription>
          </div>
        </CardHeader>
        {policy.compensationActive && policy.compensationProgramUrl && (
          <CardContent>
            <Button asChild variant="outline" size="sm" data-testid="link-comp-program">
              <a href={policy.compensationProgramUrl} target="_blank" rel="noopener noreferrer">
                Verified compensation program <ExternalLink className="h-3 w-3 ml-1" />
              </a>
            </Button>
            {policy.evidenceNotes && <p className="text-sm mt-2 text-muted-foreground">{policy.evidenceNotes}</p>}
          </CardContent>
        )}
      </Card>

      <Card>
        <CardHeader><CardTitle>The Gate</CardTitle></CardHeader>
        <CardContent>
          <p className="text-base">{policy.gateStatement}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2"><Users className="h-5 w-5" /><CardTitle>Why this gate exists — fluid-bonded harm context</CardTitle></div>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed">{policy.harmContext}</p>
        </CardContent>
      </Card>

      <Card className="border-blue-300 bg-blue-50 dark:bg-blue-950/30">
        <CardHeader>
          <div className="flex items-center gap-2"><FileText className="h-5 w-5 text-blue-700" /><CardTitle>Honesty disclosures</CardTitle></div>
          <CardDescription>What this policy is — and isn't.</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            {policy.honestyDisclosures.map((d, i) => (
              <li key={i} className="flex items-start gap-2"><Badge variant="outline" className="mt-0.5">{i + 1}</Badge><span>{d}</span></li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>For affected persons</CardTitle></CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p>{policy.affectedPersonProcess}</p>
          <Button asChild variant="outline" size="sm" data-testid="link-contact"><Link href="/contact">Contact TriSex.org</Link></Button>
        </CardContent>
      </Card>
    </div>
  );
}
