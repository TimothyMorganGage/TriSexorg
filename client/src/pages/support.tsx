import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Gift, ExternalLink, HandHeart } from "lucide-react";

export default function Support() {
  const supportCode = "R67-J62";

  return (
    <div className="min-h-screen bg-surface py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <HandHeart className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-foreground font-recoleta mb-3">
            Support This Project
          </h1>
          <p className="text-xl text-muted-foreground font-coolvetica">
            If TriSex.org has helped you, you can help keep it running.
          </p>
        </div>

        <Card className="mb-6">
          <CardContent className="p-6 space-y-4 text-muted-foreground">
            <p>
              TriSex.org is a self-employment project built and operated by{" "}
              <strong className="text-foreground">Timothy M Gage</strong>. It is
              offered freely and openly under a Creative Commons BY-SA 4.0
              licence. There is no company behind it and no paid staff — just one
              person covering the costs of building and running it.
            </p>
            <p>
              If you've benefited from the tools, education, or community here and
              would like to give back, you can contribute through UGiftABLE and
              help defray those operating expenses. Every bit is genuinely
              appreciated — but giving is entirely optional, and nothing on this
              site is locked behind a payment.
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 border-primary/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-recoleta">
              <Gift className="h-5 w-5 text-primary" />
              How to contribute
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <ol className="space-y-4 text-sm text-muted-foreground list-decimal list-inside">
              <li>
                Visit{" "}
                <a
                  href="https://www.ugiftable.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary font-medium hover:underline inline-flex items-center gap-1"
                >
                  UGiftABLE.com
                  <ExternalLink className="h-3 w-3" />
                </a>
                .
              </li>
              <li>
                Enter the support code below for{" "}
                <strong className="text-foreground">Timothy M Gage</strong>.
              </li>
              <li>Choose an amount and complete your gift. Thank you!</li>
            </ol>

            <div className="rounded-lg border-2 border-dashed border-primary/40 bg-primary/5 p-6 text-center">
              <div className="text-xs uppercase tracking-wide text-muted-foreground mb-2">
                Support code — Timothy M Gage
              </div>
              <div className="text-3xl font-bold tracking-widest text-foreground font-mono select-all">
                {supportCode}
              </div>
            </div>

            <Button asChild size="lg" className="w-full">
              <a
                href="https://www.ugiftable.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Gift className="h-4 w-4 mr-2" />
                Go to UGiftABLE.com
              </a>
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              UGiftABLE.com is an independent third-party platform not affiliated
              with TriSex.org. Contributions are processed entirely on their site.
            </p>
          </CardContent>
        </Card>

        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mt-8">
          <Heart className="h-4 w-4 text-primary" />
          <span>Thank you for helping keep this work going.</span>
        </div>
      </div>
    </div>
  );
}
