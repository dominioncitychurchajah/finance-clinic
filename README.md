# Finance Clinic — Contact Form Automation & Lead Capture Backend

This directory contains the production-ready lead capture system and automation pipeline for the **Finance Clinic** static marketing website.

---

## 🏗 Architecture & Data Flow

```
Visitor Form Submission (contact.html)
  │
  ├─> Client Validation & UTM / Referrer Extraction (app.js)
  ├─> Cloudflare Turnstile Verification (frontend widget)
  │
  ▼ POST /api/contact
Cloudflare Worker API Gateway (functions/api/contact.js)
  │
  ├─> 1. Reject non-POST methods (HTTP 405)
  ├─> 2. Honeypot check (botcheck must be empty)
  ├─> 3. IP Rate Limiting (max 5 submissions per IP per hour -> HTTP 429)
  ├─> 4. Server-Side input sanitization & payload schema validation
  ├─> 5. Turnstile secret token verification (challenges.cloudflare.com)
  ├─> 6. CORS & security header enforcement
  │
  ▼ POST (Server-to-Server encrypted HTTP call)
Google Apps Script Endpoint (Code.gs)
  │
  ├─> 1. Appends Lead to Google Sheets (21 structured columns)
  ├─> 2. Sends Lead Notification Email to Website Owner
  └─> 3. Sends Auto-Response Confirmation Email to Visitor
```

---

## 📋 Step 1: Google Sheet & Apps Script Setup

1. **Create a Google Sheet**:
   - Go to [sheets.google.com](https://sheets.google.com) and create a new spreadsheet named **Finance Clinic Leads**.

2. **Add Apps Script Code**:
   - Click **Extensions** > **Apps Script**.
   - Paste the code from [`google-apps-script/Code.gs`](file:///google-apps-script/Code.gs) into `Code.gs`.

3. **Configure Script Property**:
   - In the left sidebar, click **Project Settings** (Gear icon).
   - Scroll down to **Script Properties** and click **Edit script properties**.
   - Add property:
     - `NOTIFICATION_EMAIL` = `hello@financeclinic.ng` *(or your team email address)*

4. **Deploy as Web App**:
   - Click **Deploy** (top right) > **New deployment**.
   - Click the gear icon next to "Select type" and choose **Web app**.
   - Set **Description**: `Finance Clinic API v1`
   - Set **Execute as**: `Me`
   - Set **Who has access**: `Anyone`
   - Click **Deploy** and authorize permissions.
   - **Copy the Web App URL** (e.g., `https://script.google.com/macros/s/.../exec`).

---

## 🔐 Step 2: Cloudflare Turnstile Setup

1. Log in to [dash.cloudflare.com](https://dash.cloudflare.com).
2. Go to **Turnstile** in the left sidebar and click **Add site**.
3. Set **Site name**: `Finance Clinic`
4. Set **Domain**: `financeclinic.ng` (or your Pages domain `*.pages.dev`).
5. Choose Widget Type: **Managed** (or Non-interactive).
6. Copy the **Site Key** and **Secret Key**.
7. In `contact.html`, update line 162 with your public Site Key:
   ```html
   <div class="cf-turnstile" data-sitekey="YOUR_TURNSTILE_SITE_KEY" data-theme="light"></div>
   ```

---

## ⚡ Step 3: Cloudflare Pages Secrets Configuration

Configure the following Environment Variables / Secrets in Cloudflare Pages:

Go to **Cloudflare Dashboard** > **Workers & Pages** > **finance-clinic** > **Settings** > **Environment variables**:

| Variable Name | Value / Description |
|---|---|
| `GOOGLE_APPS_SCRIPT_URL` | The Web App URL copied from Step 1 (`https://script.google.com/macros/s/.../exec`) |
| `TURNSTILE_SECRET_KEY` | The Turnstile Secret Key copied from Step 2 |
| `ALLOWED_ORIGIN` | `https://financeclinic.ng` (or `*` for testing) |
| `NOTIFICATION_EMAIL` | `hello@financeclinic.ng` |
| `ENVIRONMENT` | `production` |

---

## 🧪 Testing the Contact Form Automation

1. Open `contact.html` in your browser.
2. Open Browser Developer Tools → Network tab.
3. Complete the form and submit.
4. Verify:
   - Button state changes to `Sending…`.
   - POST request to `/api/contact` returns HTTP `200 OK` `{ "success": true, "message": "Submission received." }`.
   - Green success notification displays on screen.
   - A new row appears instantly in your Google Sheet with all 21 columns populated (including UTM parameters and location metadata).
   - Website owner receives notification email.
   - Visitor receives confirmation email.

---

## 🔒 Security Features Implemented

- **No Exposed Credentials**: The Google Apps Script URL and Turnstile Secret Key exist **only** inside serverless Cloudflare Workers environment variables. Frontend code never sees them.
- **Turnstile Verification**: Server-side token validation prevents automated bot spam.
- **Honeypot Protection**: Hidden `botcheck` input field traps automated scripts.
- **Rate Limiting**: Limits submissions to maximum 5 per hour per IP address to prevent Denial of Service.
- **Input Sanitization**: All incoming strings are HTML-entity escaped to prevent XSS / script injection attacks.
- **Strict Method & CORS Enforcement**: Rejects non-POST HTTP methods with HTTP 405.
