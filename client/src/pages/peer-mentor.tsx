import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  MessageCircle, 
  Users, 
  Clock, 
  Coins,
  Heart,
  Brain,
  Star,
  Shuffle,
  Send,
  Video,
  Phone,
  Award,
  TrendingUp,
  Globe,
  Palette
} from "lucide-react";

interface PeerMentor {
  id: string;
  name: string;
  avatar: string;
  specialties: string[];
  hoursContributed: number;
  equityScore: number;
  intelligenceTypes: string[];
  availability: "online" | "busy" | "offline";
  culturalBackground: string[];
  generationalCohort: string;
  matchScore: number;
}

interface TimeBank {
  totalHours: number;
  hoursContributed: number;
  hoursReceived: number;
  currentBalance: number;
  stablecoinValue: number;
  pendingDividends: number;
  equityMultiplier: number;
}

export default function PeerMentor() {
  const [activeTab, setActiveTab] = useState("chat");
  const [currentMentor, setCurrentMentor] = useState<PeerMentor | null>(null);
  const [chatMessage, setChatMessage] = useState("");
  const [timeBank, setTimeBank] = useState<TimeBank>({
    totalHours: 342,
    hoursContributed: 156,
    hoursReceived: 98,
    currentBalance: 58,
    stablecoinValue: 4.25,
    pendingDividends: 24.67,
    equityMultiplier: 1.34
  });

  const availableMentors: PeerMentor[] = [
    {
      id: "mentor-1",
      name: "Dr. Aiyana Crow Feather",
      avatar: "AC",
      specialties: ["Sexual Health", "Indigenous Medicine", "Trauma Recovery"],
      hoursContributed: 847,
      equityScore: 96,
      intelligenceTypes: ["Cultural", "Emotional", "Spiritual"],
      availability: "online",
      culturalBackground: ["Lakota", "Cherokee"],
      generationalCohort: "Elder (65+)",
      matchScore: 94
    },
    {
      id: "mentor-2", 
      name: "Marcus Williams",
      avatar: "MW",
      specialties: ["Reproductive Justice", "Community Organizing", "Healthcare Access"],
      hoursContributed: 623,
      equityScore: 89,
      intelligenceTypes: ["Social", "Political", "Kinesthetic"],
      availability: "online",
      culturalBackground: ["African American", "Southern"],
      generationalCohort: "Millennial (28-43)",
      matchScore: 88
    },
    {
      id: "mentor-3",
      name: "Priya Sharma",
      avatar: "PS", 
      specialties: ["LGBTQ+ Health", "Mental Wellness", "Tech Innovation"],
      hoursContributed: 712,
      equityScore: 92,
      intelligenceTypes: ["Technical", "Linguistic", "Interpersonal"],
      availability: "busy",
      culturalBackground: ["South Asian", "Hindu"],
      generationalCohort: "Gen Z (18-27)",
      matchScore: 85
    },
    {
      id: "mentor-4",
      name: "Rosa Elena Gutierrez",
      avatar: "RG",
      specialties: ["Family Planning", "Immigration Health", "Language Access"],
      hoursContributed: 934,
      equityScore: 95,
      intelligenceTypes: ["Linguistic", "Cultural", "Practical"],
      availability: "online",
      culturalBackground: ["Mexican", "Indigenous Maya"],
      generationalCohort: "Gen X (44-59)",
      matchScore: 91
    }
  ];

  const intelligenceFramework = {
    "Infinite Intelligence": [
      "Collective wisdom access",
      "Pattern recognition across domains", 
      "Emergent problem-solving",
      "Intuitive insight synthesis"
    ],
    "Multigenerational Intelligence": [
      "Elder wisdom integration",
      "Youth innovation perspective",
      "Historical pattern awareness",
      "Future-oriented thinking"
    ],
    "Multicultural Intelligence": [
      "Cross-cultural communication",
      "Cultural context sensitivity",
      "Diverse worldview appreciation",
      "Inclusive solution design"
    ],
    "Racial & Ethnic Intelligence": [
      "Systemic racism awareness",
      "Cultural trauma understanding",
      "Community resilience recognition",
      "Intersectional analysis skills"
    ]
  };

  const findRandomMentor = () => {
    const availableOnline = availableMentors.filter(m => m.availability === "online");
    const randomMentor = availableOnline[Math.floor(Math.random() * availableOnline.length)];
    setCurrentMentor(randomMentor);
  };

  const calculateDividend = () => {
    const baseRate = 0.15; // $0.15 per hour base
    const equityBonus = timeBank.equityMultiplier;
    const hoursValue = timeBank.hoursContributed * baseRate * equityBonus;
    return hoursValue * timeBank.stablecoinValue;
  };

  useEffect(() => {
    findRandomMentor();
  }, []);

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <MessageCircle className="h-12 w-12 text-primary mr-4" />
            <div>
              <h1 className="text-4xl font-bold text-foreground">
                Peer Chat Mentor Network
              </h1>
              <p className="text-xl text-muted-foreground mt-2 font-coolvetica">
                Random Connectivity • Time Banking • Infinite Intelligence
              </p>
            </div>
          </div>
          
          <div className="flex justify-center space-x-4">
            <Badge variant="secondary" className="bg-primary text-black">
              <Brain className="w-4 h-4 mr-1" />
              {timeBank.hoursContributed} Hours Contributed
            </Badge>
            <Badge variant="secondary" className="bg-aquamarine text-black">
              <Coins className="w-4 h-4 mr-1" />
              ${calculateDividend().toFixed(2)} Pending
            </Badge>
            <Badge variant="secondary" className="bg-secondary text-black">
              <Users className="w-4 h-4 mr-1" />
              {availableMentors.filter(m => m.availability === "online").length} Online
            </Badge>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="chat">Peer Chat</TabsTrigger>
            <TabsTrigger value="timebank">Time Banking</TabsTrigger>
            <TabsTrigger value="intelligence">Intelligence Types</TabsTrigger>
            <TabsTrigger value="network">Mentor Network</TabsTrigger>
          </TabsList>

          <TabsContent value="chat">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Current Mentor */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      Current Mentor
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={findRandomMentor}
                      >
                        <Shuffle className="h-4 w-4 mr-1" />
                        New Match
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {currentMentor && (
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-black font-bold">
                            {currentMentor.avatar}
                          </div>
                          <div>
                            <h3 className="font-medium">{currentMentor.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {currentMentor.generationalCohort}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">Cultural Background</h4>
                          <div className="flex flex-wrap gap-1">
                            {currentMentor.culturalBackground.map((bg) => (
                              <Badge key={bg} variant="outline" className="text-xs">
                                {bg}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">Intelligence Types</h4>
                          <div className="flex flex-wrap gap-1">
                            {currentMentor.intelligenceTypes.map((type) => (
                              <Badge key={type} variant="secondary" className="text-xs">
                                <Brain className="w-3 h-3 mr-1" />
                                {type}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">Specialties</h4>
                          <div className="space-y-1">
                            {currentMentor.specialties.map((specialty) => (
                              <div key={specialty} className="text-xs text-muted-foreground">
                                • {specialty}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-center">
                          <div>
                            <p className="text-2xl font-bold text-primary">{currentMentor.hoursContributed}</p>
                            <p className="text-xs text-muted-foreground">Hours Contributed</p>
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-aquamarine">{currentMentor.equityScore}%</p>
                            <p className="text-xs text-muted-foreground">Equity Score</p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Match Compatibility</span>
                            <span className="text-sm">{currentMentor.matchScore}%</span>
                          </div>
                          <Progress value={currentMentor.matchScore} className="h-2" />
                        </div>

                        <div className="flex space-x-2">
                          <Button className="flex-1" size="sm">
                            <Video className="h-4 w-4 mr-1" />
                            Video Call
                          </Button>
                          <Button variant="outline" size="sm">
                            <Phone className="h-4 w-4 mr-1" />
                            Voice
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Chat Interface */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Peer Chat Session</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Chat Messages */}
                      <div className="h-96 border rounded-lg p-4 bg-muted/30 overflow-y-auto">
                        <div className="space-y-4">
                          <div className="flex justify-start">
                            <div className="bg-primary text-black p-3 rounded-lg max-w-xs">
                              <p className="text-sm">
                                Hello! I'm here to support you with any questions about sexual health, 
                                reproductive justice, or community wellness. What would you like to explore today?
                              </p>
                              <p className="text-xs mt-1 opacity-70">
                                {currentMentor?.name} • 2 min ago
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Message Input */}
                      <div className="flex space-x-2">
                        <Input
                          placeholder="Type your message..."
                          value={chatMessage}
                          onChange={(e) => setChatMessage(e.target.value)}
                          className="flex-1"
                        />
                        <Button>
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="timebank">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="mr-2 h-6 w-6 text-primary" />
                    Time Bank Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <p className="text-3xl font-bold text-primary">{timeBank.hoursContributed}</p>
                        <p className="text-sm text-muted-foreground">Hours Contributed</p>
                      </div>
                      <div className="text-center">
                        <p className="text-3xl font-bold text-aquamarine">{timeBank.hoursReceived}</p>
                        <p className="text-sm text-muted-foreground">Hours Received</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Current Balance:</span>
                        <span className="font-medium">{timeBank.currentBalance} hours</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Equity Multiplier:</span>
                        <span className="font-medium text-primary">{timeBank.equityMultiplier}x</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Stablecoin Rate:</span>
                        <span className="font-medium">${timeBank.stablecoinValue}/hour</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Coins className="mr-2 h-6 w-6 text-aquamarine" />
                    Stablecoin Dividends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="text-center">
                      <p className="text-4xl font-bold text-aquamarine">
                        ${calculateDividend().toFixed(2)}
                      </p>
                      <p className="text-sm text-muted-foreground">Pending Dividend</p>
                    </div>

                    <div className="space-y-3 text-sm">
                      <h4 className="font-medium">Dividend Calculation:</h4>
                      <div className="bg-muted/30 p-3 rounded-lg space-y-1">
                        <div className="flex justify-between">
                          <span>Base Hours:</span>
                          <span>{timeBank.hoursContributed} hrs</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Equity Multiplier:</span>
                          <span>{timeBank.equityMultiplier}x</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Stablecoin Value:</span>
                          <span>${timeBank.stablecoinValue}</span>
                        </div>
                        <hr className="my-2" />
                        <div className="flex justify-between font-medium">
                          <span>Total Dividend:</span>
                          <span>${calculateDividend().toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    <Button className="w-full bg-aquamarine hover:bg-aquamarine/90 text-black">
                      <Award className="mr-2 h-4 w-4" />
                      Claim Dividend
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Equity-Based Contribution Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-4 gap-6">
                    <div className="text-center">
                      <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2" />
                      <h4 className="font-medium">Hours Contributed</h4>
                      <p className="text-sm text-muted-foreground">Direct peer support time</p>
                    </div>
                    <div className="text-center">
                      <Heart className="h-8 w-8 text-aquamarine mx-auto mb-2" />
                      <h4 className="font-medium">Equitable Outcomes</h4>
                      <p className="text-sm text-muted-foreground">Positive impact on health equity</p>
                    </div>
                    <div className="text-center">
                      <Award className="h-8 w-8 text-secondary mx-auto mb-2" />
                      <h4 className="font-medium">Pay Equality</h4>
                      <p className="text-sm text-muted-foreground">Fair compensation regardless of background</p>
                    </div>
                    <div className="text-center">
                      <Brain className="h-8 w-8 text-primary mx-auto mb-2" />
                      <h4 className="font-medium">Intelligence Contribution</h4>
                      <p className="text-sm text-muted-foreground">Diverse knowledge sharing</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="intelligence">
            <div className="space-y-6">
              {Object.entries(intelligenceFramework).map(([type, skills]) => (
                <Card key={type}>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Brain className="mr-2 h-6 w-6 text-primary" />
                      {type}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {skills.map((skill, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Star className="h-4 w-4 text-aquamarine" />
                          <span className="text-sm">{skill}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="network">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableMentors.map((mentor) => (
                <Card key={mentor.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-black font-bold">
                          {mentor.avatar}
                        </div>
                        <div>
                          <h3 className="font-medium">{mentor.name}</h3>
                          <p className="text-xs text-muted-foreground">{mentor.generationalCohort}</p>
                        </div>
                      </div>
                      <div className={`w-3 h-3 rounded-full ${
                        mentor.availability === "online" ? "bg-green-500" :
                        mentor.availability === "busy" ? "bg-yellow-500" : "bg-gray-500"
                      }`} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-1">
                        {mentor.culturalBackground.map((bg) => (
                          <Badge key={bg} variant="outline" className="text-xs">
                            <Globe className="w-3 h-3 mr-1" />
                            {bg}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex flex-wrap gap-1">
                        {mentor.intelligenceTypes.map((type) => (
                          <Badge key={type} variant="secondary" className="text-xs">
                            <Brain className="w-3 h-3 mr-1" />
                            {type}
                          </Badge>
                        ))}
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-center text-xs">
                        <div>
                          <p className="font-bold text-primary">{mentor.hoursContributed}</p>
                          <p className="text-muted-foreground">Hours</p>
                        </div>
                        <div>
                          <p className="font-bold text-aquamarine">{mentor.equityScore}%</p>
                          <p className="text-muted-foreground">Equity</p>
                        </div>
                      </div>

                      <Button 
                        className="w-full" 
                        size="sm"
                        disabled={mentor.availability !== "online"}
                        onClick={() => setCurrentMentor(mentor)}
                      >
                        {mentor.availability === "online" ? "Connect" : "Unavailable"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}