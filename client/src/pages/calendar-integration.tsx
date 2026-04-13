import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format, addDays, startOfWeek, endOfWeek } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Calendar, Download, Upload, Settings, Clock, Smartphone, Globe, Server, Timer, Wand2, Heart } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { CalendarSyncWizard } from "@/components/CalendarSyncWizard";

import type { CalendarConnection, ScheduledTask, TaskTemplate } from "@shared/schema";

export default function CalendarIntegration() {
  const [activeTab, setActiveTab] = useState("connections");
  const [showWizard, setShowWizard] = useState(false);
  const [newConnection, setNewConnection] = useState({
    calendarType: "",
    connectionName: "",
    calendarUrl: "",
    syncDirection: "bidirectional",
    autoCreateBlocks: false,
  });
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    category: "work",
    scheduledDate: format(new Date(), "yyyy-MM-dd"),
    scheduledStartTime: "09:00",
    scheduledEndTime: "10:00",
    priority: "medium",
    energyRequirement: 3,
    focusRequirement: 3,
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch calendar connections
  const { data: connections = [], isLoading: connectionsLoading } = useQuery<CalendarConnection[]>({
    queryKey: ["/api/calendar-connections"],
    enabled: activeTab === "connections",
  });

  // Fetch scheduled tasks
  const { data: scheduledTasks = [], isLoading: tasksLoading } = useQuery<ScheduledTask[]>({
    queryKey: ["/api/scheduled-tasks"],
    enabled: activeTab === "scheduler",
  });

  // Fetch task templates
  const { data: taskTemplates = [], isLoading: templatesLoading } = useQuery<TaskTemplate[]>({
    queryKey: ["/api/task-templates"],
    enabled: activeTab === "templates",
  });

  // Create calendar connection mutation
  const createConnection = useMutation({
    mutationFn: async (connection: any) => {
      const response = await fetch("/api/calendar-connections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(connection),
      });
      if (!response.ok) throw new Error("Failed to create connection");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/calendar-connections"] });
      setNewConnection({
        calendarType: "",
        connectionName: "",
        calendarUrl: "",
        syncDirection: "bidirectional",
        autoCreateBlocks: false,
      });
      toast({
        title: "Calendar Connected",
        description: "Your calendar has been successfully connected!",
      });
    },
    onError: () => {
      toast({
        title: "Connection Failed",
        description: "Failed to connect calendar. Please check your settings.",
        variant: "destructive",
      });
    },
  });

  // Create scheduled task mutation
  const createTask = useMutation({
    mutationFn: async (task: any) => {
      const response = await fetch("/api/scheduled-tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task),
      });
      if (!response.ok) throw new Error("Failed to create task");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/scheduled-tasks"] });
      setNewTask({
        title: "",
        description: "",
        category: "work",
        scheduledDate: format(new Date(), "yyyy-MM-dd"),
        scheduledStartTime: "09:00",
        scheduledEndTime: "10:00",
        priority: "medium",
        energyRequirement: 3,
        focusRequirement: 3,
      });
      toast({
        title: "Task Scheduled",
        description: "Your task has been added to the schedule!",
      });
    },
    onError: () => {
      toast({
        title: "Scheduling Failed",
        description: "Failed to schedule task. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Calendar sync mutations
  const syncGoogle = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/calendar-sync/google", { method: "POST" });
      if (!response.ok) throw new Error("Failed to sync with Google");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Google Calendar Sync",
        description: "Sync with Google Calendar initiated successfully!",
      });
    },
  });

  const syncICal = useMutation({
    mutationFn: async (icalUrl: string) => {
      const response = await fetch("/api/calendar-sync/ical", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ icalUrl }),
      });
      if (!response.ok) throw new Error("Failed to sync with iCal");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "iCal Sync",
        description: "iCal sync initiated successfully!",
      });
    },
  });

  const syncPureOS = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/calendar-sync/pureos", { method: "POST" });
      if (!response.ok) throw new Error("Failed to sync with pureOS");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "pureOS Calendar Sync",
        description: "pureOS calendar sync initiated successfully!",
      });
    },
  });

  const handleExportCalendar = () => {
    window.open("/api/calendar-export/ical", "_blank");
    toast({
      title: "Calendar Export",
      description: "Your Wise Time TriSexs calendar has been exported as iCal!",
    });
  };

  const calendarTypes = [
    { value: "google", label: "Google Calendar", icon: Globe, description: "Connect your Google Calendar account" },
    { value: "ical", label: "iCal/CalDAV", icon: Calendar, description: "Connect via iCal URL or CalDAV server" },
    { value: "outlook", label: "Microsoft Outlook", icon: Server, description: "Connect your Outlook calendar" },
    { value: "pureos", label: "pureOS Calendar", icon: Smartphone, description: "Connect with pureOS calendar system" },
  ];

  const timeCategories = [
    { value: "work", label: "Work & Business", emoji: "💼" },
    { value: "wellness", label: "Wellness & Health", emoji: "🌱" },
    { value: "personal", label: "Personal Growth", emoji: "🌟" },
    { value: "creative", label: "Creative Commons", emoji: "🎨" },
    { value: "learning", label: "Learning & Study", emoji: "📚" },
    { value: "relationships", label: "Relationships", emoji: "❤️" },
    { value: "exercise", label: "Exercise & Movement", emoji: "💪" },
    { value: "rest", label: "Rest & Recovery", emoji: "😴" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Intersex Healthcare Affirmation */}
        <Alert className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/40 border-purple-200">
          <Heart className="h-5 w-5 text-black dark:text-white" />
          <AlertDescription className="ml-2 text-black dark:text-white">
            <strong>Intersex Healthcare IS Everyone's Affirmation:</strong> Calendar integration centers intersex anatomy as the universal baseline—trans, non-binary, genderqueer, and quare embodiment are all respected within this participatory budgeting framework. There is no separate "transgender healthcare" category—wellness scheduling serves ALL bodies by design.
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
            Calendar Integration ⏰
          </h1>
          <p className="text-lg text-muted-foreground">
            Sync Wise Time TriSexs with Google Calendar, iCal, pureOS & More
          </p>
          <div className="text-sm text-muted-foreground">
            Licensed under <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener noreferrer" className="text-primary underline">
              Creative Commons BY-SA 4.0
            </a>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="connections">Connections</TabsTrigger>
            <TabsTrigger value="scheduler">Task Scheduler</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="sync">Sync & Export</TabsTrigger>
          </TabsList>

          {/* Calendar Connections Tab */}
          <TabsContent value="connections" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Calendar Connections
                </CardTitle>
                <CardDescription>
                  Connect external calendars to sync your Wise Time TriSexs
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Quick Actions */}
                <div className="flex gap-4 mb-6">
                  <Button
                    onClick={() => setShowWizard(true)}
                    className="flex-1"
                    size="lg"
                  >
                    <Wand2 className="mr-2 h-5 w-5" />
                    Launch Setup Wizard
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    size="lg"
                  >
                    <Download className="mr-2 h-5 w-5" />
                    Import Settings
                  </Button>
                </div>

                {/* Add New Connection Form */}
                <div className="border rounded-lg p-4 space-y-4">
                  <h3 className="font-semibold">Manual Connection Setup</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="calendar-type">Calendar Type</Label>
                      <Select
                        value={newConnection.calendarType}
                        onValueChange={(value) => setNewConnection(prev => ({ ...prev, calendarType: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select calendar type" />
                        </SelectTrigger>
                        <SelectContent>
                          {calendarTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              <div className="flex items-center gap-2">
                                <type.icon className="h-4 w-4" />
                                {type.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="connection-name">Connection Name</Label>
                      <Input
                        id="connection-name"
                        value={newConnection.connectionName}
                        onChange={(e) => setNewConnection(prev => ({ ...prev, connectionName: e.target.value }))}
                        placeholder="My Work Calendar"
                      />
                    </div>
                  </div>

                  {(newConnection.calendarType === "ical" || newConnection.calendarType === "pureos") && (
                    <div className="space-y-2">
                      <Label htmlFor="calendar-url">Calendar URL</Label>
                      <Input
                        id="calendar-url"
                        value={newConnection.calendarUrl}
                        onChange={(e) => setNewConnection(prev => ({ ...prev, calendarUrl: e.target.value }))}
                        placeholder="https://calendar.example.com/calendar.ics"
                      />
                    </div>
                  )}

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="auto-create-blocks"
                      checked={newConnection.autoCreateBlocks}
                      onCheckedChange={(checked) => setNewConnection(prev => ({ ...prev, autoCreateBlocks: checked }))}
                    />
                    <Label htmlFor="auto-create-blocks">
                      Automatically create calendar blocks for time entries
                    </Label>
                  </div>

                  <Button 
                    onClick={() => createConnection.mutate(newConnection)}
                    disabled={!newConnection.calendarType || !newConnection.connectionName || createConnection.isPending}
                  >
                    {createConnection.isPending ? "Connecting..." : "Add Connection"}
                  </Button>
                </div>

                {/* Existing Connections */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Connected Calendars</h3>
                  {connectionsLoading ? (
                    <div className="text-center py-4">Loading connections...</div>
                  ) : connections.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No calendar connections yet. Add your first connection above!
                    </div>
                  ) : (
                    <div className="grid gap-4">
                      {connections.map((connection) => {
                        const type = calendarTypes.find(t => t.value === connection.calendarType);
                        return (
                          <div key={connection.id} className="border rounded-lg p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {type && <type.icon className="h-5 w-5 text-primary" />}
                              <div>
                                <h4 className="font-medium">{connection.connectionName}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {type?.label} • {connection.syncDirection} sync
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant={connection.isActive ? "default" : "secondary"}>
                                {connection.isActive ? "Active" : "Inactive"}
                              </Badge>
                              <Button variant="outline" size="sm">
                                <Settings className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Task Scheduler Tab */}
          <TabsContent value="scheduler" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Task Scheduler
                </CardTitle>
                <CardDescription>
                  Schedule tasks and time blocks with calendar integration
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Schedule New Task Form */}
                <div className="border rounded-lg p-4 space-y-4">
                  <h3 className="font-semibold">Schedule New Task</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="task-title">Task Title</Label>
                      <Input
                        id="task-title"
                        value={newTask.title}
                        onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Focus work session"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="task-category">Category</Label>
                      <Select
                        value={newTask.category}
                        onValueChange={(value) => setNewTask(prev => ({ ...prev, category: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeCategories.map((category) => (
                            <SelectItem key={category.value} value={category.value}>
                              {category.emoji} {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="task-description">Description</Label>
                    <Textarea
                      id="task-description"
                      value={newTask.description}
                      onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Detailed description of the task..."
                      rows={2}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="task-date">Date</Label>
                      <Input
                        id="task-date"
                        type="date"
                        value={newTask.scheduledDate}
                        onChange={(e) => setNewTask(prev => ({ ...prev, scheduledDate: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="task-start-time">Start Time</Label>
                      <Input
                        id="task-start-time"
                        type="time"
                        value={newTask.scheduledStartTime}
                        onChange={(e) => setNewTask(prev => ({ ...prev, scheduledStartTime: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="task-end-time">End Time</Label>
                      <Input
                        id="task-end-time"
                        type="time"
                        value={newTask.scheduledEndTime}
                        onChange={(e) => setNewTask(prev => ({ ...prev, scheduledEndTime: e.target.value }))}
                      />
                    </div>
                  </div>

                  <Button 
                    onClick={() => createTask.mutate(newTask)}
                    disabled={!newTask.title || createTask.isPending}
                  >
                    {createTask.isPending ? "Scheduling..." : "Schedule Task"}
                  </Button>
                </div>

                {/* Scheduled Tasks List */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Upcoming Scheduled Tasks</h3>
                  {tasksLoading ? (
                    <div className="text-center py-4">Loading scheduled tasks...</div>
                  ) : scheduledTasks.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No scheduled tasks yet. Schedule your first task above!
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {scheduledTasks.slice(0, 10).map((task) => (
                        <div key={task.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{task.title}</h4>
                              <p className="text-sm text-muted-foreground">
                                {task.scheduledDate} • {task.scheduledStartTime} - {task.scheduledEndTime}
                              </p>
                              {task.description && (
                                <p className="text-sm mt-1">{task.description}</p>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <Badge variant="outline">
                                {timeCategories.find(c => c.value === task.category)?.emoji} {task.category}
                              </Badge>
                              <Badge variant={task.status === 'completed' ? 'default' : 'secondary'}>
                                {task.status}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Templates Tab */}
          <TabsContent value="templates" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Task Templates</CardTitle>
                <CardDescription>
                  Create reusable task templates for common activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                {templatesLoading ? (
                  <div className="text-center py-4">Loading templates...</div>
                ) : taskTemplates.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No task templates yet. Create templates to speed up scheduling!
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {taskTemplates.map((template) => (
                      <div key={template.id} className="border rounded-lg p-4">
                        <h4 className="font-medium">{template.name}</h4>
                        <p className="text-sm text-muted-foreground mb-2">{template.description}</p>
                        <div className="flex gap-2">
                          <Badge variant="outline">
                            {timeCategories.find(c => c.value === template.category)?.emoji} {template.category}
                          </Badge>
                          {template.isPublic && (
                            <Badge variant="secondary">Creative Commons</Badge>
                          )}
                          <Badge variant="outline">Used {template.timesUsed || 0} times</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sync & Export Tab */}
          <TabsContent value="sync" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Calendar Sync */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5" />
                    Calendar Sync
                  </CardTitle>
                  <CardDescription>
                    Sync with external calendar systems
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    onClick={() => syncGoogle.mutate()}
                    disabled={syncGoogle.isPending}
                    className="w-full"
                  >
                    <Globe className="mr-2 h-4 w-4" />
                    {syncGoogle.isPending ? "Syncing..." : "Sync with Google Calendar"}
                  </Button>

                  <div className="space-y-2">
                    <Input
                      placeholder="Enter iCal URL..."
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          const input = e.target as HTMLInputElement;
                          if (input.value) {
                            syncICal.mutate(input.value);
                            input.value = '';
                          }
                        }
                      }}
                    />
                    <Button 
                      onClick={() => {
                        const input = document.querySelector('input[placeholder="Enter iCal URL..."]') as HTMLInputElement;
                        if (input?.value) {
                          syncICal.mutate(input.value);
                          input.value = '';
                        }
                      }}
                      disabled={syncICal.isPending}
                      variant="outline"
                      className="w-full"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {syncICal.isPending ? "Syncing..." : "Sync with iCal"}
                    </Button>
                  </div>

                  <Button 
                    onClick={() => syncPureOS.mutate()}
                    disabled={syncPureOS.isPending}
                    variant="outline"
                    className="w-full"
                  >
                    <Smartphone className="mr-2 h-4 w-4" />
                    {syncPureOS.isPending ? "Syncing..." : "Sync with pureOS Calendar"}
                  </Button>
                </CardContent>
              </Card>

              {/* Calendar Export */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Download className="h-5 w-5" />
                    Calendar Export
                  </CardTitle>
                  <CardDescription>
                    Export your Wise Time TriSexs calendar
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    onClick={handleExportCalendar}
                    className="w-full"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Export as iCal (.ics)
                  </Button>

                  <p className="text-sm text-muted-foreground">
                    Export your scheduled tasks and time blocks as an iCal file that can be imported into any calendar application.
                  </p>

                  <div className="space-y-2 text-xs text-muted-foreground">
                    <p>✓ Google Calendar</p>
                    <p>✓ Apple Calendar</p>
                    <p>✓ Outlook</p>
                    <p>✓ Thunderbird</p>
                    <p>✓ pureOS Calendar</p>
                    <p>✓ Any iCal-compatible app</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Calendar Sync Wizard */}
        <CalendarSyncWizard 
          isOpen={showWizard} 
          onClose={() => setShowWizard(false)} 
        />
      </div>
    </div>
  );
}