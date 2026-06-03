import { Link } from "wouter";
import { Mail, MapPin, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-black border-t border-white/10 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">⚧️</span>
              <span className="text-xl font-bold font-display">TriSex.org</span>
            </div>
            <p className="text-white/40 text-sm leading-relaxed">
              TriSex Perfect Protection for every body. Sustainable waterway microplastic materials with inclusive design for the full 2SLGBTIQA+ community.
            </p>
            <div className="flex items-center space-x-2 text-xs text-white/30">
              <Heart className="h-3 w-3 text-primary" />
              <span>Made with care for all bodies</span>
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4 tracking-wide uppercase">Products</h3>
            <ul className="space-y-2 text-sm">
              {[
                "External Protection",
                "Internal Protection",
                "Multi-Anatomy Kits",
                "Barrier Dams",
                "Custom Sizing",
              ].map((item) => (
                <li key={item}>
                  <Link href="/products" className="text-white/40 hover:text-white transition-colors block py-0.5">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4 tracking-wide uppercase">Resources</h3>
            <ul className="space-y-2 text-sm">
              {[
                { label: "Sexual Health Education", href: "/education" },
                { label: "2SLGBTIQA+ Guides", href: "/education" },
                { label: "Healthcare Providers", href: "/clinics" },
                { label: "Partner with Us", href: "/partnership" },
                { label: "Community Forum", href: "/community-forum" },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-white/40 hover:text-white transition-colors block py-0.5">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4 tracking-wide uppercase">Contact</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-3 text-white/40">
                <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                <Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link>
              </div>
              <div className="flex items-start space-x-3 text-white/40">
                <MapPin className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                <span>Global distribution through healthcare networks</span>
              </div>
            </div>
            <div className="mt-6">
              <h4 className="text-xs font-semibold text-white/30 mb-2 uppercase tracking-wide">Distribution Partners</h4>
              <ul className="text-xs text-white/25 space-y-1">
                <li>Health clinics & hospitals</li>
                <li>2SLGBTIQ+ community centers</li>
                <li>Bathhouses & wellness centers</li>
                <li>Religious centers</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="text-xs text-white/30 space-y-1">
              <p>
                Licensed under{" "}
                <a
                  href="https://creativecommons.org/licenses/by-sa/4.0/"
                  className="text-primary hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Creative Commons BY-SA 4.0
                </a>
              </p>
              <p>Sustainable protection. Inclusive design. Body-positive healthcare.</p>
              <p className="text-amber-400/70 font-medium">Early prototype — features may not work properly and content is preliminary</p>
            </div>

            <div className="flex items-center gap-6 text-xs text-white/30">
              <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="/terms-of-service" className="hover:text-white transition-colors">Terms</Link>
              <Link href="/accessibility" className="hover:text-white transition-colors">Accessibility</Link>
              <a
                href="https://replit.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:text-white transition-colors"
                aria-label="Built on Replit — visit replit.com (opens in new tab)"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true" focusable="false">
                  <path d="M7 5.5C7 4.67 7.67 4 8.5 4h15C24.33 4 25 4.67 25 5.5v21c0 .83-.67 1.5-1.5 1.5h-15c-.83 0-1.5-.67-1.5-1.5v-21zM14 10v12l6-6-6-6z"/>
                </svg>
                Built on Replit
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
