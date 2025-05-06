const { SignJWT } = require('jose');

// Get secret from command line argument
const secret = process.argv[2] || 'test-secret';

async function generateToken() {
  console.log('Using secret:', secret);
  
  const secretBytes = new TextEncoder().encode(secret);
  
  const payload = {
    project_name: "sattyam123",
    vercel_auth: "123",
    exp: Math.floor(Date.now() / 1000) + 3600 // 1 hour from now
  };
  
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .sign(secretBytes);
  
  console.log('\nGenerated Token:');
  console.log(token);
  
  const urlEncodedToken = encodeURIComponent(token);
  console.log('\nUse this URL:');
  console.log(`https://auth.attri.live/sso?token=${urlEncodedToken}`);
}

generateToken()
  .catch(err => console.error('Error generating token:', err)); 