import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, ChevronDown, ChevronUp, GitBranch, Users, Calendar, Sparkles, Package, Share2 } from "lucide-react";

interface TeamChange {
  date: string;
  member: string;
  change: string;
  category: string;
}

export function BetaDisclaimer({ showExpanded = false }: { showExpanded?: boolean }) {
  const [isExpanded, setIsExpanded] = useState(showExpanded);

  const teamChanges: TeamChange[] = [
    { date: "2025-02-03", member: "User Request", change: "Contact information updated", category: "Contact" },
    { date: "2025-01-31", member: "AI Assistant", change: "Comprehensive 4D STI tracking system with sexual partner network management", category: "Feature" },
    { date: "2025-01-31", member: "AI Assistant", change: "Integrated greensong.info/natural-senses framework for sensory-optimized products", category: "Integration" },
    { date: "2025-01-31", member: "AI Assistant", change: "Cross-platform notification sync and smart break system implementation", category: "System" },
    { date: "2025-01-31", member: "AI Assistant", change: "Mentor/facilitator co-editing with healthcare system connectivity", category: "Healthcare" },
    { date: "2025-01-31", member: "AI Assistant", change: "Updated navigation with TriSex-focused branding", category: "UI/UX" },
    { date: "2025-01-31", member: "User Request", change: "Beta disclaimer system with team change tracking", category: "Documentation" },
  ];

  const categoryColors: Record<string, string> = {
    "Feature": "bg-blue-500/20 text-blue-300 border-blue-500/20",
    "Integration": "bg-emerald-500/20 text-emerald-300 border-emerald-500/20",
    "System": "bg-purple-500/20 text-purple-300 border-purple-500/20",
    "Healthcare": "bg-red-500/20 text-red-300 border-red-500/20",
    "UI/UX": "bg-amber-500/20 text-amber-300 border-amber-500/20",
    "Contact": "bg-white/10 text-white/50 border-white/10",
    "Documentation": "bg-indigo-500/20 text-indigo-300 border-indigo-500/20",
  };

  return (
    <div className="bg-black">
      {/* Main Banner */}
      <div className="px-4 py-3">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-start space-x-3">
            <Sparkles className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <p className="text-sm font-semibold text-white">
                ⚧️ Open Source Sexual Health Platform — Remix & Build Your Own!
              </p>
              <p className="text-xs text-white/40">
                Fork this Replit to create your own product line & interoperable STI data network
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 flex-shrink-0">
            <div className="flex items-center gap-3 text-xs text-white/30 hidden sm:flex">
              <span className="flex items-center gap-1"><Package className="h-3 w-3" /> Products</span>
              <span className="flex items-center gap-1"><Share2 className="h-3 w-3" /> STI Data</span>
              <span className="flex items-center gap-1 text-amber-400/60"><AlertTriangle className="h-3 w-3" /> Beta</span>
            </div>
            <a
              href="/remix-replit"
              className="inline-flex items-center px-3 py-1.5 text-xs font-semibold bg-white text-black rounded-md hover:bg-white/90 transition-colors"
              data-testid="link-remix-replit"
            >
              <GitBranch className="h-3 w-3 mr-1" />
              Remix Now
            </a>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-white/40 hover:text-white hover:bg-white/5 h-7 px-2"
            >
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Expanded Team Changes */}
      {isExpanded && (
        <div className="border-t border-white/10 px-4 py-4">
          <div className="max-w-7xl mx-auto">
            <Card className="bg-white/3 border border-white/10">
              <CardHeader className="pb-3">
                <CardTitle className="text-base text-white flex items-center">
                  <GitBranch className="h-4 w-4 mr-2 text-white/40" />
                  Recent Team Changes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {teamChanges.map((change, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-white/3 rounded-lg border border-white/8">
                    <Badge variant="outline" className={`text-xs flex-shrink-0 ${categoryColors[change.category]}`}>
                      {change.category}
                    </Badge>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white/80">{change.change}</p>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="flex items-center text-xs text-white/30">
                          <Users className="h-3 w-3 mr-1" />{change.member}
                        </span>
                        <span className="flex items-center text-xs text-white/30">
                          <Calendar className="h-3 w-3 mr-1" />{change.date}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
