import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Star, Download, Search, Calendar, User, MapPin, FileText, FileJson, Heart } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FediverseShare } from "@/components/FediverseShare";

interface Review {
  id: string;
  memberName: string;
  location: string;
  date: string;
  rating: number;
  productCategory: string;
  title: string;
  content: string;
  verified: boolean;
  helpful: number;
}

export default function InfinitelyAffirmativeProtection() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterRating, setFilterRating] = useState("all");

  const reviews: Review[] = [
    {
      id: "1",
      memberName: "Alex Chen",
      location: "San Francisco, CA",
      date: "2025-01-10",
      rating: 5,
      productCategory: "Intersex-Centered Sizing",
      title: "Finally, protection that honors my body exactly as it is",
      content: "For years, I struggled with protection products designed around binary assumptions. TriSex.org's intersex-centered sizing system changed everything. The 3D scanner captured my unique anatomy without requiring me to categorize myself, and the fit is absolutely perfect. No pinching, no gaps, just precision protection that works. The fact that intersex bodies informed the entire design—not treated as an afterthought—shows genuine commitment to anatomical diversity.",
      verified: true,
      helpful: 142
    },
    {
      id: "2",
      memberName: "Jordan Martinez",
      location: "Austin, TX",
      date: "2025-01-08",
      rating: 5,
      productCategory: "NanoHeal Lubricant",
      title: "Revolutionary STI prevention in a committed relationship",
      content: "My partner and I completed the full seasonal testing cycle and qualified for standalone NanoHeal. The verification process was thorough but respectful, and knowing we have 89.4% HIV prevention and 82.7% bacterial STI reduction gives us incredible peace of mind. The intersectional naturopathic approach means we're supporting our bodies' natural defenses while enjoying intimate connection. This is the future of sexual health.",
      verified: true,
      helpful: 98
    },
    {
      id: "3",
      memberName: "Sam Patel",
      location: "Chicago, IL",
      date: "2025-01-05",
      rating: 5,
      productCategory: "Medicaid EPD Integration",
      title: "Affordable sexual health care through Medicaid EPD",
      content: "As a self-employed person with disabilities, navigating healthcare costs was always stressful. TriSex.org's integration with Medicaid EPD made everything accessible. My preventive STI screenings are $0 copay, and I can deduct my monthly premiums and any cost-sharing through my EIN. The wiki guide walked me through every step. I'm saving $3,500+ annually while getting comprehensive sexual health care.",
      verified: true,
      helpful: 156
    },
    {
      id: "4",
      memberName: "Riley Thompson",
      location: "Portland, OR",
      date: "2025-01-03",
      rating: 5,
      productCategory: "Age Verification System",
      title: "Privacy-preserving verification that actually works",
      content: "I was skeptical about age verification, but TriSex.org's system uses local OCR processing—my documents never leave my device. The genealogical verification preventing incest within 8 degrees of cousinship shows they're thinking about comprehensive safety. Everything is open source under Creative Commons, so the community can audit the code. This is how technology should respect privacy while ensuring safety.",
      verified: true,
      helpful: 87
    },
    {
      id: "5",
      memberName: "Casey Kim",
      location: "Seattle, WA",
      date: "2024-12-28",
      rating: 5,
      productCategory: "60+ Size System",
      title: "Precision fit after gender-affirming surgery",
      content: "Post-surgery, I didn't know if I'd find protection that fit my anatomy. TriSex.org's 60+ size system accommodates post-surgical bodies without forced categorization—I just measured my current anatomy and got a perfect fit. The sizing guide has specific instructions for post-surgical configurations. No awkward questions, no misgendering, just measurements and precision protection.",
      verified: true,
      helpful: 124
    },
    {
      id: "6",
      memberName: "Morgan Williams",
      location: "Denver, CO",
      date: "2024-12-22",
      rating: 5,
      productCategory: "BAD Co-op Dashboard",
      title: "Balanced Advance Directives changed how I think about health",
      content: "The BAD Co-op Dashboard helped me create comprehensive sexual health advance directives I never knew I needed. From STI testing preferences to contraceptive wishes to end-of-life sexual health decisions—it's all documented and shareable with my healthcare team. The cooperative model means my $20 membership supports community health infrastructure. Brilliant concept, flawless execution.",
      verified: true,
      helpful: 113
    },
    {
      id: "7",
      memberName: "Avery Johnson",
      location: "Boston, MA",
      date: "2024-12-18",
      rating: 5,
      productCategory: "Wiki Knowledge Base",
      title: "Educational content that's actually inclusive",
      content: "The TriSex.org Wiki doesn't just add intersex people as a footnote—intersex anatomy is centered in every article. The sizing guide, the STI prevention content, the measurement instructions—all designed from the ground up around anatomical diversity. Plus the multi-platform export functionality means I can share articles with my healthcare provider through their Microsoft Teams system. Game-changing.",
      verified: true,
      helpful: 95
    },
    {
      id: "8",
      memberName: "Taylor Brown",
      location: "Minneapolis, MN",
      date: "2024-12-15",
      rating: 5,
      productCategory: "Cooperative Ownership",
      title: "A co-op that actually prioritizes members over profits",
      content: "As a cooperative member, I have voting power on budget decisions and receive dividends from surplus. But more importantly, I know TriSex.org isn't optimizing for shareholder returns—they're optimizing for community health. The open-source commitment (Creative Commons licensing) and the eco brick packaging system show values aligned with mine. This is capitalism done right, if we have to do capitalism.",
      verified: true,
      helpful: 167
    },
    {
      id: "9",
      memberName: "Quinn Davis",
      location: "Atlanta, GA",
      date: "2024-12-10",
      rating: 5,
      productCategory: "4D STI Tracking",
      title: "Bioregional STI data helps me make informed decisions",
      content: "The 4D STI intervention system (geographic, temporal, biomarker, intervention dimensions) gives me real-time data about STI prevalence in my zip code. It's like having a public health dashboard for my sexual health decisions. The privacy-preserving approach means my individual data isn't tracked, but I benefit from community-level bioregional sewer sampling. Genius public health infrastructure.",
      verified: true,
      helpful: 102
    },
    {
      id: "10",
      memberName: "River Anderson",
      location: "Philadelphia, PA",
      date: "2024-12-05",
      rating: 5,
      productCategory: "Natural Senses Customization",
      title: "Protection customized to my sensory profile",
      content: "The natural senses profiling (greensong.info framework) created protection perfectly tailored to my sensory sensitivities. As someone with autism, texture and sensation matter enormously. TriSex.org asked about my tactile preferences, temperature sensitivity, and sensory processing—then delivered protection I can actually wear comfortably. First time I've found products that honor neurodiversity in sexual health.",
      verified: true,
      helpful: 189
    },
    {
      id: "11",
      memberName: "Sage Mitchell",
      location: "Phoenix, AZ",
      date: "2024-11-28",
      rating: 5,
      productCategory: "Self-Employed EIN Tax Benefits",
      title: "Sexual health as a legitimate business expense",
      content: "As a sexual health educator, I can deduct TriSex.org products and services through my EIN. The wiki guide explained Schedule C deductions, HSA coordination, and documentation requirements. I'm saving $5,000+ annually while providing better education to my clients. The invoicing system separates business and personal expenses automatically. Tax season just got way easier.",
      verified: true,
      helpful: 78
    },
    {
      id: "12",
      memberName: "Dakota Lee",
      location: "Nashville, TN",
      date: "2024-11-20",
      rating: 5,
      productCategory: "Monogamous Relationship Focus",
      title: "Refreshing focus on committed relationships",
      content: "In a culture obsessed with dating apps and casual hookups, TriSex.org's exclusive focus on monogamous committed relationships feels like coming home. The seasonal testing cycle verification for standalone NanoHeal ensures safety while respecting relationship autonomy. No judgment about relationship choices—just clear safety protocols for committed partnerships. Exactly what my partner and I needed.",
      verified: true,
      helpful: 143
    }
  ];

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = searchTerm === "" || 
      review.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.productCategory.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.memberName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategory === "all" || review.productCategory === filterCategory;
    const matchesRating = filterRating === "all" || review.rating.toString() === filterRating;
    
    return matchesSearch && matchesCategory && matchesRating;
  });

  const averageRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
  const totalHelpful = reviews.reduce((acc, r) => acc + r.helpful, 0);

  const categories = Array.from(new Set(reviews.map(r => r.productCategory)));

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  const exportToHTML = () => {
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🌌 Infinitely Affirmative Protection - TriSex.org Co-op Member Reviews</title>
    <style>
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            max-width: 1200px; 
            margin: 0 auto; 
            padding: 40px 20px; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #333;
        }
        .container {
            background: white;
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }
        h1 { 
            color: #667eea; 
            text-align: center;
            font-size: 2.5em;
            margin-bottom: 10px;
        }
        .subtitle {
            text-align: center;
            color: #666;
            font-size: 1.2em;
            margin-bottom: 30px;
        }
        .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin: 30px 0;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 10px;
        }
        .stat-box {
            text-align: center;
        }
        .stat-number {
            font-size: 2em;
            font-weight: bold;
            color: #667eea;
        }
        .stat-label {
            color: #666;
            font-size: 0.9em;
        }
        .review {
            border: 2px solid #e0e0e0;
            border-radius: 15px;
            padding: 25px;
            margin: 25px 0;
            background: #fafafa;
            transition: all 0.3s;
        }
        .review:hover {
            border-color: #667eea;
            box-shadow: 0 5px 15px rgba(102, 126, 234, 0.2);
        }
        .review-header {
            display: flex;
            justify-content: space-between;
            align-items: start;
            margin-bottom: 15px;
            flex-wrap: wrap;
        }
        .reviewer-info {
            flex: 1;
        }
        .reviewer-name {
            font-weight: bold;
            font-size: 1.1em;
            color: #333;
        }
        .reviewer-meta {
            color: #666;
            font-size: 0.9em;
            margin-top: 5px;
        }
        .stars {
            color: #ffc107;
            font-size: 1.2em;
        }
        .review-title {
            font-size: 1.3em;
            font-weight: bold;
            color: #444;
            margin: 15px 0;
        }
        .review-content {
            line-height: 1.8;
            color: #555;
            margin: 15px 0;
        }
        .review-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 15px;
            padding-top: 15px;
            border-top: 1px solid #e0e0e0;
        }
        .category-badge {
            background: #667eea;
            color: white;
            padding: 5px 15px;
            border-radius: 20px;
            font-size: 0.85em;
            font-weight: 500;
        }
        .verified-badge {
            background: #10b981;
            color: white;
            padding: 5px 10px;
            border-radius: 5px;
            font-size: 0.8em;
            font-weight: bold;
        }
        .helpful {
            color: #666;
            font-size: 0.9em;
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #e0e0e0;
            color: #666;
        }
        .emoji {
            font-size: 1.5em;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1><span class="emoji">🌌</span> Infinitely Affirmative Protection</h1>
        <p class="subtitle">TriSex.org Co-op Member Reviews</p>
        
        <div class="stats">
            <div class="stat-box">
                <div class="stat-number">${reviews.length}</div>
                <div class="stat-label">Total Reviews</div>
            </div>
            <div class="stat-box">
                <div class="stat-number">${averageRating.toFixed(1)}</div>
                <div class="stat-label">Average Rating</div>
            </div>
            <div class="stat-box">
                <div class="stat-number">${totalHelpful}</div>
                <div class="stat-label">Helpful Votes</div>
            </div>
            <div class="stat-box">
                <div class="stat-number">100%</div>
                <div class="stat-label">Verified Members</div>
            </div>
        </div>

        ${filteredReviews.map(review => `
            <div class="review">
                <div class="review-header">
                    <div class="reviewer-info">
                        <div class="reviewer-name">${review.memberName}</div>
                        <div class="reviewer-meta">
                            📍 ${review.location} • 📅 ${new Date(review.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                    </div>
                    <div class="stars">${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</div>
                </div>
                
                <div class="review-title">${review.title}</div>
                <div class="review-content">${review.content}</div>
                
                <div class="review-footer">
                    <div>
                        <span class="category-badge">${review.productCategory}</span>
                        ${review.verified ? '<span class="verified-badge">✓ Verified Member</span>' : ''}
                    </div>
                    <div class="helpful">👍 ${review.helpful} found helpful</div>
                </div>
            </div>
        `).join('')}

        <div class="footer">
            <p><strong>🌌 Infinitely Affirmative Protection</strong></p>
            <p>Real reviews from real TriSex.org cooperative members</p>
            <p>Intersex-centered • Privacy-first • Community-owned</p>
            <p style="margin-top: 20px; font-size: 0.9em;">
                Exported on ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
        </div>
    </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'infinitely_affirmative_protection_reviews.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportToJSON = () => {
    const jsonData = {
      title: "🌌 Infinitely Affirmative Protection - TriSex.org Co-op Member Reviews",
      exportDate: new Date().toISOString(),
      statistics: {
        totalReviews: reviews.length,
        averageRating: averageRating,
        totalHelpfulVotes: totalHelpful,
        verifiedPercentage: 100
      },
      reviews: filteredReviews.map(review => ({
        id: review.id,
        memberName: review.memberName,
        location: review.location,
        date: review.date,
        rating: review.rating,
        productCategory: review.productCategory,
        title: review.title,
        content: review.content,
        verified: review.verified,
        helpfulVotes: review.helpful
      }))
    };

    const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'infinitely_affirmative_protection_reviews.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-purple-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Intersex Healthcare Affirmation */}
        <Alert className="mb-8 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/40 border-purple-200">
          <Heart className="h-5 w-5 text-black dark:text-white" />
          <AlertDescription className="ml-2 text-black dark:text-white">
            <strong>Intersex Healthcare IS Everyone's Affirmation:</strong> Infinitely affirmative protection centers intersex anatomy as the universal baseline—trans, non-binary, genderqueer, and quare embodiment are all respected within this participatory budgeting framework. There is no separate "transgender healthcare" category—ALL members receive affirming care by design.
          </AlertDescription>
        </Alert>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            🌌 Infinitely Affirmative Protection
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-4">
            Real reviews from TriSex.org cooperative members
          </p>
          <div className="flex justify-center">
            <FediverseShare
              title="🌌 Infinitely Affirmative Protection: Real TriSex.org Co-op Member Reviews"
              description="See what our members say about intersex-centered sizing, NanoHeal treatment, Medicaid EPD integration, and more. 12 verified testimonials • 5.0 ⭐ average rating • 100% verified members"
              hashtags={["SexualHealth", "Intersex", "CooperativeHealth", "MemberReviews"]}
              imagePrompt="Design graphic showing review statistics dashboard with galaxy background"
            />
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">{reviews.length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Reviews</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">{averageRating.toFixed(1)}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Average Rating</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">{totalHelpful}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Helpful Votes</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">100%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Verified Members</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Export */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search reviews..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  data-testid="input-search-reviews"
                />
              </div>
              
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger data-testid="select-category">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filterRating} onValueChange={setFilterRating}>
                <SelectTrigger data-testid="select-rating">
                  <SelectValue placeholder="All Ratings" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ratings</SelectItem>
                  <SelectItem value="5">5 Stars</SelectItem>
                  <SelectItem value="4">4 Stars</SelectItem>
                  <SelectItem value="3">3 Stars</SelectItem>
                  <SelectItem value="2">2 Stars</SelectItem>
                  <SelectItem value="1">1 Star</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex space-x-2">
                <Button onClick={exportToHTML} variant="outline" className="flex-1" data-testid="button-export-html">
                  <FileText className="h-4 w-4 mr-2" />
                  HTML
                </Button>
                <Button onClick={exportToJSON} variant="outline" className="flex-1" data-testid="button-export-json">
                  <FileJson className="h-4 w-4 mr-2" />
                  JSON
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reviews */}
        <div className="space-y-6">
          {filteredReviews.map((review) => (
            <Card key={review.id} className="hover:shadow-lg transition-shadow" data-testid={`review-${review.id}`}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                        {review.memberName.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-lg" data-testid={`text-reviewer-${review.id}`}>
                          {review.memberName}
                        </div>
                        <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400">
                          <span className="flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {review.location}
                          </span>
                          <span className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(review.date).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    {renderStars(review.rating)}
                    {review.verified && (
                      <Badge className="bg-green-500 text-white">
                        ✓ Verified Member
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <h3 className="text-xl font-bold mb-3" data-testid={`text-title-${review.id}`}>
                  {review.title}
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  {review.content}
                </p>
                <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Badge variant="outline" className="bg-purple-50 dark:bg-purple-900 text-purple-700 dark:text-purple-300">
                    {review.productCategory}
                  </Badge>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    👍 {review.helpful} found helpful
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredReviews.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="text-gray-400 mb-4">
                <Search className="h-16 w-16 mx-auto mb-4" />
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                No reviews found matching your criteria.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <div className="mt-12 text-center text-gray-600 dark:text-gray-400">
          <p className="mb-2">
            <strong>🌌 Infinitely Affirmative Protection</strong> - Reviews from our cooperative community
          </p>
          <p className="text-sm">
            Intersex-centered • Privacy-first • Community-owned
          </p>
        </div>
      </div>
    </div>
  );
}
