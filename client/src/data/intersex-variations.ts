export type ContactZoneId =
  | "oral"
  | "anal"
  | "vaginal"
  | "frontal"
  | "neovaginal";

export interface IntersexVariation {
  id: string;
  name: string;
  alsoKnownAs?: string;
  category: IntersexCategoryId;
  relevantZones: ContactZoneId[];
  fittingNote: string;
  consultRequired: boolean;
}

export type FittingParamId =
  | "shaftLengthMm"
  | "shaftGirthMm"
  | "canalDepthMm"
  | "canalGirthMm"
  | "dualSleeveCount"
  | "urethralPosition"
  | "surfaceTreatment"
  | "materialFlex"
  | "anchorPattern"
  | "consultRequest"
  | "metaLensScanRef";

export type FittingParamValue = number | string | boolean;

export interface FittingParamSpec {
  id: FittingParamId;
  label: string;
  kind: "slider" | "select" | "boolean" | "text";
  unit?: string;
  min?: number;
  max?: number;
  step?: number;
  defaultValue: FittingParamValue;
  options?: Array<{ value: string; label: string }>;
  helper?: string;
}

export const FITTING_PARAMS: Record<FittingParamId, FittingParamSpec> = {
  shaftLengthMm: {
    id: "shaftLengthMm",
    label: "Shaft sleeve length",
    kind: "slider",
    unit: "mm",
    min: 30,
    max: 200,
    step: 5,
    defaultValue: 130,
    helper: "End-to-base length of the Inverted Sleeve fold for this variation.",
  },
  shaftGirthMm: {
    id: "shaftGirthMm",
    label: "Shaft sleeve girth",
    kind: "slider",
    unit: "mm",
    min: 80,
    max: 180,
    step: 2,
    defaultValue: 115,
    helper: "Circumference of the Inverted Sleeve fold at mid-shaft.",
  },
  canalDepthMm: {
    id: "canalDepthMm",
    label: "Receptive canal depth",
    kind: "slider",
    unit: "mm",
    min: 30,
    max: 180,
    step: 5,
    defaultValue: 110,
    helper: "Depth from opening to deepest point of the Cup-Pouch fold.",
  },
  canalGirthMm: {
    id: "canalGirthMm",
    label: "Receptive canal girth",
    kind: "slider",
    unit: "mm",
    min: 80,
    max: 150,
    step: 2,
    defaultValue: 110,
    helper: "Mid-canal circumference of the Cup-Pouch fold.",
  },
  dualSleeveCount: {
    id: "dualSleeveCount",
    label: "Sleeve count in this unit",
    kind: "select",
    defaultValue: "1",
    options: [
      { value: "1", label: "1 sleeve (single phallus)" },
      { value: "2", label: "2 sleeves (paired diphallia fit)" },
    ],
    helper: "Diphallia and paired-anatomy fits ship as a paired sleeve unit.",
  },
  urethralPosition: {
    id: "urethralPosition",
    label: "Urethral opening position",
    kind: "select",
    defaultValue: "distal",
    options: [
      { value: "distal", label: "Distal (glans / distal shaft)" },
      { value: "midshaft", label: "Mid-shaft" },
      { value: "proximal", label: "Proximal / penoscrotal" },
      { value: "perineal", label: "Perineal" },
    ],
    helper: "Drives the hypospadias-aware liner cut for the Inverted Sleeve.",
  },
  surfaceTreatment: {
    id: "surfaceTreatment",
    label: "Surface treatment",
    kind: "select",
    defaultValue: "standard",
    options: [
      { value: "standard", label: "Standard surface" },
      { value: "extra-lubricated", label: "Extra-lubricated (post-surgical / atrophic)" },
      { value: "textured", label: "Textured (sensory amplification)" },
      { value: "hypoallergenic-medical", label: "Hypoallergenic medical-grade" },
    ],
  },
  materialFlex: {
    id: "materialFlex",
    label: "Material flex",
    kind: "select",
    defaultValue: "standard",
    options: [
      { value: "rigid-supportive", label: "Rigid-supportive (post-phalloplasty / micropenis)" },
      { value: "standard", label: "Standard flex" },
      { value: "extra-soft", label: "Extra-soft (atypical anchors / scar-aware)" },
    ],
  },
  anchorPattern: {
    id: "anchorPattern",
    label: "Anchor / strap pattern",
    kind: "select",
    defaultValue: "standard-base",
    options: [
      { value: "standard-base", label: "Standard base ring" },
      { value: "wide-base", label: "Wide base (bifid / webbed)" },
      { value: "asymmetric", label: "Asymmetric (transposition / reconstruction)" },
      { value: "strap", label: "External strap (aphallia / harness-mounted)" },
    ],
  },
  consultRequest: {
    id: "consultRequest",
    label: "Request a one-to-one fitting consult",
    kind: "boolean",
    defaultValue: false,
    helper: "Pre-checked for variations with a consult flag; you can opt out.",
  },
  metaLensScanRef: {
    id: "metaLensScanRef",
    label: "Meta Lens scan reference (optional)",
    kind: "text",
    defaultValue: "",
    helper: "Paste a Meta Lens scan reference ID if you've already captured measurements.",
  },
};

