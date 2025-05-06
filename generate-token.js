require('dotenv').config();
const { SignJWT } = require('jose');

async function generateToken() {
  // Use a secure secret - MUST match the one on your server
  const jwtSecret = process.env.JWT_SECRET || 'your_secure_jwt_secret_for_testing';
  console.log('Using secret:', jwtSecret);
  
  const secret = new TextEncoder().encode(jwtSecret);
  
  const payload = {
    project_name: "sattyam123",
    vercel_auth: "123",
    exp: Math.floor(Date.now() / 1000) + 3600 // 1 hour from now
  };
  
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .sign(secret);
  
  console.log('Generated Token:');
  console.log(token);
  
  // Create a proper URL with URL-encoded token
  const urlEncodedToken = encodeURIComponent(token);
  console.log('\nUse this FULL URL (with encoded token):');
  console.log(`https://auth.attri.live/sso?token=${urlEncodedToken}`);
}

generateToken()
  .catch(err => console.error('Error generating token:', err)); 