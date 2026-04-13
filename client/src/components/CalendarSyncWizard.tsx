import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Calendar, 
  CheckCircle, 
  Globe, 
  Smartphone, 
  Server, 
  ArrowRight, 
  ArrowLeft, 
  Wand2,
  Settings,
  Download,
  Upload,
  Zap
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CalendarSyncWizardProps {
  isOpen: boolean;
  onClose: () => void;
}

interface WizardStep {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
}

interface CalendarProvider {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  requiresUrl: boolean;
  authType: 'oauth' | 'url' | 'credentials';
  features: string[];
}

export function CalendarSyncWizard({ isOpen, onClose }: CalendarSyncWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [wizardData, setWizardData] = useState({
    provider: '',
    connectionName: '',
    calendarUrl: '',
    syncDirection: 'bidirectional',
    autoCreateBlocks: false,
    syncFrequency: 'realtime',
    selectedFeatures: [] as string[],
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const wizardSteps: WizardStep[] = [
    {
      id: 'provider',
      title: 'Choose Calendar Provider',
      description: 'Select your calendar system to sync with Wise Time TriSexs',
      icon: Calendar,
    },
    {
      id: 'connection',
      title: 'Connection Details',
      description: 'Configure your calendar connection settings',
      icon: Settings,
    },
    {
      id: 'features',
      title: 'Sync Features',
      description: 'Choose what to sync and how often',
      icon: Zap,
    },
    {
      id: 'test',
      title: 'Test & Connect',
      description: 'Verify connection and complete setup',
      icon: CheckCircle,
    },
  ];

  const calendarProviders: CalendarProvider[] = [
    {
      id: 'google',
      name: 'Google Calendar',
      description: 'Sync with your Google Calendar account using OAuth',
      icon: Globe,
      requiresUrl: false,
      authType: 'oauth',
      features: ['Real-time sync', 'Bidirectional sync', 'Multiple calendars', 'Event reminders'],
    },
    {
      id: 'ical',
      name: 'iCal/CalDAV',
      description: 'Connect via iCal URL or CalDAV server',
      icon: Calendar,
      requiresUrl: true,
      authType: 'url',
      features: ['Standard iCal format', 'Cross-platform', 'Import/Export', 'Self-hosted support'],
    },
    {
      id: 'outlook',
      name: 'Microsoft Outlook',
      description: 'Connect your Outlook calendar via Microsoft Graph API',
      icon: Server,
      requiresUrl: false,
      authType: 'oauth',
      features: ['Office 365 integration', 'Teams meetings', 'Shared calendars', 'Exchange support'],
    },
    {
      id: 'pureos',
      name: 'pureOS Calendar',
      description: 'Integrate with pureOS calendar system and Evolution',
      icon: Smartphone,
      requiresUrl: true,
      authType: 'credentials',
      features: ['Privacy-focused', 'Local sync', 'Evolution integration', 'Open standards'],
    },
  ];

  const syncFeatures = [
    { id: 'time_entries', name: 'Time Entries', description: 'Sync completed time tracking sessions' },
    { id: 'scheduled_tasks', name: 'Scheduled Tasks', description: 'Sync future planned tasks and time blocks' },
    { id: 'calendar_blocks', name: 'Auto Calendar Blocks', description: 'Automatically create calendar events when tracking time' },
    { id: 'reminders', name: 'Smart Reminders', description: 'Get notifications for scheduled Wise Time TriSexs' },
    { id: 'insights', name: 'Time Insights', description: 'Sync productivity insights and time wisdom' },
    { id: 'templates', name: 'Task Templates', description: 'Sync reusable task templates to calendar' },
  ];

  // Create connection mutation
  const createConnection = useMutation({
    mutationFn: async (connectionData: any) => {
      const response = await fetch("/api/calendar-connections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(connectionData),
      });
      if (!response.ok) throw new Error("Failed to create connection");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/calendar-connections"] });
      toast({
        title: "Calendar Connected Successfully!",
        description: "Your calendar is now synced with Wise Time TriSexs",
      });
      onClose();
      setCurrentStep(0);
      setWizardData({
        provider: '',
        connectionName: '',
        calendarUrl: '',
        syncDirection: 'bidirectional',
        autoCreateBlocks: false,
        syncFrequency: 'realtime',
        selectedFeatures: [],
      });
    },
    onError: (error) => {
      toast({
        title: "Connection Failed",
        description: error instanceof Error ? error.message : "Failed to connect calendar",
        variant: "destructive",
      });
    },
  });

  const selectedProvider = calendarProviders.find(p => p.id === wizardData.provider);
  const progressPercentage = ((currentStep + 1) / wizardSteps.length) * 100;

  const handleNext = () => {
    if (currentStep < wizardSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinish = () => {
    if (!wizardData.provider) {
      toast({
        title: "Missing Information",
        description: "Please select a calendar provider",
        variant: "destructive",
      });
      return;
    }

    const connectionData = {
      calendarType: wizardData.provider,
      connectionName: wizardData.connectionName || `${selectedProvider?.name} Connection`,
      calendarUrl: wizardData.calendarUrl,
      syncDirection: wizardData.syncDirection,
      autoCreateBlocks: wizardData.autoCreateBlocks,
      syncFrequency: wizardData.syncFrequency,
      selectedFeatures: wizardData.selectedFeatures,
    };

    createConnection.mutate(connectionData);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Provider Selection
        return (
          <div className="space-y-4">
            <div className="grid gap-4">
              {calendarProviders.map((provider) => (
                <Card 
                  key={provider.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    wizardData.provider === provider.id 
                      ? 'ring-2 ring-primary border-primary' 
                      : 'border-gray-200'
                  }`}
                  onClick={() => setWizardData(prev => ({ ...prev, provider: provider.id }))}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <provider.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{provider.name}</h3>
                        <p className="text-sm text-muted-foreground mb-3">{provider.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {provider.features.map((feature) => (
                            <Badge key={feature} variant="secondary" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      {wizardData.provider === provider.id && (
                        <CheckCircle className="h-5 w-5 text-primary" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 1: // Connection Details
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="connection-name">Connection Name</Label>
              <Input
                id="connection-name"
                value={wizardData.connectionName}
                onChange={(e) => setWizardData(prev => ({ ...prev, connectionName: e.target.value }))}
                placeholder={`My ${selectedProvider?.name} Calendar`}
              />
            </div>

            {selectedProvider?.requiresUrl && (
              <div className="space-y-2">
                <Label htmlFor="calendar-url">
                  {selectedProvider.id === 'ical' ? 'iCal/CalDAV URL' : 'Calendar URL'}
                </Label>
                <Input
                  id="calendar-url"
                  type="url"
                  value={wizardData.calendarUrl}
                  onChange={(e) => setWizardData(prev => ({ ...prev, calendarUrl: e.target.value }))}
                  placeholder={
                    selectedProvider.id === 'ical' 
                      ? 'https://calendar.example.com/calendar.ics'
                      : 'https://your-calendar-url.com'
                  }
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="sync-direction">Sync Direction</Label>
              <Select
                value={wizardData.syncDirection}
                onValueChange={(value) => setWizardData(prev => ({ ...prev, syncDirection: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="import">
                    <div className="flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      Import Only - Bring events to Wise Time TriSexs
                    </div>
                  </SelectItem>
                  <SelectItem value="export">
                    <div className="flex items-center gap-2">
                      <Upload className="h-4 w-4" />
                      Export Only - Send Wise Time TriSexs to calendar
                    </div>
                  </SelectItem>
                  <SelectItem value="bidirectional">
                    <div className="flex items-center gap-2">
                      <ArrowRight className="h-4 w-4" />
                      <ArrowLeft className="h-4 w-4" />
                      Bidirectional - Keep both calendars in sync
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sync-frequency">Sync Frequency</Label>
              <Select
                value={wizardData.syncFrequency}
                onValueChange={(value) => setWizardData(prev => ({ ...prev, syncFrequency: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="realtime">Real-time (instant)</SelectItem>
                  <SelectItem value="5min">Every 5 minutes</SelectItem>
                  <SelectItem value="15min">Every 15 minutes</SelectItem>
                  <SelectItem value="hourly">Every hour</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 2: // Features
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-semibold">Select Sync Features</h3>
              {syncFeatures.map((feature) => (
                <div key={feature.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                  <Switch
                    id={feature.id}
                    checked={wizardData.selectedFeatures.includes(feature.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setWizardData(prev => ({
                          ...prev,
                          selectedFeatures: [...prev.selectedFeatures, feature.id]
                        }));
                      } else {
                        setWizardData(prev => ({
                          ...prev,
                          selectedFeatures: prev.selectedFeatures.filter(f => f !== feature.id)
                        }));
                      }
                    }}
                  />
                  <div className="flex-1">
                    <Label htmlFor={feature.id} className="font-medium cursor-pointer">
                      {feature.name}
                    </Label>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center space-x-2 p-3 bg-primary/5 rounded-lg">
              <Switch
                id="auto-blocks"
                checked={wizardData.autoCreateBlocks}
                onCheckedChange={(checked) => 
                  setWizardData(prev => ({ ...prev, autoCreateBlocks: checked }))
                }
              />
              <Label htmlFor="auto-blocks" className="cursor-pointer">
                <strong>Auto-create calendar blocks</strong> when starting time tracking
              </Label>
            </div>
          </div>
        );

      case 3: // Test & Connect
        return (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                {selectedProvider && <selectedProvider.icon className="h-8 w-8 text-primary" />}
              </div>
              <h3 className="text-xl font-semibold">Ready to Connect</h3>
              <p className="text-muted-foreground">
                Review your settings and connect to {selectedProvider?.name}
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Connection Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Provider:</span>
                  <span className="font-medium">{selectedProvider?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Connection Name:</span>
                  <span className="font-medium">
                    {wizardData.connectionName || `${selectedProvider?.name} Connection`}
                  </span>
                </div>
                {wizardData.calendarUrl && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">URL:</span>
                    <span className="font-medium text-xs truncate max-w-48">
                      {wizardData.calendarUrl}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sync Direction:</span>
                  <Badge variant="outline">{wizardData.syncDirection}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sync Frequency:</span>
                  <Badge variant="outline">{wizardData.syncFrequency}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Features:</span>
                  <span className="text-sm">{wizardData.selectedFeatures.length} selected</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Auto Calendar Blocks:</span>
                  <Badge variant={wizardData.autoCreateBlocks ? "default" : "secondary"}>
                    {wizardData.autoCreateBlocks ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {selectedProvider?.authType === 'oauth' && (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                  <strong>OAuth Authentication Required:</strong> You'll be redirected to {selectedProvider.name} 
                  to authorize the connection after clicking "Connect Calendar".
                </p>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wand2 className="h-5 w-5 text-primary" />
            Calendar Sync Wizard
          </DialogTitle>
          <DialogDescription>
            Connect your calendar to Wise Time TriSexs in just a few steps
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Step {currentStep + 1} of {wizardSteps.length}</span>
              <span>{Math.round(progressPercentage)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300" 
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Step Header */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              {(() => {
                const StepIcon = wizardSteps[currentStep].icon;
                return <StepIcon className="h-5 w-5 text-primary" />;
              })()}
            </div>
            <div>
              <h3 className="font-semibold text-lg">{wizardSteps[currentStep].title}</h3>
              <p className="text-muted-foreground text-sm">{wizardSteps[currentStep].description}</p>
            </div>
          </div>

          {/* Step Content */}
          <div className="min-h-[300px]">
            {renderStepContent()}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-4 border-t">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            {currentStep === wizardSteps.length - 1 ? (
              <Button
                onClick={handleFinish}
                disabled={!wizardData.provider || createConnection.isPending}
              >
                {createConnection.isPending ? "Connecting..." : "Connect Calendar"}
                <CheckCircle className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={currentStep === 0 && !wizardData.provider}
              >
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}