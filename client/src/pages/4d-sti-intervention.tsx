import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Droplets, 
  MapPin, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Calendar,
  Users,
  Activity,
  Zap,
  Globe,
  TestTube
} from "lucide-react";

interface BioregionalData {
  region: string;
  zipCode: string;
  county: string;
  state: string;
  sewageAnalysis: {
    chlamydiaMarkers: number;
    gonorrheaMarkers: number;
    syphilisMarkers: number;
    herpesMarkers: number;
    hivMarkers: number;
    hpvMarkers: number;
  };
  waterSupplyAnalysis: {
    pharmaceuticalResidues: number;
    hormonalCompounds: number;
    antibioticResistance: number;
  };
  populationMetrics: {
    density: number;
    ageDistribution: string;
    healthcareAccess: number;
  };
  riskLevel: "low" | "moderate" | "high" | "critical";
  recommendations: string[];
  interventions: string[];
}

interface InterventionProgram {
  id: string;
  name: string;
  type: "education" | "testing" | "treatment" | "prevention";
  targetRegions: string[];
  effectiveness: number;
  costPerPerson: number;
  timeframe: string;
  description: string;
}

export default function FourDSTIIntervention() {
  const [selectedRegion, setSelectedRegion] = useState("10001");
  const [activeTab, setActiveTab] = useState("overview");
  const [timeRange, setTimeRange] = useState("7d");

  // Mock 4D bioregional data - in production, this would come from authentic sewage monitoring APIs
  const mockBioregionalData: BioregionalData[] = [
    {
      region: "Manhattan Financial District",
      zipCode: "10001",
      county: "New York",
      state: "NY",
      sewageAnalysis: {
        chlamydiaMarkers: 127.5,
        gonorrheaMarkers: 89.2,
        syphilisMarkers: 23.1,
        herpesMarkers: 156.8,
        hivMarkers: 45.3,
        hpvMarkers: 234.7
      },
      waterSupplyAnalysis: {
        pharmaceuticalResidues: 12.4,
        hormonalCompounds: 8.7,
        antibioticResistance: 15.2
      },
      populationMetrics: {
        density: 28000,
        ageDistribution: "25-45 years",
        healthcareAccess: 85
      },
      riskLevel: "moderate",
      recommendations: [
        "Increase testing availability in financial district",
        "Partner with corporate wellness programs",
        "Deploy mobile testing units during lunch hours"
      ],
      interventions: [
        "Workplace sexual health education",
        "Extended clinic hours",
        "Corporate health partnerships"
      ]
    },
    {
      region: "San Francisco Mission District",
      zipCode: "94110",
      county: "San Francisco",
      state: "CA",
      sewageAnalysis: {
        chlamydiaMarkers: 198.3,
        gonorrheaMarkers: 142.7,
        syphilisMarkers: 67.4,
        herpesMarkers: 203.5,
        hivMarkers: 78.9,
        hpvMarkers: 298.1
      },
      waterSupplyAnalysis: {
        pharmaceuticalResidues: 18.9,
        hormonalCompounds: 14.2,
        antibioticResistance: 22.1
      },
      populationMetrics: {
        density: 18500,
        ageDistribution: "18-35 years",
        healthcareAccess: 72
      },
      riskLevel: "high",
      recommendations: [
        "Urgent expansion of community health centers",
        "Multilingual education campaigns",
        "Peer educator training programs"
      ],
      interventions: [
        "Community health worker deployment",
        "Cultural competency training",
        "Harm reduction programs"
      ]
    }
  ];

  const interventionPrograms: InterventionProgram[] = [
    {
      id: "edu-1",
      name: "4D Community Education Initiative",
      type: "education",
      targetRegions: ["10001", "94110"],
      effectiveness: 78,
      costPerPerson: 12.50,
      timeframe: "3 months",
      description: "Data-driven sexual health education based on local sewage biomarkers"
    },
    {
      id: "test-1", 
      name: "Bioregional Testing Expansion",
      type: "testing",
      targetRegions: ["94110"],
      effectiveness: 92,
      costPerPerson: 45.00,
      timeframe: "6 months",
      description: "Targeted testing programs in high-biomarker zip codes"
    },
    {
      id: "prev-1",
      name: "4D Prevention Network",
      type: "prevention",
      targetRegions: ["10001", "94110"],
      effectiveness: 85,
      costPerPerson: 28.75,
      timeframe: "12 months", 
      description: "Coordinated prevention strategy using real-time sewage monitoring"
    }
  ];

  const currentData = mockBioregionalData.find(d => d.zipCode === selectedRegion) || mockBioregionalData[0];

  const getRiskColor = (level: string) => {
    switch (level) {
      case "low": return "text-green-600 bg-green-100";
      case "moderate": return "text-yellow-600 bg-yellow-100"; 
      case "high": return "text-orange-600 bg-orange-100";
      case "critical": return "text-red-600 bg-red-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "education": return Users;
      case "testing": return TestTube;
      case "treatment": return Activity;
      case "prevention": return CheckCircle;
      default: return Zap;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-xl flex items-center justify-center mr-4">
              <Droplets className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground">
                <span className="text-blue-500">4D</span> STI Intervention
              </h1>
              <p className="text-xl text-muted-foreground mt-2">
                Bioregional Health Monitoring Through Water & Sewage Analysis
              </p>
            </div>
          </div>
          
          <div className="flex justify-center space-x-4">
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              <Droplets className="w-4 h-4 mr-1" />
              Sewage Biomarkers
            </Badge>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              <TestTube className="w-4 h-4 mr-1" />
              Water Analysis
            </Badge>
            <Badge variant="secondary" className="bg-purple-100 text-purple-800">
              <Globe className="w-4 h-4 mr-1" />
              Population Health
            </Badge>
          </div>
        </div>

        {/* Region Selector */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="mr-2 h-5 w-5" />
              Select Bioregion for Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                <SelectTrigger>
                  <SelectValue placeholder="Select zip code" />
                </SelectTrigger>
                <SelectContent>
                  {mockBioregionalData.map((region) => (
                    <SelectItem key={region.zipCode} value={region.zipCode}>
                      {region.zipCode} - {region.region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Time range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24h">Last 24 Hours</SelectItem>
                  <SelectItem value="7d">Last 7 Days</SelectItem>
                  <SelectItem value="30d">Last 30 Days</SelectItem>
                  <SelectItem value="90d">Last 90 Days</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center justify-center">
                <Badge className={getRiskColor(currentData.riskLevel)}>
                  Risk Level: {currentData.riskLevel.toUpperCase()}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="overview">Biomarker Overview</TabsTrigger>
            <TabsTrigger value="sewage">Sewage Analysis</TabsTrigger>
            <TabsTrigger value="water">Water Analysis</TabsTrigger>
            <TabsTrigger value="interventions">Interventions</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Current Region</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div><strong>Region:</strong> {currentData.region}</div>
                    <div><strong>Zip Code:</strong> {currentData.zipCode}</div>
                    <div><strong>County:</strong> {currentData.county}</div>
                    <div><strong>State:</strong> {currentData.state}</div>
                    <div><strong>Population Density:</strong> {currentData.populationMetrics.density.toLocaleString()}/sq mi</div>
                    <div><strong>Healthcare Access:</strong> {currentData.populationMetrics.healthcareAccess}%</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Risk Assessment</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-center">
                      <Badge className={`${getRiskColor(currentData.riskLevel)} text-lg px-4 py-2`}>
                        {currentData.riskLevel.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Chlamydia</span>
                        <Progress value={Math.min(currentData.sewageAnalysis.chlamydiaMarkers / 2, 100)} className="w-20 h-2" />
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Gonorrhea</span>
                        <Progress value={Math.min(currentData.sewageAnalysis.gonorrheaMarkers / 2, 100)} className="w-20 h-2" />
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Syphilis</span>
                        <Progress value={Math.min(currentData.sewageAnalysis.syphilisMarkers / 1, 100)} className="w-20 h-2" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Trending Data</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4 text-red-500" />
                      <span className="text-sm">Chlamydia markers ↑ 12%</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm">Gonorrhea markers ↑ 8%</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span className="text-sm">HIV markers ↓ 3%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>4D Analysis Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Key Findings</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center">
                        <AlertTriangle className="h-4 w-4 text-yellow-500 mr-2" />
                        Elevated chlamydia biomarkers detected in sewage samples
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        Water supply shows normal pharmaceutical residue levels
                      </li>
                      <li className="flex items-center">
                        <AlertTriangle className="h-4 w-4 text-orange-500 mr-2" />
                        Antibiotic resistance markers trending upward
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Recommended Actions</h4>
                    <ul className="space-y-2 text-sm">
                      {currentData.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-center">
                          <Zap className="h-4 w-4 text-blue-500 mr-2" />
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sewage">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(currentData.sewageAnalysis).map(([key, value]) => (
                <Card key={key}>
                  <CardHeader>
                    <CardTitle className="text-lg capitalize">
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="text-2xl font-bold text-primary">
                        {value} <span className="text-sm font-normal text-muted-foreground">copies/L</span>
                      </div>
                      <Progress value={Math.min(value / 3, 100)} className="h-2" />
                      <div className="text-xs text-muted-foreground">
                        Measured in sewage outflow over {timeRange}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Sewage Biomarker Methodology</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6 text-sm">
                  <div>
                    <h4 className="font-medium mb-2">Collection Process</h4>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• 24-hour composite sampling from wastewater treatment plants</li>
                      <li>• Automated collection every 2 hours</li>
                      <li>• Temperature-controlled transport to laboratories</li>
                      <li>• Real-time data transmission to 4D monitoring system</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Analysis Methods</h4>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• qPCR for bacterial and viral DNA detection</li>
                      <li>• Mass spectrometry for pharmaceutical compounds</li>
                      <li>• Population normalization using biomarkers</li>
                      <li>• Machine learning trend analysis</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="water">
            <div className="grid md:grid-cols-3 gap-6">
              {Object.entries(currentData.waterSupplyAnalysis).map(([key, value]) => (
                <Card key={key}>
                  <CardHeader>
                    <CardTitle className="text-lg capitalize">
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="text-2xl font-bold text-blue-600">
                        {value} <span className="text-sm font-normal text-muted-foreground">μg/L</span>
                      </div>
                      <Progress value={Math.min(value * 4, 100)} className="h-2" />
                      <div className="text-xs text-muted-foreground">
                        Detected in water supply monitoring
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Water Supply Monitoring</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <h4 className="font-medium mb-2 flex items-center">
                      <Droplets className="mr-2 h-5 w-5 text-blue-600" />
                      Water Quality Assessment
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Continuous monitoring of pharmaceutical residues and hormonal compounds in drinking water 
                      provides insights into population health trends and treatment effectiveness.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <h5 className="font-medium mb-2">Pharmaceutical Residues</h5>
                      <p className="text-muted-foreground">
                        Antibiotic and antiviral compounds indicating treatment patterns
                      </p>
                    </div>
                    <div>
                      <h5 className="font-medium mb-2">Hormonal Compounds</h5>
                      <p className="text-muted-foreground">
                        Estrogen and testosterone metabolites from therapeutic use
                      </p>
                    </div>
                    <div>
                      <h5 className="font-medium mb-2">Resistance Markers</h5>
                      <p className="text-muted-foreground">
                        Genetic markers indicating antibiotic resistance trends
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="interventions">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Active Intervention Programs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {interventionPrograms.map((program) => {
                      const IconComponent = getTypeIcon(program.type);
                      return (
                        <div key={program.id} className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <IconComponent className="h-5 w-5 text-primary" />
                              <h4 className="font-medium">{program.name}</h4>
                            </div>
                            <Badge variant="outline" className="capitalize">
                              {program.type}
                            </Badge>
                          </div>
                          
                          <p className="text-sm text-muted-foreground mb-3">
                            {program.description}
                          </p>
                          
                          <div className="grid md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Effectiveness:</span>
                              <div className="font-medium">{program.effectiveness}%</div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Cost per Person:</span>
                              <div className="font-medium">${program.costPerPerson}</div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Timeframe:</span>
                              <div className="font-medium">{program.timeframe}</div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Regions:</span>
                              <div className="font-medium">{program.targetRegions.length} zip codes</div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Regional Implementation Strategy</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {currentData.interventions.map((intervention, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                        <Calendar className="h-5 w-5 text-primary" />
                        <span>{intervention}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}