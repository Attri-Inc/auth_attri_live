# Attri.live Authentication Service

A serverless authentication service for managing access to Vercel-hosted project preview URLs.

## Overview

This service provides a secure way to grant access to project preview deployments on Vercel:

1. User requests access to a project preview
2. Backend generates a JWT token with project and user info
3. User visits `/sso?authorization_token=TOKEN` endpoint
4. Service verifies token, sets cookies, and redirects to project subdomain
5. Subsequent requests are authenticated via Vercel Firewall using the set cookie

## Setup

### Local Development

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file from example:
   ```bash
   cp env.example .env
   ```
4. Fill in environment variables in `.env`:
   ```
   JWT_SECRET=your_secure_secret_key
   PROD_URL=https://attri.ai
   DEV_URL=https://dev.attri.ai
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```

### Production Deployment on Vercel

1. Push this repository to GitHub
2. Create a new project in Vercel and link to your repository
3. Set environment variables in Vercel dashboard:
   - `JWT_SECRET`: Your secure JWT signing secret
   - `PROD_URL`: Your production URL (e.g., `https://attri.ai`)
   - `DEV_URL`: Your development URL (e.g., `https://dev.attri.ai`)
4. Deploy the project
5. Configure custom domain (`auth.attri.live`)

## Using the Service

### JWT Token Format

Generate tokens with the following payload structure:

```json
{
  "project_name": "projectname",   // Subdomain to redirect to
  "vercel_auth": "secret_value",   // Value for Vercel Firewall
  "exp": 1746191928                // Optional: Expiration timestamp
}
```

### Example Token Generation

```javascript
const { SignJWT } = require('jose');

async function generateToken() {
  const secret = new TextEncoder().encode('your_jwt_secret');
  
  const payload = {
    project_name: 'projectname',   // Maps to projectname.attri.live
    vercel_auth: 'secret_value',   // Must match Vercel Firewall expected value
    exp: Math.floor(Date.now() / 1000) + 3600 // 1 hour from now
  };
  
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .sign(secret);
  
  return token;
}
```

### Authentication Flow

1. Generate token in your backend
2. Redirect user to: `https://auth.attri.live/sso?authorization_token=TOKEN`
3. User will be redirected to `https://projectname.attri.live` with cookies set
4. Vercel Firewall will check cookies on subsequent requests

## Vercel Firewall Configuration

In your Vercel project, set up a Header Rule:
- **Header Name**: `Cookie`
- **Value Pattern**: `x-vercel-auth=secret_value`

This ensures only authenticated users with valid cookies can access your project. 