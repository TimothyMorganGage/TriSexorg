import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Star, MapPin, Calendar, Heart, MessageSquare } from "lucide-react";
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
  const { data: reviews = [] } = useQuery<Review[]>({
    queryKey: ["/api/reviews"],
  });

  const averageRating =
    reviews.length === 0
      ? 0
      : reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
  const totalHelpful = reviews.reduce((acc, r) => acc + r.helpful, 0);

  const renderStars = (rating: number) => (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${
            star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:to-purple-900 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <Alert className="mb-6 bg-white dark:bg-gray-950 border-2 border-black dark:border-white">
          <Heart className="h-5 w-5 text-black dark:text-white" />
          <AlertDescription className="ml-2 text-black dark:text-white">
            <strong>Intersex Healthcare IS Everyone's Affirmation:</strong> Reviews on this page center intersex anatomy as the universal baseline. Every reviewer's body is respected without categorization.
          </AlertDescription>
        </Alert>

        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
            Infinitely Affirmative Protection — Member Reviews
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Real reviews from real members of the cooperative. No staged testimonials, no synthetic five-star floors.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <SummaryStat label="Reviews" value={reviews.length.toString()} />
          <SummaryStat label="Average rating" value={reviews.length === 0 ? "—" : averageRating.toFixed(1)} />
          <SummaryStat label="Found-helpful (sum)" value={reviews.length === 0 ? "—" : totalHelpful.toLocaleString()} />
        </div>

        {reviews.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="font-semibold text-lg">No reviews yet</p>
              <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
                Be the first reviewer when reviews open. The empty state is honest: nothing here will ever be invented to make the page look populated. Reviews will be flagged as <code>verified</code> only if posted from a verified member account.
              </p>
              <div className="mt-6">
                <FediverseShare
                  title="Reviews on TriSex.org's Infinitely Affirmative Protection"
                  description="Real cooperative member reviews — empty until members post."
                />
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <Card key={review.id} data-testid={`review-${review.id}`}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                        {review.memberName.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold">{review.memberName}</div>
                        <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                          <span className="flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {review.location}
                          </span>
                          <span className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(review.date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      {renderStars(review.rating)}
                      {review.verified && (
                        <Badge className="bg-green-500 text-white">✓ Verified Member</Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <h3 className="text-lg font-bold mb-2">{review.title}</h3>
                  <p className="text-sm text-foreground/80 leading-relaxed mb-3">{review.content}</p>
                  <div className="flex justify-between items-center pt-3 border-t">
                    <Badge variant="outline">{review.productCategory}</Badge>
                    <span className="text-xs text-muted-foreground">
                      👍 {review.helpful} found helpful
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function SummaryStat({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <CardContent className="p-4 text-center">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-2xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}
