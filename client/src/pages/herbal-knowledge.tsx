import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, Leaf, BookOpen, ExternalLink, ShieldAlert, Users, Sprout, Loader2, FlaskConical, Search } from "lucide-react";
import type { HerbalKnowledgeEntry } from "@shared/schema";

const CATEGORIES = [
  { value: "aftercare-salve", label: "Aftercare salve" },
  { value: "wash-rinse", label: "Wash / rinse" },
  { value: "lubricant-ingredient", label: "Lubricant ingredient" },
  { value: "ritual-ceremony", label: "Ritual / ceremony" },
  { value: "edible-tonic", label: "Edible tonic" },
  { value: "topical-poultice", label: "Topical poultice" },
];

interface HerbalEvidenceSource {
  id: string;
  name: string;
  shortName: string;
  url: string;
  role: string;
  searchTemplate: string;
}

interface HerbalPolicy {
  framework: string;
  ahgUrl: string;
  directoryUrl: string;
  credentialNote: string;
  barrierSubstituteWarning: string;
  contentLicense: string;
  lastReviewed: string;
  evidenceSources?: HerbalEvidenceSource[];
  evidencePolicy?: string;
}

function buildSourceLink(source: HerbalEvidenceSource, query: string) {
  return source.searchTemplate.replace("{query}", encodeURIComponent(query));
}

