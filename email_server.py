#!/usr/bin/env python3
"""
305business.llc Email Notification Service
Sends email notifications for marketplace events using Brevo API
"""

import http.server
import socketserver
import json
import urllib.request
import urllib.error
import os
from datetime import datetime

PORT = 8081
BREVO_API_KEY = os.environ.get('BREVO_API_KEY', '')
BREVO_SENDER_EMAIL = os.environ.get('BREVO_SENDER_EMAIL', 'Jasmel@medicalbillingmb.com')
BREVO_SENDER_NAME = os.environ.get('BREVO_SENDER_NAME', '305business.llc')

ADMIN_EMAIL = os.environ.get('ADMIN_EMAIL', 'jasmelacosta@gmail.com')


class EmailHandler(http.server.BaseHTTPRequestHandler):
    def log_message(self, format, *args):
        pass  # Suppress default logging

    def _send_json(self, status, data):
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
        self.wfile.write(json.dumps(data).encode())

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_POST(self):
        if self.path == '/api/notify':
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length).decode()
            try:
                data = json.loads(body)
                event_type = data.get('event_type')
                result = self._handle_notification(event_type, data)
                self._send_json(200, result)
            except Exception as e:
                self._send_json(500, {"error": str(e)})
        else:
            self._send_json(404, {"error": "Not found"})

    def _handle_notification(self, event_type, data):
        handlers = {
            'new_inquiry': self._notify_new_inquiry,
            'new_listing': self._notify_new_listing,
            'new_valuation': self._notify_new_valuation,
            'new_contact': self._notify_new_contact,
        }
        handler = handlers.get(event_type)
        if handler:
            return handler(data)
        return {"error": f"Unknown event type: {event_type}"}

    def _send_brevo_email(self, to_email, subject, html_content, text_content=None):
        """Send email via Brevo API"""
        payload = {
            "sender": {"name": BREVO_SENDER_NAME, "email": BREVO_SENDER_EMAIL},
            "to": [{"email": to_email}],
            "subject": subject,
            "htmlContent": html_content,
        }
        if text_content:
            payload["textContent"] = text_content

        req = urllib.request.Request(
            "https://api.brevo.com/v3/smtp/email",
            data=json.dumps(payload).encode(),
            headers={
                "api-key": BREVO_API_KEY,
                "Content-Type": "application/json"
            },
            method="POST"
        )

        try:
            with urllib.request.urlopen(req, timeout=10) as resp:
                return {"success": True, "messageId": json.loads(resp.read()).get("messageId")}
        except urllib.error.HTTPError as e:
            error_body = e.read().decode()
            return {"success": False, "error": error_body}
        except Exception as e:
            return {"success": False, "error": str(e)}

    def _notify_new_inquiry(self, data):
        """Notify seller of new inquiry on their listing"""
        business_name = data.get('business_name', 'Your listing')
        buyer_name = data.get('buyer_name', 'A potential buyer')
        buyer_email = data.get('buyer_email', '')
        message = data.get('message', '')
        seller_email = data.get('seller_email', ADMIN_EMAIL)

        subject = f"📨 New inquiry on {business_name} — 305business.llc"
        html = f"""
        <html>
        <body style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: #1a4a7a; padding: 20px; border-radius: 8px 8px 0 0;">
                <h2 style="color: white; margin: 0;">305business.llc</h2>
                <p style="color: #a0c4e8; margin: 5px 0 0 0;">Miami Business Marketplace</p>
            </div>
            <div style="background: white; padding: 30px; border: 1px solid #e2e8f0; border-radius: 0 0 8px 8px;">
                <h3 style="color: #1a4a7a;">🔔 New Inquiry Received</h3>
                <p><strong>Business:</strong> {business_name}</p>
                <p><strong>From:</strong> {buyer_name} ({buyer_email})</p>
                <p><strong>Message:</strong></p>
                <blockquote style="background: #f7fafc; padding: 15px; border-left: 3px solid #1a4a7a; margin: 0;">
                    {message}
                </blockquote>
                <p style="margin-top: 20px;">
                    <a href="https://pablodd1.github.io/305business-llc/admin.html" 
                       style="background: #1a4a7a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                        View in Admin Dashboard →
                    </a>
                </p>
            </div>
        </body>
        </html>
        """

        return self._send_brevo_email(seller_email, subject, html)

    def _notify_new_listing(self, data):
        """Notify admin of new listing submission"""
        business_name = data.get('business_name', 'New listing')
        seller_name = data.get('seller_name', 'Seller')
        seller_email = data.get('seller_email', '')
        category = data.get('category', 'Unknown')

        subject = f"📋 New listing submission: {business_name}"
        html = f"""
        <html>
        <body style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: #1a4a7a; padding: 20px; border-radius: 8px 8px 0 0;">
                <h2 style="color: white; margin: 0;">305business.llc</h2>
                <p style="color: #a0c4e8; margin: 5px 0 0 0;">Admin Notification</p>
            </div>
            <div style="background: white; padding: 30px; border: 1px solid #e2e8f0; border-radius: 0 0 8px 8px;">
                <h3 style="color: #1a4a7a;">📋 New Listing Submission</h3>
                <p><strong>Business:</strong> {business_name}</p>
                <p><strong>Category:</strong> {category}</p>
                <p><strong>Seller:</strong> {seller_name} ({seller_email})</p>
                <p><strong>Status:</strong> Pending Review</p>
                <p style="margin-top: 20px;">
                    <a href="https://pablodd1.github.io/305business-llc/admin.html" 
                       style="background: #1a4a7a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                        Review in Admin →
                    </a>
                </p>
            </div>
        </body>
        </html>
        """

        return self._send_brevo_email(ADMIN_EMAIL, subject, html)

    def _notify_new_valuation(self, data):
        """Notify admin + send confirmation to requester"""
        business_name = data.get('business_name', 'Business')
        contact_name = data.get('contact_name', 'Requester')
        contact_email = data.get('contact_email', '')
        tier = data.get('tier_requested', 'Free Preliminary')

        # Notify admin
        admin_subject = f"📊 New valuation request: {business_name}"
        admin_html = f"""
        <html>
        <body style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: #1a4a7a; padding: 20px; border-radius: 8px 8px 0 0;">
                <h2 style="color: white; margin: 0;">305business.llc</h2>
            </div>
            <div style="background: white; padding: 30px; border: 1px solid #e2e8f0; border-radius: 0 0 8px 8px;">
                <h3 style="color: #1a4a7a;">📊 New Valuation Request</h3>
                <p><strong>Business:</strong> {business_name}</p>
                <p><strong>Requester:</strong> {contact_name} ({contact_email})</p>
                <p><strong>Tier:</strong> {tier}</p>
                <p style="margin-top: 20px;">
                    <a href="https://pablodd1.github.io/305business-llc/admin.html" 
                       style="background: #1a4a7a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                        View in Admin →
                    </a>
                </p>
            </div>
        </body>
        </html>
        """
        admin_result = self._send_brevo_email(ADMIN_EMAIL, admin_subject, admin_html)

        # Send confirmation to requester
        if contact_email:
            confirm_subject = f"✅ Valuation request received — 305business.llc"
            confirm_html = f"""
            <html>
            <body style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background: #1a4a7a; padding: 20px; border-radius: 8px 8px 0 0;">
                    <h2 style="color: white; margin: 0;">305business.llc</h2>
                </div>
                <div style="background: white; padding: 30px; border: 1px solid #e2e8f0; border-radius: 0 0 8px 8px;">
                    <h3 style="color: #1a4a7a;">✅ Valuation Request Received</h3>
                    <p>Hi {contact_name},</p>
                    <p>We've received your valuation request for <strong>{business_name}</strong>.</p>
                    <p><strong>Selected tier:</strong> {tier}</p>
                    <p>Our team will review your submission and contact you within 24 hours to discuss next steps.</p>
                    <p style="margin-top: 20px;">
                        <a href="https://pablodd1.github.io/305business-llc/valuation.html" 
                           style="background: #1a4a7a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                            View Pricing →
                        </a>
                    </p>
                </div>
            </body>
            </html>
            """
            self._send_brevo_email(contact_email, confirm_subject, confirm_html)

        return admin_result

    def _notify_new_contact(self, data):
        """Notify admin of new contact form submission"""
        name = data.get('name', 'Visitor')
        email = data.get('email', '')
        subject_line = data.get('subject', 'General inquiry')
        message = data.get('message', '')

        subject = f"📩 Contact form: {subject_line}"
        html = f"""
        <html>
        <body style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: #1a4a7a; padding: 20px; border-radius: 8px 8px 0 0;">
                <h2 style="color: white; margin: 0;">305business.llc</h2>
                <p style="color: #a0c4e8; margin: 5px 0 0 0;">Contact Form Notification</p>
            </div>
            <div style="background: white; padding: 30px; border: 1px solid #e2e8f0; border-radius: 0 0 8px 8px;">
                <h3 style="color: #1a4a7a;">📩 New Contact Message</h3>
                <p><strong>From:</strong> {name} ({email})</p>
                <p><strong>Subject:</strong> {subject_line}</p>
                <p><strong>Message:</strong></p>
                <blockquote style="background: #f7fafc; padding: 15px; border-left: 3px solid #1a4a7a; margin: 0;">
                    {message}
                </blockquote>
                <p style="margin-top: 20px;">
                    <a href="https://pablodd1.github.io/305business-llc/admin.html" 
                       style="background: #1a4a7a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                        View in Admin →
                    </a>
                </p>
            </div>
        </body>
        </html>
        """

        return self._send_brevo_email(ADMIN_EMAIL, subject, html)


if __name__ == '__main__':
    os.chdir(os.path.dirname(os.path.abspath(__file__)))

    with socketserver.TCPServer(("", PORT), EmailHandler) as httpd:
        print(f"305business Email Server running on port {PORT}")
        print(f"Admin notifications go to: {ADMIN_EMAIL}")
        print(f"Ready for:")
        print(f"  POST /api/notify - Send notification")
        print(f"")
        print(f"Event types: new_inquiry, new_listing, new_valuation, new_contact")
        httpd.serve_forever()
