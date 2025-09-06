import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { StepIndicator } from '../../frontend/src/components/profile/marriage/step-indicator';

const mockSteps = [
  { title: 'Personal Information', subtitle: 'Basic details about you' },
  { title: 'Educational Information', subtitle: 'Your academic background' },
  { title: 'Family Information', subtitle: 'About your family' },
  { title: 'Partner Preferences', subtitle: 'Partner preferences' },
  { title: 'Contact Information', subtitle: 'Final details' },
];

describe('StepIndicator', () => {
  it('should render all steps', () => {
    render(
      <StepIndicator
        steps={mockSteps}
        currentStep={1}
        completedSteps={[]}
      />
    );
    
    // Only the current step title is shown in the header
    expect(screen.getByText('Personal Information')).toBeInTheDocument();
    
    // All step numbers should be visible
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('should show current step title and subtitle', () => {
    render(
      <StepIndicator
        steps={mockSteps}
        currentStep={2}
        completedSteps={[1]}
      />
    );
    
    expect(screen.getByText('Educational Information')).toBeInTheDocument();
    expect(screen.getByText('Your academic background')).toBeInTheDocument();
  });

  it('should show step numbers correctly', () => {
    render(
      <StepIndicator
        steps={mockSteps}
        currentStep={3}
        completedSteps={[1, 2]}
      />
    );
    
    // Check that step numbers are displayed for non-completed steps
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    
    // Check that completed steps show checkmarks (not numbers)
    const checkmarks = screen.getAllByTitle(/Completed/);
    expect(checkmarks.length).toBe(2);
  });

  it('should call onStepClick when step is clicked', () => {
    const mockOnStepClick = jest.fn();
    
    render(
      <StepIndicator
        steps={mockSteps}
        currentStep={2}
        completedSteps={[1]}
        onStepClick={mockOnStepClick}
      />
    );
    
    // Click on step 1 (completed step) - it shows a checkmark, so we need to find it by title
    const step1 = screen.getByTitle('Click to go to Personal Information');
    fireEvent.click(step1);
    
    expect(mockOnStepClick).toHaveBeenCalledWith(1);
  });

  it('should not call onStepClick for incomplete steps', () => {
    const mockOnStepClick = jest.fn();
    
    render(
      <StepIndicator
        steps={mockSteps}
        currentStep={2}
        completedSteps={[1]}
        onStepClick={mockOnStepClick}
      />
    );
    
    // Try to click on step 3 (incomplete step)
    const step3 = screen.getByTitle('Family Information (Complete previous steps first)');
    fireEvent.click(step3);
    
    expect(mockOnStepClick).not.toHaveBeenCalled();
  });

  it('should handle completedSteps as array of numbers', () => {
    render(
      <StepIndicator
        steps={mockSteps}
        currentStep={3}
        completedSteps={[1, 2]}
      />
    );
    
    // Step 1 and 2 should show as completed (with checkmarks)
    const step1 = screen.getByTitle('Personal Information (Completed)').closest('div');
    const step2 = screen.getByTitle('Educational Information (Completed)').closest('div');
    
    expect(step1).toHaveClass('bg-green-600');
    expect(step2).toHaveClass('bg-green-600');
  });

  it('should handle completedSteps as array of strings', () => {
    render(
      <StepIndicator
        steps={mockSteps}
        currentStep={3}
        completedSteps={['1', '2']}
      />
    );
    
    // Step 1 and 2 should show as completed
    const step1 = screen.getByTitle('Personal Information (Completed)').closest('div');
    const step2 = screen.getByTitle('Educational Information (Completed)').closest('div');
    
    expect(step1).toHaveClass('bg-green-600');
    expect(step2).toHaveClass('bg-green-600');
  });

  it('should handle completedSteps as comma-separated string', () => {
    render(
      <StepIndicator
        steps={mockSteps}
        currentStep={3}
        completedSteps="1,2"
      />
    );
    
    // Step 1 and 2 should show as completed
    const step1 = screen.getByTitle('Personal Information (Completed)').closest('div');
    const step2 = screen.getByTitle('Educational Information (Completed)').closest('div');
    
    expect(step1).toHaveClass('bg-green-600');
    expect(step2).toHaveClass('bg-green-600');
  });

  it('should show active step with correct styling', () => {
    render(
      <StepIndicator
        steps={mockSteps}
        currentStep={3}
        completedSteps={[1, 2]}
      />
    );
    
    const step3 = screen.getByText('3').closest('div');
    expect(step3).toHaveClass('bg-blue-600');
  });

  it('should show incomplete steps with correct styling', () => {
    render(
      <StepIndicator
        steps={mockSteps}
        currentStep={2}
        completedSteps={[1]}
      />
    );
    
    const step4 = screen.getByText('4').closest('div');
    const step5 = screen.getByText('5').closest('div');
    
    expect(step4).toHaveClass('bg-white');
    expect(step4).toHaveClass('border-2');
    expect(step4).toHaveClass('border-gray-300');
    expect(step5).toHaveClass('bg-white');
    expect(step5).toHaveClass('border-2');
    expect(step5).toHaveClass('border-gray-300');
  });
});
