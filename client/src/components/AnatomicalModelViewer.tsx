import { useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  RotateCcw,
  Play,
  Pause,
  Grid3x3,
  Box,
  Ruler,
} from "lucide-react";
import {
  type IntersexVariation,
  type FittingParamId,
  type FittingParamValue,
  getApplicableParams,
  getDefaultCustomization,
  FITTING_PARAMS,
} from "@/data/intersex-variations";

interface GeometrySpec {
  hasShaft: boolean;
  hasCanal: boolean;
  shaftLengthMm: number;
  shaftGirthMm: number;
  canalDepthMm: number;
  canalGirthMm: number;
  sleeveCount: number;
}

function getGeometrySpec(variation: IntersexVariation | null): GeometrySpec {
  const params: FittingParamId[] = variation
    ? getApplicableParams(variation)
    : ["shaftLengthMm", "shaftGirthMm", "canalDepthMm", "canalGirthMm"];

  const defaults: Record<string, FittingParamValue> = variation
    ? getDefaultCustomization(variation)
    : {
        shaftLengthMm: FITTING_PARAMS.shaftLengthMm.defaultValue,
        shaftGirthMm: FITTING_PARAMS.shaftGirthMm.defaultValue,
        canalDepthMm: FITTING_PARAMS.canalDepthMm.defaultValue,
        canalGirthMm: FITTING_PARAMS.canalGirthMm.defaultValue,
      };

  const num = (v: FittingParamValue | undefined, fallback: number) =>
    typeof v === "number" ? v : fallback;

  return {
    hasShaft: params.includes("shaftLengthMm"),
    hasCanal: params.includes("canalDepthMm"),
    shaftLengthMm: num(defaults.shaftLengthMm, 130),
    shaftGirthMm: num(defaults.shaftGirthMm, 115),
    canalDepthMm: num(defaults.canalDepthMm, 110),
    canalGirthMm: num(defaults.canalGirthMm, 110),
    sleeveCount: defaults.dualSleeveCount === "2" || params.includes("dualSleeveCount") ? 2 : 1,
  };
}

const MM_TO_UNIT = 1 / 100;
const radiusFromGirth = (girthMm: number) => girthMm / (2 * Math.PI) * MM_TO_UNIT;

function ShaftForm({
  lengthMm,
  girthMm,
  wireframe,
  count,
}: {
  lengthMm: number;
  girthMm: number;
  wireframe: boolean;
  count: number;
}) {
  const radius = radiusFromGirth(girthMm);
  const length = lengthMm * MM_TO_UNIT;
  const offsets = count === 2 ? [-radius * 1.5, radius * 1.5] : [0];

  return (
    <group>
      {offsets.map((x, i) => (
        <group key={i} position={[x, 0, 0]}>
          <mesh position={[0, length / 2, 0]}>
            <cylinderGeometry args={[radius, radius * 1.04, length, 36]} />
            <meshStandardMaterial
              color="#a855f7"
              wireframe={wireframe}
              roughness={0.55}
              metalness={0.05}
            />
          </mesh>
          <mesh position={[0, length, 0]}>
            <sphereGeometry args={[radius, 36, 18]} />
            <meshStandardMaterial
              color="#c084fc"
              wireframe={wireframe}
              roughness={0.5}
            />
          </mesh>
        </group>
      ))}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <torusGeometry args={[radius * 1.35, radius * 0.22, 18, 48]} />
        <meshStandardMaterial color="#7c3aed" wireframe={wireframe} roughness={0.6} />
      </mesh>
    </group>
  );
}

function CanalForm({
  depthMm,
  girthMm,
  wireframe,
}: {
  depthMm: number;
  girthMm: number;
  wireframe: boolean;
}) {
  const radius = radiusFromGirth(girthMm);
  const depth = depthMm * MM_TO_UNIT;

  return (
    <group>
      <mesh position={[0, depth / 2, 0]}>
        <cylinderGeometry args={[radius * 1.28, radius * 1.28, depth, 36, 1, true]} />
        <meshStandardMaterial
          color="#2dd4bf"
          transparent
          opacity={0.26}
          side={THREE.DoubleSide}
          wireframe={wireframe}
          roughness={0.4}
        />
      </mesh>
      <mesh position={[0, depth / 2, 0]}>
        <cylinderGeometry args={[radius, radius, depth * 0.98, 36, 1, true]} />
        <meshStandardMaterial
          color="#0d9488"
          transparent
          opacity={0.55}
          side={THREE.BackSide}
          wireframe={wireframe}
          roughness={0.5}
        />
      </mesh>
      <mesh position={[0, depth, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius * 1.14, radius * 0.12, 16, 48]} />
        <meshStandardMaterial color="#14b8a6" wireframe={wireframe} roughness={0.5} />
      </mesh>
    </group>
  );
}

