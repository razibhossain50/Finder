#!/usr/bin/env node

/**
 * Biodata API Testing Script
 * Tests the biodata API endpoints for functionality
 */

const fetch = require('node-fetch');

const API_BASE_URL = 'http://localhost:3001/api';
const TEST_USER = {
  email: 'test@example.com',
  password: 'testpassword123'
};

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

// Test data
const testBiodata = {
  religion: 'Islam',
  biodataType: 'Male',
  maritalStatus: 'Single',
  dateOfBirth: '1995-01-01',
  age: 29,
  height: '5.6',
  weight: 70,
  complexion: 'Wheatish',
  profession: 'Engineer',
  bloodGroup: 'A+',
  permanentCountry: 'Bangladesh',
  permanentDivision: 'Dhaka',
  permanentZilla: 'Dhaka',
  permanentUpazilla: 'Dhanmondi',
  permanentArea: 'Test Area',
  presentCountry: 'Bangladesh',
  presentDivision: 'Dhaka',
  presentZilla: 'Dhaka',
  presentUpazilla: 'Dhanmondi',
  presentArea: 'Test Area',
  healthIssues: 'None',
  educationMedium: 'English',
  highestEducation: 'Bachelor',
  instituteName: 'Test University',
  passingYear: 2020,
  result: '3.5',
  economicCondition: 'Good',
  fatherName: 'Test Father',
  fatherProfession: 'Business',
  fatherAlive: 'Yes',
  motherName: 'Test Mother',
  motherProfession: 'Housewife',
  motherAlive: 'Yes',
  brothersCount: 1,
  sistersCount: 1,
  partnerAgeMin: 25,
  partnerAgeMax: 35,
  fullName: 'Test User',
  email: 'test@example.com',
  guardianMobile: '01234567890',
  ownMobile: '01234567891',
  completedSteps: [1, 2, 3, 4, 5],
  biodataApprovalStatus: 'in_progress'
};

let authToken = null;

async function makeRequest(method, endpoint, data = null, token = null) {
  const url = `${API_BASE_URL}${endpoint}`;
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (token) {
    options.headers['Authorization'] = `Bearer ${token}`;
  }

  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, options);
    const responseData = await response.text();
    
    let parsedData;
    try {
      parsedData = JSON.parse(responseData);
    } catch (e) {
      parsedData = responseData;
    }

    return {
      status: response.status,
      data: parsedData,
      ok: response.ok
    };
  } catch (error) {
    return {
      status: 0,
      data: error.message,
      ok: false,
      error: true
    };
  }
}

async function testAuth() {
  logInfo('Testing authentication...');
  
  // Test login
  const loginResponse = await makeRequest('POST', '/auth/login', TEST_USER);
  
  if (loginResponse.ok && loginResponse.data.access_token) {
    authToken = loginResponse.data.access_token;
    logSuccess('Authentication successful');
    return true;
  } else {
    logError(`Authentication failed: ${loginResponse.data}`);
    return false;
  }
}

async function testCreateBiodata() {
  logInfo('Testing biodata creation...');
  
  const response = await makeRequest('PUT', '/biodatas/current', testBiodata, authToken);
  
  if (response.ok) {
    logSuccess('Biodata created successfully');
    return response.data;
  } else {
    logError(`Biodata creation failed: ${response.data}`);
    return null;
  }
}

async function testGetBiodata() {
  logInfo('Testing biodata retrieval...');
  
  const response = await makeRequest('GET', '/biodatas/current', null, authToken);
  
  if (response.ok) {
    logSuccess('Biodata retrieved successfully');
    return response.data;
  } else {
    logError(`Biodata retrieval failed: ${response.data}`);
    return null;
  }
}

async function testUpdateBiodata() {
  logInfo('Testing biodata update...');
  
  const updateData = {
    ...testBiodata,
    profession: 'Senior Engineer',
    completedSteps: [1, 2, 3, 4, 5],
    biodataApprovalStatus: 'pending'
  };
  
  const response = await makeRequest('PUT', '/biodatas/current', updateData, authToken);
  
  if (response.ok) {
    logSuccess('Biodata updated successfully');
    return response.data;
  } else {
    logError(`Biodata update failed: ${response.data}`);
    return null;
  }
}

async function testStepUpdate() {
  logInfo('Testing step-by-step update...');
  
  const stepData = {
    religion: 'Islam',
    biodataType: 'Male',
    maritalStatus: 'Single',
    step: 1,
    completedSteps: [1],
    biodataApprovalStatus: 'in_progress'
  };
  
  const response = await makeRequest('PUT', '/biodatas/current', stepData, authToken);
  
  if (response.ok) {
    logSuccess('Step update successful');
    return response.data;
  } else {
    logError(`Step update failed: ${response.data}`);
    return null;
  }
}

async function testSearchBiodatas() {
  logInfo('Testing biodata search...');
  
  const searchParams = new URLSearchParams({
    gender: 'Male',
    maritalStatus: 'Single',
    ageMin: '25',
    ageMax: '35',
    page: '1',
    limit: '10'
  });
  
  const response = await makeRequest('GET', `/biodatas/search?${searchParams}`, null, authToken);
  
  if (response.ok) {
    logSuccess('Biodata search successful');
    return response.data;
  } else {
    logError(`Biodata search failed: ${response.data}`);
    return null;
  }
}

async function runTests() {
  log('🧪 Starting Biodata API Tests...', 'blue');
  log('=====================================', 'blue');
  
  let passedTests = 0;
  let totalTests = 0;
  
  // Test 1: Authentication
  totalTests++;
  if (await testAuth()) {
    passedTests++;
  }
  
  // Test 2: Create Biodata
  totalTests++;
  const createdBiodata = await testCreateBiodata();
  if (createdBiodata) {
    passedTests++;
  }
  
  // Test 3: Get Biodata
  totalTests++;
  const retrievedBiodata = await testGetBiodata();
  if (retrievedBiodata) {
    passedTests++;
  }
  
  // Test 4: Update Biodata
  totalTests++;
  const updatedBiodata = await testUpdateBiodata();
  if (updatedBiodata) {
    passedTests++;
  }
  
  // Test 5: Step Update
  totalTests++;
  const stepUpdatedBiodata = await testStepUpdate();
  if (stepUpdatedBiodata) {
    passedTests++;
  }
  
  // Test 6: Search Biodatas
  totalTests++;
  const searchResults = await testSearchBiodatas();
  if (searchResults) {
    passedTests++;
  }
  
  // Summary
  log('=====================================', 'blue');
  log(`📊 Test Results: ${passedTests}/${totalTests} tests passed`, 'blue');
  
  if (passedTests === totalTests) {
    logSuccess('🎉 All API tests passed!');
    process.exit(0);
  } else {
    logError('💥 Some API tests failed!');
    process.exit(1);
  }
}

// Check if backend is running
async function checkBackend() {
  try {
    const response = await fetch(`${API_BASE_URL}/`);
    if (response.ok) {
      logSuccess('Backend server is running');
      return true;
    }
  } catch (error) {
    logError('Backend server is not running. Please start it with: npm run dev');
    return false;
  }
}

// Main execution
async function main() {
  if (await checkBackend()) {
    await runTests();
  } else {
    process.exit(1);
  }
}

main().catch(error => {
  logError(`Test execution failed: ${error.message}`);
  process.exit(1);
});
