import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { BetaDisclaimer } from "@/components/BetaDisclaimer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, BookOpen } from "lucide-react";
import type { EducationalContent } from "@shared/schema";

const categoryNames: Record<string, string> = {
  sti_prevention: "STI Prevention",
  inclusive_health: "Inclusive Health",
  sustainable_health: "Sustainable Health",
  communication: "Communication",
  community_support: "Community Support",
  research: "Research & Science",
};

function renderMarkdown(md: string) {
  const blocks = md.split(/\n\n+/);
  return blocks.map((block, i) => {
    const trimmed = block.trim();
    if (!trimmed) return null;
    if (trimmed.startsWith("## ")) {
      return (
        <h2 key={i} className="text-2xl font-semibold text-neutral mt-8 mb-3">
          {trimmed.replace(/^##\s+/, "")}
        </h2>
      );
    }
    if (trimmed.startsWith("### ")) {
      return (
        <h3 key={i} className="text-xl font-semibold text-neutral mt-6 mb-2">
          {trimmed.replace(/^###\s+/, "")}
        </h3>
      );
    }
    if (/^[-*]\s+/.test(trimmed)) {
      const items = trimmed.split(/\n/).map((l) => l.replace(/^[-*]\s+/, ""));
      return (
        <ul key={i} className="list-disc pl-6 space-y-1 text-gray-700 my-3">
          {items.map((it, j) => (
            <li key={j}>{it}</li>
          ))}
        </ul>
      );
    }
    return (
      <p key={i} className="text-gray-700 leading-relaxed my-3">
        {trimmed}
      </p>
    );
  });
}

export default function EducationArticle() {
  const [, params] = useRoute<{ slug: string }>("/education/:slug");
  const slug = params?.slug;

  const { data: article, isLoading, error } = useQuery<EducationalContent>({
    queryKey: ["/api/education", slug],
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading article...</p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-surface py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-semibold mb-2">Article not found</h1>
          <p className="text-gray-600 mb-6">
            This article may have been moved or is not yet published.
          </p>
          <Link href="/education">
            <Button variant="outline" data-testid="button-back-education">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Education Hub
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      <BetaDisclaimer />
      <div className="py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/education">
            <Button variant="link" className="p-0 mb-6" data-testid="link-back-education">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Education Hub
            </Button>
          </Link>
          <Card>
            <CardContent className="p-6 sm:p-10">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Badge variant="outline">
                  {categoryNames[article.category] || article.category}
                </Badge>
                {article.tags?.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-neutral mb-4">
                {article.title}
              </h1>
              <div className="flex items-center text-sm text-gray-500 mb-6">
                <Clock className="h-4 w-4 mr-1" />
                {new Date(article.createdAt).toLocaleDateString()}
              </div>
              <p className="text-lg text-gray-700 leading-relaxed border-l-4 border-primary pl-4 mb-6">
                {article.excerpt}
              </p>
              <div className="prose prose-lg max-w-none">
                {renderMarkdown(article.content)}
              </div>
              <div className="mt-10 pt-6 border-t text-sm text-gray-500">
                Licensed CC BY-SA 4.0. Centring 2SLGBTIQA+ co-operators —
                Two-Spirit, lesbian, gay, bisexual, transgender, intersex,
                queer/questioning, asexual, and all expansive identities.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
