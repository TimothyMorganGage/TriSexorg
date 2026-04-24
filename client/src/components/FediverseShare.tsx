import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Share2, Globe, Network, Camera, Video, Copy, CheckCircle, Megaphone, Users } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface FediverseShareProps {
  title: string;
  description?: string;
  url?: string;
  hashtags?: string[];
  contentWarning?: string;
  imagePrompt?: string;
}

export function FediverseShare({
  title,
  description,
  url,
  hashtags = [],
  contentWarning = "sexual health (educational)",
  imagePrompt
}: FediverseShareProps) {
  const [copied, setCopied] = useState<string | null>(null);
  
  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const hashtagString = hashtags.map(tag => `#${tag}`).join(' ');

  const platforms = {
    bluesky: {
      name: "Bluesky",
      icon: Globe,
      color: "bg-blue-500",
      post: `${title}\n\n${description || ''}\n\n${hashtagString}\n\n${shareUrl}`,
      instructions: "1. Copy the post text\n2. Visit bsky.app\n3. Create a new post\n4. Paste and share!"
    },
    mastodon: {
      name: "Mastodon",
      icon: Network,
      color: "bg-indigo-500",
      post: `${title}\n\n${description || ''}\n\n${hashtagString}\n\n${shareUrl}`,
      instructions: `1. Copy the post text\n2. Visit your Mastodon instance\n3. Create a new post\n4. Add content warning: "${contentWarning}"\n5. Paste and share!`
    },
    pixelfed: {
      name: "Pixelfed",
      icon: Camera,
      color: "bg-purple-500",
      post: `${title}\n\n${hashtagString}`,
      instructions: `1. Copy the caption text\n2. Visit pixelfed.social or your instance\n3. Upload an image${imagePrompt ? ` (${imagePrompt})` : ''}\n4. Paste caption\n5. Add link: ${shareUrl}\n6. Share!`
    },
    loops: {
      name: "Loops",
      icon: Video,
      color: "bg-green-500",
      post: `${title}\n\n${hashtagString}`,
      instructions: `1. Copy the caption text\n2. Visit loops.video\n3. Upload a video\n4. Paste caption\n5. Add link: ${shareUrl}\n6. Share!`
    },
    truthsocial: {
      name: "Truth Social",
      icon: Megaphone,
      color: "bg-red-600",
      post: `${title}\n\n${description || ''}\n\n${hashtagString}\n\n${shareUrl}`,
      instructions: `1. Copy the post (Truths are limited to 500 chars — trim if needed)\n2. Visit truthsocial.com or open the app\n3. Tap "Create a Truth"\n4. Paste and post!\n\nNote: Truth Social runs a Mastodon-compatible API but does not federate via ActivityPub, so reach is limited to the Truth Social network.`
    },
    hylo: {
      name: "Hylo",
      icon: Users,
      color: "bg-amber-600",
      post: `${title}\n\n${description || ''}\n\n${hashtagString}\n\n${shareUrl}`,
      instructions: `1. Copy the post text\n2. Visit hylo.com and open your group (or join the TriSex.org group)\n3. Click "Create" → choose Discussion, Resource, or Project as the post type\n4. Paste the text into the body, set a topic, and add a content warning if needed\n5. Post to your group, a federation, or to Public\n\nHylo is open-source, cooperative-owned community infrastructure — a strong fit for $BAD / $TRISEXORG governance discussions.`
    }
  };

  const copyToClipboard = async (text: string, platformName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(platformName);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" data-testid="button-share-fediverse">
          <Share2 className="h-4 w-4 mr-2" />
          Share to Fediverse
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Share2 className="h-5 w-5 mr-2" />
            Share to Federated Networks
          </DialogTitle>
          <DialogDescription>
            Choose a platform and copy the pre-formatted post. Federation protects against platform monopolies.
          </DialogDescription>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-4 mt-4">
          {Object.entries(platforms).map(([key, platform]) => {
            const Icon = platform.icon;
            const isCopied = copied === platform.name;
            
            return (
              <Card key={key} className="border-2">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <div className={`${platform.color} p-2 rounded-lg`}>
                        <Icon className="h-4 w-4 text-white" />
                      </div>
                      <h3 className="font-semibold">{platform.name}</h3>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => copyToClipboard(platform.post, platform.name)}
                      variant={isCopied ? "default" : "outline"}
                      data-testid={`button-copy-${key}`}
                    >
                      {isCopied ? (
                        <>
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-1" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="bg-muted p-3 rounded-lg mb-3 text-sm font-mono whitespace-pre-wrap max-h-32 overflow-y-auto">
                    {platform.post}
                  </div>

                  <div className="text-xs text-muted-foreground whitespace-pre-line">
                    {platform.instructions}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-4 p-4 bg-green-50 dark:bg-green-950 border border-green-500/50 rounded-lg">
          <div className="flex items-start space-x-2">
            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <strong className="text-green-900 dark:text-green-100">Why Federation Matters:</strong>
              <p className="text-green-800 dark:text-green-200 mt-1">
                By sharing on decentralized platforms (AT Protocol & ActivityPub), you help prevent corporate monopolies from controlling sexual health conversations. Your content stays yours, and no single company can silence our cooperative community.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
