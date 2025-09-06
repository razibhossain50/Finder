import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface Step {
  title: string;
  subtitle: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
  completedSteps?: number[] | string[] | string | number;
  className?: string;
  onStepClick?: (stepNumber: number) => void;
}

export function StepIndicator({ steps, currentStep, completedSteps = [], className, onStepClick }: StepIndicatorProps) {
  console.log('🎯 StepIndicator rendered with:', { currentStep, completedSteps });
  const currentStepInfo = steps[currentStep - 1];
  
  // Ensure completedSteps is always an array of numbers in correct order
  const parseCompletedSteps = (steps: any): number[] => {
    if (!steps) return [];
    let result: number[] = [];
    
    if (Array.isArray(steps)) {
      // Handle array of strings or numbers
      result = steps.map(s => {
        const num = typeof s === 'string' ? parseInt(s) : s;
        return isNaN(num) ? null : num;
      }).filter(n => n !== null) as number[];
    } else if (typeof steps === 'string') {
      try {
        const parsed = JSON.parse(steps);
        if (Array.isArray(parsed)) {
          result = parsed.map(s => {
            const num = typeof s === 'string' ? parseInt(s) : s;
            return isNaN(num) ? null : num;
          }).filter(n => n !== null) as number[];
        }
      } catch (e) {
        result = steps.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
      }
    } else if (typeof steps === 'number') {
      result = [steps];
    }
    
    // Always sort the result to ensure correct order
    return result.sort((a, b) => a - b);
  };
  
  const parsedCompletedSteps = parseCompletedSteps(completedSteps);

  return (
    <div className={cn("w-full", className)}>

      {/* Current Step Information - Centered and Dynamic */}
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-blue-600 mb-1">
          {currentStepInfo?.title}
        </h3>
        <p className="text-sm text-gray-600">
          {currentStepInfo?.subtitle}
        </p>
      </div>

      {/* Horizontal Step Progress */}
      <div className="flex items-center justify-center mb-8">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = parsedCompletedSteps.includes(stepNumber);
          const isClickable = (isCompleted || stepNumber === currentStep) && onStepClick;

          const handleStepClick = () => {
            if (isClickable) {
              onStepClick(stepNumber);
            }
          };

          return (
            <div key={index} className="flex items-center">
              {/* Step Circle */}
              <div
                className={cn(
                  "flex w-7 md:w-10 h-7 md:h-10 items-center justify-center rounded-full text-sm font-medium transition-all duration-200",
                  isActive && isCompleted && "bg-blue-600 text-white shadow-lg",
                  isActive && !isCompleted && "bg-blue-600 text-white shadow-lg",
                  !isActive && isCompleted && "bg-green-600 text-white",
                  !isActive && !isCompleted && "bg-white text-gray-400 border-2 border-gray-300",
                  isClickable && "cursor-pointer hover:bg-green-700 hover:scale-105 hover:shadow-md",
                  !isClickable && !isActive && "cursor-default",
                  isClickable && !isActive && "ring-2 ring-green-200 ring-opacity-50"
                )}
                onClick={handleStepClick}
                title={isClickable ? `Click to go to ${step.title}` : isCompleted ? `${step.title} (Completed)` : `${step.title} (Complete previous steps first)`}
              >
                {(isActive && isCompleted) ? (
                  <Check className="h-5 w-5" />
                ) : isCompleted ? (
                  <Check className="h-5 w-5" />
                ) : (
                  stepNumber
                )}
              </div>

                  {/* Connecting Line */}
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "h-0.5 w-4 md:w-16 lg:w-20 mx-2 transition-colors duration-200",
                    parsedCompletedSteps.includes(stepNumber + 1) ? "bg-green-600" : "bg-gray-300"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>


    </div>
  );
}
