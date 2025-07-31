import { useState } from "react";
import { format, startOfWeek, endOfWeek, eachDayOfInterval } from "date-fns";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Timer, Play, Pause, Square, Clock, Target, TrendingUp, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { TimeEntry, TimeGoal, TimeInsight } from "@shared/schema";

export default function TimeTracker() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState("tracker");
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [currentEntry, setCurrentEntry] = useState<Partial<TimeEntry>>({
    date: format(new Date(), "yyyy-MM-dd"),
    category: "work",
    energyBefore: 3,
    focusQuality: 3,
    satisfaction: 3,
    tags: [],
    isCreativeCommons: false,
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch active time entry
  const { data: activeEntry } = useQuery<TimeEntry | null>({
    queryKey: ["/api/time-entries/active"],
    enabled: true,
  });

  // Fetch time entries for current week
  const weekStart = format(startOfWeek(selectedDate), "yyyy-MM-dd");
  const weekEnd = format(endOfWeek(selectedDate), "yyyy-MM-dd");
  
  const { data: timeEntries = [], isLoading: entriesLoading } = useQuery<TimeEntry[]>({
    queryKey: ["/api/time-entries", weekStart, weekEnd],
    enabled: true,
  });

  // Fetch time goals
  const { data: timeGoals = [], isLoading: goalsLoading } = useQuery<TimeGoal[]>({
    queryKey: ["/api/time-goals"],
    enabled: activeTab === "goals",
  });

  // Fetch time insights
  const { data: timeInsights = [], isLoading: insightsLoading } = useQuery<TimeInsight[]>({
    queryKey: ["/api/time-insights"],
    enabled: activeTab === "insights",
  });

  // Start time entry mutation
  const startTimer = useMutation({
    mutationFn: async (entry: any) => {
      const response = await fetch("/api/time-entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...entry,
          startTime: format(new Date(), "HH:mm"),
          endTime: null,
        }),
      });
      if (!response.ok) throw new Error("Failed to start timer");
      return response.json();
    },
    onSuccess: () => {
      setIsTimerRunning(true);
      queryClient.invalidateQueries({ queryKey: ["/api/time-entries"] });
      queryClient.invalidateQueries({ queryKey: ["/api/time-entries/active"] });
      toast({
        title: "Timer Started",
        description: "Time tracking has begun!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to start timer",
        variant: "destructive",
      });
    },
  });

  // Stop time entry mutation
  const stopTimer = useMutation({
    mutationFn: async (entryId: number) => {
      const now = new Date();
      const endTime = format(now, "HH:mm");
      
      const response = await fetch(`/api/time-entries/${entryId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          endTime,
          energyAfter: currentEntry.energyAfter || 3,
          focusQuality: currentEntry.focusQuality || 3,
          satisfaction: currentEntry.satisfaction || 3,
          timeWisdom: currentEntry.timeWisdom,
          wiseTimeFluck: currentEntry.wiseTimeFluck,
        }),
      });
      if (!response.ok) throw new Error("Failed to stop timer");
      return response.json();
    },
    onSuccess: () => {
      setIsTimerRunning(false);
      setCurrentEntry({
        date: format(new Date(), "yyyy-MM-dd"),
        category: "work",
        energyBefore: 3,
        focusQuality: 3,
        satisfaction: 3,
        tags: [],
        isCreativeCommons: false,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/time-entries"] });
      queryClient.invalidateQueries({ queryKey: ["/api/time-entries/active"] });
      toast({
        title: "Timer Stopped",
        description: "Time entry saved with your Wise Time Fluck!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to stop timer",
        variant: "destructive",
      });
    },
  });

  const handleStartTimer = () => {
    if (!currentEntry.category || !currentEntry.project) {
      toast({
        title: "Missing Information",
        description: "Please select a category and enter a project name",
        variant: "destructive",
      });
      return;
    }
    startTimer.mutate(currentEntry);
  };

  const handleStopTimer = () => {
    if (activeEntry) {
      stopTimer.mutate(activeEntry.id);
    }
  };

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

  const productivityTags = [
    "deep_work", "flow_state", "focused", "productive", "creative", 
    "distracted", "interrupted", "tired", "energized", "collaborative",
    "problem_solving", "planning", "execution", "reflection", "breakthrough"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 
            className="text-4xl font-bold text-primary"
            style={{ 
              fontFamily: 'cursive',
              textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
            }}
          >
            Wise Time Flucks ⏰
          </h1>
          <p className="text-lg text-muted-foreground">
            Time Management with Creative Commons Wisdom
          </p>
          <div className="text-sm text-muted-foreground">
            Licensed under <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener noreferrer" className="text-primary underline">
              Creative Commons BY-SA 4.0
            </a>
          </div>
        </div>

        {/* Active Timer Display */}
        {activeEntry && (
          <Card className="border-2 border-primary bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Timer className="h-5 w-5 text-primary animate-pulse" />
                Currently Tracking: {activeEntry.project}
              </CardTitle>
              <CardDescription>
                Category: {timeCategories.find(c => c.value === activeEntry.category)?.label}
                <br />
                Started: {activeEntry.startTime} • Duration: {
                  activeEntry.startTime ? Math.floor((new Date().getTime() - new Date(`${activeEntry.date}T${activeEntry.startTime}`).getTime()) / 1000 / 60) : 0
                } minutes
              </CardDescription>
            </CardHeader>
          </Card>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="tracker">Timer</TabsTrigger>
            <TabsTrigger value="entries">History</TabsTrigger>
            <TabsTrigger value="goals">Goals</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          {/* Time Tracker Tab */}
          <TabsContent value="tracker" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Time Tracking
                </CardTitle>
                <CardDescription>
                  Start tracking your time with intention and wisdom
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={currentEntry.category}
                      onValueChange={(value) => setCurrentEntry(prev => ({ ...prev, category: value }))}
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

                  <div className="space-y-2">
                    <Label htmlFor="project">Project/Activity</Label>
                    <Input
                      id="project"
                      value={currentEntry.project || ""}
                      onChange={(e) => setCurrentEntry(prev => ({ ...prev, project: e.target.value }))}
                      placeholder="What are you working on?"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    value={currentEntry.description || ""}
                    onChange={(e) => setCurrentEntry(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief description of your task or focus..."
                    rows={2}
                  />
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Energy Before Starting (1-5)</Label>
                    <Slider
                      value={[currentEntry.energyBefore || 3]}
                      onValueChange={([value]) => setCurrentEntry(prev => ({ ...prev, energyBefore: value }))}
                      max={5}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>😴 Low</span>
                      <span>⚡ High</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Productivity Tags</Label>
                  <div className="flex flex-wrap gap-2">
                    {productivityTags.map((tag) => (
                      <Badge
                        key={tag}
                        variant={currentEntry.tags?.includes(tag) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => {
                          const currentTags = currentEntry.tags || [];
                          const newTags = currentTags.includes(tag)
                            ? currentTags.filter(t => t !== tag)
                            : [...currentTags, tag];
                          setCurrentEntry(prev => ({ ...prev, tags: newTags }));
                        }}
                      >
                        {tag.replace(/_/g, ' ')}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="creative-commons"
                    checked={currentEntry.isCreativeCommons || false}
                    onChange={(e) => setCurrentEntry(prev => ({ ...prev, isCreativeCommons: e.target.checked }))}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="creative-commons" className="text-sm">
                    This work can be shared under Creative Commons license
                  </Label>
                </div>

                <div className="flex gap-4 pt-4">
                  {!activeEntry ? (
                    <Button 
                      onClick={handleStartTimer}
                      disabled={startTimer.isPending}
                      size="lg"
                      className="flex-1"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Start Timer
                    </Button>
                  ) : (
                    <Button 
                      onClick={handleStopTimer}
                      disabled={stopTimer.isPending}
                      size="lg"
                      variant="destructive"
                      className="flex-1"
                    >
                      <Square className="h-4 w-4 mr-2" />
                      Stop & Save
                    </Button>
                  )}
                </div>

                {/* Completion Form for Active Timer */}
                {activeEntry && (
                  <div className="border-t pt-4 space-y-4">
                    <h3 className="font-semibold">Complete Your Time Entry</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Energy After (1-5)</Label>
                        <Slider
                          value={[currentEntry.energyAfter || 3]}
                          onValueChange={([value]) => setCurrentEntry(prev => ({ ...prev, energyAfter: value }))}
                          max={5}
                          min={1}
                          step={1}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Focus Quality (1-5)</Label>
                        <Slider
                          value={[currentEntry.focusQuality || 3]}
                          onValueChange={([value]) => setCurrentEntry(prev => ({ ...prev, focusQuality: value }))}
                          max={5}
                          min={1}
                          step={1}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Satisfaction (1-5)</Label>
                        <Slider
                          value={[currentEntry.satisfaction || 3]}
                          onValueChange={([value]) => setCurrentEntry(prev => ({ ...prev, satisfaction: value }))}
                          max={5}
                          min={1}
                          step={1}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="time-wisdom">Time Wisdom Reflection</Label>
                      <Textarea
                        id="time-wisdom"
                        value={currentEntry.timeWisdom || ""}
                        onChange={(e) => setCurrentEntry(prev => ({ ...prev, timeWisdom: e.target.value }))}
                        placeholder="What did you learn about your time use during this session?"
                        rows={2}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="wise-time-fluck">Your Wise Time Fluck</Label>
                      <Input
                        id="wise-time-fluck"
                        value={currentEntry.wiseTimeFluck || ""}
                        onChange={(e) => setCurrentEntry(prev => ({ ...prev, wiseTimeFluck: e.target.value }))}
                        placeholder="A personal mantra or insight from this time block..."
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Time Entries History Tab */}
          <TabsContent value="entries" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Time Entries History
                </CardTitle>
                <CardDescription>
                  Review your time tracking patterns and insights
                </CardDescription>
              </CardHeader>
              <CardContent>
                {entriesLoading ? (
                  <div className="text-center py-4">Loading time entries...</div>
                ) : timeEntries.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No time entries yet. Start your first timer to see your history here!
                  </div>
                ) : (
                  <div className="space-y-4">
                    {timeEntries.map((entry) => (
                      <div key={entry.id} className="border rounded-lg p-4 space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold">{entry.project}</h3>
                            <p className="text-sm text-muted-foreground">
                              {timeCategories.find(c => c.value === entry.category)?.emoji} {entry.category} • {entry.date}
                            </p>
                          </div>
                          {entry.duration && (
                            <Badge variant="secondary">
                              {Math.floor(entry.duration / 60)}h {entry.duration % 60}m
                            </Badge>
                          )}
                        </div>
                        
                        {entry.description && (
                          <p className="text-sm">{entry.description}</p>
                        )}
                        
                        {entry.wiseTimeFluck && (
                          <div className="bg-primary/5 rounded p-2">
                            <p className="text-sm font-medium">💡 Wise Time Fluck:</p>
                            <p className="text-sm italic">"{entry.wiseTimeFluck}"</p>
                          </div>
                        )}
                        
                        {entry.tags && entry.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {entry.tags.map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag.replace(/_/g, ' ')}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Time Goals Tab */}
          <TabsContent value="goals" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Time Goals
                </CardTitle>
                <CardDescription>
                  Set and track your time management objectives
                </CardDescription>
              </CardHeader>
              <CardContent>
                {goalsLoading ? (
                  <div className="text-center py-4">Loading time goals...</div>
                ) : timeGoals.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No time goals set yet. Create your first goal to improve your time management!
                  </div>
                ) : (
                  <div className="space-y-4">
                    {timeGoals.map((goal) => (
                      <div key={goal.id} className="border rounded-lg p-4">
                        <h3 className="font-semibold">{goal.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{goal.description}</p>
                        <div className="flex gap-2 text-xs">
                          {goal.targetHoursDaily && (
                            <Badge variant="outline">Daily: {goal.targetHoursDaily}h</Badge>
                          )}
                          {goal.targetHoursWeekly && (
                            <Badge variant="outline">Weekly: {goal.targetHoursWeekly}h</Badge>
                          )}
                          <Badge variant={goal.status === 'active' ? 'default' : 'secondary'}>
                            {goal.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Time Insights Tab */}
          <TabsContent value="insights" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Time Insights
                </CardTitle>
                <CardDescription>
                  Discover patterns and wisdom in your time usage
                </CardDescription>
              </CardHeader>
              <CardContent>
                {insightsLoading ? (
                  <div className="text-center py-4">Loading insights...</div>
                ) : timeInsights.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No insights available yet. Track more time to generate personalized insights!
                  </div>
                ) : (
                  <div className="space-y-4">
                    {timeInsights.map((insight) => (
                      <div key={insight.id} className="border rounded-lg p-4">
                        <h3 className="font-semibold">{insight.title}</h3>
                        <p className="text-sm mb-2">{insight.description}</p>
                        {insight.recommendation && (
                          <div className="bg-primary/5 rounded p-2 mb-2">
                            <p className="text-sm font-medium">💡 Recommendation:</p>
                            <p className="text-sm">{insight.recommendation}</p>
                          </div>
                        )}
                        {insight.wiseTimeFluck && (
                          <div className="bg-secondary/20 rounded p-2">
                            <p className="text-sm font-medium">🎯 Wise Time Fluck:</p>
                            <p className="text-sm italic">"{insight.wiseTimeFluck}"</p>
                          </div>
                        )}
                        <div className="flex justify-between items-center mt-2">
                          <Badge variant="outline" className="text-xs">
                            {insight.insightType}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            Confidence: {insight.confidence}%
                          </span>
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
  );
}