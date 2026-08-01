/**
 * Finance Clinic — Google Apps Script Lead Automation Backend
 * Code.gs
 * 
 * Instructions:
 * 1. Open a new Google Sheet (e.g. named "Finance Clinic Leads").
 * 2. Click Extensions > Apps Script.
 * 3. Replace all code in Code.gs with this script.
 * 4. Go to Project Settings (Gear icon) > Script Properties and add:
 *    - NOTIFICATION_EMAIL = your_email@domain.com
 * 5. Click Deploy > New deployment > Select type "Web app".
 *    - Execute as: "Me"
 *    - Who has access: "Anyone"
 * 6. Copy the Web App URL and set it as GOOGLE_APPS_SCRIPT_URL in Cloudflare Pages.
 */

function doPost(e) {
  try {
    // 1. Parse JSON payload
    var data = {};
    if (e && e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    } else if (e && e.parameter) {
      data = e.parameter;
    }

    var timestamp = data.timestamp || new Date().toISOString();
    var name = data.name || 'N/A';
    var email = data.email || 'N/A';
    var phone = data.phone || 'N/A';
    var company = data.company || 'N/A';
    var message = data.message || 'N/A';
    var format = data.format || 'N/A';
    var reason = data.reason || 'N/A';
    var sponsored = data.sponsored || 'No';
    var printed = data.printed || 'No';
    var juniors = data.juniors || 'No';
    var pageUrl = data.pageUrl || 'N/A';
    var referrer = data.referrer || 'N/A';
    var utmSource = data.utmSource || 'N/A';
    var utmMedium = data.utmMedium || 'N/A';
    var utmCampaign = data.utmCampaign || 'N/A';
    var utmContent = data.utmContent || 'N/A';
    var utmTerm = data.utmTerm || 'N/A';
    var ipHash = data.ipHash || 'N/A';
    var userAgent = data.userAgent || 'N/A';
    var country = data.country || 'N/A';

    // 2. Append to Google Sheet
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Ensure Header Row exists
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Timestamp',
        'Name',
        'Email',
        'Phone',
        'Company',
        'Format / Attendance',
        'Reason / Category',
        'Need Sponsored Seat?',
        'Need Printed Notes?',
        'Bringing Children?',
        'Message',
        'Page URL',
        'Referrer',
        'UTM Source',
        'UTM Medium',
        'UTM Campaign',
        'UTM Content',
        'UTM Term',
        'IP Address',
        'User Agent',
        'Country'
      ]);
      // Format Header Row
      var headerRange = sheet.getRange(1, 1, 1, 21);
      headerRange.setFontWeight('bold');
      headerRange.setBackground('#0A1A2B');
      headerRange.setFontColor('#FFFFFF');
    }

    // Append Lead Row
    sheet.appendRow([
      timestamp,
      name,
      email,
      phone,
      company,
      format,
      reason,
      sponsored,
      printed,
      juniors,
      message,
      pageUrl,
      referrer,
      utmSource,
      utmMedium,
      utmCampaign,
      utmContent,
      utmTerm,
      ipHash,
      userAgent,
      country
    ]);

    // 3. Send Notification Email to Website Owner
    var scriptProperties = PropertiesService.getScriptProperties();
    var ownerEmail = scriptProperties.getProperty('NOTIFICATION_EMAIL') || 'hello@financeclinic.ng';

    var ownerSubject = 'New Website Lead Received — ' + name;
    var ownerBody = 'New Lead Received\n\n' +
      'Name: ' + name + '\n' +
      'Email: ' + email + '\n' +
      'Phone: ' + phone + '\n' +
      'Company: ' + company + '\n' +
      'Attendance Format: ' + format + '\n' +
      'Reason: ' + reason + '\n' +
      'Sponsored Seat Requested: ' + sponsored + '\n' +
      'Printed Notes Requested: ' + printed + '\n' +
      'Bringing Children: ' + juniors + '\n\n' +
      'Message:\n' + message + '\n\n' +
      '--- Tracking Details ---\n' +
      'Page URL: ' + pageUrl + '\n' +
      'Referrer: ' + referrer + '\n' +
      'UTM Source: ' + utmSource + '\n' +
      'UTM Medium: ' + utmMedium + '\n' +
      'UTM Campaign: ' + utmCampaign + '\n' +
      'Timestamp: ' + timestamp + '\n' +
      'Country: ' + country;

    MailApp.sendEmail({
      to: ownerEmail,
      subject: ownerSubject,
      body: ownerBody
    });

    // 4. Send Visitor Auto-Response Email (if valid email)
    if (email && email !== 'N/A' && email.indexOf('@') !== -1) {
      var visitorSubject = "We've Received Your Message — Finance Clinic";
      var visitorBody = 'Dear ' + name + ',\n\n' +
        'Thank you for reaching out to Finance Clinic.\n\n' +
        'Your registration / message has been received successfully. Our team will review your enquiry and get back to you with the venue details and first class schedule as soon as possible.\n\n' +
        'Warm regards,\n' +
        'Finance Clinic Team\n' +
        'Lagos, Nigeria\n' +
        'https://financeclinic.ng/';

      MailApp.sendEmail({
        to: email,
        subject: visitorSubject,
        body: visitorBody
      });
    }

    // 5. Return Success JSON
    return ContentService
      .createTextOutput(JSON.stringify({ success: true, message: 'Submission received.' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    Logger.log('Error in doPost: ' + error.toString());
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, message: 'Apps Script error: ' + error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'active', service: 'Finance Clinic Lead Capture API' }))
    .setMimeType(ContentService.MimeType.JSON);
}
