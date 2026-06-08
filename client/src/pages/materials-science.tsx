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
  RotateCcw,
  Handshake,
  ClipboardList,
  Building2,
  FileText,
  AlertTriangle
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
      yield: "Pending validation — earlier copy claimed 90% plastic purity / 95% contaminant removal without lab data"
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
      yield: "Pending validation — earlier copy claimed 80–95% monomer recovery without lab data"
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
      yield: "Pending validation — earlier copy claimed 90% integration success without lab data"
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
      description: "Precision manufacturing of TriSex Perfect Protection",
      details: [
        "Layer-by-layer 3D printing with 0.1mm precision",
        "Custom molds for specific anatomical measurements",
        "Quality control testing for strength and flexibility",
        "Sterile packaging in biodegradable materials"
      ],
      timeframe: "1-3 hours per product",
      yield: "Pending validation — earlier copy claimed 99.9% dimensional accuracy without measurement data"
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
    { metric: "Total plastic waste diverted", value: "—", impact: "No production at scale yet; the previously displayed '15+ tons/month' figure was fabricated" },
    { metric: "Waterway microplastic recovery", value: "—", impact: "No recovery operation in place yet; the previously displayed '2.5 tons/month' figure was fabricated" },
    { metric: "Municipal waste reduction", value: "—", impact: "No municipal contracts in place yet; the previously displayed '8 tons/month' figure was fabricated" },
    { metric: "Industrial scrap utilization", value: "—", impact: "No supplier agreements in place yet; the previously displayed '5 tons/month' figure was fabricated" },
    { metric: "Carbon footprint reduction", value: "—", impact: "No life-cycle assessment has been completed; the previously displayed '85% vs virgin plastic' figure was an unverified marketing claim" },
    { metric: "Water usage efficiency", value: "—", impact: "No water-use audit has been completed; the previously displayed '90% less than traditional' figure was unverified" },
    { metric: "Energy from renewable sources", value: "—", impact: "Energy mix depends on the manufacturing site once selected; the previously displayed '60% renewable energy' figure was aspirational, not measured" },
    { metric: "Biodegradation timeline", value: "Pending lab data", impact: "ASTM D5511 / D5338 testing has not been performed; the previously displayed '6–12 months' window was a guess" }
  ];

  const qualityStandards = [
    { standard: "ISO 10993", description: "Biological evaluation of medical devices", status: "Not yet certified — earlier copy falsely listed this as Certified" },
    { standard: "ASTM D6400", description: "Biodegradable plastic specifications", status: "Not yet certified — earlier copy falsely listed this as Certified" },
    { standard: "FDA 21 CFR 177", description: "Food contact substance regulations", status: "Not yet certified — earlier copy falsely listed this as Certified" },
    { standard: "USP Class VI", description: "Plastic materials biocompatibility", status: "Not yet certified — earlier copy falsely listed this as Certified" },
    { standard: "RoHS Compliance", description: "Restriction of hazardous substances", status: "Not yet certified — earlier copy falsely listed this as Certified" }
  ];

  // Publicly verifiable real-world organisations in the bio-materials / recovered-plastic
  // / biopolymer space. NONE have been contacted. Listing is a research shortlist only —
  // it does not imply any relationship, agreement, or endorsement.
  const supplierCandidates = [
    {
      name: "Bureo",
      category: "Recovered marine plastic feedstock",
      region: "Chile / USA",
      offering: "NetPlus® pellets made from recovered fishing nets",
      relevance: "Traceable ocean-bound feedstock for the recycled-plastic fraction",
    },
    {
      name: "#tide ocean material",
      category: "Recovered marine plastic feedstock",
      region: "Switzerland / Thailand",
      offering: "Ocean-bound PET/PP granulates and yarns",
      relevance: "Certified ocean-bound polymer stock for compounding trials",
    },
    {
      name: "Oceanworks",
      category: "Recycled-plastic marketplace",
      region: "USA (global supply)",
      offering: "Verified recycled and ocean-bound plastic supply",
      relevance: "Aggregator for sourcing small validation batches",
    },
    {
      name: "NatureWorks",
      category: "Plant-based biopolymer",
      region: "USA",
      offering: "Ingeo™ PLA from annually renewable feedstock",
      relevance: "Biodegradable matrix candidate for the plant-based fraction",
    },
    {
      name: "Novamont",
      category: "Plant-based biopolymer",
      region: "Italy",
      offering: "Mater-Bi® starch-based bioplastics",
      relevance: "Flexible, compostable binder candidate",
    },
    {
      name: "Danimer Scientific",
      category: "Marine-degradable biopolymer",
      region: "USA",
      offering: "Nodax® PHA (polyhydroxyalkanoate)",
      relevance: "Marine-biodegradable polymer for end-of-life goals",
    },
    {
      name: "Carbios",
      category: "Enzymatic depolymerization (process licensing)",
      region: "France",
      offering: "Enzymatic PET biorecycling technology",
      relevance: "Potential process partner for the depolymerization step",
    },
    {
      name: "Ecovative",
      category: "Mycelium materials",
      region: "USA",
      offering: "Mycelium platforms (MycoComposite™ / Forager™)",
      relevance: "Mushroom bio-material platform referenced in the wiki",
    },
    {
      name: "Notpla",
      category: "Seaweed / algae materials",
      region: "UK",
      offering: "Seaweed-based films and coatings",
      relevance: "Algae-derived film and barrier candidate",
    },
    {
      name: "CelluForce",
      category: "Cellulose nanomaterials",
      region: "Canada",
      offering: "Cellulose nanocrystals (CNC)",
      relevance: "Nanofibril reinforcement for structural strength",
    },
  ];

  // Draft, open-source (CC BY-SA 4.0) process specifications. None pilot-validated.
  const manufacturingBlueprints = [
    {
      name: "Feedstock Intake & Sorting Line",
      scope: "Receiving, NIR sorting, density separation, and batch tracking of mixed recovered plastics.",
      inputs: "Mixed recovered plastics, ocean-bound bales",
      outputs: "Graded single-polymer streams",
      equipment: "NIR sorter, float-sink tank, shredder, baler",
      status: "Draft spec — not pilot-validated",
    },
    {
      name: "Depolymerization & Purification",
      scope: "Enzymatic / chemical breakdown of sorted polymers into purified monomers or oligomers.",
      inputs: "Graded polymer streams",
      outputs: "Purified monomers / recyclate",
      equipment: "Reactor train, filtration, distillation/wash stages",
      status: "Draft spec — not pilot-validated",
    },
    {
      name: "Bio-Polymer Compounding",
      scope: "Blending recyclate with plant-based biopolymers and reinforcement into a feedstock pellet.",
      inputs: "Recyclate, PLA/PHA/starch biopolymers, cellulose nanofibrils",
      outputs: "Compounded composite pellets",
      equipment: "Twin-screw extruder, pelletiser, dryer",
      status: "Draft spec — not pilot-validated",
    },
    {
      name: "Hydrogel Matrix & Dip-Forming",
      scope: "Forming the biocompatible hydrogel composite into thin-wall barrier products.",
      inputs: "Composite pellets, hydrogel precursors",
      outputs: "Formed barrier units",
      equipment: "Dip-forming mandrels, curing oven, controlled-humidity line",
      status: "Draft spec — not pilot-validated",
    },
    {
      name: "Tooling, Moulds & Quality Control",
      scope: "Custom anatomical moulds plus inline mechanical and biocompatibility QC.",
      inputs: "Sizing data (Inclusive Ordering Framework), formed units",
      outputs: "Finished, QC-passed product + batch records",
      equipment: "CNC mould tooling, burst/tensile rig, sampling station",
      status: "Draft spec — not pilot-validated",
    },
  ];

  // Proposed partnership frameworks only. No partners signed.
  const partnershipModels = [
    {
      name: "Open-Source Blueprint Licence (CC BY-SA 4.0)",
      how: "Any fabricator may adopt the published process blueprints under share-alike terms; improvements flow back to the commons.",
      brings: "TriSex.org provides specs & QC criteria; partner provides facility & labour.",
      status: "Proposed — no licensees yet",
    },
    {
      name: "Toll / Contract Manufacturing",
      how: "A certified contract manufacturer runs validation batches against the spec sheets. TriSex.org owns the design; the partner owns the line.",
      brings: "TriSex.org provides the design & order pipeline; partner provides regulated production capacity.",
      status: "Proposed — no manufacturer engaged",
    },
    {
      name: "Cooperative Feedstock Supply (LETS-aligned)",
      how: "Recovered-plastic and biopolymer suppliers join a mutual-credit cooperative, settling partly through the LETS Framework rather than cash.",
      brings: "Suppliers provide traceable feedstock; the co-op provides mutual-credit settlement & demand aggregation.",
      status: "Proposed — no suppliers enrolled",
    },
    {
      name: "University R&D Consortium",
      how: "Joint research agreement with materials-science labs to lab-validate the blueprints and publish results openly.",
      brings: "Labs provide validation & instrumentation; TriSex.org provides specs, samples & open publication.",
      status: "Proposed — no consortium formed",
    },
    {
      name: "Regional Micro-Factory Commons",
      how: "Community-owned micro-factories produce locally under the shared blueprint, governed through the cooperator model.",
      brings: "Communities provide local production & stewardship; the commons provides blueprints & standards.",
      status: "Proposed — no sites established",
    },
  ];

  return (
    <div className="min-h-screen bg-surface py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Intersex Healthcare Affirmation */}
        <Alert className="mb-8 bg-white dark:bg-gray-950 border-2 border-black dark:border-white">
          <Heart className="h-5 w-5 text-black dark:text-white" />
          <AlertDescription className="ml-2 text-black dark:text-white">
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
          <TabsList className="grid w-full grid-cols-5">
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
            <TabsTrigger value="sourcing" className="flex items-center gap-2">
              <Handshake className="h-4 w-4" />
              Sourcing & Partners
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

          <TabsContent value="sourcing" className="space-y-8">
            <Alert className="border-2 border-amber-500 bg-amber-50 dark:bg-amber-950/30">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              <AlertDescription className="ml-2 text-amber-900 dark:text-amber-100">
                <strong>Operational status — please read.</strong> No supplier has been contacted, no manufacturing partner has signed on, and none of the blueprints below have been pilot-validated. Everything here is honest planning material: a research shortlist, draft open-source process specifications (CC BY-SA 4.0), and proposed partnership frameworks. Company names are publicly verifiable candidates only — listing them does not imply any relationship or endorsement.
              </AlertDescription>
            </Alert>

            <Card>
              <CardHeader>
                <CardTitle className="font-recoleta flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  Potential Suppliers
                </CardTitle>
                <p className="text-muted-foreground">
                  Publicly verifiable research candidates across feedstock, biopolymers, and processing. Each is a shortlist entry only — none have been contacted.
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {supplierCandidates.map((s, i) => (
                    <div
                      key={s.name}
                      className="p-4 border rounded-lg space-y-2"
                      data-testid={`card-supplier-${i}`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-medium">{s.name}</h4>
                        <Badge variant="outline" className="text-amber-700 border-amber-400 whitespace-nowrap">
                          Not contacted
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">{s.category} · {s.region}</div>
                      <p className="text-sm"><span className="font-medium">Offers:</span> {s.offering}</p>
                      <p className="text-sm text-muted-foreground"><span className="font-medium">Relevance:</span> {s.relevance}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-recoleta flex items-center gap-2">
                  <ClipboardList className="h-5 w-5 text-primary" />
                  Manufacturing Blueprints
                </CardTitle>
                <p className="text-muted-foreground">
                  Draft, open-source (CC BY-SA 4.0) process specifications. None are pilot-validated yet.
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {manufacturingBlueprints.map((b, i) => (
                  <div
                    key={b.name}
                    className="p-4 border rounded-lg space-y-2"
                    data-testid={`card-blueprint-${i}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-medium flex items-center gap-2">
                        <FileText className="h-4 w-4 text-primary" />
                        Blueprint {i + 1}: {b.name}
                      </h4>
                      <Badge variant="outline" className="text-amber-700 border-amber-400 whitespace-nowrap">
                        {b.status}
                      </Badge>
                    </div>
                    <p className="text-sm">{b.scope}</p>
                    <div className="grid sm:grid-cols-3 gap-2 text-xs text-muted-foreground">
                      <div><span className="font-medium">Inputs:</span> {b.inputs}</div>
                      <div><span className="font-medium">Outputs:</span> {b.outputs}</div>
                      <div><span className="font-medium">Key equipment:</span> {b.equipment}</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-recoleta flex items-center gap-2">
                  <Handshake className="h-5 w-5 text-primary" />
                  Business Partnership Models
                </CardTitle>
                <p className="text-muted-foreground">
                  Proposed frameworks for how TriSex.org could work with suppliers and fabricators. No partners are signed.
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {partnershipModels.map((m, i) => (
                  <div
                    key={m.name}
                    className="p-4 border rounded-lg space-y-2"
                    data-testid={`card-partnership-${i}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-medium">{m.name}</h4>
                      <Badge variant="outline" className="text-amber-700 border-amber-400 whitespace-nowrap">
                        {m.status}
                      </Badge>
                    </div>
                    <p className="text-sm">{m.how}</p>
                    <p className="text-sm text-muted-foreground"><span className="font-medium">Who brings what:</span> {m.brings}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}