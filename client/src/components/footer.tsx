import { Link } from "wouter";
import { ShieldHalf, Mail, Phone, MapPin, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <span className="text-3xl">⚧️</span>
              <span className="text-2xl font-bold">
                TriSex.org
              </span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Custom-fit protection for every body. Made from sustainable waterway microplastic materials with inclusive design for the full 2SLGBTIQA+ community.
            </p>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <Heart className="h-4 w-4 text-primary" />
              <span>Made with care for all bodies</span>
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Products</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/products" className="text-gray-200 hover:text-primary transition-colors block py-1">
                  External Protection
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-gray-200 hover:text-primary transition-colors block py-1">
                  Internal Protection
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-gray-200 hover:text-primary transition-colors block py-1">
                  Multi-Anatomy Kits
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-gray-200 hover:text-primary transition-colors block py-1">
                  Barrier Dams
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-gray-200 hover:text-primary transition-colors block py-1">
                  Custom Sizing
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/education" className="text-gray-200 hover:text-primary transition-colors block py-1">
                  Sexual Health Education
                </Link>
              </li>
              <li>
                <Link href="/education" className="text-gray-200 hover:text-primary transition-colors block py-1">
                  2SLGBTIQA+ Terminology
                </Link>
              </li>
              <li>
                <Link href="/education" className="text-gray-200 hover:text-primary transition-colors block py-1">
                  Anatomy Guides
                </Link>
              </li>
              <li>
                <Link href="/clinics" className="text-gray-200 hover:text-primary transition-colors block py-1">
                  Healthcare Providers
                </Link>
              </li>
              <li>
                <Link href="/partnership" className="text-gray-200 hover:text-primary transition-colors block py-1">
                  Partner with Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-3 text-gray-300">
                <Mail className="h-4 w-4 text-primary" />
                <span>
                  <span 
                    className="font-bold text-white" 
                    style={{ 
                      fontFamily: 'cursive',
                      textShadow: '2px 2px 4px rgba(0,0,0,0.8), -1px -1px 2px rgba(255,255,255,0.3)',
                      filter: 'contrast(1.5)'
                    }}
                  >
                    Fluck
                  </span>
                  {' ‽'}
                </span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <Phone className="h-4 w-4 text-primary" />
                <span>971 206 4171</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <MapPin className="h-4 w-4 text-primary" />
                <span>Global distribution through healthcare networks</span>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="font-medium mb-2">Distribution Partners</h4>
              <ul className="text-xs text-gray-400 space-y-1">
                <li>• Health clinics & hospitals</li>
                <li>• 2SLGBTIQ+ community centers</li>
                <li>• Sex shops</li>
                <li>• Religious centers</li>
                <li>• Bathhouses & wellness centers</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-400">
              <p>Yours courtesy of American Care Planning - Licensed under <a href="https://creativecommons.org/licenses/by-sa/4.0/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Creative Commons BY-SA 4.0</a></p>
              <p className="mt-1">Sustainable protection. Inclusive design. Body-positive healthcare.</p>
              <p className="mt-1 flex items-center text-xs text-gray-500">
                <span className="mr-2">Made on</span>
                <a href="https://replit.com" target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-primary transition-colors">
                  <svg className="w-4 h-4 mr-1" viewBox="0 0 32 32" fill="currentColor">
                    <path d="M7 5.5C7 4.67 7.67 4 8.5 4h15C24.33 4 25 4.67 25 5.5v21c0 .83-.67 1.5-1.5 1.5h-15c-.83 0-1.5-.67-1.5-1.5v-21zM14 10v12l6-6-6-6z"/>
                  </svg>
                  Replit
                </a>
              </p>
              <p className="mt-2 text-xs text-yellow-400 font-medium">What's up‽ This is an early prototype - features may not work properly and content is preliminary</p>
            </div>
            
            <div className="flex items-center space-x-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                Accessibility
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}