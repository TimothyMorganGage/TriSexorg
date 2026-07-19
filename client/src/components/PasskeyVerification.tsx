import { useQuery, useMutation } from "@tanstack/react-query";
import { startRegistration } from "@simplewebauthn/browser";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Fingerprint, ShieldCheck, KeyRound, Globe, IdCard, Loader2 } from "lucide-react";

interface PasskeyStatus {
  verified: boolean;
  credentialCount: number;
}

export default function PasskeyVerification() {
  const { toast } = useToast();

  const { data: status, isLoading, error } = useQuery<PasskeyStatus>({
    queryKey: ["/api/passkey/status"],
    retry: false,
  });

  const signedOut = !!error && String(error).startsWith("401");

  const registerMutation = useMutation({
    mutationFn: async () => {
      const optionsRes = await apiRequest("POST", "/api/passkey/register-options", {});
      const optionsJSON = await optionsRes.json();
      const attestation = await startRegistration({ optionsJSON });
      const verifyRes = await apiRequest("POST", "/api/passkey/register-verify", attestation);
      return await verifyRes.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/passkey/status"] });
      toast({
        title: "Device verified",
        description:
          "Your device's own security check (fingerprint, face, or PIN) now backs your Good People identity. Nothing personal left your device.",
      });
    },
    onError: (err: Error) => {
      if (err.name === "NotAllowedError" || err.message.includes("NotAllowedError")) {
        toast({
          title: "Verification cancelled",
          description: "The device check was cancelled or timed out. You can try again anytime.",
        });
        return;
      }
      toast({
        title: "Verification didn't complete",
        description: err.message.startsWith("401")
          ? "Please sign in first, then verify your device."
          : err.message,
        variant: "destructive",
      });
    },
  });

  return (
    <div className="space-y-6" data-testid="passkey-verification">
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Fingerprint className="h-5 w-5" />
            Privacy-Preserving Verification
            {status?.verified && (
              <Badge className="bg-green-600 text-white dark:bg-green-500 dark:text-black" data-testid="badge-verified">
                <ShieldCheck className="h-3.5 w-3.5 mr-1" /> Device-verified
              </Badge>
            )}
          </CardTitle>
          <CardDescription>
            Federated sign-in plus an OS-side device check — no documents, no biometrics, and no
            personal data ever sent to TriSex.org.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border p-4 space-y-2">
              <div className="flex items-center gap-2 font-medium">
                <Globe className="h-4 w-4" /> Federated identity
              </div>
              <p className="text-sm text-muted-foreground">
                Sign in with your email/password account or with Replit's federated login (OpenID
                Connect). Either way, other members only ever see your Good People profile — the
                identity provider never learns who you match with, and matches never learn your
                login details.
              </p>
            </div>
            <div className="rounded-lg border p-4 space-y-2">
              <div className="flex items-center gap-2 font-medium">
                <KeyRound className="h-4 w-4" /> OS-side device check
              </div>
              <p className="text-sm text-muted-foreground">
                Your operating system (Touch ID, Face ID, Windows Hello, or Android biometrics)
                confirms it's really you, locally on your device. TriSex.org only receives a
                cryptographic public key — never your fingerprint, face, or a copy of any ID.
              </p>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Checking your verification status…
            </div>
          ) : signedOut ? (
            <Alert>
              <AlertTitle>Sign in to verify</AlertTitle>
              <AlertDescription>
                Device verification attaches to your account, so please sign in (email/password or
                Log in with Replit) first.
              </AlertDescription>
            </Alert>
          ) : status?.verified ? (
            <div className="space-y-3">
              <Alert className="border-green-600/50">
                <ShieldCheck className="h-4 w-4" />
                <AlertTitle>Your device backs your identity</AlertTitle>
                <AlertDescription>
                  {status.credentialCount === 1
                    ? "1 device passkey is registered to your account."
                    : `${status.credentialCount} device passkeys are registered to your account.`}{" "}
                  You can add another device below.
                </AlertDescription>
              </Alert>
              <Button
                variant="outline"
                onClick={() => registerMutation.mutate()}
                disabled={registerMutation.isPending}
                data-testid="button-add-passkey"
              >
                {registerMutation.isPending ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Fingerprint className="h-4 w-4 mr-2" />
                )}
                Add another device
              </Button>
            </div>
          ) : (
            <Button
              size="lg"
              onClick={() => registerMutation.mutate()}
              disabled={registerMutation.isPending}
              data-testid="button-verify-passkey"
            >
              {registerMutation.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Fingerprint className="h-4 w-4 mr-2" />
              )}
              Verify with my device
            </Button>
          )}

          <Alert>
            <IdCard className="h-4 w-4" />
            <AlertTitle>Honest note: wallet-based ID checks are planned, not live</AlertTitle>
            <AlertDescription>
              We plan to support digital-ID wallets (like a mobile driver's licence via the
              browser's Digital Credentials API), where your OS would share only a yes/no
              "over 18" answer — never the document itself. That browser standard is still
              experimental and only works in the newest Chrome/Android builds, so we haven't
              shipped it. Nothing on Good People pretends otherwise. Today's device passkey check
              confirms a real person on a real device; it does not verify legal identity or age.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}
