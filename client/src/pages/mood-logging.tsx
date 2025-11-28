import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Plus, TrendingUp, Calendar as CalendarIcon, Target, BookOpen, Heart } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { format, startOfMonth, endOfMonth } from "date-fns";
import type { MoodEntry, WellnessGoal, MoodInsight } from "@shared/schema";

const MOOD_EMOJIS = [
  { emoji: "😊", label: "Happy", value: "happy" },
  { emoji: "😌", label: "Content", value: "content" },
  { emoji: "😐", label: "Neutral", value: "neutral" },
  { emoji: "😔", label: "Sad", value: "sad" },
  { emoji: "😟", label: "Worried", value: "worried" },
  { emoji: "😡", label: "Angry", value: "angry" },
  { emoji: "😴", label: "Tired", value: "tired" },
  { emoji: "🤗", label: "Affectionate", value: "affectionate" },
  { emoji: "😰", label: "Anxious", value: "anxious" },
  { emoji: "🥰", label: "Loved", value: "loved" },
];

const PHYSICAL_SYMPTOMS = [
  "headache", "fatigue", "nausea", "pain", "tension", "dizziness", 
  "hot_flashes", "cramps", "bloating", "insomnia", "appetite_change"
];

const EMOTIONAL_STATES = [
  "anxious", "happy", "sad", "stressed", "calm", "excited", 
  "frustrated", "grateful", "lonely", "confident", "overwhelmed"
];

const WELLNESS_TAGS = [
  "work", "relationship", "health", "family", "exercise", 
  "sleep", "nutrition", "social", "personal_growth", "sexual_health"
];

