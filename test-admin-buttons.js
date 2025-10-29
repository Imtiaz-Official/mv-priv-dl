const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

// Test configuration
const testConfig = {
  baseURL: BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
};

// Mock authentication token (you'll need to replace with a real token)
const AUTH_TOKEN = 'your-test-token-here';

async function testEndpoint(method, endpoint, data = null, requiresAuth = true) {
  try {
    const config = { ...testConfig, method };
    
    if (requiresAuth) {
      config.headers.Authorization = `Bearer ${AUTH_TOKEN}`;
    }
    
    if (data) {
      config.data = data;
    }
    
    const response = await axios({
      ...config,
      url: endpoint
    });
    
    console.log(`✅ ${method.toUpperCase()} ${endpoint} - Status: ${response.status}`);
    return { success: true, status: response.status, data: response.data };
  } catch (error) {
    console.log(`❌ ${method.toUpperCase()} ${endpoint} - Error: ${error.response?.status || error.message}`);
    return { success: false, error: error.response?.status || error.message };
  }
}

async function runTests() {
  console.log('🧪 Testing Admin Panel Button Endpoints...\n');
  
  // Test Movie endpoints
  console.log('📽️ Testing Movie Management Endpoints:');
  await testEndpoint('GET', '/movies', null, false);
  await testEndpoint('POST', '/movies', {
    title: 'Test Movie',
    description: 'Test Description',
    year: 2024,
    genre: ['Action'],
    director: 'Test Director'
  });
  await testEndpoint('PUT', '/movies/test-id', {
    title: 'Updated Test Movie'
  });
  await testEndpoint('PATCH', '/movies/test-id/toggle');
  await testEndpoint('DELETE', '/movies/test-id');
  
  console.log('\n👥 Testing User Management Endpoints:');
  await testEndpoint('GET', '/users');
  await testEndpoint('POST', '/users', {
    username: 'testuser',
    email: 'test@example.com',
    password: 'testpass123',
    role: 'user'
  });
  await testEndpoint('PUT', '/users/test-id', {
    username: 'updateduser'
  });
  await testEndpoint('PATCH', '/users/test-id/toggle');
  await testEndpoint('DELETE', '/users/test-id');
  
  console.log('\n📥 Testing Download Management Endpoints:');
  await testEndpoint('GET', '/downloads');
  await testEndpoint('POST', '/downloads', {
    movieId: 'test-movie-id',
    quality: '1080p',
    format: 'MP4',
    downloadUrl: 'https://example.com/test.mp4'
  });
  await testEndpoint('PUT', '/downloads/test-id', {
    quality: '720p'
  });
  await testEndpoint('PATCH', '/downloads/test-id/toggle');
  await testEndpoint('DELETE', '/downloads/test-id');
  
  console.log('\n🛡️ Testing Content Moderation Endpoints:');
  await testEndpoint('GET', '/moderation/reports');
  await testEndpoint('GET', '/moderation/stats');
  await testEndpoint('PATCH', '/moderation/reports/test-id', {
    status: 'approved'
  });
  await testEndpoint('POST', '/moderation/approve/movie/test-id', {
    reason: 'Content is appropriate'
  });
  await testEndpoint('POST', '/moderation/reject/movie/test-id', {
    reason: 'Content violates guidelines'
  });
  
  console.log('\n🔍 Testing Movie Tracker Endpoints:');
  await testEndpoint('GET', '/tracker/status');
  await testEndpoint('POST', '/tracker/start');
  await testEndpoint('POST', '/tracker/stop');
  
  console.log('\n✅ Test completed!');
}

// Run the tests
runTests().catch(console.error);