const UNIVERSAL_PARAMS: FittingParamId[] = [
  "surfaceTreatment",
  "materialFlex",
  "consultRequest",
  "metaLensScanRef",
];

const PARAMS_BY_ZONE: Partial<Record<ContactZoneId, FittingParamId[]>> = {
  vaginal: ["canalDepthMm", "canalGirthMm"],
  neovaginal: ["canalDepthMm", "canalGirthMm"],
  anal: ["canalDepthMm", "canalGirthMm"],
  frontal: ["shaftLengthMm", "shaftGirthMm"],
  oral: [],
};

const VARIATION_OVERRIDES: Record<string, FittingParamId[]> = {
  "diphallia": ["dualSleeveCount", "shaftLengthMm", "shaftGirthMm"],
  "distal-hypospadias": ["urethralPosition", "shaftLengthMm", "shaftGirthMm"],
  "midshaft-hypospadias": ["urethralPosition", "shaftLengthMm", "shaftGirthMm"],
  "proximal-hypospadias": ["urethralPosition", "shaftLengthMm", "shaftGirthMm"],
  "perineal-hypospadias": ["urethralPosition", "anchorPattern"],
  "penoscrotal-transposition": ["anchorPattern", "shaftLengthMm", "shaftGirthMm"],
  "bifid-scrotum": ["anchorPattern", "shaftLengthMm", "shaftGirthMm"],
  "webbed-penis": ["anchorPattern", "shaftLengthMm", "shaftGirthMm"],
  "buried-concealed-penis": ["anchorPattern", "shaftLengthMm", "shaftGirthMm"],
  "aphallia": ["anchorPattern"],
  "micropenis": ["shaftLengthMm", "shaftGirthMm"],
  "chordee": ["shaftLengthMm", "shaftGirthMm"],
  "tdick-hormonal": ["shaftLengthMm", "shaftGirthMm"],
  "clitoromegaly": ["shaftLengthMm", "shaftGirthMm"],
  "post-phalloplasty": ["shaftLengthMm", "shaftGirthMm", "anchorPattern"],
  "post-vaginoplasty": ["canalDepthMm", "canalGirthMm"],
  "post-vaginal-construction": ["canalDepthMm", "canalGirthMm"],
  "post-clitoral-recession": ["anchorPattern"],
  "mrkh": ["canalDepthMm", "canalGirthMm"],
  "cervico-vaginal-agenesis": ["canalDepthMm", "canalGirthMm"],
  "vaginal-septum-long": ["canalDepthMm", "canalGirthMm"],
  "vaginal-septum-trans": ["canalDepthMm"],
  "uterine-didelphys": ["canalDepthMm", "canalGirthMm"],
  "cais": ["canalDepthMm", "canalGirthMm"],
  "swyer": ["canalDepthMm", "canalGirthMm"],
  "45-x-turner": ["canalDepthMm", "canalGirthMm"],
};

export function getApplicableParams(variation: IntersexVariation): FittingParamId[] {
  const zoneParams = variation.relevantZones.flatMap((z) => PARAMS_BY_ZONE[z] ?? []);
  const overrideParams = VARIATION_OVERRIDES[variation.id] ?? [];
  const merged = [...overrideParams, ...zoneParams, ...UNIVERSAL_PARAMS];
  return Array.from(new Set(merged));
}

