import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { 
  Users2, 
  Shield, 
  TestTube, 
  AlertTriangle,
  Heart,
  Target,
  Sparkles,
  Leaf,
  ThermometerSun,
  Waves,
  Eye,
  Ear,
  Hand,
  Wind,
  Zap,
  BarChart3,
  Bell,
  UserPlus,
  Network,
  Calendar,
  MapPin,
  TrendingUp,
  CheckCircle,
  XCircle,
  Clock,
  Star,
  Settings,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { BetaDisclaimer } from "@/components/BetaDisclaimer";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function PartnerSTITracking() {
  const [activeTab, setActiveTab] = useState("networks");
  const [selectedNetwork, setSelectedNetwork] = useState<any>(null);
  const [, setSelectedCustomization] = useState<any>(null);
  
  const [newNetworkData, setNewNetworkData] = useState({
    networkName: "",
    privacyLevel: "private",
    dataRetentionDays: 90,
    consentGiven: false,
  });

  const [, setNewConnectionData] = useState({
    connectionType: "",
    relationshipStatus: "",
    mutualConsent: false,
    connectionStrength: 3,
  });

  const [stiEventData, setStiEventData] = useState({
    eventType: "",
    stiType: "",
    testResult: "",
    testingLocation: "",
    geographicArea: "",
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch partner networks
  const { data: networks = [], isLoading: networksLoading } = useQuery<any[]>({
    queryKey: ["/api/partner-networks"],
    enabled: activeTab === "networks",
  });

  // Fetch partner connections for selected network
  const { data: connections = [], isLoading: connectionsLoading } = useQuery<any[]>({
    queryKey: ["/api/partner-networks", selectedNetwork?.id, "connections"],
    enabled: !!selectedNetwork,
  });

  // Fetch STI tracking events
  const { data: stiEvents = [], isLoading: stiEventsLoading } = useQuery<any[]>({
    queryKey: ["/api/sti-tracking"],
    enabled: activeTab === "sti-tracking",
  });

  // Fetch sexual product customizations
  const { data: customizations = [], isLoading: customizationsLoading } = useQuery<any[]>({
    queryKey: ["/api/sexual-product-customizations"],
    enabled: activeTab === "product-customization",
  });

  // Fetch natural senses profile
  const { data: naturalSensesProfile, isLoading: profileLoading } = useQuery<any>({
    queryKey: ["/api/natural-senses-profile"],
    enabled: activeTab === "natural-senses",
  });

  // Fetch partner notifications
  const { data: notifications = [], isLoading: notificationsLoading } = useQuery<any[]>({
    queryKey: ["/api/partner-notifications"],
    enabled: activeTab === "notifications",
  });

  // Create partner network mutation
  const createNetwork = useMutation({
    mutationFn: async (networkData: any) => {
      const response = await fetch("/api/partner-networks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(networkData),
      });
      if (!response.ok) throw new Error("Failed to create network");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/partner-networks"] });
      setNewNetworkData({
        networkName: "",
        privacyLevel: "private",
        dataRetentionDays: 90,
        consentGiven: false,
      });
      toast({
        title: "Network Created",
        description: "Partner network created successfully!",
      });
    },
  });

  // Create STI tracking event mutation
  const createStiEvent = useMutation({
    mutationFn: async (eventData: any) => {
      const response = await fetch("/api/sti-tracking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventData),
      });
      if (!response.ok) throw new Error("Failed to create STI event");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sti-tracking"] });
      setStiEventData({
        eventType: "",
        stiType: "",
        testResult: "",
        testingLocation: "",
        geographicArea: "",
      });
      toast({
        title: "Event Recorded",
        description: "STI tracking event recorded successfully!",
      });
    },
  });

  const stiTypes = [
    "chlamydia", "gonorrhea", "syphilis", "hiv", "herpes", "hpv", "hepatitis_b", "trichomoniasis"
  ];

  const eventTypes = [
    "test_result", "symptom_report", "exposure_alert", "treatment_start", "treatment_complete"
  ];

  const testResults = ["positive", "negative", "inconclusive", "pending"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
      <BetaDisclaimer />
      <div className="p-4">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Intersex Healthcare Affirmation */}
            <Alert className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/40 border-purple-200">
              <Heart className="h-5 w-5 text-purple-600" />
              <AlertDescription className="ml-2">
                <strong>Intersex Healthcare IS Everyone's Affirmation:</strong> Partner STI tracking centers intersex anatomy as the universal baseline. There is no separate "transgender healthcare" category—sexual health monitoring serves ALL bodies by design.
              </AlertDescription>
            </Alert>

            {/* Header */}
            <div className="text-center space-y-2">
          <h1 
            className="text-4xl font-bold text-primary"
            style={{ 
              fontFamily: 'cursive',
              textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
            }}
          >
            4D STI Tracking & Partner Networks 🛡️
          </h1>
          <p className="text-lg text-muted-foreground">
            Comprehensive sexual health tracking with partner networks and personalized protection
          </p>
          <div className="text-sm text-muted-foreground">
            Inspired by <a href="https://greensong.info/natural-senses" target="_blank" rel="noopener noreferrer" className="text-primary underline">
              Natural Senses Framework
            </a> • Licensed under <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener noreferrer" className="text-primary underline">
              Creative Commons BY-SA 4.0
            </a>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="networks">Partner Networks</TabsTrigger>
            <TabsTrigger value="sti-tracking">4D STI Tracking</TabsTrigger>
            <TabsTrigger value="product-customization">Product Customization</TabsTrigger>
            <TabsTrigger value="natural-senses">Natural Senses</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          {/* Partner Networks Tab */}
          <TabsContent value="networks" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Networks List */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Network className="h-5 w-5" />
                    Partner Networks
                  </CardTitle>
                  <CardDescription>
                    Manage your sexual partner networks for comprehensive health tracking
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {networksLoading ? (
                    <div className="text-center py-4">Loading networks...</div>
                  ) : networks.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No networks yet. Create your first network below!
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {networks.map((network: any) => (
                        <div 
                          key={network.id} 
                          className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                            selectedNetwork?.id === network.id ? 'bg-primary/10 border-primary' : 'hover:bg-gray-50'
                          }`}
                          onClick={() => setSelectedNetwork(network)}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{network.networkName || "Unnamed Network"}</h4>
                              <p className="text-sm text-muted-foreground">
                                Privacy: {network.privacyLevel} • Retention: {network.dataRetentionDays} days
                              </p>
                              <div className="flex gap-2 mt-2">
                                <Badge variant={network.isActive ? "default" : "secondary"}>
                                  {network.isActive ? "Active" : "Inactive"}
                                </Badge>
                                <Badge variant={network.consentGiven ? "default" : "destructive"}>
                                  {network.consentGiven ? "Consent Given" : "Consent Pending"}
                                </Badge>
                              </div>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {format(new Date(network.createdAt), "MMM d, yyyy")}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Create New Network */}
                  <div className="border-t pt-4 space-y-4">
                    <h3 className="font-semibold">Create New Network</h3>
                    
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label>Network Name (Optional)</Label>
                        <Input
                          value={newNetworkData.networkName}
                          onChange={(e) => setNewNetworkData(prev => ({ ...prev, networkName: e.target.value }))}
                          placeholder="e.g., Primary Partners, Close Network"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Privacy Level</Label>
                        <Select
                          value={newNetworkData.privacyLevel}
                          onValueChange={(value) => setNewNetworkData(prev => ({ ...prev, privacyLevel: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="private">Private (Your eyes only)</SelectItem>
                            <SelectItem value="network_only">Network Only (Shared with partners)</SelectItem>
                            <SelectItem value="anonymous_data">Anonymous Data (For research)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Data Retention (Days)</Label>
                        <Slider
                          value={[newNetworkData.dataRetentionDays]}
                          onValueChange={(value) => setNewNetworkData(prev => ({ ...prev, dataRetentionDays: value[0] }))}
                          min={30}
                          max={365}
                          step={30}
                          className="w-full"
                        />
                        <div className="text-sm text-muted-foreground">{newNetworkData.dataRetentionDays} days</div>
                      </div>

                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h4 className="font-medium">Informed Consent</h4>
                          <p className="text-sm text-muted-foreground">I consent to sexual health data tracking</p>
                        </div>
                        <Switch 
                          checked={newNetworkData.consentGiven}
                          onCheckedChange={(checked) => setNewNetworkData(prev => ({ ...prev, consentGiven: checked }))}
                        />
                      </div>

                      <Button 
                        onClick={() => createNetwork.mutate(newNetworkData)}
                        disabled={!newNetworkData.consentGiven || createNetwork.isPending}
                        className="w-full"
                      >
                        {createNetwork.isPending ? "Creating..." : "Create Network"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Network Details & Connections */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users2 className="h-5 w-5" />
                    {selectedNetwork ? "Network Connections" : "Select a Network"}
                  </CardTitle>
                  {selectedNetwork && (
                    <CardDescription>
                      Manage connections in {selectedNetwork.networkName || "your network"}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  {!selectedNetwork ? (
                    <div className="text-center py-8 text-muted-foreground">
                      Select a network to view and manage connections
                    </div>
                  ) : connectionsLoading ? (
                    <div className="text-center py-4">Loading connections...</div>
                  ) : (
                    <div className="space-y-4">
                      {connections.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          No connections in this network yet
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {connections.map((connection: any) => (
                            <div key={connection.id} className="border rounded-lg p-3">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-medium">
                                    {connection.partnerUserId ? `Partner ${connection.partnerUserId}` : connection.partnerAnonymousId}
                                  </h4>
                                  <p className="text-sm text-muted-foreground capitalize">
                                    {connection.connectionType} • {connection.relationshipStatus}
                                  </p>
                                  <div className="flex gap-2 mt-2">
                                    <Badge variant={connection.mutualConsent ? "default" : "secondary"}>
                                      {connection.mutualConsent ? "Mutual Consent" : "Pending Consent"}
                                    </Badge>
                                    <Badge variant="outline">
                                      Strength: {connection.connectionStrength}/5
                                    </Badge>
                                  </div>
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  Last contact: {connection.lastContact ? format(new Date(connection.lastContact), "MMM d") : "Never"}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* 4D STI Tracking Tab */}
          <TabsContent value="sti-tracking" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* STI Events List */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TestTube className="h-5 w-5" />
                    STI Tracking Events
                  </CardTitle>
                  <CardDescription>
                    4D tracking: Time, Space, Severity, Network connections
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {stiEventsLoading ? (
                    <div className="text-center py-4">Loading events...</div>
                  ) : stiEvents.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No STI tracking events recorded yet
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {stiEvents.map((event: any) => (
                        <div key={event.id} className="border rounded-lg p-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium capitalize">{event.eventType.replace('_', ' ')}</h4>
                              <p className="text-sm text-muted-foreground capitalize">
                                {event.stiType} • {event.testResult}
                              </p>
                              <div className="flex gap-2 mt-2">
                                <Badge variant={
                                  event.testResult === 'positive' ? 'destructive' :
                                  event.testResult === 'negative' ? 'default' :
                                  'secondary'
                                }>
                                  {event.testResult}
                                </Badge>
                                {event.testingLocation && (
                                  <Badge variant="outline">
                                    <MapPin className="h-3 w-3 mr-1" />
                                    {event.testingLocation}
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {format(new Date(event.eventDate), "MMM d, yyyy")}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Add New STI Event */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Record STI Event
                  </CardTitle>
                  <CardDescription>
                    Add test results, symptoms, or treatment updates
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label>Event Type</Label>
                      <Select
                        value={stiEventData.eventType}
                        onValueChange={(value) => setStiEventData(prev => ({ ...prev, eventType: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select event type" />
                        </SelectTrigger>
                        <SelectContent>
                          {eventTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type.replace('_', ' ').toUpperCase()}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>STI Type</Label>
                      <Select
                        value={stiEventData.stiType}
                        onValueChange={(value) => setStiEventData(prev => ({ ...prev, stiType: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select STI type" />
                        </SelectTrigger>
                        <SelectContent>
                          {stiTypes.map((sti) => (
                            <SelectItem key={sti} value={sti}>
                              {sti.toUpperCase()}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {stiEventData.eventType === "test_result" && (
                      <div className="space-y-2">
                        <Label>Test Result</Label>
                        <Select
                          value={stiEventData.testResult}
                          onValueChange={(value) => setStiEventData(prev => ({ ...prev, testResult: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select result" />
                          </SelectTrigger>
                          <SelectContent>
                            {testResults.map((result) => (
                              <SelectItem key={result} value={result}>
                                {result.toUpperCase()}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label>Testing Location</Label>
                      <Input
                        value={stiEventData.testingLocation}
                        onChange={(e) => setStiEventData(prev => ({ ...prev, testingLocation: e.target.value }))}
                        placeholder="e.g., Health Center Downtown"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Geographic Area</Label>
                      <Input
                        value={stiEventData.geographicArea}
                        onChange={(e) => setStiEventData(prev => ({ ...prev, geographicArea: e.target.value }))}
                        placeholder="e.g., Downtown District"
                      />
                    </div>

                    <Button 
                      onClick={() => createStiEvent.mutate(stiEventData)}
                      disabled={!stiEventData.eventType || !stiEventData.stiType || createStiEvent.isPending}
                      className="w-full"
                    >
                      {createStiEvent.isPending ? "Recording..." : "Record Event"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Product Customization Tab */}
          <TabsContent value="product-customization" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Sexual Product Customizations
                </CardTitle>
                <CardDescription>
                  Personalized protection products optimized for your natural senses and partner network
                </CardDescription>
              </CardHeader>
              <CardContent>
                {customizationsLoading ? (
                  <div className="text-center py-4">Loading customizations...</div>
                ) : customizations.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No product customizations yet. Create your first personalized product below!
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {customizations.map((customization: any) => (
                      <div key={customization.id} className="border rounded-lg p-4 space-y-4">
                        <div>
                          <h3 className="font-semibold">{customization.customizationName}</h3>
                          <p className="text-sm text-muted-foreground">
                            Protection Level: {customization.protectionLevel}
                          </p>
                        </div>

                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Effectiveness Rating</span>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`h-4 w-4 ${i < customization.effectivenessRating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
                                />
                              ))}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="text-sm font-medium">Natural Senses Alignment</div>
                            <div className="grid grid-cols-2 gap-2">
                              <Badge variant="outline">
                                <ThermometerSun className="h-3 w-3 mr-1" />
                                {customization.naturalSensesProfile?.temperaturePreference || "Standard"}
                              </Badge>
                              <Badge variant="outline">
                                <Hand className="h-3 w-3 mr-1" />
                                Tactile: {customization.naturalSensesProfile?.tactileSensitivity || 3}/5
                              </Badge>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="text-sm font-medium">Material Preferences</div>
                            <div className="flex flex-wrap gap-1">
                              {customization.materialPreferences?.vegan && (
                                <Badge variant="secondary">
                                  <Leaf className="h-3 w-3 mr-1" />
                                  Vegan
                                </Badge>
                              )}
                              {customization.materialPreferences?.hypoallergenic && (
                                <Badge variant="secondary">Hypoallergenic</Badge>
                              )}
                              {customization.materialPreferences?.biodegradable && (
                                <Badge variant="secondary">Eco-Friendly</Badge>
                              )}
                            </div>
                          </div>

                          <div className="flex justify-between items-center">
                            <span className="text-sm">Sustainability Rating</span>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Leaf 
                                  key={i} 
                                  className={`h-4 w-4 ${i < customization.sustainabilityRating ? 'text-green-500 fill-current' : 'text-gray-300'}`} 
                                />
                              ))}
                            </div>
                          </div>

                          {customization.sharedWithPartners && (
                            <Badge variant="default" className="w-full justify-center">
                              <Users2 className="h-3 w-3 mr-1" />
                              Shared with Partner Network
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Natural Senses Tab */}
          <TabsContent value="natural-senses" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Natural Senses Profile
                </CardTitle>
                <CardDescription>
                  Comprehensive sensory profile based on greensong.info/natural-senses framework
                </CardDescription>
              </CardHeader>
              <CardContent>
                {profileLoading ? (
                  <div className="text-center py-4">Loading profile...</div>
                ) : !naturalSensesProfile ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Natural senses profile not yet created
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Visual Sensitivity */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Eye className="h-5 w-5 text-blue-500" />
                        <h3 className="font-semibold">Visual</h3>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Sensitivity Level</span>
                          <span className="text-sm font-medium">{naturalSensesProfile?.visualSensitivity || 3}/5</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full" 
                            style={{ width: `${((naturalSensesProfile?.visualSensitivity || 3) / 5) * 100}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Environment: {naturalSensesProfile?.environmentalFactors?.lightingPreference || "Not specified"}
                        </p>
                      </div>
                    </div>

                    {/* Auditory */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Ear className="h-5 w-5 text-purple-500" />
                        <h3 className="font-semibold">Auditory</h3>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Volume Preference</span>
                          <span className="text-sm font-medium">{naturalSensesProfile?.auditoryPreferences?.volume || "Moderate"}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Preferred: {naturalSensesProfile?.auditoryPreferences?.soundTypes?.join(", ") || "Not specified"}
                        </div>
                      </div>
                    </div>

                    {/* Tactile */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Hand className="h-5 w-5 text-green-500" />
                        <h3 className="font-semibold">Tactile</h3>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Sensitivity Level</span>
                          <span className="text-sm font-medium">{naturalSensesProfile?.tactileSensitivity || 3}/5</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full" 
                            style={{ width: `${((naturalSensesProfile?.tactileSensitivity || 3) / 5) * 100}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Pressure: {naturalSensesProfile?.proprioceptiveNeeds?.pressurePreference || "Moderate"}
                        </p>
                      </div>
                    </div>

                    {/* Olfactory */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Wind className="h-5 w-5 text-orange-500" />
                        <h3 className="font-semibold">Olfactory</h3>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Intensity</span>
                          <span className="text-sm font-medium">{naturalSensesProfile?.olfactoryPreferences?.intensityLevel || "Subtle"}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Preferred: {naturalSensesProfile?.olfactoryPreferences?.preferredScents?.join(", ") || "Natural"}
                        </div>
                      </div>
                    </div>

                    {/* Temperature */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <ThermometerSun className="h-5 w-5 text-red-500" />
                        <h3 className="font-semibold">Temperature</h3>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Preference</span>
                          <span className="text-sm font-medium">{naturalSensesProfile?.environmentalFactors?.temperatureRange || "Warm"}</span>
                        </div>
                      </div>
                    </div>

                    {/* Interoceptive */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Heart className="h-5 w-5 text-pink-500" />
                        <h3 className="font-semibold">Interoceptive</h3>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Body Awareness</span>
                          <span className="text-sm font-medium">{naturalSensesProfile?.interocetptiveAwareness || 3}/5</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-pink-500 h-2 rounded-full" 
                            style={{ width: `${((naturalSensesProfile?.interocetptiveAwareness || 3) / 5) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Sensory Strategies */}
            {naturalSensesProfile && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5" />
                      Sensory Seeking
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {naturalSensesProfile?.sensorySeekingBehaviors?.map((behavior: string, index: number) => (
                        <Badge key={index} variant="default" className="mr-2 mb-2">
                          {behavior.replace('_', ' ')}
                        </Badge>
                      )) || <p className="text-muted-foreground">No seeking behaviors recorded</p>}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Regulation Strategies
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {naturalSensesProfile?.regulationStrategies?.map((strategy: string, index: number) => (
                        <Badge key={index} variant="secondary" className="mr-2 mb-2">
                          {strategy.replace('_', ' ')}
                        </Badge>
                      )) || <p className="text-muted-foreground">No regulation strategies recorded</p>}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Partner Notifications
                </CardTitle>
                <CardDescription>
                  STI alerts, test reminders, and health updates from your network
                </CardDescription>
              </CardHeader>
              <CardContent>
                {notificationsLoading ? (
                  <div className="text-center py-4">Loading notifications...</div>
                ) : notifications.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No notifications at this time
                  </div>
                ) : (
                  <div className="space-y-4">
                    {notifications.map((notification: any) => (
                      <div key={notification.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant={
                                notification.urgencyLevel === 'urgent' ? 'destructive' :
                                notification.urgencyLevel === 'high' ? 'destructive' :
                                notification.urgencyLevel === 'medium' ? 'default' :
                                'secondary'
                              }>
                                {notification.urgencyLevel.toUpperCase()}
                              </Badge>
                              <Badge variant="outline" className="capitalize">
                                {notification.notificationType.replace('_', ' ')}
                              </Badge>
                            </div>
                            <p className="text-sm mb-2">{notification.message}</p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span>Via: {notification.deliveryMethod}</span>
                              <span>Status: {notification.deliveryStatus}</span>
                              {notification.sentAt && (
                                <span>Sent: {format(new Date(notification.sentAt), "MMM d, h:mm a")}</span>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            {!notification.readAt && (
                              <Button size="sm" variant="outline">
                                Mark Read
                              </Button>
                            )}
                            {notification.followUpRequired && (
                              <Button size="sm">
                                Respond
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
        </div>
    </div>
  );
}