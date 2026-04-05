// ================================================
// ReplyIQ Waitlist Backend — Google Apps Script
// ================================================
// IMPORTANT: Apps Script now handles doGet() with URL params
// The frontend fires a GET request via hidden iframe (no CORS issues)

function doGet(e) {
  try {
    const params = e.parameter;
    
    // If no email param, it's just a ping
    if (!params.email) {
      return ContentService
        .createTextOutput(JSON.stringify({ status: 'ReplyIQ Waitlist Backend is live ✅' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Add header row if sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Timestamp', 'Business Name', 'Email', 'Platform', 'Source']);
      const headerRange = sheet.getRange(1, 1, 1, 5);
      headerRange.setBackground('#1a1a2e');
      headerRange.setFontColor('#ffffff');
      headerRange.setFontWeight('bold');
    }
    
    // Append the new signup
    sheet.appendRow([
      new Date().toISOString(),
      params.businessName || '',
      params.email || '',
      params.platform || '',
      params.source || 'waitlist-form'
    ]);
    
    // Send confirmation email to the user
    if (params.email) {
      sendConfirmationEmail(params.email, params.businessName);
    }
    
    // Notify owner
    notifyOwner(params);
    
    return ContentService
      .createTextOutput(JSON.stringify({ success: true, message: 'Added to waitlist!' }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function sendConfirmationEmail(email, businessName) {
  const name = businessName || 'there';
  MailApp.sendEmail({
    to: email,
    subject: "You're on the ReplyIQ waitlist 🎉",
    htmlBody: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #f9f9f9;">
        <div style="background: linear-gradient(135deg, #6c63ff, #3ecfcf); padding: 32px; border-radius: 12px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">ReplyIQ</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0;">AI-powered review replies</p>
        </div>
        <div style="background: white; padding: 32px; border-radius: 12px; margin-top: 16px;">
          <h2 style="color: #1a1a2e;">Hey ${name}! You're on the list 🙌</h2>
          <p style="color: #555; line-height: 1.6;">Thanks for joining the ReplyIQ waitlist. You're among the first businesses to get access when we launch.</p>
          <div style="background: #f0f0ff; border-left: 4px solid #6c63ff; padding: 16px; border-radius: 4px; margin: 24px 0;">
            <strong style="color: #6c63ff;">🎁 Early Bird Perk</strong><br>
            <span style="color: #555;">As a waitlist member, you'll get your <strong>first month free</strong> when we launch.</span>
          </div>
          <p style="color: #555; line-height: 1.6;">We'll reach out as soon as your access is ready.</p>
          <p style="color: #888; font-size: 14px; margin-top: 32px;">— The ReplyIQ Team</p>
        </div>
      </div>
    `
  });
}

function notifyOwner(data) {
  const ownerEmail = 'YOUR_EMAIL@gmail.com'; // ← Update this
  const count = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getLastRow() - 1;
  
  MailApp.sendEmail({
    to: ownerEmail,
    subject: `🔔 New ReplyIQ Signup — ${data.businessName || data.email}`,
    body: `New waitlist signup!\n\nBusiness: ${data.businessName || 'N/A'}\nEmail: ${data.email}\nPlatform: ${data.platform || 'N/A'}\nTime: ${new Date().toLocaleString()}\n\nTotal signups: ${count}`
  });
}