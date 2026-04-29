import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { OnboardingTutorial } from "@/components/OnboardingTutorial";
import { BetaDisclaimer } from "@/components/BetaDisclaimer";
import {
  Leaf, Heart, Box, CheckCircle,
  Printer, Truck, Hospital, UserCheck, Store,
  Building, Ruler, Droplets, TestTube,
  Coins, BookOpen, Lightbulb, Users, Package, ArrowRight,
  Shapes
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Home() {
  const [showOnboarding, setShowOnboarding] = useState(false);

  const handleOnboardingComplete = (progress: any) => {
    localStorage.setItem('onboardingCompleted', 'true');
    localStorage.setItem('userProgress', JSON.stringify(progress));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Beta / Remix Banner */}
      <div className="border-b border-white/10">
        <BetaDisclaimer />
      </div>

      {/* Affirmation Alert */}
      <div className="bg-black border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <Alert className="bg-white/5 border border-white/15 rounded-lg">
            <Heart className="h-4 w-4 text-primary flex-shrink-0" />
            <AlertDescription className="ml-2 text-white/80 text-sm">
              <strong className="text-white">Intersex Healthcare IS Everyone's Affirmation:</strong>{" "}
              Centering intersex anatomy as the universal baseline — trans, non-binary, genderqueer, and quare embodiment are all respected within this participatory budgeting framework.
            </AlertDescription>
          </Alert>
        </div>
      </div>

      {/* Hero */}
      <section className="gradient-hero border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <span className="text-7xl lg:text-8xl">⚧️</span>
                <div>
                  <h1 className="text-5xl lg:text-7xl font-black leading-none text-white font-display">
                    TriSex<span className="text-primary">.org</span>
                  </h1>
                  <p className="text-white/50 text-sm mt-1 font-sans tracking-widest uppercase">Open Source Sexual Health</p>
                </div>
              </div>

              <h2 className="text-xl lg:text-2xl font-semibold text-white/90 leading-snug mb-4 font-display">
                Protection for Sexual Creativity & Reproductive Justice
              </h2>

              <p className="text-base text-white/60 mb-8 leading-relaxed font-sans">
                Precision sizing with 60+ custom fits, 4D STI bioregional monitoring, sustainable waterway microplastic materials, and cooperative sexual health principles for the full 2SLGBTIQA+ community.
              </p>

              <div className="flex flex-wrap gap-2 mb-8">
                <Badge className="bg-white/10 text-white/80 border border-white/20 hover:bg-white/15">
                  <Droplets className="w-3 h-3 mr-1" /> 4D STI Analytics
                </Badge>
                <Badge className="bg-white/10 text-white/80 border border-white/20 hover:bg-white/15">
                  <Ruler className="w-3 h-3 mr-1" /> Precision Sizing
                </Badge>
                <Badge className="bg-white/10 text-white/80 border border-white/20 hover:bg-white/15">
                  <TestTube className="w-3 h-3 mr-1" /> 3D Scanning
                </Badge>
                <Badge className="bg-white/10 text-white/80 border border-white/20 hover:bg-white/15">
                  <Coins className="w-3 h-3 mr-1" /> $TRISEXORG Stablecoin
                </Badge>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/inclusive-ordering">
                  <Button size="lg" className="bg-white text-black hover:bg-white/90 font-bold shadow-lg w-full sm:w-auto">
                    <Package className="mr-2 h-5 w-5" />
                    Start Inclusive Order
                  </Button>
                </Link>
                <Link href="/4d-sti-intervention">
                  <Button size="lg" variant="outline" className="border-white/25 text-white hover:bg-white/10 w-full sm:w-auto">
                    <Droplets className="mr-2 h-5 w-5" />
                    4D STI System
                  </Button>
                </Link>
                <Link href="/education">
                  <Button size="lg" variant="ghost" className="text-white/60 hover:text-white hover:bg-white/5 w-full sm:w-auto">
                    <BookOpen className="mr-2 h-5 w-5" />
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>

            <div className="hidden lg:grid grid-cols-2 gap-4">
              {[
                { icon: Leaf, title: "Eco-Friendly", desc: "Recycled waterway microplastics", color: "text-emerald-400" },
                { icon: Heart, title: "Inclusive Design", desc: "For all bodies and identities", color: "text-primary" },
                { icon: Box, title: "3D Printed", desc: "Custom-fit precision technology", color: "text-sky-400" },
                { icon: Coins, title: "Cooperative", desc: "Community-owned & governed", color: "text-amber-400" },
              ].map(({ icon: Icon, title, desc, color }) => (
                <Card key={title} className="bg-white/5 border-white/10 hover:bg-white/8 transition-colors">
                  <CardContent className="p-5">
                    <Icon className={`${color} h-6 w-6 mb-3`} />
                    <h3 className="text-white font-semibold text-sm mb-1">{title}</h3>
                    <p className="text-white/50 text-xs leading-relaxed">{desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Offerings for AMAB / AFAB / AXAB Intersex People */}
      <section className="py-20 bg-surface border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="bg-primary/15 text-primary border border-primary/30 mb-4 text-xs">
              <Shapes className="w-3 h-3 mr-1" /> 86 named intersex variations · 8 categories
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-3 font-display">
              Offerings for AMAB, AFAB & AXAB Intersex People
            </h2>
            <p className="text-white/60 text-base max-w-3xl mx-auto leading-relaxed">
              Intersex bodies are assigned a sex marker at birth — but that marker rarely matches the
              body's actual anatomy. Every fold, sleeve, pouch, and dam in our catalogue is sized for
              the anatomy you have, not the letter on your birth certificate.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {[
              {
                marker: "AMAB",
                expansion: "Assigned Male At Birth",
                accent: "border-sky-400/30 hover:border-sky-400/50",
                accentText: "text-sky-300",
                pathways: "Often 46,XY DSD pathways: PAIS, MAIS, 5α-reductase, hypospadias spectrum, micropenis, chordee, diphallia, penoscrotal transposition, Klinefelter (47,XXY).",
                fits: [
                  "Inverted Sleeve sized to your shaft length & girth (30–200 mm)",
                  "Urethral position select for distal / mid-shaft / proximal / perineal hypospadias",
                  "Anchor pattern (standard / wide / asymmetric / strap) for penoscrotal & bifid scrotum",
                  "Dual-sleeve option (1 or 2) for diphallia",
                  "Shorter-default sleeves for micropenis & post-orchiectomy bodies",
                ],
                count: "≈ 24 catalogue variations commonly assigned M",
              },
              {
                marker: "AFAB",
                expansion: "Assigned Female At Birth",
                accent: "border-pink-400/30 hover:border-pink-400/50",
                accentText: "text-pink-300",
                pathways: "Often 46,XX DSD pathways: classic & non-classic CAH, MRKH, Müllerian agenesis, longitudinal/transverse vaginal septa, uterine didelphys, clitoromegaly, ovotesticular DSD, Turner (45,X).",
                fits: [
                  "Cup-Pouch sized to canal depth (30–180 mm) for shortened, blind-ending or constructed canals",
                  "Canal-girth slider (80–150 mm) for variable receptive fits",
                  "Frontal sliders for clitoromegaly & virilized phenotypes",
                  "Shallower-depth defaults for MRKH, cervico-vaginal agenesis, CAIS, Swyer, Turner",
                  "Wing-Extended Dam for oral-frontal & oral-vulva acts",
                ],
                count: "≈ 28 catalogue variations commonly assigned F",
              },
              {
                marker: "AXAB",
                expansion: "Assigned X / Intersex At Birth",
                accent: "border-amber-400/30 hover:border-amber-400/50",
                accentText: "text-amber-300",
                pathways: "Legally recordable in some jurisdictions (Germany, Australia, Aotearoa NZ, Iceland, Argentina, India third-gender, parts of Canada). Often ovotesticular DSD, mixed gonadal dysgenesis, 46,XX/46,XY chimerism, ambiguous external genitalia.",
                fits: [
                  "No presumed default zone — both Inverted Sleeve and Cup-Pouch are first-class options",
                  "Multi-fold balance (versatile / receptive / penetrative) selectable per session",
                  "Open zone selection across oral / anal / vaginal / frontal / neovaginal",
                  "Variation-specific sliders for asymmetric external anatomy",
                  "Amber consult flag offered for any variation where measurement matters",
                ],
                count: "≈ 34 catalogue variations where M/F assignment is itself contested",
              },
            ].map((card) => (
              <Card key={card.marker} className={`bg-white/3 border ${card.accent} transition-all`}>
                <CardContent className="p-6 flex flex-col h-full" data-testid={`marker-card-${card.marker.toLowerCase()}`}>
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className={`text-3xl font-black font-display ${card.accentText}`}>{card.marker}</span>
                    <span className="text-white/40 text-xs font-mono">{card.expansion}</span>
                  </div>
                  <p className="text-white/55 text-xs italic mb-4 leading-relaxed">{card.pathways}</p>
                  <ul className="space-y-2 mb-4 flex-1">
                    {card.fits.map((fit) => (
                      <li key={fit} className="flex items-start gap-2 text-xs text-white/70 leading-snug">
                        <CheckCircle className={`h-3.5 w-3.5 ${card.accentText} mt-0.5 flex-shrink-0`} />
                        <span>{fit}</span>
                      </li>
                    ))}
                  </ul>
                  <Badge variant="outline" className="border-white/15 text-white/45 text-[10px] self-start">
                    {card.count}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-4 mb-8">
            <Link href="/inclusive-ordering">
              <Button className="w-full bg-white text-black hover:bg-white/90 font-semibold" data-testid="cta-marker-configure">
                <Shapes className="mr-2 h-4 w-4" />
                Open the 86-variation configurator
              </Button>
            </Link>
            <Link href="/anatomy-scanning">
              <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10" data-testid="cta-marker-scan">
                <Ruler className="mr-2 h-4 w-4" />
                Body-measurement scan flow
              </Button>
            </Link>
            <Link href="/infinitely-affirmative-protection">
              <Button variant="ghost" className="w-full text-white/60 hover:text-white hover:bg-white/5" data-testid="cta-marker-affirmative">
                <Heart className="mr-2 h-4 w-4" />
                Infinitely affirmative protection
              </Button>
            </Link>
          </div>

          <div className="p-4 border border-dashed border-amber-500/50 bg-amber-500/5 rounded-lg text-xs text-amber-200/90 leading-relaxed space-y-1.5">
            <div className="font-semibold text-amber-300">Honesty notes — sex-marker offerings</div>
            <p>
              <strong>AMAB / AFAB / AXAB are recorded sex-marker assignments, not anatomy descriptors.</strong>{" "}
              Many intersex people are assigned M or F at birth despite intersex bodies, often without
              their own informed consent and sometimes accompanied by surgical "normalization" the
              person did not request. AXAB / "X" is legally available in only some jurisdictions.
            </p>
            <p>
              The category counts above are TriSex.org's own grouping of how the 86 variations in our
              co-operator-assembled catalogue most commonly map to assignment pathways. They are not
              clinical statistics, not population estimates, and not a registry. Your variation may sit
              in more than one card or none of them.
            </p>
            <p>
              Every fitting note in the configurator is a design hypothesis. TriSex.org has not
              manufactured custom-fit units for every named variation, has not measured barrier
              integrity across these specific anatomies, and is not claiming an off-the-shelf fit.
              Variation selection is self-reported, not stored or shared outside the order summary,
              and not used for any registry, research, or insurance purpose.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-black border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-3 font-display">
              How CustomFit Works
            </h2>
            <p className="text-white/50 text-lg max-w-2xl mx-auto">
              A simple, private process for your perfect fit
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {[
              { icon: UserCheck, step: "01", title: "Private Assessment", desc: "Complete our confidential questionnaire about your needs, preferences, and body measurements using our secure platform.", color: "text-primary" },
              { icon: Printer, step: "02", title: "Custom Manufacturing", desc: "Our 3D printing technology creates your personalized product using eco-friendly materials and precise specifications.", color: "text-secondary" },
              { icon: Truck, step: "03", title: "Discreet Delivery", desc: "Receive your custom products through your preferred clinic or direct delivery in unmarked, secure packaging.", color: "text-white/70" },
            ].map(({ icon: Icon, step, title, desc, color }) => (
              <div key={step} className="text-center group">
                <div className="relative mb-6">
                  <div className="w-16 h-16 border border-white/15 rounded-2xl flex items-center justify-center mx-auto group-hover:border-white/30 transition-colors bg-white/5">
                    <Icon className={`${color} h-7 w-7`} />
                  </div>
                  <span className="absolute -top-2 -right-2 text-xs font-mono text-white/30 font-bold">{step}</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-3 font-display">{title}</h3>
                <p className="text-white/50 leading-relaxed text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Distribution Channels */}
      <section className="py-20 bg-surface border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-3 font-display">
              Accessible Distribution
            </h2>
            <p className="text-white/50 text-lg">Available through multiple channels to meet you where you are</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Hospital, label: "Healthcare Clinics", desc: "Partner clinics and health centers nationwide", color: "text-primary" },
              { icon: UserCheck, label: "Private Practice", desc: "Individual healthcare providers and specialists", color: "text-secondary" },
              { icon: Store, label: "Retail Partners", desc: "Pharmacies, wellness stores, specialty retailers", color: "text-white/70" },
              { icon: Building, label: "Community Spaces", desc: "2SLGBTIQA+ centers, bathhouses, community programs", color: "text-amber-400" },
            ].map(({ icon: Icon, label, desc, color }) => (
              <div key={label} className="group text-center p-6 rounded-xl border border-white/10 hover:border-white/20 bg-white/3 hover:bg-white/5 transition-all">
                <div className="w-12 h-12 rounded-xl border border-white/10 flex items-center justify-center mx-auto mb-4 group-hover:border-white/20 transition-colors">
                  <Icon className={`${color} h-6 w-6`} />
                </div>
                <h3 className="text-white font-semibold mb-2 text-sm">{label}</h3>
                <p className="text-white/40 text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Learning Resources */}
      <section className="py-20 bg-black border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-3 font-display">
              Cultural Wisdom & Learning
            </h2>
            <p className="text-white/50 text-lg mb-8 max-w-2xl mx-auto">
              Stories, peer mentors, and health equity analytics — all in one place
            </p>
            <Button
              size="lg"
              onClick={() => setShowOnboarding(true)}
              className="bg-white text-black hover:bg-white/90 font-semibold"
            >
              <Lightbulb className="mr-2 h-5 w-5" />
              Start Learning Tutorial
            </Button>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 mb-10">
            {[
              {
                href: "/interactive-stories",
                title: "Cultural Wisdom Stories",
                desc: "Learn from Indigenous elders, curanderas, and traditional healers through interactive storytelling.",
                tags: ["Medicine Wheel", "Curanderismo", "African Healing"],
                badge: "150 XP",
                color: "border-primary/20 hover:border-primary/40",
                btnClass: "bg-primary text-black hover:bg-primary/90",
                btnLabel: "Explore Stories",
              },
              {
                href: "/peer-mentor",
                title: "Peer Mentor Network",
                desc: "Connect with mentors using intelligence frameworks and earn stablecoin dividends for contributions.",
                tags: ["Infinite Intelligence", "Multicultural", "Time Banking"],
                badge: "Earn Dividends",
                color: "border-secondary/20 hover:border-secondary/40",
                btnClass: "bg-secondary text-black hover:bg-secondary/90",
                btnLabel: "Find Mentors",
              },
              {
                href: "/analytics",
                title: "Learning Analytics",
                desc: "Monitor your health equity journey, cultural competency growth, and community impact metrics.",
                tags: ["Health Equity", "DALY Impact", "Cultural Growth"],
                badge: "Track Progress",
                color: "border-white/10 hover:border-white/20",
                btnClass: "bg-white text-black hover:bg-white/90",
                btnLabel: "View Analytics",
              },
            ].map(({ href, title, desc, tags, badge, color, btnClass, btnLabel }) => (
              <Card key={title} className={`bg-white/3 border ${color} transition-all duration-200`}>
                <CardContent className="p-7 flex flex-col h-full">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-bold text-white font-display">{title}</h3>
                    <Badge className="bg-white/10 text-white/70 border-white/15 text-xs ml-2 flex-shrink-0">{badge}</Badge>
                  </div>
                  <p className="text-white/50 text-sm leading-relaxed mb-5 flex-1">{desc}</p>
                  <div className="flex flex-wrap gap-2 mb-5">
                    {tags.map(t => (
                      <Badge key={t} variant="outline" className="border-white/15 text-white/40 text-xs">{t}</Badge>
                    ))}
                  </div>
                  <Link href={href}>
                    <Button className={`w-full ${btnClass} font-semibold`}>
                      {btnLabel}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Gboard Integration */}
          <Card className="bg-white/3 border border-white/10">
            <CardContent className="p-8">
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-3 font-display flex items-center">
                    <Lightbulb className="mr-3 h-6 w-6 text-amber-400" />
                    Smart Keyboard Integration
                  </h3>
                  <p className="text-white/50 text-sm mb-5 leading-relaxed">
                    Learn inclusive language through our Gboard integration with real-time suggestions,
                    cultural terminology, and voice input accessibility features.
                  </p>
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {["Inclusive Language", "Voice Accessibility", "Cultural Terms", "Multi-language"].map(f => (
                      <div key={f} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-secondary flex-shrink-0" />
                        <span className="text-sm text-white/60">{f}</span>
                      </div>
                    ))}
                  </div>
                  <Button
                    onClick={() => setShowOnboarding(true)}
                    className="bg-white text-black hover:bg-white/90 font-semibold"
                  >
                    Try Interactive Tutorial
                  </Button>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                  <div className="text-xs text-white/30 mb-2 font-mono">Try typing: "sexual creativity"</div>
                  <div className="border border-white/15 rounded-lg p-3 text-sm text-white/70 bg-white/5 font-mono mb-3">
                    sexual creativity
                  </div>
                  <div className="space-y-2">
                    <div className="text-xs bg-primary/20 text-primary rounded-lg px-3 py-1.5 inline-block">
                      → sexual wellness
                    </div>
                    <div className="text-xs bg-secondary/20 text-secondary rounded-lg px-3 py-1.5 inline-block ml-2">
                      → reproductive justice
                    </div>
                  </div>
                  <Badge className="mt-3 bg-amber-500/20 text-amber-400 border-amber-500/20 text-xs">Live Demo</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-surface">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 font-display">
            Ready to Get Started?
          </h2>
          <p className="text-white/50 text-lg mb-8">
            Join thousands who have discovered personalized protection and cultural wisdom
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products">
              <Button size="lg" className="bg-white text-black hover:bg-white/90 font-bold">
                <Ruler className="mr-2 h-5 w-5" />
                Start Customization
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              onClick={() => setShowOnboarding(true)}
              className="border-white/20 text-white hover:bg-white/10"
            >
              <Lightbulb className="mr-2 h-5 w-5" />
              Take Tutorial
            </Button>
            <Link href="/partnership">
              <Button size="lg" variant="ghost" className="text-white/50 hover:text-white hover:bg-white/5">
                Partner With Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <OnboardingTutorial
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        onComplete={() => handleOnboardingComplete({})}
      />
    </div>
  );
}
