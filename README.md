# Mountain Stay — Hotel Website Template

A premium, fully static hotel website template for a fictional boutique resort
in Mussoorie, Uttarakhand. Built with HTML5, CSS3, Bootstrap 5, and vanilla
JavaScript only — no backend, no database, no booking engine, no payment
gateway.

## Folder Structure

```
MountainStay/
├── index.html        Homepage
├── about.html         About page
├── rooms.html          Rooms & Suites page
├── gallery.html         Gallery page (filterable + lightbox)
├── contact.html          Contact page (static form, no backend)
├── css/
│   ├── style.css         Design tokens + all component styles
│   └── responsive.css      Breakpoint overrides
├── js/
│   └── main.js              Navbar, preloader, reveal animations, gallery filter, lightbox, form UX
'''
## Replacing the Placeholder Images

Every image slot in this template is a `<div class="ms-img-placeholder">`
with a `data-label` attribute showing the exact file path it expects, e.g.:

```html
<div class="ms-img-placeholder ms-img-room" data-label="assets/images/room-deluxe.jpg">
  <i class="bi bi-image"></i>
</div>
```

To go live with real photography:

1. Save your photo into `assets/images/` using the filename shown in that
   element's `data-label` (e.g. `room-deluxe.jpg`).
2. Replace the placeholder `<div>` with an `<img>` tag:
   ```html
   <img src="assets/images/room-deluxe.jpg" alt="Deluxe Valley Room" class="ms-img-room-photo">
   ```
   — or simply set it as a CSS `background-image` on the existing div and
   remove the `<i class="bi bi-image"></i>` icon and the placeholder styles.
3. Recommended sizes: hero images ≥ 1920×1080px, room/gallery images ≥
   1200×900px, team headshots ≥ 600×600px — all as compressed `.jpg` or
   `.webp` for fast loading.

## "Book Now" Behaviour

Per the brief, there is no booking engine. Every "Book Now" button links to
either `contact.html` or a WhatsApp deep link
(`https://wa.me/911234567890`). Update the phone number in that link across
all five HTML files before deploying.

## Contact Form

The form on `contact.html` is **front-end only**. It validates required
fields with Bootstrap's built-in validation and shows a confirmation
message — nothing is sent anywhere. To make it functional, connect it to a
form backend of your choice (e.g. Formspree, EmailJS, Netlify Forms, or a
custom mail script) by updating the `<form>` tag's `action`/`method` and the
submit handler in `js/main.js` (`initContactForm`).

## Fonts & Colors

- **Display font:** Playfair Display (headings)
- **Body font:** Poppins (UI text, paragraphs)
- **Palette:** Forest Green `#2E5E4E`, Deep Forest `#203A32`, Luxury Gold
  `#D4AF37`, Warm White `#F8F7F3`, Charcoal `#1F1F1F` — all defined as CSS
  custom properties at the top of `css/style.css` under `:root`.

## Browser Support

Modern evergreen browsers (Chrome, Firefox, Safari, Edge). Uses
`IntersectionObserver` for scroll-reveal animations with a graceful
fallback for older browsers, and respects `prefers-reduced-motion`.
