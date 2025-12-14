import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Leaf, 
  Droplets, 
  Heart,
  Microscope,
  FlaskConical,
  Thermometer,
  Clock,
  Zap,
  Target,
  Activity,
  ChevronRight,
  CheckCircle,
  AlertTriangle,
  Info,
  Atom,
  Cpu,
  Brain,
  Layers,
  Sparkles
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function NaturalLubricants() {
  const [selectedIngredient, setSelectedIngredient] = useState("aloe_vera");
  const [activeFormulation, setActiveFormulation] = useState("intimate_comfort");

  const naturalIngredients = {
    aloe_vera: {
      name: "Aloe Vera Gel",
      scientificName: "Aloe barbadensis miller",
      primaryFunction: "Moisturizing & Soothing",
      concentration: "15-25%",
      properties: ["Anti-inflammatory", "Antimicrobial", "Healing", "pH balancing"],
      interactions: {
        synergistic: ["Hyaluronic acid", "Coconut oil", "Vitamin E"],
        neutral: ["Xanthan gum", "Glycerin"],
        avoid: ["Strong acids", "Alcohol-based preservatives"]
      },
      bioactiveCompounds: [
        { name: "Acemannan", function: "Immune system support", concentration: "0.1-0.3%" },
        { name: "Salicylic acid", function: "Anti-inflammatory", concentration: "0.05-0.1%" },
        { name: "Amino acids", function: "Tissue repair", concentration: "2-4%" }
      ],
      mechanismOfAction: "Polysaccharides form protective gel layer while glycoproteins reduce inflammation and promote healing",
      pHRange: "4.0-6.0",
      viscosity: "Medium",
      shelfLife: "12-18 months"
    },
    coconut_oil: {
      name: "Fractionated Coconut Oil",
      scientificName: "Cocos nucifera",
      primaryFunction: "Long-lasting Lubrication",
      concentration: "20-35%",
      properties: ["Antimicrobial", "Moisturizing", "Long-lasting", "Natural preservative"],
      interactions: {
        synergistic: ["Aloe vera", "Shea butter", "Jojoba oil"],
        neutral: ["Lecithin", "Tocopherol"],
        avoid: ["Latex condoms", "Silicone-based products"]
      },
      bioactiveCompounds: [
        { name: "Lauric acid", function: "Antimicrobial activity", concentration: "45-50%" },
        { name: "Caprylic acid", function: "Antifungal properties", concentration: "7-10%" },
        { name: "Capric acid", function: "Antibacterial action", concentration: "5-8%" }
      ],
      mechanismOfAction: "Medium-chain fatty acids disrupt microbial cell membranes while providing sustained lubrication",
      pHRange: "5.5-7.0",
      viscosity: "Low-Medium",
      shelfLife: "24+ months"
    },
    hyaluronic_acid: {
      name: "Hyaluronic Acid",
      scientificName: "Sodium hyaluronate",
      primaryFunction: "Deep Hydration & Elasticity",
      concentration: "0.1-1.0%",
      properties: ["Intense hydration", "Tissue plumping", "Wound healing", "Biocompatible"],
      interactions: {
        synergistic: ["Aloe vera", "Glycerin", "Panthenol"],
        neutral: ["Most plant oils", "Natural preservatives"],
        avoid: ["High salt concentrations", "Extreme pH"]
      },
      bioactiveCompounds: [
        { name: "High MW HA", function: "Surface hydration", concentration: "0.05-0.2%" },
        { name: "Low MW HA", function: "Deep penetration", concentration: "0.01-0.1%" },
        { name: "Cross-linked HA", function: "Extended release", concentration: "0.1-0.5%" }
      ],
      mechanismOfAction: "Binds up to 1000x its weight in water, creating viscoelastic gel matrix",
      pHRange: "6.0-7.5",
      viscosity: "High",
      shelfLife: "18-24 months"
    },
    shea_butter: {
      name: "Shea Butter",
      scientificName: "Vitellaria paradoxa",
      primaryFunction: "Protective Barrier & Nourishment",
      concentration: "10-20%",
      properties: ["Barrier protection", "Anti-inflammatory", "Healing", "Rich texture"],
      interactions: {
        synergistic: ["Coconut oil", "Jojoba oil", "Vitamin E"],
        neutral: ["Aloe vera", "Glycerin"],
        avoid: ["Tree nut allergies", "High heat processing"]
      },
      bioactiveCompounds: [
        { name: "Cinnamic esters", function: "UV protection", concentration: "3-5%" },
        { name: "Triterpenes", function: "Anti-inflammatory", concentration: "1-3%" },
        { name: "Oleic acid", function: "Penetration enhancer", concentration: "40-45%" }
      ],
      mechanismOfAction: "Forms occlusive barrier while triterpenes modulate inflammatory pathways",
      pHRange: "5.0-6.5",
      viscosity: "High",
      shelfLife: "18-24 months"
    },
    jojoba_oil: {
      name: "Jojoba Oil",
      scientificName: "Simmondsia chinensis",
      primaryFunction: "Biomimetic Moisturization",
      concentration: "5-15%",
      properties: ["Skin-identical", "Non-comedogenic", "Stable", "Lightweight"],
      interactions: {
        synergistic: ["Shea butter", "Coconut oil", "Vitamin E"],
        neutral: ["Hyaluronic acid", "Aloe vera"],
        avoid: ["None known"]
      },
      bioactiveCompounds: [
        { name: "Wax esters", function: "Skin barrier mimicry", concentration: "95-98%" },
        { name: "Tocopherols", function: "Antioxidant protection", concentration: "0.1-0.3%" },
        { name: "Sterols", function: "Anti-inflammatory", concentration: "0.2-0.5%" }
      ],
      mechanismOfAction: "Wax esters identical to human sebum integrate seamlessly with skin lipids",
      pHRange: "Neutral",
      viscosity: "Low",
      shelfLife: "36+ months"
    }
  };

  const formulations = {
    intimate_comfort: {
      name: "Intimate Comfort Formula",
      targetUse: "General intimate lubrication",
      consistency: "Smooth gel",
      durability: "Medium (30-45 minutes)",
      ingredients: [
        { ingredient: "aloe_vera", percentage: 20, role: "Base hydration" },
        { ingredient: "hyaluronic_acid", percentage: 0.5, role: "Deep moisturizing" },
        { ingredient: "coconut_oil", percentage: 15, role: "Lubrication" },
        { ingredient: "jojoba_oil", percentage: 8, role: "Skin integration" },
        { ingredient: "natural_preservatives", percentage: 1.5, role: "Stability" }
      ],
      pHTarget: "4.5-5.5",
      osmolality: "280-320 mOsm/kg",
      biocompatibility: "Vaginal pH matched",
      specialFeatures: ["Self-lubricating", "Non-sticky", "Paraben-free"]
    },
    sensitive_care: {
      name: "Sensitive Care Formula",
      targetUse: "Sensitive skin & post-treatment care",
      consistency: "Light cream",
      durability: "Long-lasting (60+ minutes)",
      ingredients: [
        { ingredient: "aloe_vera", percentage: 25, role: "Soothing base" },
        { ingredient: "shea_butter", percentage: 12, role: "Barrier protection" },
        { ingredient: "hyaluronic_acid", percentage: 1, role: "Healing support" },
        { ingredient: "jojoba_oil", percentage: 10, role: "Gentle moisturizing" },
        { ingredient: "panthenol", percentage: 2, role: "Tissue repair" }
      ],
      pHTarget: "5.0-6.0",
      osmolality: "290-330 mOsm/kg",
      biocompatibility: "Hypoallergenic tested",
      specialFeatures: ["Anti-inflammatory", "Healing support", "Fragrance-free"]
    },
    enhanced_pleasure: {
      name: "Enhanced Pleasure Formula",
      targetUse: "Extended intimate activities",
      consistency: "Silky gel",
      durability: "Extended (45-75 minutes)",
      ingredients: [
        { ingredient: "coconut_oil", percentage: 25, role: "Long-lasting slip" },
        { ingredient: "hyaluronic_acid", percentage: 0.8, role: "Enhanced sensation" },
        { ingredient: "aloe_vera", percentage: 18, role: "Comfort base" },
        { ingredient: "shea_butter", percentage: 8, role: "Rich texture" },
        { ingredient: "natural_warming", percentage: 1, role: "Gentle warmth" }
      ],
      pHTarget: "4.8-5.8",
      osmolality: "300-350 mOsm/kg",
      biocompatibility: "Extended use tested",
      specialFeatures: ["Long-lasting", "Enhanced sensation", "Warming effect"]
    }
  };

  const interdependencyMechanisms = [
    {
      title: "Synergistic Hydration Network",
      description: "Multiple hydrating agents work together to create layered moisture retention",
      participants: ["Aloe vera", "Hyaluronic acid", "Glycerin"],
      mechanism: "Aloe vera provides immediate surface hydration, hyaluronic acid creates deep tissue moisture binding, while glycerin acts as a humectant drawing atmospheric moisture",
      effect: "Enhanced hydration lasting 3-4x longer than single ingredients",
      visualization: 85
    },
    {
      title: "Antimicrobial Compound Cascade",
      description: "Natural antimicrobial compounds create broad-spectrum protection",
      participants: ["Coconut oil fatty acids", "Aloe vera acemannan", "Natural preservatives"],
      mechanism: "Lauric acid disrupts bacterial membranes, acemannan modulates immune response, while natural preservatives prevent opportunistic growth",
      effect: "Comprehensive microbial protection without harsh chemicals",
      visualization: 78
    },
    {
      title: "pH Buffering System",
      description: "Natural compounds work together to maintain optimal vaginal pH",
      participants: ["Aloe vera", "Lactic acid", "Natural buffer systems"],
      mechanism: "Aloe vera provides weak acid buffering, lactic acid maintains acidic environment, while amino acids create stable pH range",
      effect: "Maintains healthy vaginal microbiome and prevents infections",
      visualization: 92
    },
    {
      title: "Viscosity Modulation Matrix",
      description: "Different molecular weights create optimal texture and slip",
      participants: ["Hyaluronic acid", "Natural gums", "Oil phases"],
      mechanism: "High MW HA provides structure, low MW HA enhances penetration, while oil phases reduce friction through different shear rates",
      effect: "Adaptive texture that responds to movement and pressure",
      visualization: 88
    }
  ];

  const biocompatibilityFactors = [
    {
      factor: "Osmolality Balance",
      importance: "Critical",
      description: "Matching vaginal tissue osmolality prevents cellular damage",
      optimalRange: "280-380 mOsm/kg",
      naturalSolution: "Balanced electrolytes from plant extracts and controlled water activity"
    },
    {
      factor: "pH Compatibility",
      importance: "Essential",
      description: "Maintaining acidic pH supports beneficial bacteria",
      optimalRange: "3.8-5.0",
      naturalSolution: "Organic acids from fermentation and natural fruit acids"
    },
    {
      factor: "Microbiome Support",
      importance: "High",
      description: "Preserving beneficial lactobacilli while preventing pathogens",
      optimalRange: "Selective antimicrobial activity",
      naturalSolution: "Prebiotic compounds and selective natural antimicrobials"
    },
    {
      factor: "Non-Irritating Formula",
      importance: "Essential",
      description: "Avoiding inflammatory responses in sensitive tissues",
      optimalRange: "Zero inflammatory markers",
      naturalSolution: "Anti-inflammatory plant compounds and hypoallergenic testing"
    }
  ];

  const selectedIngredientData = naturalIngredients[selectedIngredient as keyof typeof naturalIngredients];
  const selectedFormulationData = formulations[activeFormulation as keyof typeof formulations];

  return (
    <div className="min-h-screen bg-surface py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Intersex Healthcare Affirmation */}
        <Alert className="mb-8 bg-white dark:bg-gray-950 border-2 border-black dark:border-white">
          <Heart className="h-5 w-5 text-black dark:text-white" />
          <AlertDescription className="ml-2 text-black dark:text-white">
            <strong>Intersex Healthcare IS Everyone's Affirmation:</strong> Natural lubricant formulations center intersex anatomy as the universal baseline—trans, non-binary, genderqueer, and quare embodiment are all respected within this participatory budgeting framework. There is no separate "transgender healthcare" category—all NanoHeal products serve ALL bodies by design.
          </AlertDescription>
        </Alert>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground font-recoleta mb-4">
            Nanotechnology-Enhanced Natural Sexual Lubricants
          </h1>
          <p className="text-xl text-muted-foreground font-coolvetica">
            Revolutionary plant-based formulations enhanced with advanced nanoparticle delivery systems for superior performance, safety, and biocompatibility
          </p>
        </div>

        <Tabs defaultValue="nanotech-integration" className="space-y-8">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="nanotech-integration" className="flex items-center gap-2">
              <Atom className="h-4 w-4" />
              Nanotech
            </TabsTrigger>
            <TabsTrigger value="interdependency" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Synergy
            </TabsTrigger>
            <TabsTrigger value="ingredients" className="flex items-center gap-2">
              <Leaf className="h-4 w-4" />
              Natural Base
            </TabsTrigger>
            <TabsTrigger value="formulations" className="flex items-center gap-2">
              <FlaskConical className="h-4 w-4" />
              Formulations
            </TabsTrigger>
            <TabsTrigger value="biocompatibility" className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Safety
            </TabsTrigger>
            <TabsTrigger value="manufacturing" className="flex items-center gap-2">
              <Microscope className="h-4 w-4" />
              Production
            </TabsTrigger>
            <TabsTrigger value="commercial" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Market
            </TabsTrigger>
          </TabsList>

          <TabsContent value="nanotech-integration" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-recoleta flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-blue-600" />
                  Nanotechnology-Enhanced Natural Lubricants
                </CardTitle>
                <p className="text-muted-foreground">
                  Advanced nanoparticle delivery systems integrated with biocompatible plant compounds for superior performance
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid lg:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <div className="border rounded-lg p-6">
                      <h3 className="text-lg font-semibold mb-4 flex items-center">
                        <Atom className="h-5 w-5 mr-2 text-purple-600" />
                        Nanoparticle Enhancement Systems
                      </h3>
                      
                      <div className="space-y-4">
                        <div className="bg-purple-50 p-4 rounded-lg">
                          <h4 className="font-medium mb-2">Liposomal Delivery (50-200nm)</h4>
                          <p className="text-sm text-purple-800 mb-2">
                            Phospholipid vesicles encapsulating active compounds for enhanced penetration and sustained release
                          </p>
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span>Encapsulation Efficiency</span>
                              <span>92-98%</span>
                            </div>
                            <Progress value={95} className="h-1" />
                          </div>
                        </div>

                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h4 className="font-medium mb-2">Solid Lipid Nanoparticles (100-500nm)</h4>
                          <p className="text-sm text-blue-800 mb-2">
                            Biocompatible lipid carriers providing controlled release of hydrophobic plant compounds
                          </p>
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span>Release Duration</span>
                              <span>4-8 hours</span>
                            </div>
                            <Progress value={75} className="h-1" />
                          </div>
                        </div>

                        <div className="bg-green-50 p-4 rounded-lg">
                          <h4 className="font-medium mb-2">Chitosan Nanoparticles (20-100nm)</h4>
                          <p className="text-sm text-green-800 mb-2">
                            Natural polymer carriers with antimicrobial properties and mucoadhesive capabilities
                          </p>
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span>Mucoadhesion Strength</span>
                              <span>85%</span>
                            </div>
                            <Progress value={85} className="h-1" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="border rounded-lg p-6">
                      <h3 className="text-lg font-semibold mb-4 flex items-center">
                        <Brain className="h-5 w-5 mr-2 text-teal-600" />
                        Smart Responsive Systems
                      </h3>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-teal-50 rounded">
                          <div>
                            <span className="font-medium text-sm">pH-Responsive Release</span>
                            <p className="text-xs text-teal-700">Triggers at optimal vaginal pH (4.0-4.5)</p>
                          </div>
                          <Badge className="bg-teal-100 text-teal-800">Active</Badge>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 bg-orange-50 rounded">
                          <div>
                            <span className="font-medium text-sm">Temperature-Activated</span>
                            <p className="text-xs text-orange-700">Responds to body temperature (37°C)</p>
                          </div>
                          <Badge className="bg-orange-100 text-orange-800">Active</Badge>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 bg-indigo-50 rounded">
                          <div>
                            <span className="font-medium text-sm">Shear-Thinning Behavior</span>
                            <p className="text-xs text-indigo-700">Reduces viscosity during movement</p>
                          </div>
                          <Badge className="bg-indigo-100 text-indigo-800">Active</Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="border rounded-lg p-6">
                      <h3 className="text-lg font-semibold mb-4 flex items-center">
                        <Layers className="h-5 w-5 mr-2 text-amber-600" />
                        Multi-Layer Enhancement Matrix
                      </h3>
                      
                      <div className="space-y-4">
                        <div className="relative">
                          <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-blue-400 to-green-400"></div>
                          <div className="space-y-4 ml-8">
                            <div className="bg-blue-100 p-3 rounded-lg relative">
                              <div className="absolute -left-6 top-3 w-3 h-3 bg-blue-400 rounded-full"></div>
                              <h4 className="font-medium text-blue-800">Surface Layer (0-10μm)</h4>
                              <p className="text-xs text-blue-700">Immediate lubrication + antimicrobial nanoparticles</p>
                            </div>
                            
                            <div className="bg-purple-100 p-3 rounded-lg relative">
                              <div className="absolute -left-6 top-3 w-3 h-3 bg-purple-400 rounded-full"></div>
                              <h4 className="font-medium text-purple-800">Intermediate Layer (10-50μm)</h4>
                              <p className="text-xs text-purple-700">Sustained release + hydrating nanocarriers</p>
                            </div>
                            
                            <div className="bg-green-100 p-3 rounded-lg relative">
                              <div className="absolute -left-6 top-3 w-3 h-3 bg-green-400 rounded-full"></div>
                              <h4 className="font-medium text-green-800">Deep Layer (50-200μm)</h4>
                              <p className="text-xs text-green-700">Tissue repair + long-term moisturization</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="border rounded-lg p-6">
                      <h3 className="text-lg font-semibold mb-4 flex items-center">
                        <Cpu className="h-5 w-5 mr-2 text-red-600" />
                        Bioactive Nanocarriers
                      </h3>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-red-50 p-3 rounded text-center">
                          <div className="text-lg font-bold text-red-700">15-25nm</div>
                          <div className="text-xs text-red-600">Vitamin E carriers</div>
                        </div>
                        <div className="bg-pink-50 p-3 rounded text-center">
                          <div className="text-lg font-bold text-pink-700">30-80nm</div>
                          <div className="text-xs text-pink-600">Hyaluronic acid complexes</div>
                        </div>
                        <div className="bg-yellow-50 p-3 rounded text-center">
                          <div className="text-lg font-bold text-yellow-700">50-150nm</div>
                          <div className="text-xs text-yellow-600">Plant extract vesicles</div>
                        </div>
                        <div className="bg-cyan-50 p-3 rounded text-center">
                          <div className="text-lg font-bold text-cyan-700">100-300nm</div>
                          <div className="text-xs text-cyan-600">Probiotic carriers</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg">
                  <h3 className="text-xl font-bold mb-4">Revolutionary Performance Enhancement</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold">500%</div>
                      <div className="text-sm opacity-90">Longer lasting lubrication</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold">85%</div>
                      <div className="text-sm opacity-90">Better bioactive delivery</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold">95%</div>
                      <div className="text-sm opacity-90">User satisfaction increase</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="interdependency" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-recoleta">Synergistic Interaction Networks</CardTitle>
                <p className="text-muted-foreground">
                  Natural ingredients create complex interdependent systems that enhance safety, efficacy, and user experience
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {interdependencyMechanisms.map((mechanism, index) => (
                    <div key={index} className="border rounded-lg p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">{mechanism.title}</h3>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-muted-foreground">Synergy Level</span>
                          <Progress value={mechanism.visualization} className="w-24 h-2" />
                          <span className="text-sm font-medium">{mechanism.visualization}%</span>
                        </div>
                      </div>
                      
                      <p className="text-muted-foreground">{mechanism.description}</p>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-2">Key Participants:</h4>
                          <div className="flex flex-wrap gap-2">
                            {mechanism.participants.map((participant, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {participant}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Primary Effect:</h4>
                          <p className="text-sm text-green-700 bg-green-50 p-2 rounded">
                            {mechanism.effect}
                          </p>
                        </div>
                      </div>
                      
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-medium mb-2 flex items-center">
                          <Info className="h-4 w-4 mr-2 text-blue-600" />
                          Mechanism of Action
                        </h4>
                        <p className="text-sm text-blue-800">{mechanism.mechanism}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ingredients" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="font-recoleta">Select Ingredient</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {Object.entries(naturalIngredients).map(([key, ingredient]) => (
                    <Button
                      key={key}
                      onClick={() => setSelectedIngredient(key)}
                      variant={selectedIngredient === key ? "default" : "ghost"}
                      className="w-full justify-start p-3 h-auto"
                    >
                      <div className="text-left">
                        <div className="font-medium">{ingredient.name}</div>
                        <div className="text-sm text-muted-foreground">{ingredient.primaryFunction}</div>
                      </div>
                    </Button>
                  ))}
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="font-recoleta">{selectedIngredientData.name}</CardTitle>
                  <p className="text-muted-foreground italic">{selectedIngredientData.scientificName}</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="font-medium">Primary Function</h4>
                      <p className="text-sm">{selectedIngredientData.primaryFunction}</p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium">Typical Concentration</h4>
                      <p className="text-sm font-mono">{selectedIngredientData.concentration}</p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium">pH Range</h4>
                      <p className="text-sm font-mono">{selectedIngredientData.pHRange}</p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium">Shelf Life</h4>
                      <p className="text-sm">{selectedIngredientData.shelfLife}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium">Key Properties</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedIngredientData.properties.map((property, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {property}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium">Bioactive Compounds</h4>
                    <div className="space-y-2">
                      {selectedIngredientData.bioactiveCompounds.map((compound, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div>
                            <span className="font-medium text-sm">{compound.name}</span>
                            <span className="text-xs text-muted-foreground ml-2">({compound.concentration})</span>
                          </div>
                          <span className="text-xs text-muted-foreground">{compound.function}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Mechanism of Action</h4>
                    <p className="text-sm text-green-800">{selectedIngredientData.mechanismOfAction}</p>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <h4 className="font-medium text-green-700 mb-2">Synergistic With</h4>
                      <div className="space-y-1">
                        {selectedIngredientData.interactions.synergistic.map((item, idx) => (
                          <div key={idx} className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-blue-700 mb-2">Neutral With</h4>
                      <div className="space-y-1">
                        {selectedIngredientData.interactions.neutral.map((item, idx) => (
                          <div key={idx} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-red-700 mb-2">Avoid With</h4>
                      <div className="space-y-1">
                        {selectedIngredientData.interactions.avoid.map((item, idx) => (
                          <div key={idx} className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="formulations" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="font-recoleta">Select Formulation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {Object.entries(formulations).map(([key, formulation]) => (
                    <Button
                      key={key}
                      onClick={() => setActiveFormulation(key)}
                      variant={activeFormulation === key ? "default" : "ghost"}
                      className="w-full justify-start p-3 h-auto"
                    >
                      <div className="text-left">
                        <div className="font-medium">{formulation.name}</div>
                        <div className="text-sm text-muted-foreground">{formulation.targetUse}</div>
                      </div>
                    </Button>
                  ))}
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="font-recoleta">{selectedFormulationData.name}</CardTitle>
                  <p className="text-muted-foreground">{selectedFormulationData.targetUse}</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="font-medium">Consistency</h4>
                      <p className="text-sm">{selectedFormulationData.consistency}</p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium">Durability</h4>
                      <p className="text-sm">{selectedFormulationData.durability}</p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium">Target pH</h4>
                      <p className="text-sm font-mono">{selectedFormulationData.pHTarget}</p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium">Osmolality</h4>
                      <p className="text-sm font-mono">{selectedFormulationData.osmolality}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium">Ingredient Composition</h4>
                    <div className="space-y-3">
                      {selectedFormulationData.ingredients.map((ingredient, idx) => (
                        <div key={idx} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-sm capitalize">
                              {ingredient.ingredient.replace('_', ' ')}
                            </span>
                            <span className="text-sm font-mono">{ingredient.percentage}%</span>
                          </div>
                          <Progress value={ingredient.percentage} className="h-2" />
                          <p className="text-xs text-muted-foreground">{ingredient.role}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium">Special Features</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedFormulationData.specialFeatures.map((feature, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Biocompatibility Profile</h4>
                    <p className="text-sm text-purple-800">{selectedFormulationData.biocompatibility}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="biocompatibility" className="space-y-6">
            <div className="space-y-6">
              {biocompatibilityFactors.map((factor, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="font-recoleta">{factor.factor}</CardTitle>
                      <Badge className={
                        factor.importance === 'Critical' ? 'bg-red-100 text-red-800' :
                        factor.importance === 'Essential' ? 'bg-orange-100 text-orange-800' :
                        'bg-yellow-100 text-yellow-800'
                      }>
                        {factor.importance}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">{factor.description}</p>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <h4 className="font-medium">Optimal Range</h4>
                        <p className="text-sm font-mono bg-gray-100 p-2 rounded">{factor.optimalRange}</p>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium">Natural Solution</h4>
                        <p className="text-sm">{factor.naturalSolution}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="manufacturing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-recoleta">Sustainable Manufacturing Process</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-3">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <Leaf className="h-6 w-6 text-green-600" />
                    </div>
                    <h3 className="font-medium">Raw Material Sourcing</h3>
                    <p className="text-sm text-muted-foreground">
                      Organic, fair-trade plant materials with sustainable harvesting practices
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FlaskConical className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="font-medium">Cold Processing</h3>
                    <p className="text-sm text-muted-foreground">
                      Low-temperature extraction preserves bioactive compounds and prevents degradation
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <CheckCircle className="h-6 w-6 text-purple-600" />
                    </div>
                    <h3 className="font-medium">Quality Control</h3>
                    <p className="text-sm text-muted-foreground">
                      Multi-stage testing for purity, potency, and safety at every production step
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Heart className="h-6 w-6 text-orange-600" />
                    </div>
                    <h3 className="font-medium">User Safety</h3>
                    <p className="text-sm text-muted-foreground">
                      Dermatological testing and clinical trials ensure optimal biocompatibility
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg">
                  <h3 className="font-medium mb-4">Interdependent Quality Systems</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start space-x-3">
                      <ChevronRight className="h-4 w-4 text-green-600 mt-0.5" />
                      <span>Ingredient purity testing validates bioactive compound concentrations for optimal synergistic effects</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <ChevronRight className="h-4 w-4 text-blue-600 mt-0.5" />
                      <span>pH monitoring throughout production ensures final formulation matches vaginal compatibility requirements</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <ChevronRight className="h-4 w-4 text-purple-600 mt-0.5" />
                      <span>Viscosity testing confirms proper molecular interactions between hydrating and lubricating components</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <ChevronRight className="h-4 w-4 text-orange-600 mt-0.5" />
                      <span>Microbiological testing verifies antimicrobial efficacy while preserving beneficial properties</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="commercial" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="font-recoleta flex items-center gap-2">
                    <Target className="h-5 w-5 text-green-600" />
                    Commercial Production Strategy
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="border-l-4 border-green-500 pl-4">
                      <h3 className="font-semibold text-green-700 mb-2">Phase 1: R&D Completion (Months 1-6)</h3>
                      <ul className="text-sm space-y-1 text-green-600">
                        <li>• Finalize nanoparticle formulations with 95%+ bioavailability</li>
                        <li>• Complete clinical safety trials (n=500 participants)</li>
                        <li>• Optimize manufacturing scalability to 10,000 units/month</li>
                        <li>• Secure FDA/Health Canada regulatory approvals</li>
                      </ul>
                    </div>

                    <div className="border-l-4 border-blue-500 pl-4">
                      <h3 className="font-semibold text-blue-700 mb-2">Phase 2: Manufacturing Setup (Months 4-8)</h3>
                      <ul className="text-sm space-y-1 text-blue-600">
                        <li>• Establish GMP-certified nanotech production facility</li>
                        <li>• Install specialized liposomal encapsulation equipment</li>
                        <li>• Implement quality control systems for particle size analysis</li>
                        <li>• Train production team on nano-formulation protocols</li>
                      </ul>
                    </div>

                    <div className="border-l-4 border-purple-500 pl-4">
                      <h3 className="font-semibold text-purple-700 mb-2">Phase 3: Market Launch (Months 8-12)</h3>
                      <ul className="text-sm space-y-1 text-purple-600">
                        <li>• Launch direct-to-consumer online platform</li>
                        <li>• Partner with sexual health clinics and pharmacies</li>
                        <li>• Implement subscription delivery model</li>
                        <li>• Execute targeted digital marketing campaigns</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-3">Investment Requirements</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">R&D & Testing:</span>
                        <div className="text-green-700">$750,000</div>
                      </div>
                      <div>
                        <span className="font-medium">Manufacturing Setup:</span>
                        <div className="text-blue-700">$1,200,000</div>
                      </div>
                      <div>
                        <span className="font-medium">Regulatory & Compliance:</span>
                        <div className="text-purple-700">$300,000</div>
                      </div>
                      <div>
                        <span className="font-medium">Marketing & Launch:</span>
                        <div className="text-orange-700">$500,000</div>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="flex justify-between font-bold">
                        <span>Total Investment:</span>
                        <span className="text-xl text-green-700">$2,750,000</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="font-recoleta flex items-center gap-2">
                    <Zap className="h-5 w-5 text-orange-600" />
                    Revenue & Market Projections
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <h4 className="font-medium text-orange-800 mb-2">Product Line Pricing</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Basic Natural Formula (50ml)</span>
                          <span className="font-mono">$29.99</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Enhanced Nanotech Formula (50ml)</span>
                          <span className="font-mono">$49.99</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Premium Multi-Layer Formula (50ml)</span>
                          <span className="font-mono">$79.99</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Custom Formulation Service</span>
                          <span className="font-mono">$149.99</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-medium text-blue-800 mb-3">3-Year Revenue Forecast</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Year 1 Revenue</span>
                          <div className="text-right">
                            <div className="font-bold text-blue-700">$2.1M</div>
                            <div className="text-xs text-blue-600">35,000 units sold</div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Year 2 Revenue</span>
                          <div className="text-right">
                            <div className="font-bold text-blue-700">$8.5M</div>
                            <div className="text-xs text-blue-600">125,000 units sold</div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Year 3 Revenue</span>
                          <div className="text-right">
                            <div className="font-bold text-blue-700">$18.2M</div>
                            <div className="text-xs text-blue-600">275,000 units sold</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h4 className="font-medium text-purple-800 mb-2">Market Penetration Strategy</h4>
                      <div className="space-y-2 text-sm text-purple-700">
                        <div>• Target 2SLGBTIQA+ community with inclusive marketing</div>
                        <div>• Partner with sexual health clinics and educators</div>
                        <div>• Leverage sustainable materials messaging</div>
                        <div>• Emphasize scientific innovation and safety</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="font-recoleta">Manufacturing & Distribution Network</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-6">
                  <div className="text-center space-y-3">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                      <Leaf className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="font-medium">Raw Material Sourcing</h3>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div>Organic plant extracts</div>
                      <div>Pharmaceutical-grade nanoparticles</div>
                      <div>Sustainable packaging materials</div>
                    </div>
                  </div>

                  <div className="text-center space-y-3">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                      <FlaskConical className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="font-medium">Nano-Manufacturing</h3>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div>Liposomal encapsulation</div>
                      <div>Particle size optimization</div>
                      <div>Quality control testing</div>
                    </div>
                  </div>

                  <div className="text-center space-y-3">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle className="h-8 w-8 text-purple-600" />
                    </div>
                    <h3 className="font-medium">Quality Assurance</h3>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div>Biocompatibility testing</div>
                      <div>Stability studies</div>
                      <div>Regulatory compliance</div>
                    </div>
                  </div>

                  <div className="text-center space-y-3">
                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                      <Target className="h-8 w-8 text-orange-600" />
                    </div>
                    <h3 className="font-medium">Distribution</h3>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div>Direct-to-consumer</div>
                      <div>Healthcare partnerships</div>
                      <div>International expansion</div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 bg-gradient-to-r from-cyan-600 to-teal-600 text-white p-6 rounded-lg">
                  <h3 className="text-xl font-bold mb-4">Competitive Advantages</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5" />
                        <span>First-to-market nanotech enhancement</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5" />
                        <span>100% natural ingredient base</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5" />
                        <span>Sustainable packaging & production</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5" />
                        <span>Inclusive community focus</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5" />
                        <span>Clinical efficacy validation</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5" />
                        <span>Custom formulation capability</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-recoleta">Production Implementation Roadmap</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-lg">
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">1</div>
                    <div className="flex-1">
                      <h4 className="font-medium">Secure Funding & Partnerships</h4>
                      <p className="text-sm text-muted-foreground">Raise $2.75M through strategic investors focused on health tech innovation</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Ready</Badge>
                  </div>

                  <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">2</div>
                    <div className="flex-1">
                      <h4 className="font-medium">Establish Manufacturing Facility</h4>
                      <p className="text-sm text-muted-foreground">Set up GMP-certified production line with nano-encapsulation capabilities</p>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">6 months</Badge>
                  </div>

                  <div className="flex items-center space-x-4 p-4 bg-purple-50 rounded-lg">
                    <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">3</div>
                    <div className="flex-1">
                      <h4 className="font-medium">Complete Clinical Validation</h4>
                      <p className="text-sm text-muted-foreground">Conduct comprehensive safety and efficacy studies for regulatory approval</p>
                    </div>
                    <Badge className="bg-purple-100 text-purple-800">8 months</Badge>
                  </div>

                  <div className="flex items-center space-x-4 p-4 bg-orange-50 rounded-lg">
                    <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center text-white font-bold">4</div>
                    <div className="flex-1">
                      <h4 className="font-medium">Launch Commercial Production</h4>
                      <p className="text-sm text-muted-foreground">Begin full-scale manufacturing and direct-to-consumer sales</p>
                    </div>
                    <Badge className="bg-orange-100 text-orange-800">12 months</Badge>
                  </div>
                </div>

                <div className="mt-8 text-center">
                  <Button className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-8 py-3 text-lg">
                    Start Production Planning
                  </Button>
                  <p className="text-sm text-muted-foreground mt-2">
                    Ready to revolutionize intimate care with nanotechnology-enhanced natural lubricants
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}