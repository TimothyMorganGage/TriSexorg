import { useState } from "react";
import { BetaDisclaimer } from "@/components/BetaDisclaimer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  Search, 
  Users, 
  Shield,
  Heart,
  Droplets,
  Ruler,
  TestTube,
  Globe,
  Coins,
  CheckCircle,
  AlertTriangle,
  Info,
  Star,
  Target,
  Zap,
  ArrowLeft
} from "lucide-react";

interface WikiArticle {
  id: string;
  title: string;
  category: string;
  content: string;
  tags: string[];
  lastUpdated: string;
  author: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  readTime: string;
}

export default function Wiki() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedArticle, setSelectedArticle] = useState<WikiArticle | null>(null);

  const categories = [
    { id: "all", name: "All Topics", icon: BookOpen, count: 9 },
    { id: "sizing", name: "Custom Sizing", icon: Ruler, count: 1 },
    { id: "health", name: "Sexual Health", icon: Heart, count: 3 },
    { id: "sti", name: "STI Prevention", icon: Droplets, count: 1 },
    { id: "cooperative", name: "Cooperative Principles", icon: Users, count: 1 },
    { id: "technical", name: "Technical Guide", icon: TestTube, count: 2 },
    { id: "economic", name: "Economic Impact", icon: Coins, count: 1 }
  ];

  const wikiArticles: WikiArticle[] = [
    {
      id: "precision-sizing-guide",
      title: "fluck Precision Sizing: Complete Guide to 60+ Custom Fits",
      category: "sizing",
      content: `# Complete Custom Sizing Guide

## Introduction
fluck's precision sizing system delivers custom-fit protection for better love-making, expanding beyond traditional sizing limitations.

## The 60+ Size System

### Size Nomenclature
- **Letter System**: A through H (width categories)
- **Number System**: 1, 3, 5 (length categories)
- **Example**: C3 = Medium width, standard length

### Width Categories
- **A Series**: 45-47mm (Ultra snug)
- **B Series**: 47-49mm (Snug)
- **C Series**: 49-51mm (Standard)
- **D Series**: 51-53mm (Comfortable)
- **E Series**: 53-55mm (Roomy)
- **F Series**: 55-57mm (Extra roomy)
- **G Series**: 57-60mm (Ultra roomy)
- **H Series**: 60mm+ (Maximum)

### Length Categories
- **1 Series**: 160mm (Shorter)
- **3 Series**: 170mm (Standard)
- **5 Series**: 180mm (Longer)

## Measurement Best Practices

### Privacy-First Approach
1. All measurements processed locally
2. No data transmission during sizing
3. Optional 3D scanning for precision
4. User-controlled data retention

### Measurement Techniques
1. **Length**: Base to tip, top side, fully erect
2. **Base Girth**: Circumference at base
3. **Mid Girth**: Middle shaft circumference
4. **Head Girth**: Glans circumference

### Common Sizing Errors
- Measuring while not fully erect
- Not accounting for variation during arousal
- Ignoring girth variations along shaft
- Using inappropriate measuring tools

## Fit Optimization

### Fit Categories
- **Snug**: Minimal movement, maximum security
- **Standard**: Balanced comfort and security
- **Relaxed**: Easy application, comfortable wear

### Size Verification
1. Test fit with sample sizes
2. Verify comfort during movement
3. Check for proper retention
4. Ensure adequate sensitivity

## Inclusive Sizing Philosophy

### Body Diversity Recognition
- All anatomies accommodated
- No "standard" assumptions
- Intersex-inclusive sizing
- Post-surgical considerations

### Cultural Sensitivity
- Respectful terminology
- Privacy considerations
- Community-specific needs
- Religious/cultural requirements`,
      tags: ["sizing", "measurement", "precision", "custom-fit", "inclusive", "love-making"],
      lastUpdated: "2024-01-15",
      author: "fluck Health Team",
      difficulty: "Beginner",
      readTime: "12 min"
    },
    {
      id: "4d-sti-intervention",
      title: "4D STI Intervention: Bioregional Testing and Public Health",
      category: "sti",
      content: `# 4D STI Intervention System

## Overview
Revolutionary approach to STI prevention using bioregional sewer and water sampling for targeted public health interventions.

## The Four Dimensions

### 1. Geographic Dimension
- Zip code-level granularity
- County and state aggregation
- Urban vs rural distinctions
- Population density correlations

### 2. Temporal Dimension
- Real-time monitoring (24-hour cycles)
- Weekly trend analysis
- Seasonal pattern recognition
- Long-term epidemiological tracking

### 3. Biomarker Dimension
- Chlamydia DNA/RNA detection
- Gonorrhea genetic markers
- Syphilis bacterial indicators
- HIV viral load measurements
- HPV strain identification
- Herpes virus detection

### 4. Intervention Dimension
- Targeted education campaigns
- Mobile testing unit deployment
- Treatment resource allocation
- Prevention program optimization

## Technical Implementation

### Sample Collection
- Automated 24-hour composite sampling
- Temperature-controlled transport
- Chain of custody protocols
- Quality assurance testing

### Laboratory Analysis
- qPCR for DNA/RNA detection
- Mass spectrometry for compounds
- Next-generation sequencing
- Bioinformatics analysis pipelines

### Data Processing
- Population normalization algorithms
- Privacy-preserving analytics
- Machine learning trend detection
- Statistical significance testing

## Public Health Applications

### Early Warning Systems
- Outbreak prediction (7-14 days advance)
- Hotspot identification
- Trend reversal detection
- Resource demand forecasting

### Intervention Targeting
- Geographic precision
- Demographic specificity
- Risk factor correlation
- Cost-effectiveness optimization

### Policy Development
- Evidence-based recommendations
- Resource allocation guidance
- Prevention strategy validation
- Health equity considerations

## Privacy and Ethics

### Data Protection
- Aggregate-only reporting
- No individual identification
- Secure data transmission
- Limited access protocols

### Community Engagement
- Transparent methodology
- Public health benefit focus
- Community consent processes
- Cultural sensitivity training

### Ethical Oversight
- IRB approval requirements
- Community advisory boards
- Regular ethical review
- Harm prevention protocols`,
      tags: ["sti", "bioregional", "public-health", "intervention", "4d"],
      lastUpdated: "2024-01-14",
      author: "Public Health Research Team",
      difficulty: "Advanced",
      readTime: "18 min"
    },
    {
      id: "cooperative-health-principles",
      title: "Cooperative Sexual Health: Principles and Implementation",
      category: "cooperative",
      content: `# Cooperative Sexual Health Model

## International Cooperative Principles Applied to Health

### 1. Voluntary and Open Membership
- No discrimination based on anatomy, identity, or status
- Accessible membership regardless of economic position
- Clear, transparent enrollment processes
- Exit rights protected

### 2. Democratic Member Control
- One member, one vote governance
- Elected board representation
- Regular member assemblies
- Transparent decision-making processes

### 3. Member Economic Participation
- Equitable capital contributions
- Democratic control of capital
- Member dividend distribution
- Reserve fund maintenance

### 4. Autonomy and Independence
- Member-controlled organization
- Government/corporate independence
- Mission-aligned partnerships only
- Democratic accountability maintained

### 5. Education, Training, and Information
- Comprehensive sexual health education
- Member skill development
- Public awareness campaigns
- Evidence-based information sharing

### 6. Cooperation Among Cooperatives
- Inter-cooperative partnerships
- Shared resource development
- Collective advocacy efforts
- Movement strengthening activities

### 7. Concern for Community
- Sustainable development practices
- Environmental responsibility
- Social justice commitment
- Community health improvement

## BAD Co-op Integration

### "for GOOD Sex" - Sexual Health Advance Directives
- Autonomous decision-making tools
- Consent documentation systems
- Preference communication methods
- Emergency healthcare directives

### "for GOOD Health" - Cooperative Care Planning
- Member-directed health planning
- Collective resource sharing
- Mutual aid networks
- Democratic health governance

### "for Good People" - Community Matchmaking
- Cooperative relationship principles
- Consent-focused matching
- Community-supported connections
- Democratic relationship education

## Implementation Framework

### Governance Structure
- Member-elected board of directors
- Regional cooperative councils
- Special interest working groups
- Youth and elder advisory committees

### Economic Model
- Sliding scale membership fees
- Surplus distribution to members
- Community reinvestment programs
- Cooperative development fund

### Service Delivery
- Member-owned health centers
- Cooperative education programs
- Democratic service planning
- Community-controlled resources

### Quality Assurance
- Member satisfaction surveys
- Democratic quality control
- Continuous improvement processes
- Peer accountability systems`,
      tags: ["cooperative", "bad-coop", "governance", "community", "democracy"],
      lastUpdated: "2024-01-13",
      author: "Cooperative Development Team",
      difficulty: "Intermediate",
      readTime: "15 min"
    },
    {
      id: "daly-economic-impact",
      title: "DALY Tracking and Economic Impact on National Debt",
      category: "economic",
      content: `# DALY Tracking and Economic Impact Assessment

## Disability Adjusted Life Years (DALY) Overview

### DALY Definition
DALY = Years of Life Lost (YLL) + Years Lived with Disability (YLD)

### Calculation Components
- **YLL**: Premature mortality impact
- **YLD**: Morbidity and disability impact
- **Age weighting**: Optional age-specific adjustments
- **Discount rate**: Future value considerations

## fluck DALY Prevention Model

### STI-Specific DALY Calculations

#### Chlamydia Prevention
- **Average DALY per case**: 0.18
- **Cases prevented**: 71,374
- **Total DALYs saved**: 12,847

#### Gonorrhea Prevention
- **Average DALY per case**: 0.19
- **Cases prevented**: 46,983
- **Total DALYs saved**: 8,927

#### Syphilis Prevention
- **Average DALY per case**: 0.32
- **Cases prevented**: 48,851
- **Total DALYs saved**: 15,632

#### HIV Prevention
- **Average DALY per case**: 7.8
- **Cases prevented**: 3,006
- **Total DALYs saved**: 23,447

### Economic Valuation Methods

#### WHO Standard Valuation
- **Value per DALY**: $100,000 USD
- **US Healthcare Context**: $150,000 USD
- **fluck Conservative Estimate**: $125,000 USD

#### Total Economic Impact
- **DALYs Saved**: 79,822
- **Economic Value**: $11.5 billion annually
- **ROI on Prevention**: 8.4:1

## National Debt Impact Analysis

### Healthcare Cost Reduction
- **Direct treatment costs avoided**: $4.2B
- **Emergency care prevented**: $1.8B
- **Long-term care savings**: $2.1B
- **Productivity gains**: $3.4B

### Fiscal Impact
- **Federal budget relief**: $8.7B
- **State/local savings**: $2.8B
- **Total public savings**: $11.5B

### Debt Reduction Potential
- **Current national debt**: $33.8 trillion
- **Annual reduction**: $11.5B (0.034%)
- **10-year cumulative**: $115B
- **20-year projection**: $230B

## Measurement and Verification

### Data Sources
- CDC surveillance systems
- Healthcare claims databases
- Death certificate analysis
- Disability survey data

### Quality Assurance
- Peer review processes
- Statistical validation
- Sensitivity analysis
- Uncertainty quantification

### Reporting Standards
- Annual DALY reports
- Quarterly updates
- Public transparency
- Academic publication

## Policy Implications

### Prevention Investment
- Cost-effectiveness analysis
- Budget allocation guidance
- Program prioritization
- Resource optimization

### Healthcare Reform
- Value-based care models
- Prevention-focused funding
- Community health investment
- Health equity advancement`,
      tags: ["daly", "economics", "national-debt", "healthcare", "impact"],
      lastUpdated: "2024-01-12",
      author: "Economic Analysis Team",
      difficulty: "Advanced",
      readTime: "20 min"
    },
    {
      id: "3d-anatomy-scanning",
      title: "Privacy-Preserving 3D Anatomy Scanning Technology",
      category: "technical",
      content: `# 3D Anatomy Scanning System

## Technology Overview

### Scanning Methods
- **Structured light scanning**: High precision, safe
- **Photogrammetry**: Multi-angle image reconstruction
- **LiDAR integration**: Depth mapping accuracy
- **AI-assisted measurement**: Automated analysis

### Privacy-First Architecture

#### Local Processing
- All scanning performed on-device
- No cloud transmission required
- Encrypted local storage only
- User-controlled data retention

#### Data Minimization
- Measurement extraction only
- Image deletion post-processing
- Aggregate statistics collection
- No identifiable information stored

#### Security Measures
- End-to-end encryption
- Secure element storage
- Biometric authentication
- Regular security audits

## Scanning Process

### Preparation
1. Private scanning environment setup
2. Device calibration and testing
3. User consent and education
4. Quality assurance checks

### Scanning Procedure
1. **Initial positioning**: Standardized pose guidance
2. **Multi-angle capture**: 360-degree coverage
3. **Quality verification**: Real-time feedback
4. **Measurement extraction**: Automated processing

### Post-Processing
1. **3D model generation**: Point cloud to mesh
2. **Measurement calculation**: Precise dimensions
3. **Size recommendation**: Algorithm-based matching
4. **Data disposal**: Secure deletion of images

## Quality and Accuracy

### Precision Standards
- **Length accuracy**: ±1mm
- **Girth accuracy**: ±0.5mm
- **Repeatability**: 99.5% consistency
- **Calibration verification**: Regular testing

### Validation Studies
- Comparison with manual measurements
- Inter-device consistency testing
- User satisfaction assessment
- Clinical validation protocols

## Accessibility Features

### Universal Design
- Multiple scanning positions supported
- Mobility accommodation
- Visual/hearing impairment support
- Cultural sensitivity considerations

### Language Support
- Multi-language interfaces
- Cultural terminology respect
- Community-specific guidance
- Indigenous language inclusion

## Integration with Custom Fitting

### Size Calculation
- Advanced algorithmic matching
- Multiple fit preference options
- Comfort optimization
- Activity-specific recommendations

### Manufacturing Integration
- Direct-to-production workflows
- Quality control integration
- Batch processing efficiency
- Sustainable material optimization`,
      tags: ["3d-scanning", "privacy", "technology", "anatomy", "custom-fit"],
      lastUpdated: "2024-01-11",
      author: "Technology Development Team",
      difficulty: "Advanced",
      readTime: "16 min"
    },
    {
      id: "ocean-plastic-reprocessing",
      title: "Ocean Plastic Reprocessing with Plant-Based Materials",
      category: "technical",
      content: `# Ocean Plastic Reprocessing with Plant-Based Materials

## Overview
fluck's sustainable manufacturing process combines recycled ocean plastic with plant-based bio-materials to create high-performance, eco-friendly protection products.

## Ocean Plastic Collection and Processing

### Collection Methods
- **Coastal cleanup partnerships**: Direct beach and shoreline collection
- **Ocean trawling**: Specialized vessels collecting plastic debris
- **River interception**: Preventing ocean entry through river cleanup
- **Fishing industry partnerships**: Bycatch plastic recovery programs

### Plastic Types and Sources
- **PET bottles**: Primary source for film production
- **HDPE containers**: Structural components
- **PP packaging**: Flexible applications
- **Mixed ocean plastics**: Various consumer waste products

### Initial Processing Steps
1. **Sorting and identification**: Automated optical sorting by polymer type
2. **Cleaning and decontamination**: Multi-stage washing with eco-friendly detergents
3. **Shredding**: Mechanical reduction to flake form
4. **Density separation**: Float-sink tanks for purity enhancement
5. **Hot washing**: Final contaminant removal at controlled temperatures

## Plant-Based Material Integration

### Bio-Polymer Sources
- **Corn starch (PLA)**: Biodegradable plastic alternative
- **Sugarcane bagasse**: Renewable fiber reinforcement
- **Algae biomass**: Marine-derived bio-plastics
- **Cassava root**: Starch-based polymer matrix
- **Hemp fibers**: Natural strength enhancement

### Hybrid Material Creation
1. **Mechanical blending**: Physical mixing of recycled and bio-materials
2. **Chemical compatibilization**: Molecular bonding agents for adhesion
3. **Reactive processing**: In-situ polymerization during extrusion
4. **Nano-enhancement**: Plant-based nanocellulose reinforcement

## Manufacturing Process

### Extrusion and Film Formation
1. **Material preparation**: Precise blending ratios (70% ocean plastic, 30% plant-based)
2. **Melt processing**: Controlled temperature extrusion (180-220°C)
3. **Film casting**: Thin film production with uniform thickness
4. **Biaxial orientation**: Strength enhancement through stretching
5. **Corona treatment**: Surface modification for improved properties

### Quality Control Measures
- **Tensile strength testing**: Minimum 30 MPa requirement
- **Elongation at break**: >300% for flexibility
- **Barrier properties**: Moisture and air permeability testing
- **Biocompatibility**: ISO 10993 medical device standards
- **Biodegradability**: Controlled composting rate assessment

### Environmental Benefits
- **Carbon footprint reduction**: 60% lower than virgin plastic production
- **Ocean waste reduction**: 1 kg ocean plastic = 200 protection units
- **Renewable content**: 30% plant-based materials
- **End-of-life options**: Compostable in industrial facilities

## Material Properties and Performance

### Physical Characteristics
- **Density**: 1.2-1.4 g/cm³
- **Thickness**: 0.03-0.08 mm depending on application
- **Transparency**: High optical clarity maintained
- **Flexibility**: Superior stretch and recovery properties

### Safety and Biocompatibility
- **Cytotoxicity testing**: ISO 10993-5 compliant
- **Sensitization testing**: No allergenic responses
- **Irritation testing**: Dermal and mucosal compatibility
- **Extractables analysis**: No harmful substance migration

### Performance Validation
- **Burst pressure**: >2.5 kPa minimum
- **Shelf life**: 5 years under proper storage
- **Temperature stability**: -20°C to +60°C operating range
- **UV resistance**: Enhanced through plant-based antioxidants

## Innovation and Future Development

### Advanced Bio-Materials
- **Mushroom mycelium**: Emerging bio-plastic source
- **Bacterial cellulose**: Laboratory-grown fiber matrix
- **Protein-based polymers**: Animal-free protein films
- **Lignin recovery**: Wood waste valorization

### Circular Economy Integration
- **Take-back programs**: Product return for reprocessing
- **Local sourcing**: Regional ocean cleanup initiatives
- **Community partnerships**: Indigenous knowledge integration
- **Zero-waste manufacturing**: Complete material utilization

### Research and Development
- **Biomimetic design**: Nature-inspired material properties
- **Smart materials**: Responsive polymer development
- **Nanotechnology**: Enhanced performance characteristics
- **Life cycle optimization**: Cradle-to-cradle design principles`,
      tags: ["ocean-plastic", "plant-based", "sustainable", "manufacturing", "bio-materials"],
      lastUpdated: "2024-01-16",
      author: "Sustainability Engineering Team",
      difficulty: "Advanced",
      readTime: "22 min"
    },
    {
      id: "medical-optimization",
      title: "Medicines and Therapies for Optimal fluck Product Performance",
      category: "health",
      content: `# Medical Optimization for fluck Products

## Overview
Certain medications, therapies, and health conditions can affect the performance and compatibility of fluck protection products. This guide provides evidence-based recommendations for optimal effectiveness.

## Medication Interactions and Considerations

### Hormonal Medications

#### Estrogen-Based Therapies
- **Birth control pills**: May increase vaginal lubrication, improving comfort
- **Hormone replacement therapy (HRT)**: Can affect tissue elasticity and sensitivity
- **Recommendations**: Standard products typically work well; consider thinner options if increased sensitivity occurs

#### Testosterone Therapies
- **Topical testosterone**: May increase genital sensitivity and growth
- **Injectable testosterone**: Can affect tissue thickness and elasticity
- **Recommendations**: Regular size reassessment recommended; custom sizing beneficial

#### Progestin-Only Methods
- **Depo-Provera**: May cause vaginal dryness
- **IUDs (Mirena, Skyla)**: Localized hormone effects
- **Recommendations**: Compatible lubricants enhance comfort; hypoallergenic options preferred

### Antidepressants and Mood Medications

#### SSRIs (Selective Serotonin Reuptake Inhibitors)
- **Effects**: Reduced sexual sensation, delayed arousal
- **Examples**: Sertraline, fluoxetine, paroxetine
- **Recommendations**: Extended foreplay, additional lubrication, textured products for enhanced sensation

#### SNRIs (Serotonin-Norepinephrine Reuptake Inhibitors)
- **Effects**: Similar to SSRIs but may affect blood flow
- **Examples**: Venlafaxine, duloxetine
- **Recommendations**: Products with enhanced conductivity for sensation

#### Tricyclic Antidepressants
- **Effects**: Anticholinergic effects causing dryness
- **Recommendations**: Generous lubrication, longer warm-up period

### Blood Pressure Medications

#### ACE Inhibitors and ARBs
- **Effects**: Generally minimal impact on sexual function
- **Recommendations**: Standard products appropriate

#### Beta-Blockers
- **Effects**: May reduce blood flow and arousal response
- **Recommendations**: Extra lubrication, gentle application techniques

#### Diuretics
- **Effects**: Can cause dehydration affecting natural lubrication
- **Recommendations**: Increased hydration, water-based lubricants

### Antihistamines and Allergy Medications

#### H1 Receptor Antagonists
- **Effects**: Anticholinergic effects causing mucosal dryness
- **Examples**: Diphenhydramine, loratadine
- **Recommendations**: Hypoallergenic products, additional lubrication

#### Nasal Decongestants
- **Effects**: Systemic drying effects
- **Recommendations**: Avoid petroleum-based products, use water-based alternatives

## Medical Conditions and Adaptations

### Diabetes Mellitus

#### Type 1 and Type 2 Diabetes
- **Effects**: Increased infection risk, delayed healing, neuropathy
- **Recommendations**: 
  - Strict glucose control before intimate activities
  - Antimicrobial-treated products
  - Regular skin inspection for irritation
  - Gentle, low-friction materials

#### Blood Sugar Monitoring
- **Pre-activity testing**: Ensure glucose 80-200 mg/dL
- **Post-activity monitoring**: Check for delayed hypoglycemia
- **Emergency protocols**: Glucose tablets readily available

### Autoimmune Conditions

#### Lupus (SLE)
- **Effects**: Medication side effects, fatigue, joint pain
- **Recommendations**: Soft, flexible materials; joint-supportive positions

#### Rheumatoid Arthritis
- **Effects**: Joint stiffness, medication side effects
- **Recommendations**: Easy-application products, ergonomic design features

#### Sjögren's Syndrome
- **Effects**: Severe mucosal dryness
- **Recommendations**: Extensive lubrication, frequent reapplication protocols

### Neurological Conditions

#### Multiple Sclerosis (MS)
- **Effects**: Sensation changes, fatigue, temperature sensitivity
- **Recommendations**: Temperature-neutral products, extended foreplay

#### Spinal Cord Injury
- **Effects**: Altered sensation, autonomic dysreflexia risk
- **Recommendations**: 
  - Careful blood pressure monitoring
  - Gentle application techniques
  - Medical supervision for complete injuries

#### Stroke Recovery
- **Effects**: Hemiparesis, sensation changes, cognitive effects
- **Recommendations**: Adaptive techniques, caregiver education if needed

## Therapeutic Interventions for Optimization

### Pelvic Floor Therapy

#### Strengthening Exercises
- **Kegel exercises**: Improve muscle tone and control
- **Timing**: 3 sets of 10, hold 10 seconds, 3 times daily
- **Benefits**: Enhanced sensation, better product retention

#### Relaxation Techniques
- **Progressive muscle relaxation**: Reduce tension and pain
- **Breathing exercises**: Improve blood flow and relaxation
- **Benefits**: Improved comfort and product acceptance

### Topical Therapies

#### Estrogen Creams
- **Indications**: Vaginal atrophy, menopause-related dryness
- **Application**: 2-3 times weekly as prescribed
- **Benefits**: Improved tissue elasticity and lubrication

#### Lidocaine Preparations
- **Indications**: Vestibulodynia, hypersensitivity
- **Application**: 30 minutes before activity as needed
- **Benefits**: Reduced pain, improved comfort

### Complementary Therapies

#### Mindfulness and Meditation
- **Benefits**: Reduced anxiety, improved body awareness
- **Techniques**: Body scanning, breathing meditation
- **Integration**: Pre-activity relaxation protocols

#### Acupuncture
- **Evidence**: Moderate evidence for sexual function improvement
- **Protocol**: Weekly sessions for 8-12 weeks
- **Benefits**: Improved circulation, reduced stress

#### Massage Therapy
- **Benefits**: Improved circulation, muscle relaxation
- **Techniques**: Swedish massage, myofascial release
- **Integration**: Regular sessions for overall wellness

## Pre-Activity Optimization Protocols

### Preparation Checklist
1. **Medication timing**: Take as prescribed, note interaction potential
2. **Hydration**: Adequate fluid intake 2-4 hours prior
3. **Blood sugar**: Check if diabetic, maintain optimal range
4. **Stress management**: Relaxation techniques as needed
5. **Communication**: Discuss comfort and preferences with partner

### Contraindications and Warnings
- **Active infections**: Defer use until resolved
- **Recent surgery**: Follow medical clearance guidelines
- **Severe cardiovascular disease**: Medical supervision recommended
- **Uncontrolled diabetes**: Stabilize glucose first
- **Severe allergic reactions**: Identify and avoid triggers

## Monitoring and Follow-Up

### Regular Assessment
- **Monthly review**: Effectiveness and comfort evaluation
- **Quarterly medical review**: With healthcare provider
- **Annual comprehensive**: Full sexual health assessment

### Warning Signs
- **Persistent irritation**: May indicate allergy or infection
- **Unusual discharge**: Requires medical evaluation
- **Pain during use**: Reassess sizing and technique
- **Recurrent infections**: Consider material sensitivity

### Healthcare Provider Communication
- **Open dialogue**: Discuss sexual health concerns
- **Medication review**: Regular assessment of effects
- **Specialized referrals**: Urology, gynecology, or sexual medicine as needed`,
      tags: ["medicine", "therapy", "optimization", "health", "medical"],
      lastUpdated: "2024-01-16",
      author: "Medical Advisory Board",
      difficulty: "Advanced",
      readTime: "25 min"
    },
    {
      id: "sexual-anatomy-reproductive-justice",
      title: "Sexual Anatomy Education & Reproductive Justice Frameworks",
      category: "health",
      content: `# Sexual Anatomy Education & Reproductive Justice

## Introduction
Sexual anatomy education and reproductive justice are fundamental to fluck's mission of supporting sexual creativity while ensuring bodily autonomy and reproductive rights for all individuals.

## Sexual Anatomy Diversity

### External Genital Anatomy
- **Vulva variations**: Natural diversity in labia size, clitoral structure, and vestibular configuration
- **Penis anatomy**: Variations in size, shape, foreskin presence, and urethral placement
- **Intersex anatomy**: Natural chromosomal, gonadal, or anatomical variations affecting sexual development
- **Post-surgical anatomy**: Considerations for gender-affirming surgical outcomes

### Internal Reproductive Anatomy
- **Uterine variations**: Bicornuate, septate, and other müllerian duct variations
- **Vaginal anatomy**: Length, width, and elasticity differences
- **Prostate considerations**: Size, sensitivity, and accessibility variations
- **Hormonal influences**: Impact of natural and medical hormone levels on anatomy

### Anatomical Changes Over Time
- **Puberty variations**: Different timelines and outcomes of sexual development
- **Pregnancy and childbirth**: Anatomical changes and postpartum considerations
- **Aging effects**: Natural changes in sensitivity, lubrication, and erectile function
- **Medical influences**: Medication and treatment effects on sexual anatomy

## Reproductive Justice Framework

### Core Principles
1. **Right to have children**: Access to fertility treatments, adoption, and family planning
2. **Right not to have children**: Contraception access, abortion rights, and sterilization choices
3. **Right to parent children**: Safe communities, economic support, and freedom from violence
4. **Right to sexual autonomy**: Bodily integrity, consent education, and pleasure rights

### Historical Context
- **Forced sterilization**: Historical abuses targeting disabled, Indigenous, and marginalized communities
- **Contraceptive access**: Struggles for birth control legalization and insurance coverage
- **Abortion rights**: Legal battles and ongoing threats to reproductive autonomy
- **LGBTQ+ family rights**: Marriage equality, adoption rights, and fertility access

### Intersectional Considerations
- **Race and ethnicity**: Maternal mortality disparities and healthcare access barriers
- **Economic class**: Insurance coverage gaps and cost barriers to reproductive care
- **Disability rights**: Autonomy in reproductive decisions and accessible healthcare
- **Geographic location**: Rural healthcare deserts and state-level policy variations

## Sexual Creativity and Expression

### Defining Sexual Creativity
- **Beyond penetration**: Diverse sexual practices and pleasure exploration
- **Adaptive techniques**: Creative solutions for different abilities and anatomies
- **Communication skills**: Expressing desires, boundaries, and preferences
- **Pleasure activism**: Advocating for joy, consent, and sexual liberation

### Supporting Anatomical Diversity
- **Custom-fit products**: fluck's precision sizing accommodates all anatomies
- **Inclusive design**: Products that work with surgical scars, prosthetics, and mobility aids
- **Educational resources**: Anatomy-positive information about sexual function
- **Community support**: Peer networks for sharing experiences and advice

### Consent and Communication
- **Enthusiastic consent**: Ongoing, informed agreement in all sexual encounters
- **Boundary setting**: Clear communication about comfort levels and limits
- **Safer sex practices**: STI prevention strategies for all types of sexual contact
- **Trauma-informed approaches**: Sensitivity to sexual violence survivors

## Policy and Advocacy

### Legislative Priorities
- **Comprehensive sex education**: Age-appropriate, inclusive curriculum in schools
- **Healthcare access**: Insurance coverage for contraception, abortion, and fertility treatments
- **Anti-discrimination laws**: Protection for LGBTQ+ individuals in healthcare settings
- **Research funding**: Support for sexual health and reproductive justice studies

### Community Organizing
- **Grassroots advocacy**: Local campaigns for reproductive rights and sexual health access
- **Coalition building**: Partnerships across movements for social justice
- **Direct action**: Protests, clinic escorting, and community defense
- **Mutual aid**: Community-supported reproductive care and emergency assistance

### Corporate Responsibility
- **Employee benefits**: Comprehensive reproductive healthcare coverage
- **Supply chain ethics**: Ensuring fair labor practices in healthcare manufacturing
- **Community investment**: Supporting local reproductive justice organizations
- **Product accessibility**: Affordable pricing and distribution strategies

## Implementation in Healthcare

### Provider Training
- **Cultural competency**: Understanding diverse sexual practices and identities
- **Trauma-informed care**: Recognizing and responding to sexual violence histories
- **Anatomical inclusivity**: Examination techniques for all body types
- **Communication skills**: Respectful language and patient-centered approaches

### Service Delivery
- **Comprehensive care**: Integrating sexual health into primary healthcare
- **Accessibility standards**: Physical and communication accommodations
- **Privacy protection**: Confidentiality for minors and marginalized populations
- **Emergency protocols**: Rapid response for sexual assault and reproductive emergencies

### Quality Improvement
- **Patient feedback**: Regular assessment of care quality and cultural responsiveness
- **Outcome tracking**: Monitoring reproductive health disparities and interventions
- **Staff development**: Ongoing education about sexual anatomy and reproductive justice
- **Community partnerships**: Collaboration with advocacy organizations and peer educators

## Educational Applications

### Curriculum Development
- **Age-appropriate content**: Progressive sexual anatomy education from childhood through adulthood
- **Inclusive representation**: Materials featuring diverse bodies, relationships, and families
- **Interactive learning**: Hands-on activities and peer discussion opportunities
- **Assessment methods**: Evaluating knowledge without shame or judgment

### Community Education
- **Workshop series**: Public education about reproductive rights and sexual anatomy
- **Peer educator training**: Empowering community members as health advocates
- **Resource libraries**: Accessible information in multiple languages and formats
- **Online platforms**: Digital tools for sexual health education and support

### Professional Development
- **Medical training**: Integration of reproductive justice into healthcare education
- **Legal education**: Training lawyers and advocates on reproductive rights law
- **Social work practice**: Reproductive justice approaches in family services
- **Research methodology**: Ethical approaches to sexual health and reproductive research`,
      tags: ["sexual-anatomy", "reproductive-justice", "education", "diversity", "rights"],
      lastUpdated: "2024-01-16",
      author: "Reproductive Justice Collective",
      difficulty: "Intermediate",
      readTime: "18 min"
    },
    {
      id: "intelligence-frameworks",
      title: "Intelligence Frameworks: Infinite, Multigenerational, Multicultural & Racial Intelligence",
      category: "health",
      content: `# Intelligence Frameworks for Holistic Health

## Introduction
fluck's peer mentor network operates on expanded intelligence frameworks that recognize diverse forms of wisdom and knowledge beyond traditional IQ measurements. These frameworks ensure equitable representation and value all forms of human intelligence in healthcare decision-making.

## Infinite Intelligence

### Definition
Infinite Intelligence transcends individual cognitive capacity, accessing collective wisdom through interconnected knowledge networks and emergent understanding.

### Core Principles
- **Collective Wisdom Access**: Drawing from community knowledge pools and shared experiences
- **Pattern Recognition Across Domains**: Identifying connections between seemingly unrelated fields
- **Emergent Problem-Solving**: Solutions arising from collaborative thinking processes
- **Intuitive Insight Synthesis**: Integrating rational analysis with intuitive understanding

### Applications in Healthcare
- **Community Health Networks**: Leveraging collective experience for health solutions
- **Cross-Pollination**: Applying insights from one health domain to another
- **Emergent Treatments**: Discovering new approaches through collaborative exploration
- **Holistic Assessment**: Considering multiple perspectives simultaneously

### Time Banking Integration
Contributors demonstrating infinite intelligence receive enhanced dividend multipliers based on:
- Cross-domain knowledge connections
- Innovative solution synthesis
- Community wisdom facilitation
- Pattern recognition contributions

## Multigenerational Intelligence

### Definition
Multigenerational Intelligence integrates wisdom across age groups, combining elder knowledge with youth innovation and middle-generation bridge-building.

### Generational Wisdom Types

#### Elder Intelligence (65+)
- **Historical Pattern Recognition**: Understanding long-term health trends and cycles
- **Traditional Knowledge Systems**: Indigenous and cultural healing practices
- **Life Experience Integration**: Practical wisdom from lived experiences
- **Mentorship Capacity**: Ability to guide and teach younger generations

#### Adult Intelligence (44-64)
- **Bridge-Building**: Connecting generational perspectives and technologies
- **Resource Management**: Experienced navigation of healthcare systems
- **Career-Health Balance**: Managing health across professional responsibilities
- **Family Advocacy**: Coordinating multi-generational family health needs

#### Millennial Intelligence (28-43)
- **Technology Integration**: Digital health tool proficiency and innovation
- **Systems Thinking**: Understanding complex healthcare interconnections
- **Advocacy Skills**: Organizing for healthcare reform and access
- **Work-Life Integration**: Balancing career demands with health priorities

#### Gen Z Intelligence (18-27)
- **Digital Native Insights**: Intuitive understanding of online health communities
- **Social Justice Awareness**: Connecting health to broader equity issues
- **Innovation Mindset**: Creative approaches to traditional health challenges
- **Global Perspective**: Understanding health as interconnected worldwide issue

### Implementation in Peer Mentoring
- **Age-Diverse Matching**: Pairing mentors and mentees across generations
- **Knowledge Exchange Programs**: Structured sharing between age groups
- **Technology Training**: Youth teaching elders digital tools; elders sharing traditional wisdom
- **Succession Planning**: Ensuring knowledge transfer and continuity

## Multicultural Intelligence

### Definition
Multicultural Intelligence encompasses the ability to understand, respect, and integrate diverse cultural approaches to health, healing, and wellness.

### Cultural Knowledge Systems

#### Indigenous Wisdom Traditions
- **Holistic Health Concepts**: Understanding body-mind-spirit-community interconnections
- **Plant Medicine Knowledge**: Traditional herbal and natural healing approaches
- **Ceremonial Healing**: Ritual and spiritual components of wellness
- **Land-Based Health**: Connection between environmental and human health

#### Eastern Medical Systems
- **Traditional Chinese Medicine**: Qi, meridians, and energy-based healing
- **Ayurvedic Principles**: Dosha balance and constitutional health approaches
- **Yoga and Meditation**: Mind-body practices for wellness
- **Acupuncture and Bodywork**: Physical intervention for energy flow

#### African Diaspora Healing
- **Community-Centered Wellness**: Collective approaches to individual health
- **Spiritual Healing Practices**: Integration of faith and physical wellness
- **Herbal Medicine Traditions**: Plant-based healing knowledge
- **Music and Movement Therapy**: Rhythm and dance for healing

#### Latin American Curanderismo
- **Sobadoras/Parteras**: Traditional bodywork and birth attendance
- **Herbal Medicine**: Extensive plant knowledge for health conditions
- **Spiritual Cleansing**: Limpias and energy clearing practices
- **Family-Centered Care**: Extended family involvement in healing

### Cross-Cultural Health Navigation
- **Language Accessibility**: Understanding health concepts across languages
- **Cultural Competency**: Respectful integration of diverse healing approaches
- **Religious Integration**: Incorporating faith-based healing where appropriate
- **Dietary Wisdom**: Understanding cultural nutrition and food medicine

## Racial & Ethnic Intelligence

### Definition
Racial & Ethnic Intelligence involves deep understanding of how race and ethnicity impact health outcomes, healthcare access, and healing approaches, while recognizing and addressing systemic inequities.

### Health Equity Awareness

#### Structural Racism in Healthcare
- **Historical Medical Trauma**: Understanding impacts of unethical medical experimentation
- **Implicit Bias Recognition**: Identifying unconscious prejudices in healthcare delivery
- **Access Barriers**: Recognizing geographic, economic, and cultural barriers to care
- **Quality Disparities**: Understanding differences in care quality across racial groups

#### Intersectional Health Impacts
- **Race-Gender Intersections**: Understanding unique challenges for women of color
- **Socioeconomic Factors**: How poverty and racism compound health challenges
- **Immigration Status**: Healthcare access challenges for undocumented communities
- **LGBTQ+ Identity**: Additional challenges for queer and trans people of color

### Community-Specific Knowledge

#### African American Health Intelligence
- **Historical Health Resilience**: Survival strategies under systemic oppression
- **Church-Based Wellness**: Faith community health support systems
- **Hair and Skin Care**: Specific health considerations for Black bodies
- **Hypertension and Diabetes**: Community-specific prevention and management

#### Latino/Hispanic Health Intelligence
- **Familismo**: Family-centered approach to health decision-making
- **Traditional Healing**: Curanderismo and folk medicine integration
- **Migration Health**: Understanding health impacts of displacement
- **Language Barriers**: Navigating healthcare with limited English proficiency

#### Asian American Health Intelligence
- **Model Minority Myth**: Understanding hidden health struggles and needs
- **Intergenerational Trauma**: Impacts of war, displacement, and discrimination
- **Traditional Medicine Integration**: Balancing Eastern and Western approaches
- **Mental Health Stigma**: Cultural barriers to seeking psychological support

#### Indigenous Health Intelligence
- **Historical Trauma**: Understanding impacts of colonization on health
- **Traditional Ecological Knowledge**: Connection between land and health
- **Tribal Sovereignty**: Respecting Indigenous healthcare governance
- **Cultural Revitalization**: Health benefits of cultural practice restoration

### Advocacy and Action

#### Community Health Advocacy
- **Data Collection**: Ensuring accurate representation in health research
- **Policy Reform**: Advocating for healthcare policies that address racial disparities
- **Community Organizing**: Building power for health equity
- **Cultural Preservation**: Maintaining traditional healing knowledge

#### Healthcare System Reform
- **Diversifying Healthcare Workforce**: Increasing representation in medical fields
- **Bias Training**: Educating healthcare providers about unconscious bias
- **Community Health Workers**: Training and supporting community-based health advocates
- **Culturally Adapted Interventions**: Developing health programs for specific communities

## Integration in fluck's Peer Mentor Network

### Matching Algorithm
The peer mentor matching system considers all intelligence types to create optimal pairings:
- **Cultural Background Alignment**: Matching based on shared or complementary cultural experiences
- **Generational Balance**: Pairing across age groups for knowledge exchange
- **Intelligence Type Complementarity**: Combining different intelligence strengths
- **Racial/Ethnic Sensitivity**: Ensuring culturally competent mentoring relationships

### Time Banking Equity Measures
The stablecoin dividend system incorporates intelligence equity through:
- **Cultural Knowledge Bonuses**: Extra compensation for sharing traditional healing knowledge
- **Language Services**: Additional payments for interpretation and translation
- **Community Organizing**: Bonuses for health advocacy and system navigation assistance
- **Mentorship Quality**: Higher dividends for demonstrating cultural competency and inclusive practices

### Training and Development
All peer mentors complete training in:
- **Cultural Humility**: Ongoing learning about diverse health approaches
- **Racial Equity**: Understanding systemic racism's impact on health
- **Generational Communication**: Effective cross-age interaction strategies
- **Infinite Intelligence Practices**: Accessing and contributing to collective wisdom

### Quality Assurance
The network maintains quality through:
- **Community Feedback**: Regular assessment from mentees and community members
- **Cultural Advisory Boards**: Oversight from diverse community leaders
- **Outcome Tracking**: Monitoring health equity improvements
- **Continuous Learning**: Ongoing education about evolving cultural competency standards

## Research and Evidence Base

### Academic Foundations
- **Howard Gardner's Multiple Intelligences**: Recognition of diverse cognitive abilities
- **Cultural Psychology Research**: Understanding culture's impact on cognition and health
- **Critical Race Theory**: Analyzing systemic racism's health impacts
- **Indigenous Research Methodologies**: Incorporating traditional knowledge validation

### Outcome Measurements
- **Health Equity Metrics**: Tracking disparities reduction across racial/ethnic groups
- **Cultural Competency Assessments**: Measuring mentor effectiveness across cultures
- **Generational Satisfaction**: Evaluating cross-age mentoring success
- **Community Health Indicators**: Monitoring overall community wellness improvements

### Continuous Innovation
- **Community-Participatory Research**: Involving communities in defining and measuring success
- **Traditional Knowledge Integration**: Formal recognition and incorporation of indigenous wisdom
- **Technology Adaptation**: Ensuring digital tools work across cultural and generational lines
- **Global Health Perspectives**: Learning from international community health models

## Implementation Guidelines

### For Healthcare Providers
- **Assessment Tools**: Incorporating cultural and generational factors in health evaluations
- **Treatment Planning**: Developing culturally appropriate and age-sensitive interventions
- **Communication Strategies**: Adapting interaction styles for diverse intelligence types
- **Resource Navigation**: Connecting patients with culturally competent community resources

### For Community Organizations
- **Program Design**: Creating initiatives that honor diverse intelligence types
- **Leadership Development**: Cultivating leaders across cultural and generational lines
- **Partnership Building**: Collaborating across racial, ethnic, and age boundaries
- **Advocacy Coordination**: Uniting diverse voices for health equity

### For Individual Users
- **Self-Assessment**: Understanding your own intelligence strengths and cultural background
- **Mentor Selection**: Choosing mentors who complement your knowledge and experience
- **Learning Opportunities**: Seeking education about other cultural and generational perspectives
- **Community Contribution**: Sharing your unique intelligence types with the network

This comprehensive intelligence framework ensures that fluck's peer mentor network values and utilizes the full spectrum of human wisdom, creating more equitable and effective health support for all community members.`,
      tags: ["intelligence", "cultural-competency", "multigenerational", "racial-equity", "peer-mentoring"],
      lastUpdated: "2024-01-16",
      author: "Peer Mentor Intelligence Collective",
      difficulty: "Advanced",
      readTime: "22 min"
    },
    {
      id: "inclusive-terminology",
      title: "Inclusive Sexual Health Terminology and Cultural Competency",
      category: "health",
      content: `# Inclusive Sexual Health Terminology

## Core Principles

### Person-First Language
- "Person with [condition]" vs "[condition] person"
- Avoid stigmatizing terminology
- Respect self-identification
- Use current, accepted terms

### Cultural Competency
- Community-approved terminology
- Regional language variations
- Indigenous knowledge systems
- Intersectional considerations

## Anatomy and Identity

### Inclusive Anatomy Terms
- **External genitalia**: Vulva, penis, intersex variations
- **Internal anatomy**: Uterus, prostate, varied configurations
- **Secondary characteristics**: Chest, body hair, voice
- **Surgical considerations**: Post-operative anatomies

### Identity-Affirming Language
- **Gender identity**: Self-determination priority
- **Sexual orientation**: Spectrum recognition
- **Relationship styles**: Monogamy to polyamory
- **Cultural identity**: Intersectional awareness

## 2SLGBTIQA+ Terminology

### Expanded Acronym
- **2S**: Two-Spirit (Indigenous identity)
- **L**: Lesbian
- **G**: Gay
- **B**: Bisexual
- **T**: Transgender
- **I**: Intersex
- **Q**: Queer/Questioning
- **A**: Asexual/Aromantic
- **+**: Additional identities

### Evolving Language
- Regular terminology updates
- Community input processes
- Youth-led language evolution
- Elder wisdom integration

## Native American/Indigenous Perspectives

### Traditional Knowledge
- Two-Spirit recognition
- Ceremonial health practices
- Community healing approaches
- Land-based health concepts

### Language Preservation
- Cherokee terminology integration
- Navajo health concepts
- Cree community input
- Tribal-specific protocols

### Respectful Engagement
- Tribal consultation protocols
- Cultural appropriation avoidance
- Sovereignty recognition
- Collaborative development

## Communication Best Practices

### Active Listening
- Ask for preferred terms
- Respect corrections
- Avoid assumptions
- Learn continuously

### Professional Development
- Regular training updates
- Community engagement
- Bias recognition work
- Cultural humility practice

### Documentation Standards
- Inclusive intake forms
- Flexible terminology options
- Privacy protection
- Regular form updates`,
      tags: ["terminology", "inclusive", "2slgbtiq", "cultural-competency", "indigenous"],
      lastUpdated: "2024-01-10",
      author: "Community Relations Team",
      difficulty: "Intermediate",
      readTime: "14 min"
    }
  ];

  const filteredArticles = wikiArticles.filter(article => {
    const matchesSearch = searchTerm === "" || 
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = activeCategory === "all" || article.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "bg-green-100 text-green-800";
      case "Intermediate": return "bg-yellow-100 text-yellow-800";
      case "Advanced": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryIcon = (category: string) => {
    const categoryData = categories.find(c => c.id === category);
    return categoryData ? categoryData.icon : BookOpen;
  };

  const renderMarkdownContent = (content: string) => {
    return content
      .split('\n')
      .map((line, index) => {
        // Headers
        if (line.startsWith('# ')) {
          return <h1 key={index} className="text-3xl font-bold mt-8 mb-4 first:mt-0">{line.substring(2)}</h1>;
        }
        if (line.startsWith('## ')) {
          return <h2 key={index} className="text-2xl font-semibold mt-6 mb-3">{line.substring(3)}</h2>;
        }
        if (line.startsWith('### ')) {
          return <h3 key={index} className="text-xl font-semibold mt-5 mb-2">{line.substring(4)}</h3>;
        }
        if (line.startsWith('#### ')) {
          return <h4 key={index} className="text-lg font-medium mt-4 mb-2">{line.substring(5)}</h4>;
        }
        
        // Lists
        if (line.startsWith('- ')) {
          return <li key={index} className="ml-4 mb-1">{line.substring(2)}</li>;
        }
        
        // Bold text
        const boldText = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        // Empty lines
        if (line.trim() === '') {
          return <br key={index} />;
        }
        
        // Regular paragraphs
        return <p key={index} className="mb-3" dangerouslySetInnerHTML={{ __html: boldText }} />;
      });
  };

  if (selectedArticle) {
    return (
      <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <div className="mb-6">
            <Button 
              variant="outline" 
              onClick={() => setSelectedArticle(null)}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Articles</span>
            </Button>
          </div>

          {/* Article Content */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2 mb-4">
                {(() => {
                  const IconComponent = getCategoryIcon(selectedArticle.category);
                  return <IconComponent className="h-5 w-5 text-primary" />;
                })()}
                <Badge variant="outline" className="text-xs">
                  {categories.find(c => c.id === selectedArticle.category)?.name}
                </Badge>
                <Badge className={getDifficultyColor(selectedArticle.difficulty) + " text-xs"}>
                  {selectedArticle.difficulty}
                </Badge>
              </div>
              <CardTitle className="text-3xl mb-4">{selectedArticle.title}</CardTitle>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-4">
                <span>By {selectedArticle.author}</span>
                <span>Updated {selectedArticle.lastUpdated}</span>
                <span>{selectedArticle.readTime} read</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {selectedArticle.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose prose-lg max-w-none text-foreground">
                <div className="leading-relaxed">
                  {renderMarkdownContent(selectedArticle.content)}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <BetaDisclaimer />
      <div className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
          {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <BookOpen className="h-12 w-12 text-primary mr-4" />
            <div>
              <h1 className="text-4xl font-bold text-foreground">
                fluck Knowledge Wiki
              </h1>
              <p className="text-xl text-muted-foreground mt-2">
                Best Practices for Sustainable Sexual Health
              </p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search wiki articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Categories Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {categories.map((category) => {
                    const IconComponent = category.icon;
                    return (
                      <button
                        key={category.id}
                        onClick={() => setActiveCategory(category.id)}
                        className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors ${
                          activeCategory === category.id
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-muted"
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <IconComponent className="h-4 w-4" />
                          <span className="text-sm font-medium">{category.name}</span>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {category.count}
                        </Badge>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Quick Links</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <a href="#" className="flex items-center space-x-2 text-blue-600 hover:underline">
                    <Star className="h-4 w-4" />
                    <span>Getting Started Guide</span>
                  </a>
                  <a href="#" className="flex items-center space-x-2 text-blue-600 hover:underline">
                    <Target className="h-4 w-4" />
                    <span>Community Guidelines</span>
                  </a>
                  <a href="#" className="flex items-center space-x-2 text-blue-600 hover:underline">
                    <Zap className="h-4 w-4" />
                    <span>Technical Support</span>
                  </a>
                  <a href="#" className="flex items-center space-x-2 text-blue-600 hover:underline">
                    <Globe className="h-4 w-4" />
                    <span>Community Forum</span>
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Articles List */}
          <div className="lg:col-span-3">
            <div className="space-y-6">
              {filteredArticles.map((article) => {
                const IconComponent = getCategoryIcon(article.category);
                return (
                  <Card key={article.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <IconComponent className="h-4 w-4 text-primary" />
                            <Badge variant="outline" className="text-xs">
                              {categories.find(c => c.id === article.category)?.name}
                            </Badge>
                            <Badge className={getDifficultyColor(article.difficulty) + " text-xs"}>
                              {article.difficulty}
                            </Badge>
                          </div>
                          <CardTitle className="text-xl mb-2">{article.title}</CardTitle>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span>By {article.author}</span>
                            <span>Updated {article.lastUpdated}</span>
                            <span>{article.readTime} read</span>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="prose prose-sm max-w-none">
                          <p className="text-muted-foreground">
                            {article.content.split('\n\n')[1]?.replace(/^#{1,6}\s/, '') || 
                             article.content.substring(0, 200) + "..."}
                          </p>
                        </div>
                        
                        <div className="flex flex-wrap gap-1">
                          {article.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="flex items-center justify-between pt-4 border-t">
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm text-muted-foreground">Community Verified</span>
                          </div>
                          <button 
                            onClick={() => setSelectedArticle(article)}
                            className="text-primary hover:underline text-sm font-medium"
                          >
                            Read Full Article →
                          </button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}

              {filteredArticles.length === 0 && (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No articles found</h3>
                    <p className="text-muted-foreground">
                      Try adjusting your search terms or browse different categories.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>

        {/* Footer Notice */}
        <Card className="mt-12 bg-blue-50 dark:bg-blue-900/20 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
              <Info className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                  Community-Driven Knowledge
                </h4>
                <p className="text-sm text-blue-700 dark:text-blue-200">
                  This wiki is maintained collaboratively by the fluck community, healthcare professionals, 
                  and subject matter experts. All content is reviewed for accuracy and cultural sensitivity. 
                  To contribute or suggest improvements, join our community forum.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}