'use client';
import { useStepForm } from "@/hooks/use-step-form";
import { StepIndicator } from "@/components/profile/marriage/step-indicator";
import { PersonalInfoStep } from "@/components/profile/marriage/personal-info-step";
import { EducationalInfoStep } from "@/components/profile/marriage/educational-info-step";
import { FamilyInfoStep } from "@/components/profile/marriage/family-info-step";
import { ContactInfoStep } from "@/components/profile/marriage/contact-info-step";
import { PartnerPreferencesStep } from "@/components/profile/marriage/partner-preferences-step";
import { Button, Card, CardBody, addToast } from "@heroui/react";
import { ChevronLeft, ChevronRight, Check, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useRef, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

const steps = [
    { title: "Personal Information", subtitle: "Basic details about you" },
    { title: "Educational Information", subtitle: "Your academic background" },
    { title: "Family Information", subtitle: "About your family" },
    { title: "Desired Life Partner", subtitle: "Partner preferences" },
    { title: "Contact Information", subtitle: "Final details" },
];

export default function BiodataForm() {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const router = useRouter();
    const params = useParams();
    const biodataId = params.id as string;
    const biodataIdRef = useRef<number | null>(null);

    // Check if this is create mode (id = "new") or edit mode (id = actual ID)
    const isCreateMode = biodataId === "new";

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

    // Query to fetch existing biodata for editing
    const { data: existingBiodata, isLoading, error } = useQuery({
        queryKey: ['biodata', biodataId],
        queryFn: async () => {
            const token = localStorage.getItem('regular_access_token');
            if (!token) {
                throw new Error('Authentication required');
            }

            if (isCreateMode) {
                // For create mode, try to fetch current user's biodata to see if they already have one
                try {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/biodatas/current`, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                        }
                    });

                    if (response.ok) {
                        const data = await response.json();
                        // If user already has biodata, redirect to edit mode
                        if (data && data.id) {
                            router.replace(`/profile/biodatas/edit/${data.id}`);
                            return null;
                        }
                    }
                    return null; // No existing biodata, proceed with create
                } catch (error) {
                    return null; // Error fetching, proceed with create
                }
            } else {
                // Edit mode - fetch specific biodata by ID
                try {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/biodatas/${biodataId}`, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                        }
                    });

                    if (!response.ok) {
                        throw new Error('Failed to fetch biodata');
                    }

                    const data = await response.json();
                    return data;
                } catch (error) {
                    throw new Error('Failed to load biodata for editing');
                }
            }
        },
        enabled: !!biodataId,
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
        mutationFn: async ({ stepData, step }: { stepData: unknown; step: number }) => {
            if (isCreateMode) {
                // Create mode - use POST to create new biodata
                const response = await apiRequest("POST", "/api/biodatas", {
                    ...stepData,
                    step,
                    completedSteps: [step],
                });

                const result = await response.json();
                if (!biodataIdRef.current && result.id) {
                    biodataIdRef.current = result.id;
                }
                return result;
            } else {
                // Edit mode - use PUT to update existing biodata
                const currentCompletedSteps = existingBiodata?.completedSteps || [];
                const updatedCompletedSteps = currentCompletedSteps.includes(step)
                    ? currentCompletedSteps
                    : [...currentCompletedSteps, step];

                const response = await apiRequest("PATCH", `/api/biodatas/${biodataId}`, {
                    ...stepData,
                    step,
                    completedSteps: updatedCompletedSteps,
                });

                return response.json();
            }
        },
        onSuccess: () => {
            // Invalidate and refetch biodata to update completed steps
            queryClient.invalidateQueries({ queryKey: ['biodata', biodataId] });
            toast({
                title: "Progress Saved",
                description: "Your changes have been saved successfully.",
            });
        },
        onError: (error: unknown) => {
            toast({
                title: "Save Error",
                description: error.message || "Failed to save your changes. Please try again.",
                variant: "destructive",
            });
        },
    });

    // Final submission mutation
    const submitMutation = useMutation({
        mutationFn: async (data: unknown) => {
            console.log("submitMutation.mutationFn called with:", data); // Debug log
            if (isCreateMode) {
                console.log("Create mode - sending POST request"); // Debug log
                // Create mode - use POST to create new biodata
                const response = await apiRequest("POST", "/api/biodatas", {
                    ...data,
                    status: 'completed',
                    completedSteps: [1, 2, 3, 4, 5], // Mark all steps as completed
                });
                const result = await response.json();
                console.log("Create response:", result); // Debug log
                return result;
            } else {
                console.log("Edit mode - sending PATCH request"); // Debug log
                // Edit mode - use PUT to update existing biodata
                const response = await apiRequest("PATCH", `/api/biodatas/${biodataId}`, {
                    ...data,
                    status: 'completed',
                    completedSteps: [1, 2, 3, 4, 5], // Mark all steps as completed
                });
                const result = await response.json();
                console.log("Update response:", result); // Debug log
                return result;
            }
        },
        onSuccess: (data) => {
            console.log("submitMutation.onSuccess called with:", data); // Debug log

            // Show HeroUI success toast
            addToast({
                title: "Your biodata submitted successfully!",
                description: isCreateMode
                    ? "Your biodata has been created and submitted successfully."
                    : "Your biodata has been updated and submitted successfully.",
                color: "success",
            });
            console.log("HeroUI success toast displayed"); // Debug log

            // Redirect to the biodata view page after successful create/update
            setTimeout(() => {
                const targetId = isCreateMode ? (data.id || biodataIdRef.current) : biodataId;
                console.log("Redirecting to:", `/profile/biodatas/${targetId}`); // Debug log
                router.push(`/profile/biodatas/${targetId}`);
            }, 2000);
        },
        onError: (error: unknown) => {
            console.error("submitMutation.onError called with:", error); // Debug log
            toast({
                title: "Error",
                description: (error as Error)?.message ||
                    (isCreateMode ? "Failed to create biodata. Please try again." : "Failed to update biodata. Please try again."),
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
        console.log("handleSubmit called"); // Debug log
        const isValid = validateCurrentStep();
        if (!isValid) {
            console.log("Validation failed"); // Debug log
            return;
        }

        console.log("Starting submission with data:", formData); // Debug log
        try {
            await submitMutation.mutateAsync(formData);
        } catch (error) {
            console.error("Submission error:", error); // Debug log
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

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
                <Card className="max-w-md mx-auto">
                    <CardBody className="p-8 text-center">
                        <div className="text-red-500 mb-4">
                            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Biodata</h2>
                        <p className="text-gray-600 mb-6">
                            {(error as Error)?.message || "Failed to load biodata for editing"}
                        </p>
                        <div className="space-y-3">
                            <Button onClick={() => window.location.reload()} className="w-full">
                                Try Again
                            </Button>
                            <Button variant="bordered" as={Link} href="/profile/biodatas" className="w-full">
                                Back to Profiles
                            </Button>
                        </div>
                    </CardBody>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Back Button */}
                <div className="mb-6">
                    <Button
                        variant="bordered"
                        as={Link}
                        href={isCreateMode ? "/profile/biodatas" : `/profile/biodatas/${biodataId}`}
                        startContent={<ArrowLeft className="w-4 h-4" />}
                    >
                        {isCreateMode ? "Back to Profiles" : "Back to Profile"}
                    </Button>
                </div>

                {/* Modern Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        {isCreateMode ? "Create Your Biodata" : "Edit Your Biodata"}
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        {isCreateMode
                            ? "Fill out your information step by step to create a complete and beautiful profile"
                            : "Update your information to keep your profile current and attractive"
                        }
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
                <Card className="shadow-sm">
                    <CardBody className="p-6 md:p-8">
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
                                variant="bordered"
                                onClick={prevStep}
                                isDisabled={isFirstStep}
                                startContent={<ChevronLeft className="w-4 h-4" />}
                            >
                                Previous
                            </Button>

                            <div className="text-sm text-slate-500">
                                Step {currentStep} of {steps.length}
                            </div>

                            {isLastStep ? (
                                <Button
                                    color="success"
                                    onClick={handleSubmit}
                                    isDisabled={submitMutation.isPending || saveStepMutation.isPending}
                                    startContent={<Check className="w-4 h-4" />}
                                >
                                    {submitMutation.isPending
                                        ? (isCreateMode ? "Creating..." : "Updating...")
                                        : (isCreateMode ? "Create Biodata" : "Update Biodata")}
                                </Button>
                            ) : (
                                <Button
                                    color="primary"
                                    onClick={handleNext}
                                    isDisabled={saveStepMutation.isPending}
                                    endContent={<ChevronRight className="w-4 h-4" />}
                                >
                                    {saveStepMutation.isPending ? "Saving..." : "Next"}
                                </Button>
                            )}
                        </div>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
}