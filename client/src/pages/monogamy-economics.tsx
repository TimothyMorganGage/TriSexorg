import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertTriangle,
  DollarSign,
  Heart,
  Lock,
  TrendingUp,
  Users,
  XCircle,
  CheckCircle,
  Calculator,
  Activity,
  Target,
  Clock,
  Package
} from "lucide-react";
import { Link } from "wouter";

export default function MonogamyEconomics() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:to-blue-900 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Intersex Healthcare Affirmation */}
        <Alert className="mb-8 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/40 border-purple-200">
          <Heart className="h-5 w-5 text-black dark:text-white" />
          <AlertDescription className="ml-2 text-black dark:text-white">
            <strong>Intersex Healthcare IS Everyone's Affirmation:</strong> Monogamy economics analysis centers intersex anatomy as the universal baseline—trans, non-binary, genderqueer, and quare embodiment are all respected within this participatory budgeting framework. There is no separate "transgender healthcare" category—all relationship health metrics serve ALL bodies by design.
          </AlertDescription>
        </Alert>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="text-6xl">⚧️</div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            The Econometrics of Monogamy vs. Non-Monogamy
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Why TriSex.org maintains exclusive focus on monogamous relationships: A data-driven analysis of 
            health costs, STI transmission networks, and economic sustainability.
          </p>
        </div>

        {/* Platform Policy */}
        <Alert className="mb-8 border-2 border-blue-500 bg-blue-50 dark:bg-blue-950">
          <Lock className="h-5 w-5 text-blue-600" />
          <AlertDescription className="text-blue-900 dark:text-blue-100">
            <strong>TriSex.org Policy:</strong> This platform exclusively serves monogamous relationship structures. 
            We do not provide products, services, or support for polyamorous, open, or non-monogamous arrangements. 
            This policy is based on epidemiological data, economic sustainability modeling, and our commitment to 
            maximizing STI prevention efficacy.
          </AlertDescription>
        </Alert>

        {/* Economic Framework */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl">
              <Calculator className="h-6 w-6 mr-2 text-purple-600" />
              Econometric Analysis Framework
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              When evaluating the economics of dating people in polyamorous or open relationships, we examine:
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-lg mb-2 flex items-center">
                  <DollarSign className="h-5 w-5 mr-2 text-green-600" />
                  Direct Medical Costs
                </h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• STI testing frequency and costs</li>
                  <li>• Treatment expenses for infections</li>
                  <li>• PrEP medication costs (HIV prevention)</li>
                  <li>• Vaccination expenses (HPV, Hepatitis A/B)</li>
                  <li>• Specialist consultations</li>
                  <li>• Long-term health complications</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2 flex items-center">
                  <Activity className="h-5 w-5 mr-2 text-red-600" />
                  Network Effects & Exposure Risk
                </h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Transmission probability across network nodes</li>
                  <li>• Exponential exposure multiplication</li>
                  <li>• Unknown partner histories</li>
                  <li>• Asymptomatic carrier rates</li>
                  <li>• Testing window gaps</li>
                  <li>• Behavioral risk cascades</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2 flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-orange-600" />
                  Time & Opportunity Costs
                </h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Increased testing appointment time</li>
                  <li>• Relationship negotiation complexity</li>
                  <li>• Emotional labor of multiple partners</li>
                  <li>• Coordination and scheduling overhead</li>
                  <li>• Conflict resolution resources</li>
                  <li>• Reduced economic productivity</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2 flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
                  Long-Term Economic Impact
                </h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Fertility complications from STIs</li>
                  <li>• Chronic illness management costs</li>
                  <li>• Disability-adjusted life years (DALYs)</li>
                  <li>• Insurance premium impacts</li>
                  <li>• Career disruption from illness</li>
                  <li>• Relationship instability costs</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* STI Network Mathematics */}
        <Card className="mb-8 border-2 border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl text-red-700 dark:text-red-400">
              <AlertTriangle className="h-6 w-6 mr-2" />
              The Mathematics of Transmission Networks
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-red-50 dark:bg-red-950 p-6 rounded-lg">
              <h3 className="font-bold text-lg mb-3">Exponential Exposure in Non-Monogamous Networks</h3>
              <p className="text-sm text-muted-foreground mb-4">
                In polyamorous or open relationship structures, your STI exposure risk is not limited to your direct 
                partners—it extends to <strong>all of their partners, and their partners' partners</strong>, creating 
                exponential exposure growth.
              </p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white dark:bg-gray-800 p-4 rounded border-2 border-red-300">
                  <h4 className="font-semibold text-red-700 dark:text-red-400 mb-2">❌ Open/Poly Network Example</h4>
                  <ul className="text-sm space-y-1">
                    <li><strong>You + Partner A</strong></li>
                    <li>Partner A has 2 other partners (B, C)</li>
                    <li>Partner B has 3 other partners (D, E, F)</li>
                    <li>Partner C has 2 other partners (G, H)</li>
                    <li>Each of D-H has 1-2 other partners...</li>
                  </ul>
                  <p className="mt-3 text-sm font-bold text-red-700">
                    <strong>Network exposure: 15-30+ people</strong> within 3 degrees
                  </p>
                  <p className="text-xs mt-2 text-muted-foreground">
                    If anyone in this network contracts an STI, transmission cascades rapidly through all nodes.
                  </p>
                </div>

                <div className="bg-white dark:bg-gray-800 p-4 rounded border-2 border-green-300">
                  <h4 className="font-semibold text-green-700 dark:text-green-400 mb-2">✅ Monogamous Dyad</h4>
                  <ul className="text-sm space-y-1">
                    <li><strong>You + Partner</strong></li>
                    <li>Partner has no other partners</li>
                    <li>You have no other partners</li>
                    <li>Network sealed after testing window</li>
                    <li>Zero outside exposure vectors</li>
                  </ul>
                  <p className="mt-3 text-sm font-bold text-green-700">
                    <strong>Network exposure: 2 people</strong> total
                  </p>
                  <p className="text-xs mt-2 text-muted-foreground">
                    After comprehensive STI testing + 3-month window, transmission risk approaches zero.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">Transmission Probability Formula</h3>
                <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded font-mono text-xs">
                  <p>P(infection) = 1 - (1 - p)^n</p>
                  <p className="mt-2 text-muted-foreground">
                    Where:<br/>
                    p = per-contact transmission probability<br/>
                    n = number of exposed network contacts
                  </p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Network Size Impact</h3>
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-1">Network Size</th>
                      <th className="text-right py-1">Infection Risk*</th>
                    </tr>
                  </thead>
                  <tbody className="text-muted-foreground">
                    <tr><td>2 people (monogamy)</td><td className="text-right text-green-600 font-bold">0.2%</td></tr>
                    <tr><td>5 people</td><td className="text-right">0.5%</td></tr>
                    <tr><td>10 people</td><td className="text-right">1.0%</td></tr>
                    <tr><td>20 people</td><td className="text-right text-orange-600">2.0%</td></tr>
                    <tr><td>50 people</td><td className="text-right text-red-600 font-bold">5.0%</td></tr>
                  </tbody>
                </table>
                <p className="text-xs text-muted-foreground mt-2">
                  *Assumes 0.1% baseline prevalence and 20% per-contact transmission
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Economic Cost Analysis */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl">
              <DollarSign className="h-6 w-6 mr-2 text-green-600" />
              Annual Cost Comparison: Monogamy vs. Non-Monogamy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2">
                    <th className="text-left py-2">Expense Category</th>
                    <th className="text-right py-2">Monogamous Dyad</th>
                    <th className="text-right py-2">Polyamorous (3 partners)</th>
                    <th className="text-right py-2">Open Relationship</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-2">STI Testing (annual)</td>
                    <td className="text-right">$150-300</td>
                    <td className="text-right text-orange-600">$600-900</td>
                    <td className="text-right text-red-600">$900-1,500</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">Barrier Protection</td>
                    <td className="text-right">$120-360</td>
                    <td className="text-right text-orange-600">$360-1,080</td>
                    <td className="text-right text-red-600">$600-1,800</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">PrEP Medication (if applicable)</td>
                    <td className="text-right">$0</td>
                    <td className="text-right text-orange-600">$2,000-24,000</td>
                    <td className="text-right text-red-600">$2,000-24,000</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">Additional Vaccinations</td>
                    <td className="text-right">$200-400</td>
                    <td className="text-right text-orange-600">$200-400</td>
                    <td className="text-right text-red-600">$200-400</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">STI Treatment (expected annual)</td>
                    <td className="text-right">$0-50</td>
                    <td className="text-right text-orange-600">$200-800</td>
                    <td className="text-right text-red-600">$500-2,000</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">Emotional/Therapy Support</td>
                    <td className="text-right">$0-1,000</td>
                    <td className="text-right text-orange-600">$2,000-5,000</td>
                    <td className="text-right text-red-600">$1,500-4,000</td>
                  </tr>
                  <tr className="border-b font-bold">
                    <td className="py-2">TOTAL ANNUAL COST</td>
                    <td className="text-right text-green-600">$470-2,110</td>
                    <td className="text-right text-orange-600">$5,360-32,180</td>
                    <td className="text-right text-red-600">$5,700-33,700</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              * Costs vary based on insurance coverage, geographic location, and specific practices. PrEP costs assume no insurance coverage; 
              many insurance plans reduce this to $0-100/month. STI treatment costs reflect expected value based on infection probability.
            </p>
          </CardContent>
        </Card>

        {/* DALY Analysis */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl">
              <Activity className="h-6 w-6 mr-2 text-purple-600" />
              Disability-Adjusted Life Years (DALY) Impact
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              DALYs measure the burden of disease by combining years of life lost due to premature death and years 
              lived with disability. Non-monogamous relationship structures increase DALY burden through higher STI exposure.
            </p>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-green-50 dark:bg-green-950 p-4 rounded">
                <h3 className="font-semibold text-green-700 dark:text-green-400 mb-2">Monogamous Dyad</h3>
                <p className="text-3xl font-bold text-green-600">0.01-0.05</p>
                <p className="text-xs text-muted-foreground mt-1">DALYs lost per person over lifetime</p>
                <ul className="text-xs mt-2 space-y-1">
                  <li>• Minimal STI exposure</li>
                  <li>• Low chronic illness risk</li>
                  <li>• Fertility preservation</li>
                  <li>• Emotional stability</li>
                </ul>
              </div>

              <div className="bg-orange-50 dark:bg-orange-950 p-4 rounded">
                <h3 className="font-semibold text-orange-700 dark:text-orange-400 mb-2">Polyamorous (3+ partners)</h3>
                <p className="text-3xl font-bold text-orange-600">0.2-0.8</p>
                <p className="text-xs text-muted-foreground mt-1">DALYs lost per person over lifetime</p>
                <ul className="text-xs mt-2 space-y-1">
                  <li>• Moderate STI exposure</li>
                  <li>• Some chronic conditions</li>
                  <li>• Fertility complications</li>
                  <li>• Relationship stress</li>
                </ul>
              </div>

              <div className="bg-red-50 dark:bg-red-950 p-4 rounded">
                <h3 className="font-semibold text-red-700 dark:text-red-400 mb-2">Open/Casual Network</h3>
                <p className="text-3xl font-bold text-red-600">0.5-2.0</p>
                <p className="text-xs text-muted-foreground mt-1">DALYs lost per person over lifetime</p>
                <ul className="text-xs mt-2 space-y-1">
                  <li>• High STI exposure</li>
                  <li>• Chronic illness likely</li>
                  <li>• Significant fertility loss</li>
                  <li>• Emotional instability</li>
                </ul>
              </div>
            </div>

            <div className="bg-purple-50 dark:bg-purple-950 p-4 rounded-lg mt-4">
              <h3 className="font-semibold mb-2">Economic Value of DALYs</h3>
              <p className="text-sm text-muted-foreground mb-2">
                The World Health Organization estimates each DALY lost costs approximately <strong>$50,000-150,000</strong> in 
                economic productivity, healthcare expenses, and quality of life reduction.
              </p>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-xs text-muted-foreground">Monogamy</p>
                  <p className="font-bold text-green-600">$500-$7,500</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Polyamory</p>
                  <p className="font-bold text-orange-600">$10,000-$120,000</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Open Network</p>
                  <p className="font-bold text-red-600">$25,000-$300,000</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                *Lifetime economic impact per person from STI-related health burden
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Why TriSex.org Focuses on Monogamy */}
        <Card className="mb-8 border-2 border-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl text-blue-700 dark:text-blue-400">
              <Target className="h-6 w-6 mr-2" />
              Why TriSex.org Exclusively Serves Monogamous Relationships
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="font-semibold flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                  Epidemiological Efficacy
                </h3>
                <p className="text-sm text-muted-foreground">
                  Our barrier protection and testing protocols achieve near-100% STI prevention efficacy only in monogamous 
                  structures. Non-monogamous networks undermine our core health mission through exponential exposure multiplication.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                  Economic Sustainability
                </h3>
                <p className="text-sm text-muted-foreground">
                  Cooperative ownership models require predictable health outcomes to maintain financial stability. 
                  Non-monogamous members would increase insurance costs, testing burdens, and treatment expenses for all members.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                  Mission Alignment
                </h3>
                <p className="text-sm text-muted-foreground">
                  TriSex.org exists to build lifelong, health-protective partnerships. Monogamy enables fluid-bonding, 
                  chosen family formation, and aging-in-place together—our core relational reproduction values.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                  Resource Optimization
                </h3>
                <p className="text-sm text-muted-foreground">
                  Focusing exclusively on monogamy allows us to optimize product sizing, testing protocols, and educational 
                  content for maximum impact rather than diluting resources across incompatible relationship models.
                </p>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg mt-4">
              <h3 className="font-semibold mb-2">Respectful Boundaries</h3>
              <p className="text-sm text-muted-foreground">
                We respect that polyamory and open relationships work for some people. However, those relationship structures 
                require different health infrastructure, testing frequencies, and risk management protocols than we provide. 
                We encourage poly/open individuals to seek services designed for their specific needs rather than attempting 
                to adapt our monogamy-optimized platform.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Separation & Dating During */}
        <Card className="mb-8 border-2 border-yellow-500">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl text-yellow-700 dark:text-yellow-400">
              <AlertTriangle className="h-6 w-6 mr-2" />
              Dating People in "Separation" or Open Relationships
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
              <AlertDescription className="text-yellow-900 dark:text-yellow-100">
                <strong>High-Risk Category:</strong> Individuals who are "separated but not divorced" or in "open relationships" 
                pose significant STI exposure risk and relationship instability that conflicts with our monogamy-focused model.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">Economic Risks of Dating "Separated" Individuals</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <strong>• Unknown Exposure History:</strong> You cannot verify their spouse/ex's sexual network, 
                    testing status, or fidelity during the relationship. This creates an unmapped exposure cascade.
                  </li>
                  <li>
                    <strong>• Ongoing Contact Risk:</strong> "Separated" individuals often maintain sexual contact 
                    with their spouse during separation periods, creating active STI transmission vectors.
                  </li>
                  <li>
                    <strong>• Legal/Financial Entanglement:</strong> Separation is not divorce. Assets, debts, 
                    and legal obligations remain entangled, creating economic instability that affects your partnership.
                  </li>
                  <li>
                    <strong>• Reconciliation Probability:</strong> Many separations end in reconciliation, meaning 
                    your time and emotional investment may yield zero return.
                  </li>
                  <li>
                    <strong>• Extended Testing Windows:</strong> Even after separation, you must wait 3-6 months 
                    for comprehensive STI testing to account for any final spousal contact.
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">Economic Risks of Dating People in "Open Relationships"</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <strong>• Permanent Structural Incompatibility:</strong> If your goal is monogamous partnership, 
                    dating someone committed to non-monogamy is categorically incompatible—zero long-term ROI.
                  </li>
                  <li>
                    <strong>• Active Transmission Networks:</strong> They maintain ongoing sexual contact with multiple 
                    partners, creating constant exposure risk regardless of barrier use.
                  </li>
                  <li>
                    <strong>• Impossible Fluid-Bonding:</strong> You can never achieve fluid-bonded status with someone 
                    in an open relationship, limiting relational intimacy depth.
                  </li>
                  <li>
                    <strong>• Emotional Labor Inequality:</strong> Their primary partner typically receives priority 
                    for time, resources, and emotional support, leaving you with secondary status.
                  </li>
                  <li>
                    <strong>• Exit Cost Multiplication:</strong> Exiting the relationship may require navigating 
                    their entire polycule's reactions, not just one person.
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-950 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">TriSex.org Recommendation</h3>
              <p className="text-sm text-muted-foreground">
                <strong>Do not date individuals who are:</strong>
              </p>
              <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                <li>✗ Currently married or in a committed relationship with someone else</li>
                <li>✗ "Separated" but not legally divorced</li>
                <li>✗ Practicing polyamory or ethical non-monogamy</li>
                <li>✗ In an "open relationship" of any configuration</li>
                <li>✗ "Taking a break" from a primary partner</li>
                <li>✗ Maintaining sexual contact with ex-partners</li>
              </ul>
              <p className="text-sm font-semibold mt-3">
                Wait until they are: <span className="text-green-600">Single, legally divorced/separated for 6+ months, 
                tested negative for all STIs after a 3-month celibacy window, and explicitly seeking monogamous partnership.</span>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Conclusion & Resources */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-2xl">
              <Heart className="h-6 w-6 mr-2 text-pink-600" />
              Building Economically Sustainable Monogamous Partnerships
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              The econometrics are clear: <strong>monogamous partnership structures dramatically reduce health costs, 
              STI exposure, and emotional labor while maximizing relationship stability and long-term economic benefit.</strong>
            </p>

            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div className="bg-green-50 dark:bg-green-950 p-4 rounded">
                <p className="text-4xl font-bold text-green-600">90%+</p>
                <p className="text-sm text-muted-foreground mt-2">Cost reduction vs. non-monogamy</p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded">
                <p className="text-4xl font-bold text-blue-600">95%+</p>
                <p className="text-sm text-muted-foreground mt-2">DALY burden reduction</p>
              </div>
              <div className="bg-purple-50 dark:bg-purple-950 p-4 rounded">
                <p className="text-4xl font-bold text-purple-600">Near-0%</p>
                <p className="text-sm text-muted-foreground mt-2">STI transmission after fluid-bonding</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-950 dark:to-purple-950 p-6 rounded-lg mt-6">
              <h3 className="font-bold text-lg mb-3">TriSex.org Monogamy Pathway</h3>
              <ol className="space-y-2 text-sm">
                <li><strong>1. Single Status Verification:</strong> Confirm potential partner is legally single, divorced, or separated 6+ months</li>
                <li><strong>2. Comprehensive STI Testing:</strong> Both partners get full panel after 3-month celibacy window</li>
                <li><strong>3. Monogamy Agreement:</strong> Explicit mutual commitment to sexual and romantic exclusivity</li>
                <li><strong>4. Barrier Use Period:</strong> Use TriSex.org condoms/barriers during first 3-6 months</li>
                <li><strong>5. Retesting Confirmation:</strong> Second full STI panel at 6-month mark</li>
                <li><strong>6. Fluid-Bonding Decision:</strong> Transition to barrier-free sex if both test negative</li>
                <li><strong>7. Ongoing Communication:</strong> Maintain transparent dialogue about any exposure risks</li>
                <li><strong>8. Periodic Retesting:</strong> Annual STI screening to verify ongoing fidelity (optional)</li>
              </ol>
            </div>

            <div className="flex flex-wrap gap-3 justify-center mt-6">
              <Button asChild>
                <Link href="/products">
                  <Package className="mr-2 h-4 w-4" />
                  Monogamy Protection Products
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/4d-sti-intervention">
                  <Activity className="mr-2 h-4 w-4" />
                  4D STI Tracking
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/wiki">
                  <Users className="mr-2 h-4 w-4" />
                  Relationship Wiki
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
