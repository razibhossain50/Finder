'use client';
import { useStepForm } from "@/hooks/use-step-form";
import { StepIndicator } from "@/components/profile/marriage/step-indicator";
import { PersonalInfoStep } from "@/components/profile/marriage/personal-info-step";
import { EducationalInfoStep } from "@/components/profile/marriage/educational-info-step";
import { FamilyInfoStep } from "@/components/profile/marriage/family-info-step";
import { ContactInfoStep } from "@/components/profile/marriage/contact-info-step";
import { PartnerPreferencesStep } from "@/components/profile/marriage/partner-preferences-step";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useRef, useEffect, useCallback } from "react";

const steps = [
  { title: "Personal Information", subtitle: "Basic details about you" },
  { title: "Educational Information", subtitle: "Your academic background" },
  { title: "Family Information", subtitle: "About your family" },
  { title: "Desired Life Partner", subtitle: "Partner preferences" },
  { title: "Contact Information", subtitle: "Final details" },
];

export default function ProfileMarriage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const biodataIdRef = useRef<number | null>(null);
  
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
    loadFormData,
  } = useStepForm(5);

  // Query to fetch existing biodata
  const { data: existingBiodata, isLoading } = useQuery({
    queryKey: ['biodata'],
    queryFn: async () => {
      try {
        const response = await apiRequest("GET", "/api/biodatas/current");
        if (response.ok) {
          const data = await response.json();
          return data;
        }
        return null;
      } catch (error) {
        return null;
      }
    },
  });

  // Load existing data when component mounts
  useEffect(() => {
    if (existingBiodata) {
      biodataIdRef.current = existingBiodata.id;
      loadFormData(existingBiodata);
    }
  }, [existingBiodata, loadFormData]);

  // Mutation for saving step data
  const saveStepMutation = useMutation({
    mutationFn: async ({ stepData, step }: { stepData: any; step: number }) => {
      const currentCompletedSteps = existingBiodata?.completedSteps || [];
      const updatedCompletedSteps = currentCompletedSteps.includes(step) 
        ? currentCompletedSteps 
        : [...currentCompletedSteps, step];

      // Always use the current endpoint for user-specific operations
      const response = await apiRequest("PUT", "/api/biodatas/current", {
        ...stepData,
        step,
        completedSteps: updatedCompletedSteps,
      });
      
      const result = await response.json();
      if (!biodataIdRef.current && result.id) {
        biodataIdRef.current = result.id;
      }
      return result;
    },
    onSuccess: () => {
      // Invalidate and refetch biodata to update completed steps
      queryClient.invalidateQueries({ queryKey: ['biodata'] });
      toast({
        title: "Progress Saved",
        description: "Your information has been saved successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Save Error",
        description: error.message || "Failed to save your progress. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Final submission mutation
  const submitMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("PUT", "/api/biodatas/current", {
        ...data,
        status: 'completed',
        completedSteps: [1, 2, 3, 4, 5], // Mark all steps as completed
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Your biodata has been submitted successfully.",
      });
    },
    onError: (error: unknown) => {
      toast({
        title: "Error",
        description: error.message || "Failed to submit biodata. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleNext = async () => {
    const isValid = validateCurrentStep();
    if (!isValid) return;

    // Save current step data
    try {
      await saveStepMutation.mutateAsync({
        stepData: formData,
        step: currentStep,
      });
      nextStep();
    } catch (error) {
      // Error is handled by the mutation's onError
    }
  };

  const handleSubmit = async () => {
    const isValid = validateCurrentStep();
    if (!isValid) return;

    try {
      await submitMutation.mutateAsync(formData);
    } catch (error) {
      // Error is handled by the mutation's onError
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
          completedSteps={existingBiodata?.completedSteps || []}
          className="mb-8"
        />

        {/* Form Content */}
        <Card className="shadow-sm inset-shadow-slate-500 border-green-50">
          <CardContent className="p-6 md:p-8">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-slate-600">Loading your biodata...</p>
                </div>
              </div>
            ) : (
              renderCurrentStep()
            )}

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
                  disabled={submitMutation.isPending || saveStepMutation.isPending}
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
                  disabled={saveStepMutation.isPending}
                  className="flex items-center gap-2"
                >
                  {saveStepMutation.isPending ? "Saving..." : "Next"}
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
