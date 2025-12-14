import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, ChevronDown, ChevronUp, GitBranch, Users, Calendar, Sparkles, Coins, Package, Share2 } from "lucide-react";

interface TeamChange {
  date: string;
  member: string;
  change: string;
  category: string;
}

export function BetaDisclaimer({ showExpanded = false }: { showExpanded?: boolean }) {
  const [isExpanded, setIsExpanded] = useState(showExpanded);

  const teamChanges: TeamChange[] = [
    {
      date: "2025-02-03",
      member: "User Request",
      change: "Contact phone number updated to +1 503 610 6762",
      category: "Contact"
    },
    {
      date: "2025-01-31",
      member: "AI Assistant",
      change: "Comprehensive 4D STI tracking system with sexual partner network management",
      category: "Feature"
    },
    {
      date: "2025-01-31", 
      member: "AI Assistant",
      change: "Integrated greensong.info/natural-senses framework for sensory-optimized products",
      category: "Integration"
    },
    {
      date: "2025-01-31",
      member: "AI Assistant", 
      change: "Cross-platform notification sync and smart break system implementation",
      category: "System"
    },
    {
      date: "2025-01-31",
      member: "AI Assistant",
      change: "Mentor/facilitator co-editing with healthcare system connectivity",
      category: "Healthcare"
    },
    {
      date: "2025-01-31",
      member: "AI Assistant",
      change: "Updated navigation menu with Fluck-focused branding (Generative Fluck Protection, etc.)",
      category: "UI/UX"
    },
    {
      date: "2025-01-31",
      member: "AI Assistant",
      change: "Contact phone number updated to 971 206 4171",
      category: "Contact"
    },
    {
      date: "2025-01-31",
      member: "User Request",
      change: "Beta disclaimer system with team change tracking implementation",
      category: "Documentation"
    }
  ];

  const categoryColors = {
    "Feature": "bg-blue-100 text-blue-800",
    "Integration": "bg-green-100 text-green-800", 
    "System": "bg-purple-100 text-purple-800",
    "Healthcare": "bg-red-100 text-red-800",
    "UI/UX": "bg-yellow-100 text-yellow-800",
    "Contact": "bg-gray-100 text-gray-800",
    "Documentation": "bg-indigo-100 text-indigo-800"
  };

  return (
    <div className="bg-gradient-to-r from-purple-50 via-pink-50 to-yellow-50 border border-purple-200 rounded-lg">
      {/* Main Banner - Remix Focus */}
      <div className="bg-gradient-to-r from-purple-100 via-pink-100 to-yellow-100 border-b border-purple-200 px-4 py-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-start space-x-3">
            <Sparkles className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-semibold text-purple-900">
                ⚧️ Open Source Sexual Health Platform - Remix & Build Your Own!
              </p>
              <p className="text-xs text-purple-700">
                Fork this Replit to create your own stablecoin, product line & interoperable STI data network
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <a
              href="/remix-replit"
              className="inline-flex items-center px-3 py-1.5 text-xs font-medium bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
              data-testid="link-remix-replit"
            >
              <GitBranch className="h-3 w-3 mr-1" />
              Remix Now
            </a>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-purple-700 hover:text-purple-900"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="h-4 w-4 mr-1" />
                  Less
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4 mr-1" />
                  More
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Interoperability Features */}
      <div className="px-4 py-3 bg-white/50 border-b border-purple-100">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="flex items-center space-x-2 text-xs text-gray-700">
            <Coins className="h-4 w-4 text-yellow-600" />
            <span>Custom Stablecoin</span>
          </div>
          <div className="flex items-center space-x-2 text-xs text-gray-700">
            <Package className="h-4 w-4 text-green-600" />
            <span>Your Product Line</span>
          </div>
          <div className="flex items-center space-x-2 text-xs text-gray-700">
            <Share2 className="h-4 w-4 text-blue-600" />
            <span>Interoperable STI Data</span>
          </div>
          <div className="flex items-center space-x-2 text-xs text-gray-700">
            <AlertTriangle className="h-4 w-4 text-orange-500" />
            <span>Beta Prototype</span>
          </div>
        </div>
      </div>

      {/* Expanded Team Changes */}
      {isExpanded && (
        <div className="p-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <GitBranch className="h-5 w-5 mr-2" />
                Recent Team Changes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {teamChanges.map((change, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-white rounded-lg border">
                  <div className="flex-shrink-0">
                    <Badge 
                      variant="secondary" 
                      className={categoryColors[change.category as keyof typeof categoryColors]}
                    >
                      {change.category}
                    </Badge>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{change.change}</p>
                    <div className="flex items-center space-x-4 mt-1">
                      <div className="flex items-center text-xs text-gray-500">
                        <Users className="h-3 w-3 mr-1" />
                        {change.member}
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="h-3 w-3 mr-1" />
                        {change.date}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}