export function getDefaultCustomization(variation: IntersexVariation): Record<string, FittingParamValue> {
  const params = getApplicableParams(variation);
  const defaults: Record<string, FittingParamValue> = {};
  for (const pid of params) {
    const spec = FITTING_PARAMS[pid];
    defaults[pid] = pid === "consultRequest" ? variation.consultRequired : spec.defaultValue;
  }
  return defaults;
}

export type IntersexCategoryId =
  | "sex-chromosome"
  | "46xx-dsd"
  | "46xy-dsd"
  | "gonadal-dysgenesis"
  | "external-genital"
  | "internal-canal"
  | "endocrine-presentation"
  | "post-surgical";

export const INTERSEX_CATEGORIES: Array<{ id: IntersexCategoryId; label: string; blurb: string }> = [
  {
    id: "sex-chromosome",
    label: "Sex chromosome variations",
    blurb: "Karyotype-based variations (e.g. 47,XXY, 45,X, mosaics).",
  },
  {
    id: "46xx-dsd",
    label: "46,XX DSD (CAH spectrum and related)",
    blurb: "46,XX karyotype with virilization or atypical development.",
  },
  {
    id: "46xy-dsd",
    label: "46,XY DSD (androgen-pathway and gonadal)",
    blurb: "46,XY karyotype with under-virilization or atypical development.",
  },
  {
    id: "gonadal-dysgenesis",
    label: "Gonadal dysgenesis & ovotesticular DSD",
    blurb: "Atypical gonadal differentiation independent of single karyotype.",
  },
  {
    id: "external-genital",
    label: "External genital anatomy variations",
    blurb: "Hypospadias spectrum, micropenis, clitoromegaly, ambiguous external genitalia.",
  },
  {
    id: "internal-canal",
    label: "Internal canal & Müllerian variations",
    blurb: "MRKH, vaginal septa, urogenital sinus, persistent cloaca, Müllerian agenesis.",
  },
  {
    id: "endocrine-presentation",
    label: "Endocrine-presentation intersex traits",
    blurb: "Hormonal-axis variations producing intersex external traits.",
  },
  {
    id: "post-surgical",
    label: "Post-surgical or post-medicalised intersex bodies",
    blurb: "Anatomy after infant / childhood / consenting-adult intersex surgical histories.",
  },
];

