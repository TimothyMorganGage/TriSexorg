import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Handshake, Send, Phone, CheckCircle, 
  Hospital, Building, Users, Stethoscope 
} from "lucide-react";

const partnershipSchema = z.object({
  organizationName: z.string().min(1, "Organization name is required"),
  organizationType: z.string().min(1, "Organization type is required"),
  contactName: z.string().min(1, "Contact name is required"),
  title: z.string().min(1, "Title/role is required"),
  email: z.string().email("Valid email address is required"),
  phone: z.string().optional(),
  interests: z.array(z.string()).min(1, "Please select at least one partnership interest"),
  additionalInfo: z.string().optional(),
  agreeToTerms: z.boolean().refine((value) => value, {
    message: "You must agree to the privacy policy and terms of service",
  }),
});

type PartnershipFormData = z.infer<typeof partnershipSchema>;

export default function Partnership() {
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<PartnershipFormData>({
    resolver: zodResolver(partnershipSchema),
    defaultValues: {
      organizationName: "",
      organizationType: "",
      contactName: "",
      title: "",
      email: "",
      phone: "",
      interests: [],
      additionalInfo: "",
      agreeToTerms: false,
    },
  });

  const partnershipMutation = useMutation({
    mutationFn: async (data: Omit<PartnershipFormData, "agreeToTerms">) => {
      const response = await apiRequest("POST", "/api/partnerships", data);
      return response.json();
    },
    onSuccess: () => {
      setIsSubmitted(true);
      toast({
        title: "Partnership Request Submitted",
        description: "Thank you for your interest! We will contact you within 24 hours.",
      });
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Submission Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: PartnershipFormData) => {
    const { agreeToTerms, ...partnershipData } = data;
    partnershipMutation.mutate(partnershipData);
  };

  const organizationTypes = [
    "Healthcare Clinic",
    "Hospital System",
    "Private Practice",
    "Community Health Center",
    "LGBTQ+ Center",
    "Retail Pharmacy",
    "Educational Institution",
    "Research Organization",
    "Other",
  ];

  const interestOptions = [
    { id: "product_distribution", label: "Product distribution" },
    { id: "educational_programs", label: "Educational programs" },
    { id: "research_collaboration", label: "Research collaboration" },
    { id: "technology_integration", label: "Technology integration" },
  ];

  const benefits = [
    {
      icon: Hospital,
      title: "Comprehensive Support",
      description: "Full training, onboarding, and ongoing technical support for your team.",
    },
    {
      icon: Users,
      title: "Patient-Centered Care",
      description: "Offer personalized solutions that improve patient satisfaction and outcomes.",
    },
    {
      icon: Building,
      title: "Revenue Growth",
      description: "New revenue streams with high-margin custom products and services.",
    },
    {
      icon: Stethoscope,
      title: "Clinical Excellence",
      description: "Access to cutting-edge 3D printing technology and sustainable materials.",
    },
  ];

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-surface py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="text-center">
            <CardContent className="p-12">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-neutral mb-4">
                Thank You for Your Interest!
              </h2>
              <p className="text-xl text-gray-600 mb-6">
                Your partnership request has been submitted successfully. Our team will review your 
                application and contact you within 24 hours to discuss next steps.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={() => setIsSubmitted(false)}>
                  Submit Another Request
                </Button>
                <Button variant="outline" asChild>
                  <a href="/clinics">Learn More About Our Platform</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      {/* Hero Section */}
      <section className="gradient-hero text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <Handshake className="h-16 w-16 mx-auto mb-6 text-accent" />
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Partner With Us
            </h1>
            <p className="text-xl lg:text-2xl text-blue-100 mb-8">
              Join our network of healthcare providers committed to inclusive, 
              personalized protection solutions
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-neutral mb-4">
              Why Partner with CustomFit Health?
            </h2>
            <p className="text-xl text-gray-600">
              Join the future of personalized healthcare solutions
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{benefit.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{benefit.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Partnership Form */}
      <section className="py-20 bg-surface">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-neutral mb-4">
              Start Your Partnership Journey
            </h2>
            <p className="text-xl text-gray-600">
              Complete the form below and our team will contact you within 24 hours
            </p>
          </div>
          
          <Card className="shadow-xl">
            <CardContent className="p-8 lg:p-12">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="organizationName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Organization Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="Your clinic or organization name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="organizationType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Organization Type *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select organization type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {organizationTypes.map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="contactName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="Your full name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title/Role *</FormLabel>
                          <FormControl>
                            <Input placeholder="Your role or title" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address *</FormLabel>
                          <FormControl>
                            <Input 
                              type="email" 
                              placeholder="your.email@organization.com" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input 
                              type="tel" 
                              placeholder="(555) 123-4567" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="interests"
                    render={() => (
                      <FormItem>
                        <FormLabel>Partnership Interests *</FormLabel>
                        <div className="grid md:grid-cols-2 gap-4">
                          {interestOptions.map((option) => (
                            <FormField
                              key={option.id}
                              control={form.control}
                              name="interests"
                              render={({ field }) => {
                                return (
                                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(option.id)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...field.value, option.id])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) => value !== option.id
                                                )
                                              );
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      {option.label}
                                    </FormLabel>
                                  </FormItem>
                                );
                              }}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="additionalInfo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Additional Information</FormLabel>
                        <FormControl>
                          <Textarea
                            rows={4}
                            placeholder="Tell us more about your organization and how you'd like to partner with CustomFit Health..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="agreeToTerms"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-sm">
                            I agree to the privacy policy and terms of service for healthcare partnerships *
                          </FormLabel>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button 
                      type="submit" 
                      disabled={partnershipMutation.isPending}
                      className="flex-1"
                    >
                      <Send className="mr-2 h-4 w-4" />
                      {partnershipMutation.isPending ? "Submitting..." : "Submit Partnership Request"}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        // This would typically open a scheduling modal or redirect to a booking page
                        toast({
                          title: "Schedule a Call",
                          description: "Our team will contact you to schedule a consultation call.",
                        });
                      }}
                    >
                      <Phone className="mr-2 h-4 w-4" />
                      Schedule a Call
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-neutral mb-4">
              What Happens Next?
            </h2>
            <p className="text-xl text-gray-600">
              Our simple partnership onboarding process
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-8">
              <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold text-neutral mb-4">
                Application Review
              </h3>
              <p className="text-gray-600">
                Our team reviews your application and schedules an initial consultation 
                call within 24 hours.
              </p>
            </Card>

            <Card className="text-center p-8">
              <div className="w-12 h-12 bg-secondary text-white rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold text-neutral mb-4">
                Training & Onboarding
              </h3>
              <p className="text-gray-600">
                Comprehensive training on our platform, products, and patient 
                consultation processes.
              </p>
            </Card>

            <Card className="text-center p-8">
              <div className="w-12 h-12 bg-accent text-white rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold text-neutral mb-4">
                Launch & Support
              </h3>
              <p className="text-gray-600">
                Begin serving patients with our personalized protection solutions 
                and ongoing support.
              </p>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