function Scene({
  spec,
  showExternal,
  showCanal,
  wireframe,
  autoRotate,
  controlsRef,
}: {
  spec: GeometrySpec;
  showExternal: boolean;
  showCanal: boolean;
  wireframe: boolean;
  autoRotate: boolean;
  controlsRef: React.MutableRefObject<any>;
}) {
  const externalVisible = spec.hasShaft && showExternal;
  const canalVisible = spec.hasCanal && showCanal;
  const bothVisible = externalVisible && canalVisible;
  const shaftX = bothVisible ? -0.55 : 0;
  const canalX = bothVisible ? 0.55 : 0;

  return (
    <>
      <ambientLight intensity={0.65} />
      <directionalLight position={[4, 6, 4]} intensity={1.1} />
      <directionalLight position={[-4, 2, -3]} intensity={0.45} />

      {externalVisible && (
        <group position={[shaftX, 0, 0]}>
          <ShaftForm
            lengthMm={spec.shaftLengthMm}
            girthMm={spec.shaftGirthMm}
            wireframe={wireframe}
            count={spec.sleeveCount}
          />
        </group>
      )}

      {canalVisible && (
        <group position={[canalX, 0, 0]}>
          <CanalForm
            depthMm={spec.canalDepthMm}
            girthMm={spec.canalGirthMm}
            wireframe={wireframe}
          />
        </group>
      )}

      <gridHelper args={[6, 12, "#cbd5e1", "#e2e8f0"]} position={[0, 0, 0]} />

      <OrbitControls
        ref={controlsRef}
        makeDefault
        enablePan={false}
        autoRotate={autoRotate}
        autoRotateSpeed={1.6}
        minDistance={1.4}
        maxDistance={8}
        target={[0, 0.6, 0]}
      />
    </>
  );
}

export default function AnatomicalModelViewer({
  variation,
}: {
  variation: IntersexVariation | null;
}) {
  const [showExternal, setShowExternal] = useState(true);
  const [showCanal, setShowCanal] = useState(true);
  const [wireframe, setWireframe] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const controlsRef = useRef<any>(null);

  const spec = getGeometrySpec(variation);

  const measurements: Array<{ label: string; value: string }> = [];
  if (spec.hasShaft) {
    measurements.push({ label: "Shaft sleeve length", value: `${spec.shaftLengthMm} mm` });
    measurements.push({ label: "Shaft sleeve girth", value: `${spec.shaftGirthMm} mm` });
    if (spec.sleeveCount === 2) {
      measurements.push({ label: "Sleeve count", value: "2 (paired)" });
    }
  }
  if (spec.hasCanal) {
    measurements.push({ label: "Receptive canal depth", value: `${spec.canalDepthMm} mm` });
    measurements.push({ label: "Receptive canal girth", value: `${spec.canalGirthMm} mm` });
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {spec.hasShaft && (
          <Button
            type="button"
            size="sm"
            variant={showExternal ? "default" : "outline"}
            onClick={() => setShowExternal((v) => !v)}
            data-testid="button-toggle-external"
          >
            <Box className="h-4 w-4 mr-1.5" />
            External fit form
          </Button>
        )}
        {spec.hasCanal && (
          <Button
            type="button"
            size="sm"
            variant={showCanal ? "default" : "outline"}
            onClick={() => setShowCanal((v) => !v)}
            data-testid="button-toggle-canal"
          >
            <Box className="h-4 w-4 mr-1.5" />
            Receptive canal
          </Button>
        )}
        <Button
          type="button"
          size="sm"
          variant={wireframe ? "default" : "outline"}
          onClick={() => setWireframe((v) => !v)}
          data-testid="button-toggle-wireframe"
        >
          <Grid3x3 className="h-4 w-4 mr-1.5" />
          Wireframe
        </Button>
        <Button
          type="button"
          size="sm"
          variant={autoRotate ? "default" : "outline"}
          onClick={() => setAutoRotate((v) => !v)}
          data-testid="button-toggle-rotate"
        >
          {autoRotate ? <Pause className="h-4 w-4 mr-1.5" /> : <Play className="h-4 w-4 mr-1.5" />}
          {autoRotate ? "Pause" : "Rotate"}
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => controlsRef.current?.reset()}
          data-testid="button-reset-view"
        >
          <RotateCcw className="h-4 w-4 mr-1.5" />
          Reset view
        </Button>
      </div>

      <div className="h-[360px] w-full rounded-lg border bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 overflow-hidden">
        <Canvas camera={{ position: [2.6, 1.8, 2.6], fov: 45 }} dpr={[1, 2]}>
          <Scene
            spec={spec}
            showExternal={showExternal}
            showCanal={showCanal}
            wireframe={wireframe}
            autoRotate={autoRotate}
            controlsRef={controlsRef}
          />
        </Canvas>
      </div>

      <p className="text-xs text-muted-foreground">
        Drag to rotate · scroll to zoom. Schematic educational fit-form proportioned
        from this variation's default fitting parameters — it is not an anatomically
        precise scan or a real measurement of any person.
      </p>

      {measurements.length > 0 && (
        <div>
          <div className="flex items-center gap-1.5 mb-2 text-sm font-medium">
            <Ruler className="h-4 w-4 text-purple-600" />
            Default fit parameters
          </div>
          <div className="grid grid-cols-2 gap-2">
            {measurements.map((m) => (
              <div
                key={m.label}
                className="flex items-center justify-between rounded border px-2.5 py-1.5 text-xs"
              >
                <span className="text-muted-foreground">{m.label}</span>
                <Badge variant="secondary" className="font-mono">{m.value}</Badge>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
