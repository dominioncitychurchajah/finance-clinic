# Finance Clinic — Client Handoff Report

This document lists every placeholder across the five pages of the website.
Each entry shows the file, the line number, what it currently says, and what
needs to replace it before the site goes live.

**Nothing has been invented or guessed.** All placeholders remain exactly as
they were written, and are noted here for the client to resolve.

---

## index.html

### Testimonials (Lines 265–284)

> [!CAUTION]
> These three quotes are illustrative only. Do not publish fabricated testimonials.

- **Line 265** — HTML comment: `REPLACE BEFORE PUBLISHING: illustrative placeholders only. Substitute real, dated, consented member quotes.`
  Replace the three `<figure>` blocks (lines 265–285) with real verbatim quotes.
  For each quote, replace `Placeholder — replace` in the `<figcaption>` with the
  member's chosen attribution (first name, occupation, area, cohort number).
  Get written consent from each person before publishing.

  - **Line 276** — `Placeholder — replace` · Trader, Ojota · Cohort 1
  - **Line 280** — `Placeholder — replace` · Teacher, Ajah · Cohort 2
  - **Line 284** — `Placeholder — replace` · Engineer, Ikeja · Cohort 2

### Sponsored-Seat Counter (Lines 330–334)

- **Line 330** — HTML comment: `REPLACE: wire these two numbers to a real source before publishing`
- **Line 331** — `<div class="counter__n">37</div>` — The `37` is a placeholder.
  Replace with the real count of sponsored seats sold to date.
- **Line 334** — `62% of the August cohort funded` — The `62%` is a placeholder.
  Replace with the real funded percentage.
  Update both figures each cohort cycle.

### Cohort Date (Lines 84, 368, 372)

- **Line 84** — `Sat 5 Sept` — Cohort date in the hero stats card.
  Update each cohort cycle to the actual next start date.
- **Line 368** — `href="#"` on "Register for the August cohort" button.
  Point this to `contact.html#register` (or your booking system URL).
- **Line 369** — `href="#"` on "Ask a question on WhatsApp" button.
  Set to `https://wa.me/234XXXXXXXXXX` with your real number.
- **Line 372** — `Saturday 8 August 2026, 4:00pm` — Update each cohort cycle.

---

## curriculum.html

### Cohort Date & Countdown Target (assets/app.js Line 104)

- **assets/app.js line 104** — `var targetDate = '2026-08-08T19:00:00+01:00';`
  This is the date the countdown timer on the curriculum page counts down to.
  Update to the real cohort start date and time in ISO 8601 format each cycle.
  Example: `'2027-01-10T16:00:00+01:00'`

- **Line 417** — `href="#"` on "Register for the August cohort" button.
  Set to `contact.html#register`.

---

## fees.html

### Stage 2 Price (Lines 103–107)

- **Line 103** — HTML comment: `SET YOUR FEE: replace ₦XX,XXX below with the real Stage 2 monthly fee`
- **Line 107** — `₦XX,XXX / month` — Replace with the real Stage 2 monthly fee.
  Example: `₦15,000 / month`

### Stage 3 Price (Lines 112–116)

- **Line 112** — HTML comment: `SET YOUR FEE: replace ₦XX,XXX below with the real Stage 3 monthly fee`
- **Line 116** — `₦XX,XXX / month` — Replace with the real Stage 3 monthly fee.

### Cohort Date & Buttons (Lines 79, 214, 270–271)

- **Line 79** — `Sat 5 Sept` — Update each cohort cycle.
- **Line 214** — `62% of the August cohort funded` — Update each cohort cycle.
- **Line 270** — `href="#"` on "Register for the August cohort" — Set to `contact.html#register`.
- **Line 271** — `href="#"` on "Ask a question on WhatsApp" — Set to `https://wa.me/234XXXXXXXXXX`.

---

## about.html

### Stats Block (Lines 172–179)

> [!IMPORTANT]
> The stats block header comment reads "these four figures are placeholders. Publish only numbers you can evidence." Three of the four stats (120 topics, 4 classes/month, 1 in 10 seats) are derived from the curriculum structure and are accurate. The fourth (₦0 to walk through the door) is also accurate. Verify all four before launch, and replace the HTML comment at line 172 with a real verification note or remove it.

- **Line 172** — HTML comment: `REPLACE: these four figures are placeholders. Publish only numbers you can evidence.`
  Verify and then remove this comment once confirmed.

### Facilitator Cards (Lines 185–208)

> [!CAUTION]
> All four facilitator cards are placeholders. Do not publish until real people, bios, and photos are provided.

- **Line 185** — HTML comment: `REPLACE BEFORE PUBLISHING: photo slots and all four names, roles and bios are placeholders.`
  Remove this comment when real data is in place.
