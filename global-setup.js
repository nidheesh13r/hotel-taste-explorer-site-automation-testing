// global-setup.js
// This script can be used to set up environment, seed data, or perform login before tests run.
// For example, you can create a login state and save it to a file for reuse in tests.

const { request } = require('@playwright/test');
const fs = require('fs');

module.exports = async (config) => {
  // Example: Pre-authenticate and save storage state for reuse
  // (Uncomment and adapt as needed for your app)

  // const baseURL = process.env.LOGIN_BASE_URL || 'http://localhost:5173';
  // const context = await request.newContext();
  // const response = await context.post(`${baseURL}/api/auth/login`, {
  //   data: { email: 'test@example.com', password: 'Password123!' },
  // });
  // if (!response.ok()) throw new Error('Login failed');
  // await context.storageState({ path: 'storageState.json' });
  // await context.dispose();

  // Example: Seed test data, set up DB, etc.
  // await seedTestData();

  // You can also set environment variables, etc.

  // No-op by default
};
