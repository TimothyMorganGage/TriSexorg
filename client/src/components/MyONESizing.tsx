import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Ruler, Calculator, Target, CheckCircle, Info } from "lucide-react";

interface SizeData {
  nominal: string;
  width: number;
  length: number;
  description: string;
  fitCategory: string;
}

export function PrecisionSizing() {
  const [measurements, setMeasurements] = useState({
    length: "",
    baseGirth: "",
    midGirth: "",
    headGirth: ""
  });
  const [recommendedSize, setRecommendedSize] = useState<SizeData | null>(null);
  const [activeTab, setActiveTab] = useState("measure");

  // TriSex.org precision sizing system. Width and length categories are expanded
  // to cover the full spectrum of anatomical diversity rather than a narrow band.
  // Width = flat nominal width in mm (≈ circumference / π); length = mm.
  const SIZE_WIDTHS_MM = [22, 26, 30, 34, 38, 42, 46, 50, 54, 58, 62, 66, 70];
  const SIZE_LENGTHS_MM = [
    90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200, 210, 220, 230, 240, 250,
  ];

  const widthCategory = (w: number): string => {
    if (w <= 30) return "Snug";
    if (w <= 42) return "Standard";
    if (w <= 54) return "Large";
    if (w <= 62) return "XL";
    return "XXL";
  };
  const lengthLabel = (l: number): string => {
    if (l <= 110) return "short";
    if (l <= 150) return "standard";
    if (l <= 200) return "long";
    return "extra-long";
  };

  const sizeChart: SizeData[] = SIZE_WIDTHS_MM.flatMap((width, wi) =>
    SIZE_LENGTHS_MM.map((length, li) => {
      const cat = widthCategory(width);
      return {
        nominal: `${String.fromCharCode(65 + wi)}${li + 1}`,
        width,
        length,
        description: `${cat} width, ${lengthLabel(length)} length`,
        fitCategory: cat,
      };
    })
  );

  const calculateRecommendedSize = () => {
    if (!measurements.length || !measurements.baseGirth) return;

    const lengthMm = parseFloat(measurements.length);
    const girthMm = parseFloat(measurements.baseGirth);
    
    // Convert to TriSex.org sizing logic
    const widthNeeded = girthMm / Math.PI; // Approximate flat width from circumference
    
    // Find best fit based on length and width
    let bestFit = sizeChart[0];
    let minDifference = Infinity;
    
    for (const size of sizeChart) {
      const lengthDiff = Math.abs(size.length - lengthMm);
      const widthDiff = Math.abs(size.width - widthNeeded);
      const totalDiff = lengthDiff + (widthDiff * 2); // Weight width more heavily
      
      if (totalDiff < minDifference) {
        minDifference = totalDiff;
        bestFit = size;
      }
    }
    
    setRecommendedSize(bestFit);
  };

  const getFitColor = (category: string) => {
    switch (category) {
      case "Snug": return "bg-blue-100 text-blue-800";
      case "Standard": return "bg-green-100 text-green-800";
      case "Large": return "bg-orange-100 text-orange-800";
      case "XL": return "bg-purple-100 text-purple-800";
      case "XXL": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Ruler className="mr-2 h-6 w-6 text-primary" />
            TriSex.org Intersex-Centered Sizing System
          </CardTitle>
          <p className="text-muted-foreground">
            Precision sizing centered on intersex anatomical diversity, honoring all bodies without binary assumptions
          </p>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="measure">Measurements</TabsTrigger>
              <TabsTrigger value="sizes">Size Chart</TabsTrigger>
              <TabsTrigger value="guide">Fitting Guide</TabsTrigger>
            </TabsList>

            <TabsContent value="measure">
              <div className="space-y-6">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Info className="h-5 w-5 text-blue-600" />
                    <h4 className="font-medium">Intersex-Centered, Privacy-First Measuring</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Our sizing system honors intersex anatomical variations as the foundation, not an afterthought. 
                    All measurements are processed locally with no data storage or transmission.
                    Use our 3D scanning system for the most accurate fit across all anatomical configurations.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Length (mm)
                      </label>
                      <Input
                        type="number"
                        placeholder="e.g., 160"
                        value={measurements.length}
                        onChange={(e) => setMeasurements({
                          ...measurements,
                          length: e.target.value
                        })}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Measure your anatomy's full length - all configurations welcome
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Base Girth (mm)
                      </label>
                      <Input
                        type="number"
                        placeholder="e.g., 120"
                        value={measurements.baseGirth}
                        onChange={(e) => setMeasurements({
                          ...measurements,
                          baseGirth: e.target.value
                        })}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Circumference at widest point of your anatomy
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Mid-shaft Girth (mm) <span className="text-muted-foreground">(Optional)</span>
                      </label>
                      <Input
                        type="number"
                        placeholder="e.g., 115"
                        value={measurements.midGirth}
                        onChange={(e) => setMeasurements({
                          ...measurements,
                          midGirth: e.target.value
                        })}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Head Girth (mm) <span className="text-muted-foreground">(Optional)</span>
                      </label>
                      <Input
                        type="number"
                        placeholder="e.g., 125"
                        value={measurements.headGirth}
                        onChange={(e) => setMeasurements({
                          ...measurements,
                          headGirth: e.target.value
                        })}
                      />
                    </div>

                    <Button 
                      onClick={calculateRecommendedSize}
                      className="w-full"
                      disabled={!measurements.length || !measurements.baseGirth}
                    >
                      <Calculator className="mr-2 h-4 w-4" />
                      Calculate My Size
                    </Button>
                  </div>

                  <div>
                    {recommendedSize ? (
                      <Card className="border-green-200 dark:border-green-800">
                        <CardHeader>
                          <CardTitle className="flex items-center text-green-700 dark:text-green-300">
                            <Target className="mr-2 h-5 w-5" />
                            Your Recommended Size
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="text-center">
                              <div className="text-3xl font-bold text-green-600 mb-2">
                                TriSex.org {recommendedSize.nominal}
                              </div>
                              <Badge className={getFitColor(recommendedSize.fitCategory)}>
                                {recommendedSize.fitCategory} Fit
                              </Badge>
                            </div>

                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span>Width:</span>
                                <span className="font-medium">{recommendedSize.width}mm</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Length:</span>
                                <span className="font-medium">{recommendedSize.length}mm</span>
                              </div>
                            </div>

                            <p className="text-sm text-muted-foreground">
                              {recommendedSize.description}
                            </p>

                            <div className="pt-2 border-t">
                              <Button className="w-full" size="sm">
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Add to Configuration
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ) : (
                      <div className="text-center text-muted-foreground p-8">
                        <Ruler className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Enter your measurements to get your custom size recommendation</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="sizes">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground" data-testid="text-size-count">
                  {sizeChart.length} precise sizes · {SIZE_WIDTHS_MM.length} widths
                  ({SIZE_WIDTHS_MM[0]}–{SIZE_WIDTHS_MM[SIZE_WIDTHS_MM.length - 1]}mm)
                  × {SIZE_LENGTHS_MM.length} lengths
                  ({SIZE_LENGTHS_MM[0]}–{SIZE_LENGTHS_MM[SIZE_LENGTHS_MM.length - 1]}mm)
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
                  <div className="text-center">
                    <Badge className="bg-blue-100 text-blue-800 w-full">Snug Fit</Badge>
                    <p className="text-xs text-muted-foreground mt-1">Tight, secure feel</p>
                  </div>
                  <div className="text-center">
                    <Badge className="bg-green-100 text-green-800 w-full">Standard Fit</Badge>
                    <p className="text-xs text-muted-foreground mt-1">Balanced comfort</p>
                  </div>
                  <div className="text-center">
                    <Badge className="bg-orange-100 text-orange-800 w-full">Large Fit</Badge>
                    <p className="text-xs text-muted-foreground mt-1">Roomy, relaxed</p>
                  </div>
                  <div className="text-center">
                    <Badge className="bg-purple-100 text-purple-800 w-full">XL+ Fit</Badge>
                    <p className="text-xs text-muted-foreground mt-1">Maximum space</p>
                  </div>
                </div>

                <div className="grid gap-3 max-h-96 overflow-y-auto">
                  {sizeChart.map((size) => (
                    <div 
                      key={size.nominal}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="font-bold text-lg min-w-[60px]">
                          {size.nominal}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{size.description}</div>
                          <div className="text-sm text-muted-foreground">
                            {size.width}mm × {size.length}mm
                          </div>
                        </div>
                      </div>
                      <Badge className={getFitColor(size.fitCategory)}>
                        {size.fitCategory}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="guide">
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">How to Measure Your Anatomy</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                      <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg mb-3">
                        <p className="text-sm font-medium text-purple-900 dark:text-purple-100">
                          ⚧️ Intersex-Centered Approach: Our sizing honors all anatomical variations including intersex configurations, post-surgical anatomy, and all natural variations. No binary assumptions.
                        </p>
                      </div>
                      <div className="flex items-start space-x-2">
                        <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold">1</div>
                        <div>
                          <strong>Length:</strong> Measure your anatomy's full length in whatever state provides the most accurate representation of your body.
                        </div>
                      </div>
                      <div className="flex items-start space-x-2">
                        <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold">2</div>
                        <div>
                          <strong>Girth:</strong> Measure circumference at the widest point. For intersex anatomy or varied configurations, measure multiple points.
                        </div>
                      </div>
                      <div className="flex items-start space-x-2">
                        <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold">3</div>
                        <div>
                          <strong>3D Scanner Recommended:</strong> Our privacy-preserving 3D scanner accommodates all anatomical variations, including intersex configurations, without requiring self-categorization.
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Fit Preferences</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                      <div>
                        <strong className="text-blue-600">Snug Fit:</strong> Minimal movement, maximum security. Best for active use.
                      </div>
                      <div>
                        <strong className="text-green-600">Standard Fit:</strong> Balanced comfort and security. Most popular choice.
                      </div>
                      <div>
                        <strong className="text-orange-600">Large Fit:</strong> Comfortable, relaxed feel. Easy application and removal.
                      </div>
                      <div>
                        <strong className="text-purple-600">XL+ Fit:</strong> Maximum comfort for larger sizes or sensitive users.
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">TriSex.org Intersex-Centered vs Traditional Sizing</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      <div className="text-center">
                        <h4 className="font-medium mb-2">Traditional Binary</h4>
                        <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded">
                          <p>3-4 sizes (S, M, L, XL)</p>
                          <p className="text-red-600 text-xs mt-1">
                            Assumes binary anatomy, excludes intersex bodies
                          </p>
                        </div>
                      </div>
                      <div className="text-center">
                        <h4 className="font-medium mb-2">Other Custom</h4>
                        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded">
                          <p>10-12 sizes</p>
                          <p className="text-yellow-600 text-xs mt-1">
                            Better range, still binary-focused
                          </p>
                        </div>
                      </div>
                      <div className="text-center">
                        <h4 className="font-medium mb-2">TriSex.org ⚧️</h4>
                        <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded">
                          <p>{sizeChart.length} intersex-centered sizes</p>
                          <p className="text-green-600 text-xs mt-1">
                            {SIZE_WIDTHS_MM.length} widths × {SIZE_LENGTHS_MM.length} lengths — honors all anatomies, intersex variations as baseline
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <p className="text-sm text-purple-900 dark:text-purple-100">
                        <strong>⚧️ Why Intersex-Centered?</strong> Traditional sizing systems were designed around binary assumptions, leaving intersex individuals and those with anatomical variations to "fit in" to inadequate categories. Our system starts with intersex anatomical diversity as the foundation, ensuring everyone has access to precision protection without forced categorization.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}