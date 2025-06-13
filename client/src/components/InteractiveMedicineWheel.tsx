import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

interface ColorScheme {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
}

export function InteractiveMedicineWheel({ size = 200, onColorChange }: { 
  size?: number; 
  onColorChange?: (colors: ColorScheme) => void;
}) {
  const [selectedDirection, setSelectedDirection] = useState<string | null>(null);
  const [hue, setHue] = useState(330);
  const [saturation, setSaturation] = useState(100);
  const [lightness, setLightness] = useState(60);

  const directions = [
    { name: "East", angle: 0, color: "#FFED00", meaning: "New Beginnings", element: "Air" },
    { name: "South", angle: 90, color: "#E40303", meaning: "Growth & Youth", element: "Fire" },
    { name: "West", angle: 180, color: "#000000", meaning: "Maturity", element: "Water" },
    { name: "North", angle: 270, color: "#FFFFFF", meaning: "Wisdom", element: "Earth" }
  ];

  const prideColors = [
    "#E40303", // Red
    "#FF8C00", // Orange  
    "#FFED00", // Yellow
    "#008018", // Green
    "#0066FF", // Blue
    "#732982", // Purple
    "#5BCEFA", // Trans Blue
    "#F5A9B8", // Trans Pink
    "#613915", // Brown (BIPOC)
    "#000000"  // Black (BIPOC)
  ];

  const generateColorScheme = () => {
    const primary = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    const secondary = `hsl(${(hue + 180) % 360}, ${saturation}%, ${Math.max(lightness - 20, 20)}%)`;
    const accent = `hsl(${(hue + 60) % 360}, ${saturation}%, ${lightness}%)`;
    const background = `hsl(${hue}, ${Math.max(saturation - 80, 10)}%, ${lightness > 50 ? 5 : 95}%)`;
    
    const scheme: ColorScheme = {
      name: `Custom Wheel ${hue}°`,
      colors: { primary, secondary, accent, background }
    };
    
    if (onColorChange) {
      onColorChange(scheme);
    }
    
    return scheme;
  };

  const applyColorsToDocument = () => {
    const scheme = generateColorScheme();
    const root = document.documentElement;
    
    // Extract HSL values for CSS custom properties
    const extractHSL = (hslString: string) => {
      const match = hslString.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
      return match ? `${match[1]}, ${match[2]}%, ${match[3]}%` : '0, 0%, 0%';
    };
    
    root.style.setProperty('--primary', extractHSL(scheme.colors.primary));
    root.style.setProperty('--secondary', extractHSL(scheme.colors.secondary));
    root.style.setProperty('--accent', extractHSL(scheme.colors.accent));
    root.style.setProperty('--background', extractHSL(scheme.colors.background));
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Interactive Medicine Wheel */}
      <div className="relative">
        <svg 
          width={size} 
          height={size} 
          viewBox="0 0 200 200" 
          className="cursor-pointer"
        >
          {/* Outer Circle */}
          <circle 
            cx="100" 
            cy="100" 
            r="95" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="3"
            className="text-foreground"
          />
          
          {/* Sacred Cross */}
          <line x1="100" y1="5" x2="100" y2="195" stroke="currentColor" strokeWidth="2" />
          <line x1="5" y1="100" x2="195" y2="100" stroke="currentColor" strokeWidth="2" />
          
          {/* Pride Flag Segments */}
          {prideColors.map((color, index) => {
            const startAngle = (index * 36) - 90;
            const endAngle = ((index + 1) * 36) - 90;
            const startRad = (startAngle * Math.PI) / 180;
            const endRad = (endAngle * Math.PI) / 180;
            
            const x1 = 100 + 95 * Math.cos(startRad);
            const y1 = 100 + 95 * Math.sin(startRad);
            const x2 = 100 + 95 * Math.cos(endRad);
            const y2 = 100 + 95 * Math.sin(endRad);
            
            return (
              <path
                key={index}
                d={`M 100 100 L ${x1} ${y1} A 95 95 0 0 1 ${x2} ${y2} Z`}
                fill={color}
                opacity="0.8"
                className="hover:opacity-100 transition-opacity cursor-pointer"
                onClick={() => {
                  // Extract hue from clicked color
                  const tempDiv = document.createElement('div');
                  tempDiv.style.color = color;
                  document.body.appendChild(tempDiv);
                  const rgb = window.getComputedStyle(tempDiv).color;
                  document.body.removeChild(tempDiv);
                  
                  // Convert RGB to HSL and update
                  const rgbMatch = rgb.match(/\d+/g);
                  if (rgbMatch) {
                    const [r, g, b] = rgbMatch.map(Number);
                    const hslColor = rgbToHsl(r, g, b);
                    setHue(Math.round(hslColor[0] * 360));
                    setSaturation(Math.round(hslColor[1] * 100));
                    setLightness(Math.round(hslColor[2] * 100));
                  }
                }}
              />
            );
          })}
          
          {/* Inner Medicine Wheel */}
          <circle 
            cx="100" 
            cy="100" 
            r="30" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
          />
          
          {/* Four Sacred Directions */}
          {directions.map((direction, index) => {
            const angle = (direction.angle - 90) * Math.PI / 180;
            const x = 100 + 20 * Math.cos(angle);
            const y = 100 + 20 * Math.sin(angle);
            
            return (
              <g key={direction.name}>
                <circle 
                  cx={x} 
                  cy={y} 
                  r="8" 
                  fill={direction.color}
                  stroke="#000" 
                  strokeWidth="1"
                  className="cursor-pointer hover:r-10 transition-all"
                  onClick={() => setSelectedDirection(direction.name)}
                />
                <text 
                  x={100 + 40 * Math.cos(angle)} 
                  y={100 + 40 * Math.sin(angle)} 
                  textAnchor="middle" 
                  className="text-xs font-medium fill-current"
                  dy="0.3em"
                >
                  {direction.name}
                </text>
              </g>
            );
          })}
          
          {/* Center Unity Point */}
          <circle 
            cx="100" 
            cy="100" 
            r="6" 
            fill={`hsl(${hue}, ${saturation}%, ${lightness}%)`}
            className="cursor-pointer"
            onClick={applyColorsToDocument}
          />
          
          {/* fluck branding */}
          <text 
            x="100" 
            y="150" 
            textAnchor="middle" 
            className="fill-current text-foreground font-bold text-lg"
            fontSize="16"
          >
            fluck
          </text>
        </svg>
        
        {/* Color Wheel Controls */}
        <div className="absolute -bottom-20 left-0 right-0">
          <div className="flex justify-center space-x-2">
            <div className="text-center">
              <div 
                className="w-8 h-8 rounded-full border-2 border-white shadow-lg mx-auto mb-1"
                style={{ backgroundColor: `hsl(${hue}, ${saturation}%, ${lightness}%)` }}
              />
              <div className="text-xs">Current</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Color Controls */}
      <Card className="w-full max-w-md">
        <CardContent className="p-4">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Hue</label>
              <Slider
                value={[hue]}
                onValueChange={(value) => setHue(value[0])}
                max={360}
                min={0}
                step={1}
                className="w-full"
              />
              <div className="text-xs text-muted-foreground mt-1">{hue}°</div>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Saturation</label>
              <Slider
                value={[saturation]}
                onValueChange={(value) => setSaturation(value[0])}
                max={100}
                min={0}
                step={1}
                className="w-full"
              />
              <div className="text-xs text-muted-foreground mt-1">{saturation}%</div>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Lightness</label>
              <Slider
                value={[lightness]}
                onValueChange={(value) => setLightness(value[0])}
                max={100}
                min={0}
                step={1}
                className="w-full"
              />
              <div className="text-xs text-muted-foreground mt-1">{lightness}%</div>
            </div>
            
            <Button 
              onClick={applyColorsToDocument} 
              className="w-full"
              style={{ backgroundColor: `hsl(${hue}, ${saturation}%, ${lightness}%)` }}
            >
              Apply Colors to Site
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Direction Information */}
      {selectedDirection && (
        <Card className="w-full max-w-md">
          <CardContent className="p-4">
            {directions.filter(d => d.name === selectedDirection).map(direction => (
              <div key={direction.name} className="text-center">
                <h3 className="font-bold text-lg mb-2">{direction.name}</h3>
                <p className="text-sm text-muted-foreground mb-1">
                  <strong>Meaning:</strong> {direction.meaning}
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Element:</strong> {direction.element}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Helper function to convert RGB to HSL
function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h: number, s: number, l: number;
  
  l = (max + min) / 2;
  
  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
      default: h = 0;
    }
    h /= 6;
  }
  
  return [h, s, l];
}