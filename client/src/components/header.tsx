import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X, User, LogOut } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { ReplitBadge } from "@/components/ReplitBadge";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location] = useLocation();
  const { user, logout } = useAuth();

  const quickLinks = [
    { name: "Products", href: "/products" },
    { name: "Education", href: "/education" },
    { name: "Community", href: "/community-forum" },
  ];

  const isActive = (path: string) => location === path;

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          <Link href="/" className="flex items-center space-x-2" data-testid="header-logo">
            <span className="text-3xl">⚧️</span>
            <span 
              className="text-xl font-bold text-neutral hidden sm:block"
              style={{ 
                fontFamily: 'cursive',
                textShadow: '2px 2px 4px rgba(0,0,0,0.3), -1px -1px 2px rgba(255,255,255,0.5)',
                filter: 'contrast(1.2)'
              }}
            >
              TriSex.org
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-4">
            {quickLinks.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-medium px-3 py-1.5 rounded-full transition-colors ${
                  isActive(item.href)
                    ? "bg-primary/10 text-primary"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
                data-testid={`header-link-${item.name.toLowerCase()}`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-2">
            <ReplitBadge variant="compact" theme="light" />
            
            <div className="hidden md:flex items-center space-x-2">
              {user ? (
                <>
                  {user.role === "clinic_staff" && (
                    <Link href="/clinic-dashboard">
                      <Button variant="outline" size="sm" data-testid="header-dashboard-btn">
                        Dashboard
                      </Button>
                    </Link>
                  )}
                  <Link href="/saved-configurations">
                    <Button variant="ghost" size="sm" data-testid="header-configs-btn">
                      <User className="h-4 w-4 mr-1" />
                      {user.username}
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={logout}
                    className="text-gray-600 hover:text-red-600"
                    data-testid="header-logout-btn"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost" size="sm" data-testid="header-signin-btn">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button size="sm" data-testid="header-getstarted-btn">
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
          <div className="md:hidden py-3 border-t">
            <div className="space-y-1">
              {quickLinks.map((item) => (
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
              
              <div className="pt-3 mt-3 border-t border-gray-200">
                {user ? (
                  <div className="space-y-1">
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
                    <Link
                      href="/saved-configurations"
                      className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-primary"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      My Saved Configurations
                    </Link>
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
                  <div className="flex items-center space-x-2 px-3">
                    <Link
                      href="/login"
                      className="flex-1"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Button variant="outline" className="w-full">Sign In</Button>
                    </Link>
                    <Link
                      href="/register"
                      className="flex-1"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Button className="w-full">Get Started</Button>
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