- **Lines 195–196** — Facilitator 1 (Lead facilitator):
  - Replace the empty `<div class="person__ph">` with a real `<img>` tag.
    Example: `<img src="assets/img/name-surname.jpg" alt="Name Surname — Lead facilitator" width="240" height="240">`
  - Replace `Name — replace` with the real name.
  - Replace the bio paragraph with one or two real sentences.
- **Lines 199–200** — Facilitator 2 (Kingdom Finance): same instructions as above.
- **Lines 203–204** — Facilitator 3 (Mind of Wealth): same instructions as above.
- **Lines 207–208** — Facilitator 4 (Juniors and community): same instructions as above.

  **Image specs**: 240×240px minimum, square crop, saved to `assets/img/`.

---

## contact.html

### WhatsApp Number (Lines 73–78, 165, 262)

- **Line 73** — HTML comment: `REPLACE: put your real WhatsApp number, email and phone in the four cards below`
- **Line 74** — `<a class="way rv" href="#">` (WhatsApp card link) — Replace `href="#"` with `https://wa.me/234XXXXXXXXXX` using your real number in international format without the `+` or spaces. Example: `https://wa.me/2348012345678`
- **Line 78** — `+234 000 000 0000` — Replace with your real WhatsApp number in display format. Example: `+234 801 234 5678`
- **Line 165** — Error message contains `+234 000 000 0000 (REPLACE with real number)`. Update to the real number in the same error message so the fallback WhatsApp link is live.
- **Line 262** — `<a href="#">Ask on WhatsApp</a>` footer link — Set to `https://wa.me/234XXXXXXXXXX`.

  Also update the same footer link on `index.html` (line 411) and `fees.html` (line TBC in footer).

### Email Address (Lines 80–84)

- **Line 80** — `<a class="way rv" href="#">` (Email card link) — Replace `href="#"` with `href="mailto:hello@financeclinic.ng"` once confirmed, or with the real address if different.
- **Line 84** — `hello@financeclinic.ng` — Confirm this is the correct email address. If it differs, update both the visible text and the `href` on line 80.

### Map Placeholder (Lines 201–202)

- **Line 201** — HTML comment: `REPLACE: swap this block for a real embedded map and put the actual address below`
- **Line 202** — `<div class="mapph" data-label="Map — embed your venue location">` — Replace this entire `<div class="mapph">...</div>` block with an embedded Google Map iframe. To get the embed code:
  1. Go to maps.google.com and find the venue.
  2. Click Share → Embed a map → Copy HTML.
  3. Paste the `<iframe>` in place of the mapph div.
  4. Add `style="border:0;width:100%;height:360px;border-radius:12px;"` to the iframe.

### Web3Forms Access Key (Line 115)

- **Line 115** — `<input type="hidden" name="access_key" value="REPLACE_ME">` — Replace `REPLACE_ME` with your real Web3Forms access key.
  1. Go to https://web3forms.com
  2. Enter your email address to receive a free access key.
  3. Paste the key in place of `REPLACE_ME`.
  Submissions will not be received until this is done.

### Cohort Date in Sidebar (Line 172)

- **Line 172** — `<b>Sat 5 September</b>` — Update each cohort cycle to the real start date.

---

## All Pages — CTA Buttons Pointing to `href="#"`

The following CTA buttons use `href="#"` as a placeholder. They should point
to `contact.html#register` or a real booking URL:

| File | Line | Button text |
|---|---|---|
| `index.html` | 368 | Register for the August cohort |
| `index.html` | 369 | Ask a question on WhatsApp → `https://wa.me/234XXXXXXXXXX` |
| `fees.html` | 270 | Register for the August cohort |
| `fees.html` | 271 | Ask a question on WhatsApp → `https://wa.me/234XXXXXXXXXX` |
| `curriculum.html` | 417 | Register for the August cohort |

---

## Deployment — Final Actions Required

1. **Web3Forms key** — See `contact.html` line 115 above.
2. **Cloudflare Pages** — Push this repository to GitHub (or GitLab), then connect it to Cloudflare Pages:
   - Build command: *(leave blank)*
   - Output directory: `/` (root)
   - No build step needed.
3. **Custom domain** — In Cloudflare Pages → Custom domains, add `financeclinic.ng` and `www.financeclinic.ng`. Update your DNS records as instructed by Cloudflare.
4. **Sitemap base URL** — Once the live domain is confirmed, verify that the `<loc>` URLs in `sitemap.xml` match the canonical domain (currently set to `https://financeclinic.ng/`).
5. **Google Search Console** — Submit `https://financeclinic.ng/sitemap.xml` in Google Search Console after going live.

---

*Generated by the Finance Clinic productionisation workflow — 1 August 2026.*
