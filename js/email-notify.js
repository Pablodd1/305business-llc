/**
 * 305business.llc Email Notification Module
 * Uses Brevo (Sendinblue) Transactional Email API
 * 
 * SETUP:
 * 1. Set your Brevo API key: window.SENDINBLUE_API_KEY = 'your-key-here'
 * 2. Include after supabase-client.js:
 *    <script src="js/email-notify.js"></script>
 * 
 * No external dependencies — native fetch() only.
 */

(function(global) {
    'use strict';

    // ═══════════════════════════════════════════════════════════
    // CONFIGURATION
    // ═══════════════════════════════════════════════════════════
    var CONFIG = {
        BREVO_API_URL: 'https://api.brevo.com/v3/smtp/email',
        API_KEY: global.SENDINBLUE_API_KEY || '',
        FROM_EMAIL: 'info@305business.llc',
        FROM_NAME: '305business.llc Notifications',
        NOTIFY_EMAIL: 'jasmelacosta@gmail.com',
        NOTIFY_NAME: 'Jasmel Acosta',
        REPLY_TO: 'info@305business.llc'
    };

    // ═══════════════════════════════════════════════════════════
    // HTML ESCAPE
    // ═══════════════════════════════════════════════════════════
    function escapeHtml(text) {
        if (!text) return '';
        if (typeof document !== 'undefined' && document.createElement) {
            var div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }
        return String(text)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function fmtCurrency(val) {
        if (!val || isNaN(val)) return 'N/A';
        return '$' + Number(val).toLocaleString('en-US');
    }

    function fmtPhone(phone) {
        return phone || 'Not provided';
    }

    // ═══════════════════════════════════════════════════════════
    // EMAIL WRAPPER
    // ═══════════════════════════════════════════════════════════
    function wrapEmail(title, accent, content) {
        accent = accent || '#1a4a7a';
        return '<!DOCTYPE html>' +
            '<html lang="en">' +
            '<head>' +
            '<meta charset="UTF-8">' +
            '<meta name="viewport" content="width=device-width, initial-scale=1.0">' +
            '<title>' + escapeHtml(title) + '</title>' +
            '<style>' +
            'body,table,td,p,a,li,blockquote{-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%}' +
            'table,td{mso-table-lspace:0pt;mso-table-rspace:0pt}' +
            'img{-ms-interpolation-mode:bicubic;border:0;outline:none;text-decoration:none}' +
            '@media screen and (max-width:600px){' +
            '.container{width:100%!important;max-width:100%!important}' +
            '.content-padding{padding:20px!important}' +
            '.hide-mobile{display:none!important}' +
            '.stack-mobile{display:block!important;width:100%!important}' +
            '.stat-box{margin-bottom:12px!important}' +
            '}' +
            '</style>' +
            '</head>' +
            '<body style="margin:0;padding:0;background-color:#f4f6f8;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif">' +
            '<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">' +
            '<tr><td align="center" style="padding:24px 0;">' +
            '<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" class="container" style="max-width:600px;width:100%;background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08)">' +
            '<tr><td style="background:' + accent + ';padding:24px 32px;text-align:center">' +
            '<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">' +
            '<tr><td align="center">' +
            '<div style="display:inline-block;background:rgba(255,255,255,0.15);border-radius:8px;padding:8px 16px">' +
            '<span style="color:#ffffff;font-size:20px;font-weight:700;letter-spacing:0.05em">305business</span>' +
            '<span style="color:rgba(255,255,255,0.7);font-size:14px">.LLC</span>' +
            '</div>' +
            '</td></tr>' +
            '<tr><td align="center" style="padding-top:8px">' +
            '<span style="color:rgba(255,255,255,0.7);font-size:11px;text-transform:uppercase;letter-spacing:0.15em">Miami Business Marketplace</span>' +
            '</td></tr>' +
            '</table>' +
            '</td></tr>' +
            '<tr><td class="content-padding" style="padding:32px">' + content + '</td></tr>' +
            '<tr><td style="padding:0 32px"><div style="height:1px;background:#e8eaed"></div></td></tr>' +
            '<tr><td style="padding:24px 32px;text-align:center">' +
            '<p style="margin:0 0 8px;color:#5f6368;font-size:12px;line-height:1.5"><strong>305business.llc</strong> — Miami\'s Premier Business Marketplace</p>' +
            '<p style="margin:0;color:#9aa0a6;font-size:11px;line-height:1.5">Serving Miami-Dade, Broward & Palm Beach Counties</p>' +
            '<p style="margin:12px 0 0;color:#9aa0a6;font-size:10px">This is an automated notification. Please do not reply directly to this email.</p>' +
            '<p style="margin:8px 0 0"><a href="https://305business.llc" style="color:' + accent + ';font-size:12px;text-decoration:none;font-weight:500">305business.llc →</a></p>' +
            '</td></tr>' +
            '</table>' +
            '</td></tr>' +
            '</table>' +
            '</body>' +
            '</html>';
    }

    // ═══════════════════════════════════════════════════════════
    // TEMPLATES
    // ═══════════════════════════════════════════════════════════

    function newListingTemplate(data) {
        var accent = '#1a4a7a';
        var price = fmtCurrency(data.asking_price);
        var revenue = fmtCurrency(data.annual_revenue);
        var loc = escapeHtml(data.location || 'Miami, FL');

        var content =
            '<h1 style="margin:0 0 8px;color:#202124;font-size:22px;font-weight:700">📋 New Business Listing Submitted</h1>' +
            '<p style="margin:0 0 24px;color:#5f6368;font-size:14px">A new business has been submitted for review on 305business.llc</p>' +
            '<div style="display:inline-block;background:#fff8e1;border:1px solid #ffc107;border-radius:20px;padding:4px 14px;margin-bottom:24px">' +
            '<span style="color:#f57c00;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em">⏳ Pending Review</span>' +
            '</div>' +
            '<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background:#f8f9fa;border-radius:8px;margin-bottom:24px">' +
            '<tr><td style="padding:20px">' +
            '<h2 style="margin:0 0 4px;color:' + accent + ';font-size:18px;font-weight:700">' + escapeHtml(data.business_name || 'Unnamed Business') + '</h2>' +
            '<p style="margin:0 0 16px;color:#5f6368;font-size:13px;text-transform:uppercase;letter-spacing:0.05em">' + escapeHtml(data.category || 'Business') + ' • ' + loc + '</p>' +
            '<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">' +
            '<tr>' +
            '<td class="stack-mobile" width="50%" style="padding-right:8px">' +
            '<div class="stat-box" style="background:#ffffff;border-radius:6px;padding:12px;border:1px solid #e8eaed">' +
            '<p style="margin:0;color:#9aa0a6;font-size:11px;text-transform:uppercase;letter-spacing:0.05em">Asking Price</p>' +
            '<p style="margin:4px 0 0;color:#202124;font-size:18px;font-weight:700">' + price + '</p>' +
            '</div>' +
            '</td>' +
            '<td class="stack-mobile" width="50%" style="padding-left:8px">' +
            '<div class="stat-box" style="background:#ffffff;border-radius:6px;padding:12px;border:1px solid #e8eaed">' +
            '<p style="margin:0;color:#9aa0a6;font-size:11px;text-transform:uppercase;letter-spacing:0.05em">Annual Revenue</p>' +
            '<p style="margin:4px 0 0;color:#202124;font-size:18px;font-weight:700">' + revenue + '</p>' +
            '</div>' +
            '</td>' +
            '</tr>' +
            '</table>' +
            '</td></tr>' +
            '</table>' +
            '<h3 style="margin:0 0 12px;color:#202124;font-size:14px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em">Seller Contact</h3>' +
            '<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom:24px">' +
            '<tr><td style="padding:12px 0;border-bottom:1px solid #e8eaed">' +
            '<span style="color:#9aa0a6;font-size:12px;display:inline-block;width:80px">Name</span>' +
            '<span style="color:#202124;font-size:14px;font-weight:500">' + escapeHtml(data.seller_name || 'Not provided') + '</span>' +
            '</td></tr>' +
            '<tr><td style="padding:12px 0;border-bottom:1px solid #e8eaed">' +
            '<span style="color:#9aa0a6;font-size:12px;display:inline-block;width:80px">Email</span>' +
            '<a href="mailto:' + escapeHtml(data.seller_email || '') + '" style="color:' + accent + ';font-size:14px;text-decoration:none">' + escapeHtml(data.seller_email || 'Not provided') + '</a>' +
            '</td></tr>' +
            '<tr><td style="padding:12px 0">' +
            '<span style="color:#9aa0a6;font-size:12px;display:inline-block;width:80px">Phone</span>' +
            '<span style="color:#202124;font-size:14px">' + fmtPhone(data.seller_phone) + '</span>' +
            '</td></tr>' +
            '</table>' +
            '<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">' +
            '<tr><td align="center" style="padding:16px 0">' +
            '<a href="https://305business.llc/admin" style="display:inline-block;background:' + accent + ';color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:6px;font-size:14px;font-weight:600">Review in Admin Panel →</a>' +
            '</td></tr>' +
            '</table>';

        return wrapEmail('New Listing Alert — 305business.llc', accent, content);
    }

    function newInquiryTemplate(data) {
        var accent = '#1a4a7a';

        var content =
            '<h1 style="margin:0 0 8px;color:#202124;font-size:22px;font-weight:700">💬 New Buyer Inquiry</h1>' +
            '<p style="margin:0 0 24px;color:#5f6368;font-size:14px">Someone is interested in a business on 305business.llc</p>' +
            '<div style="background:#e8f0fe;border-left:4px solid ' + accent + ';border-radius:0 6px 6px 0;padding:16px;margin-bottom:24px">' +
            '<p style="margin:0;color:#9aa0a6;font-size:11px;text-transform:uppercase;letter-spacing:0.05em">Business</p>' +
            '<p style="margin:4px 0 0;color:' + accent + ';font-size:16px;font-weight:700">' + escapeHtml(data.business_name || 'Unknown Listing') + '</p>' +
            '</div>' +
            '<h3 style="margin:0 0 12px;color:#202124;font-size:14px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em">Buyer Details</h3>' +
            '<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background:#f8f9fa;border-radius:8px;margin-bottom:24px">' +
            '<tr><td style="padding:20px">' +
            '<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">' +
            '<tr><td style="padding:8px 0;border-bottom:1px solid #e8eaed">' +
            '<span style="color:#9aa0a6;font-size:12px;display:inline-block;width:100px">Name</span>' +
            '<span style="color:#202124;font-size:14px;font-weight:500">' + escapeHtml(data.buyer_name || 'Anonymous') + '</span>' +
            '</td></tr>' +
            '<tr><td style="padding:8px 0;border-bottom:1px solid #e8eaed">' +
            '<span style="color:#9aa0a6;font-size:12px;display:inline-block;width:100px">Email</span>' +
            '<a href="mailto:' + escapeHtml(data.buyer_email || '') + '" style="color:' + accent + ';font-size:14px;text-decoration:none">' + escapeHtml(data.buyer_email || 'Not provided') + '</a>' +
            '</td></tr>' +
            '<tr><td style="padding:8px 0;border-bottom:1px solid #e8eaed">' +
            '<span style="color:#9aa0a6;font-size:12px;display:inline-block;width:100px">Phone</span>' +
            '<span style="color:#202124;font-size:14px">' + fmtPhone(data.buyer_phone) + '</span>' +
            '</td></tr>' +
            '<tr><td style="padding:8px 0">' +
            '<span style="color:#9aa0a6;font-size:12px;display:inline-block;width:100px">Inquiry Type</span>' +
            '<span style="color:#202124;font-size:14px;text-transform:capitalize">' + escapeHtml(data.inquiry_type || 'General') + '</span>' +
            '</td></tr>' +
            '</table>' +
            '</td></tr>' +
            '</table>' +
            '<h3 style="margin:0 0 12px;color:#202124;font-size:14px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em">Message</h3>' +
            '<div style="background:#ffffff;border:1px solid #e8eaed;border-radius:8px;padding:16px;margin-bottom:24px">' +
            '<p style="margin:0;color:#202124;font-size:14px;line-height:1.6;font-style:italic">"' + escapeHtml(data.message || 'No message provided.') + '"</p>' +
            '</div>' +
            '<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">' +
            '<tr><td align="center" style="padding:16px 0">' +
            '<a href="https://305business.llc/admin/inquiries" style="display:inline-block;background:' + accent + ';color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:6px;font-size:14px;font-weight:600">View All Inquiries →</a>' +
            '</td></tr>' +
            '</table>' +
            '<p style="margin:16px 0 0;color:#9aa0a6;font-size:12px;text-align:center"><strong>Tip:</strong> Respond within 24 hours for best engagement.</p>';

        return wrapEmail('New Buyer Inquiry — 305business.llc', accent, content);
    }

    function newContactTemplate(data) {
        var accent = '#1a4a7a';

        var contactRows =
            '<tr><td style="padding:10px 0;border-bottom:1px solid #e8eaed">' +
            '<span style="color:#9aa0a6;font-size:12px;display:inline-block;width:100px">Name</span>' +
            '<span style="color:#202124;font-size:14px;font-weight:500">' + escapeHtml(data.name || 'Anonymous') + '</span>' +
            '</td></tr>' +
            '<tr><td style="padding:10px 0;border-bottom:1px solid #e8eaed">' +
            '<span style="color:#9aa0a6;font-size:12px;display:inline-block;width:100px">Email</span>' +
            '<a href="mailto:' + escapeHtml(data.email || '') + '" style="color:' + accent + ';font-size:14px;text-decoration:none">' + escapeHtml(data.email || 'Not provided') + '</a>' +
            '</td></tr>';

        if (data.phone) {
            contactRows +=
                '<tr><td style="padding:10px 0;border-bottom:1px solid #e8eaed">' +
                '<span style="color:#9aa0a6;font-size:12px;display:inline-block;width:100px">Phone</span>' +
                '<span style="color:#202124;font-size:14px">' + fmtPhone(data.phone) + '</span>' +
                '</td></tr>';
        }

        contactRows +=
            '<tr><td style="padding:10px 0;border-bottom:1px solid #e8eaed">' +
            '<span style="color:#9aa0a6;font-size:12px;display:inline-block;width:100px">Interest</span>' +
            '<span style="color:#202124;font-size:14px;text-transform:capitalize">' + escapeHtml(data.subject || 'General Inquiry') + '</span>' +
            '</td></tr>';

        if (data.revenue_range) {
            contactRows +=
                '<tr><td style="padding:10px 0;border-bottom:1px solid #e8eaed">' +
                '<span style="color:#9aa0a6;font-size:12px;display:inline-block;width:100px">Revenue</span>' +
                '<span style="color:#202124;font-size:14px">' + escapeHtml(data.revenue_range) + '</span>' +
                '</td></tr>';
        }

        var content =
            '<h1 style="margin:0 0 8px;color:#202124;font-size:22px;font-weight:700">📨 New Contact Form Submission</h1>' +
            '<p style="margin:0 0 24px;color:#5f6368;font-size:14px">Someone submitted an inquiry through the 305business.llc contact form</p>' +
            '<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background:#f8f9fa;border-radius:8px;margin-bottom:24px">' +
            '<tr><td style="padding:20px">' +
            '<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">' +
            contactRows +
            '</table>' +
            '</td></tr>' +
            '</table>' +
            '<h3 style="margin:0 0 12px;color:#202124;font-size:14px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em">Message</h3>' +
            '<div style="background:#ffffff;border:1px solid #e8eaed;border-radius:8px;padding:20px;margin-bottom:24px">' +
            '<p style="margin:0;color:#202124;font-size:14px;line-height:1.7">' + escapeHtml(data.message || 'No message provided.').replace(/\n/g, '<br>') + '</p>' +
            '</div>' +
            '<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">' +
            '<tr><td align="center" style="padding:8px 0 16px">' +
            '<a href="mailto:' + escapeHtml(data.email || '') + '" style="display:inline-block;background:' + accent + ';color:#ffffff;text-decoration:none;padding:12px 28px;border-radius:6px;font-size:13px;font-weight:600;margin:0 4px">Reply via Email →</a>' +
            '<a href="https://305business.llc/admin/contacts" style="display:inline-block;background:#ffffff;color:' + accent + ';text-decoration:none;padding:12px 28px;border-radius:6px;font-size:13px;font-weight:600;border:1px solid ' + accent + ';margin:0 4px">View in Admin →</a>' +
            '</td></tr>' +
            '</table>';

        return wrapEmail('New Contact Form — 305business.llc', accent, content);
    }

    function listingApprovedTemplate(data) {
        var accent = '#2e7d32';
        var price = data.asking_price ? fmtCurrency(data.asking_price) : 'Price on request';

        var content =
            '<h1 style="margin:0 0 8px;color:#202124;font-size:22px;font-weight:700">✅ Your Listing is Live!</h1>' +
            '<p style="margin:0 0 24px;color:#5f6368;font-size:14px">Great news — your business listing has been approved and is now live on 305business.llc</p>' +
            '<div style="display:inline-block;background:#e8f5e9;border:1px solid #4caf50;border-radius:20px;padding:6px 18px;margin-bottom:24px">' +
            '<span style="color:#2e7d32;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em">✓ Approved & Published</span>' +
            '</div>' +
            '<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background:#f8f9fa;border-radius:8px;margin-bottom:24px">' +
            '<tr><td style="padding:20px">' +
            '<h2 style="margin:0 0 4px;color:' + accent + ';font-size:18px;font-weight:700">' + escapeHtml(data.business_name || 'Your Business') + '</h2>' +
            '<p style="margin:0 0 16px;color:#5f6368;font-size:13px">' + escapeHtml(data.category || 'Business') + ' • ' + escapeHtml(data.location || 'Miami, FL') + '</p>' +
            '<div style="background:#ffffff;border-radius:6px;padding:14px;border:1px solid #e8eaed;text-align:center">' +
            '<p style="margin:0;color:#9aa0a6;font-size:11px;text-transform:uppercase;letter-spacing:0.05em">Asking Price</p>' +
            '<p style="margin:4px 0 0;color:#202124;font-size:22px;font-weight:700">' + price + '</p>' +
            '</div>' +
            '</td></tr>' +
            '</table>' +
            '<h3 style="margin:0 0 12px;color:#202124;font-size:14px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em">What Happens Next</h3>' +
            '<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom:24px">' +
            '<tr><td style="padding:12px 0;border-bottom:1px solid #e8eaed">' +
            '<span style="color:' + accent + ';font-weight:700;margin-right:8px">1.</span>' +
            '<span style="color:#202124;font-size:14px">Buyers can now view and inquire about your listing</span>' +
            '</td></tr>' +
            '<tr><td style="padding:12px 0;border-bottom:1px solid #e8eaed">' +
            '<span style="color:' + accent + ';font-weight:700;margin-right:8px">2.</span>' +
            '<span style="color:#202124;font-size:14px">You\'ll receive email notifications for every inquiry</span>' +
            '</td></tr>' +
            '<tr><td style="padding:12px 0;border-bottom:1px solid #e8eaed">' +
            '<span style="color:' + accent + ';font-weight:700;margin-right:8px">3.</span>' +
            '<span style="color:#202124;font-size:14px">Respond within 24 hours for best results</span>' +
            '</td></tr>' +
            '<tr><td style="padding:12px 0">' +
            '<span style="color:' + accent + ';font-weight:700;margin-right:8px">4.</span>' +
            '<span style="color:#202124;font-size:14px">Track performance in your seller dashboard</span>' +
            '</td></tr>' +
            '</table>' +
            '<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">' +
            '<tr><td align="center" style="padding:16px 0">' +
            '<a href="' + (data.listing_url || 'https://305business.llc/listings') + '" style="display:inline-block;background:' + accent + ';color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:6px;font-size:14px;font-weight:600">View Your Listing →</a>' +
            '</td></tr>' +
            '</table>' +
            '<p style="margin:16px 0 0;color:#9aa0a6;font-size:12px;text-align:center">' +
            'Questions? Reply to this email or contact us at <a href="mailto:info@305business.llc" style="color:' + accent + ';text-decoration:none">info@305business.llc</a>' +
            '</p>';

        return wrapEmail('Listing Approved — 305business.llc', accent, content);
    }

    function listingRejectedTemplate(data) {
        var accent = '#c62828';

        var content =
            '<h1 style="margin:0 0 8px;color:#202124;font-size:22px;font-weight:700">❌ Listing Not Approved</h1>' +
            '<p style="margin:0 0 24px;color:#5f6368;font-size:14px">We reviewed your business listing submission and unfortunately could not approve it at this time.</p>' +
            '<div style="display:inline-block;background:#ffebee;border:1px solid #ef5350;border-radius:20px;padding:6px 18px;margin-bottom:24px">' +
            '<span style="color:#c62828;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em">Requires Revision</span>' +
            '</div>' +
            '<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background:#f8f9fa;border-radius:8px;margin-bottom:24px">' +
            '<tr><td style="padding:20px">' +
            '<h2 style="margin:0 0 4px;color:' + accent + ';font-size:18px;font-weight:700">' + escapeHtml(data.business_name || 'Your Business') + '</h2>' +
            '<p style="margin:0;color:#5f6368;font-size:13px">Submitted on ' + escapeHtml(data.submitted_date || 'Recently') + '</p>' +
            '</td></tr>' +
            '</table>' +
            '<h3 style="margin:0 0 12px;color:#202124;font-size:14px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em">Reason for Rejection</h3>' +
            '<div style="background:#ffebee;border-left:4px solid ' + accent + ';border-radius:0 6px 6px 0;padding:16px;margin-bottom:24px">' +
            '<p style="margin:0;color:#202124;font-size:14px;line-height:1.6">' + escapeHtml(data.reason || 'Your listing did not meet our quality guidelines. Please review our requirements and resubmit.') + '</p>' +
            '</div>' +
            '<h3 style="margin:0 0 12px;color:#202124;font-size:14px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em">How to Fix</h3>' +
            '<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom:24px">' +
            '<tr><td style="padding:10px 0;border-bottom:1px solid #e8eaed">' +
            '<span style="color:' + accent + ';font-weight:700;margin-right:8px">•</span>' +
            '<span style="color:#202124;font-size:14px">Ensure all financial information is accurate and verifiable</span>' +
            '</td></tr>' +
            '<tr><td style="padding:10px 0;border-bottom:1px solid #e8eaed">' +
            '<span style="color:' + accent + ';font-weight:700;margin-right:8px">•</span>' +
            '<span style="color:#202124;font-size:14px">Upload at least 3 high-quality photos (exterior, interior, equipment)</span>' +
            '</td></tr>' +
            '<tr><td style="padding:10px 0;border-bottom:1px solid #e8eaed">' +
            '<span style="color:' + accent + ';font-weight:700;margin-right:8px">•</span>' +
            '<span style="color:#202124;font-size:14px">Provide a detailed, honest description of the business</span>' +
            '</td></tr>' +
            '<tr><td style="padding:10px 0">' +
            '<span style="color:' + accent + ';font-weight:700;margin-right:8px">•</span>' +
            '<span style="color:#202124;font-size:14px">Make sure contact information is complete and accurate</span>' +
            '</td></tr>' +
            '</table>' +
            '<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">' +
            '<tr><td align="center" style="padding:16px 0">' +
            '<a href="https://305business.llc/list-business.html" style="display:inline-block;background:' + accent + ';color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:6px;font-size:14px;font-weight:600">Resubmit Listing →</a>' +
            '</td></tr>' +
            '</table>' +
            '<p style="margin:16px 0 0;color:#9aa0a6;font-size:12px;text-align:center">' +
            'Need help? Contact us at <a href="mailto:info@305business.llc" style="color:' + accent + ';text-decoration:none">info@305business.llc</a>' +
            '</p>';

        return wrapEmail('Listing Update — 305business.llc', accent, content);
    }

    // ═══════════════════════════════════════════════════════════
    // CORE API
    // ═══════════════════════════════════════════════════════════

    var TEMPLATES = {
        new_listing: newListingTemplate,
        new_inquiry: newInquiryTemplate,
        new_contact: newContactTemplate,
        listing_approved: listingApprovedTemplate,
        listing_rejected: listingRejectedTemplate
    };

    async function sendEmail(templateName, data, options) {
        options = options || {};
        var templateFn = TEMPLATES[templateName];
        if (!templateFn) {
            console.error('[EmailNotify] Unknown template: "' + templateName + '". Available: ' + Object.keys(TEMPLATES).join(', '));
            return { success: false, error: 'Unknown template: ' + templateName };
        }

        var apiKey = options.apiKey || CONFIG.API_KEY || global.SENDINBLUE_API_KEY;
        if (!apiKey) {
            console.warn('[EmailNotify] No Brevo API key configured. Set window.SENDINBLUE_API_KEY before loading this script.');
            console.warn('[EmailNotify] Get your API key at: https://app.brevo.com/settings/keys/api');
            return { success: false, error: 'No API key configured' };
        }

        var htmlContent = templateFn(data);
        var isAdminNotification = ['new_listing', 'new_inquiry', 'new_contact'].indexOf(templateName) !== -1;
        var isSellerNotification = ['listing_approved', 'listing_rejected'].indexOf(templateName) !== -1;

        var toEmail = options.to || CONFIG.NOTIFY_EMAIL;
        var toName = options.toName || CONFIG.NOTIFY_NAME;

        if (isSellerNotification && data.seller_email) {
            toEmail = data.seller_email;
            toName = data.seller_name || 'Seller';
        }

        var cc = (isAdminNotification && !options.skipAdmin) ? [{ email: CONFIG.NOTIFY_EMAIL, name: CONFIG.NOTIFY_NAME }] : undefined;

        var subjectMap = {
            new_listing: '📋 New Listing: ' + (data.business_name || 'Business Submitted'),
            new_inquiry: '💬 New Inquiry: ' + (data.business_name || 'Buyer Interest'),
            new_contact: '📨 Contact Form: ' + (data.name || 'New Submission'),
            listing_approved: '✅ Your 305business listing is live!',
            listing_rejected: '❌ Your 305business listing needs revision'
        };

        var payload = {
            sender: {
                email: options.from || CONFIG.FROM_EMAIL,
                name: options.fromName || CONFIG.FROM_NAME
            },
            to: [{ email: toEmail, name: toName }],
            subject: options.subject || subjectMap[templateName] || '305business.llc Notification',
            htmlContent: htmlContent,
            replyTo: {
                email: options.replyTo || CONFIG.REPLY_TO,
                name: options.replyToName || '305business.llc Support'
            }
        };

        if (cc) {
            payload.cc = cc;
        }

        try {
            var response = await fetch(CONFIG.BREVO_API_URL, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'api-key': apiKey
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                var errorBody = await response.text();
                console.error('[EmailNotify] Brevo API error (' + response.status + '):', errorBody);
                return { success: false, error: 'Brevo API ' + response.status + ': ' + errorBody };
            }

            var result = await response.json();
            console.log('[EmailNotify] Email sent: ' + templateName + ' → ' + toEmail);
            return { success: true, messageId: result.messageId, data: result };

        } catch (err) {
            console.error('[EmailNotify] Network error:', err.message);
            return { success: false, error: err.message };
        }
    }

    async function notifyAdmin(type, data, options) {
        options = options || {};
        try {
            return await sendEmail(type, data, Object.assign({}, options, { skipAdmin: true }));
        } catch (err) {
            console.error('[EmailNotify] notifyAdmin failed:', err.message);
            return { success: false, error: err.message };
        }
    }

    async function notifySeller(type, data, options) {
        options = options || {};
        try {
            return await sendEmail(type, data, options);
        } catch (err) {
            console.error('[EmailNotify] notifySeller failed:', err.message);
            return { success: false, error: err.message };
        }
    }

    // ═══════════════════════════════════════════════════════════
    // PUBLIC API
    // ═══════════════════════════════════════════════════════════

    var EmailNotify = {
        send: sendEmail,
        notifyAdmin: notifyAdmin,
        notifySeller: notifySeller,
        templates: TEMPLATES,
        config: CONFIG,
        escapeHtml: escapeHtml,
        version: '1.0.0'
    };

    global.EmailNotify = EmailNotify;

    // Auto-integrate with supabase305
    if (global.supabase305 && typeof global.supabase305 === 'object') {
        var originalSendNotification = global.supabase305.sendNotification;

        global.supabase305.sendNotification = async function(eventType, data) {
            if (TEMPLATES[eventType]) {
                console.log('[EmailNotify] Intercepting notification:', eventType);
                return await notifyAdmin(eventType, data);
            }
            if (originalSendNotification) {
                return await originalSendNotification.call(this, eventType, data);
            }
            console.warn('[EmailNotify] No handler for notification type:', eventType);
            return { success: false, error: 'Unknown notification type' };
        };

        console.log('[EmailNotify] Integrated with supabase305.sendNotification()');
    }

})(typeof window !== 'undefined' ? window : global);
