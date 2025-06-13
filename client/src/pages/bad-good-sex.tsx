import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { 
  Heart, 
  Shield, 
  FileText, 
  Users, 
  CheckCircle,
  AlertTriangle,
  Link as LinkIcon,
  Settings,
  Plus,
  Edit
} from "lucide-react";

const sexualHealthPreferencesSchema = z.object({
  consentProtocols: z.array(z.string()),
  communicationPreferences: z.array(z.string()),
  boundarySettings: z.string(),
  emergencyContacts: z.array(z.string()),
  medicalInformation: z.string(),
  sexualHealthGoals: z.string(),
  preferredTerminology: z.string(),
  privacySettings: z.string(),
});

export default function BadGoodSex() {
  const [activeSection, setActiveSection] = useState("overview");
  const [integrationStatus, setIntegrationStatus] = useState("not_connected");
  const { toast } = useToast();

  const { data: badIntegration, isLoading } = useQuery({
    queryKey: ['/api/bad-coop-integration'],
    onError: (error: Error) => {
      toast({
        title: "Error loading BAD Co-op integration",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const createIntegrationMutation = useMutation({
    mutationFn: (data: any) => apiRequest('/api/bad-coop-integration', 'POST', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/bad-coop-integration'] });
      toast({
        title: "BAD Co-op Integration Connected!",
        description: "Your sexual health preferences are now linked with your advance directives.",
      });
      setIntegrationStatus("connected");
    },
    onError: (error: Error) => {
      toast({
        title: "Integration failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const form = useForm({
    resolver: zodResolver(sexualHealthPreferencesSchema),
    defaultValues: {
      consentProtocols: [],
      communicationPreferences: [],
      boundarySettings: "",
      emergencyContacts: [],
      medicalInformation: "",
      sexualHealthGoals: "",
      preferredTerminology: "",
      privacySettings: "private",
    },
  });

  const onSubmit = (data: any) => {
    createIntegrationMutation.mutate({
      sexualHealthPreferences: JSON.stringify(data),
      consentForDataSharing: true,
      advanceDirectivesLinked: true,
    });
  };

  const cooperativePrinciples = [
    {
      number: 1,
      title: "Voluntary & Open Membership",
      description: "Sexual health access for all, regardless of identity or background",
      sexualHealthApplication: "Open access to protection and education for all body types and orientations"
    },
    {
      number: 2,
      title: "Democratic Member Control",
      description: "Community-driven decisions about sexual health resources",
      sexualHealthApplication: "User input shapes product development and health initiatives"
    },
    {
      number: 3,
      title: "Member Economic Participation",
      description: "Affordable, sliding-scale sexual health services",
      sexualHealthApplication: "Income-based pricing for custom protection and treatments"
    },
    {
      number: 4,
      title: "Autonomy & Independence",
      description: "Self-determination in sexual health choices",
      sexualHealthApplication: "Personal control over contraception, protection, and treatment decisions"
    },
    {
      number: 5,
      title: "Education, Training & Information",
      description: "Comprehensive sexual health education for all",
      sexualHealthApplication: "Multilingual resources, anatomy education, and safety training"
    },
    {
      number: 6,
      title: "Cooperation Among Cooperatives",
      description: "Collaborative sexual health networks",
      sexualHealthApplication: "Partnerships between clinics, communities, and advocacy organizations"
    },
    {
      number: 7,
      title: "Concern for Community",
      description: "Sexual health as community wellbeing",
      sexualHealthApplication: "STI prevention, public health initiatives, and community safety"
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-aquamarine rounded-xl flex items-center justify-center mr-4">
              <Heart className="h-8 w-8 text-black" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground">
                BAD co-op <span className="text-aquamarine">for GOOD Sex</span>
              </h1>
              <p className="text-xl text-muted-foreground mt-2">
                Sexual Health Advance Directives & Cooperative Planning
              </p>
            </div>
          </div>
          
          <div className="flex justify-center space-x-4">
            <Badge variant="secondary" className="bg-aquamarine text-black">
              <Shield className="w-4 h-4 mr-1" />
              Sexual Health Rights
            </Badge>
            <Badge variant="secondary" className="bg-primary text-black">
              <FileText className="w-4 h-4 mr-1" />
              Advance Planning
            </Badge>
            <Badge variant="secondary" className="bg-secondary text-black">
              <Users className="w-4 h-4 mr-1" />
              Cooperative Values
            </Badge>
          </div>
        </div>

        <Tabs value={activeSection} onValueChange={setActiveSection}>
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="preferences">Sexual Health Preferences</TabsTrigger>
            <TabsTrigger value="integration">BAD Integration</TabsTrigger>
            <TabsTrigger value="principles">Cooperative Principles</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Heart className="mr-2 h-6 w-6 text-aquamarine" />
                    Sexual Health Advance Directives
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Document your sexual health preferences, consent protocols, and emergency 
                    directives to ensure your wishes are respected in all circumstances.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      Consent communication preferences
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      Boundary documentation
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      Emergency contact protocols
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      Medical information sharing
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <LinkIcon className="mr-2 h-6 w-6 text-primary" />
                    BAD Co-op Integration
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Connect with Balanced Advance Directives (BAD co-op) to integrate your 
                    sexual health preferences with your overall healthcare planning.
                  </p>
                  
                  <div className="space-y-3">
                    <div className={`flex items-center p-3 rounded-lg ${
                      integrationStatus === "connected" 
                        ? "bg-green-100 dark:bg-green-900/20" 
                        : "bg-yellow-100 dark:bg-yellow-900/20"
                    }`}>
                      {integrationStatus === "connected" ? (
                        <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
                      )}
                      <span className="text-sm">
                        {integrationStatus === "connected" 
                          ? "Connected to BAD Co-op" 
                          : "Not connected to BAD Co-op"
                        }
                      </span>
                    </div>

                    {integrationStatus !== "connected" && (
                      <Button 
                        onClick={() => setActiveSection("integration")}
                        className="w-full bg-aquamarine hover:bg-aquamarine/90 text-black"
                      >
                        Connect to BAD Co-op
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Why Sexual Health Advance Directives Matter</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6 text-sm">
                  <div>
                    <h4 className="font-medium mb-2 text-aquamarine">Consent & Communication</h4>
                    <p className="text-muted-foreground">
                      Establish clear protocols for sexual consent, communication preferences, 
                      and boundary setting to ensure respectful intimate relationships.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2 text-primary">Emergency Planning</h4>
                    <p className="text-muted-foreground">
                      Document emergency contacts, medical information, and care preferences 
                      for sexual health emergencies or incapacitation scenarios.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2 text-secondary">Privacy & Rights</h4>
                    <p className="text-muted-foreground">
                      Protect your sexual privacy rights, data sharing preferences, and 
                      ensure your sexual identity and orientation are respected.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preferences">
            <Card>
              <CardHeader>
                <CardTitle>Sexual Health Preferences & Directives</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="boundarySettings"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Boundary & Consent Preferences</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Describe your consent protocols, boundary communication preferences, and any specific requirements..."
                                className="min-h-[100px]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="preferredTerminology"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Preferred Terminology</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Preferred terms for your anatomy, identity, relationships, and sexual practices..."
                                className="min-h-[100px]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="medicalInformation"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Sexual Health Medical Information</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Relevant medical history, allergies, medications, or conditions that affect sexual health..."
                                className="min-h-[100px]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="sexualHealthGoals"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Sexual Health Goals & Values</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Your sexual health goals, values, and what matters most to you in intimate relationships..."
                                className="min-h-[100px]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="privacySettings"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Privacy & Data Sharing Preferences</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select privacy level" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="private">Private - No data sharing</SelectItem>
                              <SelectItem value="healthcare_only">Healthcare providers only</SelectItem>
                              <SelectItem value="emergency_contacts">Emergency contacts only</SelectItem>
                              <SelectItem value="research_anonymous">Anonymous research participation</SelectItem>
                              <SelectItem value="community_advocacy">Community advocacy participation</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      disabled={createIntegrationMutation.isPending}
                      className="w-full bg-aquamarine hover:bg-aquamarine/90 text-black"
                    >
                      {createIntegrationMutation.isPending ? 'Saving...' : 'Save Sexual Health Preferences'}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integration">
            <Card>
              <CardHeader>
                <CardTitle>BAD Co-op Integration Setup</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">About BAD Co-op Integration</h4>
                    <p className="text-sm text-muted-foreground">
                      Connect your fluck account with Balanced Advance Directives (BAD co-op) to create 
                      a comprehensive health planning system that includes both your sexual health 
                      preferences and overall medical advance directives.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-3">Integration Benefits:</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          Unified health planning
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          Emergency directive coordination
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          Holistic healthcare advocacy
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          Cooperative community support
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">Privacy Protection:</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center">
                          <Shield className="h-4 w-4 text-aquamarine mr-2" />
                          Encrypted data transmission
                        </li>
                        <li className="flex items-center">
                          <Shield className="h-4 w-4 text-aquamarine mr-2" />
                          Granular sharing controls
                        </li>
                        <li className="flex items-center">
                          <Shield className="h-4 w-4 text-aquamarine mr-2" />
                          Revocable consent
                        </li>
                        <li className="flex items-center">
                          <Shield className="h-4 w-4 text-aquamarine mr-2" />
                          HIPAA compliance
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="border border-border rounded-lg p-4">
                    <h4 className="font-medium mb-3">Connection Status</h4>
                    {integrationStatus === "connected" ? (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                          <span>Connected to BAD Co-op</span>
                        </div>
                        <Button variant="outline" size="sm">
                          <Settings className="h-4 w-4 mr-2" />
                          Manage Settings
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center">
                        <p className="text-muted-foreground mb-4">
                          Ready to connect your sexual health preferences with BAD Co-op advance directives?
                        </p>
                        <Button 
                          onClick={() => setIntegrationStatus("connected")}
                          className="bg-aquamarine hover:bg-aquamarine/90 text-black"
                        >
                          <LinkIcon className="h-4 w-4 mr-2" />
                          Connect to BAD Co-op
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="principles">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>International Cooperative Principles in Sexual Health</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-6">
                    The seven cooperative principles guide our approach to sexual health as a community good, 
                    ensuring equitable access, democratic participation, and collective wellbeing.
                  </p>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-2 gap-6">
                {cooperativePrinciples.map((principle) => (
                  <Card key={principle.number}>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <div className="w-8 h-8 bg-aquamarine text-black rounded-full flex items-center justify-center mr-3 text-sm font-bold">
                          {principle.number}
                        </div>
                        {principle.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-3">{principle.description}</p>
                      <div className="bg-muted/30 p-3 rounded-lg">
                        <h5 className="text-sm font-medium text-aquamarine mb-2">Sexual Health Application:</h5>
                        <p className="text-sm">{principle.sexualHealthApplication}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}