export default function MoodLogging() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [activeTab, setActiveTab] = useState<"log" | "insights" | "goals">("log");
  const [moodForm, setMoodForm] = useState({
    moodEmoji: "",
    energyLevel: [3],
    stressLevel: [3],
    sleepQuality: [3],
    physicalSymptoms: [] as string[],
    emotionalState: [] as string[],
    notes: "",
    tags: [] as string[],
  });

  const queryClient = useQueryClient();

  // Fetch mood entries for current month
  const { data: moodEntries = [], isLoading: moodLoading } = useQuery<MoodEntry[]>({
    queryKey: ["/api/mood-entries", format(selectedDate, "yyyy-MM")],
    enabled: true,
  });

  // Fetch wellness goals
  const { data: wellnessGoals = [], isLoading: goalsLoading } = useQuery<WellnessGoal[]>({
    queryKey: ["/api/wellness-goals"],
    enabled: activeTab === "goals",
  });

  // Fetch mood insights
  const { data: moodInsights = [], isLoading: insightsLoading } = useQuery<MoodInsight[]>({
    queryKey: ["/api/mood-insights"],
    enabled: activeTab === "insights",
  });

  // Create mood entry mutation
  const createMoodEntry = useMutation({
    mutationFn: async (entry: any) => {
      const response = await fetch("/api/mood-entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entry),
      });
      if (!response.ok) throw new Error("Failed to create mood entry");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/mood-entries"] });
      // Reset form
      setMoodForm({
        moodEmoji: "",
        energyLevel: [3],
        stressLevel: [3],
        sleepQuality: [3],
        physicalSymptoms: [],
        emotionalState: [],
        notes: "",
        tags: [],
      });
    },
  });

  const handleSubmitMoodEntry = () => {
    if (!moodForm.moodEmoji) return;
    
    createMoodEntry.mutate({
      ...moodForm,
      date: format(selectedDate, "yyyy-MM-dd"),
      energyLevel: moodForm.energyLevel[0],
      stressLevel: moodForm.stressLevel[0],
      sleepQuality: moodForm.sleepQuality[0],
    });
  };

  const toggleArrayItem = (array: string[], item: string, setter: (arr: string[]) => void) => {
    if (array.includes(item)) {
      setter(array.filter(i => i !== item));
    } else {
      setter([...array, item]);
    }
  };

  // Get today's mood entry
  const todayEntry = moodEntries.find((entry: MoodEntry) => 
    entry.date === format(new Date(), "yyyy-MM-dd")
  );

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Intersex Healthcare Affirmation */}
      <Alert className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200">
        <Heart className="h-5 w-5 text-purple-600" />
        <AlertDescription className="ml-2">
          <strong>Intersex Healthcare IS Everyone's Affirmation:</strong> Mood and wellness tracking centers intersex anatomy as the universal baseline. There is no separate "transgender healthcare" category—mental and sexual health monitoring serves ALL bodies by design.
        </AlertDescription>
      </Alert>

      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Mood & Wellness Tracking</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Track your daily mood, energy, and wellness patterns with emoji-based logging
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center space-x-4">
        <Button
          variant={activeTab === "log" ? "default" : "outline"}
          onClick={() => setActiveTab("log")}
          className="flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Daily Log</span>
        </Button>
        <Button
          variant={activeTab === "insights" ? "default" : "outline"}
          onClick={() => setActiveTab("insights")}
          className="flex items-center space-x-2"
        >
          <TrendingUp className="h-4 w-4" />
          <span>Insights</span>
        </Button>
        <Button
          variant={activeTab === "goals" ? "default" : "outline"}
          onClick={() => setActiveTab("goals")}
          className="flex items-center space-x-2"
        >
          <Target className="h-4 w-4" />
          <span>Goals</span>
        </Button>
      </div>

      {/* Daily Log Tab */}
      {activeTab === "log" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Mood Entry Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CalendarIcon className="h-5 w-5" />
                <span>Log Your Mood</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Date Selection */}
              <div>
                <Label>Date</Label>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  className="rounded-md border"
                />
              </div>

              {/* Mood Emoji Selection */}
              <div>
                <Label>How are you feeling today?</Label>
                <div className="grid grid-cols-5 gap-3 mt-2">
                  {MOOD_EMOJIS.map((mood) => (
                    <Button
                      key={mood.value}
                      variant={moodForm.moodEmoji === mood.emoji ? "default" : "outline"}
                      className="aspect-square text-2xl p-2"
                      onClick={() => setMoodForm(prev => ({ ...prev, moodEmoji: mood.emoji }))}
                      title={mood.label}
                    >
                      {mood.emoji}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Energy Level */}
              <div>
                <Label>Energy Level: {moodForm.energyLevel[0]}/5</Label>
                <Slider
                  value={moodForm.energyLevel}
                  onValueChange={(value) => setMoodForm(prev => ({ ...prev, energyLevel: value }))}
                  max={5}
                  min={1}
                  step={1}
                  className="mt-2"
                />
              </div>

              {/* Stress Level */}
              <div>
                <Label>Stress Level: {moodForm.stressLevel[0]}/5</Label>
                <Slider
                  value={moodForm.stressLevel}
                  onValueChange={(value) => setMoodForm(prev => ({ ...prev, stressLevel: value }))}
                  max={5}
                  min={1}
                  step={1}
                  className="mt-2"
                />
              </div>

              {/* Sleep Quality */}
              <div>
                <Label>Sleep Quality: {moodForm.sleepQuality[0]}/5</Label>
                <Slider
                  value={moodForm.sleepQuality}
                  onValueChange={(value) => setMoodForm(prev => ({ ...prev, sleepQuality: value }))}
                  max={5}
                  min={1}
                  step={1}
                  className="mt-2"
                />
              </div>

              {/* Physical Symptoms */}
              <div>
                <Label>Physical Symptoms</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {PHYSICAL_SYMPTOMS.map((symptom) => (
                    <Badge
                      key={symptom}
                      variant={moodForm.physicalSymptoms.includes(symptom) ? "default" : "outline"}
                      className="cursor-pointer text-xs"
                      onClick={() => toggleArrayItem(
                        moodForm.physicalSymptoms, 
                        symptom, 
                        (arr) => setMoodForm(prev => ({ ...prev, physicalSymptoms: arr }))
                      )}
                    >
                      {symptom.replace("_", " ")}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Emotional State */}
              <div>
                <Label>Emotional State</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {EMOTIONAL_STATES.map((emotion) => (
                    <Badge
                      key={emotion}
                      variant={moodForm.emotionalState.includes(emotion) ? "default" : "outline"}
                      className="cursor-pointer text-xs"
                      onClick={() => toggleArrayItem(
                        moodForm.emotionalState, 
                        emotion, 
                        (arr) => setMoodForm(prev => ({ ...prev, emotionalState: arr }))
                      )}
                    >
                      {emotion}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div>
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {WELLNESS_TAGS.map((tag) => (
                    <Badge
                      key={tag}
                      variant={moodForm.tags.includes(tag) ? "default" : "outline"}
                      className="cursor-pointer text-xs"
                      onClick={() => toggleArrayItem(
                        moodForm.tags, 
                        tag, 
                        (arr) => setMoodForm(prev => ({ ...prev, tags: arr }))
                      )}
                    >
                      {tag.replace("_", " ")}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <Label>Notes (optional)</Label>
                <Textarea
                  value={moodForm.notes}
                  onChange={(e) => setMoodForm(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="How was your day? Any specific thoughts or feelings?"
                  className="mt-2"
                />
              </div>

              <Button 
                onClick={handleSubmitMoodEntry}
                disabled={!moodForm.moodEmoji || createMoodEntry.isPending}
                className="w-full"
              >
                {createMoodEntry.isPending ? "Saving..." : "Save Mood Entry"}
              </Button>
            </CardContent>
          </Card>

          {/* Mood Calendar/History */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Entries</CardTitle>
            </CardHeader>
            <CardContent>
              {todayEntry && (
                <div className="mb-4 p-4 bg-primary/10 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{todayEntry.moodEmoji}</span>
                    <span className="text-sm text-muted-foreground">Today</span>
                  </div>
                  <div className="mt-2 text-sm">
                    Energy: {todayEntry.energyLevel}/5 | Stress: {todayEntry.stressLevel}/5
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {moodEntries.slice(0, 7).map((entry: MoodEntry) => (
                  <div key={entry.id} className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center space-x-3">
                      <span className="text-xl">{entry.moodEmoji}</span>
                      <div>
                        <div className="font-medium">{format(new Date(entry.date), "MMM d")}</div>
                        <div className="text-sm text-muted-foreground">
                          Energy: {entry.energyLevel}/5
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {entry.tags?.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag.replace("_", " ")}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Insights Tab */}
      {activeTab === "insights" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Mood Patterns</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {moodInsights.length > 0 ? (
                  moodInsights.map((insight: MoodInsight) => (
                    <div key={insight.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium">{insight.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            {insight.description}
                          </p>
                          <div className="mt-2">
                            <Badge variant={insight.isPositive ? "default" : "destructive"}>
                              {insight.confidence}% confidence
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Track your mood for a few days to see insights</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Mood Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              {moodEntries.length > 0 ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-primary/10 rounded-lg">
                      <div className="text-2xl font-bold">
                        {Math.round(moodEntries.reduce((sum: number, entry: MoodEntry) => sum + entry.energyLevel, 0) / moodEntries.length)}
                      </div>
                      <div className="text-sm text-muted-foreground">Avg Energy</div>
                    </div>
                    <div className="text-center p-4 bg-primary/10 rounded-lg">
                      <div className="text-2xl font-bold">
                        {Math.round(moodEntries.reduce((sum: number, entry: MoodEntry) => sum + entry.stressLevel, 0) / moodEntries.length)}
                      </div>
                      <div className="text-sm text-muted-foreground">Avg Stress</div>
                    </div>
                  </div>
                  <div className="text-center p-4 bg-primary/10 rounded-lg">
                    <div className="text-2xl font-bold">{moodEntries.length}</div>
                    <div className="text-sm text-muted-foreground">Total Entries This Month</div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Start logging your mood to see statistics</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Goals Tab */}
      {activeTab === "goals" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5" />
              <span>Wellness Goals</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Wellness goals feature coming soon!</p>
              <p className="text-sm mt-2">Set and track your mental health and wellness goals</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}