import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MedicineWheelLogo } from "@/components/MedicineWheelLogo";
import { 
  ShieldCheck, Leaf, Heart, Box, CheckCircle, 
  Printer, Truck, Hospital, UserCheck, Store, 
  Building, Play, Ruler, Droplets, Palette, TestTube,
  Coins, Share2, BookOpen
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative gradient-hero text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        
        {/* Geometric pattern background */}
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              {/* Medicine Wheel Logo */}
              <div className="flex justify-center lg:justify-start mb-8">
                <MedicineWheelLogo size={120} />
              </div>
              
              {/* Black and White Spectrum Typography Prototypes */}
              <div className="space-y-4 mb-6">
                {/* Prototype 1: Bold Gradient */}
                <h1 className="text-5xl lg:text-7xl font-black leading-tight">
                  <span className="bg-gradient-to-r from-black via-gray-500 to-white bg-clip-text text-transparent">
                    fluck
                  </span>
                  <span className="text-accent">.wtf</span>
                </h1>
                
                {/* Prototype 2: Outlined White */}
                <div className="text-4xl lg:text-6xl font-bold leading-tight opacity-80">
                  <span className="text-white" style={{ textShadow: '2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000' }}>
                    fluck
                  </span>
                  <span className="text-accent">.wtf</span>
                </div>
                
                {/* Prototype 3: Spectrum Fill */}
                <div className="text-3xl lg:text-5xl font-extrabold leading-tight opacity-60">
                  <span className="bg-gradient-to-r from-gray-300 to-gray-700 bg-clip-text text-transparent">
                    fluck
                  </span>
                  <span className="text-accent">.wtf</span>
                </div>
              </div>
              
              <h2 className="text-2xl lg:text-3xl font-bold leading-tight mb-6 text-white font-cinzel">
                Protection for Every Body & Anatomy
              </h2>
              <p className="text-xl lg:text-2xl text-blue-100 mb-8 leading-relaxed font-coolvetica">
                Precision sizing with 60+ custom fits for better love-making. 4D STI intervention 
                through bioregional sewer & water sampling. Sustainable ocean plastic materials 
                with cooperative sexual health principles for the full 2SLGBTIQ+ community.
              </p>
              
              {/* Feature Badges */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-3 mb-8">
                <Badge variant="secondary" className="bg-blue-100 text-blue-800 px-3 py-1">
                  <Droplets className="w-4 h-4 mr-1" />
                  4D STI Analytics
                </Badge>
                <Badge variant="secondary" className="bg-green-100 text-green-800 px-3 py-1">
                  <Ruler className="w-4 h-4 mr-1" />
                  MyONE Sizing
                </Badge>
                <Badge variant="secondary" className="bg-purple-100 text-purple-800 px-3 py-1">
                  <Palette className="w-4 h-4 mr-1" />
                  Color Wheel
                </Badge>
                <Badge variant="secondary" className="bg-orange-100 text-orange-800 px-3 py-1">
                  <TestTube className="w-4 h-4 mr-1" />
                  3D Scanning
                </Badge>
                <Badge variant="secondary" className="bg-cyan-100 text-cyan-800 px-3 py-1">
                  <Heart className="w-4 h-4 mr-1" />
                  DALY Tracking
                </Badge>
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 px-3 py-1">
                  <Coins className="w-4 h-4 mr-1" />
                  Stablecoin Dividends
                </Badge>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 justify-center lg:justify-start">
                <Link href="/inclusive-ordering">
                  <Button size="lg" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg w-full">
                    <ShieldCheck className="mr-2 h-5 w-5" />
                    Start Inclusive Order
                  </Button>
                </Link>
                <Link href="/domain-purchase">
                  <Button size="lg" className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white shadow-lg w-full">
                    <ShieldCheck className="mr-2 h-5 w-5" />
                    Register fluck.wtf
                  </Button>
                </Link>
                <Link href="/wiki">
                  <Button size="lg" className="bg-accent hover:bg-accent/90 text-neutral w-full">
                    <BookOpen className="mr-2 h-5 w-5" />
                    Knowledge Wiki
                  </Button>
                </Link>
                <Link href="/4d-sti-intervention">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="bg-blue-500/20 backdrop-blur-sm text-white border-blue-300/30 hover:bg-blue-500/30 w-full"
                  >
                    <Droplets className="mr-2 h-4 w-4" />
                    4D STI System
                  </Button>
                </Link>
                <Link href="/anatomy-scanning">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="bg-white/10 backdrop-blur-sm text-white border-white/20 hover:bg-white/20 w-full"
                  >
                    <TestTube className="mr-2 h-4 w-4" />
                    3D Scanning
                  </Button>
                </Link>
                <Link href="/economic-impact">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="bg-gradient-to-r from-yellow-500/20 to-green-500/20 backdrop-blur-sm text-white border-yellow-300/30 hover:bg-yellow-500/30 w-full"
                  >
                    <Heart className="mr-2 h-4 w-4" />
                    DALY Dashboard
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="relative">
              {/* Floating cards showcasing key features */}
              <div className="relative h-96 lg:h-[500px]">
                <Card className="absolute top-0 right-0 bg-white/10 backdrop-blur-sm border-white/20 shadow-xl transform rotate-3 hover:rotate-0 transition-transform">
                  <CardContent className="p-6 text-center">
                    <Leaf className="text-accent h-8 w-8 mb-3 mx-auto" />
                    <h3 className="font-semibold text-lg mb-2 text-white">Eco-Friendly</h3>
                    <p className="text-blue-100 text-sm">Made from recycled ocean plastic</p>
                  </CardContent>
                </Card>
                
                <Card className="absolute top-20 left-0 bg-white/10 backdrop-blur-sm border-white/20 shadow-xl transform -rotate-2 hover:rotate-0 transition-transform">
                  <CardContent className="p-6 text-center">
                    <Heart className="text-accent h-8 w-8 mb-3 mx-auto" />
                    <h3 className="font-semibold text-lg mb-2 text-white">Inclusive Design</h3>
                    <p className="text-blue-100 text-sm">For all bodies and identities</p>
                  </CardContent>
                </Card>
                
                <Card className="absolute bottom-0 right-8 bg-white/10 backdrop-blur-sm border-white/20 shadow-xl transform rotate-1 hover:rotate-0 transition-transform">
                  <CardContent className="p-6 text-center">
                    <Box className="text-accent h-8 w-8 mb-3 mx-auto" />
                    <h3 className="font-semibold text-lg mb-2 text-white">3D Printed</h3>
                    <p className="text-blue-100 text-sm">Custom-fit technology</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-neutral mb-4">
              How CustomFit Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our simple, private process ensures you get the perfect fit for your needs
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            <div className="text-center group">
              <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors">
                <UserCheck className="text-primary h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-neutral mb-4">1. Private Assessment</h3>
              <p className="text-gray-600 leading-relaxed">
                Complete our confidential questionnaire about your needs, preferences, and body 
                measurements using our secure platform.
              </p>
            </div>
            
            <div className="text-center group">
              <div className="bg-secondary/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-secondary/20 transition-colors">
                <Printer className="text-secondary h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-neutral mb-4">2. Custom Manufacturing</h3>
              <p className="text-gray-600 leading-relaxed">
                Our 3D printing technology creates your personalized product using eco-friendly 
                materials and precise specifications.
              </p>
            </div>
            
            <div className="text-center group">
              <div className="bg-accent/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-accent/20 transition-colors">
                <Truck className="text-accent h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-neutral mb-4">3. Discreet Delivery</h3>
              <p className="text-gray-600 leading-relaxed">
                Receive your custom products through your preferred clinic or direct delivery 
                in unmarked, secure packaging.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Access & Distribution */}
      <section className="py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-neutral mb-4">
              Accessible Distribution
            </h2>
            <p className="text-xl text-gray-600">
              Available through multiple channels to meet you where you are
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                <Hospital className="text-primary h-8 w-8" />
              </div>
              <h3 className="text-lg font-semibold text-neutral mb-2">Healthcare Clinics</h3>
              <p className="text-gray-600 text-sm">
                Available at partner clinics and health centers nationwide
              </p>
            </div>
            
            <div className="text-center group">
              <div className="bg-secondary/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-secondary/20 transition-colors">
                <UserCheck className="text-secondary h-8 w-8" />
              </div>
              <h3 className="text-lg font-semibold text-neutral mb-2">Private Practice</h3>
              <p className="text-gray-600 text-sm">
                Through individual healthcare providers and specialists
              </p>
            </div>
            
            <div className="text-center group">
              <div className="bg-accent/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-accent/20 transition-colors">
                <Store className="text-accent h-8 w-8" />
              </div>
              <h3 className="text-lg font-semibold text-neutral mb-2">Retail Partners</h3>
              <p className="text-gray-600 text-sm">
                Select pharmacies, wellness stores, and specialty retailers
              </p>
            </div>
            
            <div className="text-center group">
              <div className="bg-purple-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
                <Building className="text-purple-600 h-8 w-8" />
              </div>
              <h3 className="text-lg font-semibold text-neutral mb-2">Community Spaces</h3>
              <p className="text-gray-600 text-sm">
                LGBTQ+ centers, bathhouses, and community health programs
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-neutral mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands who have already discovered personalized protection
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products">
              <Button size="lg">
                <Ruler className="mr-2 h-5 w-5" />
                Start Customization
              </Button>
            </Link>
            <Link href="/partnership">
              <Button size="lg" variant="outline">
                Partner With Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
