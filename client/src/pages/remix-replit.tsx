import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Code,
  Copy,
  Download,
  Rocket,
  Lock,
  CheckCircle,
  ExternalLink,
  FileText,
  Database,
  Settings,
  Users,
  Heart,
  Zap,
  GitFork
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function RemixReplit() {
  const features = [
    {
      icon: Code,
      title: "Full Source Code",
      description: "Complete TypeScript/React codebase with all components, pages, and utilities"
    },
    {
      icon: Database,
      title: "Database Schema",
      description: "PostgreSQL schema with Drizzle ORM for intersex-centered sizing, reviews, and cooperative data"
    },
    {
      icon: Lock,
      title: "Security Features",
      description: "Age verification system, parental consent workflows, and genealogical verification"
    },
    {
      icon: FileText,
      title: "Wiki Content",
      description: "28-minute NanoHeal article, intersex-centered sizing guides, and all educational content"
    },
    {
      icon: Users,
      title: "Community Features",
      description: "Member reviews, LETS Framework mutual-credit primitives, cooperative ownership tools"
    },
    {
      icon: Heart,
      title: "Health Systems",
      description: "4D STI tracking, mood logging, natural senses customization, Medicaid EPD integration"
    }
  ];

  const setupSteps = [
    {
      number: 1,
      title: "Click Remix Template",
      description: "Creates a complete copy in your Replit account with all files and configurations",
      icon: GitFork
    },
    {
      number: 2,
      title: "Set Up Secrets",
      description: "Add your own DATABASE_URL and SESSION_SECRET in the Secrets pane",
      icon: Settings
    },
    {
      number: 3,
      title: "Customize Content",
      description: "Update branding, messaging, and cooperative values to match your mission",
      icon: Code
    },
    {
      number: 4,
      title: "Deploy Your Version",
      description: "Publish your customized sexual health platform with Replit's deployment",
      icon: Rocket
    }
  ];

  const useCases = [
    {
      title: "Regional Co-op Chapters",
      description: "Spin off TriSex.org for your local community with region-specific STI data and providers",
      example: "TriSex Seattle, TriSex Atlanta, TriSex London"
    },
    {
      title: "Specialized Health Focus",
      description: "Adapt the platform for specific health communities or demographic groups",
      example: "Deaf/HoH sexual health, neurodivergent-centered, rural access"
    },
    {
      title: "Educational Institutions",
      description: "Use as a teaching tool for sexual health education, cooperative economics, or web development",
      example: "University health centers, nursing programs, comp sci courses"
    },
    {
      title: "Research & Development",
      description: "Fork for testing new features, alternative sizing systems, or experimental treatments",
      example: "New bio-material research, alternative STI prevention methods"
    },
    {
      title: "International Adaptations",
      description: "Translate and localize for different languages, healthcare systems, and cultural contexts",
      example: "French Canadian, Spanish Latin American, Mandarin"
    },
    {
      title: "Allied Movements",
      description: "Build sister platforms for related reproductive justice movements",
      example: "Abortion access co-ops, gender-affirming care, disability justice"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-blue-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Intersex Healthcare Affirmation */}
        <Alert className="mb-8 bg-white dark:bg-gray-950 border-2 border-black dark:border-white">
          <Heart className="h-5 w-5 text-black dark:text-white" />
          <AlertDescription className="ml-2 text-black dark:text-white">
            <strong>Intersex Healthcare IS Everyone's Affirmation:</strong> Remixing centers intersex anatomy as the universal baseline—trans, non-binary, genderqueer, and quare embodiment are all respected within this participatory budgeting framework. There is no separate "transgender healthcare" category—all forks serve ALL bodies by design.
          </AlertDescription>
        </Alert>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="text-6xl">⚧️</div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Remix TriSex.org to Your Own Replit
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Spin off the entire TriSex.org platform to your own Replit account. Perfect for local co-op chapters, 
            specialized communities, or educational institutions.
          </p>
        </div>

        {/* Remix Button */}
        <Card className="mb-12 border-4 border-blue-500 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
          <CardContent className="pt-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">🚀 One-Click Remix</h2>
              <p className="text-muted-foreground mb-6">
                Create your own complete copy of TriSex.org with all features, content, and cooperative infrastructure
              </p>
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold text-lg px-8 py-6"
                asChild
                data-testid="button-remix-template"
              >
                <a href={window.location.origin} target="_blank" rel="noopener noreferrer">
                  <GitFork className="mr-2 h-6 w-6" />
                  Remix This Template
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <p className="text-sm text-muted-foreground mt-4">
                Opens in new tab • Creates copy in your Replit account • Free to remix
              </p>
            </div>
          </CardContent>
        </Card>

        {/* What's Included */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">📦 What's Included in Your Remix</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center text-lg">
                      <div className="bg-gradient-to-br from-blue-500 to-purple-500 p-2 rounded-lg mr-3">
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Setup Steps */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">🛠️ Quick Setup Guide</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {setupSteps.map((step) => {
              const Icon = step.icon;
              return (
                <Card key={step.number} className="relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-gradient-to-br from-blue-500 to-purple-500 text-white font-bold text-4xl px-4 py-2 rounded-bl-3xl opacity-20">
                    {step.number}
                  </div>
                  <CardHeader>
                    <div className="bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 p-3 rounded-lg w-fit mb-3">
                      <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <CardTitle className="text-lg">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Use Cases */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">💡 Remix Use Cases</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {useCases.map((useCase, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{useCase.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">{useCase.description}</p>
                  <Badge variant="secondary" className="text-xs">
                    Example: {useCase.example}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* License & Cooperative Principles */}
        <Card className="border-green-500/50 bg-green-50 dark:bg-green-950">
          <CardHeader>
            <CardTitle className="flex items-center text-green-900 dark:text-green-100">
              <Heart className="h-6 w-6 mr-2" />
              Open Source & Cooperative Principles
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-green-900 dark:text-green-100">Creative Commons BY-SA 4.0:</strong>
                <p className="text-sm text-green-800 dark:text-green-200 mt-1">
                  All TriSex.org code and content is licensed under Creative Commons Attribution-ShareAlike 4.0. 
                  You can remix, adapt, and build upon this work, even commercially, as long as you credit TriSex.org 
                  and license your new creations under identical terms.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-green-900 dark:text-green-100">Cooperative Solidarity:</strong>
                <p className="text-sm text-green-800 dark:text-green-200 mt-1">
                  We encourage remixing for cooperative, community-owned sexual health projects. If you build a 
                  for-profit version, consider sharing a portion of proceeds with the original TriSex.org co-op 
                  to support ongoing development and community health infrastructure.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-green-900 dark:text-green-100">Attribution Required:</strong>
                <p className="text-sm text-green-800 dark:text-green-200 mt-1">
                  Please include: "Based on TriSex.org (trisex.org) - Intersex-Centered Sexual Health Platform 
                  licensed under CC BY-SA 4.0" in your footer or about page.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Zap className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-green-900 dark:text-green-100">Federation Encouraged:</strong>
                <p className="text-sm text-green-800 dark:text-green-200 mt-1">
                  Your remixed platform can syndicate content across the fediverse (Bluesky, Mastodon, Pixelfed, Loops) 
                  to prevent platform monopolies and build a decentralized network of sexual health cooperatives.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer CTA */}
        <div className="mt-12 text-center">
          <Card className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border-2 border-blue-500">
            <CardContent className="pt-6 pb-6">
              <h3 className="text-2xl font-bold mb-4">Ready to Build Your Own Sexual Health Cooperative?</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Join the movement for decentralized, community-owned sexual health infrastructure. 
                Remix TriSex.org today and adapt it for your community's unique needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold"
                  asChild
                  data-testid="button-remix-footer"
                >
                  <a href={window.location.origin} target="_blank" rel="noopener noreferrer">
                    <GitFork className="mr-2 h-5 w-5" />
                    Remix Template Now
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  data-testid="button-view-source"
                >
                  <a href={window.location.origin} target="_blank" rel="noopener noreferrer">
                    <Code className="mr-2 h-5 w-5" />
                    View Source Code
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Help & Support */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Need help with your remix? Check the{" "}
            <a href="/wiki" className="text-blue-600 hover:underline">
              Knowledge Wiki
            </a>{" "}
            or join our community forum for support from other cooperative chapters.
          </p>
        </div>
      </div>
    </div>
  );
}
