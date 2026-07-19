import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Palette, 
  Type, 
  Eye, 
  Contrast, 
  ZoomIn, 
  Volume2,
  RotateCcw,
  Save,
  Accessibility
} from "lucide-react";

interface ColorScheme {
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  foreground: string;
}

interface FontSettings {
  family: string;
  size: number;
  weight: string;
  spacing: number;
}

interface AccessibilitySettings {
  highContrast: boolean;
  reducedMotion: boolean;
  screenReader: boolean;
  fontSize: number;
  focusIndicator: boolean;
}

export function ColorCustomizer() {
  const [activeTab, setActiveTab] = useState("colors");
  const [selectedScheme, setSelectedScheme] = useState("default");
  const [customColors, setCustomColors] = useState({
    hue: 330,
    saturation: 100,
    lightness: 60
  });
  const [fontSettings, setFontSettings] = useState<FontSettings>({
    family: "Inter",
    size: 16,
    weight: "400",
    spacing: 0
  });
  const [accessibilitySettings, setAccessibilitySettings] = useState<AccessibilitySettings>({
    highContrast: false,
    reducedMotion: false,
    screenReader: false,
    fontSize: 16,
    focusIndicator: true
  });

  const predefinedSchemes: ColorScheme[] = [
    {
      name: "TriSex Neon",
      primary: "hsl(330, 100%, 60%)",
      secondary: "hsl(180, 100%, 40%)",
      accent: "hsl(330, 100%, 60%)",
      background: "hsl(0, 0%, 0%)",
      foreground: "hsl(0, 0%, 100%)"
    },
    {
      name: "Ocean Plastic",
      primary: "hsl(200, 100%, 50%)",
      secondary: "hsl(180, 100%, 40%)",
      accent: "hsl(220, 100%, 60%)",
      background: "hsl(200, 30%, 5%)",
      foreground: "hsl(200, 20%, 95%)"
    },
    {
      name: "Forest Cooperative",
      primary: "hsl(120, 60%, 40%)",
      secondary: "hsl(90, 80%, 30%)",
      accent: "hsl(150, 70%, 50%)",
      background: "hsl(120, 20%, 8%)",
      foreground: "hsl(120, 15%, 92%)"
    },
    {
      name: "Sunset Pride",
      primary: "hsl(20, 100%, 60%)",
      secondary: "hsl(300, 80%, 50%)",
      accent: "hsl(45, 100%, 55%)",
      background: "hsl(15, 25%, 6%)",
      foreground: "hsl(45, 20%, 94%)"
    },
    {
      name: "High Contrast",
      primary: "hsl(0, 0%, 100%)",
      secondary: "hsl(60, 100%, 50%)",
      accent: "hsl(0, 0%, 100%)",
      background: "hsl(0, 0%, 0%)",
      foreground: "hsl(0, 0%, 100%)"
    }
  ];

  const fontFamilies = [
    "Inter",
    "Roboto",
    "Open Sans", 
    "Lato",
    "Montserrat",
    "Poppins",
    "Source Sans Pro",
    "Noto Sans",
    "Ubuntu",
    "Fira Sans"
  ];

  const applyColorScheme = (scheme: ColorScheme) => {
    const root = document.documentElement;
    root.style.setProperty('--primary', scheme.primary.match(/\d+/g)?.join(', ') || '330, 100%, 60%');
    root.style.setProperty('--secondary', scheme.secondary.match(/\d+/g)?.join(', ') || '180, 100%, 40%');
    root.style.setProperty('--accent', scheme.accent.match(/\d+/g)?.join(', ') || '330, 100%, 60%');
    root.style.setProperty('--background', scheme.background.match(/\d+/g)?.join(', ') || '0, 0%, 0%');
    root.style.setProperty('--foreground', scheme.foreground.match(/\d+/g)?.join(', ') || '0, 0%, 100%');
  };

  const applyCustomColors = () => {
    const { hue, saturation, lightness } = customColors;
    const primaryColor = `${hue}, ${saturation}%, ${lightness}%`;
    const secondaryColor = `${(hue + 180) % 360}, ${saturation}%, ${Math.max(lightness - 20, 20)}%`;
    const accentColor = `${(hue + 60) % 360}, ${saturation}%, ${lightness}%`;
    
    const root = document.documentElement;
    root.style.setProperty('--primary', primaryColor);
    root.style.setProperty('--secondary', secondaryColor);
    root.style.setProperty('--accent', accentColor);
  };

  const applyFontSettings = () => {
    const root = document.documentElement;
    root.style.setProperty('--font-family', fontSettings.family);
    root.style.setProperty('--font-size', `${fontSettings.size}px`);
    root.style.setProperty('--font-weight', fontSettings.weight);
    root.style.setProperty('--letter-spacing', `${fontSettings.spacing}px`);
    
    document.body.style.fontFamily = fontSettings.family;
    document.body.style.fontSize = `${fontSettings.size}px`;
    document.body.style.fontWeight = fontSettings.weight;
    document.body.style.letterSpacing = `${fontSettings.spacing}px`;
  };

  const applyAccessibilitySettings = () => {
    const root = document.documentElement;
    
    if (accessibilitySettings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    
    if (accessibilitySettings.reducedMotion) {
      root.style.setProperty('--animation-duration', '0s');
      root.style.setProperty('--transition-duration', '0s');
    } else {
      root.style.removeProperty('--animation-duration');
      root.style.removeProperty('--transition-duration');
    }
    
    root.style.setProperty('--focus-ring', 
      accessibilitySettings.focusIndicator ? '2px solid var(--primary)' : 'none'
    );
  };

  const resetToDefaults = () => {
    setSelectedScheme("default");
    setCustomColors({ hue: 330, saturation: 100, lightness: 60 });
    setFontSettings({ family: "Inter", size: 16, weight: "400", spacing: 0 });
    setAccessibilitySettings({
      highContrast: false,
      reducedMotion: false,
      screenReader: false,
      fontSize: 16,
      focusIndicator: true
    });
    
    const root = document.documentElement;
    root.removeAttribute('style');
    document.body.removeAttribute('style');
  };

  const saveSettings = () => {
    const settings = {
      colorScheme: selectedScheme,
      customColors,
      fontSettings,
      accessibilitySettings
    };
    localStorage.setItem('trisex-customization', JSON.stringify(settings));
  };

  useEffect(() => {
    const savedSettings = localStorage.getItem('trisex-customization');
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setSelectedScheme(parsed.colorScheme);
      setCustomColors(parsed.customColors);
      setFontSettings(parsed.fontSettings);
      setAccessibilitySettings(parsed.accessibilitySettings);
    }
  }, []);

  useEffect(() => {
    applyFontSettings();
  }, [fontSettings]);

  useEffect(() => {
    applyAccessibilitySettings();
  }, [accessibilitySettings]);

  useEffect(() => {
    applyCustomColors();
  }, [customColors]);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Palette className="mr-2 h-6 w-6" />
          Customize Your TriSex.org Experience
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="colors">Colors</TabsTrigger>
            <TabsTrigger value="typography">Typography</TabsTrigger>
            <TabsTrigger value="accessibility">Accessibility</TabsTrigger>
          </TabsList>

          <TabsContent value="colors">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Predefined Color Schemes</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {predefinedSchemes.map((scheme) => (
                    <div
                      key={scheme.name}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedScheme === scheme.name 
                          ? "border-primary bg-primary/10" 
                          : "border-border hover:border-primary/50"
                      }`}
                      onClick={() => {
                        setSelectedScheme(scheme.name);
                        applyColorScheme(scheme);
                      }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{scheme.name}</h4>
                        {selectedScheme === scheme.name && (
                          <Badge variant="default">Active</Badge>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <div 
                          className="w-6 h-6 rounded border"
                          style={{ backgroundColor: scheme.primary }}
                        />
                        <div 
                          className="w-6 h-6 rounded border"
                          style={{ backgroundColor: scheme.secondary }}
                        />
                        <div 
                          className="w-6 h-6 rounded border"
                          style={{ backgroundColor: scheme.accent }}
                        />
                        <div 
                          className="w-6 h-6 rounded border"
                          style={{ backgroundColor: scheme.background }}
                        />
                        <div 
                          className="w-6 h-6 rounded border"
                          style={{ backgroundColor: scheme.foreground }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">Custom Color Wheel</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Hue</label>
                      <Slider
                        value={[customColors.hue]}
                        onValueChange={(value) => setCustomColors({...customColors, hue: value[0]})}
                        max={360}
                        min={0}
                        step={1}
                        className="w-full"
                      />
                      <div className="text-xs text-muted-foreground mt-1">
                        {customColors.hue}°
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Saturation</label>
                      <Slider
                        value={[customColors.saturation]}
                        onValueChange={(value) => setCustomColors({...customColors, saturation: value[0]})}
                        max={100}
                        min={0}
                        step={1}
                        className="w-full"
                      />
                      <div className="text-xs text-muted-foreground mt-1">
                        {customColors.saturation}%
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Lightness</label>
                      <Slider
                        value={[customColors.lightness]}
                        onValueChange={(value) => setCustomColors({...customColors, lightness: value[0]})}
                        max={100}
                        min={0}
                        step={1}
                        className="w-full"
                      />
                      <div className="text-xs text-muted-foreground mt-1">
                        {customColors.lightness}%
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium">Color Preview</h4>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="text-center">
                        <div 
                          className="w-12 h-12 rounded mx-auto mb-1 border"
                          style={{ 
                            backgroundColor: `hsl(${customColors.hue}, ${customColors.saturation}%, ${customColors.lightness}%)` 
                          }}
                        />
                        <div className="text-xs">Primary</div>
                      </div>
                      <div className="text-center">
                        <div 
                          className="w-12 h-12 rounded mx-auto mb-1 border"
                          style={{ 
                            backgroundColor: `hsl(${(customColors.hue + 180) % 360}, ${customColors.saturation}%, ${Math.max(customColors.lightness - 20, 20)}%)` 
                          }}
                        />
                        <div className="text-xs">Secondary</div>
                      </div>
                      <div className="text-center">
                        <div 
                          className="w-12 h-12 rounded mx-auto mb-1 border"
                          style={{ 
                            backgroundColor: `hsl(${(customColors.hue + 60) % 360}, ${customColors.saturation}%, ${customColors.lightness}%)` 
                          }}
                        />
                        <div className="text-xs">Accent</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="typography">
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">Font Family</label>
                  <Select 
                    value={fontSettings.family} 
                    onValueChange={(value) => setFontSettings({...fontSettings, family: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {fontFamilies.map((font) => (
                        <SelectItem key={font} value={font} style={{ fontFamily: font }}>
                          {font}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Font Weight</label>
                  <Select 
                    value={fontSettings.weight} 
                    onValueChange={(value) => setFontSettings({...fontSettings, weight: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="300">Light (300)</SelectItem>
                      <SelectItem value="400">Regular (400)</SelectItem>
                      <SelectItem value="500">Medium (500)</SelectItem>
                      <SelectItem value="600">Semi-bold (600)</SelectItem>
                      <SelectItem value="700">Bold (700)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Font Size</label>
                <Slider
                  value={[fontSettings.size]}
                  onValueChange={(value) => setFontSettings({...fontSettings, size: value[0]})}
                  max={24}
                  min={12}
                  step={1}
                  className="w-full"
                />
                <div className="text-xs text-muted-foreground mt-1">
                  {fontSettings.size}px
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Letter Spacing</label>
                <Slider
                  value={[fontSettings.spacing]}
                  onValueChange={(value) => setFontSettings({...fontSettings, spacing: value[0]})}
                  max={3}
                  min={-1}
                  step={0.1}
                  className="w-full"
                />
                <div className="text-xs text-muted-foreground mt-1">
                  {fontSettings.spacing}px
                </div>
              </div>

              <div className="p-4 border rounded-lg bg-muted/30">
                <h4 className="font-medium mb-2">Typography Preview</h4>
                <div 
                  style={{
                    fontFamily: fontSettings.family,
                    fontSize: `${fontSettings.size}px`,
                    fontWeight: fontSettings.weight,
                    letterSpacing: `${fontSettings.spacing}px`
                  }}
                >
                  <h3 className="text-lg mb-2">TriSex.org: Custom Protection for Every Body</h3>
                  <p className="text-sm">
                    This is how your text will appear with the selected typography settings. 
                    Protection designed for every body, honestly — open-source, sustainable materials with inclusive design.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="accessibility">
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Contrast className="h-5 w-5" />
                      <div>
                        <div className="font-medium">High Contrast</div>
                        <div className="text-sm text-muted-foreground">
                          Increases contrast for better visibility
                        </div>
                      </div>
                    </div>
                    <Button
                      variant={accessibilitySettings.highContrast ? "default" : "outline"}
                      size="sm"
                      onClick={() => setAccessibilitySettings({
                        ...accessibilitySettings, 
                        highContrast: !accessibilitySettings.highContrast
                      })}
                    >
                      {accessibilitySettings.highContrast ? "On" : "Off"}
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <ZoomIn className="h-5 w-5" />
                      <div>
                        <div className="font-medium">Reduced Motion</div>
                        <div className="text-sm text-muted-foreground">
                          Minimizes animations and transitions
                        </div>
                      </div>
                    </div>
                    <Button
                      variant={accessibilitySettings.reducedMotion ? "default" : "outline"}
                      size="sm"
                      onClick={() => setAccessibilitySettings({
                        ...accessibilitySettings, 
                        reducedMotion: !accessibilitySettings.reducedMotion
                      })}
                    >
                      {accessibilitySettings.reducedMotion ? "On" : "Off"}
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Eye className="h-5 w-5" />
                      <div>
                        <div className="font-medium">Focus Indicators</div>
                        <div className="text-sm text-muted-foreground">
                          Highlights focused elements
                        </div>
                      </div>
                    </div>
                    <Button
                      variant={accessibilitySettings.focusIndicator ? "default" : "outline"}
                      size="sm"
                      onClick={() => setAccessibilitySettings({
                        ...accessibilitySettings, 
                        focusIndicator: !accessibilitySettings.focusIndicator
                      })}
                    >
                      {accessibilitySettings.focusIndicator ? "On" : "Off"}
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Accessibility Font Size</label>
                    <Slider
                      value={[accessibilitySettings.fontSize]}
                      onValueChange={(value) => setAccessibilitySettings({
                        ...accessibilitySettings, 
                        fontSize: value[0]
                      })}
                      max={32}
                      min={12}
                      step={2}
                      className="w-full"
                    />
                    <div className="text-xs text-muted-foreground mt-1">
                      {accessibilitySettings.fontSize}px (affects UI elements)
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg bg-blue-50 dark:bg-blue-900/20">
                    <div className="flex items-center space-x-2 mb-2">
                      <Accessibility className="h-5 w-5 text-blue-600" />
                      <h4 className="font-medium">Screen Reader Support</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      TriSex.org is designed with semantic HTML and ARIA labels for 
                      compatibility with screen readers and assistive technologies.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between pt-6 border-t">
          <Button variant="outline" onClick={resetToDefaults}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset to Defaults
          </Button>
          <Button onClick={saveSettings}>
            <Save className="mr-2 h-4 w-4" />
            Save Settings
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}