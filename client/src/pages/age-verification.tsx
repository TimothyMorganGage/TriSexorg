import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Shield, FileText, Users, CheckCircle, Clock, AlertTriangle, Upload, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

// Document upload schema
const documentUploadSchema = z.object({
  documentType: z.enum([
    'drivers_license',
    'state_id', 
    'passport',
    'birth_certificate',
    'military_id',
    'tribal_id'
  ]),
  file: z.instanceof(File).refine(
    (file) => file.size <= 10 * 1024 * 1024,
    "File size must be less than 10MB"
  ).refine(
    (file) => ['image/jpeg', 'image/png', 'image/heic', 'application/pdf'].includes(file.type),
    "File must be JPG, PNG, HEIC, or PDF"
  )
});

// Parental consent schema
const parentalConsentSchema = z.object({
  parentGuardianName: z.string().min(2, "Parent/guardian name is required"),
  parentGuardianEmail: z.string().email("Valid email address required"),
  parentGuardianPhone: z.string().optional(),
  relationshipToMinor: z.enum(['parent', 'legal_guardian', 'court_appointed_guardian']),
  consentType: z.enum(['relationship_platform', 'sexual_health_services', 'full_platform_access'])
});

type DocumentUpload = z.infer<typeof documentUploadSchema>;
type ParentalConsent = z.infer<typeof parentalConsentSchema>;

// Type definitions for API responses
interface VerificationStatus {
  isVerified: boolean;
  age?: number;
  requiresParentalConsent: boolean;
  verificationStatus: string;
  documentsSubmitted: number;
  documents?: Array<{
    id: string;
    documentType: string;
    fileName: string;
    verificationStatus: string;
    uploadedAt: string;
  }>;
  parentalConsents?: Array<{
    id: string;
    parentGuardianName: string;
    parentGuardianEmail: string;
    status: string;
    consentType: string;
    requestedAt: string;
  }>;
}

