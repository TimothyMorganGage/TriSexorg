import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Shield, 
  Lock, 
  Eye, 
  Database, 
  Share2, 
  UserCheck,
  AlertTriangle,
  CheckCircle,
  FileText,
  Globe,
  Heart
} from "lucide-react";
import { Link } from "wouter";

export default function PrivacyPolicy() {
  const lastUpdated = "November 22, 2025";

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <Shield className="h-12 w-12 text-primary mr-4" />
            <div>
              <h1 className="text-4xl font-bold text-foreground">
                Privacy Policy
              </h1>
              <p className="text-xl text-muted-foreground mt-2">
                Your sexual health data is sacred. We protect it fiercely.
              </p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <Badge variant="outline">Last Updated: {lastUpdated}</Badge>
            <Badge variant="outline">Open Source</Badge>
            <Badge variant="outline">GDPR Compliant</Badge>
          </div>
        </div>

        {/* Quick Summary */}
        <Alert className="mb-8 bg-green-50 dark:bg-green-900/20 border-green-200">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <AlertDescription className="ml-2">
            <strong>Quick Summary:</strong> Your sexual health data belongs to YOU. We use enterprise-grade encryption, never sell your data, and you can delete everything at any time. We're a cooperative—your privacy is our mission, not a business model.
          </AlertDescription>
        </Alert>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="data">Data We Collect</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="rights">Your Rights</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="mr-3 h-6 w-6 text-red-500" />
                  Our Privacy Philosophy
                </CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <p className="text-muted-foreground">
                  TriSex.org is built on the principle that <strong>sexual health data is among the most sensitive personal information</strong> a person can share. As a cooperative owned by our members, we have no incentive to monetize your data—our only goal is to serve your health and safety needs.
                </p>

                <Alert className="my-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200">
                  <Heart className="h-5 w-5 text-purple-600" />
                  <AlertDescription className="ml-2">
                    <strong>Intersex Healthcare IS Everyone's Affirmation:</strong> Our privacy framework treats ALL anatomical data equally because intersex-centered design is our baseline. There is no separate "transgender healthcare" category to disclose or restrict—just healthcare for human bodies as they naturally exist.
                  </AlertDescription>
                </Alert>

                <h3 className="text-lg font-bold mt-6 mb-3">Core Privacy Principles</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <h4 className="font-bold flex items-center mb-2">
                      <Lock className="mr-2 h-5 w-5 text-blue-600" />
                      Privacy by Design
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      We build privacy protections into every feature from the ground up. Your data is encrypted end-to-end, anonymized for analytics, and never shared without explicit consent.
                    </p>
                  </div>

                  <div className="p-4 bg-muted/30 rounded-lg">
                    <h4 className="font-bold flex items-center mb-2">
                      <UserCheck className="mr-2 h-5 w-5 text-green-600" />
                      Data Minimization
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      We only collect data necessary to provide our services. No tracking pixels, no third-party analytics, no advertising networks. Your browsing behavior is YOUR business.
                    </p>
                  </div>

                  <div className="p-4 bg-muted/30 rounded-lg">
                    <h4 className="font-bold flex items-center mb-2">
                      <Share2 className="mr-2 h-5 w-5 text-purple-600" />
                      Transparency & Control
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      You can download all your data, delete your account, or opt out of any feature at any time. We provide detailed logs of who accessed your data and when.
                    </p>
                  </div>

                  <div className="p-4 bg-muted/30 rounded-lg">
                    <h4 className="font-bold flex items-center mb-2">
                      <Globe className="mr-2 h-5 w-5 text-orange-600" />
                      Open Source Accountability
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Our age verification, genealogical screening, and encryption systems are open source (CC BY-SA 4.0). Security researchers can audit our code to verify we protect your privacy as promised.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>What Makes TriSex Different?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-bold mb-3 text-red-600">Traditional Sexual Health Apps</h4>
                    <ul className="text-sm space-y-2 text-muted-foreground">
                      <li>❌ Sell anonymized data to advertisers</li>
                      <li>❌ Share STI status with insurance companies</li>
                      <li>❌ Track location to target ads</li>
                      <li>❌ Closed-source privacy policies you can't verify</li>
                      <li>❌ Profit motive conflicts with privacy</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold mb-3 text-green-600">TriSex Cooperative Model</h4>
                    <ul className="text-sm space-y-2 text-muted-foreground">
                      <li>✅ Never sell or share your data</li>
                      <li>✅ Member-owned: privacy is OUR priority</li>
                      <li>✅ No location tracking or behavioral profiling</li>
                      <li>✅ Open source: verify our claims yourself</li>
                      <li>✅ Cooperative ownership eliminates profit motive</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="data" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Database className="mr-3 h-6 w-6" />
                  Data We Collect & Why
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-bold mb-3">Account Information</h4>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <strong>What we collect:</strong>
                        <ul className="mt-2 space-y-1 text-muted-foreground">
                          <li>• Email address</li>
                          <li>• Password (encrypted hash only)</li>
                          <li>• Username</li>
                          <li>• Account creation date</li>
                        </ul>
                      </div>
                      <div>
                        <strong>Why we need it:</strong>
                        <ul className="mt-2 space-y-1 text-muted-foreground">
                          <li>• Account authentication</li>
                          <li>• Password recovery</li>
                          <li>• Service notifications</li>
                          <li>• Security monitoring</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg bg-purple-50/50 dark:bg-purple-900/10">
                    <h4 className="font-bold mb-3">Sexual Health Data (Highly Sensitive)</h4>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <strong>What we collect:</strong>
                        <ul className="mt-2 space-y-1 text-muted-foreground">
                          <li>• STI testing results (voluntary)</li>
                          <li>• Product customization preferences</li>
                          <li>• Anatomical measurements (intersex-centered)</li>
                          <li>• Partner network data (4D STI tracking)</li>
                          <li>• Relationship verification status</li>
                        </ul>
                      </div>
                      <div>
                        <strong>Why we need it:</strong>
                        <ul className="mt-2 space-y-1 text-muted-foreground">
                          <li>• Custom-fit product design</li>
                          <li>• STI exposure notifications</li>
                          <li>• Good People Cooperative matching</li>
                          <li>• Public health analytics (anonymized)</li>
                          <li>• DALY health impact calculations</li>
                        </ul>
                      </div>
                    </div>
                    <Alert className="mt-4 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200">
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      <AlertDescription className="text-xs">
                        <strong>Extra Protection:</strong> Sexual health data is encrypted with separate keys, stored in isolated databases, and access-logged. Only YOU and explicitly authorized healthcare providers can view this data.
                      </AlertDescription>
                    </Alert>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-bold mb-3">Age Verification Data</h4>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <strong>What we collect:</strong>
                        <ul className="mt-2 space-y-1 text-muted-foreground">
                          <li>• Government ID (processed locally)</li>
                          <li>• Date of birth</li>
                          <li>• Parental consent (for minors)</li>
                          <li>• Verification status</li>
                        </ul>
                      </div>
                      <div>
                        <strong>Why we need it:</strong>
                        <ul className="mt-2 space-y-1 text-muted-foreground">
                          <li>• Legal age compliance</li>
                          <li>• 2-year age range matching</li>
                          <li>• Age-appropriate content filtering</li>
                        </ul>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-3">
                      <strong>Open Source System:</strong> Our age verification is processed client-side and open source (CC BY-SA 4.0). Document images are deleted immediately after extraction—we only store your verified age, not your ID.
                    </p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-bold mb-3">Genealogical Data (GEDCOM)</h4>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <strong>What we collect:</strong>
                        <ul className="mt-2 space-y-1 text-muted-foreground">
                          <li>• Family tree data (GEDCOM format)</li>
                          <li>• Relationship degrees (up to 8th cousins)</li>
                          <li>• Incest prevention verification</li>
                        </ul>
                      </div>
                      <div>
                        <strong>Why we need it:</strong>
                        <ul className="mt-2 space-y-1 text-muted-foreground">
                          <li>• Prevent incestuous relationships</li>
                          <li>• Genetic health screening</li>
                          <li>• Relationship verification</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Data We DON'T Collect</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 h-5 w-5 text-green-600 mt-0.5" />
                    <span><strong>No location tracking:</strong> We don't track your physical location or movement patterns</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 h-5 w-5 text-green-600 mt-0.5" />
                    <span><strong>No behavioral profiling:</strong> We don't build advertising profiles or sell your browsing habits</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 h-5 w-5 text-green-600 mt-0.5" />
                    <span><strong>No third-party trackers:</strong> No Google Analytics, Facebook Pixel, or ad networks</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 h-5 w-5 text-green-600 mt-0.5" />
                    <span><strong>No device fingerprinting:</strong> We don't uniquely identify your browser or device</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 h-5 w-5 text-green-600 mt-0.5" />
                    <span><strong>No keystroke logging:</strong> We never record your typing patterns or behavior</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lock className="mr-3 h-6 w-6 text-blue-600" />
                  Enterprise-Grade Security Measures
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-bold mb-3 flex items-center">
                      <Shield className="mr-2 h-5 w-5 text-blue-600" />
                      Encryption
                    </h4>
                    <ul className="text-sm space-y-2 text-muted-foreground">
                      <li>• <strong>TLS 1.3:</strong> All data in transit encrypted</li>
                      <li>• <strong>AES-256:</strong> All data at rest encrypted</li>
                      <li>• <strong>Separate keys:</strong> Sexual health data uses additional encryption layer</li>
                      <li>• <strong>Key rotation:</strong> Encryption keys rotated quarterly</li>
                    </ul>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-bold mb-3 flex items-center">
                      <Eye className="mr-2 h-5 w-5 text-purple-600" />
                      Access Controls
                    </h4>
                    <ul className="text-sm space-y-2 text-muted-foreground">
                      <li>• <strong>Role-based access:</strong> Staff can only access data necessary for their role</li>
                      <li>• <strong>Audit logging:</strong> All data access is logged with timestamp and reason</li>
                      <li>• <strong>Two-factor authentication:</strong> Required for all staff accounts</li>
                      <li>• <strong>Access reviews:</strong> Quarterly audits of who can see what</li>
                    </ul>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-bold mb-3 flex items-center">
                      <Database className="mr-2 h-5 w-5 text-green-600" />
                      Database Security
                    </h4>
                    <ul className="text-sm space-y-2 text-muted-foreground">
                      <li>• <strong>Isolated databases:</strong> Sexual health data in separate database from account info</li>
                      <li>• <strong>Automated backups:</strong> Daily encrypted backups to separate infrastructure</li>
                      <li>• <strong>SQL injection protection:</strong> Parameterized queries only</li>
                      <li>• <strong>No direct database access:</strong> All queries go through audited API layer</li>
                    </ul>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-bold mb-3 flex items-center">
                      <FileText className="mr-2 h-5 w-5 text-orange-600" />
                      Security Audits
                    </h4>
                    <ul className="text-sm space-y-2 text-muted-foreground">
                      <li>• <strong>Annual penetration testing:</strong> Third-party security assessments</li>
                      <li>• <strong>Bug bounty program:</strong> Rewards for responsible disclosure</li>
                      <li>• <strong>Open source review:</strong> Community can audit our code</li>
                      <li>• <strong>Compliance audits:</strong> GDPR, HIPAA-aligned practices</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Profile Image Security</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Profile images for Good People Cooperative Matchmaking use enhanced security to prevent inappropriate content:
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 h-5 w-5 text-green-600 mt-0.5" />
                    <span><strong>Server-side MIME validation:</strong> We inspect file contents (not just headers) to verify real images</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 h-5 w-5 text-green-600 mt-0.5" />
                    <span><strong>Private storage with signed URLs:</strong> Images stored privately, accessible via 7-day signed URLs</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 h-5 w-5 text-green-600 mt-0.5" />
                    <span><strong>Moderation metadata:</strong> Every upload tagged with user ID, timestamp, moderation status</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 h-5 w-5 text-green-600 mt-0.5" />
                    <span><strong>Non-pornographic policy:</strong> Clear guidelines displayed at upload point</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rights" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <UserCheck className="mr-3 h-6 w-6 text-green-600" />
                  Your Privacy Rights (GDPR)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-bold mb-2">Right to Access</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    You can download all your data in machine-readable format (JSON) at any time.
                  </p>
                  <Button size="sm" variant="outline">
                    Download My Data
                  </Button>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-bold mb-2">Right to Deletion</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    You can delete your account and ALL associated data permanently. This includes:
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1 mb-3">
                    <li>• Account information</li>
                    <li>• Sexual health data</li>
                    <li>• Product configurations</li>
                    <li>• Partner network data</li>
                    <li>• Profile images</li>
                  </ul>
                  <Button size="sm" variant="destructive">
                    Delete My Account
                  </Button>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-bold mb-2">Right to Portability</h4>
                  <p className="text-sm text-muted-foreground">
                    Export your data to use with other services. We support standard formats (GEDCOM for genealogy, HL7 FHIR for health data).
                  </p>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-bold mb-2">Right to Correction</h4>
                  <p className="text-sm text-muted-foreground">
                    Update or correct any data we have about you through your account settings or by contacting us.
                  </p>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-bold mb-2">Right to Object</h4>
                  <p className="text-sm text-muted-foreground">
                    Opt out of data processing for specific purposes (e.g., public health analytics) while continuing to use the service.
                  </p>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-bold mb-2">Right to Access Logs</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    See who accessed your data, when, and why. Transparency is a core value.
                  </p>
                  <Button size="sm" variant="outline">
                    View Access Logs
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Our Data Protection Officer</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Questions about your privacy? Contact our Data Protection Officer:
                </p>
                <div className="space-y-2 text-sm">
                  <p><strong>Email:</strong> privacy@trisex.org</p>
                  <p><strong>Phone:</strong> +1 503 610 6762</p>
                  <p><strong>Response Time:</strong> Within 48 hours</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="mt-12 text-center">
          <div className="flex items-center justify-center gap-4 text-sm">
            <Link href="/terms-of-service">
              <Button variant="link">Terms of Service</Button>
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
        </div>
      </div>
    </div>
  );
}
