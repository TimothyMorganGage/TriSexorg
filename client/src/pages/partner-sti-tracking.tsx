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
  Lock, 
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
  Package,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { BetaDisclaimer } from "@/components/BetaDisclaimer";
import { Alert, AlertDescription } from "@/components/ui/alert";

const KIND_LABELS: Record<string, string> = {
  ongoing: "Ongoing",
  occasional: "Occasional",
  past: "Past",
};

const BARRIER_LABELS: Record<string, string> = {
  always: "Barriers: always",
  sometimes: "Barriers: sometimes",
  "fluid-bonded": "Fluid-bonded",
  "prefer-not-to-say": "Barriers: not shared",
};

const CADENCE_LABELS: Record<string, string> = {
  "every-3-months": "Tests every 3 months",
  "every-6-months": "Tests every 6 months",
  "every-12-months": "Tests every 12 months",
  "after-new-contact": "Tests after a new contact",
};

const STATUS_META: Record<string, { label: string; className: string }> = {
  current: { label: "Current", className: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200" },
  "due-soon": { label: "Due soon", className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200" },
  overdue: { label: "Overdue", className: "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200" },
  unknown: { label: "Unknown", className: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300" },
};

const EMPTY_CONTACT_FORM = {
  contactLabel: "",
  contactNickname: "",
  contactKind: "ongoing",
  barrierPosture: "",
  cadenceCommitment: "",
  lastTestDate: "",
};

export default function PartnerSTITracking() {
  const [activeTab, setActiveTab] = useState("health-circle");
  const [contactForm, setContactForm] = useState({ ...EMPTY_CONTACT_FORM });
  const [editingContactId, setEditingContactId] = useState<number | null>(null);
  const [invitingContactId, setInvitingContactId] = useState<number | null>(null);
  const [inviteEmail, setInviteEmail] = useState("");
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

  // Fetch the private health circle (implicit, one per user)
  const { data: healthCircle, isLoading: circleLoading } = useQuery<{ circle: any; contacts: any[] }>({
    queryKey: ["/api/health-circle"],
    enabled: activeTab === "health-circle",
  });

  const saveContact = useMutation({
    mutationFn: async () => {
      const payload: any = {
        contactLabel: contactForm.contactLabel,
        contactNickname: contactForm.contactNickname || null,
        contactKind: contactForm.contactKind,
        barrierPosture: contactForm.barrierPosture || null,
        cadenceCommitment: contactForm.cadenceCommitment || null,
        lastTestDate: contactForm.lastTestDate || null,
      };
      const url = editingContactId
        ? `/api/health-circle/contacts/${editingContactId}`
        : "/api/health-circle/contacts";
      const response = await fetch(url, {
        method: editingContactId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || "Failed to save contact");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/health-circle"] });
      setContactForm({ ...EMPTY_CONTACT_FORM });
      setEditingContactId(null);
      toast({ title: editingContactId ? "Contact updated" : "Contact added" });
    },
    onError: (error: Error) => {
      toast({ title: "Could not save contact", description: error.message, variant: "destructive" });
    },
  });

  const setReminders = useMutation({
    mutationFn: async (remindersEnabled: boolean) => {
      const response = await fetch("/api/health-circle/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ remindersEnabled }),
      });
      if (!response.ok) throw new Error("Failed to update reminder settings");
      return response.json();
    },
    onSuccess: (_data, remindersEnabled) => {
      queryClient.invalidateQueries({ queryKey: ["/api/health-circle"] });
      toast({
        title: remindersEnabled ? "Reminders on" : "Reminders off",
        description: remindersEnabled
          ? "You'll see a prompt here when a test is due soon or overdue."
          : "You won't see testing reminders. You can turn them back on anytime.",
      });
    },
    onError: (error: Error) => {
      toast({ title: "Could not update reminders", description: error.message, variant: "destructive" });
    },
  });

  // Invites addressed to me (as an invitee) and links where I'm the linked account
  const { data: linkInvites = [] } = useQuery<any[]>({
    queryKey: ["/api/health-circle/link-invites"],
    enabled: activeTab === "health-circle",
  });
  const { data: linkedToMe = [] } = useQuery<any[]>({
    queryKey: ["/api/health-circle/linked-to-me"],
    enabled: activeTab === "health-circle",
  });

  const invalidateLinkQueries = () => {
    queryClient.invalidateQueries({ queryKey: ["/api/health-circle"] });
    queryClient.invalidateQueries({ queryKey: ["/api/health-circle/link-invites"] });
    queryClient.invalidateQueries({ queryKey: ["/api/health-circle/linked-to-me"] });
  };

  const sendInvite = useMutation({
    mutationFn: async ({ contactId, email }: { contactId: number; email: string }) => {
      const response = await fetch(`/api/health-circle/contacts/${contactId}/invite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body.message || "Failed to send invite");
      return body;
    },
    onSuccess: (data) => {
      invalidateLinkQueries();
      setInvitingContactId(null);
      setInviteEmail("");
      toast({ title: "Invite sent", description: data.message });
    },
    onError: (error: Error) => {
      toast({ title: "Could not send invite", description: error.message, variant: "destructive" });
    },
  });

  const cancelInvite = useMutation({
    mutationFn: async (contactId: number) => {
      const response = await fetch(`/api/health-circle/contacts/${contactId}/invite`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to cancel invite");
      return response.json();
    },
    onSuccess: () => {
      invalidateLinkQueries();
      toast({ title: "Invite cancelled" });
    },
  });

  const respondToInvite = useMutation({
    mutationFn: async ({ inviteId, accept }: { inviteId: number; accept: boolean }) => {
      const response = await fetch(`/api/health-circle/link-invites/${inviteId}/respond`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accept }),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body.message || "Failed to respond to invite");
      return body;
    },
    onSuccess: (_data, { accept }) => {
      invalidateLinkQueries();
      toast({
        title: accept ? "Linked" : "Invite declined",
        description: accept ? "You're now linked. Either of you can unlink at any time." : undefined,
      });
    },
    onError: (error: Error) => {
      toast({ title: "Could not respond", description: error.message, variant: "destructive" });
    },
  });

  const unlinkContact = useMutation({
    mutationFn: async (contactId: number) => {
      const response = await fetch(`/api/health-circle/contacts/${contactId}/unlink`, { method: "POST" });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body.message || "Failed to unlink");
      return body;
    },
    onSuccess: () => {
      invalidateLinkQueries();
      toast({ title: "Unlinked", description: "The account link has been removed." });
    },
    onError: (error: Error) => {
      toast({ title: "Could not unlink", description: error.message, variant: "destructive" });
    },
  });

  const removeContact = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/health-circle/contacts/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to remove contact");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/health-circle"] });
      toast({ title: "Contact removed" });
    },
  });

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
              <Heart className="h-5 w-5 text-black dark:text-white" />
              <AlertDescription className="ml-2 text-black dark:text-white">
                <strong>Intersex Healthcare IS Everyone's Affirmation:</strong> Partner STI tracking centers intersex anatomy as the universal baseline—trans, non-binary, genderqueer, and quare embodiment are all respected within this participatory budgeting framework. There is no separate "transgender healthcare" category—sexual health monitoring serves ALL bodies by design.
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
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="health-circle">Health Circle</TabsTrigger>
            <TabsTrigger value="networks">Partner Networks</TabsTrigger>
            <TabsTrigger value="sti-tracking">4D STI Tracking</TabsTrigger>
            <TabsTrigger value="product-customization">Product Customization</TabsTrigger>
            <TabsTrigger value="natural-senses">Natural Senses</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          {/* Shared Health Circle Tab */}
          <TabsContent value="health-circle" className="space-y-6">
            {(() => {
              if (!healthCircle) return null;
              const remindersEnabled = healthCircle.circle?.remindersEnabled !== false;
              const overdue = healthCircle.contacts.filter((c: any) => c.status === "overdue");
              const dueSoon = healthCircle.contacts.filter((c: any) => c.status === "due-soon");
              if (remindersEnabled && (overdue.length > 0 || dueSoon.length > 0)) {
                const parts: string[] = [];
                if (overdue.length > 0)
                  parts.push(`${overdue.length} contact${overdue.length > 1 ? "s are" : " is"} overdue for a test`);
                if (dueSoon.length > 0)
                  parts.push(`${dueSoon.length} contact${dueSoon.length > 1 ? "s are" : " is"} due soon`);
                return (
                  <Alert
                    className={overdue.length > 0 ? "border-red-300 bg-red-50 dark:bg-red-950/30" : "border-amber-300 bg-amber-50 dark:bg-amber-950/30"}
                    data-testid="banner-testing-reminder"
                  >
                    <Bell className="h-4 w-4" />
                    <AlertDescription className="flex flex-wrap items-center justify-between gap-2">
                      <span>
                        <span className="font-medium">Testing reminder:</span>{" "}
                        {parts.join(" and ")}. This reminder is private to you.
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        data-testid="button-disable-reminders"
                        onClick={() => setReminders.mutate(false)}
                        disabled={setReminders.isPending}
                      >
                        Turn off reminders
                      </Button>
                    </AlertDescription>
                  </Alert>
                );
              }
              if (!remindersEnabled) {
                return (
                  <div className="flex items-center justify-between text-xs text-muted-foreground px-1" data-testid="row-reminders-off">
                    <span>Testing reminders are off.</span>
                    <Button
                      size="sm"
                      variant="outline"
                      data-testid="button-enable-reminders"
                      onClick={() => setReminders.mutate(true)}
                      disabled={setReminders.isPending}
                    >
                      Turn on reminders
                    </Button>
                  </div>
                );
              }
              return null;
            })()}
            <Alert>
              <Lock className="h-4 w-4" />
              <AlertDescription>
                Your health circle is private. Contacts are records you enter yourself — nothing here is
                listed, searchable, or visible to anyone else, and results are only ever shared when you
                explicitly choose to share a specific one.
              </AlertDescription>
            </Alert>

            {linkInvites.length > 0 && (
              <Card data-testid="card-link-invites">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Bell className="h-4 w-4" />
                    Link invites for you
                  </CardTitle>
                  <CardDescription>
                    Someone asked to link one of their private circle contacts to your account. Linking only
                    lets them explicitly share individual test results with you — nothing is shared automatically,
                    and you can unlink at any time.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {linkInvites.map((invite: any) => (
                    <div
                      key={invite.id}
                      className="flex items-center justify-between gap-2 border rounded-lg p-3"
                      data-testid={`row-link-invite-${invite.id}`}
                    >
                      <div className="text-sm">
                        <span className="font-medium">{invite.inviterUsername}</span> invited you to link
                        {invite.invitedAt && (
                          <span className="text-muted-foreground"> · {format(new Date(invite.invitedAt), "MMM d, yyyy")}</span>
                        )}
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <Button
                          size="sm"
                          data-testid={`button-accept-invite-${invite.id}`}
                          disabled={respondToInvite.isPending}
                          onClick={() => respondToInvite.mutate({ inviteId: invite.id, accept: true })}
                        >
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          data-testid={`button-decline-invite-${invite.id}`}
                          disabled={respondToInvite.isPending}
                          onClick={() => respondToInvite.mutate({ inviteId: invite.id, accept: false })}
                        >
                          Decline
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {linkedToMe.length > 0 && (
              <Card data-testid="card-linked-to-me">
                <CardHeader>
                  <CardTitle className="text-base">Accounts linked to you</CardTitle>
                  <CardDescription>
                    These people have linked a contact in their circle to your account, with your consent.
                    You can unlink at any time.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {linkedToMe.map((link: any) => (
                    <div
                      key={link.id}
                      className="flex items-center justify-between gap-2 border rounded-lg p-3"
                      data-testid={`row-linked-to-me-${link.id}`}
                    >
                      <div className="text-sm font-medium">{link.ownerUsername}</div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive"
                        data-testid={`button-unlink-from-me-${link.id}`}
                        disabled={unlinkContact.isPending}
                        onClick={() => unlinkContact.mutate(link.id)}
                      >
                        Unlink
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Circle contacts with per-contact testing status */}
              <Card data-testid="card-circle-contacts">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users2 className="h-5 w-5" />
                    Your Circle
                  </CardTitle>
                  <CardDescription>
                    Per-contact testing cadence and status — current, due soon, overdue, or unknown
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {circleLoading ? (
                    <div className="text-center py-4">Loading your circle...</div>
                  ) : !healthCircle || healthCircle.contacts.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground" data-testid="text-empty-circle">
                      No contacts yet. Add your first contact — a spouse, partner, or close contact — using the form.
                    </div>
                  ) : (
                    healthCircle.contacts.map((contact: any) => {
                      const meta = STATUS_META[contact.status] || STATUS_META.unknown;
                      return (
                        <div key={contact.id} className="border rounded-lg p-3" data-testid={`card-contact-${contact.id}`}>
                          <div className="flex justify-between items-start gap-2">
                            <div className="min-w-0">
                              <h4 className="font-medium truncate">
                                {contact.contactLabel || "Unnamed contact"}
                                {contact.contactNickname && (
                                  <span className="text-muted-foreground font-normal"> · {contact.contactNickname}</span>
                                )}
                              </h4>
                              <div className="flex flex-wrap gap-2 mt-2">
                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${meta.className}`} data-testid={`status-contact-${contact.id}`}>
                                  {meta.label}
                                </span>
                                {contact.contactKind && (
                                  <Badge variant="outline">{KIND_LABELS[contact.contactKind] || contact.contactKind}</Badge>
                                )}
                                {contact.barrierPosture && (
                                  <Badge variant="outline">{BARRIER_LABELS[contact.barrierPosture] || contact.barrierPosture}</Badge>
                                )}
                                {contact.linkStatus === "linked" && (
                                  <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200" data-testid={`badge-linked-${contact.id}`}>
                                    Linked account
                                  </Badge>
                                )}
                                {contact.linkStatus === "pending" && (
                                  <Badge variant="secondary" data-testid={`badge-invite-pending-${contact.id}`}>
                                    Invite pending
                                  </Badge>
                                )}
                              </div>
                              <div className="text-xs text-muted-foreground mt-2 space-y-0.5">
                                {contact.cadenceCommitment && (
                                  <div>{CADENCE_LABELS[contact.cadenceCommitment] || contact.cadenceCommitment}</div>
                                )}
                                <div>
                                  Last test:{" "}
                                  {contact.effectiveLastTestDate
                                    ? format(new Date(contact.effectiveLastTestDate), "MMM d, yyyy")
                                    : "not recorded"}
                                </div>
                                {contact.nextTestDue && (
                                  <div>Next test due: {format(new Date(contact.nextTestDue), "MMM d, yyyy")}</div>
                                )}
                              </div>
                            </div>
                            <div className="flex flex-col gap-1 shrink-0">
                              <Button
                                size="sm"
                                variant="outline"
                                data-testid={`button-edit-contact-${contact.id}`}
                                onClick={() => {
                                  setEditingContactId(contact.id);
                                  setContactForm({
                                    contactLabel: contact.contactLabel || "",
                                    contactNickname: contact.contactNickname || "",
                                    contactKind: contact.contactKind || "ongoing",
                                    barrierPosture: contact.barrierPosture || "",
                                    cadenceCommitment: contact.cadenceCommitment || "",
                                    lastTestDate: contact.lastTestDate
                                      ? format(new Date(contact.lastTestDate), "yyyy-MM-dd")
                                      : "",
                                  });
                                }}
                              >
                                Edit
                              </Button>
                              {(!contact.linkStatus || contact.linkStatus === "none") && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  data-testid={`button-invite-link-${contact.id}`}
                                  onClick={() => {
                                    setInvitingContactId(invitingContactId === contact.id ? null : contact.id);
                                    setInviteEmail("");
                                  }}
                                >
                                  Invite to link
                                </Button>
                              )}
                              {contact.linkStatus === "pending" && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  data-testid={`button-cancel-invite-${contact.id}`}
                                  disabled={cancelInvite.isPending}
                                  onClick={() => cancelInvite.mutate(contact.id)}
                                >
                                  Cancel invite
                                </Button>
                              )}
                              {contact.linkStatus === "linked" && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  data-testid={`button-unlink-contact-${contact.id}`}
                                  disabled={unlinkContact.isPending}
                                  onClick={() => unlinkContact.mutate(contact.id)}
                                >
                                  Unlink
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-destructive"
                                data-testid={`button-remove-contact-${contact.id}`}
                                onClick={() => removeContact.mutate(contact.id)}
                              >
                                Remove
                              </Button>
                            </div>
                          </div>
                          {invitingContactId === contact.id && (
                            <div className="mt-3 pt-3 border-t space-y-2" data-testid={`form-invite-${contact.id}`}>
                              <Label className="text-xs">
                                Invite this person's account by email. They must accept before anything can be shared.
                              </Label>
                              <div className="flex gap-2">
                                <Input
                                  type="email"
                                  placeholder="their-email@example.com"
                                  value={inviteEmail}
                                  onChange={(e) => setInviteEmail(e.target.value)}
                                  data-testid={`input-invite-email-${contact.id}`}
                                />
                                <Button
                                  size="sm"
                                  data-testid={`button-send-invite-${contact.id}`}
                                  disabled={sendInvite.isPending || !inviteEmail.trim()}
                                  onClick={() => sendInvite.mutate({ contactId: contact.id, email: inviteEmail.trim() })}
                                >
                                  Send
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </CardContent>
              </Card>

              {/* Add / edit contact */}
              <Card data-testid="card-contact-form">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserPlus className="h-5 w-5" />
                    {editingContactId ? "Edit Contact" : "Add a Contact"}
                  </CardTitle>
                  <CardDescription>
                    Use your own words — "spouse", "partner", "J." No labels are imposed.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <Label>Label</Label>
                    <Input
                      data-testid="input-contact-label"
                      value={contactForm.contactLabel}
                      onChange={(e) => setContactForm((p) => ({ ...p, contactLabel: e.target.value }))}
                      placeholder='e.g., "spouse", "partner", "J."'
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Nickname (optional)</Label>
                    <Input
                      data-testid="input-contact-nickname"
                      value={contactForm.contactNickname}
                      onChange={(e) => setContactForm((p) => ({ ...p, contactNickname: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Contact kind</Label>
                    <Select
                      value={contactForm.contactKind}
                      onValueChange={(v) => setContactForm((p) => ({ ...p, contactKind: v }))}
                    >
                      <SelectTrigger data-testid="select-contact-kind"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ongoing">Ongoing</SelectItem>
                        <SelectItem value="occasional">Occasional</SelectItem>
                        <SelectItem value="past">Past</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Barrier posture with this contact</Label>
                    <Select
                      value={contactForm.barrierPosture}
                      onValueChange={(v) => setContactForm((p) => ({ ...p, barrierPosture: v }))}
                    >
                      <SelectTrigger data-testid="select-barrier-posture">
                        <SelectValue placeholder="Select (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="always">Always</SelectItem>
                        <SelectItem value="sometimes">Sometimes</SelectItem>
                        <SelectItem value="fluid-bonded">Fluid-bonded</SelectItem>
                        <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Testing cadence commitment</Label>
                    <Select
                      value={contactForm.cadenceCommitment}
                      onValueChange={(v) => setContactForm((p) => ({ ...p, cadenceCommitment: v }))}
                    >
                      <SelectTrigger data-testid="select-cadence">
                        <SelectValue placeholder="Select (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="every-3-months">Every 3 months</SelectItem>
                        <SelectItem value="every-6-months">Every 6 months</SelectItem>
                        <SelectItem value="every-12-months">Every 12 months</SelectItem>
                        <SelectItem value="after-new-contact">After a new contact</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Last test date (self-reported)</Label>
                    <Input
                      type="date"
                      data-testid="input-last-test-date"
                      value={contactForm.lastTestDate}
                      onChange={(e) => setContactForm((p) => ({ ...p, lastTestDate: e.target.value }))}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      className="flex-1"
                      data-testid="button-save-contact"
                      disabled={!contactForm.contactLabel.trim() || saveContact.isPending}
                      onClick={() => saveContact.mutate()}
                    >
                      {saveContact.isPending
                        ? "Saving..."
                        : editingContactId
                          ? "Save Changes"
                          : "Add Contact"}
                    </Button>
                    {editingContactId && (
                      <Button
                        variant="outline"
                        data-testid="button-cancel-edit"
                        onClick={() => {
                          setEditingContactId(null);
                          setContactForm({ ...EMPTY_CONTACT_FORM });
                        }}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

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
                  <Package className="h-5 w-5" />
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
                      <Heart className="h-5 w-5" />
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