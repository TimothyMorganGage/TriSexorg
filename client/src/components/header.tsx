import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X, User, LogOut } from "lucide-react";
import { useAuth } from "@/lib/auth";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location] = useLocation();
  const { user, logout } = useAuth();

  const quickLinks = [
    { name: "Products", href: "/products" },
    { name: "Education", href: "/education" },
    { name: "Community", href: "/community-forum" },
    { name: "STI Tracking", href: "/partner-sti-tracking" },
    { name: "Filings", href: "/filing-preparation" },
    { name: "Boundaries", href: "/boundaries-background-check" },
    { name: "Meta Lens Scan", href: "/meta-lens-scan" },
    { name: "Herbal Knowledge", href: "/herbal-knowledge" },
    { name: "Sniffies Policy", href: "/sniffies-policy" },
  ];

  const isActive = (path: string) => location === path;

  return (
    <header className="bg-black border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          <Link href="/" className="flex items-center space-x-2" data-testid="header-logo">
            <span className="text-2xl leading-none">⚧️</span>
            <span className="text-lg font-bold text-white tracking-tight hidden sm:block font-display">
              TriSex.org
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-1">
            {quickLinks.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-medium px-3 py-1.5 rounded-md transition-colors ${
                  isActive(item.href)
                    ? "bg-white text-black"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
                data-testid={`header-link-${item.name.toLowerCase()}`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-2">
            <div className="hidden md:flex items-center space-x-2">
              {user ? (
                <>
                  {user.role === "clinic_staff" && (
                    <Link href="/clinic-dashboard">
                      <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10" data-testid="header-dashboard-btn">
                        Dashboard
                      </Button>
                    </Link>
                  )}
                  <Link href="/saved-configurations">
                    <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10" data-testid="header-configs-btn">
                      <User className="h-4 w-4 mr-1" />
                      {user.username}
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={logout}
                    className="text-white/50 hover:text-red-400 hover:bg-white/5"
                    data-testid="header-logout-btn"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10" data-testid="header-signin-btn">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button size="sm" className="bg-white text-black hover:bg-white/90 font-semibold" data-testid="header-getstarted-btn">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>

            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-white hover:bg-white/10"
                data-testid="header-mobile-menu-btn"
              >
                {isMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-3 border-t border-white/10">
            <div className="space-y-1">
              {quickLinks.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block px-3 py-2 text-base font-medium rounded-md transition-colors ${
                    isActive(item.href)
                      ? "text-black bg-white"
                      : "text-white/70 hover:text-white hover:bg-white/10"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              <div className="pt-3 mt-3 border-t border-white/10">
                {user ? (
                  <div className="space-y-1">
                    <div className="flex items-center px-3 py-2">
                      <User className="h-5 w-5 text-white/40 mr-2" />
                      <span className="text-base font-medium text-white">
                        {user.username}
                      </span>
                    </div>
                    {user.role === "clinic_staff" && (
                      <Link
                        href="/clinic-dashboard"
                        className="block px-3 py-2 text-base font-medium text-white/70 hover:text-white"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                    )}
                    <Link
                      href="/saved-configurations"
                      className="block px-3 py-2 text-base font-medium text-white/70 hover:text-white"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      My Saved Configurations
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setIsMenuOpen(false);
                      }}
                      className="block w-full text-left px-3 py-2 text-base font-medium text-red-400 hover:text-red-300"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 px-3">
                    <Link
                      href="/login"
                      className="flex-1"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">Sign In</Button>
                    </Link>
                    <Link
                      href="/register"
                      className="flex-1"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Button className="w-full bg-white text-black hover:bg-white/90 font-semibold">Get Started</Button>
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
