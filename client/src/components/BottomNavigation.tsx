import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { 
  Heart,
  Users,
  BookOpen,
  Activity,
  Clock,
  Calendar,
  Brain,
  MessageCircle,
  ChevronUp,
  ChevronDown,
  Sparkles,
  TrendingUp,
  History,
  Star,
  Home,
  BarChart3,
  FileText,
  Coins,
  Building2,
  CircleDot,
  Scan,
  Hand,
  HandHeart,
  Scale,
  Globe,
  Package
} from "lucide-react";

interface NavItem {
  name: string;
  href: string;
  icon: any;
  category: string;
  priority: number;
  keywords: string[];
}

const isExternalLink = (href: string) => href.startsWith('http://') || href.startsWith('https://');

const NavLink = ({ href, className, children }: { href: string; className: string; children: React.ReactNode }) => {
  if (isExternalLink(href)) {
    return <a href={href} target="_blank" rel="noopener noreferrer" className={className}>{children}</a>;
  }
  return <Link href={href} className={className}>{children}</Link>;
};

const allNavItems: NavItem[] = [
  { name: "Home", href: "/", icon: Home, category: "core", priority: 10, keywords: ["home", "start", "main"] },
  { name: "Products", href: "/products", icon: Package, category: "products", priority: 9, keywords: ["products", "protection", "buy", "shop"] },
  { name: "Manufacturing", href: "/manufacturing", icon: Building2, category: "products", priority: 7, keywords: ["manufacturing", "sourcing", "factory", "supply", "fulfilment", "production"] },
  { name: "Polyglamorous People", href: "/polyglamorous-people", icon: Users, category: "community", priority: 6, keywords: ["polyglamorous", "polyamorous", "polyamory", "poly", "open", "swinging", "monogamish", "relationship-anarchy", "RA", "ENM"] },
  { name: "Oral Barriers", href: "/oral-barriers", icon: CircleDot, category: "products", priority: 8, keywords: ["oral", "barriers", "msm", "sides"] },
  { name: "Hand Barriers", href: "/hand-barriers", icon: Hand, category: "products", priority: 8, keywords: ["hand", "finger", "gloves", "glove", "finger cot", "fingering", "manual", "barriers"] },
  { name: "Anatomy Scanning", href: "/anatomy-scanning", icon: Scan, category: "health", priority: 8, keywords: ["scan", "anatomy", "3d", "custom"] },
  { name: "Education", href: "/education", icon: BookOpen, category: "education", priority: 7, keywords: ["learn", "education", "health", "info"] },
  { name: "Interactive Stories", href: "/interactive-stories", icon: Sparkles, category: "education", priority: 6, keywords: ["stories", "interactive", "learn"] },
  { name: "Community Forum", href: "/community-forum", icon: MessageCircle, category: "community", priority: 7, keywords: ["forum", "community", "discuss", "chat"] },
  { name: "Peer Mentor", href: "/peer-mentor", icon: HandHeart, category: "community", priority: 6, keywords: ["mentor", "peer", "support", "help"] },
  { name: "Partnership", href: "/partnership", icon: Users, category: "community", priority: 5, keywords: ["partner", "clinic", "healthcare"] },
  { name: "Economic Impact", href: "/economic-impact", icon: TrendingUp, category: "economics", priority: 7, keywords: ["daly", "economics", "impact", "health"] },
  { name: "Monogamy Economics", href: "/monogamy-economics", icon: Scale, category: "economics", priority: 6, keywords: ["monogamy", "economics", "relationship"] },
  { name: "Open Books", href: "/open-books", icon: FileText, category: "economics", priority: 5, keywords: ["books", "finance", "open", "transparent"] },
  { name: "STI Tracking", href: "/partner-sti-tracking", icon: Activity, category: "health", priority: 8, keywords: ["sti", "tracking", "health", "4d"] },
  { name: "Mood Tracker", href: "/mood-logging", icon: Heart, category: "wellness", priority: 6, keywords: ["mood", "feelings", "emotions", "track"] },
  { name: "Time Tracker", href: "/time-tracker", icon: Clock, category: "wellness", priority: 5, keywords: ["time", "TriSexs", "track", "hours"] },
  { name: "Calendar", href: "/calendar-integration", icon: Calendar, category: "wellness", priority: 5, keywords: ["calendar", "schedule", "sync"] },
  { name: "Smart Breaks", href: "/smart-break-system", icon: Brain, category: "wellness", priority: 4, keywords: ["breaks", "rest", "health", "smart"] },
  { name: "Mentor/Facilitator", href: "/mentor-facilitator", icon: Users, category: "wellness", priority: 4, keywords: ["mentor", "facilitator", "support"] },
  { name: "Wiki", href: "/wiki", icon: BookOpen, category: "resources", priority: 6, keywords: ["wiki", "knowledge", "info", "learn"] },
  { name: "Analytics", href: "/analytics", icon: BarChart3, category: "resources", priority: 5, keywords: ["analytics", "data", "stats", "charts"] },
  { name: "Age Verification", href: "/age-verification", icon: FileText, category: "resources", priority: 4, keywords: ["age", "verify", "verification"] },
  { name: "Member Reviews", href: "/infinitely-affirmative-protection", icon: Star, category: "community", priority: 5, keywords: ["reviews", "feedback", "members"] },
  { name: "Remix to Replit", href: "/remix-replit", icon: Globe, category: "resources", priority: 3, keywords: ["remix", "replit", "fork", "copy"] },
];