export default function HerbalKnowledge() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [showContribute, setShowContribute] = useState(false);
  const [form, setForm] = useState({
    commonName: "",
    latinName: "",
    partUsed: "",
    category: "aftercare-salve",
    traditionalUses: "",
    foragingNotes: "",
    safetyWarnings: "",
    sustainabilityNotes: "",
    ahgScopeNote: "",
    requiresRhConsult: false,
    citationUrl: "",
  });

  const { data: policy } = useQuery<HerbalPolicy>({ queryKey: ['/api/herbal-policy'] });
  const { data: entries = [], isLoading } = useQuery<HerbalKnowledgeEntry[]>({
    queryKey: activeCategory ? ['/api/herbal-entries', { category: activeCategory }] : ['/api/herbal-entries'],
  });

  const createEntry = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/herbal-entries", form);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/herbal-entries'] });
      toast({ title: "Entry contributed", description: "Thank you. Your entry is shared under CC BY-SA 4.0." });
      setShowContribute(false);
      setForm({ ...form, commonName: "", latinName: "", partUsed: "", traditionalUses: "", foragingNotes: "", safetyWarnings: "", sustainabilityNotes: "", ahgScopeNote: "", citationUrl: "" });
    },
    onError: (e: any) => toast({ title: "Could not contribute", description: e.message, variant: "destructive" }),
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl space-y-6">
      <div className="flex items-center gap-3">
        <Leaf className="h-8 w-8 text-green-700" />
        <div>
          <h1 className="text-3xl font-bold" data-testid="heading-herbal">Herbal Knowledge for Co-Crafting Protection</h1>
          <p className="text-muted-foreground">A peer-contributed reference grounded in the American Herbalists Guild framework, drawing on the NIH National Library of Medicine (PubMed, MedlinePlus, LactMed) and the NIH National Center for Complementary and Integrative Health.</p>
        </div>
      </div>

      <Card className="border-amber-500 bg-amber-50 dark:bg-amber-950/30">
        <CardHeader className="flex-row items-start gap-3 pb-2">
          <AlertTriangle className="h-6 w-6 text-amber-700 mt-1 flex-shrink-0" />
          <div>
            <CardTitle className="text-amber-900 dark:text-amber-200">Foraged plants are not a substitute for medical-grade barriers</CardTitle>
            <CardDescription className="text-amber-800 dark:text-amber-300">
              {policy?.barrierSubstituteWarning ?? "No foraged material reliably prevents STI transmission or pregnancy. Use this knowledge for aftercare, washes, lubricant ingredients (with caveats), and ritual — never as your primary barrier."}
            </CardDescription>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            <CardTitle>About this knowledge base</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p><strong>Framework:</strong> {policy?.framework ?? "American Herbalists Guild (AHG)"}. The AHG is a U.S. professional association that maintains a peer-reviewed <strong>Registered Herbalist</strong> credential (RH(AHG)) and a published code of ethics and scope of practice.</p>
          <p><strong>Honesty disclosure:</strong> {policy?.credentialNote}</p>
          <p><strong>Content license:</strong> {policy?.contentLicense} We do <em>not</em> reproduce AHG's copyrighted publications.</p>
          <div className="flex flex-wrap gap-2 pt-2">
            <Button asChild variant="outline" size="sm" data-testid="link-ahg-home">
              <a href={policy?.ahgUrl} target="_blank" rel="noopener noreferrer">
                Visit American Herbalists Guild <ExternalLink className="h-3 w-3 ml-1" />
              </a>
            </Button>
            <Button asChild variant="outline" size="sm" data-testid="link-ahg-directory">
              <a href={policy?.directoryUrl} target="_blank" rel="noopener noreferrer">
                <Users className="h-3 w-3 mr-1" /> Find a Registered Herbalist
              </a>
            </Button>
          </div>
          <p className="text-xs text-muted-foreground pt-2">Policy last reviewed: {policy?.lastReviewed}</p>
        </CardContent>
      </Card>

      <Card className="border-blue-500/40 bg-blue-50/40 dark:bg-blue-950/20">
        <CardHeader>
          <div className="flex items-center gap-2">
            <FlaskConical className="h-5 w-5 text-blue-700 dark:text-blue-300" />
            <CardTitle>Evidence base: NIH NLM &amp; NCCIH</CardTitle>
          </div>
          <CardDescription>
            {policy?.evidencePolicy ?? "Co-operator-contributed entries draw upon the NIH National Library of Medicine (NLM) databases and the NIH National Center for Complementary and Integrative Health (NCCIH)."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <ul className="space-y-3">
            {(policy?.evidenceSources ?? []).map(src => (
              <li key={src.id} className="border-l-2 border-blue-400 pl-3" data-testid={`source-${src.id}`}>
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <strong>{src.name}</strong>
                  <Button asChild variant="ghost" size="sm" data-testid={`link-source-${src.id}`}>
                    <a href={src.url} target="_blank" rel="noopener noreferrer">
                      Open {src.shortName} <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </Button>
                </div>
                <p className="text-muted-foreground text-xs mt-1">{src.role}</p>
              </li>
            ))}
          </ul>
          <p className="text-xs text-muted-foreground pt-1">
            TriSex.org is not affiliated with NIH, NLM, or NCCIH. We link to their public databases and do not reproduce their copyrighted content.
          </p>
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center gap-3 justify-between">
        <div className="flex items-center gap-2">
          <Label htmlFor="cat-filter" className="text-sm">Filter by use:</Label>
          <Select value={activeCategory || "all"} onValueChange={v => setActiveCategory(v === "all" ? "" : v)}>
            <SelectTrigger id="cat-filter" className="w-[220px]" data-testid="select-category-filter">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {CATEGORIES.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        {user && (
          <Button onClick={() => setShowContribute(s => !s)} variant={showContribute ? "outline" : "default"} data-testid="button-toggle-contribute">
            <Sprout className="h-4 w-4 mr-1" /> {showContribute ? "Cancel" : "Contribute an entry"}
          </Button>
        )}
      </div>

      {showContribute && user && (
        <Card>
          <CardHeader>
            <CardTitle>Contribute a foraging + co-crafting entry</CardTitle>
            <CardDescription>Share what you know. Be honest about safety. Cite sources where possible. Do not reproduce copyrighted AHG material.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div><Label>Common name</Label><Input value={form.commonName} onChange={e => setForm({ ...form, commonName: e.target.value })} placeholder="e.g., Calendula" data-testid="input-common-name" /></div>
              <div><Label>Latin name</Label><Input value={form.latinName} onChange={e => setForm({ ...form, latinName: e.target.value })} placeholder="e.g., Calendula officinalis" data-testid="input-latin-name" /></div>
              <div><Label>Part used</Label><Input value={form.partUsed} onChange={e => setForm({ ...form, partUsed: e.target.value })} placeholder="e.g., Flower heads" data-testid="input-part-used" /></div>
              <div>
                <Label>Category</Label>
                <Select value={form.category} onValueChange={v => setForm({ ...form, category: v })}>
                  <SelectTrigger data-testid="select-form-category"><SelectValue /></SelectTrigger>
                  <SelectContent>{CATEGORIES.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div><Label>Traditional uses</Label><Textarea rows={2} value={form.traditionalUses} onChange={e => setForm({ ...form, traditionalUses: e.target.value })} data-testid="textarea-traditional" /></div>
            <div><Label>Foraging notes (habitat, season, identification, look-alikes)</Label><Textarea rows={2} value={form.foragingNotes} onChange={e => setForm({ ...form, foragingNotes: e.target.value })} data-testid="textarea-foraging" /></div>
            <div><Label>Safety warnings (allergies, contraindications, drug interactions, mucosal cautions)</Label><Textarea rows={2} value={form.safetyWarnings} onChange={e => setForm({ ...form, safetyWarnings: e.target.value })} data-testid="textarea-safety" /></div>
            <div><Label>Sustainability notes (United Plant Savers status, ethical harvest)</Label><Textarea rows={2} value={form.sustainabilityNotes} onChange={e => setForm({ ...form, sustainabilityNotes: e.target.value })} data-testid="textarea-sustainability" /></div>
            <div><Label>AHG scope note (where this falls within / outside RH(AHG) scope of practice)</Label><Textarea rows={2} value={form.ahgScopeNote} onChange={e => setForm({ ...form, ahgScopeNote: e.target.value })} data-testid="textarea-scope" /></div>
            <div className="flex items-center justify-between">
              <Label htmlFor="rh-consult">Use of this plant warrants consulting a Registered Herbalist (RH(AHG))</Label>
              <Switch id="rh-consult" checked={form.requiresRhConsult} onCheckedChange={v => setForm({ ...form, requiresRhConsult: v })} data-testid="switch-rh-consult" />
            </div>
            <div>
              <Label>Citation URL (strongly preferred: PubMed, NCCIH, MedlinePlus, or AHG)</Label>
              <Input value={form.citationUrl} onChange={e => setForm({ ...form, citationUrl: e.target.value })} placeholder="e.g., https://pubmed.ncbi.nlm.nih.gov/12345678/ or https://www.nccih.nih.gov/health/calendula" data-testid="input-citation" />
              {form.latinName && (policy?.evidenceSources ?? []).length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2 text-xs">
                  <span className="text-muted-foreground self-center">Search for evidence on <em>{form.latinName}</em>:</span>
                  {(policy?.evidenceSources ?? []).map(src => (
                    <a
                      key={src.id}
                      href={buildSourceLink(src, form.latinName)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-blue-600 dark:text-blue-400 underline"
                      data-testid={`form-search-${src.id}`}
                    >
                      <Search className="h-3 w-3 mr-0.5" /> {src.shortName}
                    </a>
                  ))}
                </div>
              )}
            </div>
            <Button onClick={() => createEntry.mutate()} disabled={!form.commonName || !form.latinName || createEntry.isPending} data-testid="button-submit-entry">
              {createEntry.isPending ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : null} Submit entry (CC BY-SA 4.0)
            </Button>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Loading entries…</div>
      ) : entries.length === 0 ? (
        <Card><CardContent className="py-8 text-center text-muted-foreground">
          No entries yet{activeCategory ? " in this category" : ""}. Be the first co-operator to contribute.
        </CardContent></Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {entries.map(e => (
            <Card key={e.id} data-testid={`card-herb-${e.id}`}>
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <CardTitle className="text-lg">{e.commonName}</CardTitle>
                    <CardDescription className="italic">{e.latinName} · {e.partUsed}</CardDescription>
                  </div>
                  <Badge variant="outline">{CATEGORIES.find(c => c.value === e.category)?.label ?? e.category}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div><strong>Traditional uses:</strong> {e.traditionalUses}</div>
                <div><strong>Foraging:</strong> {e.foragingNotes}</div>
                <div className="text-amber-800 dark:text-amber-300"><ShieldAlert className="inline h-3 w-3 mr-1" /><strong>Safety:</strong> {e.safetyWarnings}</div>
                <div><strong>Sustainability:</strong> {e.sustainabilityNotes}</div>
                <div className="text-xs text-muted-foreground"><strong>AHG scope:</strong> {e.ahgScopeNote}</div>
                {e.requiresRhConsult && (
                  <Badge variant="destructive" className="mt-1">Consult an RH(AHG) before use</Badge>
                )}
                {e.citationUrl && (
                  <a href={e.citationUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 dark:text-blue-400 underline inline-flex items-center" data-testid={`link-citation-${e.id}`}>
                    Citation <ExternalLink className="h-3 w-3 ml-0.5" />
                  </a>
                )}
                {(policy?.evidenceSources ?? []).length > 0 && (
                  <div className="pt-2 border-t mt-2">
                    <div className="text-xs text-muted-foreground mb-1 flex items-center">
                      <FlaskConical className="h-3 w-3 mr-1" /> Cross-reference NLM / NCCIH for <em className="ml-1">{e.latinName}</em>:
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs">
                      {(policy?.evidenceSources ?? []).map(src => (
                        <a
                          key={src.id}
                          href={buildSourceLink(src, e.latinName)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-blue-600 dark:text-blue-400 underline"
                          data-testid={`entry-search-${e.id}-${src.id}`}
                        >
                          <Search className="h-3 w-3 mr-0.5" /> {src.shortName}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
