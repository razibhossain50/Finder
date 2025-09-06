import { test, expect } from '@playwright/test';

test.describe('Biodata Form', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the biodata form page
    await page.goto('/profile/biodatas/edit/new');
    
    // Wait for the page to load
    await page.waitForSelector('[data-testid="biodata-form"]', { timeout: 10000 });
  });

  test('should display the form with step indicator', async ({ page }) => {
    // Check if the form is visible
    await expect(page.locator('[data-testid="biodata-form"]')).toBeVisible();
    
    // Check if step indicator is visible
    await expect(page.locator('[data-testid="step-indicator"]')).toBeVisible();
    
    // Check if we're on step 1
    await expect(page.locator('text=Personal Information')).toBeVisible();
    await expect(page.locator('text=Basic details about you')).toBeVisible();
  });

  test('should validate required fields in step 1', async ({ page }) => {
    // Try to proceed without filling any fields
    await page.click('[data-testid="next-button"]');
    
    // Check if validation errors appear
    await expect(page.locator('text=Religion is required')).toBeVisible();
    await expect(page.locator('text=Biodata type is required')).toBeVisible();
  });

  test('should fill step 1 and progress to step 2', async ({ page }) => {
    // Fill required fields in step 1
    await page.selectOption('[data-testid="religion-select"]', 'Islam');
    await page.selectOption('[data-testid="biodata-type-select"]', 'Male');
    await page.selectOption('[data-testid="marital-status-select"]', 'Single');
    await page.fill('[data-testid="date-of-birth-input"]', '1995-01-01');
    await page.fill('[data-testid="height-input"]', '5.6');
    await page.fill('[data-testid="weight-input"]', '70');
    await page.selectOption('[data-testid="complexion-select"]', 'Wheatish');
    await page.fill('[data-testid="profession-input"]', 'Engineer');
    await page.selectOption('[data-testid="blood-group-select"]', 'A+');
    
    // Fill address fields
    await page.selectOption('[data-testid="permanent-country-select"]', 'Bangladesh');
    await page.selectOption('[data-testid="permanent-division-select"]', 'Dhaka');
    await page.selectOption('[data-testid="permanent-zilla-select"]', 'Dhaka');
    await page.selectOption('[data-testid="permanent-upazilla-select"]', 'Dhanmondi');
    await page.fill('[data-testid="permanent-area-input"]', 'Test Area');
    
    // Check "same as permanent" for present address
    await page.check('[data-testid="same-as-permanent-checkbox"]');
    
    await page.fill('[data-testid="health-issues-input"]', 'None');
    
    // Click next button
    await page.click('[data-testid="next-button"]');
    
    // Wait for step 2 to load
    await page.waitForSelector('text=Educational Information', { timeout: 5000 });
    
    // Verify we're on step 2
    await expect(page.locator('text=Educational Information')).toBeVisible();
    await expect(page.locator('text=Your academic background')).toBeVisible();
    
    // Check if step 1 is marked as completed in the step indicator
    await expect(page.locator('[data-testid="step-1"]')).toHaveClass(/bg-green-600/);
  });

  test('should fill step 2 and progress to step 3', async ({ page }) => {
    // First complete step 1 (reuse the previous test logic)
    await page.selectOption('[data-testid="religion-select"]', 'Islam');
    await page.selectOption('[data-testid="biodata-type-select"]', 'Male');
    await page.selectOption('[data-testid="marital-status-select"]', 'Single');
    await page.fill('[data-testid="date-of-birth-input"]', '1995-01-01');
    await page.fill('[data-testid="height-input"]', '5.6');
    await page.fill('[data-testid="weight-input"]', '70');
    await page.selectOption('[data-testid="complexion-select"]', 'Wheatish');
    await page.fill('[data-testid="profession-input"]', 'Engineer');
    await page.selectOption('[data-testid="blood-group-select"]', 'A+');
    await page.selectOption('[data-testid="permanent-country-select"]', 'Bangladesh');
    await page.selectOption('[data-testid="permanent-division-select"]', 'Dhaka');
    await page.selectOption('[data-testid="permanent-zilla-select"]', 'Dhaka');
    await page.selectOption('[data-testid="permanent-upazilla-select"]', 'Dhanmondi');
    await page.fill('[data-testid="permanent-area-input"]', 'Test Area');
    await page.check('[data-testid="same-as-permanent-checkbox"]');
    await page.fill('[data-testid="health-issues-input"]', 'None');
    await page.click('[data-testid="next-button"]');
    
    // Wait for step 2
    await page.waitForSelector('text=Educational Information', { timeout: 5000 });
    
    // Fill step 2 fields
    await page.selectOption('[data-testid="education-medium-select"]', 'English');
    await page.selectOption('[data-testid="highest-education-select"]', 'Bachelor');
    await page.fill('[data-testid="institute-name-input"]', 'Test University');
    await page.fill('[data-testid="passing-year-input"]', '2020');
    await page.selectOption('[data-testid="result-select"]', '3.5');
    
    // Click next button
    await page.click('[data-testid="next-button"]');
    
    // Wait for step 3
    await page.waitForSelector('text=Family Information', { timeout: 5000 });
    
    // Verify we're on step 3
    await expect(page.locator('text=Family Information')).toBeVisible();
    await expect(page.locator('text=About your family')).toBeVisible();
  });

  test('should allow going back to previous steps', async ({ page }) => {
    // Complete step 1 and go to step 2
    await page.selectOption('[data-testid="religion-select"]', 'Islam');
    await page.selectOption('[data-testid="biodata-type-select"]', 'Male');
    await page.selectOption('[data-testid="marital-status-select"]', 'Single');
    await page.fill('[data-testid="date-of-birth-input"]', '1995-01-01');
    await page.fill('[data-testid="height-input"]', '5.6');
    await page.fill('[data-testid="weight-input"]', '70');
    await page.selectOption('[data-testid="complexion-select"]', 'Wheatish');
    await page.fill('[data-testid="profession-input"]', 'Engineer');
    await page.selectOption('[data-testid="blood-group-select"]', 'A+');
    await page.selectOption('[data-testid="permanent-country-select"]', 'Bangladesh');
    await page.selectOption('[data-testid="permanent-division-select"]', 'Dhaka');
    await page.selectOption('[data-testid="permanent-zilla-select"]', 'Dhaka');
    await page.selectOption('[data-testid="permanent-upazilla-select"]', 'Dhanmondi');
    await page.fill('[data-testid="permanent-area-input"]', 'Test Area');
    await page.check('[data-testid="same-as-permanent-checkbox"]');
    await page.fill('[data-testid="health-issues-input"]', 'None');
    await page.click('[data-testid="next-button"]');
    
    await page.waitForSelector('text=Educational Information', { timeout: 5000 });
    
    // Click back button
    await page.click('[data-testid="back-button"]');
    
    // Verify we're back on step 1
    await expect(page.locator('text=Personal Information')).toBeVisible();
    await expect(page.locator('text=Basic details about you')).toBeVisible();
  });

  test('should allow clicking on completed steps in step indicator', async ({ page }) => {
    // Complete step 1 and go to step 2
    await page.selectOption('[data-testid="religion-select"]', 'Islam');
    await page.selectOption('[data-testid="biodata-type-select"]', 'Male');
    await page.selectOption('[data-testid="marital-status-select"]', 'Single');
    await page.fill('[data-testid="date-of-birth-input"]', '1995-01-01');
    await page.fill('[data-testid="height-input"]', '5.6');
    await page.fill('[data-testid="weight-input"]', '70');
    await page.selectOption('[data-testid="complexion-select"]', 'Wheatish');
    await page.fill('[data-testid="profession-input"]', 'Engineer');
    await page.selectOption('[data-testid="blood-group-select"]', 'A+');
    await page.selectOption('[data-testid="permanent-country-select"]', 'Bangladesh');
    await page.selectOption('[data-testid="permanent-division-select"]', 'Dhaka');
    await page.selectOption('[data-testid="permanent-zilla-select"]', 'Dhaka');
    await page.selectOption('[data-testid="permanent-upazilla-select"]', 'Dhanmondi');
    await page.fill('[data-testid="permanent-area-input"]', 'Test Area');
    await page.check('[data-testid="same-as-permanent-checkbox"]');
    await page.fill('[data-testid="health-issues-input"]', 'None');
    await page.click('[data-testid="next-button"]');
    
    await page.waitForSelector('text=Educational Information', { timeout: 5000 });
    
    // Click on step 1 in the step indicator
    await page.click('[data-testid="step-1"]');
    
    // Verify we're back on step 1
    await expect(page.locator('text=Personal Information')).toBeVisible();
  });

  test('should show loading state during form submission', async ({ page }) => {
    // Fill and submit the form
    await page.selectOption('[data-testid="religion-select"]', 'Islam');
    await page.selectOption('[data-testid="biodata-type-select"]', 'Male');
    await page.selectOption('[data-testid="marital-status-select"]', 'Single');
    await page.fill('[data-testid="date-of-birth-input"]', '1995-01-01');
    await page.fill('[data-testid="height-input"]', '5.6');
    await page.fill('[data-testid="weight-input"]', '70');
    await page.selectOption('[data-testid="complexion-select"]', 'Wheatish');
    await page.fill('[data-testid="profession-input"]', 'Engineer');
    await page.selectOption('[data-testid="blood-group-select"]', 'A+');
    await page.selectOption('[data-testid="permanent-country-select"]', 'Bangladesh');
    await page.selectOption('[data-testid="permanent-division-select"]', 'Dhaka');
    await page.selectOption('[data-testid="permanent-zilla-select"]', 'Dhaka');
    await page.selectOption('[data-testid="permanent-upazilla-select"]', 'Dhanmondi');
    await page.fill('[data-testid="permanent-area-input"]', 'Test Area');
    await page.check('[data-testid="same-as-permanent-checkbox"]');
    await page.fill('[data-testid="health-issues-input"]', 'None');
    
    // Click next button and check for loading state
    await page.click('[data-testid="next-button"]');
    
    // The button should show loading state
    await expect(page.locator('[data-testid="next-button"]')).toHaveAttribute('disabled');
  });
});