const HISTORY_KEY = "trisex_nav_history";
const MAX_HISTORY = 20;

export function BottomNavigation() {
  const [location] = useLocation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [navHistory, setNavHistory] = useState<string[]>([]);
  const [suggestedItems, setSuggestedItems] = useState<NavItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(HISTORY_KEY);
    if (stored) {
      setNavHistory(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    if (location && location !== "/") {
      setNavHistory(prev => {
        const updated = [location, ...prev.filter(h => h !== location)].slice(0, MAX_HISTORY);
        localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
        return updated;
      });
    }
  }, [location]);

  useEffect(() => {
    const suggested = getSuggestedNavItems();
    setSuggestedItems(suggested);
  }, [location, navHistory]);

  const getSuggestedNavItems = (): NavItem[] => {
    const currentItem = allNavItems.find(item => item.href === location);
    const currentCategory = currentItem?.category || "core";
    
    const visitCounts: Record<string, number> = {};
    navHistory.forEach((href, index) => {
      const weight = MAX_HISTORY - index;
      visitCounts[href] = (visitCounts[href] || 0) + weight;
    });

    const scoredItems = allNavItems
      .filter(item => item.href !== location)
      .map(item => {
        let score = item.priority;
        
        if (item.category === currentCategory) {
          score += 5;
        }
        
        if (visitCounts[item.href]) {
          score += Math.min(visitCounts[item.href] / 2, 10);
        }
        
        const currentIndex = navHistory.indexOf(location);
        if (currentIndex >= 0 && currentIndex < navHistory.length - 1) {
          const nextInHistory = navHistory[currentIndex + 1];
          if (item.href === nextInHistory) {
            score += 3;
          }
        }

        if (currentCategory === "products" && (item.category === "health" || item.category === "education")) {
          score += 2;
        }
        if (currentCategory === "health" && item.category === "wellness") {
          score += 2;
        }
        if (currentCategory === "community" && item.category === "economics") {
          score += 2;
        }

        return { ...item, score };
      })
      .sort((a, b) => (b as any).score - (a as any).score);

    return scoredItems.slice(0, 8);
  };

  const recentItems = navHistory
    .slice(0, 4)
    .map(href => allNavItems.find(item => item.href === href))
    .filter(Boolean) as NavItem[];

  const isActive = (path: string) => location === path;

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "core": return "bg-purple-500";
      case "products": return "bg-blue-500";
      case "health": return "bg-green-500";
      case "wellness": return "bg-pink-500";
      case "community": return "bg-orange-500";
      case "economics": return "bg-yellow-500";
      case "education": return "bg-cyan-500";
      case "resources": return "bg-gray-500";
      default: return "bg-primary";
    }
  };

  return (
    <div className="sticky bottom-0 z-40 bg-background border-t shadow-lg">
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        {isExpanded && (
          <div className="py-4 border-b">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1">
                  <History className="h-3 w-3" /> Recent
                </h4>
                <div className="space-y-1">
                  {recentItems.length > 0 ? recentItems.map(item => (
                    <NavLink
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-2 p-2 rounded-lg text-sm transition-colors ${
                        isActive(item.href) 
                          ? "bg-primary/10 text-primary" 
                          : "hover:bg-muted"
                      }`}
                    >
                      <item.icon className="h-4 w-4" />
                      <span className="truncate">{item.name}</span>
                    </NavLink>
                  )) : (
                    <p className="text-xs text-muted-foreground p-2">No recent pages</p>
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1">
                  <Package className="h-3 w-3" /> Products
                </h4>
                <div className="space-y-1">
                  {allNavItems.filter(i => i.category === "products").slice(0, 4).map(item => (
                    <NavLink
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-2 p-2 rounded-lg text-sm transition-colors ${
                        isActive(item.href) 
                          ? "bg-primary/10 text-primary" 
                          : "hover:bg-muted"
                      }`}
                    >
                      <item.icon className="h-4 w-4" />
                      <span className="truncate">{item.name}</span>
                    </NavLink>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1">
                  <Heart className="h-3 w-3" /> Health & Wellness
                </h4>
                <div className="space-y-1">
                  {allNavItems.filter(i => i.category === "health" || i.category === "wellness").slice(0, 4).map(item => (
                    <NavLink
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-2 p-2 rounded-lg text-sm transition-colors ${
                        isActive(item.href) 
                          ? "bg-primary/10 text-primary" 
                          : "hover:bg-muted"
                      }`}
                    >
                      <item.icon className="h-4 w-4" />
                      <span className="truncate">{item.name}</span>
                    </NavLink>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1">
                  <Users className="h-3 w-3" /> Community
                </h4>
                <div className="space-y-1">
                  {allNavItems.filter(i => i.category === "community").slice(0, 4).map(item => (
                    <NavLink
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-2 p-2 rounded-lg text-sm transition-colors ${
                        isActive(item.href) 
                          ? "bg-primary/10 text-primary" 
                          : "hover:bg-muted"
                      }`}
                    >
                      <item.icon className="h-4 w-4" />
                      <span className="truncate">{item.name}</span>
                    </NavLink>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t">
              <h4 className="text-xs font-semibold text-muted-foreground mb-2">All Pages</h4>
              <ScrollArea className="w-full">
                <div className="flex gap-2 pb-2">
                  {allNavItems.map(item => (
                    <NavLink
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-colors ${
                        isActive(item.href)
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted hover:bg-muted/80"
                      }`}
                    >
                      <item.icon className="h-3 w-3" />
                      {item.name}
                    </NavLink>
                  ))}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </div>
          </div>
        )}

        <div className="py-2">
          <div className="flex items-center justify-between">
            <ScrollArea className="flex-1">
              <div className="flex items-center gap-1 sm:gap-2">
                <NavLink
                  href="/"
                  className={`flex flex-col items-center justify-center p-2 rounded-lg min-w-[60px] transition-colors ${
                    isActive("/") ? "bg-primary/10 text-primary" : "hover:bg-muted"
                  }`}
                  data-testid="nav-home"
                >
                  <Home className="h-5 w-5" />
                  <span className="text-[10px] mt-1">Home</span>
                </NavLink>

                {suggestedItems.slice(0, 6).map(item => (
                  <NavLink
                    key={item.href}
                    href={item.href}
                    className={`flex flex-col items-center justify-center p-2 rounded-lg min-w-[60px] transition-colors ${
                      isActive(item.href) ? "bg-primary/10 text-primary" : "hover:bg-muted"
                    }`}
                    data-testid={`nav-${item.href.replace("/", "")}`}
                  >
                    <div className="relative">
                      <item.icon className="h-5 w-5" />
                      <div className={`absolute -top-1 -right-1 w-2 h-2 rounded-full ${getCategoryColor(item.category)}`} />
                    </div>
                    <span className="text-[10px] mt-1 max-w-[60px] truncate">{item.name}</span>
                  </NavLink>
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="ml-2 flex-shrink-0"
              data-testid="nav-expand-toggle"
            >
              {isExpanded ? (
                <ChevronDown className="h-5 w-5" />
              ) : (
                <ChevronUp className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
