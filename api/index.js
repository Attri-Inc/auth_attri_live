require('dotenv').config();

const express = require('express');
const { jwtVerify } = require('jose');
const app = express();


app.get('/sso', async (req, res) => {
    const token = req.query.authorization_token;
  if (!token) {
    console.log('No token provided');
    return res.redirect(302, 'https://attri.ai/login');
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    const projectName = payload.project_name;
    const vercel_cookie_value = payload.vercel_cookie_value;
    const vercel_cookie_key = payload.vercel_cookie_key;

    if (!projectName || !vercel_cookie_value) {
      payload?.env === 'prod'?
       res.redirect(302, 'https://attri.ai/login'):
       res.redirect(302, 'https://dev.attri.ai/login')
    }

    const expiration = payload?.exp_time
      ? new Date(payload?.exp_time * 1000).toUTCString()
      : new Date(Date.now() + 24*60*60*1000).toUTCString();

    const target = `https://${projectName}.attri.live`;
    const cookie = [
      `${vercel_cookie_key}=${vercel_cookie_value}`,
      `Path=/; Domain=.attri.live; HttpOnly; SameSite=Lax; Expires=${expiration}`
    ].join('; ');

    res.append('Set-Cookie', cookie);
    return res.redirect(302, target);

  } catch(err) {
    console.error('Token verification error:', err);
    return res.status(404).send('Invalid token');
  }
});


const PORT = process.env.PORT || 3033;
app.listen(PORT, () => console.log(`Server ready on port ${PORT}.`));

module.exports = app;