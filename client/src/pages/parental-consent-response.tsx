import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Lock, Users, CheckCircle, XCircle, Clock, AlertTriangle, FileCheck, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

// Consent response schema
const consentResponseSchema = z.object({
  approved: z.boolean(),
  verificationCode: z.string().min(8, "Verification code must be at least 8 characters"),
  parentSignature: z.string().min(2, "Digital signature required"),
  acknowledgment: z.boolean().refine(val => val === true, {
    message: "You must acknowledge understanding of the platform"
  })
});

type ConsentResponse = z.infer<typeof consentResponseSchema>;

// Type definitions for API responses
interface ConsentDetails {
  id: string;
  parentGuardianName: string;  
  parentGuardianEmail: string;
  relationshipToMinor: string;
  consentType: string;
  status: string;
  expiresAt: string;
  requestedAt: string;
}

export default function ParentalConsentResponse() {
  const { consentId } = useParams();
  const [showApprovalForm, setShowApprovalForm] = useState(false);
  const { toast } = useToast();

  // Form for consent response
  const responseForm = useForm<ConsentResponse>({
    resolver: zodResolver(consentResponseSchema),
    defaultValues: {
      approved: false,
      acknowledgment: false
    }
  });

  // Get consent details
  const { data: consentDetails, isLoading } = useQuery<ConsentDetails>({
    queryKey: [`/api/age-verification/parental-consent/${consentId}`],
    enabled: !!consentId,
    retry: false
  });

  // Consent response mutation
  const respondToConsentMutation = useMutation({
    mutationFn: async (data: ConsentResponse) => {
      return apiRequest(`/api/age-verification/parental-consent/${consentId}/respond`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }, 
        body: JSON.stringify(data)
      });
    },
    onSuccess: (data: any) => {
      toast({
        title: data.approved ? "Consent Approved" : "Consent Denied", 
        description: data.approved ? 
          "Your child now has access to the requested platform features." :
          "Your response has been recorded. Your child will be notified.",
      });
      setShowApprovalForm(false);
    },
    onError: (error) => {
      toast({
        title: "Response Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <Clock className="h-8 w-8 text-blue-600 mx-auto mb-4 animate-spin" />
            <p>Loading consent request...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!consentDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Consent Request Not Found</h3>
            <p className="text-gray-600">
              This consent request may have expired or already been processed.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 p-4">
      <div className="max-w-3xl mx-auto pt-8">
        {/* Intersex Healthcare Affirmation */}
        <Alert className="mb-8 bg-white dark:bg-gray-950 border-2 border-black dark:border-white">
          <Heart className="h-5 w-5 text-black dark:text-white" />
          <AlertDescription className="ml-2 text-black dark:text-white">
            <strong>Intersex Healthcare IS Everyone's Affirmation:</strong> Parental consent centers intersex anatomy as the universal baseline—trans, non-binary, genderqueer, and quare embodiment are all respected within this participatory budgeting framework. There is no separate "transgender healthcare" category—all consent processes serve ALL bodies by design.
          </AlertDescription>
        </Alert>

        {/* Creative Commons Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Users className="h-8 w-8 text-green-600" />
            <h1 className="text-3xl font-bold text-gray-900">Parental Consent</h1>
          </div>
          <p className="text-gray-600 mb-4">
            Open Source Family Safety System • Creative Commons Licensed
          </p>
          
          {/* Creative Commons License Badge */}
          <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-lg border shadow-sm">
            <img 
              src="https://i.creativecommons.org/l/by-sa/4.0/88x31.png" 
              alt="Creative Commons License"
              className="h-6"
            />
            <span className="text-sm text-gray-600">
              Licensed under <a href="https://creativecommons.org/licenses/by-sa/4.0/" 
              className="text-blue-600 hover:underline">CC BY-SA 4.0</a>
            </span>
          </div>
        </div>

        {/* Consent Request Details */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileCheck className="h-5 w-5" />
              Consent Request Details
            </CardTitle>
            <CardDescription>
              Review the following request for your child's platform access
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="font-medium">Parent/Guardian:</Label>
                <p className="text-gray-700">{consentDetails.parentGuardianName}</p>
              </div>
              <div>
                <Label className="font-medium">Email:</Label>
                <p className="text-gray-700">{consentDetails.parentGuardianEmail}</p>
              </div>
              <div>
                <Label className="font-medium">Relationship:</Label>
                <p className="text-gray-700 capitalize">
                  {(consentDetails.relationshipToMinor || '').replace(/_/g, ' ')}
                </p>
              </div>
              <div>
                <Label className="font-medium">Status:</Label>
                <Badge 
                  className={
                    consentDetails.status === 'approved' ? 'bg-green-100 text-green-700' :
                    consentDetails.status === 'denied' ? 'bg-red-100 text-red-700' :
                    consentDetails.status === 'expired' ? 'bg-gray-100 text-gray-700' :
                    'bg-yellow-100 text-yellow-700'
                  }
                >
                  {consentDetails.status === 'approved' && <CheckCircle className="h-4 w-4 mr-1" />}
                  {consentDetails.status === 'denied' && <XCircle className="h-4 w-4 mr-1" />}
                  {consentDetails.status === 'pending' && <Clock className="h-4 w-4 mr-1" />}
                  <span className="capitalize">{consentDetails.status}</span>
                </Badge>
              </div>
              <div>
                <Label className="font-medium">Consent Type:</Label>
                <p className="text-gray-700 capitalize">
                  {(consentDetails.consentType || '').replace(/_/g, ' ')}
                </p>
              </div>
              <div>
                <Label className="font-medium">Expires:</Label>
                <p className="text-gray-700">
                  {new Date(consentDetails.expiresAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <Separator />

            {/* Platform Information */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">About American Care Planning Platform</h4>
              <div className="text-sm text-blue-800 space-y-2">
                <p>
                  <strong>Mission:</strong> Comprehensive sexual health education and cooperative relationship 
                  matching with strict safety protocols and 2SLGBTIQA+ inclusivity.
                </p>
                <p>
                  <strong>Safety Features:</strong> Progressive dating stages, mandatory STI screening, 
                  genealogical verification preventing incest, and financial penalties for safety violations.
                </p>
                <p>
                  <strong>Privacy:</strong> Open source platform under Creative Commons licensing with 
                  privacy-by-design principles and encrypted personal data.
                </p>
                <p>
                  <strong>Age Limits:</strong> 2-year age matching limits, parental oversight for minors, 
                  and educational content appropriate for developmental stages.
                </p>
              </div>
            </div>

            {consentDetails.consentType === 'full_platform_access' && (
              <Alert>
                <Lock className="h-4 w-4" />
                <AlertDescription>
                  <strong>Full Platform Access</strong> includes relationship matching, sexual health tracking, 
                  cooperative financial features, and community participation. All activities are monitored 
                  for safety compliance with built-in protections for minors.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Response Actions */}
        {consentDetails.status === 'pending' && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Respond to Request</CardTitle>
              <CardDescription>
                Approve or deny your child's access to the requested platform features
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!showApprovalForm ? (
                <div className="flex gap-4 justify-center">
                  <Button
                    onClick={() => {
                      responseForm.setValue('approved', true);
                      setShowApprovalForm(true);
                    }}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve Request
                  </Button>
                  <Button
                    onClick={() => {
                      responseForm.setValue('approved', false);
                      setShowApprovalForm(true);
                    }}
                    variant="outline"
                    className="border-red-300 text-red-700 hover:bg-red-50"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Deny Request
                  </Button>
                </div>
              ) : (
                <form 
                  onSubmit={responseForm.handleSubmit((data) => respondToConsentMutation.mutate(data))}
                  className="space-y-4"
                >
                  <div>
                    <Label htmlFor="verificationCode">Verification Code</Label>
                    <Input
                      id="verificationCode"
                      {...responseForm.register('verificationCode')}
                      placeholder="Enter verification code from email"
                      className="font-mono"
                    />
                    {responseForm.formState.errors.verificationCode && (
                      <p className="text-sm text-red-600 mt-1">
                        {responseForm.formState.errors.verificationCode.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="parentSignature">Digital Signature</Label>
                    <Input
                      id="parentSignature"
                      {...responseForm.register('parentSignature')}
                      placeholder="Type your full name as digital signature"
                    />
                    {responseForm.formState.errors.parentSignature && (
                      <p className="text-sm text-red-600 mt-1">
                        {responseForm.formState.errors.parentSignature.message}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="acknowledgment"
                      checked={responseForm.watch('acknowledgment')}
                      onCheckedChange={(checked) => 
                        responseForm.setValue('acknowledgment', checked as boolean)
                      }
                    />
                    <Label htmlFor="acknowledgment" className="text-sm">
                      I acknowledge that I have read and understood the platform features and safety protocols. 
                      I understand this is an open source sexual health education platform designed to promote 
                      safe, consensual relationships with comprehensive safety measures.
                    </Label>
                  </div>
                  {responseForm.formState.errors.acknowledgment && (
                    <p className="text-sm text-red-600">
                      {responseForm.formState.errors.acknowledgment.message}
                    </p>
                  )}

                  <div className="flex gap-4">
                    <Button 
                      type="submit" 
                      disabled={respondToConsentMutation.isPending}
                      className={responseForm.watch('approved') ? 
                        'bg-green-600 hover:bg-green-700' : 
                        'bg-red-600 hover:bg-red-700'
                      }
                    >
                      {respondToConsentMutation.isPending ? (
                        <>
                          <Clock className="h-4 w-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          {responseForm.watch('approved') ? 
                            <CheckCircle className="h-4 w-4 mr-2" /> : 
                            <XCircle className="h-4 w-4 mr-2" />
                          }
                          {responseForm.watch('approved') ? 'Approve' : 'Deny'} Request
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowApprovalForm(false)}
                      disabled={respondToConsentMutation.isPending}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        )}

        {/* Status Message for Completed Requests */}
        {consentDetails.status !== 'pending' && (
          <Card className="mb-6">
            <CardContent className="p-6 text-center">
              {consentDetails.status === 'approved' && (
                <>
                  <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-green-900 mb-2">Consent Approved</h3>
                  <p className="text-green-700">
                    Your child now has access to the requested platform features. 
                    You will receive email updates about their activity and safety compliance.
                  </p>
                </>
              )}
              {consentDetails.status === 'denied' && (
                <>
                  <XCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-red-900 mb-2">Consent Denied</h3>
                  <p className="text-red-700">
                    Access to the requested platform features has been denied. 
                    Your child has been notified of this decision.
                  </p>
                </>
              )}
              {consentDetails.status === 'expired' && (
                <>
                  <Clock className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Request Expired</h3>
                  <p className="text-gray-700">
                    This consent request has expired. Your child will need to submit a new request 
                    if they still wish to access platform features.
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        )}

        {/* Creative Commons Footer */}
        <div className="text-center text-sm text-gray-600 mt-8 pb-8">
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <h4 className="font-medium mb-2">Open Source Parental Consent System</h4>
            <p className="mb-2">
              This consent system prioritizes family safety and transparency in youth online experiences.
              All code and processes are open source under Creative Commons licensing.
            </p>
            <div className="flex justify-center items-center gap-4 text-xs">
              <a href="https://github.com/trisex/parental-consent" className="text-blue-600 hover:underline">
                View Source Code
              </a>
              <span>•</span>
              <a href="https://creativecommons.org/licenses/by-sa/4.0/" className="text-blue-600 hover:underline">
                CC BY-SA 4.0 License
              </a>
              <span>•</span>
              <a href="/family-safety" className="text-blue-600 hover:underline">
                Family Safety Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}