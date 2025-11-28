import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  MessageCircle, 
  Users, 
  Heart, 
  Shield, 
  Smartphone, 
  Accessibility,
  Globe,
  Eye,
  Volume2,
  Languages,
  Activity,
  Stethoscope,
  Wifi,
  Lock,
  CheckCircle,
  AlertCircle,
  Settings
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

export default function MentorFacilitator() {
  const [activeTab, setActiveTab] = useState("sessions");
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [newMessage, setNewMessage] = useState("");
  
  const [newSessionData, setNewSessionData] = useState({
    sessionType: "",
    mentorId: "",
    facilitatorId: "",
    messagingPlatform: "",
    accessibilityMode: "",
    healthcareContext: "",
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch co-editing sessions
  const { data: sessions = [], isLoading: sessionsLoading } = useQuery({
    queryKey: ["/api/co-editing-sessions"],
    enabled: activeTab === "sessions",
  });

  // Fetch messaging integrations
  const { data: messagingIntegrations = [], isLoading: messagingLoading } = useQuery({
    queryKey: ["/api/messaging-integrations"],
    enabled: activeTab === "integrations",
  });

  // Fetch healthcare integrations
  const { data: healthcareIntegrations = [], isLoading: healthcareLoading } = useQuery({
    queryKey: ["/api/healthcare-integrations"],
    enabled: activeTab === "integrations",
  });

  // Fetch accessibility settings
  const { data: accessibilitySettings, isLoading: accessibilityLoading } = useQuery({
    queryKey: ["/api/accessibility-settings"],
    enabled: activeTab === "accessibility",
  });

  // Fetch messages for selected session
  const { data: messages = [], isLoading: messagesLoading } = useQuery({
    queryKey: ["/api/co-editing-sessions", selectedSession?.id, "messages"],
    enabled: !!selectedSession,
  });

  // Create co-editing session mutation
  const createSession = useMutation({
    mutationFn: async (sessionData: any) => {
      const response = await fetch("/api/co-editing-sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sessionData),
      });
      if (!response.ok) throw new Error("Failed to create session");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/co-editing-sessions"] });
      setNewSessionData({
        sessionType: "",
        mentorId: "",
        facilitatorId: "",
        messagingPlatform: "",
        accessibilityMode: "",
        healthcareContext: "",
      });
      toast({
        title: "Session Created",
        description: "Co-editing session created successfully!",
      });
    },
  });

  // Send message mutation
  const sendMessage = useMutation({
    mutationFn: async ({ sessionId, messageData }: { sessionId: number; messageData: any }) => {
      const response = await fetch(`/api/co-editing-sessions/${sessionId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(messageData),
      });
      if (!response.ok) throw new Error("Failed to send message");
      return response.json();
    },
    onSuccess: () => {
      if (selectedSession) {
        queryClient.invalidateQueries({ 
          queryKey: ["/api/co-editing-sessions", selectedSession.id, "messages"] 
        });
      }
      setNewMessage("");
      toast({
        title: "Message Sent",
        description: "Message delivered across all platforms with translations",
      });
    },
  });

  // Create messaging integration mutation
  const createMessagingIntegration = useMutation({
    mutationFn: async (integrationData: any) => {
      const response = await fetch("/api/messaging-integrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(integrationData),
      });
      if (!response.ok) throw new Error("Failed to create integration");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/messaging-integrations"] });
      toast({
        title: "Integration Added",
        description: "Messaging platform connected successfully!",
      });
    },
  });

  // Update accessibility settings mutation
  const updateAccessibilitySettings = useMutation({
    mutationFn: async (settings: any) => {
      const response = await fetch(`/api/accessibility-settings/${accessibilitySettings?.id || 1}`, {
        method: accessibilitySettings ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (!response.ok) throw new Error("Failed to update settings");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/accessibility-settings"] });
      toast({
        title: "Settings Updated",
        description: "Accessibility preferences saved successfully!",
      });
    },
  });

  const handleSendMessage = () => {
    if (!selectedSession || !newMessage.trim()) return;
    
    sendMessage.mutate({
      sessionId: selectedSession.id,
      messageData: {
        messageType: "text",
        content: newMessage,
      },
    });
  };

  const messagingPlatforms = [
    { id: "imessage", name: "iMessage", icon: Smartphone, color: "bg-blue-100 text-blue-800" },
    { id: "whatsapp", name: "WhatsApp", icon: MessageCircle, color: "bg-green-100 text-green-800" },
    { id: "facebook_messenger", name: "Facebook Messenger", icon: MessageCircle, color: "bg-blue-100 text-blue-800" },
    { id: "google_messages", name: "Google Messages", icon: MessageCircle, color: "bg-orange-100 text-orange-800" },
    { id: "signal", name: "Signal", icon: Shield, color: "bg-gray-100 text-gray-800" },
  ];

  const healthcareSystems = [
    { id: "mychart", name: "MyChart", icon: Stethoscope, color: "bg-red-100 text-red-800" },
    { id: "apple_health", name: "Apple Health", icon: Heart, color: "bg-red-100 text-red-800" },
    { id: "openehr", name: "OpenEHR", icon: Activity, color: "bg-blue-100 text-blue-800" },
    { id: "epic", name: "Epic", icon: Stethoscope, color: "bg-purple-100 text-purple-800" },
    { id: "cerner", name: "Cerner", icon: Activity, color: "bg-green-100 text-green-800" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Intersex Healthcare Affirmation */}
        <Alert className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/40 border-purple-200">
          <Heart className="h-5 w-5 text-purple-600" />
          <AlertDescription className="ml-2">
            <strong>Intersex Healthcare IS Everyone's Affirmation:</strong> Mentor-facilitator collaboration centers intersex anatomy as the universal baseline. There is no separate "transgender healthcare" category—all guidance serves ALL bodies by design.
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
            Mentor & Facilitator Co-editing 🤝
          </h1>
          <p className="text-lg text-muted-foreground">
            Collaborative health guidance with cross-platform messaging and accessibility support
          </p>
          <div className="text-sm text-muted-foreground">
            Licensed under <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener noreferrer" className="text-primary underline">
              Creative Commons BY-SA 4.0
            </a>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="sessions">Co-editing Sessions</TabsTrigger>
            <TabsTrigger value="integrations">Platform Integrations</TabsTrigger>
            <TabsTrigger value="accessibility">Accessibility & Translation</TabsTrigger>
            <TabsTrigger value="healthcare">Healthcare Data</TabsTrigger>
          </TabsList>

          {/* Co-editing Sessions Tab */}
          <TabsContent value="sessions" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Sessions List */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Active Sessions
                  </CardTitle>
                  <CardDescription>
                    Collaborative editing sessions with mentors and facilitators
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {sessionsLoading ? (
                    <div className="text-center py-4">Loading sessions...</div>
                  ) : sessions.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No active sessions. Create a new one below!
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {sessions.map((session: any) => (
                        <div 
                          key={session.id} 
                          className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                            selectedSession?.id === session.id ? 'bg-primary/10 border-primary' : 'hover:bg-gray-50'
                          }`}
                          onClick={() => setSelectedSession(session)}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium capitalize">{session.sessionType.replace('_', ' ')}</h4>
                              <p className="text-sm text-muted-foreground">
                                {session.healthcareContext} • {session.messagingPlatform}
                              </p>
                              <div className="flex gap-2 mt-2">
                                <Badge variant="outline">{session.accessibilityMode}</Badge>
                                <Badge variant={session.isActive ? "default" : "secondary"}>
                                  {session.isActive ? "Active" : "Ended"}
                                </Badge>
                              </div>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {format(new Date(session.startedAt), "MMM d, h:mm a")}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Create New Session */}
                  <div className="border-t pt-4 space-y-4">
                    <h3 className="font-semibold">Create New Session</h3>
                    
                    <div className="grid grid-cols-1 gap-3">
                      <div className="space-y-2">
                        <Label>Session Type</Label>
                        <Select
                          value={newSessionData.sessionType}
                          onValueChange={(value) => setNewSessionData(prev => ({ ...prev, sessionType: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select session type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="peer_mentoring">Peer Mentoring</SelectItem>
                            <SelectItem value="health_guidance">Health Guidance</SelectItem>
                            <SelectItem value="accessibility_support">Accessibility Support</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Messaging Platform</Label>
                        <Select
                          value={newSessionData.messagingPlatform}
                          onValueChange={(value) => setNewSessionData(prev => ({ ...prev, messagingPlatform: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select platform" />
                          </SelectTrigger>
                          <SelectContent>
                            {messagingPlatforms.map((platform) => (
                              <SelectItem key={platform.id} value={platform.id}>
                                {platform.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Accessibility Mode</Label>
                        <Select
                          value={newSessionData.accessibilityMode}
                          onValueChange={(value) => setNewSessionData(prev => ({ ...prev, accessibilityMode: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select accessibility mode" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="text_only">Text Only</SelectItem>
                            <SelectItem value="braille">Braille Translation</SelectItem>
                            <SelectItem value="sign_language">Sign Language</SelectItem>
                            <SelectItem value="voice_only">Voice Only</SelectItem>
                            <SelectItem value="multi_modal">Multi-modal</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <Button 
                        onClick={() => createSession.mutate(newSessionData)}
                        disabled={!newSessionData.sessionType || !newSessionData.messagingPlatform || createSession.isPending}
                        className="w-full"
                      >
                        {createSession.isPending ? "Creating..." : "Create Session"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Messages Panel */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5" />
                    {selectedSession ? `Session Messages` : "Select a Session"}
                  </CardTitle>
                  {selectedSession && (
                    <CardDescription>
                      Real-time messaging with translation and accessibility support
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  {!selectedSession ? (
                    <div className="text-center py-8 text-muted-foreground">
                      Select a session to view messages
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Messages List */}
                      <div className="h-64 overflow-y-auto space-y-3 border rounded-lg p-3">
                        {messagesLoading ? (
                          <div className="text-center py-4">Loading messages...</div>
                        ) : messages.length === 0 ? (
                          <div className="text-center py-8 text-muted-foreground">
                            No messages yet. Start the conversation!
                          </div>
                        ) : (
                          messages.map((message: any) => (
                            <div key={message.id} className="space-y-2">
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium text-sm">
                                      User {message.senderId}
                                    </span>
                                    <Badge variant="outline" className="text-xs">
                                      {message.messageType}
                                    </Badge>
                                  </div>
                                  <p className="mt-1">{message.content}</p>
                                  
                                  {/* Health Data Reference */}
                                  {message.healthDataReference && Object.keys(message.healthDataReference).length > 0 && (
                                    <div className="mt-2 p-2 bg-blue-50 rounded-lg">
                                      <div className="text-xs font-medium text-blue-800">Health Data Shared</div>
                                      <div className="text-xs text-blue-600">
                                        {message.healthDataReference.dataType}: {JSON.stringify(message.healthDataReference.values)}
                                      </div>
                                    </div>
                                  )}

                                  {/* Translation Options */}
                                  {message.brailleTranslation && (
                                    <div className="mt-2 p-2 bg-gray-50 rounded-lg">
                                      <div className="text-xs font-medium">Braille: {message.brailleTranslation}</div>
                                    </div>
                                  )}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {format(new Date(message.sentAt), "h:mm a")}
                                </div>
                              </div>
                              
                              {/* Platform Delivery Status */}
                              <div className="flex gap-1">
                                {Object.entries(message.platformDeliveryStatus).map(([platform, status]) => (
                                  <Badge key={platform} variant="outline" className="text-xs">
                                    {platform}: {status as string}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          ))
                        )}
                      </div>

                      {/* Send Message */}
                      <div className="space-y-3">
                        <Textarea
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="Type your message... (will be translated and sent to all platforms)"
                          className="min-h-[80px]"
                        />
                        <Button 
                          onClick={handleSendMessage}
                          disabled={!newMessage.trim() || sendMessage.isPending}
                          className="w-full"
                        >
                          {sendMessage.isPending ? "Sending..." : "Send Message"}
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Platform Integrations Tab */}
          <TabsContent value="integrations" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Messaging Platforms */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5" />
                    Messaging Platforms
                  </CardTitle>
                  <CardDescription>
                    Connect messaging platforms for cross-platform communication
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {messagingLoading ? (
                    <div className="text-center py-4">Loading integrations...</div>
                  ) : (
                    <div className="space-y-3">
                      {messagingPlatforms.map((platform) => {
                        const integration = messagingIntegrations.find((i: any) => i.platform === platform.id);
                        const Icon = platform.icon;
                        
                        return (
                          <div key={platform.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-lg ${platform.color}`}>
                                <Icon className="h-4 w-4" />
                              </div>
                              <div>
                                <h4 className="font-medium">{platform.name}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {integration ? `Connected: ${integration.platformUserId}` : "Not connected"}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {integration && (
                                <Badge variant={integration.isActive ? "default" : "secondary"}>
                                  {integration.isActive ? "Active" : "Inactive"}
                                </Badge>
                              )}
                              <Button
                                size="sm"
                                variant={integration ? "outline" : "default"}
                                onClick={() => {
                                  if (!integration) {
                                    createMessagingIntegration.mutate({
                                      platform: platform.id,
                                      platformUserId: `user@${platform.id}.com`,
                                      isActive: true,
                                    });
                                  }
                                }}
                              >
                                {integration ? "Manage" : "Connect"}
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Healthcare Systems */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Stethoscope className="h-5 w-5" />
                    Healthcare Systems
                  </CardTitle>
                  <CardDescription>
                    Integrate with healthcare platforms for contextual data sharing
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {healthcareLoading ? (
                    <div className="text-center py-4">Loading integrations...</div>
                  ) : (
                    <div className="space-y-3">
                      {healthcareSystems.map((system) => {
                        const integration = healthcareIntegrations.find((i: any) => i.system === system.id);
                        const Icon = system.icon;
                        
                        return (
                          <div key={system.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-lg ${system.color}`}>
                                <Icon className="h-4 w-4" />
                              </div>
                              <div>
                                <h4 className="font-medium">{system.name}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {integration ? `Patient ID: ${integration.patientId}` : "Not connected"}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {integration && (
                                <Badge variant={integration.isActive ? "default" : "secondary"}>
                                  {integration.isActive ? "Synced" : "Inactive"}
                                </Badge>
                              )}
                              <Button
                                size="sm"
                                variant={integration ? "outline" : "default"}
                              >
                                {integration ? "Manage" : "Connect"}
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Accessibility & Translation Tab */}
          <TabsContent value="accessibility" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Accessibility className="h-5 w-5" />
                  Accessibility & Translation Settings
                </CardTitle>
                <CardDescription>
                  Configure accessibility features and real-time translation services
                </CardDescription>
              </CardHeader>
              <CardContent>
                {accessibilityLoading ? (
                  <div className="text-center py-4">Loading settings...</div>
                ) : (
                  <div className="space-y-6">
                    {/* Visual Accessibility */}
                    <div className="space-y-4">
                      <h3 className="font-semibold flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        Visual Accessibility
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <h4 className="font-medium">Braille Translation</h4>
                            <p className="text-sm text-muted-foreground">Convert text to braille</p>
                          </div>
                          <Switch 
                            checked={accessibilitySettings?.brailleEnabled || false}
                            onCheckedChange={(checked) => {
                              updateAccessibilitySettings.mutate({
                                ...accessibilitySettings,
                                brailleEnabled: checked
                              });
                            }}
                          />
                        </div>

                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <h4 className="font-medium">High Contrast Mode</h4>
                            <p className="text-sm text-muted-foreground">Enhanced visibility</p>
                          </div>
                          <Switch 
                            checked={accessibilitySettings?.highContrastMode || false}
                            onCheckedChange={(checked) => {
                              updateAccessibilitySettings.mutate({
                                ...accessibilitySettings,
                                highContrastMode: checked
                              });
                            }}
                          />
                        </div>

                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <h4 className="font-medium">Large Font Mode</h4>
                            <p className="text-sm text-muted-foreground">Increased text size</p>
                          </div>
                          <Switch 
                            checked={accessibilitySettings?.largeFontMode || false}
                            onCheckedChange={(checked) => {
                              updateAccessibilitySettings.mutate({
                                ...accessibilitySettings,
                                largeFontMode: checked
                              });
                            }}
                          />
                        </div>

                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <h4 className="font-medium">Screen Reader Compatible</h4>
                            <p className="text-sm text-muted-foreground">ARIA compliance</p>
                          </div>
                          <Switch 
                            checked={accessibilitySettings?.screenReaderCompatible || false}
                            onCheckedChange={(checked) => {
                              updateAccessibilitySettings.mutate({
                                ...accessibilitySettings,
                                screenReaderCompatible: checked
                              });
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Audio Accessibility */}
                    <div className="space-y-4">
                      <h3 className="font-semibold flex items-center gap-2">
                        <Volume2 className="h-4 w-4" />
                        Audio & Communication
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <h4 className="font-medium">Sign Language Translation</h4>
                            <p className="text-sm text-muted-foreground">ASL/BSL support</p>
                          </div>
                          <Switch 
                            checked={accessibilitySettings?.signLanguageEnabled || false}
                            onCheckedChange={(checked) => {
                              updateAccessibilitySettings.mutate({
                                ...accessibilitySettings,
                                signLanguageEnabled: checked
                              });
                            }}
                          />
                        </div>

                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <h4 className="font-medium">Speech to Text</h4>
                            <p className="text-sm text-muted-foreground">Voice input</p>
                          </div>
                          <Switch 
                            checked={accessibilitySettings?.speechToTextEnabled || false}
                            onCheckedChange={(checked) => {
                              updateAccessibilitySettings.mutate({
                                ...accessibilitySettings,
                                speechToTextEnabled: checked
                              });
                            }}
                          />
                        </div>

                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <h4 className="font-medium">Text to Speech</h4>
                            <p className="text-sm text-muted-foreground">Audio output</p>
                          </div>
                          <Switch 
                            checked={accessibilitySettings?.textToSpeechEnabled || false}
                            onCheckedChange={(checked) => {
                              updateAccessibilitySettings.mutate({
                                ...accessibilitySettings,
                                textToSpeechEnabled: checked
                              });
                            }}
                          />
                        </div>

                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <h4 className="font-medium">Keyboard Navigation Only</h4>
                            <p className="text-sm text-muted-foreground">Motor accessibility</p>
                          </div>
                          <Switch 
                            checked={accessibilitySettings?.keyboardNavigationOnly || false}
                            onCheckedChange={(checked) => {
                              updateAccessibilitySettings.mutate({
                                ...accessibilitySettings,
                                keyboardNavigationOnly: checked
                              });
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Language Settings */}
                    <div className="space-y-4">
                      <h3 className="font-semibold flex items-center gap-2">
                        <Languages className="h-4 w-4" />
                        Language & Translation
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Braille Grade</Label>
                          <Select
                            value={accessibilitySettings?.brailleGrade || "grade2"}
                            onValueChange={(value) => {
                              updateAccessibilitySettings.mutate({
                                ...accessibilitySettings,
                                brailleGrade: value
                              });
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="grade1">Grade 1 (Uncontracted)</SelectItem>
                              <SelectItem value="grade2">Grade 2 (Contracted)</SelectItem>
                              <SelectItem value="grade3">Grade 3 (Personal shorthand)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Sign Language Type</Label>
                          <Select
                            value={accessibilitySettings?.signLanguageType || "asl"}
                            onValueChange={(value) => {
                              updateAccessibilitySettings.mutate({
                                ...accessibilitySettings,
                                signLanguageType: value
                              });
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="asl">ASL (American Sign Language)</SelectItem>
                              <SelectItem value="bsl">BSL (British Sign Language)</SelectItem>
                              <SelectItem value="auslan">Auslan (Australian Sign Language)</SelectItem>
                              <SelectItem value="psl">PSL (Pakistani Sign Language)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Healthcare Data Tab */}
          <TabsContent value="healthcare" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Healthcare Data Integration
                </CardTitle>
                <CardDescription>
                  View and sync health data from connected healthcare systems
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  Healthcare data integration interface will be implemented with secure HIPAA-compliant
                  data handling and real-time sync capabilities across MyChart, Apple Health, OpenEHR,
                  and other healthcare platforms.
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}