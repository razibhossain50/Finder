'use client';
import { useStepForm } from "@/hooks/use-step-form";
import { StepIndicator } from "@/components/form/step-form/step-indicator";
import { PersonalInfoStep } from "@/components/form/step-form/personal-info-step";
import { EducationalInfoStep } from "@/components/form/step-form/educational-info-step";
import { FamilyInfoStep } from "@/components/form/step-form/family-info-step";
import { ContactInfoStep } from "@/components/form/step-form/contact-info-step";
import { PartnerPreferencesStep } from "@/components/form/step-form/partner-preferences-step";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useRef } from "react";

const steps = [
  { title: "Personal Information", subtitle: "Basic details about you" },
  { title: "Educational Information", subtitle: "Your academic background" },
  { title: "Family Information", subtitle: "About your family" },
  { title: "Desired Life Partner", subtitle: "Partner preferences" },
  { title: "Contact Information", subtitle: "Final details" },
];

export default function ProfileMarriage() {
  const { toast } = useToast();
  const {
    currentStep,
    formData,
    errors,
    nextStep,
    prevStep,
    updateFormData,
    validateCurrentStep,
    isLastStep,
    isFirstStep,
  } = useStepForm(5);

  const submitMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/biodatas", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Your biodata has been submitted successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description:
          error.message || "Failed to submit biodata. Please try again.",
        variant: "destructive",
      });
    },
  });

  const biodataIdRef = useRef<number | null>(null);

  const handleNext = async () => {
    const isValid = validateCurrentStep();
    if (!isValid) return;

    if (currentStep === 1) {
      // First step: create biodata
      const response = await apiRequest("POST", "/api/biodatas", {
        ...formData,
        step: currentStep,
      });
      const result = await response.json();
      biodataIdRef.current = result.id;
    } else {
      // Update biodata for subsequent steps
      if (biodataIdRef.current) {
        await apiRequest("PUT", `/api/biodatas/${biodataIdRef.current}/step/${currentStep}`, {
          ...formData,
          step: currentStep,
        });
      }
    }
    nextStep();
  };

  const handleSubmit = async () => {
    if (validateCurrentStep() && biodataIdRef.current) {
      await apiRequest("PUT", `/api/biodatas/${biodataIdRef.current}/step/${currentStep}`, {
        ...formData,
        step: currentStep,
      });
      submitMutation.mutate(formData);
      console.log("Submited form data:", formData);
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <PersonalInfoStep
            data={formData}
            errors={errors}
            updateData={updateFormData}
          />
        );
      case 2:
        return (
          <EducationalInfoStep
            data={formData}
            errors={errors}
            updateData={updateFormData}
          />
        );
      case 3:
        return (
          <FamilyInfoStep
            data={formData}
            errors={errors}
            updateData={updateFormData}
          />
        );
      case 4:
        return (
          <PartnerPreferencesStep
            data={formData}
            errors={errors}
            updateData={updateFormData}
          />
        );
      case 5:
        return (
          <ContactInfoStep
            data={formData}
            errors={errors}
            updateData={updateFormData}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Modern Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Create Your Biodata
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Fill out your information step by step to create a complete and
            beautiful profile
          </p>
        </div>

        {/* Step Indicator */}
        <StepIndicator
          steps={steps}
          currentStep={currentStep}
          className="mb-8"
        />

        {/* Form Content */}
        <Card className="shadow-sm inset-shadow-slate-500 border-green-50">
          <CardContent className="p-6 md:p-8">
            {renderCurrentStep()}

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center pt-6 border-t border-slate-200 mt-8">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={isFirstStep}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>

              <div className="text-sm text-slate-500">
                Step {currentStep} of {steps.length}
              </div>

              {isLastStep ? (
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitMutation.isPending}
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700"
                >
                  <Check className="w-4 h-4" />
                  {submitMutation.isPending
                    ? "Submitting..."
                    : "Submit Biodata"}
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleNext}
                  className="flex items-center gap-2"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
