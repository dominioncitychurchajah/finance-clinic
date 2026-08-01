/**
 * Cloudflare Pages Function: /api/contact
 * Secure API Gateway for Contact Form Submissions
 */

// Helper: Sanitize string to prevent XSS/injection
function sanitize(input) {
  if (typeof input !== 'string') return '';
  return input
    .trim()
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

// Helper: Validate Email Format
function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.trim());
}

// Helper: Validate Phone Format
function isValidPhone(phone) {
  if (!phone || typeof phone !== 'string') return false;
  const re = /^[\d\s\+\-\(\)]{7,25}$/;
  return re.test(phone.trim());
}

// Helper: Rate Limiting (5 requests per hour per IP)
async function checkRateLimit(env, ip) {
  const key = `rl:${ip}`;
  const now = Math.floor(Date.now() / 1000);
  const windowSeconds = 3600;
  const limit = 5;

  if (env.RATE_LIMIT_KV) {
    try {
      const data = await env.RATE_LIMIT_KV.get(key, { type: 'json' });
      if (data) {
        if (data.count >= limit) {
          return false; // Rate limit exceeded
        }
        await env.RATE_LIMIT_KV.put(
          key,
          JSON.stringify({ count: data.count + 1, reset: data.reset }),
          { expirationTtl: windowSeconds }
        );
        return true;
      } else {
        await env.RATE_LIMIT_KV.put(
          key,
          JSON.stringify({ count: 1, reset: now + windowSeconds }),
          { expirationTtl: windowSeconds }
        );
        return true;
      }
    } catch (err) {
      console.error('Rate limit KV error:', err);
    }
  }
  return true; // Pass if KV not configured
}

// Helper: Verify Turnstile Token
async function verifyTurnstile(token, secretKey, remoteIp) {
  if (!secretKey || secretKey === 'REPLACE_ME') {
    return true; // Bypass verification if secret key is not set yet
  }
  if (!token) return false;

  try {
    const formData = new FormData();
    formData.append('secret', secretKey);
    formData.append('response', token);
    if (remoteIp) formData.append('remoteip', remoteIp);

    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: formData,
    });
    const outcome = await res.json();
    return outcome.success === true;
  } catch (err) {
    console.error('Turnstile verification exception:', err);
    return false;
  }
}

// Handle OPTIONS preflight request
export async function onRequestOptions(context) {
  const allowedOrigin = context.env.ALLOWED_ORIGIN || '*';
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': allowedOrigin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Accept',
      'Access-Control-Max-Age': '86400',
    },
  });
}

