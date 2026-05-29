const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL || 'Jasmel@medicalbillingmb.com';
const BREVO_SENDER_NAME = process.env.BREVO_SENDER_NAME || '305business.llc';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'jasmelacosta@gmail.com';

function sendBrevoEmail(toEmail, subject, htmlContent, textContent) {
  const payload = {
    sender: { name: BREVO_SENDER_NAME, email: BREVO_SENDER_EMAIL },
    to: [{ email: toEmail }],
    subject: subject,
    htmlContent: htmlContent,
  };
  if (textContent) payload.textContent = textContent;

  return fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': BREVO_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
}

function notifyNewInquiry(data) {
  const businessName = data.business_name || 'Your listing';
  const buyerName = data.buyer_name || 'A potential buyer';
  const buyerEmail = data.buyer_email || '';
  const message = data.message || '';
  const sellerEmail = data.seller_email || ADMIN_EMAIL;

  const subject = `📨 New inquiry on ${businessName} — 305business.llc`;
  const html = `<html>
<body style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: #1a4a7a; padding: 20px; border-radius: 8px 8px 0 0;">
    <h2 style="color: white; margin: 0;">305business.llc</h2>
    <p style="color: #a0c4e8; margin: 5px 0 0 0;">Miami Business Marketplace</p>
  </div>
  <div style="background: white; padding: 30px; border: 1px solid #e2e8f0; border-radius: 0 0 8px 8px;">
    <h3 style="color: #1a4a7a;">🔔 New Inquiry Received</h3>
    <p><strong>Business:</strong> ${businessName}</p>
    <p><strong>From:</strong> ${buyerName} (${buyerEmail})</p>
    <p><strong>Message:</strong></p>
    <blockquote style="background: #f7fafc; padding: 15px; border-left: 3px solid #1a4a7a; margin: 0;">${message}</blockquote>
    <p style="margin-top: 20px;">
      <a href="https://pablodd1.github.io/305business-llc/admin.html" style="background: #1a4a7a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">View in Admin Dashboard →</a>
    </p>
  </div>
</body>
</html>`;

  return sendBrevoEmail(sellerEmail, subject, html);
}

function notifyNewListing(data) {
  const businessName = data.business_name || 'New listing';
  const sellerName = data.seller_name || 'Seller';
  const sellerEmail = data.seller_email || '';
  const category = data.category || 'Unknown';

  const subject = `📋 New listing submission: ${businessName}`;
  const html = `<html>
<body style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: #1a4a7a; padding: 20px; border-radius: 8px 8px 0 0;">
    <h2 style="color: white; margin: 0;">305business.llc</h2>
    <p style="color: #a0c4e8; margin: 5px 0 0 0;">Admin Notification</p>
  </div>
  <div style="background: white; padding: 30px; border: 1px solid #e2e8f0; border-radius: 0 0 8px 8px;">
    <h3 style="color: #1a4a7a;">📋 New Listing Submission</h3>
    <p><strong>Business:</strong> ${businessName}</p>
    <p><strong>Category:</strong> ${category}</p>
    <p><strong>Seller:</strong> ${sellerName} (${sellerEmail})</p>
    <p><strong>Status:</strong> Pending Review</p>
    <p style="margin-top: 20px;">
      <a href="https://pablodd1.github.io/305business-llc/admin.html" style="background: #1a4a7a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Review in Admin →</a>
    </p>
  </div>
</body>
</html>`;

  return sendBrevoEmail(ADMIN_EMAIL, subject, html);
}

