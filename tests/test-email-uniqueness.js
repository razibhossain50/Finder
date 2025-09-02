#!/usr/bin/env node

/**
 * Test script to verify email uniqueness functionality
 * Run this script to test various email uniqueness scenarios
 */

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3001/api';

async function makeRequest(endpoint, method = 'GET', body = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    const data = await response.json();
    
    return {
      success: response.ok,
      status: response.status,
      data: data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

async function testEmailUniqueness() {
  console.log('🧪 Testing Email Uniqueness Functionality\n');

  const testEmail = 'test.uniqueness@example.com';
  const testUser = {
    fullName: 'Test User',
    email: testEmail,
    password: 'TestPassword123!',
    confirmPassword: 'TestPassword123!'
  };

  // Test 1: Create first user
  console.log('📝 Test 1: Creating first user with email:', testEmail);
  const firstSignup = await makeRequest('/auth/signup', 'POST', testUser);
  
  if (firstSignup.success) {
    console.log('✅ First user created successfully');
    console.log('   User ID:', firstSignup.data.user?.id);
  } else {
    console.log('❌ First user creation failed:', firstSignup.data?.message || firstSignup.error);
  }

  // Test 2: Try to create duplicate user
  console.log('\n📝 Test 2: Attempting to create duplicate user with same email');
  const duplicateSignup = await makeRequest('/auth/signup', 'POST', testUser);
  
  if (!duplicateSignup.success && duplicateSignup.status === 400) {
    console.log('✅ Duplicate email properly rejected');
    console.log('   Error message:', duplicateSignup.data?.message);
  } else {
    console.log('❌ Duplicate email was not rejected properly');
    console.log('   Response:', duplicateSignup);
  }

  // Test 3: Try with different case
  console.log('\n📝 Test 3: Testing case insensitivity');
  const caseTestUser = {
    ...testUser,
    email: testEmail.toUpperCase(),
    fullName: 'Test User Uppercase'
  };
  
  const caseSignup = await makeRequest('/auth/signup', 'POST', caseTestUser);
  
  if (!caseSignup.success && caseSignup.status === 400) {
    console.log('✅ Case variation properly rejected');
    console.log('   Error message:', caseSignup.data?.message);
  } else {
    console.log('❌ Case variation was not rejected properly');
    console.log('   Response:', caseSignup);
  }

  // Test 4: Try with whitespace
  console.log('\n📝 Test 4: Testing whitespace normalization');
  const whitespaceTestUser = {
    ...testUser,
    email: `  ${testEmail}  `,
    fullName: 'Test User Whitespace'
  };
  
  const whitespaceSignup = await makeRequest('/auth/signup', 'POST', whitespaceTestUser);
  
  if (!whitespaceSignup.success && whitespaceSignup.status === 400) {
    console.log('✅ Whitespace variation properly rejected');
    console.log('   Error message:', whitespaceSignup.data?.message);
  } else {
    console.log('❌ Whitespace variation was not rejected properly');
    console.log('   Response:', whitespaceSignup);
  }

  // Test 5: Try with valid new email
  console.log('\n📝 Test 5: Creating user with different email');
  const newTestUser = {
    ...testUser,
    email: 'test.uniqueness.new@example.com',
    fullName: 'Test User New'
  };
  
  const newSignup = await makeRequest('/auth/signup', 'POST', newTestUser);
  
  if (newSignup.success) {
    console.log('✅ New user with different email created successfully');
    console.log('   User ID:', newSignup.data.user?.id);
  } else {
    console.log('❌ New user creation failed:', newSignup.data?.message || newSignup.error);
  }

  console.log('\n🏁 Email uniqueness testing completed!');
  console.log('\n💡 Note: You may need to clean up test users from your database');
  console.log('   Test emails used:');
  console.log('   -', testEmail);
  console.log('   - test.uniqueness.new@example.com');
}

// Run the test
if (require.main === module) {
  testEmailUniqueness().catch(console.error);
}

module.exports = { testEmailUniqueness };