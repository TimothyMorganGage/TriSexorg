import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Droplets, 
  MapPin, 
  TrendingUp, 
  Lock,
  AlertTriangle,
  CheckCircle,
  Activity,
  Microscope,
  Waves,
  Clock,
  Globe,
  Target,
  BarChart3,
  Zap,
  Calendar,
  Users,
  Phone,
  Mail,
  Bell,
  Heart
} from "lucide-react";

export default function FourDSTIIntervention() {
  const [selectedRegion, setSelectedRegion] = useState("downtown");
  const [activeAlert, setActiveAlert] = useState<string | null>(null);

  // Simulated real-time data
  const [riskLevels, setRiskLevels] = useState({
    chlamydia: 23,
    gonorrhea: 18,
    syphilis: 8,
    hiv: 4,
    hpv: 31,
    herpes: 27
  });

  const bioregionalData = {
    downtown: {
      name: "Downtown Core",
      population: 45000,
      activeSamplingPoints: 12,
      lastUpdated: "2 hours ago",
      waterQuality: "Good",
      sewageProcessing: "Advanced",
      riskFactors: ["High population density", "Tourism activity", "University district"],
      interventionStatus: "Active monitoring"
    },
    westside: {
      name: "Westside Communities",
      population: 32000,
      activeSamplingPoints: 8,
      lastUpdated: "1 hour ago",
      waterQuality: "Excellent",
      sewageProcessing: "Standard",
      riskFactors: ["Residential area", "Lower density"],
      interventionStatus: "Routine surveillance"
    },
    industrial: {
      name: "Industrial District",
      population: 18000,
      activeSamplingPoints: 6,
      lastUpdated: "45 minutes ago",
      waterQuality: "Fair",
      sewageProcessing: "Enhanced",
      riskFactors: ["Worker population", "Shift patterns"],
      interventionStatus: "Enhanced monitoring"
    }
  };

  const samplingTechnology = [
    {
      name: "Automated Sewer Monitoring",
      description: "Real-time pathogen detection in municipal wastewater",
      coverage: "95% of urban wastewater systems",
      frequency: "Continuous with 15-minute reporting",
      pathogens: ["Chlamydia trachomatis", "Neisseria gonorrhoeae", "Treponema pallidum", "HIV-1/2", "HPV DNA", "HSV-1/2"],
      accuracy: "97.3% sensitivity, 94.8% specificity"
    },
    {
      name: "Community Water Testing",
      description: "Distributed sampling from community water sources",
      coverage: "85% of residential areas",
      frequency: "Every 6 hours with mobile labs",
      pathogens: ["Bacterial STIs", "Viral markers", "Antibiotic resistance genes"],
      accuracy: "95.1% sensitivity, 96.7% specificity"
    },
    {
      name: "Biomarker Analysis",
      description: "Advanced molecular detection of STI biomarkers",
      coverage: "Laboratory network integration",
      frequency: "Real-time processing with AI analysis",
      pathogens: ["Emerging strains", "Co-infections", "Resistance patterns"],
      accuracy: "98.7% sensitivity, 99.2% specificity"
    }
  ];

  const interventionProtocols = [
    {
      riskLevel: "Low (0-15%)",
      color: "green",
      actions: [
        "Routine community education",
        "Standard prevention resources",
        "Regular testing promotion",
        "Baseline surveillance"
      ],
      responseTime: "7-14 days",
      resources: "Community health workers"
    },
    {
      riskLevel: "Moderate (16-35%)",
      color: "yellow",
      actions: [
        "Enhanced outreach programs",
        "Targeted testing campaigns",
        "Partner notification acceleration",
        "Resource distribution increase"
      ],
      responseTime: "48-72 hours",
      resources: "Mobile health units + digital alerts"
    },
    {
      riskLevel: "High (36-60%)",
      color: "orange",
      actions: [
        "Emergency response activation",
        "Mass testing deployment",
        "Treatment accessibility expansion",
        "Community-wide notifications"
      ],
      responseTime: "12-24 hours",
      resources: "Full clinical team deployment"
    },
    {
      riskLevel: "Critical (>60%)",
      color: "red",
      actions: [
        "Public health emergency declaration",
        "Comprehensive intervention",
        "Healthcare system mobilization",
        "Regional coordination"
      ],
      responseTime: "Immediate (0-6 hours)",
      resources: "All available resources"
    }
  ];

  const currentAlerts = [
    {
      id: "alert-001",
      region: "Downtown Core",
      pathogen: "Chlamydia trachomatis",
      riskLevel: "Moderate",
      trend: "Increasing",
      recommendation: "Enhanced testing recommended for ages 18-29",
      lastUpdated: "2 hours ago"
    },
    {
      id: "alert-002",
      region: "University District",
      pathogen: "HPV (High-risk types)",
      riskLevel: "High",
      trend: "Stable",
      recommendation: "Vaccination campaign and screening intensification",
      lastUpdated: "4 hours ago"
    }
  ];

  const geographicSpread = {
    hotspots: [
      { name: "University Campus", intensity: 78, lat: 45.5152, lng: -122.6784 },
      { name: "Downtown Nightlife", intensity: 65, lat: 45.5051, lng: -122.6750 },
      { name: "Transit Hub", intensity: 43, lat: 45.5200, lng: -122.6819 }
    ],
    trends: {
      spreading: ["Chlamydia", "HPV"],
      declining: ["Gonorrhea"],
      stable: ["HIV", "Herpes", "Syphilis"]
    }
  };

  useEffect(() => {
    // Simulate real-time data updates
    const interval = setInterval(() => {
      setRiskLevels(prev => ({
        chlamydia: Math.max(0, Math.min(100, prev.chlamydia + (Math.random() - 0.5) * 4)),
        gonorrhea: Math.max(0, Math.min(100, prev.gonorrhea + (Math.random() - 0.5) * 3)),
        syphilis: Math.max(0, Math.min(100, prev.syphilis + (Math.random() - 0.5) * 2)),
        hiv: Math.max(0, Math.min(100, prev.hiv + (Math.random() - 0.5) * 1)),
        hpv: Math.max(0, Math.min(100, prev.hpv + (Math.random() - 0.5) * 5)),
        herpes: Math.max(0, Math.min(100, prev.herpes + (Math.random() - 0.5) * 3))
      }));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const getRiskColor = (level: number) => {
    if (level < 15) return "text-green-600";
    if (level < 35) return "text-yellow-600";
    if (level < 60) return "text-orange-600";
    return "text-red-600";
  };

  const getRiskBadgeColor = (level: number) => {
    if (level < 15) return "bg-green-100 text-green-800";
    if (level < 35) return "bg-yellow-100 text-yellow-800";
    if (level < 60) return "bg-orange-100 text-orange-800";
    return "bg-red-100 text-red-800";
  };

  return (
    <div className="min-h-screen bg-surface py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Intersex Healthcare Affirmation */}
        <Alert className="mb-8 bg-white dark:bg-gray-950 border-2 border-black dark:border-white">
          <Heart className="h-5 w-5 text-black dark:text-white" />
          <AlertDescription className="ml-2 text-black dark:text-white">
            <strong>Intersex Healthcare IS Everyone's Affirmation:</strong> 4D STI intervention uses intersex anatomy as the universal baseline—trans, non-binary, genderqueer, and quare embodiment are all respected within this participatory budgeting framework. There is no separate "transgender healthcare" category—public health surveillance serves ALL bodies by design.
          </AlertDescription>
        </Alert>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground font-recoleta mb-4">
            4D STI Intervention System
          </h1>
          <p className="text-xl text-muted-foreground font-coolvetica">
            Real-time sexual health intelligence through bioregional water and sewer monitoring
          </p>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-8">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Live Dashboard
            </TabsTrigger>
            <TabsTrigger value="sampling" className="flex items-center gap-2">
              <Microscope className="h-4 w-4" />
              Sampling Network
            </TabsTrigger>
            <TabsTrigger value="interventions" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Intervention Protocols
            </TabsTrigger>
            <TabsTrigger value="geographic" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Geographic Analysis
            </TabsTrigger>
            <TabsTrigger value="alerts" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Alert System
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="font-recoleta">Real-Time STI Risk Assessment</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Live data from bioregional monitoring network
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    {Object.entries(riskLevels).map(([pathogen, level]) => (
                      <div key={pathogen} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium capitalize">{pathogen}</span>
                          <Badge className={getRiskBadgeColor(level)}>
                            {level.toFixed(1)}%
                          </Badge>
                        </div>
                        <Progress value={level} className="h-2" />
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>Community Risk Level</span>
                          <span className={getRiskColor(level)}>
                            {level < 15 ? "Low" : level < 35 ? "Moderate" : level < 60 ? "High" : "Critical"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Clock className="h-5 w-5 text-blue-600" />
                      <div>
                        <div className="font-medium">Last Updated</div>
                        <div className="text-sm text-muted-foreground">2 minutes ago</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Activity className="h-5 w-5 text-green-600" />
                      <div>
                        <div className="font-medium">System Status</div>
                        <div className="text-sm text-green-600">All systems operational</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="font-recoleta">Regional Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {Object.entries(bioregionalData).map(([key, region]) => (
                      <Button
                        key={key}
                        onClick={() => setSelectedRegion(key)}
                        variant={selectedRegion === key ? "default" : "ghost"}
                        className="w-full justify-start p-3 h-auto"
                      >
                        <div className="text-left">
                          <div className="font-medium">{region.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {region.population.toLocaleString()} residents
                          </div>
                        </div>
                      </Button>
                    ))}
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-3">Current Region: {bioregionalData[selectedRegion as keyof typeof bioregionalData].name}</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Sampling Points:</span>
                        <span className="font-medium">{bioregionalData[selectedRegion as keyof typeof bioregionalData].activeSamplingPoints}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Water Quality:</span>
                        <span className="font-medium">{bioregionalData[selectedRegion as keyof typeof bioregionalData].waterQuality}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Last Updated:</span>
                        <span className="font-medium">{bioregionalData[selectedRegion as keyof typeof bioregionalData].lastUpdated}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="sampling" className="space-y-6">
            <div className="grid gap-6">
              {samplingTechnology.map((tech, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="font-recoleta">{tech.name}</CardTitle>
                    <p className="text-muted-foreground">{tech.description}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="space-y-1">
                        <div className="text-sm font-medium">Coverage</div>
                        <div className="text-sm text-muted-foreground">{tech.coverage}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm font-medium">Frequency</div>
                        <div className="text-sm text-muted-foreground">{tech.frequency}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm font-medium">Accuracy</div>
                        <div className="text-sm text-muted-foreground">{tech.accuracy}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm font-medium">Pathogens</div>
                        <div className="text-sm text-muted-foreground">{tech.pathogens.length} types</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium">Detected Pathogens:</h4>
                      <div className="flex flex-wrap gap-2">
                        {tech.pathogens.map((pathogen, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {pathogen}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="interventions" className="space-y-6">
            <div className="grid gap-4">
              {interventionProtocols.map((protocol, index) => (
                <Card key={index} className={`border-l-4 ${
                  protocol.color === 'green' ? 'border-l-green-500' : 
                  protocol.color === 'yellow' ? 'border-l-yellow-500' :
                  protocol.color === 'orange' ? 'border-l-orange-500' : 'border-l-red-500'
                }`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="font-recoleta">{protocol.riskLevel} Risk Level</CardTitle>
                      <Badge className={`${
                        protocol.color === 'green' ? 'bg-green-100 text-green-800' : 
                        protocol.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                        protocol.color === 'orange' ? 'bg-orange-100 text-orange-800' : 'bg-red-100 text-red-800'
                      }`}>
                        Response Time: {protocol.responseTime}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid lg:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <h4 className="font-medium">Intervention Actions:</h4>
                        <ul className="space-y-2">
                          {protocol.actions.map((action, idx) => (
                            <li key={idx} className="flex items-start space-x-2">
                              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                              <span className="text-sm">{action}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="space-y-3">
                        <h4 className="font-medium">Resource Deployment:</h4>
                        <p className="text-sm text-muted-foreground">{protocol.resources}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="geographic" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="font-recoleta">Risk Hotspots</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {geographicSpread.hotspots.map((hotspot, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="space-y-1">
                        <div className="font-medium">{hotspot.name}</div>
                        <div className="text-sm text-muted-foreground">
                          Risk Intensity: {hotspot.intensity}%
                        </div>
                      </div>
                      <div className="text-right">
                        <Progress value={hotspot.intensity} className="w-24 h-2 mb-1" />
                        <div className={`text-xs font-medium ${getRiskColor(hotspot.intensity)}`}>
                          {hotspot.intensity < 15 ? "Low" : hotspot.intensity < 35 ? "Moderate" : 
                           hotspot.intensity < 60 ? "High" : "Critical"}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="font-recoleta">Trend Analysis</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="h-4 w-4 text-red-600" />
                        <span className="font-medium">Increasing</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {geographicSpread.trends.spreading.map((pathogen, idx) => (
                          <Badge key={idx} variant="destructive" className="text-xs">
                            {pathogen}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="h-4 w-4 text-green-600 rotate-180" />
                        <span className="font-medium">Declining</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {geographicSpread.trends.declining.map((pathogen, idx) => (
                          <Badge key={idx} className="bg-green-100 text-green-800 text-xs">
                            {pathogen}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Activity className="h-4 w-4 text-blue-600" />
                        <span className="font-medium">Stable</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {geographicSpread.trends.stable.map((pathogen, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {pathogen}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6">
            <div className="space-y-4">
              {currentAlerts.map((alert) => (
                <Alert key={alert.id} className="border-orange-200 bg-orange-50">
                  <AlertTriangle className="h-4 w-4 text-orange-600" />
                  <AlertDescription className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{alert.region} - {alert.pathogen}</div>
                      <Badge className="bg-orange-100 text-orange-800">{alert.riskLevel} Risk</Badge>
                    </div>
                    <p className="text-sm">{alert.recommendation}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Trend: {alert.trend}</span>
                      <span>Updated: {alert.lastUpdated}</span>
                    </div>
                  </AlertDescription>
                </Alert>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="font-recoleta">Alert Response Contacts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium flex items-center">
                      <Phone className="h-4 w-4 mr-2" />
                      Emergency Response
                    </h4>
                    <p className="text-sm text-muted-foreground">24/7 Sexual Health Emergency Line</p>
                    <p className="text-sm font-medium">1-800-STI-HELP (784-4357)</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium flex items-center">
                      <Mail className="h-4 w-4 mr-2" />
                      Automated Notifications
                    </h4>
                    <p className="text-sm text-muted-foreground">Community health alerts and updates</p>
                    <p className="text-sm font-medium">alerts@healthmonitor.org</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}