function notifyNewValuation(data) {
  const businessName = data.business_name || 'Business';
  const contactName = data.contact_name || 'Requester';
  const contactEmail = data.contact_email || '';
  const tier = data.tier_requested || 'Free Preliminary';

  // Notify admin
  const adminSubject = `📊 New valuation request: ${businessName}`;
  const adminHtml = `<html>
<body style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: #1a4a7a; padding: 20px; border-radius: 8px 8px 0 0;">
    <h2 style="color: white; margin: 0;">305business.llc</h2>
  </div>
  <div style="background: white; padding: 30px; border: 1px solid #e2e8f0; border-radius: 0 0 8px 8px;">
    <h3 style="color: #1a4a7a;">📊 New Valuation Request</h3>
    <p><strong>Business:</strong> ${businessName}</p>
    <p><strong>Requester:</strong> ${contactName} (${contactEmail})</p>
    <p><strong>Tier:</strong> ${tier}</p>
    <p style="margin-top: 20px;">
      <a href="https://pablodd1.github.io/305business-llc/admin.html" style="background: #1a4a7a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">View in Admin →</a>
    </p>
  </div>
</body>
</html>`;

  const promises = [sendBrevoEmail(ADMIN_EMAIL, adminSubject, adminHtml)];

  // Send confirmation to requester
  if (contactEmail) {
    const confirmSubject = `✅ Valuation request received — 305business.llc`;
    const confirmHtml = `<html>
<body style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: #1a4a7a; padding: 20px; border-radius: 8px 8px 0 0;">
    <h2 style="color: white; margin: 0;">305business.llc</h2>
  </div>
  <div style="background: white; padding: 30px; border: 1px solid #e2e8f0; border-radius: 0 0 8px 8px;">
    <h3 style="color: #1a4a7a;">✅ Valuation Request Received</h3>
    <p>Hi ${contactName},</p>
    <p>We've received your valuation request for <strong>${businessName}</strong>.</p>
    <p><strong>Selected tier:</strong> ${tier}</p>
    <p>Our team will review your submission and contact you within 24 hours to discuss next steps.</p>
    <p style="margin-top: 20px;">
      <a href="https://pablodd1.github.io/305business-llc/valuation.html" style="background: #1a4a7a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">View Pricing →</a>
    </p>
  </div>
</body>
</html>`;
    promises.push(sendBrevoEmail(contactEmail, confirmSubject, confirmHtml));
  }

  return Promise.all(promises);
}

function notifyNewContact(data) {
  const name = data.name || 'Visitor';
  const email = data.email || '';
  const subjectLine = data.subject || 'General inquiry';
  const message = data.message || '';

  const subject = `📩 Contact form: ${subjectLine}`;
  const html = `<html>
<body style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: #1a4a7a; padding: 20px; border-radius: 8px 8px 0 0;">
    <h2 style="color: white; margin: 0;">305business.llc</h2>
    <p style="color: #a0c4e8; margin: 5px 0 0 0;">Contact Form Notification</p>
  </div>
  <div style="background: white; padding: 30px; border: 1px solid #e2e8f0; border-radius: 0 0 8px 8px;">
    <h3 style="color: #1a4a7a;">📩 New Contact Message</h3>
    <p><strong>From:</strong> ${name} (${email})</p>
    <p><strong>Subject:</strong> ${subjectLine}</p>
    <p><strong>Message:</strong></p>
    <blockquote style="background: #f7fafc; padding: 15px; border-left: 3px solid #1a4a7a; margin: 0;">${message}</blockquote>
    <p style="margin-top: 20px;">
      <a href="https://pablodd1.github.io/305business-llc/admin.html" style="background: #1a4a7a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">View in Admin →</a>
    </p>
  </div>
</body>
</html>`;

  return sendBrevoEmail(ADMIN_EMAIL, subject, html);
}

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  if (!BREVO_API_KEY) {
    res.status(500).json({ error: 'BREVO_API_KEY not configured' });
    return;
  }

  const { event_type, ...data } = req.body;

  const handlers = {
    new_inquiry: notifyNewInquiry,
    new_listing: notifyNewListing,
    new_valuation: notifyNewValuation,
    new_contact: notifyNewContact,
  };

  const handler = handlers[event_type];
  if (!handler) {
    res.status(400).json({ error: `Unknown event type: ${event_type}` });
    return;
  }

  try {
    await handler(data);
    res.status(200).json({ success: true });
  } catch (err) {
    console.error('Notification error:', err);
    res.status(500).json({ error: err.message });
  }
};
