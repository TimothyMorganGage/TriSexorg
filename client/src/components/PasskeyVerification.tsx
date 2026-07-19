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

interface DigitalIdStatus {
  recorded: boolean;
  authorityConfirmed: boolean;
  ageOver18?: boolean;
  issuerVerified?: boolean;
  deviceVerified?: boolean;
  checksNote?: string;
}

function digitalCredentialsSupported(): boolean {
  return (
    typeof navigator !== "undefined" &&
    !!navigator.credentials &&
    ("DigitalCredential" in window || "identity" in navigator)
  );
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

          <DigitalIdSection signedOut={signedOut} />
        </CardContent>
      </Card>
    </div>
  );
}

function DigitalIdSection({ signedOut }: { signedOut: boolean }) {
  const { toast } = useToast();
  const supported = digitalCredentialsSupported();

  const { data: idStatus } = useQuery<DigitalIdStatus>({
    queryKey: ["/api/digital-id/status"],
    retry: false,
    enabled: !signedOut,
  });

  const verifyMutation = useMutation({
    mutationFn: async () => {
      const optionsRes = await apiRequest("POST", "/api/digital-id/request-options", {});
      const { requests } = await optionsRes.json();
      // Live Digital Credentials API call: the OS wallet handles the document;
      // only the scoped age_over_18 response reaches this app.
      const credential: any = await (navigator.credentials as any).get({
        digital: { requests },
        mediation: "required",
      });
      if (!credential) throw new Error("No credential was returned by the wallet");
      const payload = {
        protocol: credential.protocol ?? "unknown",
        data: credential.data ?? credential.token ?? null,
      };
      const verifyRes = await apiRequest("POST", "/api/digital-id/verify", payload);
      return await verifyRes.json();
    },
    onSuccess: (result: DigitalIdStatus) => {
      queryClient.invalidateQueries({ queryKey: ["/api/digital-id/status"] });
      toast({
        title: result.authorityConfirmed
          ? "Age check confirmed"
          : "Wallet response recorded (not yet confirmed)",
        description: result.authorityConfirmed
          ? "The issuing authority's signature and device binding were cryptographically validated. Only the over-18 answer reached TriSex.org."
          : "Your wallet shared only the over-18 answer — no document data reached TriSex.org. But without a configured authority trust list, this response is recorded as self-attested, not confirmed.",
      });
    },
    onError: (err: Error) => {
      if (err.name === "NotAllowedError" || err.message.includes("NotAllowedError")) {
        toast({
          title: "Wallet request cancelled",
          description: "The wallet prompt was cancelled or timed out. You can try again anytime.",
        });
        return;
      }
      toast({
        title: "Digital-ID check didn't complete",
        description: err.message.startsWith("401")
          ? "Please sign in first, then try the wallet check."
          : err.message,
        variant: "destructive",
      });
    },
  });

  return (
    <div className="space-y-3" data-testid="digital-id-section">
      <div className="rounded-lg border p-4 space-y-3">
        <div className="flex items-center gap-2 font-medium flex-wrap">
          <IdCard className="h-4 w-4" /> Digital-ID age check (live, experimental)
          {idStatus?.recorded && idStatus.authorityConfirmed && idStatus.ageOver18 && (
            <Badge className="bg-green-600 text-white dark:bg-green-500 dark:text-black" data-testid="badge-age-verified">
              <ShieldCheck className="h-3.5 w-3.5 mr-1" /> Over-18 authority-confirmed
            </Badge>
          )}
          {idStatus?.recorded && !idStatus.authorityConfirmed && (
            <Badge variant="outline" className="border-amber-500 text-amber-700 dark:text-amber-400" data-testid="badge-age-unconfirmed">
              Wallet response on file — not cryptographically confirmed
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          If your phone has a digital ID (like a mobile driver's licence) in its OS wallet, your
          device can answer a single yes/no question — "over 18?" — without ever sharing the
          document, your name, birthdate, photo, or licence number. TriSex.org stores only the
          yes/no answer and a record of which cryptographic checks ran.
        </p>

        {idStatus?.recorded ? (
          <Alert className={idStatus.authorityConfirmed ? "border-green-600/50" : "border-amber-500/50"}>
            <ShieldCheck className="h-4 w-4" />
            <AlertTitle>
              {idStatus.authorityConfirmed
                ? "Wallet age check confirmed"
                : "Wallet response on file — treated as self-attested"}
            </AlertTitle>
            <AlertDescription className="space-y-1">
              <span className="block">
                Over-18 answer: <strong>{idStatus.ageOver18 ? "yes" : "no"}</strong>. Issuer
                signature validated against an official trust list:{" "}
                <strong>{idStatus.issuerVerified ? "yes" : "no"}</strong>. Device binding
                validated: <strong>{idStatus.deviceVerified ? "yes" : "no"}</strong>.
              </span>
              {idStatus.checksNote && (
                <span className="block text-xs text-muted-foreground">{idStatus.checksNote}</span>
              )}
            </AlertDescription>
          </Alert>
        ) : supported ? (
          <Button
            variant="outline"
            onClick={() => verifyMutation.mutate()}
            disabled={verifyMutation.isPending || signedOut}
            data-testid="button-digital-id"
          >
            {verifyMutation.isPending ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <IdCard className="h-4 w-4 mr-2" />
            )}
            Check "over 18" with my wallet
          </Button>
        ) : (
          <Alert>
            <AlertTitle>Your browser doesn't support this yet</AlertTitle>
            <AlertDescription>
              The Digital Credentials API currently works only in the newest Chrome on Android
              with a digital ID stored in the OS wallet. On this browser the button would fail,
              so we're telling you instead of pretending.
            </AlertDescription>
          </Alert>
        )}

        <p className="text-xs text-muted-foreground">
          Honest limits: this standard is experimental and wallet coverage is thin. Unless the
          check above says the issuer signature was validated against an official trust list,
          treat the answer as wallet-mediated rather than authority-confirmed — we say exactly
          which checks ran, and we never infer more than the wallet proved. The passkey check
          above remains separate: it proves a real person on a real device, not age or identity.
        </p>
      </div>
    </div>
  );
}