export const INTERSEX_VARIATIONS: IntersexVariation[] = [
  // Sex chromosome (17)
  { id: "47-xxy", name: "Klinefelter syndrome (47,XXY)", category: "sex-chromosome", relevantZones: ["vaginal", "frontal", "anal", "oral"], fittingNote: "Often standard endosex penile fit; small-testes spec affects scrotal-side anchor for Inverted Sleeve.", consultRequired: false },
  { id: "48-xxxy", name: "48,XXXY", category: "sex-chromosome", relevantZones: ["vaginal", "frontal", "anal", "oral"], fittingNote: "Higher likelihood of micropenis; fitting consult recommended for sleeve sizing.", consultRequired: true },
  { id: "49-xxxxy", name: "49,XXXXY", category: "sex-chromosome", relevantZones: ["vaginal", "frontal", "anal", "oral"], fittingNote: "Frequently micropenis and hypogonadism; consult required for shaft sleeve.", consultRequired: true },
  { id: "48-xxyy", name: "48,XXYY", category: "sex-chromosome", relevantZones: ["vaginal", "frontal", "anal", "oral"], fittingNote: "Variable phenotype; standard fitting often works, consult for atypical anatomy.", consultRequired: false },
  { id: "47-xyy", name: "47,XYY (Jacobs)", category: "sex-chromosome", relevantZones: ["vaginal", "frontal", "anal", "oral"], fittingNote: "Typically endosex external anatomy; standard fit applies.", consultRequired: false },
  { id: "45-x-turner", name: "Turner syndrome (45,X)", category: "sex-chromosome", relevantZones: ["vaginal", "anal", "oral"], fittingNote: "Streak gonads; vaginal canal often shorter — Cup-Pouch fold sized to shorter depth.", consultRequired: true },
  { id: "45-x-mosaic", name: "45,X mosaic (Turner mosaic)", category: "sex-chromosome", relevantZones: ["vaginal", "anal", "oral"], fittingNote: "Highly variable depending on mosaic %; consult required.", consultRequired: true },
  { id: "47-xxx", name: "47,XXX (Triple X)", category: "sex-chromosome", relevantZones: ["vaginal", "anal", "oral"], fittingNote: "Typically endosex female anatomy; standard fit applies.", consultRequired: false },
  { id: "48-xxxx", name: "48,XXXX (Tetrasomy X)", category: "sex-chromosome", relevantZones: ["vaginal", "anal", "oral"], fittingNote: "Standard endosex female anatomy in most cases.", consultRequired: false },
  { id: "49-xxxxx", name: "49,XXXXX (Pentasomy X)", category: "sex-chromosome", relevantZones: ["vaginal", "anal", "oral"], fittingNote: "Frequently associated with anatomical hypoplasia; consult required.", consultRequired: true },
  { id: "46xx-46xy-chimera", name: "46,XX/46,XY chimerism", category: "sex-chromosome", relevantZones: ["vaginal", "frontal", "neovaginal", "anal", "oral"], fittingNote: "Variable presentation across both endosex anatomies; consult required.", consultRequired: true },
  { id: "45x-46xy-mosaic", name: "45,X/46,XY mosaic (mixed gonadal dysgenesis)", category: "sex-chromosome", relevantZones: ["vaginal", "frontal", "anal", "oral"], fittingNote: "Asymmetric external genitalia common; consult required for both internal and external fits.", consultRequired: true },
  { id: "45x-47xyy-mosaic", name: "45,X/47,XYY mosaic", category: "sex-chromosome", relevantZones: ["vaginal", "frontal", "anal", "oral"], fittingNote: "Variable presentation; consult required.", consultRequired: true },
  { id: "46xx-47xxy-mosaic", name: "46,XX/47,XXY mosaic", category: "sex-chromosome", relevantZones: ["vaginal", "frontal", "anal", "oral"], fittingNote: "Variable phenotype; consult recommended.", consultRequired: true },
  { id: "ring-x", name: "Ring chromosome X", category: "sex-chromosome", relevantZones: ["vaginal", "anal", "oral"], fittingNote: "Often Turner-like phenotype; consult recommended.", consultRequired: true },
  { id: "iso-xq", name: "Isochromosome Xq", category: "sex-chromosome", relevantZones: ["vaginal", "anal", "oral"], fittingNote: "Often Turner-like phenotype; consult recommended.", consultRequired: true },
  { id: "tetrasomy-12p", name: "Tetrasomy 12p (Pallister-Killian) with gonadal effects", category: "sex-chromosome", relevantZones: ["vaginal", "frontal", "anal", "oral"], fittingNote: "Highly variable; consult required.", consultRequired: true },

  // 46,XX DSD (12)
  { id: "cah-salt-wasting", name: "Classic salt-wasting CAH (21-hydroxylase deficiency)", category: "46xx-dsd", relevantZones: ["vaginal", "frontal", "anal", "oral"], fittingNote: "Virilized external genitalia; clitoromegaly common, vaginal opening may be high — consult required.", consultRequired: true },
  { id: "cah-simple-virilizing", name: "Simple virilizing CAH (21-OHD)", category: "46xx-dsd", relevantZones: ["vaginal", "frontal", "anal", "oral"], fittingNote: "Variable virilization; consult recommended for canal and external fit.", consultRequired: true },
  { id: "cah-non-classic", name: "Non-classic CAH (late-onset 21-OHD)", category: "46xx-dsd", relevantZones: ["vaginal", "anal", "oral"], fittingNote: "Usually unambiguous external anatomy; standard fit often applies.", consultRequired: false },
  { id: "cah-11b", name: "11β-hydroxylase deficiency CAH", category: "46xx-dsd", relevantZones: ["vaginal", "frontal", "anal", "oral"], fittingNote: "Virilized external genitalia; consult required.", consultRequired: true },
  { id: "cah-3b", name: "3β-hydroxysteroid dehydrogenase deficiency", category: "46xx-dsd", relevantZones: ["vaginal", "frontal", "anal", "oral"], fittingNote: "Mild virilization in 46,XX; consult recommended.", consultRequired: true },
  { id: "p450-or", name: "P450 oxidoreductase deficiency (POR)", category: "46xx-dsd", relevantZones: ["vaginal", "frontal", "anal", "oral"], fittingNote: "Antley-Bixler-spectrum; consult required.", consultRequired: true },
  { id: "aromatase-def", name: "Aromatase deficiency", category: "46xx-dsd", relevantZones: ["vaginal", "frontal", "anal", "oral"], fittingNote: "Virilized external genitalia at birth; consult required.", consultRequired: true },
  { id: "placental-aromatase-def", name: "Placental aromatase deficiency", category: "46xx-dsd", relevantZones: ["vaginal", "frontal", "anal", "oral"], fittingNote: "Maternal-route virilization; consult recommended.", consultRequired: true },
  { id: "maternal-androgen-exposure", name: "Maternal androgen exposure", category: "46xx-dsd", relevantZones: ["vaginal", "frontal", "anal", "oral"], fittingNote: "Variable virilization; consult recommended.", consultRequired: true },
  { id: "46xx-testicular", name: "46,XX testicular DSD (SRY+)", category: "46xx-dsd", relevantZones: ["vaginal", "frontal", "anal", "oral"], fittingNote: "Often presents with male external genitalia; standard endosex penile fit may apply.", consultRequired: false },
  { id: "46xx-ovotesticular", name: "46,XX ovotesticular DSD", category: "46xx-dsd", relevantZones: ["vaginal", "frontal", "anal", "oral"], fittingNote: "Mixed gonadal tissue; external anatomy variable — consult required.", consultRequired: true },
  { id: "luteoma-virilization", name: "Maternal luteoma virilization (XX)", category: "46xx-dsd", relevantZones: ["vaginal", "frontal", "anal", "oral"], fittingNote: "Usually resolves postnatally but can leave virilized clitoris; consult recommended.", consultRequired: true },

  // 46,XY DSD (18)
  { id: "cais", name: "Complete androgen insensitivity syndrome (CAIS)", category: "46xy-dsd", relevantZones: ["vaginal", "anal", "oral"], fittingNote: "Endosex-female-typical external anatomy; vaginal canal often shorter / blind-ending — Cup-Pouch sized to shallower depth.", consultRequired: true },
  { id: "pais", name: "Partial androgen insensitivity syndrome (PAIS)", category: "46xy-dsd", relevantZones: ["vaginal", "frontal", "anal", "oral"], fittingNote: "Highly variable external anatomy across the Quigley scale; consult required.", consultRequired: true },
  { id: "mais", name: "Mild androgen insensitivity syndrome (MAIS)", category: "46xy-dsd", relevantZones: ["vaginal", "frontal", "anal", "oral"], fittingNote: "Usually male-typical external anatomy; standard penile fit often applies.", consultRequired: false },
  { id: "5ard", name: "5α-reductase 2 deficiency (5-ARD)", category: "46xy-dsd", relevantZones: ["vaginal", "frontal", "anal", "oral"], fittingNote: "Under-virilized at birth, often virilizes at puberty; consult required for both phallic and frontal fit.", consultRequired: true },
  { id: "17b-hsd3", name: "17β-hydroxysteroid dehydrogenase 3 deficiency", category: "46xy-dsd", relevantZones: ["vaginal", "frontal", "anal", "oral"], fittingNote: "Similar to 5-ARD pattern; consult required.", consultRequired: true },
  { id: "3b-hsd2", name: "3β-hydroxysteroid dehydrogenase 2 deficiency", category: "46xy-dsd", relevantZones: ["vaginal", "frontal", "anal", "oral"], fittingNote: "Severe under-virilization in XY; consult required.", consultRequired: true },
  { id: "cyp17", name: "17α-hydroxylase / 17,20-lyase deficiency (CYP17)", category: "46xy-dsd", relevantZones: ["vaginal", "frontal", "anal", "oral"], fittingNote: "Phenotypic-female external anatomy in XY; consult required.", consultRequired: true },
  { id: "lipoid-cah", name: "Lipoid CAH (StAR mutation)", category: "46xy-dsd", relevantZones: ["vaginal", "anal", "oral"], fittingNote: "Phenotypic-female external anatomy in XY; consult required.", consultRequired: true },
  { id: "leydig-hypoplasia", name: "Leydig cell hypoplasia (LH receptor mutation)", category: "46xy-dsd", relevantZones: ["vaginal", "frontal", "anal", "oral"], fittingNote: "Variable external anatomy depending on severity; consult required.", consultRequired: true },
  { id: "pmds", name: "Persistent Müllerian duct syndrome (PMDS)", category: "46xy-dsd", relevantZones: ["frontal", "anal", "oral"], fittingNote: "Male external anatomy with internal Müllerian structures; standard external fit, internal canal not used for penetration without consult.", consultRequired: true },
  { id: "amh-deficiency", name: "Anti-Müllerian hormone (AMH) deficiency", category: "46xy-dsd", relevantZones: ["frontal", "anal", "oral"], fittingNote: "Same as PMDS pattern; consult required.", consultRequired: true },
  { id: "amh-receptor-defect", name: "AMH receptor defect", category: "46xy-dsd", relevantZones: ["frontal", "anal", "oral"], fittingNote: "Same as PMDS pattern; consult required.", consultRequired: true },
  { id: "swyer", name: "Swyer syndrome (46,XY pure gonadal dysgenesis, SRY mutation)", category: "46xy-dsd", relevantZones: ["vaginal", "anal", "oral"], fittingNote: "Endosex-female external anatomy with streak gonads; standard fit usually applies.", consultRequired: false },
  { id: "sf1-mutation", name: "SF1 (NR5A1) mutation", category: "46xy-dsd", relevantZones: ["vaginal", "frontal", "anal", "oral"], fittingNote: "Variable external anatomy; consult required.", consultRequired: true },
  { id: "wt1-mutation", name: "WT1 mutation (Denys-Drash, Frasier)", category: "46xy-dsd", relevantZones: ["vaginal", "frontal", "anal", "oral"], fittingNote: "Variable external anatomy with renal involvement; consult required.", consultRequired: true },
  { id: "sox9-mutation", name: "SOX9 mutation (XY sex reversal)", category: "46xy-dsd", relevantZones: ["vaginal", "frontal", "anal", "oral"], fittingNote: "Variable external anatomy; consult required.", consultRequired: true },
  { id: "dax1-dup", name: "DAX1 (NR0B1) duplication", category: "46xy-dsd", relevantZones: ["vaginal", "frontal", "anal", "oral"], fittingNote: "XY sex reversal; consult required.", consultRequired: true },
  { id: "dhh-mutation", name: "DHH (Desert hedgehog) mutation", category: "46xy-dsd", relevantZones: ["vaginal", "frontal", "anal", "oral"], fittingNote: "XY gonadal dysgenesis spectrum; consult required.", consultRequired: true },

  // Gonadal dysgenesis & ovotesticular DSD (5)
  { id: "mixed-gonadal-dysgenesis", name: "Mixed gonadal dysgenesis (general)", category: "gonadal-dysgenesis", relevantZones: ["vaginal", "frontal", "anal", "oral"], fittingNote: "Asymmetric external anatomy common; consult required.", consultRequired: true },
  { id: "ovotesticular-dsd", name: "Ovotesticular DSD (general)", category: "gonadal-dysgenesis", relevantZones: ["vaginal", "frontal", "anal", "oral"], fittingNote: "Variable external presentation; consult required.", consultRequired: true },
  { id: "pure-46xx-gd", name: "Pure 46,XX gonadal dysgenesis", category: "gonadal-dysgenesis", relevantZones: ["vaginal", "anal", "oral"], fittingNote: "Endosex-female-typical anatomy with streak gonads; standard fit usually applies.", consultRequired: false },
  { id: "pure-46xy-gd", name: "Pure 46,XY gonadal dysgenesis (Swyer-like)", category: "gonadal-dysgenesis", relevantZones: ["vaginal", "anal", "oral"], fittingNote: "Endosex-female-typical external anatomy; standard fit usually applies.", consultRequired: false },
  { id: "vanishing-testes", name: "Vanishing testes / testicular regression syndrome", category: "gonadal-dysgenesis", relevantZones: ["frontal", "anal", "oral"], fittingNote: "Variable external anatomy; consult recommended.", consultRequired: true },

  // External genital (12)
  { id: "distal-hypospadias", name: "Distal hypospadias", category: "external-genital", relevantZones: ["vaginal", "frontal", "anal", "oral"], fittingNote: "Urethral opening on glans / distal shaft; standard sleeve usually fits, hypospadias-aware liner recommended.", consultRequired: false },
  { id: "midshaft-hypospadias", name: "Mid-shaft hypospadias", category: "external-genital", relevantZones: ["vaginal", "frontal", "anal", "oral"], fittingNote: "Urethral opening mid-shaft; consult recommended for sleeve and liner positioning.", consultRequired: true },
  { id: "proximal-hypospadias", name: "Proximal / penoscrotal hypospadias", category: "external-genital", relevantZones: ["vaginal", "frontal", "anal", "oral"], fittingNote: "Urethral opening at base / scrotum; consult required for full-shaft coverage.", consultRequired: true },
  { id: "perineal-hypospadias", name: "Perineal hypospadias", category: "external-genital", relevantZones: ["vaginal", "frontal", "anal", "oral"], fittingNote: "Urethral opening on perineum; consult required for coverage geometry.", consultRequired: true },
  { id: "chordee", name: "Chordee without hypospadias", category: "external-genital", relevantZones: ["vaginal", "frontal", "anal", "oral"], fittingNote: "Ventral curvature affects sleeve length spec; consult recommended.", consultRequired: true },
  { id: "penoscrotal-transposition", name: "Penoscrotal transposition", category: "external-genital", relevantZones: ["vaginal", "frontal", "anal", "oral"], fittingNote: "Anchor-ring positioning differs from typical anatomy; consult required.", consultRequired: true },
  { id: "bifid-scrotum", name: "Bifid scrotum", category: "external-genital", relevantZones: ["vaginal", "frontal", "anal", "oral"], fittingNote: "Affects scrotal-side anchor pattern; consult recommended.", consultRequired: true },
  { id: "aphallia", name: "Penile agenesis (aphallia)", category: "external-genital", relevantZones: ["frontal", "anal", "oral"], fittingNote: "No phallus to sleeve; pre-built urethral / surgically constructed neo-phallus fit available — consult required.", consultRequired: true },
  { id: "diphallia", name: "Diphallia (two phalluses)", category: "external-genital", relevantZones: ["vaginal", "frontal", "anal", "oral"], fittingNote: "Paired sleeves required; consult required.", consultRequired: true },
  { id: "micropenis", name: "Micropenis (≤2.5 SD below mean for age)", category: "external-genital", relevantZones: ["vaginal", "frontal", "anal", "oral"], fittingNote: "Shorter-length sleeve adapter; same girth options as standard sleeve.", consultRequired: false },
  { id: "webbed-penis", name: "Webbed penis", category: "external-genital", relevantZones: ["vaginal", "frontal", "anal", "oral"], fittingNote: "Scrotal-shaft webbing affects sleeve base anchor; consult recommended.", consultRequired: true },
  { id: "buried-concealed-penis", name: "Buried / concealed penis", category: "external-genital", relevantZones: ["vaginal", "frontal", "anal", "oral"], fittingNote: "Pre-positioning / extraction step before sleeve; consult recommended.", consultRequired: true },

  // Internal canal (10)
  { id: "clitoromegaly", name: "Clitoromegaly (intersex or hormonal)", category: "external-genital", relevantZones: ["vaginal", "frontal", "anal", "oral"], fittingNote: "Sized for enlarged clitoris with shorter-length T-dick / clit sleeve adapter.", consultRequired: false },
  { id: "tdick-hormonal", name: "T-dick (testosterone-induced clitoromegaly)", category: "external-genital", relevantZones: ["vaginal", "frontal", "anal", "oral"], fittingNote: "Standard short-shaft adapter; sized at consult or via Meta Lens scan.", consultRequired: false },
  { id: "labial-fusion", name: "Labial fusion / posterior labial adhesion", category: "external-genital", relevantZones: ["vaginal", "frontal", "anal", "oral"], fittingNote: "May affect Wing-Extended Dam anchor pattern; consult recommended.", consultRequired: true },
  { id: "mrkh", name: "MRKH (Mayer-Rokitansky-Küster-Hauser) — Müllerian agenesis", category: "internal-canal", relevantZones: ["vaginal", "anal", "oral"], fittingNote: "Absent / shortened vaginal canal; sized for residual depth or post-dilation length — consult required.", consultRequired: true },
  { id: "cervico-vaginal-agenesis", name: "Cervico-vaginal agenesis", category: "internal-canal", relevantZones: ["vaginal", "anal", "oral"], fittingNote: "Same fitting class as MRKH; consult required.", consultRequired: true },
  { id: "vaginal-septum-long", name: "Longitudinal vaginal septum", category: "internal-canal", relevantZones: ["vaginal", "anal", "oral"], fittingNote: "Septum affects Cup-Pouch geometry; consult required.", consultRequired: true },
  { id: "vaginal-septum-trans", name: "Transverse vaginal septum", category: "internal-canal", relevantZones: ["vaginal", "anal", "oral"], fittingNote: "Limits canal depth; consult required.", consultRequired: true },
  { id: "cloacal-exstrophy", name: "Cloacal exstrophy", category: "internal-canal", relevantZones: ["vaginal", "frontal", "anal", "oral"], fittingNote: "Major reconstructive history; consult required.", consultRequired: true },
  { id: "bladder-exstrophy", name: "Bladder exstrophy with intersex traits", category: "internal-canal", relevantZones: ["vaginal", "frontal", "anal", "oral"], fittingNote: "Major reconstructive history; consult required.", consultRequired: true },
  { id: "persistent-cloaca", name: "Persistent cloaca", category: "internal-canal", relevantZones: ["vaginal", "anal", "oral"], fittingNote: "Single perineal opening; consult required.", consultRequired: true },
  { id: "urogenital-sinus", name: "Urogenital sinus", category: "internal-canal", relevantZones: ["vaginal", "frontal", "anal", "oral"], fittingNote: "Common joint outlet; consult required.", consultRequired: true },
  { id: "imperforate-hymen", name: "Imperforate hymen (anatomical canal variation)", category: "internal-canal", relevantZones: ["vaginal", "anal", "oral"], fittingNote: "Sized post-treatment; consult recommended.", consultRequired: true },
  { id: "cervical-atresia", name: "Cervical atresia with functional uterus", category: "internal-canal", relevantZones: ["vaginal", "anal", "oral"], fittingNote: "Cup-Pouch fit unaffected externally; consult recommended.", consultRequired: false },
  { id: "uterine-didelphys", name: "Uterine didelphys with vaginal septum", category: "internal-canal", relevantZones: ["vaginal", "anal", "oral"], fittingNote: "Septated canal; consult required.", consultRequired: true },

  // Endocrine presentation (4)
  { id: "pcos-intersex", name: "Hyperandrogenism (PCOS spectrum) with intersex traits", category: "endocrine-presentation", relevantZones: ["vaginal", "frontal", "anal", "oral"], fittingNote: "Mild virilization possible; standard fit often applies.", consultRequired: false },
  { id: "ihh-ambiguous", name: "Idiopathic hypogonadotropic hypogonadism with ambiguous development", category: "endocrine-presentation", relevantZones: ["vaginal", "frontal", "anal", "oral"], fittingNote: "Variable phenotype; consult recommended.", consultRequired: true },
  { id: "kallmann-intersex", name: "Kallmann syndrome with intersex traits", category: "endocrine-presentation", relevantZones: ["vaginal", "frontal", "anal", "oral"], fittingNote: "Often micropenis / underdeveloped external anatomy; consult recommended.", consultRequired: true },
  { id: "hyperprolactinemia-gyn", name: "Hyperprolactinemia-induced gynecomastia spectrum", category: "endocrine-presentation", relevantZones: ["vaginal", "frontal", "anal", "oral"], fittingNote: "External anatomy usually unaffected; standard fit applies.", consultRequired: false },

  // Post-surgical (4)
  { id: "post-vaginoplasty", name: "Post-vaginoplasty neovagina (intersex surgical history)", category: "post-surgical", relevantZones: ["neovaginal", "anal", "oral"], fittingNote: "Shallower depth honoured in Cup-Pouch fold; lubrication-receptive material recommended.", consultRequired: false },
  { id: "post-clitoral-recession", name: "Post-clitoral recession / clitoroplasty", category: "post-surgical", relevantZones: ["vaginal", "frontal", "anal", "oral"], fittingNote: "External anatomy altered; consult required for Wing-Extended Dam anchor.", consultRequired: true },
  { id: "post-vaginal-construction", name: "Post-vaginal construction (Frank dilation, McIndoe, intestinal, peritoneal)", category: "post-surgical", relevantZones: ["neovaginal", "anal", "oral"], fittingNote: "Depth and lining vary by technique; consult required.", consultRequired: true },
  { id: "post-phalloplasty", name: "Post-phalloplasty (any donor site)", category: "post-surgical", relevantZones: ["vaginal", "frontal", "anal", "oral"], fittingNote: "Sleeve sized to constructed shaft; rigid-rod / pump consideration in consult.", consultRequired: true },
];
