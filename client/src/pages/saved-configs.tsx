import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, ExternalLink, Copy, Check } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useState } from "react";

interface SavedConfiguration {
  id: number;
  userId: number;
  configurationName: string;
  configurationData: any;
  shareCode: string;
  isPublic: boolean;
  createdAt: string;
}

export default function SavedConfigurations() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const { data: configurations, isLoading } = useQuery<SavedConfiguration[]>({
    queryKey: ["/api/saved-configurations"],
    enabled: !!user,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/saved-configurations/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Configuration Deleted",
        description: "Your saved configuration has been deleted.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/saved-configurations"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete configuration.",
        variant: "destructive",
      });
    },
  });

  const handleCopyShareLink = (shareCode: string) => {
    const shareUrl = `${window.location.origin}/products?share=${shareCode}`;
    navigator.clipboard.writeText(shareUrl);
    setCopiedCode(shareCode);
    toast({
      title: "Link Copied!",
      description: "Share this link with friends to show them your configuration.",
    });
    setTimeout(() => setCopiedCode(null), 2000);
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-lg text-muted-foreground">
              Please log in to view your saved configurations.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <p>Loading your saved configurations...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">My Saved Configurations</h1>
        <p className="text-muted-foreground">
          View and manage your custom product configurations
        </p>
      </div>

      {!configurations || configurations.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-lg text-muted-foreground mb-4">
              You haven't saved any configurations yet.
            </p>
            <Button asChild>
              <a href="/products">Create Your First Configuration</a>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {configurations.map((config) => (
            <Card key={config.id} data-testid={`card-saved-config-${config.id}`}>
              <CardHeader>
                <CardTitle className="flex items-start justify-between">
                  <span className="text-lg">{config.configurationName}</span>
                  {config.isPublic && <Badge variant="outline">Public</Badge>}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-muted-foreground space-y-1">
                  <div>
                    <span className="font-medium">Size:</span>{" "}
                    {config.configurationData.widthCategory}
                    {config.configurationData.lengthCategory}
                  </div>
                  <div>
                    <span className="font-medium">Material:</span>{" "}
                    {config.configurationData.material}
                  </div>
                  <div>
                    <span className="font-medium">Features:</span>{" "}
                    {config.configurationData.features?.length || 0}
                  </div>
                  <div className="text-xs">
                    Saved {new Date(config.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleCopyShareLink(config.shareCode)}
                    data-testid={`button-share-${config.id}`}
                  >
                    {copiedCode === config.shareCode ? (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="mr-2 h-4 w-4" />
                        Share
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    data-testid={`button-view-${config.id}`}
                  >
                    <a href={`/products?share=${config.shareCode}`}>
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View
                    </a>
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteMutation.mutate(config.id)}
                    disabled={deleteMutation.isPending}
                    data-testid={`button-delete-${config.id}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
