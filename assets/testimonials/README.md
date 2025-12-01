# Testimonials Avatars

This directory contains profile photos for the testimonials section.

## How to Add Avatars

1. **Add image files** to this directory (`assets/testimonials/`) with the following naming convention:
   - `elias-merhy.jpg` (or `.png`, `.webp`, etc.)
   - `victor-charpentier.jpg`
   - `yasaman-tahouni.jpg`
   - `marin-de-la-croix.jpg`
   - `maggie-chao.jpg`
   - `peng-xu.jpg`
   - `ricardo-lamego.jpg`
   - `ijaz-haider-malik.jpg`
   - `arsalan-khawaja.jpg`
   - `faaiz-jeelani.jpg`

2. **Image Requirements:**
   - Format: JPG, PNG, or WebP
   - Recommended size: At least 96x96 pixels (will be displayed at 48x48px)
   - Aspect ratio: Square (1:1) works best
   - The images will be automatically cropped to a circle

3. **The avatar paths are already configured** in `assets/testimonials.json`. Once you add the image files with the correct names, they will automatically appear on the website.

4. **If an avatar image is missing**, a gradient placeholder will be shown instead.

## Alternative: Using External URLs

If you prefer to host images elsewhere (e.g., LinkedIn profile photos, CDN), you can update the `avatar` field in `testimonials.json` to use a full URL:

```json
"avatar": "https://example.com/path/to/image.jpg"
```

## Current Avatar Paths

All testimonials are configured to look for images in this directory:
- `assets/testimonials/elias-merhy.jpg`
- `assets/testimonials/victor-charpentier.jpg`
- `assets/testimonials/yasaman-tahouni.jpg`
- `assets/testimonials/marin-de-la-croix.jpg`
- `assets/testimonials/maggie-chao.jpg`
- `assets/testimonials/peng-xu.jpg`
- `assets/testimonials/ricardo-lamego.jpg`
- `assets/testimonials/ijaz-haider-malik.jpg`
- `assets/testimonials/arsalan-khawaja.jpg`
- `assets/testimonials/faaiz-jeelani.jpg`

