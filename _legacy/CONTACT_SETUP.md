# Contact Page Setup Guide

The contact page has been updated with:
1. **Calendly Integration** - For scheduling calls
2. **EmailJS Integration** - For sending contact form emails (with mailto fallback)

## Calendly Setup

1. Sign up for a free account at [Calendly](https://calendly.com/)
2. Create your scheduling page
3. In `index.html`, find the Calendly widget and replace `danialamin` with your actual Calendly username:
   ```html
   <div class="calendly-inline-widget" data-url="https://calendly.com/YOUR_USERNAME" ...>
   ```

## EmailJS Setup (Optional but Recommended)

The contact form will work with a mailto fallback, but for a better experience, set up EmailJS:

1. Sign up for a free account at [EmailJS](https://www.emailjs.com/) (free tier: 200 emails/month)
2. Create an Email Service:
   - Go to Email Services
   - Add a new service (Gmail, Outlook, etc.)
   - Follow the setup instructions
3. Create an Email Template:
   - Go to Email Templates
   - Create a new template
   - Use these template variables:
     - `{{from_name}}` - Sender's name
     - `{{from_email}}` - Sender's email
     - `{{subject}}` - Email subject
     - `{{message}}` - Email message
   - Set "To Email" to: `writetodanialamin@gmail.com`
4. Get your credentials:
   - Public Key: Found in Account → General
   - Service ID: Found in Email Services (e.g., `service_xxxxx`)
   - Template ID: Found in Email Templates (e.g., `template_xxxxx`)
5. Update `js/main.js`:
   - Replace `YOUR_PUBLIC_KEY` with your EmailJS Public Key
   - Replace `YOUR_SERVICE_ID` with your Service ID
   - Replace `YOUR_TEMPLATE_ID` with your Template ID

## Testing

1. **Test the form**: Submit the contact form - it should either send via EmailJS or open your email client (mailto fallback)
2. **Test Calendly**: Click the "Schedule a Call" tab and verify the Calendly widget loads correctly

## Notes

- The form works without EmailJS using the mailto fallback
- Calendly requires your actual Calendly URL to work
- Both features are mobile-responsive
