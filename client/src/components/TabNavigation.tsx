import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  Users, 
  FileText,
  X,
  Maximize2,
  Minimize2,
  RotateCcw,
  Move
} from "lucide-react";

// Custom infinity icon component
const InfinityIcon = ({ className }: { className?: string }) => (
  <div className={className} style={{ fontSize: '1.2em', fontWeight: 'bold', lineHeight: 1 }}>
    ♾️
  </div>
);

// Custom yin-yang icon component
const YinYangIcon = ({ className }: { className?: string }) => (
  <div className={className} style={{ fontSize: '1.2em', fontWeight: 'bold', lineHeight: 1 }}>
    ☯️
  </div>
);

// Custom people hugging icon component
const PeopleHuggingIcon = ({ className }: { className?: string }) => (
  <div className={className} style={{ fontSize: '1.2em', fontWeight: 'bold', lineHeight: 1 }}>
    🫂
  </div>
);

// Custom galaxy icon component
const GalaxyIcon = ({ className }: { className?: string }) => (
  <div className={className} style={{ fontSize: '1.2em', fontWeight: 'bold', lineHeight: 1 }}>
    🌌
  </div>
);

type TabPosition = "top" | "bottom" | "left" | "right";

interface TabNavigationProps {
  children: React.ReactNode;
}

export function TabNavigation({ children }: TabNavigationProps) {
  const [, setLocation] = useLocation();
  const [tabPosition, setTabPosition] = useState<TabPosition>("right");
  const [isMinimized, setIsMinimized] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const tabs = [
    {
      id: "trillions-protection",
      title: "Trillions of Protection",
      description: "Comprehensive protection solutions at scale",
      icon: GalaxyIcon,
      color: "bg-neon-pink",
      route: "/products"
    },
    {
      id: "cooperative-matchmaking",
      title: "Co-operative Matchmaking",
      description: "Community-driven relationship building",
      icon: PeopleHuggingIcon,
      color: "bg-secondary",
      route: "/good-people"
    }
  ];

  const getPositionClasses = () => {
    const baseClasses = "fixed z-50 transition-all duration-300";
    
    if (isMinimized) {
      switch (tabPosition) {
        case "top":
          return `${baseClasses} top-4 right-4 w-12 h-12`;
        case "bottom":
          return `${baseClasses} bottom-4 right-4 w-12 h-12`;
        case "left":
          return `${baseClasses} left-4 top-1/2 -translate-y-1/2 w-12 h-12`;
        case "right":
          return `${baseClasses} right-4 top-1/2 -translate-y-1/2 w-12 h-12`;
      }
    }

    switch (tabPosition) {
      case "top":
        return `${baseClasses} top-0 left-0 right-0 h-20 border-b border-border`;
      case "bottom":
        return `${baseClasses} bottom-0 left-0 right-0 h-20 border-t border-border`;
      case "left":
        return `${baseClasses} left-0 top-0 bottom-0 w-80 border-r border-border`;
      case "right":
        return `${baseClasses} right-0 top-0 bottom-0 w-80 border-l border-border`;
    }
  };

  const getTabLayout = () => {
    if (tabPosition === "top" || tabPosition === "bottom") {
      return "flex flex-row justify-center items-center space-x-4";
    }
    return "flex flex-col space-y-4";
  };

  const handleTabClick = (route: string) => {
    setLocation(route);
  };

  const cyclePosition = () => {
    const positions: TabPosition[] = ["top", "right", "bottom", "left"];
    const currentIndex = positions.indexOf(tabPosition);
    const nextIndex = (currentIndex + 1) % positions.length;
    setTabPosition(positions[nextIndex]);
  };

  if (isMinimized) {
    return (
      <>
        {children}
        <div className={getPositionClasses()}>
          <Button
            onClick={() => setIsMinimized(false)}
            className="w-full h-full trisex-gradient hover:opacity-80"
            size="sm"
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
      </>
    );
  }

  return (
    <>
      {children}
      <Card className={getPositionClasses()}>
        <CardContent className="p-4 h-full">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-neon-pink flex items-center gap-2">
              <span className="text-xl">⚧️</span>
              TriSex.org
            </h3>
            <div className="flex items-center space-x-2">
              <Button
                onClick={cyclePosition}
                variant="ghost"
                size="sm"
                title="Change position"
              >
                <Move className="h-4 w-4" />
              </Button>
              <Button
                onClick={() => setIsMinimized(true)}
                variant="ghost"
                size="sm"
                title="Minimize"
              >
                <Minimize2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className={getTabLayout()}>
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                onClick={() => handleTabClick(tab.route)}
                variant="ghost"
                className={`${
                  tabPosition === "left" || tabPosition === "right" 
                    ? "w-full justify-start h-auto p-4" 
                    : "h-auto p-3"
                } hover:bg-card/50 border border-border/50 hover:border-border`}
              >
                <div className={`${
                  tabPosition === "left" || tabPosition === "right" 
                    ? "flex items-start space-x-3" 
                    : "flex flex-col items-center space-y-2"
                }`}>
                  <div className={`w-8 h-8 ${tab.color} rounded-lg flex items-center justify-center`}>
                    <tab.icon className="h-4 w-4 text-black" />
                  </div>
                  <div className={`${
                    tabPosition === "left" || tabPosition === "right" 
                      ? "text-left" 
                      : "text-center"
                  }`}>
                    <div className="font-medium text-sm text-foreground">
                      {tab.title}
                    </div>
                    {(tabPosition === "left" || tabPosition === "right") && (
                      <div className="text-xs text-muted-foreground mt-1">
                        {tab.description}
                      </div>
                    )}
                  </div>
                </div>
              </Button>
            ))}
          </div>

          {(tabPosition === "left" || tabPosition === "right") && (
            <div className="mt-6 p-3 bg-card/30 rounded-lg">
              <p className="text-xs text-muted-foreground text-center">
                Integrated TriSex.org ecosystem for sexual health empowerment, advance directives, and cooperative community building
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}