import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  Droplets, 
  Recycle, 
  Leaf, 
  Beaker,
  Microscope,
  Factory,
  Waves,
  TreePine,
  FlaskConical,
  Atom,
  Zap,
  CheckCircle,
  ArrowRight,
  Globe,
  Award,
  Heart,
  Filter,
  Thermometer,
  RotateCcw
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function MaterialsScience() {
  const [activeProcess, setActiveProcess] = useState("collection");

  const processSteps = [
    {
      id: "collection",
      title: "Universal Plastic Waste Collection",
      icon: Waves,
      description: "Comprehensive collection of all plastic waste sources including microplastics and scrap",
      details: [
        "Waterway microplastic filtration with 0.1μm precision systems from rivers, lakes, streams, and oceans",
        "Municipal plastic waste collection partnerships",
        "Industrial scrap plastic sourcing from manufacturing",
        "Post-consumer plastic bottle and packaging recovery",
        "Textile microfiber capture from laundry systems",
        "Electronic waste plastic component extraction",
        "Automotive plastic waste from recycling centers",
        "Medical device plastic waste (sterilized collection)"
      ],
      timeframe: "Continuous collection networks",
      yield: "50-200kg mixed plastic waste per day per collection point"
    },
    {
      id: "sorting",
      title: "Universal Plastic Sorting & Classification",
      icon: Filter,
      description: "Advanced AI-powered sorting handles all plastic waste types from micro to macro scale",
      details: [
        "Near-infrared spectroscopy identifies 15+ polymer types (PET, HDPE, PVC, LDPE, PP, PS, etc.)",
        "Density separation removes organic matter and metal contaminants",
        "Multi-scale classification: 0.1μm microplastics to large scrap pieces",
        "X-ray fluorescence removes hazardous additives and heavy metals",
        "Color sorting separates clear, colored, and UV-degraded plastics",
        "Automated removal of labels, adhesives, and composite materials",
        "Quality grading: virgin-like, lightly degraded, heavily weathered",
        "Contamination level assessment and batch tracking"
      ],
      timeframe: "8-16 hours for mixed waste batches",
      yield: "90% pure plastic by polymer type, 95% contaminant removal"
    },
    {
      id: "breakdown",
      title: "Multi-Polymer Depolymerization", 
      icon: Atom,
      description: "Advanced breakdown processes handle all plastic types from any source",
      details: [
        "Enzymatic depolymerization for PET using engineered PETase and MHETase",
        "Solvolysis for polyurethanes and complex composites",
        "Glycolysis for polyester-based materials and textiles",
        "Pyrolysis at 350-500°C for mixed polymer batches",
        "Hydrogenolysis for cross-linked and thermoset plastics",
        "Chemical recycling for degraded waterway-weathered polymers from all aquatic environments",
        "Methanolysis for polycarbonate and acrylic materials",
        "Advanced purification removes all additives, colorants, and degradation products"
      ],
      timeframe: "4-10 hours depending on polymer complexity",
      yield: "80-95% monomer recovery across all plastic types"
    },
    {
      id: "biopolymer",
      title: "Bio-Polymer Integration",
      icon: Leaf,
      description: "Monomers combined with plant-based biopolymers",
      details: [
        "Algae-derived polysaccharides as binding matrix",
        "Cornstarch polymer chains for flexibility",
        "Cellulose nanofibrils for structural strength",
        "Natural crosslinking agents from seaweed"
      ],
      timeframe: "4-8 hours",
      yield: "90% biopolymer integration success"
    },
    {
      id: "hydrogel",
      title: "Hydrogel Matrix Formation",
      icon: Droplets,
      description: "Creation of biocompatible hydrogel composite material",
      details: [
        "Controlled polymerization creates 3D network",
        "Water content adjusted to 40-60% for flexibility",
        "Biocompatibility testing with human tissue",
        "Antimicrobial properties from natural extracts"
      ],
      timeframe: "2-4 hours",
      yield: "Medical-grade hydrogel composite"
    },
    {
      id: "manufacturing",
      title: "3D Printing & Manufacturing",
      icon: Factory,
      description: "Precision manufacturing of custom-fit products",
      details: [
        "Layer-by-layer 3D printing with 0.1mm precision",
        "Custom molds for specific anatomical measurements",
        "Quality control testing for strength and flexibility",
        "Sterile packaging in biodegradable materials"
      ],
      timeframe: "1-3 hours per product",
      yield: "99.9% dimensional accuracy"
    }
  ];

  const materialComposition = {
    recycledPlastic: {
      percentage: 35,
      sources: ["Waterway microplastics (rivers, lakes, streams, oceans)", "Municipal plastic waste", "Industrial scrap", "Post-consumer packaging", "Electronic waste plastics", "Automotive components", "Textile microfibers", "Medical device plastics"],
      properties: ["Chemical resistance", "Durability", "Structural integrity", "Contamination-free processing"]
    },
    hydrogel: {
      percentage: 25,
      sources: ["Synthesized polysaccharides", "Cross-linked polymers", "Water retention matrix"],
      properties: ["Biocompatibility", "Flexibility", "Moisture regulation"]
    },
    plantBased: {
      percentage: 40,
      sources: ["Algae extracts", "Corn starch", "Cellulose fibers", "Seaweed derivatives"],
      properties: ["Biodegradability", "Natural antimicrobial", "Skin compatibility"]
    }
  };

  const sustainabilityMetrics = [
    { metric: "Total plastic waste diverted", value: "15+ tons/month", impact: "Prevents landfill and environmental contamination" },
    { metric: "Waterway microplastic recovery", value: "2.5 tons/month", impact: "Prevents aquatic ecosystem damage across all waterways" },
    { metric: "Municipal waste reduction", value: "8 tons/month", impact: "Reduces landfill burden and incineration" },
    { metric: "Industrial scrap utilization", value: "5 tons/month", impact: "Circular economy integration" },
    { metric: "Carbon footprint reduction", value: "85% vs virgin plastic", impact: "Lower greenhouse gas emissions" },
    { metric: "Water usage efficiency", value: "90% less than traditional", impact: "Conserves freshwater resources" },
    { metric: "Energy from renewable sources", value: "60% renewable energy", impact: "Sustainable manufacturing process" },
    { metric: "Biodegradation timeline", value: "6-12 months", impact: "Reduces long-term waste accumulation" }
  ];

  const qualityStandards = [
    { standard: "ISO 10993", description: "Biological evaluation of medical devices", status: "Certified" },
    { standard: "ASTM D6400", description: "Biodegradable plastic specifications", status: "Certified" },
    { standard: "FDA 21 CFR 177", description: "Food contact substance regulations", status: "Certified" },
    { standard: "USP Class VI", description: "Plastic materials biocompatibility", status: "Certified" },
    { standard: "RoHS Compliance", description: "Restriction of hazardous substances", status: "Certified" }
  ];

  return (
    <div className="min-h-screen bg-surface py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Intersex Healthcare Affirmation */}
        <Alert className="mb-8 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200">
          <Heart className="h-5 w-5 text-purple-600" />
          <AlertDescription className="ml-2">
            <strong>Intersex Healthcare IS Everyone's Affirmation:</strong> Materials science centers intersex anatomy as the universal baseline—trans, non-binary, genderqueer, and quare embodiment are all respected within this participatory budgeting framework. There is no separate "transgender healthcare" category—all sustainable materials serve ALL bodies by design.
          </AlertDescription>
        </Alert>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground font-recoleta mb-4">
            Waterway Plastic Reprocessing Technology
          </h1>
          <p className="text-xl text-muted-foreground font-coolvetica">
            Advanced bioengineering transforms waterway microplastics from all aquatic environments into medical-grade protection materials
          </p>
        </div>

        <Tabs defaultValue="process" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="process" className="flex items-center gap-2">
              <Factory className="h-4 w-4" />
              Reprocessing Steps
            </TabsTrigger>
            <TabsTrigger value="composition" className="flex items-center gap-2">
              <Beaker className="h-4 w-4" />
              Material Composition
            </TabsTrigger>
            <TabsTrigger value="sustainability" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Environmental Impact
            </TabsTrigger>
            <TabsTrigger value="quality" className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              Quality Standards
            </TabsTrigger>
          </TabsList>

          <TabsContent value="process" className="space-y-8">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="font-recoleta">Process Navigation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {processSteps.map((step, index) => {
                        const Icon = step.icon;
                        return (
                          <Button
                            key={step.id}
                            onClick={() => setActiveProcess(step.id)}
                            variant={activeProcess === step.id ? "default" : "ghost"}
                            className="w-full justify-start h-auto p-3"
                          >
                            <div className="flex items-center space-x-3">
                              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                                <Icon className="h-4 w-4" />
                              </div>
                              <div className="text-left">
                                <div className="font-medium">Step {index + 1}</div>
                                <div className="text-sm text-muted-foreground">{step.title}</div>
                              </div>
                            </div>
                          </Button>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-2">
                {processSteps.map((step) => {
                  if (activeProcess !== step.id) return null;
                  const Icon = step.icon;
                  
                  return (
                    <Card key={step.id} className="h-full">
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-3 font-recoleta">
                          <Icon className="h-6 w-6 text-primary" />
                          <span>{step.title}</span>
                        </CardTitle>
                        <p className="text-muted-foreground">{step.description}</p>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <h4 className="font-medium flex items-center">
                              <Thermometer className="h-4 w-4 mr-2" />
                              Processing Time
                            </h4>
                            <p className="text-sm text-muted-foreground">{step.timeframe}</p>
                          </div>
                          <div className="space-y-2">
                            <h4 className="font-medium flex items-center">
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Output Yield
                            </h4>
                            <p className="text-sm text-muted-foreground">{step.yield}</p>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <h4 className="font-medium">Process Details:</h4>
                          <ul className="space-y-2">
                            {step.details.map((detail, index) => (
                              <li key={index} className="flex items-start space-x-2">
                                <ArrowRight className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                                <span className="text-sm">{detail}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h4 className="font-medium mb-2 flex items-center">
                            <Microscope className="h-4 w-4 mr-2" />
                            Scientific Innovation
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            Our proprietary process combines advanced materials science with biotechnology 
                            to create the first truly sustainable sexual health protection products from ocean waste.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="composition" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="font-recoleta">Material Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium flex items-center">
                          <Recycle className="h-4 w-4 mr-2 text-blue-600" />
                          Recycled Plastic (All Sources)
                        </span>
                        <span className="text-lg font-bold">{materialComposition.recycledPlastic.percentage}%</span>
                      </div>
                      <Progress value={materialComposition.recycledPlastic.percentage} className="h-2" />
                      <div className="text-sm text-muted-foreground">
                        Sources: {materialComposition.recycledPlastic.sources.slice(0, 4).join(", ")} + 4 more
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium flex items-center">
                          <Droplets className="h-4 w-4 mr-2 text-cyan-600" />
                          Hydrogel Matrix
                        </span>
                        <span className="text-lg font-bold">{materialComposition.hydrogel.percentage}%</span>
                      </div>
                      <Progress value={materialComposition.hydrogel.percentage} className="h-2" />
                      <div className="text-sm text-muted-foreground">
                        Sources: {materialComposition.hydrogel.sources.join(", ")}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium flex items-center">
                          <Leaf className="h-4 w-4 mr-2 text-green-600" />
                          Plant-Based Materials
                        </span>
                        <span className="text-lg font-bold">{materialComposition.plantBased.percentage}%</span>
                      </div>
                      <Progress value={materialComposition.plantBased.percentage} className="h-2" />
                      <div className="text-sm text-muted-foreground">
                        Sources: {materialComposition.plantBased.sources.join(", ")}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="font-recoleta">Material Properties</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2 flex items-center text-blue-600">
                        <Recycle className="h-4 w-4 mr-2" />
                        Recycled Plastic Benefits
                      </h4>
                      <ul className="space-y-1">
                        {materialComposition.recycledPlastic.properties.map((prop: string, index: number) => (
                          <li key={index} className="text-sm flex items-center">
                            <CheckCircle className="h-3 w-3 mr-2 text-green-600" />
                            {prop}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2 flex items-center text-cyan-600">
                        <Droplets className="h-4 w-4 mr-2" />
                        Hydrogel Benefits
                      </h4>
                      <ul className="space-y-1">
                        {materialComposition.hydrogel.properties.map((prop: string, index: number) => (
                          <li key={index} className="text-sm flex items-center">
                            <CheckCircle className="h-3 w-3 mr-2 text-green-600" />
                            {prop}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2 flex items-center text-green-600">
                        <Leaf className="h-4 w-4 mr-2" />
                        Plant-Based Advantages
                      </h4>
                      <ul className="space-y-1">
                        {materialComposition.plantBased.properties.map((prop: string, index: number) => (
                          <li key={index} className="text-sm flex items-center">
                            <CheckCircle className="h-3 w-3 mr-2 text-green-600" />
                            {prop}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="sustainability" className="space-y-6">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="font-recoleta">Environmental Impact Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sustainabilityMetrics.map((metric, index) => (
                      <div key={index} className="p-4 border rounded-lg space-y-3">
                        <div className="space-y-1">
                          <h4 className="font-medium">{metric.metric}</h4>
                          <div className="text-2xl font-bold text-primary">{metric.value}</div>
                        </div>
                        <p className="text-sm text-muted-foreground">{metric.impact}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="grid lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="font-recoleta">Circular Economy Integration</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <RotateCcw className="h-5 w-5 text-green-600" />
                        <span className="font-medium">Ocean Waste Collection</span>
                      </div>
                      <p className="text-sm text-muted-foreground ml-8">
                        Partnership with ocean cleanup organizations to source raw materials
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <Factory className="h-5 w-5 text-blue-600" />
                        <span className="font-medium">Clean Manufacturing</span>
                      </div>
                      <p className="text-sm text-muted-foreground ml-8">
                        Energy-efficient processing with renewable energy sources
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <Leaf className="h-5 w-5 text-green-600" />
                        <span className="font-medium">Biodegradable End-of-Life</span>
                      </div>
                      <p className="text-sm text-muted-foreground ml-8">
                        Products decompose naturally without environmental harm
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="font-recoleta">Innovation Partnerships</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <Waves className="h-5 w-5 text-blue-600" />
                        <span className="font-medium">Ocean Conservancy</span>
                      </div>
                      <p className="text-sm text-muted-foreground ml-8">
                        Collaborative research on marine plastic pollution solutions
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <FlaskConical className="h-5 w-5 text-purple-600" />
                        <span className="font-medium">University Research Labs</span>
                      </div>
                      <p className="text-sm text-muted-foreground ml-8">
                        Advanced materials science and biotechnology development
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <TreePine className="h-5 w-5 text-green-600" />
                        <span className="font-medium">Sustainable Agriculture</span>
                      </div>
                      <p className="text-sm text-muted-foreground ml-8">
                        Plant-based material sourcing from regenerative farming
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="quality" className="space-y-6">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="font-recoleta">Certification Standards</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {qualityStandards.map((standard, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="space-y-1">
                          <div className="font-medium">{standard.standard}</div>
                          <div className="text-sm text-muted-foreground">{standard.description}</div>
                        </div>
                        <Badge variant="default" className="bg-green-600">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          {standard.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="grid lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="font-recoleta">Testing Protocols</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <h4 className="font-medium">Biocompatibility Testing</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center">
                          <CheckCircle className="h-3 w-3 mr-2 text-green-600" />
                          Cytotoxicity assessment (ISO 10993-5)
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-3 w-3 mr-2 text-green-600" />
                          Sensitization testing (ISO 10993-10)
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-3 w-3 mr-2 text-green-600" />
                          Irritation testing (ISO 10993-23)
                        </li>
                      </ul>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-medium">Mechanical Properties</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center">
                          <CheckCircle className="h-3 w-3 mr-2 text-green-600" />
                          Tensile strength testing
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-3 w-3 mr-2 text-green-600" />
                          Elongation at break analysis
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-3 w-3 mr-2 text-green-600" />
                          Tear resistance evaluation
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="font-recoleta">Quality Assurance</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <h4 className="font-medium">Manufacturing Controls</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center">
                          <CheckCircle className="h-3 w-3 mr-2 text-green-600" />
                          Real-time process monitoring
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-3 w-3 mr-2 text-green-600" />
                          Statistical process control
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-3 w-3 mr-2 text-green-600" />
                          Batch-to-batch consistency validation
                        </li>
                      </ul>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-medium">Environmental Testing</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center">
                          <CheckCircle className="h-3 w-3 mr-2 text-green-600" />
                          Biodegradation rate assessment
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-3 w-3 mr-2 text-green-600" />
                          Marine environment impact studies
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-3 w-3 mr-2 text-green-600" />
                          Compostability certification
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}