import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Accessibility as AccessibilityIcon, 
  Eye, 
  Ear, 
  Hand,
  Keyboard,
  Monitor,
  Smartphone,
  Volume2,
  CheckCircle,
  Globe,
  Heart,
  Settings
} from "lucide-react";
import { Link } from "wouter";

export default function Accessibility() {
  const lastUpdated = "November 22, 2025";
  const [settings, setSettings] = useState({
    screenReader: false,
    highContrast: false,
    largeText: false,
    signLanguage: false,
    brailleOutput: false,
    voiceNavigation: false,
    reducedMotion: false,
    keyboardOnly: false
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <AccessibilityIcon className="h-12 w-12 text-primary mr-4" />
            <div>
              <h1 className="text-4xl font-bold text-foreground">
                Accessibility Statement
              </h1>
              <p className="text-xl text-muted-foreground mt-2">
                Sexual health for everyone, regardless of ability
              </p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <Badge variant="outline">Last Updated: {lastUpdated}</Badge>
            <Badge variant="outline">WCAG 2.1 AA</Badge>
            <Badge variant="outline">Section 508 Compliant</Badge>
          </div>
        </div>

        {/* Quick Summary */}
        <Alert className="mb-8 bg-purple-50 dark:bg-purple-900/20 border-purple-200">
          <CheckCircle className="h-5 w-5 text-purple-600" />
          <AlertDescription className="ml-2">
            <strong>Our Commitment:</strong> TriSex.org is designed for full accessibility across visual, auditory, motor, and cognitive disabilities. We support screen readers, sign language interpretation, braille displays, voice navigation, and more. Everyone deserves access to sexual health resources.
          </AlertDescription>
        </Alert>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="support">Support</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="mr-3 h-6 w-6 text-red-500" />
                  Accessibility Philosophy
                </CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <p className="text-muted-foreground">
                  <strong>Sexual health is a human right.</strong> Disability should never be a barrier to accessing custom-fit protection, STI testing resources, or relationship matchmaking. TriSex.org is built from the ground up with accessibility as a core feature, not an afterthought.
                </p>

                <h3 className="text-lg font-bold mt-6 mb-3">Our Accessibility Principles</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <h4 className="font-bold flex items-center mb-2">
                      <Eye className="mr-2 h-5 w-5 text-blue-600" />
                      Visual Accessibility
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Full screen reader support (NVDA, JAWS, VoiceOver)</li>
                      <li>• High contrast mode for low vision users</li>
                      <li>• Adjustable text sizing (up to 200%)</li>
                      <li>• Braille display compatibility</li>
                      <li>• Semantic HTML with proper ARIA labels</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-muted/30 rounded-lg">
                    <h4 className="font-bold flex items-center mb-2">
                      <Ear className="mr-2 h-5 w-5 text-green-600" />
                      Auditory Accessibility
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• American Sign Language (ASL) video interpretation</li>
                      <li>• British Sign Language (BSL) support</li>
                      <li>• Captions for all video/audio content</li>
                      <li>• Visual alerts for audio notifications</li>
                      <li>• Text-based alternatives for all audio</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-muted/30 rounded-lg">
                    <h4 className="font-bold flex items-center mb-2">
                      <Hand className="mr-2 h-5 w-5 text-purple-600" />
                      Motor Accessibility
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Full keyboard navigation (no mouse required)</li>
                      <li>• Voice command support</li>
                      <li>• Large touch targets (minimum 44x44px)</li>
                      <li>• Switch control compatibility</li>
                      <li>• Reduced motion options</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-muted/30 rounded-lg">
                    <h4 className="font-bold flex items-center mb-2">
                      <Keyboard className="mr-2 h-5 w-5 text-orange-600" />
                      Cognitive Accessibility
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Plain language explanations</li>
                      <li>• Consistent navigation patterns</li>
                      <li>• Step-by-step guided workflows</li>
                      <li>• Visual progress indicators</li>
                      <li>• Error messages with clear solutions</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>WCAG 2.1 AA Compliance</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  TriSex.org meets Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-bold mb-2 text-sm">Perceivable</h4>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>✅ Text alternatives for non-text content</li>
                      <li>✅ Captions and transcripts for multimedia</li>
                      <li>✅ Adaptable layouts (mobile, tablet, desktop)</li>
                      <li>✅ Distinguishable colors (4.5:1 contrast ratio)</li>
                    </ul>
                  </div>

                  <div className="p-3 border rounded-lg">
                    <h4 className="font-bold mb-2 text-sm">Operable</h4>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>✅ Keyboard accessible (all functions)</li>
                      <li>✅ Enough time to read and use content</li>
                      <li>✅ No seizure-inducing flashing content</li>
                      <li>✅ Multiple ways to navigate (search, menu, sitemap)</li>
                    </ul>
                  </div>

                  <div className="p-3 border rounded-lg">
                    <h4 className="font-bold mb-2 text-sm">Understandable</h4>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>✅ Readable text (plain language)</li>
                      <li>✅ Predictable operation (consistent patterns)</li>
                      <li>✅ Input assistance (error prevention & correction)</li>
                      <li>✅ Clear labels and instructions</li>
                    </ul>
                  </div>

                  <div className="p-3 border rounded-lg">
                    <h4 className="font-bold mb-2 text-sm">Robust</h4>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>✅ Compatible with assistive technologies</li>
                      <li>✅ Valid HTML/CSS/ARIA markup</li>
                      <li>✅ Works across browsers and devices</li>
                      <li>✅ Progressive enhancement approach</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="features" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Monitor className="mr-3 h-6 w-6" />
                  Accessibility Features
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-bold mb-3 flex items-center">
                      <Ear className="mr-2 h-5 w-5 text-blue-600" />
                      Deaf & Hard of Hearing Support
                    </h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Comprehensive support for D/deaf and hard of hearing community members:
                    </p>
                    <ul className="text-sm text-muted-foreground space-y-2">
                      <li>• <strong>ASL Video Interpretation:</strong> American Sign Language videos for key educational content</li>
                      <li>• <strong>BSL Support:</strong> British Sign Language for UK/international users</li>
                      <li>• <strong>Real-time Captions:</strong> Live captions for video calls with partners/counselors</li>
                      <li>• <strong>Visual Notifications:</strong> Flashing alerts for messages, test results, appointment reminders</li>
                      <li>• <strong>TTY/TDD Support:</strong> Telephone accessibility for customer service: +1 503 610 6762</li>
                    </ul>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-bold mb-3 flex items-center">
                      <Eye className="mr-2 h-5 w-5 text-green-600" />
                      Blind & Low Vision Support
                    </h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Full functionality for blind and low vision users:
                    </p>
                    <ul className="text-sm text-muted-foreground space-y-2">
                      <li>• <strong>Screen Reader Optimization:</strong> Tested with NVDA, JAWS, VoiceOver, TalkBack</li>
                      <li>• <strong>Braille Display Output:</strong> Compatible with refreshable braille displays</li>
                      <li>• <strong>High Contrast Mode:</strong> Black/white, yellow/black, custom color schemes</li>
                      <li>• <strong>Text Resizing:</strong> Up to 200% without loss of functionality</li>
                      <li>• <strong>Descriptive Alt Text:</strong> All images, graphs, diagrams fully described</li>
                      <li>• <strong>Tactile Product Samples:</strong> Request 3D-printed tactile models of custom products</li>
                    </ul>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-bold mb-3 flex items-center">
                      <Hand className="mr-2 h-5 w-5 text-purple-600" />
                      Motor Disability Support
                    </h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Designed for users with limited mobility or dexterity:
                    </p>
                    <ul className="text-sm text-muted-foreground space-y-2">
                      <li>• <strong>Keyboard Navigation:</strong> Complete site navigation without mouse (Tab, Arrow keys, Enter)</li>
                      <li>• <strong>Voice Commands:</strong> "Hey TriSex" voice control for hands-free operation</li>
                      <li>• <strong>Switch Control:</strong> Compatible with assistive switch devices</li>
                      <li>• <strong>Large Touch Targets:</strong> Minimum 44x44px buttons (exceeds 40x40px WCAG requirement)</li>
                      <li>• <strong>Drag-Free Interface:</strong> All interactions work with single click/tap</li>
                      <li>• <strong>Sticky Keys Support:</strong> Works with Windows/macOS sticky keys for modifier combinations</li>
                    </ul>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-bold mb-3 flex items-center">
                      <Globe className="mr-2 h-5 w-5 text-orange-600" />
                      Multi-Platform Accessibility
                    </h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Consistent accessibility across all platforms:
                    </p>
                    <ul className="text-sm text-muted-foreground space-y-2">
                      <li>• <strong>Web (Desktop):</strong> Full WCAG 2.1 AA compliance</li>
                      <li>• <strong>Mobile (iOS/Android):</strong> Native accessibility API support</li>
                      <li>• <strong>Apple Health Integration:</strong> VoiceOver support for health data sync</li>
                      <li>• <strong>MyChart Integration:</strong> Healthcare system accessibility maintained</li>
                      <li>• <strong>iMessage/WhatsApp:</strong> Accessible messaging for mentor/facilitator</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Intersex Healthcare IS Everyone's Affirmation</CardTitle>
              </CardHeader>
              <CardContent>
                <Alert className="mb-4 bg-purple-50 dark:bg-purple-900/20 border-purple-200">
                  <Heart className="h-5 w-5 text-purple-600" />
                  <AlertDescription className="ml-2">
                    <strong>Core Philosophy:</strong> By centering intersex anatomy as the universal baseline—trans, non-binary, genderqueer, and quare embodiment are all respected within this participatory budgeting framework. There is no separate category to opt out of—intersex-affirming care IS the standard for ALL bodies by design.
                  </AlertDescription>
                </Alert>

                <p className="text-sm text-muted-foreground mb-4">
                  Traditional healthcare creates arbitrary binary categories (male/female), then treats any deviation as "special" care requiring separate consent. This is backwards. Human anatomy exists on a spectrum—intersex bodies represent the natural center of this spectrum.
                </p>

                <div className="space-y-3">
                  <div className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded border border-purple-200">
                    <strong className="block mb-2 text-sm">Universal Anatomical Baseline</strong>
                    <p className="text-xs text-muted-foreground">
                      When intersex anatomy is the design foundation (not binary male/female), every body receives care designed for natural human variation. Products fit ALL bodies—cisgender, transgender, intersex, and non-binary—because the baseline already accounts for the full spectrum.
                    </p>
                  </div>

                  <div className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded border border-purple-200">
                    <strong className="block mb-2 text-sm">No "Special" Healthcare Categories</strong>
                    <p className="text-xs text-muted-foreground">
                      When affirming care is the default, there's nothing to "opt out" of. You can't opt out of standard care. Politicians can't restrict care that doesn't exist as a separate category. Intersex-centered healthcare makes discriminatory healthcare policies architecturally impossible.
                    </p>
                  </div>

                  <div className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded border border-purple-200">
                    <strong className="block mb-2 text-sm">Affirmation by Design</strong>
                    <p className="text-xs text-muted-foreground">
                      Every measurement, every product, every interaction is designed around natural anatomical diversity. Trans users aren't receiving "trans healthcare"—they're receiving HEALTHCARE, designed for bodies like theirs from the start.
                    </p>
                  </div>

                  <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded">
                    <strong className="block mb-2 text-sm">Custom Mobility Adaptations</strong>
                    <p className="text-xs text-muted-foreground">
                      Product design sessions include questions about mobility limitations, allowing us to create adaptive products for users with paralysis, limited range of motion, or prosthetics.
                    </p>
                  </div>

                  <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded">
                    <strong className="block mb-2 text-sm">Sensory Customization</strong>
                    <p className="text-xs text-muted-foreground">
                      Material preferences accommodate sensory processing differences (autism, ADHD, sensory disabilities), with texture, thickness, and lubrication fully customizable.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="mr-3 h-6 w-6" />
                  Your Accessibility Settings
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Customize TriSex.org to match your accessibility needs
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <Label htmlFor="screen-reader" className="font-bold">Screen Reader Mode</Label>
                      <p className="text-xs text-muted-foreground mt-1">
                        Enhanced ARIA labels and navigation landmarks
                      </p>
                    </div>
                    <Switch 
                      id="screen-reader"
                      checked={settings.screenReader}
                      onCheckedChange={() => toggleSetting('screenReader')}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <Label htmlFor="high-contrast" className="font-bold">High Contrast Mode</Label>
                      <p className="text-xs text-muted-foreground mt-1">
                        Black/white color scheme for maximum visibility
                      </p>
                    </div>
                    <Switch 
                      id="high-contrast"
                      checked={settings.highContrast}
                      onCheckedChange={() => toggleSetting('highContrast')}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <Label htmlFor="large-text" className="font-bold">Large Text (200%)</Label>
                      <p className="text-xs text-muted-foreground mt-1">
                        Increase all text sizes for easier reading
                      </p>
                    </div>
                    <Switch 
                      id="large-text"
                      checked={settings.largeText}
                      onCheckedChange={() => toggleSetting('largeText')}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <Label htmlFor="sign-language" className="font-bold">Sign Language Interpretation</Label>
                      <p className="text-xs text-muted-foreground mt-1">
                        Show ASL/BSL videos for educational content
                      </p>
                    </div>
                    <Switch 
                      id="sign-language"
                      checked={settings.signLanguage}
                      onCheckedChange={() => toggleSetting('signLanguage')}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <Label htmlFor="braille-output" className="font-bold">Braille Display Output</Label>
                      <p className="text-xs text-muted-foreground mt-1">
                        Optimize for refreshable braille displays
                      </p>
                    </div>
                    <Switch 
                      id="braille-output"
                      checked={settings.brailleOutput}
                      onCheckedChange={() => toggleSetting('brailleOutput')}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <Label htmlFor="voice-navigation" className="font-bold">Voice Navigation</Label>
                      <p className="text-xs text-muted-foreground mt-1">
                        Enable "Hey TriSex" voice commands
                      </p>
                    </div>
                    <Switch 
                      id="voice-navigation"
                      checked={settings.voiceNavigation}
                      onCheckedChange={() => toggleSetting('voiceNavigation')}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <Label htmlFor="reduced-motion" className="font-bold">Reduce Motion</Label>
                      <p className="text-xs text-muted-foreground mt-1">
                        Minimize animations and transitions
                      </p>
                    </div>
                    <Switch 
                      id="reduced-motion"
                      checked={settings.reducedMotion}
                      onCheckedChange={() => toggleSetting('reducedMotion')}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <Label htmlFor="keyboard-only" className="font-bold">Keyboard-Only Mode</Label>
                      <p className="text-xs text-muted-foreground mt-1">
                        Enhanced keyboard navigation shortcuts
                      </p>
                    </div>
                    <Switch 
                      id="keyboard-only"
                      checked={settings.keyboardOnly}
                      onCheckedChange={() => toggleSetting('keyboardOnly')}
                    />
                  </div>

                  <div className="flex justify-center gap-4 mt-8">
                    <Button>Save Settings</Button>
                    <Button variant="outline">Reset to Defaults</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Keyboard Shortcuts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between p-2 bg-muted/30 rounded">
                      <span>Skip to main content</span>
                      <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs">Alt + S</kbd>
                    </div>
                    <div className="flex justify-between p-2 bg-muted/30 rounded">
                      <span>Navigation menu</span>
                      <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs">Alt + N</kbd>
                    </div>
                    <div className="flex justify-between p-2 bg-muted/30 rounded">
                      <span>Search</span>
                      <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs">Alt + F</kbd>
                    </div>
                    <div className="flex justify-between p-2 bg-muted/30 rounded">
                      <span>Help</span>
                      <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs">Alt + H</kbd>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between p-2 bg-muted/30 rounded">
                      <span>Settings</span>
                      <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs">Alt + ,</kbd>
                    </div>
                    <div className="flex justify-between p-2 bg-muted/30 rounded">
                      <span>Messages</span>
                      <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs">Alt + M</kbd>
                    </div>
                    <div className="flex justify-between p-2 bg-muted/30 rounded">
                      <span>Profile</span>
                      <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs">Alt + P</kbd>
                    </div>
                    <div className="flex justify-between p-2 bg-muted/30 rounded">
                      <span>Logout</span>
                      <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs">Alt + L</kbd>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="support" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Volume2 className="mr-3 h-6 w-6 text-blue-600" />
                  Accessibility Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-bold mb-3">Contact Our Accessibility Team</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Having trouble accessing any feature? Our accessibility specialists are here to help:
                    </p>
                    <div className="space-y-3 text-sm">
                      <div className="p-3 border rounded-lg">
                        <strong>Phone (Voice/TTY):</strong> +1 503 610 6762
                        <p className="text-xs text-muted-foreground mt-1">Available 24/7 for accessibility support</p>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <strong>Email:</strong> accessibility@trisex.org
                        <p className="text-xs text-muted-foreground mt-1">Response within 24 hours</p>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <strong>Video Relay Service (ASL):</strong> Available upon request
                        <p className="text-xs text-muted-foreground mt-1">Book an appointment with ASL interpreter</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold mb-3">Report Accessibility Issues</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Found a barrier? Help us improve by reporting it:
                    </p>
                    <Button>Report Accessibility Barrier</Button>
                    <p className="text-xs text-muted-foreground mt-2">
                      We commit to investigating all reports within 48 hours and providing a resolution timeline.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-bold mb-3">Accessibility Testing Partners</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      We partner with disability-led organizations for regular testing:
                    </p>
                    <ul className="text-sm text-muted-foreground space-y-2">
                      <li>• National Federation of the Blind (NFB)</li>
                      <li>• National Association of the Deaf (NAD)</li>
                      <li>• Disability Rights Advocates</li>
                      <li>• Web Accessibility in Mind (WebAIM)</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Third-Party Accessibility Tools</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  TriSex.org works seamlessly with these assistive technologies:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-bold text-sm mb-2">Screen Readers</h4>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>• NVDA (Windows)</li>
                      <li>• JAWS (Windows)</li>
                      <li>• VoiceOver (macOS/iOS)</li>
                      <li>• TalkBack (Android)</li>
                      <li>• ChromeVox (Chrome OS)</li>
                    </ul>
                  </div>

                  <div className="p-3 border rounded-lg">
                    <h4 className="font-bold text-sm mb-2">Browser Extensions</h4>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>• Read Aloud (text-to-speech)</li>
                      <li>• Dark Reader (eye strain reduction)</li>
                      <li>• Vimium (keyboard navigation)</li>
                      <li>• High Contrast (visibility)</li>
                    </ul>
                  </div>

                  <div className="p-3 border rounded-lg">
                    <h4 className="font-bold text-sm mb-2">Braille Displays</h4>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>• Freedom Scientific Focus</li>
                      <li>• HumanWare Brailliant</li>
                      <li>• Orbit Reader</li>
                      <li>• Alva BC640/680</li>
                    </ul>
                  </div>

                  <div className="p-3 border rounded-lg">
                    <h4 className="font-bold text-sm mb-2">Voice Control</h4>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>• Dragon NaturallySpeaking</li>
                      <li>• Windows Speech Recognition</li>
                      <li>• Apple Voice Control</li>
                      <li>• Google Voice Access</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ongoing Accessibility Commitment</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Accessibility is not a one-time project—it's an ongoing commitment:
                </p>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 h-5 w-5 text-green-600 mt-0.5" />
                    <span><strong>Quarterly audits:</strong> Third-party accessibility assessments every 3 months</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 h-5 w-5 text-green-600 mt-0.5" />
                    <span><strong>User testing:</strong> Monthly sessions with disabled users</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 h-5 w-5 text-green-600 mt-0.5" />
                    <span><strong>Staff training:</strong> All developers complete WCAG certification</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 h-5 w-5 text-green-600 mt-0.5" />
                    <span><strong>Open source accountability:</strong> Accessibility code publicly auditable</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 h-5 w-5 text-green-600 mt-0.5" />
                    <span><strong>Continuous improvement:</strong> New features tested for accessibility before launch</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="mt-12 text-center">
          <div className="flex items-center justify-center gap-4 text-sm">
            <Link href="/privacy-policy">
              <Button variant="link">Privacy Policy</Button>
            </Link>
            <Link href="/terms-of-service">
              <Button variant="link">Terms of Service</Button>
            </Link>
            <Link href="/wiki">
              <Button variant="link">Interactive Wiki</Button>
            </Link>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            Licensed under <a href="https://creativecommons.org/licenses/by-sa/4.0/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Creative Commons BY-SA 4.0</a>
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Accessibility Support: +1 503 610 6762 | accessibility@trisex.org
          </p>
        </div>
      </div>
    </div>
  );
}
