import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Users, 
  Shield, 
  Heart,
  AlertTriangle,
  CheckCircle,
  Scale,
  Gavel,
  Ban
} from "lucide-react";
import { Link } from "wouter";

export default function TermsOfService() {
  const lastUpdated = "November 22, 2025";

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <FileText className="h-12 w-12 text-primary mr-4" />
            <div>
              <h1 className="text-4xl font-bold text-foreground">
                Terms of Service
              </h1>
              <p className="text-xl text-muted-foreground mt-2">
                Clear, fair rules for a safe sexual health community
              </p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <Badge variant="outline">Last Updated: {lastUpdated}</Badge>
            <Badge variant="outline">Cooperative Governance</Badge>
            <Badge variant="outline">Member-Approved</Badge>
          </div>
        </div>

        {/* Quick Summary */}
        <Alert className="mb-8 bg-blue-50 dark:bg-blue-900/20 border-blue-200">
          <CheckCircle className="h-5 w-5 text-blue-600" />
          <AlertDescription className="ml-2">
            <strong>Quick Summary:</strong> Be respectful, be honest about your health status, don't share other people's private data, and we'll provide you with the best custom sexual health products and community. As a cooperative, these terms protect ALL members equally.
          </AlertDescription>
        </Alert>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="community">Community Rules</TabsTrigger>
            <TabsTrigger value="services">Services & Products</TabsTrigger>
            <TabsTrigger value="legal">Legal & Disputes</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-3 h-6 w-6 text-purple-600" />
                  Cooperative Membership Agreement
                </CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <p className="text-muted-foreground">
                  TriSex.org is a <strong>member-owned cooperative</strong>, not a traditional company. When you join, you become a member with rights AND responsibilities to the community.
                </p>

                <Alert className="my-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200">
                  <Heart className="h-5 w-5 text-purple-600" />
                  <AlertDescription className="ml-2">
                    <strong>Intersex Healthcare IS Everyone's Affirmation:</strong> Our terms contain no "opt-out of transgender healthcare" provisions—trans, non-binary, genderqueer, and quare embodiment are all respected within this participatory budgeting framework. All members receive healthcare designed for the full spectrum of human anatomy by design.
                  </AlertDescription>
                </Alert>

                <h3 className="text-lg font-bold mt-6 mb-3">What You Agree To</h3>
                <div className="space-y-3">
                  <div className="flex items-start p-3 bg-muted/30 rounded">
                    <CheckCircle className="mr-3 h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <strong className="block mb-1">Honest Health Disclosure</strong>
                      <span className="text-sm text-muted-foreground">
                        You agree to truthfully disclose your STI status to partners and update your testing results in a timely manner. Lying about your health status violates our community trust and is grounds for immediate account termination.
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start p-3 bg-muted/30 rounded">
                    <CheckCircle className="mr-3 h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <strong className="block mb-1">Monogamy-Only Platform</strong>
                      <span className="text-sm text-muted-foreground">
                        Good People Cooperative Matchmaking is exclusively for users seeking monogamous relationships with 2-year maximum age differences. Non-monogamous relationship structures are not supported on this platform.
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start p-3 bg-muted/30 rounded">
                    <CheckCircle className="mr-3 h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <strong className="block mb-1">Age Verification Required</strong>
                      <span className="text-sm text-muted-foreground">
                        All users must verify their age through our open-source system. Minors (under 18) require comprehensive parental consent. Falsifying age verification will result in permanent ban and potential legal action.
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start p-3 bg-muted/30 rounded">
                    <CheckCircle className="mr-3 h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <strong className="block mb-1">Respect Privacy of Others</strong>
                      <span className="text-sm text-muted-foreground">
                        Never share another person's STI status, sexual health data, or relationship information without explicit consent. Outing someone's private health information is a severe violation.
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start p-3 bg-muted/30 rounded">
                    <CheckCircle className="mr-3 h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <strong className="block mb-1">Non-Pornographic Content Only</strong>
                      <span className="text-sm text-muted-foreground">
                        Profile images must show clear face photos, fully clothed, appropriate for public/workplace viewing. No nudity, partial nudity, or sexually explicit content permitted.
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cooperative Ownership Model</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  As a cooperative member, you have democratic say in how TriSex operates:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-bold mb-2 flex items-center">
                      <Heart className="mr-2 h-5 w-5 text-red-500" />
                      Your Rights
                    </h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Vote on platform policies</li>
                      <li>• Receive dividend distributions</li>
                      <li>• Access cooperative financial records</li>
                      <li>• Propose new features</li>
                      <li>• Run for board positions</li>
                    </ul>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-bold mb-2 flex items-center">
                      <Shield className="mr-2 h-5 w-5 text-blue-600" />
                      Your Responsibilities
                    </h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Follow community guidelines</li>
                      <li>• Pay for products/services used</li>
                      <li>• Respect other members</li>
                      <li>• Report policy violations</li>
                      <li>• Contribute to cooperative culture</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="community" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="mr-3 h-6 w-6 text-red-500" />
                  Community Guidelines
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="p-4 border-2 border-green-200 dark:border-green-800 rounded-lg bg-green-50/50 dark:bg-green-900/10">
                    <h4 className="font-bold mb-3 text-green-700 dark:text-green-400">✅ Encouraged Behaviors</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>✅ Honest, timely STI status updates</li>
                      <li>✅ Respectful communication with matches</li>
                      <li>✅ Sharing custom product configurations to help others</li>
                      <li>✅ Participating in cooperative governance votes</li>
                      <li>✅ Supporting other members' sexual health journeys</li>
                      <li>✅ Reporting bugs and suggesting improvements</li>
                      <li>✅ Educational content contributions to wiki</li>
                    </ul>
                  </div>

                  <div className="p-4 border-2 border-red-200 dark:border-red-800 rounded-lg bg-red-50/50 dark:bg-red-900/10">
                    <h4 className="font-bold mb-3 text-red-700 dark:text-red-400">❌ Prohibited Behaviors</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>❌ Lying about STI status or test results</li>
                      <li>❌ Sharing others' private health information</li>
                      <li>❌ Uploading pornographic or sexually explicit images</li>
                      <li>❌ Seeking non-monogamous relationships</li>
                      <li>❌ Harassment, discrimination, or hate speech</li>
                      <li>❌ Creating fake accounts or catfishing</li>
                      <li>❌ Bypassing age verification systems</li>
                      <li>❌ Soliciting or engaging in sex work</li>
                      <li>❌ Spamming or commercial advertising</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Ban className="mr-3 h-6 w-6 text-red-600" />
                  Enforcement & Consequences
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-bold mb-2 text-yellow-700 dark:text-yellow-400">⚠️ Warning (First Offense)</h4>
                    <p className="text-sm text-muted-foreground mb-2">For minor violations like late STI status updates or borderline profile images:</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Email notification of violation</li>
                      <li>• 7-day grace period to correct</li>
                      <li>• Educational resources provided</li>
                    </ul>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-bold mb-2 text-orange-700 dark:text-orange-400">🚫 Temporary Suspension (Repeat Offenses)</h4>
                    <p className="text-sm text-muted-foreground mb-2">For repeated violations or moderate offenses:</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• 30-day account suspension</li>
                      <li>• Matchmaking privileges revoked</li>
                      <li>• Required education course completion</li>
                      <li>• Community service contribution</li>
                    </ul>
                  </div>

                  <div className="p-4 border rounded-lg bg-red-50 dark:bg-red-900/20">
                    <h4 className="font-bold mb-2 text-red-700 dark:text-red-400">❌ Permanent Ban (Severe Violations)</h4>
                    <p className="text-sm text-muted-foreground mb-2">Immediate permanent ban for:</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Knowingly transmitting STIs</li>
                      <li>• Sharing others' private health data</li>
                      <li>• Falsifying age verification</li>
                      <li>• Harassment or threats</li>
                      <li>• Child exploitation or abuse</li>
                      <li>• Fraud or financial scams</li>
                    </ul>
                    <Alert className="mt-3 border-red-300">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <AlertDescription className="text-xs">
                        Severe violations may be reported to law enforcement and public health authorities as required by law.
                      </AlertDescription>
                    </Alert>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="services" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Products & Services</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-bold mb-3">Custom-Fit Protection Products</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      We guarantee custom-fit, intersex-centered products manufactured to your exact specifications:
                    </p>
                    <ul className="text-sm text-muted-foreground space-y-2">
                      <li>• <strong>Quality guarantee:</strong> 97.8% STI prevention efficacy rate</li>
                      <li>• <strong>Custom sizing:</strong> Based on your anatomical measurements</li>
                      <li>• <strong>Material choice:</strong> Vegan or Traditional Ecoculture sourcing</li>
                      <li>• <strong>Return policy:</strong> 30-day satisfaction guarantee</li>
                      <li>• <strong>Cooperative pricing:</strong> $0.99/unit for bulk orders (500+ units, 83% savings)</li>
                    </ul>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-bold mb-3">Good People Cooperative Matchmaking</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Our matchmaking service connects you with compatible monogamous partners:
                    </p>
                    <ul className="text-sm text-muted-foreground space-y-2">
                      <li>• <strong>2-year age range limit:</strong> Matches within 2 years of your age</li>
                      <li>• <strong>STI verification:</strong> Both partners tested before matching</li>
                      <li>• <strong>Genealogical screening:</strong> Prevents incest (up to 8th cousins)</li>
                      <li>• <strong>Values alignment:</strong> Cooperative principles and relationship goals</li>
                      <li>• <strong>No guarantees:</strong> We facilitate connections but cannot guarantee relationship success</li>
                    </ul>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-bold mb-3">NanoHeal ⚧️ Naturopathic STI Treatment</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Advanced biomaterial lubricant with preventive and treatment properties:
                    </p>
                    <ul className="text-sm text-muted-foreground space-y-2">
                      <li>• <strong>Not medical advice:</strong> Supplement to, not replacement for, clinical treatment</li>
                      <li>• <strong>Research-backed:</strong> Formulation based on peer-reviewed studies</li>
                      <li>• <strong>Open formula:</strong> Full ingredient disclosure</li>
                      <li>• <strong>No false claims:</strong> We make realistic efficacy statements only</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pricing & Payment Terms</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-bold mb-2">Pricing Tiers</h4>
                      <ul className="text-sm space-y-2 text-muted-foreground">
                        <li>• <strong>Individual:</strong> $5.99/unit</li>
                        <li>• <strong>3-pack:</strong> $4.49/unit (25% savings)</li>
                        <li>• <strong>Monogamous couple:</strong> $2.99/unit (50% savings)</li>
                        <li>• <strong>Co-op community:</strong> $1.49/unit (75% savings)</li>
                        <li>• <strong>Bulk order (500+):</strong> $0.99/unit (83% savings)</li>
                      </ul>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <h4 className="font-bold mb-2">Payment Methods</h4>
                      <ul className="text-sm space-y-2 text-muted-foreground">
                        <li>• Credit/debit cards</li>
                        <li>• Stablecoin dividends (USDC, DAI)</li>
                        <li>• Health savings accounts (HSA/FSA)</li>
                        <li>• Insurance billing (where applicable)</li>
                        <li>• Sliding scale for financial hardship</li>
                      </ul>
                    </div>
                  </div>

                  <Alert className="bg-green-50 dark:bg-green-900/20 border-green-200">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <AlertDescription>
                      <strong>Financial Hardship:</strong> No one should go without protection due to cost. Contact us at +1 503 610 6762 for sliding scale pricing or free product access.
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="legal" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Scale className="mr-3 h-6 w-6 text-blue-600" />
                  Legal Framework
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-bold mb-3">Governing Law</h4>
                    <p className="text-sm text-muted-foreground">
                      These Terms are governed by the laws of Oregon, United States. TriSex.org is headquartered in Portland, Oregon.
                    </p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-bold mb-3">Dispute Resolution</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      In the event of a dispute, we follow this escalation process:
                    </p>
                    <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
                      <li><strong>Direct Contact:</strong> Email privacy@trisex.org or call +1 503 610 6762</li>
                      <li><strong>Cooperative Mediation:</strong> Member-elected dispute resolution committee</li>
                      <li><strong>Binding Arbitration:</strong> American Arbitration Association (AAA) rules</li>
                      <li><strong>Legal Action:</strong> Multnomah County, Oregon courts (last resort)</li>
                    </ol>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-bold mb-3">Limitation of Liability</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      TriSex.org provides sexual health products and services but cannot guarantee:
                    </p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• 100% STI prevention (no product is perfect)</li>
                      <li>• Relationship success or compatibility</li>
                      <li>• Freedom from user misconduct</li>
                      <li>• Third-party service availability</li>
                    </ul>
                    <p className="text-sm text-muted-foreground mt-3">
                      Our liability is limited to the amount you've paid for products/services in the past 12 months.
                    </p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-bold mb-3">Indemnification</h4>
                    <p className="text-sm text-muted-foreground">
                      You agree to indemnify TriSex.org for any claims arising from your violation of these Terms, including knowingly transmitting STIs, sharing others' private data, or falsifying verification.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Gavel className="mr-3 h-6 w-6 text-purple-600" />
                  Legal Compliance & Reporting
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-bold mb-2">Public Health Reporting</h4>
                    <p className="text-sm text-muted-foreground">
                      We are required by law to report certain STI cases to public health authorities. Anonymous, aggregated data may be shared for epidemiological research.
                    </p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-bold mb-2">Law Enforcement Requests</h4>
                    <p className="text-sm text-muted-foreground">
                      We will only provide user data to law enforcement with a valid subpoena or court order. We will notify you unless legally prohibited (e.g., gag order).
                    </p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-bold mb-2">Child Safety</h4>
                    <p className="text-sm text-muted-foreground">
                      Any suspected child exploitation is immediately reported to the National Center for Missing & Exploited Children (NCMEC) and law enforcement as required by federal law.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Changes to These Terms</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  As a cooperative, major changes to these Terms require a member vote. We will:
                </p>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• Notify all members via email 30 days before proposed changes</li>
                  <li>• Hold a democratic vote (simple majority required)</li>
                  <li>• Provide clear explanation of what's changing and why</li>
                  <li>• Allow you to delete your account if you disagree with new terms</li>
                </ul>
                <p className="text-sm text-muted-foreground mt-4">
                  Minor clarifications (typos, formatting) may be made without vote but will be documented in change log.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="mt-12 text-center">
          <div className="flex items-center justify-center gap-4 text-sm">
            <Link href="/privacy-policy">
              <Button variant="link">Privacy Policy</Button>
            </Link>
            <Link href="/accessibility">
              <Button variant="link">Accessibility</Button>
            </Link>
            <Link href="/wiki">
              <Button variant="link">Interactive Wiki</Button>
            </Link>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            Licensed under <a href="https://creativecommons.org/licenses/by-sa/4.0/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Creative Commons BY-SA 4.0</a>
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Questions? Contact us: +1 503 610 6762 | privacy@trisex.org
          </p>
        </div>
      </div>
    </div>
  );
}