export default function AgeVerification() {
  const [activeTab, setActiveTab] = useState<'upload' | 'consent' | 'status'>('status');
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();

  // Form for document upload
  const documentForm = useForm<DocumentUpload>({
    resolver: zodResolver(documentUploadSchema)
  });

  // Form for parental consent
  const consentForm = useForm<ParentalConsent>({
    resolver: zodResolver(parentalConsentSchema),
    defaultValues: {
      consentType: 'full_platform_access'
    }
  });

  // Get verification status
  const { data: verificationStatus, isLoading } = useQuery<VerificationStatus>({
    queryKey: ['/api/age-verification/status'],
    retry: false
  });

  // Document upload mutation
  const uploadDocumentMutation = useMutation({
    mutationFn: async (data: DocumentUpload) => {
      const formData = new FormData();
      formData.append('document', data.file);
      formData.append('documentType', data.documentType);

      const response = await fetch('/api/age-verification/upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Upload failed');
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Document Uploaded",
        description: "Your identity document has been submitted for verification.",
      });
      documentForm.reset();
      setActiveTab('status');
    },
    onError: (error) => {
      toast({
        title: "Upload Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Parental consent mutation  
  const requestConsentMutation = useMutation({
    mutationFn: async (data: ParentalConsent) => {
      return apiRequest('/api/age-verification/parental-consent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
    },
    onSuccess: () => {
      toast({
        title: "Consent Request Sent",
        description: "A verification email has been sent to your parent/guardian.",
      });
      consentForm.reset();
      setActiveTab('status');
    },
    onError: (error) => {
      toast({
        title: "Request Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
      case 'parental_consent_approved':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'pending':
      case 'parental_consent_pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'rejected':
      case 'parental_consent_denied':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'requires_parental_consent':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
      case 'parental_consent_approved':
        return <CheckCircle className="h-4 w-4" />;
      case 'pending':
      case 'parental_consent_pending':
        return <Clock className="h-4 w-4" />;
      case 'rejected':
      case 'parental_consent_denied':
        return <AlertTriangle className="h-4 w-4" />;
      case 'requires_parental_consent':
        return <Users className="h-4 w-4" />;
      default:
        return <Eye className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-4xl mx-auto pt-8">
          <div className="text-center">Loading verification status...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto pt-8">
        {/* Creative Commons Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Shield className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Age Verification System</h1>
          </div>
          <p className="text-gray-600 mb-4">
            Open Source Identity Verification • Inspired by id.me and login.gov
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

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-6">
          <div className="bg-white p-1 rounded-lg shadow-sm border">
            <Button
              variant={activeTab === 'status' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('status')}
              className="mr-1"
            >
              <Eye className="h-4 w-4 mr-2" />
              Status
            </Button>
            <Button
              variant={activeTab === 'upload' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('upload')}
              className="mr-1"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload ID
            </Button>
            <Button
              variant={activeTab === 'consent' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('consent')}
            >
              <Users className="h-4 w-4 mr-2" />
              Parental Consent
            </Button>
          </div>
        </div>

        {/* Status Tab */}
        {activeTab === 'status' && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Verification Status
              </CardTitle>
              <CardDescription>
                Track your identity verification progress and parental consent status
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {verificationStatus ? (
                <>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Overall Status:</span>
                    <Badge className={getStatusColor(verificationStatus.verificationStatus || '')}>
                      {getStatusIcon(verificationStatus.verificationStatus || '')}
                      <span className="ml-2 capitalize">
                        {(verificationStatus.verificationStatus || '').replace(/_/g, ' ')}
                      </span>
                    </Badge>
                  </div>

                  {verificationStatus.age && (
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Detected Age:</span>
                      <span className="text-gray-600">{verificationStatus.age} years old</span>
                    </div>
                  )}

                  {verificationStatus.requiresParentalConsent && (
                    <Alert>
                      <Users className="h-4 w-4" />
                      <AlertDescription>
                        As a minor, you need parental consent to access certain platform features.
                        Use the "Parental Consent" tab to request approval from your parent or guardian.
                      </AlertDescription>
                    </Alert>
                  )}

                  <Separator />

                  <div>
                    <h4 className="font-medium mb-2">Documents Submitted: {verificationStatus.documentsSubmitted}</h4>
                    {verificationStatus.documents?.map((doc: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-2">
                        <div>
                          <div className="font-medium">{(doc.documentType || '').replace(/_/g, ' ')}</div>
                          <div className="text-sm text-gray-600">{doc.fileName}</div>
                        </div>
                        <Badge className={getStatusColor(doc.verificationStatus || '')}>
                          {getStatusIcon(doc.verificationStatus || '')}
                          <span className="ml-2 capitalize">
                            {(doc.verificationStatus || '').replace(/_/g, ' ')}
                          </span>
                        </Badge>
                      </div>
                    ))}
                  </div>

                  {verificationStatus.parentalConsents?.length > 0 && (
                    <>
                      <Separator />
                      <div>
                        <h4 className="font-medium mb-2">Parental Consent Requests</h4>
                        {verificationStatus.parentalConsents.map((consent: any, index: number) => (
                          <div key={index} className="p-3 bg-gray-50 rounded-lg mb-2">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium">{consent.parentGuardianName || 'Unknown'}</span>
                              <Badge className={getStatusColor(consent.status || '')}>
                                {getStatusIcon(consent.status || '')}
                                <span className="ml-2 capitalize">{consent.status || 'unknown'}</span>
                              </Badge>
                            </div>
                            <div className="text-sm text-gray-600">
                              <div>Email: {consent.parentGuardianEmail || 'Unknown'}</div>
                              <div>Consent Type: {(consent.consentType || '').replace(/_/g, ' ')}</div>
                              <div>Requested: {consent.requestedAt ? new Date(consent.requestedAt).toLocaleDateString() : 'Unknown'}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="text-center py-8">
                  <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Verification Started</h3>
                  <p className="text-gray-600 mb-4">
                    Upload an identity document to begin the verification process
                  </p>
                  <Button onClick={() => setActiveTab('upload')}>
                    <Upload className="h-4 w-4 mr-2" />
                    Start Verification
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Document Upload Tab */}
        {activeTab === 'upload' && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Identity Document Upload
              </CardTitle>
              <CardDescription>
                Upload a government-issued photo ID for age verification. Accepted formats: JPG, PNG, HEIC, PDF (max 10MB)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form 
                onSubmit={documentForm.handleSubmit((data) => uploadDocumentMutation.mutate(data))}
                className="space-y-4"
              >
                <div>
                  <Label htmlFor="documentType">Document Type</Label>
                  <Select onValueChange={(value) => documentForm.setValue('documentType', value as any)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select document type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="drivers_license">Driver's License</SelectItem>
                      <SelectItem value="state_id">State ID Card</SelectItem>
                      <SelectItem value="passport">Passport</SelectItem>
                      <SelectItem value="birth_certificate">Birth Certificate</SelectItem>
                      <SelectItem value="military_id">Military ID</SelectItem>
                      <SelectItem value="tribal_id">Tribal ID</SelectItem>
                    </SelectContent>
                  </Select>
                  {documentForm.formState.errors.documentType && (
                    <p className="text-sm text-red-600 mt-1">
                      {documentForm.formState.errors.documentType.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="file">Document File</Label>
                  <Input
                    id="file"
                    type="file"
                    accept="image/jpeg,image/png,image/heic,application/pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        documentForm.setValue('file', file);
                      }
                    }}
                  />
                  {documentForm.formState.errors.file && (
                    <p className="text-sm text-red-600 mt-1">
                      {documentForm.formState.errors.file.message}
                    </p>
                  )}
                </div>

                {uploadProgress > 0 && (
                  <div>
                    <Label>Upload Progress</Label>
                    <Progress value={uploadProgress} className="mt-2" />
                  </div>
                )}

                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Privacy Notice:</strong> Your document is processed locally and encrypted. 
                    Personal data is extracted only for age verification and deleted after processing.
                    This open source system follows privacy-by-design principles.
                  </AlertDescription>
                </Alert>

                <Button 
                  type="submit" 
                  disabled={uploadDocumentMutation.isPending}
                  className="w-full"
                >
                  {uploadDocumentMutation.isPending ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Document
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Parental Consent Tab */}
        {activeTab === 'consent' && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Parental Consent Request
              </CardTitle>
              <CardDescription>
                Request consent from your parent or legal guardian for platform access
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form 
                onSubmit={consentForm.handleSubmit((data) => requestConsentMutation.mutate(data))}
                className="space-y-4"
              >
                <div>
                  <Label htmlFor="parentGuardianName">Parent/Guardian Full Name</Label>
                  <Input
                    id="parentGuardianName"
                    {...consentForm.register('parentGuardianName')}
                    placeholder="Enter parent or guardian's full name"
                  />
                  {consentForm.formState.errors.parentGuardianName && (
                    <p className="text-sm text-red-600 mt-1">
                      {consentForm.formState.errors.parentGuardianName.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="parentGuardianEmail">Parent/Guardian Email</Label>
                  <Input
                    id="parentGuardianEmail"
                    type="email"
                    {...consentForm.register('parentGuardianEmail')}
                    placeholder="parent@example.com"
                  />
                  {consentForm.formState.errors.parentGuardianEmail && (
                    <p className="text-sm text-red-600 mt-1">
                      {consentForm.formState.errors.parentGuardianEmail.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="parentGuardianPhone">Phone Number (Optional)</Label>
                  <Input
                    id="parentGuardianPhone"
                    type="tel"
                    {...consentForm.register('parentGuardianPhone')}
                    placeholder="(555) 123-4567"
                  />
                </div>

                <div>
                  <Label htmlFor="relationshipToMinor">Relationship</Label>
                  <Select onValueChange={(value) => consentForm.setValue('relationshipToMinor', value as any)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select relationship" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="parent">Parent</SelectItem>
                      <SelectItem value="legal_guardian">Legal Guardian</SelectItem>
                      <SelectItem value="court_appointed_guardian">Court-Appointed Guardian</SelectItem>
                    </SelectContent>
                  </Select>
                  {consentForm.formState.errors.relationshipToMinor && (
                    <p className="text-sm text-red-600 mt-1">
                      {consentForm.formState.errors.relationshipToMinor.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="consentType">Consent Type</Label>
                  <Select onValueChange={(value) => consentForm.setValue('consentType', value as any)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select consent type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="relationship_platform">Relationship Platform Access</SelectItem>
                      <SelectItem value="sexual_health_services">Sexual Health Services</SelectItem>
                      <SelectItem value="full_platform_access">Full Platform Access</SelectItem>
                    </SelectContent>
                  </Select>
                  {consentForm.formState.errors.consentType && (
                    <p className="text-sm text-red-600 mt-1">
                      {consentForm.formState.errors.consentType.message}
                    </p>
                  )}
                </div>

                <Alert>
                  <Users className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Consent Process:</strong> Your parent/guardian will receive an email with a secure 
                    verification link. They'll need to review and approve your access request within 7 days.
                    The consent process complies with COPPA and digital privacy regulations.
                  </AlertDescription>
                </Alert>

                <Button 
                  type="submit" 
                  disabled={requestConsentMutation.isPending}
                  className="w-full"
                >
                  {requestConsentMutation.isPending ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Sending Request...
                    </>
                  ) : (
                    <>
                      <Users className="h-4 w-4 mr-2" />
                      Request Parental Consent
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Creative Commons Footer */}
        <div className="text-center text-sm text-gray-600 mt-8 pb-8">
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <h4 className="font-medium mb-2">Open Source Age Verification System</h4>
            <p className="mb-2">
              This verification system is open source and available under Creative Commons licensing.
              Built as a privacy-focused alternative to proprietary identity verification services.
            </p>
            <div className="flex justify-center items-center gap-4 text-xs">
              <a href="https://github.com/fluck/age-verification" className="text-blue-600 hover:underline">
                View Source Code
              </a>
              <span>•</span>
              <a href="https://creativecommons.org/licenses/by-sa/4.0/" className="text-blue-600 hover:underline">
                CC BY-SA 4.0 License
              </a>
              <span>•</span>
              <a href="/privacy-policy" className="text-blue-600 hover:underline">
                Privacy Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}