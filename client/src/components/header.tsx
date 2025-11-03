import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ShieldHalf, Menu, X, User, LogOut } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { ReplitBadge } from "@/components/ReplitBadge";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location] = useLocation();
  const { user, logout } = useAuth();

  const navigation = [
    { name: "Generative TriSex Protection", href: "/products" },
    { name: "BAD Co-op Dashboard", href: "/bad-coop-dashboard" },
    { name: "🌌 Member Reviews", href: "/infinitely-affirmative-protection" },
    { name: "Good TriSex Education", href: "/interactive-stories" },
    { name: "Great TriSex Health", href: "/education" },
    { name: "Groovy TriSex Community", href: "/partnership" },
    { name: "Mood Tracker", href: "/mood-logging" },
    { name: "Time Tracker", href: "/time-tracker" },
    { name: "Calendar Sync", href: "/calendar-integration" },
    { name: "Smart Breaks", href: "/smart-break-system" },
    { name: "Mentor & Facilitator", href: "/mentor-facilitator" },
    { name: "4D STI Tracking", href: "/partner-sti-tracking" },
    { name: "Age Verification", href: "/age-verification" },
    { name: "Wiki", href: "/wiki" },
    { name: "Analytics", href: "/analytics" },
  ];

  const isActive = (path: string) => location === path;

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <ShieldHalf className="h-6 w-6 text-white" />
            </div>
            <span 
              className="text-2xl font-bold text-neutral"
              style={{ 
                fontFamily: 'cursive',
                textShadow: '2px 2px 4px rgba(0,0,0,0.3), -1px -1px 2px rgba(255,255,255,0.5)',
                filter: 'contrast(1.2)'
              }}
            >
              ⚧️ TriSex.org
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive(item.href)
                    ? "text-primary border-b-2 border-primary pb-1"
                    : "text-gray-600"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <ReplitBadge variant="compact" theme="light" />
            {user ? (
              <div className="flex items-center space-x-3">
                {user.role === "clinic_staff" && (
                  <Link href="/clinic-dashboard">
                    <Button variant="outline" size="sm">
                      Dashboard
                    </Button>
                  </Link>
                )}
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <User className="h-4 w-4" />
                  <span>{user.username}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="text-gray-600 hover:text-red-600"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block px-3 py-2 text-base font-medium rounded-md ${
                    isActive(item.href)
                      ? "text-primary bg-primary/10"
                      : "text-gray-600 hover:text-primary hover:bg-gray-50"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              <div className="pt-4 pb-3 border-t border-gray-200">
                {user ? (
                  <div className="space-y-2">
                    <div className="flex items-center px-3 py-2">
                      <User className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-base font-medium text-gray-800">
                        {user.username}
                      </span>
                    </div>
                    {user.role === "clinic_staff" && (
                      <Link
                        href="/clinic-dashboard"
                        className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-primary"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        logout();
                        setIsMenuOpen(false);
                      }}
                      className="block w-full text-left px-3 py-2 text-base font-medium text-red-600 hover:text-red-800"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link
                      href="/login"
                      className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-primary"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/register"
                      className="block px-3 py-2 text-base font-medium text-primary"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Get Started
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}