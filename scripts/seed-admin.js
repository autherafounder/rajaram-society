// Seed script: Insert admin user into Supabase
// Run with: node scripts/seed-admin.js

const bcrypt = require('bcryptjs');

const SUPABASE_URL = 'https://djtuzfgzulwtalkqqbhd.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRqdHV6Zmd6dWx3dGFsa3FxYmhkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTkxMDI1MSwiZXhwIjoyMDkxNDg2MjUxfQ.eG2BdZLIbR-2hkGq0EP1YVrh-QxNVya3pRouIz7q4lQ';

async function seedAdmin() {
  // Hash the password
  const password = await bcrypt.hash('admin123', 10);
  
  const response = await fetch(`${SUPABASE_URL}/rest/v1/admins`, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_SERVICE_KEY,
      'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation',
    },
    body: JSON.stringify({
      email: 'admin@jaijawanchs.com',
      password: password,
      name: 'Admin',
      role: 'admin',
    }),
  });

  if (response.ok) {
    const data = await response.json();
    console.log('Admin user created successfully:', data);
  } else {
    const error = await response.text();
    console.error('Error creating admin:', response.status, error);
  }
}

seedAdmin();
