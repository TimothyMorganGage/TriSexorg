import { useState } from "react";
import { Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Users,
  GitFork,
  ExternalLink,
  ShieldCheck,
  Loader2,
  AlertTriangle,
  PlusCircle,
  Building2,
} from "lucide-react";
import { ADOPTED_SURFACES, type AdoptedSurface } from "@shared/inclusive-ordering";
import { insertInclusiveOrderingAdopterSchema, type InclusiveOrderingAdopter } from "@shared/schema";

const COOPERATIVE_STATUS_OPTIONS = [
  { value: "cooperative", label: "Cooperative (member-owned)" },
  { value: "nonprofit", label: "Non-profit / NGO" },
  { value: "for-profit", label: "For-profit" },
  { value: "informal", label: "Informal collective / unincorporated" },
  { value: "individual", label: "Individual / solo project" },
];

type FormValues = {
  appName: string;
  appUrl: string;
  appDescription: string;
  adoptedSurfaces: AdoptedSurface[];
  contactEmail: string;
  cooperativeStatus: string;
  honestyAttestation: boolean;
  ccBySaCompliance: boolean;
  submittedBy: string;
  notes: string;
};

export default function InclusiveOrderingRegistry() {
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);

  const { data: adopters = [], isLoading } = useQuery<InclusiveOrderingAdopter[]>({
    queryKey: ["/api/inclusive-ordering-adopters"],
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(
      insertInclusiveOrderingAdopterSchema.extend({}),
    ) as never,
    defaultValues: {
      appName: "",
      appUrl: "",
      appDescription: "",
      adoptedSurfaces: [],
      contactEmail: "",
      cooperativeStatus: "",
      honestyAttestation: false,
      ccBySaCompliance: false,
      submittedBy: "",
      notes: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const payload = {
        ...values,
        contactEmail: values.contactEmail.trim() || null,
        cooperativeStatus: values.cooperativeStatus || null,
        submittedBy: values.submittedBy.trim() || null,
        notes: values.notes.trim() || null,
      };
      return await apiRequest("POST", "/api/inclusive-ordering-adopters", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/inclusive-ordering-adopters"] });
      toast({
        title: "Submission recorded",
        description: "Thanks. Your adoption will appear with status 'pending' until verified by stewards.",
      });
      form.reset();
      setShowForm(false);
    },
    onError: (err: Error) => {
      toast({
        title: "Submission failed",
        description: err.message || "Please check the required fields and try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: FormValues) => {
    if (values.adoptedSurfaces.length === 0) {
      form.setError("adoptedSurfaces", { message: "Pick at least one adopted surface." });
      return;
    }
    createMutation.mutate(values);
  };

  const verified = adopters.filter((a) => a.status === "verified");
  const pending = adopters.filter((a) => a.status === "pending");

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/5 text-xs uppercase tracking-wide">
            <Users className="h-3.5 w-3.5" /> Adopter registry
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold">Inclusive Ordering Registry</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            A self-reported map of apps, cooperatives, and projects that have adopted the
            Inclusive Ordering Framework. Submissions are honest by default — pending until
            stewards verify, withdrawable at any time, and carry no implied endorsement.
          </p>
        </div>

        {/* Honesty alert */}
        <Alert className="border-amber-500/40 bg-amber-50 dark:bg-amber-950/20 text-amber-900 dark:text-amber-100">
          <AlertTriangle className="h-4 w-4 !text-amber-600 dark:!text-amber-400" />
          <AlertTitle className="text-amber-900 dark:text-amber-100">This registry starts empty — and stays honest</AlertTitle>
          <AlertDescription className="text-sm space-y-1 mt-2 text-amber-900/90 dark:text-amber-100/90">
            <p>
              We do not seed this list with placeholder names, fictional cooperatives, or speculative
              partners. Entries appear only when a real adopter submits the form below and confirms
              both the honesty attestation and the CC BY-SA 4.0 compliance checkbox.
            </p>
            <p>
              Verification is a manual stewardship step — not an endorsement. A "verified" badge
              means a steward has confirmed the URL resolves and the framework is in fact in use,
              nothing more.
            </p>
          </AlertDescription>
        </Alert>

        {/* CTA */}
        <div className="flex flex-wrap gap-3 justify-center">
          <Button onClick={() => setShowForm((v) => !v)} data-testid="toggle-submission-form">
            <PlusCircle className="h-4 w-4 mr-1.5" />
            {showForm ? "Cancel submission" : "Self-report your adoption"}
          </Button>
          <Link href="/fork-the-framework">
            <Button variant="outline" data-testid="link-fork-page">
              <GitFork className="h-4 w-4 mr-1.5" /> Read the framework spec
            </Button>
          </Link>
        </div>

        {/* Submission form */}
        {showForm && (
          <Card className="border-primary/40">
            <CardHeader>
              <CardTitle>Submit your adoption</CardTitle>
              <CardDescription>
                All required fields must be honest. Stewards may contact you at the optional contact
                email to verify or request more detail.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="appName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>App / project name *</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. CoopCare Protection" {...field} data-testid="input-app-name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="appUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Public URL *</FormLabel>
                          <FormControl>
                            <Input placeholder="https://…" {...field} data-testid="input-app-url" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="appDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>What does your app do? *</FormLabel>
                        <FormControl>
                          <Textarea
                            rows={3}
                            placeholder="One short paragraph. Be honest about scope — pre-launch is fine, mockups are fine, just say so."
                            {...field}
                            data-testid="input-app-description"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="adoptedSurfaces"
                    render={() => (
                      <FormItem>
                        <FormLabel>Adopted surfaces *</FormLabel>
                        <FormDescription>
                          Pick every part of the framework your app uses. Be conservative — only check
                          surfaces you've actually wired up.
                        </FormDescription>
                        <div className="grid md:grid-cols-2 gap-2 mt-2">
                          {ADOPTED_SURFACES.map((s) => (
                            <FormField
                              key={s.id}
                              control={form.control}
                              name="adoptedSurfaces"
                              render={({ field }) => {
                                const checked = field.value?.includes(s.id) ?? false;
                                return (
                                  <label
                                    className="flex items-start gap-2 p-2 border rounded text-xs cursor-pointer hover:border-primary/50"
                                    data-testid={`surface-checkbox-${s.id}`}
                                  >
                                    <Checkbox
                                      checked={checked}
                                      onCheckedChange={(v) => {
                                        const set = new Set(field.value ?? []);
                                        if (v) set.add(s.id);
                                        else set.delete(s.id);
                                        field.onChange(Array.from(set));
                                      }}
                                    />
                                    <div className="space-y-0.5">
                                      <div className="font-semibold">{s.label}</div>
                                      <div className="text-muted-foreground">{s.description}</div>
                                    </div>
                                  </label>
                                );
                              }}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="cooperativeStatus"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Organisation type</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-cooperative-status">
                                <SelectValue placeholder="Select organisation type…" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {COOPERATIVE_STATUS_OPTIONS.map((o) => (
                                <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="contactEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="optional — for verification only" {...field} data-testid="input-contact-email" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="submittedBy"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your name or handle</FormLabel>
                        <FormControl>
                          <Input placeholder="optional — credited as the submitter" {...field} data-testid="input-submitted-by" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes for the stewards</FormLabel>
                        <FormControl>
                          <Textarea
                            rows={2}
                            placeholder="Anything else stewards should know — fork URL, deviations from the canonical catalogue, jurisdiction notes, etc."
                            {...field}
                            data-testid="input-notes"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-3 border rounded p-3 bg-muted/30">
                    <FormField
                      control={form.control}
                      name="honestyAttestation"
                      render={({ field }) => (
                        <FormItem>
                          <label className="flex items-start gap-2 text-sm cursor-pointer">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                data-testid="checkbox-honesty"
                              />
                            </FormControl>
                            <span>
                              I attest that this submission is honest. The app exists at the URL above,
                              the surfaces I checked are actually wired up (or in active development with a
                              public branch), and I will not use this listing to imply efficacy claims,
                              clinical endorsement, or partnership with TriSex.org. *
                            </span>
                          </label>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="ccBySaCompliance"
                      render={({ field }) => (
                        <FormItem>
                          <label className="flex items-start gap-2 text-sm cursor-pointer">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                data-testid="checkbox-cc-by-sa"
                              />
                            </FormControl>
                            <span>
                              I confirm that my app attributes "TriSex.org Inclusive Ordering Framework"
                              and that any derivative of the framework data is licensed under
                              CC BY-SA 4.0. *
                            </span>
                          </label>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={createMutation.isPending}
                    data-testid="submit-adopter-form"
                  >
                    {createMutation.isPending && <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />}
                    Submit adoption
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}

        {/* Verified adopters */}
        <section data-testid="verified-section">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-2xl font-serif font-semibold flex items-center gap-2">
              <ShieldCheck className="h-5 w-5" /> Verified adopters
            </h2>
            <Badge variant="outline">{verified.length}</Badge>
          </div>
          {isLoading ? (
            <div className="flex items-center justify-center p-8 text-muted-foreground text-sm">
              <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Loading adopters…
            </div>
          ) : verified.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="p-6 text-center text-sm text-muted-foreground space-y-2">
                <Building2 className="h-8 w-8 mx-auto opacity-50" />
                <p>
                  No verified adopters yet. This is the honest starting state — the framework was
                  extracted as a public surface for the first time alongside this page, so there
                  are no prior adopters to import.
                </p>
                <p>If your app uses the framework, you'll be the first verified entry.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 gap-3">
              {verified.map((a) => (
                <AdopterCard key={a.id} adopter={a} />
              ))}
            </div>
          )}
        </section>

        {/* Pending adopters */}
        <section data-testid="pending-section">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-2xl font-serif font-semibold">Pending submissions</h2>
            <Badge variant="outline">{pending.length}</Badge>
          </div>
          {pending.length === 0 ? (
            <p className="text-sm text-muted-foreground italic">
              No pending submissions awaiting review.
            </p>
          ) : (
            <div className="grid md:grid-cols-2 gap-3">
              {pending.map((a) => (
                <AdopterCard key={a.id} adopter={a} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function AdopterCard({ adopter }: { adopter: InclusiveOrderingAdopter }) {
  const surfaceLabels = ADOPTED_SURFACES.reduce<Record<string, string>>((acc, s) => {
    acc[s.id] = s.label;
    return acc;
  }, {});

  return (
    <Card data-testid={`adopter-${adopter.id}`}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base">{adopter.appName}</CardTitle>
          <Badge variant={adopter.status === "verified" ? "default" : "secondary"} className="text-[10px]">
            {adopter.status}
          </Badge>
        </div>
        <a
          href={adopter.appUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-primary inline-flex items-center gap-1 hover:underline"
        >
          {adopter.appUrl}
          <ExternalLink className="h-3 w-3" />
        </a>
      </CardHeader>
      <CardContent className="space-y-2 text-xs">
        <p>{adopter.appDescription}</p>
        <div className="flex flex-wrap gap-1 pt-1">
          {adopter.adoptedSurfaces.map((s) => (
            <Badge key={s} variant="outline" className="text-[10px]">
              {surfaceLabels[s] ?? s}
            </Badge>
          ))}
        </div>
        {adopter.cooperativeStatus && (
          <p className="text-muted-foreground">
            <span className="font-semibold">Org:</span> {adopter.cooperativeStatus}
          </p>
        )}
        {adopter.submittedBy && (
          <p className="text-muted-foreground">
            <span className="font-semibold">Submitted by:</span> {adopter.submittedBy}
          </p>
        )}
        {adopter.notes && (
          <p className="text-muted-foreground italic border-t pt-2 mt-2">{adopter.notes}</p>
        )}
      </CardContent>
    </Card>
  );
}
