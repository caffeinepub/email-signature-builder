# Email Signature Builder

## Current State
New project -- no existing application files.

## Requested Changes (Diff)

### Add
- Full email signature builder app with editor and live preview
- Editor fields (in order): name, job title, company, phone, website, social links (LinkedIn, X, Instagram, Facebook, YouTube, TikTok, Substack), plus email address
- Logo upload: base64-encoded, embedded directly in signature HTML
- 20 signature layout templates (varied styles: horizontal, vertical, card, minimal, photo-left, banner, column-based, divider-based, etc.)
- Font picker (web-safe fonts for email compatibility)
- Color picker and gradient builder for accent colors
- Live preview of signature as user types
- Empty fields are hidden automatically in templates -- no blank lines or empty icons
- One-click copy as rich HTML (clipboard API with fallback)
- Download signature as `.html` file
- Template selector grid showing all 20 options
- Clean and minimal app UI

### Modify
- N/A

### Remove
- N/A

## Implementation Plan
1. Backend: store nothing -- purely frontend app. Minimal Motoko actor.
2. Frontend:
   - `SignatureEditor` component: form fields in specified order, logo uploader, font/color/gradient pickers
   - `TemplateSelector` component: grid of 20 template thumbnails
   - `SignaturePreview` component: live rendered preview of selected template with user data
   - 20 template renderers: each returns inline-styled HTML string for email compatibility
   - `copyToClipboard` utility: uses ClipboardItem with text/html MIME type
   - `downloadHTML` utility: creates `.html` file download
   - All template fields conditional -- only render if value is non-empty
   - Logo embedded as base64 `<img>` tag when provided
