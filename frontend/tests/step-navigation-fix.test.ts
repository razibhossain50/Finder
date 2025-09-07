import { renderHook, act } from '@testing-library/react';
import { useStepForm } from '../src/hooks/use-step-form';

describe('Step Navigation Fix', () => {
  const totalSteps = 5;

  it('should maintain navigation capability when going back to earlier steps', () => {
    const { result } = renderHook(() => useStepForm(totalSteps));
    
    // Progress to step 3
    act(() => {
      result.current.nextStep(); // Go to step 2
    });
    act(() => {
      result.current.nextStep(); // Go to step 3
    });
    
    expect(result.current.currentStep).toBe(3);
    expect(result.current.highestStepReached).toBe(3);
    
    // Go back to step 1
    act(() => {
      result.current.goToStep(1);
    });
    
    expect(result.current.currentStep).toBe(1);
    expect(result.current.highestStepReached).toBe(3); // Should remain 3
    
    // Should be able to go directly to step 2 or 3
    act(() => {
      result.current.goToStep(2);
    });
    
    expect(result.current.currentStep).toBe(2);
    expect(result.current.highestStepReached).toBe(3);
    
    // Should be able to go to step 3
    act(() => {
      result.current.goToStep(3);
    });
    
    expect(result.current.currentStep).toBe(3);
    expect(result.current.highestStepReached).toBe(3);
  });

  it('should update highest step reached when progressing to new steps', () => {
    const { result } = renderHook(() => useStepForm(totalSteps));
    
    expect(result.current.highestStepReached).toBe(1);
    
    // Progress through steps
    act(() => {
      result.current.nextStep(); // Go to step 2
    });
    
    expect(result.current.highestStepReached).toBe(2);
    
    act(() => {
      result.current.nextStep(); // Go to step 3
    });
    
    expect(result.current.highestStepReached).toBe(3);
    
    // Go back to step 1
    act(() => {
      result.current.goToStep(1);
    });
    
    expect(result.current.highestStepReached).toBe(3); // Should remain 3
    
    // Progress to a new highest step
    act(() => {
      result.current.goToStep(4);
    });
    
    expect(result.current.highestStepReached).toBe(4); // Should update to 4
  });

  it('should initialize highest step reached from loaded data', () => {
    const { result } = renderHook(() => useStepForm(totalSteps));
    
    // Simulate loading data with completed steps
    const loadData = {
      religion: 'Islam',
      currentStep: 3,
      completedSteps: [1, 2, 3]
    };
    
    act(() => {
      result.current.loadFormData(loadData, false);
    });
    
    expect(result.current.currentStep).toBe(3);
    expect(result.current.highestStepReached).toBe(3);
  });
});