// Handle POST request
export async function onRequestPost(context) {
  const { request, env } = context;
  const allowedOrigin = env.ALLOWED_ORIGIN || '*';

  const corsHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': allowedOrigin,
  };

  try {
    // 1. IP Rate Limiting Check
    const ip = request.headers.get('cf-connecting-ip') || '127.0.0.1';
    const isAllowed = await checkRateLimit(env, ip);
    if (!isAllowed) {
      console.warn(`Rate limit exceeded for IP: ${ip}`);
      return new Response(
        JSON.stringify({ success: false, message: 'Too many submissions. Please try again later.' }),
        { status: 429, headers: corsHeaders }
      );
    }

    // 2. Parse Payload
    let payload;
    try {
      payload = await request.json();
    } catch (err) {
      return new Response(
        JSON.stringify({ success: false, message: 'Invalid JSON payload.' }),
        { status: 400, headers: corsHeaders }
      );
    }

    // 3. Honeypot Anti-Spam Check
    if (payload.botcheck && payload.botcheck.trim() !== '') {
      console.warn(`Spam detected via honeypot field from IP: ${ip}`);
      // Return fake success to confuse spam bots
      return new Response(
        JSON.stringify({ success: true, message: 'Submission received.' }),
        { status: 200, headers: corsHeaders }
      );
    }

    // 4. Validate Required & Optional Fields
    const name = sanitize(payload.name);
    const email = sanitize(payload.email);
    const phone = sanitize(payload.phone);
    const message = sanitize(payload.message);
    const company = sanitize(payload.company);
    const format = sanitize(payload.format);
    const reason = sanitize(payload.reason);
    const sponsored = payload.sponsored ? 'Yes' : 'No';
    const printed = payload.printed ? 'Yes' : 'No';
    const juniors = payload.juniors ? 'Yes' : 'No';

    // Lead Tracking metadata
    const pageUrl = sanitize(payload.pageUrl);
    const referrer = sanitize(payload.referrer);
    const utmSource = sanitize(payload.utmSource);
    const utmMedium = sanitize(payload.utmMedium);
    const utmCampaign = sanitize(payload.utmCampaign);
    const utmContent = sanitize(payload.utmContent);
    const utmTerm = sanitize(payload.utmTerm);

    const userAgent = request.headers.get('user-agent') || 'Unknown';
    const country = request.headers.get('cf-ipcountry') || 'Unknown';

    // Validation checks
    if (!name || name.length < 2 || name.length > 100) {
      return new Response(
        JSON.stringify({ success: false, message: 'Validation failed: Name must be between 2 and 100 characters.' }),
        { status: 400, headers: corsHeaders }
      );
    }

    if (!isValidEmail(email)) {
      return new Response(
        JSON.stringify({ success: false, message: 'Validation failed: Invalid email address.' }),
        { status: 400, headers: corsHeaders }
      );
    }

    if (!isValidPhone(phone)) {
      return new Response(
        JSON.stringify({ success: false, message: 'Validation failed: Invalid phone number.' }),
        { status: 400, headers: corsHeaders }
      );
    }

    if (!message || message.length < 10 || message.length > 3000) {
      return new Response(
        JSON.stringify({ success: false, message: 'Validation failed: Message must be between 10 and 3000 characters.' }),
        { status: 400, headers: corsHeaders }
      );
    }

    if (company && company.length > 150) {
      return new Response(
        JSON.stringify({ success: false, message: 'Validation failed: Company name must be 150 characters or less.' }),
        { status: 400, headers: corsHeaders }
      );
    }

    // 5. Cloudflare Turnstile Verification
    const turnstileToken = payload['cf-turnstile-response'] || payload.turnstileToken;
    const isTurnstileValid = await verifyTurnstile(turnstileToken, env.TURNSTILE_SECRET_KEY, ip);
    if (!isTurnstileValid) {
      console.warn(`Turnstile verification failed for IP: ${ip}`);
      return new Response(
        JSON.stringify({ success: false, message: 'Security check failed. Please complete the captcha.' }),
        { status: 400, headers: corsHeaders }
      );
    }

    // 6. Forward to Google Apps Script
    const appsScriptUrl = env.GOOGLE_APPS_SCRIPT_URL;
    if (!appsScriptUrl || appsScriptUrl === 'REPLACE_ME') {
      console.error('GOOGLE_APPS_SCRIPT_URL is not configured.');
      // Return success in test environment if endpoint not configured yet
      return new Response(
        JSON.stringify({ success: true, message: 'Submission received (Backend Endpoint Pending Config).' }),
        { status: 200, headers: corsHeaders }
      );
    }

    const gasPayload = {
      name,
      email,
      phone,
      company,
      message,
      format,
      reason,
      sponsored,
      printed,
      juniors,
      pageUrl,
      referrer,
      utmSource,
      utmMedium,
      utmCampaign,
      utmContent,
      utmTerm,
      ipHash: ip, // IP forwarded securely from worker
      userAgent,
      country,
      timestamp: new Date().toISOString(),
    };

    const gasResponse = await fetch(appsScriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(gasPayload),
    });

    if (!gasResponse.ok) {
      console.error(`Google Apps Script HTTP error ${gasResponse.status}`);
      return new Response(
        JSON.stringify({ success: false, message: 'An error occurred while saving your submission. Please try again.' }),
        { status: 500, headers: corsHeaders }
      );
    }

    const gasResult = await gasResponse.json();
    if (gasResult.success === false) {
      console.error('Google Apps Script returned failure:', gasResult.message);
      return new Response(
        JSON.stringify({ success: false, message: gasResult.message || 'Processing failed.' }),
        { status: 500, headers: corsHeaders }
      );
    }

    // 7. Success Response
    return new Response(
      JSON.stringify({ success: true, message: 'Submission received.' }),
      { status: 200, headers: corsHeaders }
    );

  } catch (err) {
    console.error('Unexpected error in /api/contact function:', err);
    return new Response(
      JSON.stringify({ success: false, message: 'Internal server error. Please try again later.' }),
      { status: 500, headers: corsHeaders }
    );
  }
}

// Reject all other HTTP methods
export async function onRequest(context) {
  if (context.request.method !== 'POST' && context.request.method !== 'OPTIONS') {
    return new Response(
      JSON.stringify({ success: false, message: 'Method Not Allowed.' }),
      { status: 405, headers: { 'Content-Type': 'application/json', Allow: 'POST, OPTIONS' } }
    );
  }
  return onRequestPost(context);
}
