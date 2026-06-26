const fs = require('fs');
const path = require('path');
const Razorpay = require('razorpay');

// Read .env.local
const envPath = path.join(__dirname, '..', '.env.local');
if (!fs.existsSync(envPath)) {
  console.error('.env.local file not found at:', envPath);
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
const lines = envContent.split('\n');
let keyId = '';
let keySecret = '';

for (const line of lines) {
  const parts = line.trim().split('=');
  if (parts[0] === 'NEXT_PUBLIC_RAZORPAY_KEY_ID') {
    keyId = parts.slice(1).join('=').trim();
  }
  if (parts[0] === 'RAZORPAY_KEY_SECRET') {
    keySecret = parts.slice(1).join('=').trim();
  }
}

if (!keyId || !keySecret) {
  console.error('Could not find NEXT_PUBLIC_RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET in .env.local');
  process.exit(1);
}

console.log('Testing Razorpay credentials:');
console.log('Key ID:', keyId);
console.log('Key Secret: [HIDDEN]');

const rzp = new Razorpay({
  key_id: keyId,
  key_secret: keySecret
});

rzp.orders.all({ count: 1 })
  .then(response => {
    console.log('SUCCESS: Razorpay credentials are valid!');
    console.log('Response status/info: Successfully fetched orders (found ' + (response.items ? response.items.length : 0) + ' items).');
    process.exit(0);
  })
  .catch(err => {
    console.error('FAILURE: Razorpay credentials validation failed!');
    console.error(err);
    process.exit(1);
  });
