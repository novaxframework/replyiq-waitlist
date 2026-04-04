# ReplyIQ Waitlist — Google Sheets Backend Setup

## Step 1: Create the Google Sheet
1. Go to https://sheets.google.com → create a new sheet
2. Name it "ReplyIQ Waitlist"
3. Leave it blank — the script will add headers automatically

## Step 2: Open Apps Script
1. In the sheet, click Extensions → Apps Script
2. Delete the default code
3. Paste the contents of apps-script.js

## Step 3: Update Your Email
- Find: `const ownerEmail = 'YOUR_EMAIL@gmail.com';`
- Replace with your actual email

## Step 4: Deploy as Web App
1. Click Deploy → New Deployment
2. Type: Web app
3. Execute as: Me
4. Who has access: Anyone
5. Click Deploy → Authorize → Copy the Web App URL

## Step 5: Update the Frontend
1. Open index.html
2. Find: `const APPS_SCRIPT_URL = 'YOUR_APPS_SCRIPT_URL_HERE';`
3. Replace with your Web App URL
4. Redeploy to Vercel

## What happens on each signup
- Row appended to Google Sheet (Timestamp, Business Name, Email, Platform, Source)
- Confirmation email sent to the user
- Notification email sent to you with running signup count
