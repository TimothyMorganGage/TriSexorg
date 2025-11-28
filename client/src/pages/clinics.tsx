import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Hospital, UserCheck, Store, Building, Users, 
  BarChart3, Shield, Clock, CheckCircle, Heart,
  ArrowRight, Stethoscope 
} from "lucide-react";

export default function Clinics() {
  const features = [
    {
      icon: BarChart3,
      title: "Comprehensive Dashboard",
      description: "Real-time analytics, order tracking, and inventory management in one unified interface.",
    },
    {
      icon: Shield,
      title: "HIPAA Compliant",
      description: "Full compliance with healthcare privacy regulations and secure data handling.",
    },
    {
      icon: Users,
      title: "Patient Management",
      description: "Streamlined patient intake, assessment tracking, and consultation records.",
    },
    {
      icon: Clock,
      title: "Fast Turnaround",
      description: "3-5 day production time with real-time order status updates.",
    },
  ];

  const benefits = [
    {
      title: "Increased Patient Satisfaction",
      description: "Offer personalized solutions that improve comfort and compliance.",
      metric: "95% satisfaction rate",
    },
    {
      title: "Revenue Growth",
      description: "New revenue stream with high-margin custom products.",
      metric: "30% average increase",
    },
    {
      title: "Streamlined Operations",
      description: "Automated ordering and inventory management reduces staff workload.",
      metric: "50% time savings",
    },
    {
      title: "Educational Resources",
      description: "Access to comprehensive health education materials for patients.",
      metric: "100+ resources",
    },
  ];

  const distributionChannels = [
    {
      icon: Hospital,
      title: "Healthcare Clinics",
      description: "Partner clinics and health centers nationwide",
      color: "bg-primary/10 text-primary",
    },
    {
      icon: UserCheck,
      title: "Private Practice",
      description: "Individual healthcare providers and specialists",
      color: "bg-secondary/10 text-secondary",
    },
    {
      icon: Store,
      title: "Retail Partners",
      description: "Select pharmacies, wellness stores, and specialty retailers",
      color: "bg-accent/10 text-accent",
    },
    {
      icon: Building,
      title: "Community Spaces",
      description: "LGBTQ+ centers, bathhouses, and community health programs",
      color: "bg-purple-100 text-purple-600",
    },
  ];

  return (
    <div className="min-h-screen bg-surface">
      {/* Hero Section */}
      <section className="gradient-hero text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Intersex Healthcare Affirmation */}
          <Alert className="mb-8 bg-white/10 backdrop-blur border-white/20">
            <Heart className="h-5 w-5 text-pink-300" />
            <AlertDescription className="ml-2 text-white">
              <strong>Intersex Healthcare IS Everyone's Affirmation:</strong> Partner clinics provide care centered on intersex anatomy as the universal baseline—no separate "transgender healthcare" category exists because affirming care is the default.
            </AlertDescription>
          </Alert>

          <div className="text-center">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Partner with CustomFit Health
            </h1>
            <p className="text-xl lg:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Join our network of progressive healthcare providers offering personalized protection solutions
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/partnership">
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-neutral">
                  <Stethoscope className="mr-2 h-5 w-5" />
                  Become a Partner
                </Button>
              </Link>
              <Link href="/clinic-dashboard">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="bg-white/10 backdrop-blur-sm text-white border-white/20 hover:bg-white/20"
                >
                  View Dashboard Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-neutral mb-4">
              Complete Clinic Management Solution
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to integrate personalized protection into your practice
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-neutral mb-4">
              Proven Results for Partner Clinics
            </h2>
            <p className="text-xl text-gray-600">
              See the impact CustomFit Health has made for healthcare providers
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-6 w-6 text-secondary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-neutral mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-600 mb-3">{benefit.description}</p>
                    <Badge className="bg-secondary/10 text-secondary">
                      {benefit.metric}
                    </Badge>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Distribution Channels */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-neutral mb-4">
              Multiple Distribution Channels
            </h2>
            <p className="text-xl text-gray-600">
              Flexible options to serve your patients where they are
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {distributionChannels.map((channel, index) => {
              const Icon = channel.icon;
              return (
                <div key={index} className="text-center group">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform ${channel.color}`}>
                    <Icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-lg font-semibold text-neutral mb-2">
                    {channel.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{channel.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-neutral mb-4">
              Simple Integration Process
            </h2>
            <p className="text-xl text-gray-600">
              Get started with CustomFit Health in just a few steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-8">
              <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold text-neutral mb-4">
                Partnership Application
              </h3>
              <p className="text-gray-600">
                Complete our partnership application and schedule an onboarding call with our team.
              </p>
            </Card>

            <Card className="text-center p-8">
              <div className="w-12 h-12 bg-secondary text-white rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold text-neutral mb-4">
                Training & Setup
              </h3>
              <p className="text-gray-600">
                Receive comprehensive training on our platform and patient consultation processes.
              </p>
            </Card>

            <Card className="text-center p-8">
              <div className="w-12 h-12 bg-accent text-white rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold text-neutral mb-4">
                Launch & Support
              </h3>
              <p className="text-gray-600">
                Begin serving patients with ongoing support from our dedicated healthcare team.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-neutral mb-4">
            Ready to Transform Your Practice?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join the growing network of healthcare providers offering personalized protection solutions
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/partnership">
              <Button size="lg">
                Apply for Partnership
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/clinic-dashboard">
              <Button size="lg" variant="outline">
                View Dashboard Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
