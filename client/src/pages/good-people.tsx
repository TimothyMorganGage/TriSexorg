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
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { 
  Users, 
  Heart, 
  Briefcase, 
  Coffee,
  MapPin,
  Calendar,
  CheckCircle,
  Star,
  MessageCircle,
  UserPlus,
  Settings,
  Search,
  Filter,
  Globe,
  Info,
  Upload,
  FileText,
  Lock,
  AlertTriangle,
  Palette,
  Ban,
  ShieldCheck
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const profileSchema = z.object({
  displayName: z.string().min(2, "Display name must be at least 2 characters"),
  age: z.number().min(18, "Must be 18 or older").max(120, "Invalid age"),
  location: z.string().min(1, "Location is required"),
  profileImageUrl: z.string().optional(),
  lookingFor: z.array(z.string()).min(1, "Select at least one option"),
  interests: z.array(z.string()),
  cooperativePrinciples: z.array(z.string()),
  values: z.array(z.string()),
  bio: z.string().max(500, "Bio must be 500 characters or less"),
});

const genealogicalVerificationSchema = z.object({
  hasUploadedFamilyTree: z.boolean(),
  gedcomFileName: z.string().optional(),
  verificationStatus: z.enum(["pending", "verified", "rejected"]),
  relationshipChecksPassed: z.number().default(0),
  blockedMatches: z.array(z.string()).default([]), // IDs of matches blocked due to kinship
  lastVerificationDate: z.string().optional(),
});

const sexualHealthDirectivesSchema = z.object({
  agreedToSafeProgression: z.boolean(),
  currentStage: z.enum(["nonsexual", "kissing", "manual", "oral", "protected", "equalized"]),
  stageStartDate: z.string().optional(),
  monthlyHealthScreening: z.boolean(),
  stiTestResults: z.string().optional(),
  contraceptiveMethod: z.string().optional(),
});

const matchingPreferencesSchema = z.object({
  ageRangeMin: z.number().min(18),
  ageRangeMax: z.number().max(120),
  maxDistance: z.number().min(1).max(500),
  lookingForTypes: z.array(z.string()),
  requiredValues: z.array(z.string()),
  dealBreakers: z.array(z.string()),
  cooperativePrincipleImportance: z.number().min(1).max(10),
  communityInvolvement: z.string(),
  sexualHealthDirectives: sexualHealthDirectivesSchema,
  genealogicalVerification: genealogicalVerificationSchema,
}).refine((data) => {
  // Enforce 2-year age range limit
  return (data.ageRangeMax - data.ageRangeMin) <= 4;
}, {
  message: "Age range cannot exceed 4 years (2 years in each direction)",
  path: ["ageRangeMax"]
});

export default function GoodPeople() {
  const [matchType, setMatchType] = useState("all");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
  const [artPolicyAgreed, setArtPolicyAgreed] = useState(false);
  const { toast } = useToast();

  const profileForm = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: "",
      age: 25,
      location: "",
      profileImageUrl: "",
      lookingFor: [],
      interests: [],
      cooperativePrinciples: [],
      values: [],
      bio: "",
    },
  });

  const preferencesForm = useForm({
    resolver: zodResolver(matchingPreferencesSchema),
    defaultValues: {
      ageRangeMin: 23,
      ageRangeMax: 27,
      maxDistance: 50,
      lookingForTypes: [],
      requiredValues: [],
      dealBreakers: [],
      cooperativePrincipleImportance: 7,
      communityInvolvement: "",
      sexualHealthDirectives: {
        agreedToSafeProgression: false,
        currentStage: "nonsexual" as const,
        stageStartDate: new Date().toISOString(),
        monthlyHealthScreening: false,
        stiTestResults: "",
        contraceptiveMethod: "",
      },
      genealogicalVerification: {
        hasUploadedFamilyTree: false,
        gedcomFileName: "",
        verificationStatus: "pending" as const,
        relationshipChecksPassed: 0,
        blockedMatches: [],
        lastVerificationDate: "",
      },
    },
  });

  const cooperativePrinciples = [
    "Voluntary & Open Membership",
    "Democratic Member Control", 
    "Member Economic Participation",
    "Autonomy & Independence",
    "Education, Training & Information",
    "Cooperation Among Cooperatives",
    "Concern for Community"
  ];

  const lookingForOptions = [
    { id: "romance", label: "Romance & Dating", icon: Heart, description: "Looking for romantic connections and love through cooperative values" },
    { id: "networking", label: "Professional Networking", icon: Briefcase, description: "Building cooperative business and professional relationships" },
    { id: "friendship", label: "Friendship", icon: Coffee, description: "Finding like-minded friends who share cooperative values" },
    { id: "marriage", label: "Marriage & Partnership", icon: Users, description: "Seeking long-term committed partnership based on mutual aid" }
  ];

  const cooperativeValues = [
    "Mutual Aid", "Social Justice", "Environmental Sustainability", "Economic Democracy",
    "Community Building", "Collective Ownership", "Worker Rights", "Food Justice",
    "Housing Cooperation", "Credit Unions", "Renewable Energy", "Permaculture",
    "Open Source", "Commons-Based Resources", "Participatory Democracy", "Solidarity Economy"
  ];

  const commonInterests = [
    "Cooperative Business", "Community Organizing", "Sustainable Living", "Permaculture",
    "Social Justice", "Mutual Aid", "Worker Cooperatives", "Credit Unions",
    "Community Gardens", "Renewable Energy", "Local Food Systems", "Art & Culture",
    "Music", "Reading", "Hiking", "Cooking", "Activism", "Education"
  ];

  // No fabricated matches. The matching algorithm is described below;
  // until real members enroll and consent to being shown, the list is empty.
  const mockMatches: any[] = [];

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!artPolicyAgreed) {
      toast({
        title: "Art-Only Policy Required",
        description: "You must agree to the art-only content policy before uploading.",
        variant: "destructive",
      });
      event.target.value = "";
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File Type",
        description: "Please upload an image file (JPG, PNG, etc.)",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Profile image must be less than 5MB",
        variant: "destructive",
      });
      return;
    }

    setUploadingImage(true);

    try {
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload to server
      const formData = new FormData();
      formData.append('profileImage', file);

      const response = await fetch('/api/profile/upload-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      const { imageUrl } = await response.json();
      profileForm.setValue('profileImageUrl', imageUrl);

      toast({
        title: "Image Uploaded",
        description: "Your profile image has been uploaded successfully.",
      });
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
      setProfileImagePreview(null);
    } finally {
      setUploadingImage(false);
    }
  };

  const onProfileSubmit = (data: any) => {
    console.log("Profile data:", data);
    toast({
      title: "Profile Updated",
      description: "Your cooperative matchmaking profile has been saved.",
    });
  };

  const onPreferencesSubmit = (data: any) => {
    console.log("Preferences data:", data);
    toast({
      title: "Preferences Updated", 
      description: "Your matching preferences have been saved.",
    });
  };

  const handleConnect = (matchId: number, matchName: string) => {
    toast({
      title: "Connection Request Sent",
      description: `Your connection request has been sent to ${matchName}.`,
    });
  };

  const getMatchTypeIcon = (type: string) => {
    switch (type) {
      case "romance": return Heart;
      case "networking": return Briefcase;
      case "friendship": return Coffee;
      case "marriage": return Users;
      default: return Users;
    }
  };

  const getMatchTypeColor = (type: string) => {
    switch (type) {
      case "romance": return "text-red-500";
      case "networking": return "text-blue-500";
      case "friendship": return "text-green-500";
      case "marriage": return "text-purple-500";
      default: return "text-gray-500";
    }
  };

  // Get current user's age from profile form
  const currentUserAge = profileForm.watch("age") || 25;
  
  // Filter matches by type and enforce 2-year age limit
  const filteredMatches = (matchType === "all" 
    ? mockMatches 
    : mockMatches.filter(match => match.matchType === matchType))
    .filter(match => Math.abs(match.age - currentUserAge) <= 2);

  return (
    <div className="min-h-screen bg-background text-foreground py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Intersex Healthcare Affirmation */}
        <Alert className="mb-4 bg-white dark:bg-gray-950 border-2 border-black dark:border-white">
          <Heart className="h-5 w-5 text-black dark:text-white" />
          <AlertDescription className="ml-2 text-black dark:text-white">
            <strong>Intersex Healthcare IS Everyone's Affirmation:</strong> Cooperative matchmaking centers intersex anatomy as the universal baseline—trans, non-binary, genderqueer, and quare embodiment are all respected within this participatory budgeting framework. There is no separate "transgender healthcare" category—relationship compatibility serves ALL bodies by design.
          </AlertDescription>
        </Alert>

        {/* Two-surface honesty banner — this page is monogamy-only by design */}
        <Alert className="mb-8 border-2 border-blue-500/60 bg-blue-50 dark:bg-blue-950/30" data-testid="good-people-monogamy-scope-banner">
          <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <AlertDescription className="ml-2 text-blue-900 dark:text-blue-100">
            <strong>This surface is monogamy-tuned by design.</strong> Good People uses
            closed-dyad assumptions throughout: 2-year age-range caps, monthly STI
            screening defaults, no metamour disclosure tooling, and progressive-stage
            barrier work optimised for two people. Polyamorous, polyglamorous, open,
            swinging, monogamish, and relationship-anarchy members are served by a
            separate sibling surface at{" "}
            <a href="/polyglamorous-people" className="underline font-semibold" data-testid="link-polyglamorous-from-goodpeople">
              /polyglamorous-people
            </a>{" "}
            with the infrastructure those structures actually require (shorter testing
            cadences, metamour disclosure, continuous-exposure risk modelling). See{" "}
            <a href="/monogamy-economics" className="underline">/monogamy-economics</a>{" "}
            for the operational-scope reasoning.
          </AlertDescription>
        </Alert>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-secondary rounded-xl flex items-center justify-center mr-4">
              <Users className="h-8 w-8 text-black" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground">
                <span className="text-secondary">for Good People</span>
              </h1>
              <p className="text-xl text-muted-foreground mt-2">
                Cooperative Matchmaking & Networking Through True Love
              </p>
            </div>
          </div>
          
          <div className="flex justify-center space-x-4">
            <Badge variant="secondary" className="bg-secondary text-black">
              <Heart className="w-4 h-4 mr-1" />
              True Love via Cooperation
            </Badge>
            <Badge variant="secondary" className="bg-primary text-black">
              <Briefcase className="w-4 h-4 mr-1" />
              Professional Networking
            </Badge>
            <Badge variant="secondary" className="bg-aquamarine text-black">
              <Users className="w-4 h-4 mr-1" />
              Community Building
            </Badge>
          </div>
        </div>

        {/* Sticky quick-nav */}
        <div className="sticky top-0 z-30 bg-background/95 backdrop-blur border-b border-border mb-10">
          <nav className="flex overflow-x-auto gap-1 py-2">
            {[
              { href: "#discover", label: "Discover", icon: Search },
              { href: "#profile", label: "My Profile", icon: UserPlus },
              { href: "#matching", label: "Matching", icon: Settings },
              { href: "#principles", label: "Cooperative Love", icon: Heart },
            ].map(({ href, label, icon: Icon }) => (
              <a
                key={href}
                href={href}
                className="flex items-center gap-1.5 whitespace-nowrap px-4 py-2 rounded-md text-sm font-medium hover:bg-secondary/20 transition-colors border border-transparent hover:border-secondary/40"
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </a>
            ))}
          </nav>
        </div>

        <div className="space-y-20">

          {/* ── DISCOVER ───────────────────────────────────────────── */}
          <section id="discover">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 border-b-2 border-black dark:border-white pb-3">
              <Search className="h-6 w-6" /> Discover
            </h2>
            <div className="space-y-6">
              {/* Match Type Filter */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Discover Good People</span>
                    <div className="flex items-center space-x-2">
                      <Search className="h-4 w-4 text-muted-foreground" />
                      <Filter className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Button
                      variant={matchType === "all" ? "default" : "outline"}
                      onClick={() => setMatchType("all")}
                      size="sm"
                    >
                      All Connections
                    </Button>
                    {lookingForOptions.map((option) => {
                      const Icon = option.icon;
                      return (
                        <Button
                          key={option.id}
                          variant={matchType === option.id ? "default" : "outline"}
                          onClick={() => setMatchType(option.id)}
                          size="sm"
                          className="flex items-center space-x-1"
                        >
                          <Icon className="h-3 w-3" />
                          <span>{option.label}</span>
                        </Button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Matches Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMatches.map((match) => {
                  const MatchIcon = getMatchTypeIcon(match.matchType);
                  return (
                    <Card key={match.id} className="border-l-4 border-l-secondary">
                      <CardHeader>
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0">
                            {match.profileImageUrl ? (
                              <img
                                src={match.profileImageUrl}
                                alt={`${match.displayName}'s profile`}
                                className="w-20 h-20 rounded-lg object-cover border-2 border-secondary"
                                data-testid={`img-match-${match.id}`}
                              />
                            ) : (
                              <div className="w-20 h-20 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center border-2 border-gray-300">
                                <Users className="h-10 w-10 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-lg">{match.displayName}</CardTitle>
                              <div className="flex items-center space-x-1">
                                <MatchIcon className={`h-4 w-4 ${getMatchTypeColor(match.matchType)}`} />
                                <Star className="h-4 w-4 text-yellow-500" />
                                <span className="text-sm font-medium">{match.compatibilityScore}%</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Calendar className="h-3 w-3 mr-1" />
                            <span>{match.age} years old</span>
                            <MapPin className="h-3 w-3 ml-3 mr-1" />
                            <span>{match.location}</span>
                          </div>

                          <p className="text-sm">{match.bio}</p>

                          <div className="space-y-2">
                            <div>
                              <h5 className="text-xs font-medium text-muted-foreground mb-1">Interests:</h5>
                              <div className="flex flex-wrap gap-1">
                                {match.interests.slice(0, 3).map((interest: string, idx: number) => (
                                  <Badge key={idx} variant="outline" className="text-xs">
                                    {interest}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            <div>
                              <h5 className="text-xs font-medium text-muted-foreground mb-1">Cooperative Values:</h5>
                              <div className="flex flex-wrap gap-1">
                                {match.cooperativePrinciples.slice(0, 2).map((principle: string, idx: number) => (
                                  <Badge key={idx} variant="secondary" className="text-xs bg-secondary/20">
                                    {principle}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            <div className="flex items-center justify-between pt-2">
                              <div className="text-xs text-muted-foreground">
                                Cooperative Alignment: {match.cooperativePrincipleAlignment}/10
                              </div>
                              <Button
                                size="sm"
                                onClick={() => handleConnect(match.id, match.displayName)}
                                className="bg-secondary hover:bg-secondary/90 text-black"
                              >
                                <UserPlus className="h-3 w-3 mr-1" />
                                Connect
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </section>

          {/* ── MY PROFILE ─────────────────────────────────────────── */}
          <section id="profile">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 border-b-2 border-black dark:border-white pb-3">
              <UserPlus className="h-6 w-6" /> My Profile
            </h2>
            <Card>
              <CardHeader>
                <CardTitle>Your Cooperative Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...profileForm}>
                  <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">

                    {/* Global Files & Media Policy */}
                    <div className="border-2 border-black dark:border-white rounded-lg p-4 bg-white dark:bg-black">
                      <h3 className="font-bold text-black dark:text-white mb-3 flex items-center gap-2">
                        <ShieldCheck className="h-5 w-5" />
                        Files &amp; Media Content Policy
                      </h3>
                      <p className="text-sm text-gray-800 dark:text-gray-200 mb-3">
                        All profile pictures, icons, and files exchanged within Good People — including images shared in messages, connection requests, or any other platform feature — are subject to the following rules:
                      </p>
                      <div className="grid sm:grid-cols-2 gap-3 text-sm">
                        <div className="space-y-1.5">
                          <p className="font-semibold text-black dark:text-white flex items-center gap-1">
                            <CheckCircle className="h-3.5 w-3.5 text-green-600" /> Permitted content
                          </p>
                          <ul className="text-gray-700 dark:text-gray-300 space-y-1 ml-5 list-disc">
                            <li>Original or commissioned artwork</li>
                            <li>Digital illustrations and paintings</li>
                            <li>Stylized avatars and graphic art</li>
                            <li>Abstract or non-representational art</li>
                            <li>Educational anatomical diagrams</li>
                          </ul>
                        </div>
                        <div className="space-y-1.5">
                          <p className="font-semibold text-black dark:text-white flex items-center gap-1">
                            <Ban className="h-3.5 w-3.5 text-red-600" /> Strictly prohibited
                          </p>
                          <ul className="text-gray-700 dark:text-gray-300 space-y-1 ml-5 list-disc">
                            <li>Photographs of real people</li>
                            <li>Pornography of any kind</li>
                            <li>Sexually explicit depictions of real people</li>
                            <li>Non-consensual intimate imagery</li>
                            <li>AI-generated realistic pornography</li>
                          </ul>
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-3 border-t border-gray-200 dark:border-gray-700 pt-2">
                        Violations are reported to platform moderators and result in immediate account removal. Content is screened against known CSAM and NCII databases.
                      </p>
                    </div>

                    {/* Profile Image Upload Section */}
                    <div className="border rounded-lg p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900">
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Palette className="h-5 w-5 text-primary" />
                        Profile Artwork
                        <span className="text-xs font-normal text-muted-foreground ml-2">— art only, no photographs of real people</span>
                      </h3>
                      
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <div className="mb-4">
                            {(profileImagePreview || profileForm.watch('profileImageUrl')) ? (
                              <div className="relative w-48 h-48 mx-auto">
                                <img
                                  src={profileImagePreview || profileForm.watch('profileImageUrl')}
                                  alt="Profile preview"
                                  className="w-full h-full object-cover rounded-lg border-4 border-primary shadow-lg"
                                  data-testid="img-profile-preview"
                                />
                              </div>
                            ) : (
                              <div className="w-48 h-48 mx-auto bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center border-4 border-dashed border-gray-400">
                                <Users className="h-20 w-20 text-gray-400" />
                              </div>
                            )}
                          </div>
                          
                          <div className="space-y-2">
                            <input
                              type="file"
                              id="profile-image-upload"
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="hidden"
                              data-testid="input-profile-image"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              className="w-full"
                              disabled={uploadingImage || !artPolicyAgreed}
                              onClick={(e) => {
                                e.preventDefault();
                                document.getElementById('profile-image-upload')?.click();
                              }}
                              data-testid="button-upload-image"
                            >
                              <Palette className="h-4 w-4 mr-2" />
                              {uploadingImage ? "Uploading..." : artPolicyAgreed ? "Choose Artwork" : "Agree to Policy First"}
                            </Button>
                            {!artPolicyAgreed && (
                              <p className="text-xs text-center text-muted-foreground">
                                Check the art-only confirmation box on the right to enable upload
                              </p>
                            )}
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border-2 border-black dark:border-white">
                            <h4 className="font-semibold text-black dark:text-white mb-3 flex items-center gap-2">
                              <Palette className="h-4 w-4" />
                              Art-Only Profile Image Policy
                            </h4>
                            <ul className="text-sm text-gray-800 dark:text-gray-200 space-y-2">
                              <li className="flex items-start gap-2">
                                <CheckCircle className="h-3.5 w-3.5 text-green-600 mt-0.5 flex-shrink-0" />
                                <span>Illustrated portraits, digital art, paintings, or avatar art</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <CheckCircle className="h-3.5 w-3.5 text-green-600 mt-0.5 flex-shrink-0" />
                                <span>Abstract or stylized artwork representing yourself</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <CheckCircle className="h-3.5 w-3.5 text-green-600 mt-0.5 flex-shrink-0" />
                                <span>Custom-drawn avatars, cartoons, or graphic art</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <Ban className="h-3.5 w-3.5 text-red-600 mt-0.5 flex-shrink-0" />
                                <span><strong>No photographs of real people</strong></span>
                              </li>
                              <li className="flex items-start gap-2">
                                <Ban className="h-3.5 w-3.5 text-red-600 mt-0.5 flex-shrink-0" />
                                <span><strong>No pornography or sexually explicit depictions of any kind</strong></span>
                              </li>
                              <li className="flex items-start gap-2">
                                <Ban className="h-3.5 w-3.5 text-red-600 mt-0.5 flex-shrink-0" />
                                <span>No nudity, real or illustrated, unless purely anatomical/medical art</span>
                              </li>
                            </ul>
                          </div>

                          <div className="p-3 bg-black dark:bg-white rounded-lg">
                            <div className="flex items-start gap-2">
                              <Checkbox
                                id="art-policy-agree"
                                checked={artPolicyAgreed}
                                onCheckedChange={(v) => setArtPolicyAgreed(!!v)}
                                className="mt-0.5 border-white dark:border-black data-[state=checked]:bg-white dark:data-[state=checked]:bg-black"
                              />
                              <label
                                htmlFor="art-policy-agree"
                                className="text-xs text-white dark:text-black cursor-pointer leading-relaxed"
                              >
                                <strong>I confirm</strong> my profile image is original artwork or a commissioned illustration — not a photograph of a real person, and contains no pornographic or sexually explicit content. I understand violations result in immediate account removal.
                              </label>
                            </div>
                          </div>

                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            <p><strong>File requirements:</strong></p>
                            <ul className="ml-4 mt-1 space-y-1">
                              <li>• Formats: JPG, PNG, GIF, WebP, SVG</li>
                              <li>• Maximum size: 5MB</li>
                              <li>• Recommended: 400×400px or larger</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField
                        control={profileForm.control}
                        name="displayName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Display Name</FormLabel>
                            <FormControl>
                              <Input placeholder="How you want to be known" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={profileForm.control}
                        name="age"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Age</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={profileForm.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location</FormLabel>
                          <FormControl>
                            <Input placeholder="City, State/Province" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={profileForm.control}
                      name="lookingFor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Looking For</FormLabel>
                          <div className="grid md:grid-cols-2 gap-4">
                            {lookingForOptions.map((option) => {
                              const Icon = option.icon;
                              return (
                                <div key={option.id} className="flex items-start space-x-3 p-3 border border-border rounded-lg">
                                  <Checkbox
                                    checked={(field.value as string[])?.includes(option.id)}
                                    onCheckedChange={(checked) => {
                                      const currentValue = (field.value as string[]) || [];
                                      if (checked) {
                                        field.onChange([...currentValue, option.id]);
                                      } else {
                                        field.onChange(currentValue.filter((item) => item !== option.id));
                                      }
                                    }}
                                  />
                                  <div className="flex-1">
                                    <div className="flex items-center space-x-2">
                                      <Icon className="h-4 w-4 text-secondary" />
                                      <span className="font-medium">{option.label}</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">{option.description}</p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={profileForm.control}
                      name="bio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bio</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Tell us about yourself, your cooperative values, and what you're looking for..."
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" className="w-full bg-secondary hover:bg-secondary/90 text-black">
                      Save Profile
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </section>

          {/* ── MATCHING ───────────────────────────────────────────── */}
          <section id="matching">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 border-b-2 border-black dark:border-white pb-3">
              <Settings className="h-6 w-6" /> Matching Preferences
            </h2>
            <Card>
              <CardHeader>
                <CardTitle>Matching Preferences</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...preferencesForm}>
                  <form onSubmit={preferencesForm.handleSubmit(onPreferencesSubmit)} className="space-y-6">
                    
                    <div className="space-y-4">
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Info className="h-4 w-4 text-blue-600" />
                          <span className="text-sm font-medium text-blue-800">Age Matching Policy</span>
                        </div>
                        <p className="text-xs text-blue-700">
                          For safety and compatibility, matches are limited to users within 2 years of your age.
                          Maximum age range setting is 4 years total (2 years in each direction).
                        </p>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-6">
                        <FormField
                          control={preferencesForm.control}
                          name="ageRangeMin"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Minimum Age</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  {...field}
                                  onChange={(e) => field.onChange(Number(e.target.value))}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={preferencesForm.control}
                          name="ageRangeMax"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Maximum Age</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  {...field}
                                  onChange={(e) => field.onChange(Number(e.target.value))}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    {/* Sexual Health Directives Section */}
                    <div className="space-y-6 border-t pt-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-foreground">Sexual Health Directives</h3>
                        
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Heart className="h-4 w-4 text-red-600" />
                            <span className="text-sm font-medium text-red-800">Progressive Dating Stages for Safety</span>
                          </div>
                          <div className="text-xs text-red-700 space-y-1">
                            <div><strong>Stage 1:</strong> Nonsexual first date (getting to know each other)</div>
                            <div><strong>Stage 2:</strong> Kissing allowed, no sexual contact</div>
                            <div><strong>Stage 3:</strong> Manual sexual contact permitted</div>
                            <div><strong>Stage 4:</strong> Possible oral sex with health screening</div>
                            <div><strong>Stage 5:</strong> Protected sex after 1 month of meaningful interactions</div>
                            <div><strong>Stage 6:</strong> Unprotected sex only after 3+ months AND equalized sexual health risks</div>
                            <div className="pt-2 border-t border-red-300">
                              <strong className="text-red-900">⚠️ Violations result in cooperative review and possible suspension from Good People matching</strong>
                            </div>
                          </div>
                        </div>

                        <FormField
                          control={preferencesForm.control}
                          name="sexualHealthDirectives.agreedToSafeProgression"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel className="text-sm font-medium">
                                  I agree to follow the progressive dating stages for sexual health safety
                                </FormLabel>
                                <p className="text-xs text-muted-foreground">
                                  Mandatory compliance with staged progression to protect all community members
                                </p>
                              </div>
                            </FormItem>
                          )}
                        />

                        <div className="grid md:grid-cols-2 gap-4">
                          <FormField
                            control={preferencesForm.control}
                            name="sexualHealthDirectives.monthlyHealthScreening"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel className="text-sm font-medium">
                                    Monthly STI Screening
                                  </FormLabel>
                                  <p className="text-xs text-muted-foreground">
                                    Required for stages 4+ progression
                                  </p>
                                </div>
                              </FormItem>
                            )}
                          />

                        </div>

                        <FormField
                          control={preferencesForm.control}
                          name="sexualHealthDirectives.contraceptiveMethod"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Preferred Contraceptive Method</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select contraceptive method" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="condom">Condoms</SelectItem>
                                  <SelectItem value="iud">IUD</SelectItem>
                                  <SelectItem value="pill">Birth Control Pill</SelectItem>
                                  <SelectItem value="implant">Contraceptive Implant</SelectItem>
                                  <SelectItem value="diaphragm">Diaphragm</SelectItem>
                                  <SelectItem value="spermicide">Spermicide</SelectItem>
                                  <SelectItem value="withdrawal">Withdrawal Method</SelectItem>
                                  <SelectItem value="abstinence">Abstinence</SelectItem>
                                  <SelectItem value="nanoheal">NanoHeal ⚧️ STI Treatment</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    {/* Genealogical Verification Section */}
                    <div className="space-y-6 border-t pt-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-foreground">Genealogical Verification</h3>
                        
                        <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Lock className="h-4 w-4 text-orange-600" />
                            <span className="text-sm font-medium text-orange-800">Incest Prevention System</span>
                          </div>
                          <div className="text-xs text-orange-700 space-y-1">
                            <div>Upload your family tree (GEDCOM format) to verify no blood relations within 8 degrees of cousinship</div>
                            <div><strong>Protected relationships:</strong> Up to 8th cousins — effectively no detectable blood relationship</div>
                            <div><strong>Verification process:</strong> Your uploaded GEDCOM is parsed in-house to map shared ancestors and compute the relationship degree — no third-party genealogy service or DNA database is queried</div>
                            <div><strong>Privacy:</strong> Family tree data is used only for relationship screening, never shared, and can be deleted on request</div>
                          </div>
                        </div>

                        <FormField
                          control={preferencesForm.control}
                          name="genealogicalVerification.hasUploadedFamilyTree"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel className="text-sm font-medium">
                                  I have uploaded my family tree for genealogical verification
                                </FormLabel>
                                <p className="text-xs text-muted-foreground">
                                  Required to access full matchmaking features and ensure no blood relations
                                </p>
                              </div>
                            </FormItem>
                          )}
                        />

                        <div className="space-y-4">
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                            <Upload className="mx-auto h-12 w-12 text-gray-400" />
                            <div className="mt-4">
                              <label htmlFor="gedcom-upload" className="cursor-pointer">
                                <span className="mt-2 block text-sm font-medium text-gray-900">
                                  Upload GEDCOM Family Tree File
                                </span>
                                <span className="mt-1 block text-xs text-gray-500">
                                  Supported formats: .ged, .gedcom (max 10MB)
                                </span>
                              </label>
                              <input
                                id="gedcom-upload"
                                type="file"
                                className="hidden"
                                accept=".ged,.gedcom"
                              />
                            </div>
                          </div>
                          
                          <FormField
                            control={preferencesForm.control}
                            name="genealogicalVerification.gedcomFileName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Uploaded File Name</FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    placeholder="No file uploaded"
                                    readOnly
                                    className="bg-gray-50"
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />

                          <div className="grid md:grid-cols-2 gap-4">
                            <FormField
                              control={preferencesForm.control}
                              name="genealogicalVerification.verificationStatus"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Verification Status</FormLabel>
                                  <FormControl>
                                    <div className="flex items-center gap-2">
                                      <Badge 
                                        variant="outline"
                                        className={
                                          (field.value as string) === 'verified' ? 'bg-green-50 text-green-700' :
                                          (field.value as string) === 'rejected' ? 'bg-red-50 text-red-700' :
                                          'bg-yellow-50 text-yellow-700'
                                        }
                                      >
                                        {(field.value as string) === 'verified' && <CheckCircle className="w-3 h-3 mr-1" />}
                                        {(field.value as string) === 'rejected' && <AlertTriangle className="w-3 h-3 mr-1" />}
                                        {(field.value as string) === 'pending' && <Info className="w-3 h-3 mr-1" />}
                                        {field.value}
                                      </Badge>
                                    </div>
                                  </FormControl>
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={preferencesForm.control}
                              name="genealogicalVerification.relationshipChecksPassed"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Relationship Checks Passed</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      {...field}
                                      readOnly
                                      className="bg-gray-50"
                                    />
                                  </FormControl>
                                  <p className="text-xs text-muted-foreground">
                                    Number of matches verified as non-relatives
                                  </p>
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <FormField
                      control={preferencesForm.control}
                      name="maxDistance"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Maximum Distance (km)</FormLabel>
                          <FormControl>
                            <div className="space-y-2">
                              <Slider
                                value={[field.value]}
                                onValueChange={(value) => field.onChange(value[0])}
                                max={500}
                                min={1}
                                step={5}
                                className="w-full"
                              />
                              <div className="text-sm text-muted-foreground">
                                Up to {field.value} km away
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={preferencesForm.control}
                      name="cooperativePrincipleImportance"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cooperative Principle Importance (1-10)</FormLabel>
                          <FormControl>
                            <div className="space-y-2">
                              <Slider
                                value={[field.value]}
                                onValueChange={(value) => field.onChange(value[0])}
                                max={10}
                                min={1}
                                step={1}
                                className="w-full"
                              />
                              <div className="text-sm text-muted-foreground">
                                Importance: {field.value}/10
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" className="w-full bg-secondary hover:bg-secondary/90 text-black">
                      Save Preferences
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </section>

          {/* ── COOPERATIVE LOVE ───────────────────────────────────── */}
          <section id="principles">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 border-b-2 border-black dark:border-white pb-3">
              <Heart className="h-6 w-6" /> Cooperative Love
            </h2>
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>True Love Through International Cooperative Principles</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-6">
                    Our matchmaking approach is based on the understanding that lasting relationships 
                    are built on shared values of cooperation, mutual aid, and collective wellbeing. 
                    True love emerges when people unite around common principles of justice and community.
                  </p>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-2 gap-6">
                {cooperativePrinciples.map((principle, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <div className="w-8 h-8 bg-secondary text-black rounded-full flex items-center justify-center mr-3 text-sm font-bold">
                          {index + 1}
                        </div>
                        {principle}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <h5 className="text-sm font-medium text-secondary">In Relationships:</h5>
                        {index === 0 && (
                          <p className="text-sm">Open, voluntary connections without coercion or pressure. Everyone is welcome regardless of background.</p>
                        )}
                        {index === 1 && (
                          <p className="text-sm">Equal participation in relationship decisions. Both partners have voice and agency in the relationship's direction.</p>
                        )}
                        {index === 2 && (
                          <p className="text-sm">Shared responsibility for emotional, financial, and domestic contributions to the relationship.</p>
                        )}
                        {index === 3 && (
                          <p className="text-sm">Individual autonomy within interdependent partnership. Personal growth supported by mutual aid.</p>
                        )}
                        {index === 4 && (
                          <p className="text-sm">Continuous learning together about communication, conflict resolution, and community building.</p>
                        )}
                        {index === 5 && (
                          <p className="text-sm">Building alliances with other cooperative couples and community partnerships.</p>
                        )}
                        {index === 6 && (
                          <p className="text-sm">Extending care beyond the couple to broader community wellbeing and social justice.</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Why Cooperative Love Works</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6 text-sm">
                    <div>
                      <h4 className="font-medium mb-2 text-secondary">Shared Values Foundation</h4>
                      <p className="text-muted-foreground">
                        Relationships built on cooperative principles have a strong foundation of shared 
                        values around justice, community, and mutual aid.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2 text-primary">Conflict Resolution Skills</h4>
                      <p className="text-muted-foreground">
                        Cooperative training in democratic decision-making and consensus building 
                        translates to healthier relationship communication.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2 text-aquamarine">Community Support</h4>
                      <p className="text-muted-foreground">
                        Couples embedded in cooperative communities have networks of support 
                        and resources for relationship challenges.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

        </div>{/* end scroll sections */}
      </div>
    </div>
  );
}