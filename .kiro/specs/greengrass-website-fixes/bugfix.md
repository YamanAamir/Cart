# Bugfix Requirements Document

## Introduction

The Greengrass website (Club Pro golf cart e-commerce platform) has 13 pending issues spanning
both the `cart-ui` (React + Vite builder UI) and `cart-ecommerce` (React + Vite storefront)
frontends, with supporting changes needed in the `cart-backend` (Express + Prisma) and
`cart-admin-dashboard` (Next.js). These issues affect navigation, product builder functionality,
content accuracy, visual presentation, and third-party integrations. Fixing them will complete
the site's initial launch readiness.

---

## Bug Analysis

### Current Behavior (Defect)

**Bug 1 – "Start Building" Button Blank Page**

1.1 WHEN a user clicks the "START BUILDING" button on the `cart-ui` hero section THEN the system
navigates to `/brand/club-car` which renders a blank page because the `GolfCartBuilder` component
attempts to call `api.get('/brands/slug/club-car')` but the route `/brand/:brandSlug` is not
registered in `cart-ui/src/App.jsx`.

**Bug 2 – Brand Name Spelling Corrections**

1.2 WHEN a user views any page that references the manufacturer "E-Z-GO" in the `cart-ui`
navigation bar (fetched dynamically from the API) THEN the system displays the brand name
exactly as stored in the database, which may be stored as "EZGO", "Ezgo", or another variant
instead of the correct trademark spelling "E-Z-GO".

1.3 WHEN a user views any page that references the manufacturer "Club Car" THEN the system may
display it as "ClubCar", "club-car", or another variant instead of the correct trademark
spelling "Club Car".

1.4 WHEN a user views any page that references the manufacturer "Club Pro" THEN the system may
display it as "ClubPro", "club-pro", or another variant instead of the correct trademark
spelling "Club Pro".

**Bug 3 – Out-of-Stock "Sold Out" Banner**

1.5 WHEN a product with `stock === 0` is displayed on the `ShopCategory` product grid THEN the
system does not show any "Sold Out" visual indicator on the product card, making out-of-stock
items indistinguishable from available items.

1.6 WHEN a product with `stock === 0` is the active selection in the `GolfCartBuilder` option
list THEN the system shows "Out of stock" as a text label but does not prevent the item from
appearing selected or block the "Save Build" flow consistently across all builder views.

**Bug 4 – Cross-Category Selection Bug (Product Builder)**

1.7 WHEN a user selects a product option in one category accordion in the `GolfCartBuilder` THEN
switches to a different model THEN the system retains the previous category selections in
`selections.items` state even though the new model's product list is entirely different,
causing stale selections from the old model to persist and potentially add incorrect items to
the cart.

1.8 WHEN a user switches models in the `GolfCartBuilder` THEN the system opens the first
category accordion and auto-selects the first product of that category, but does not clear
selections from categories that no longer exist in the new model's product set.

**Bug 5 – Image Sizing & Bleeding Issues**

1.9 WHEN product images are displayed in the `ShopCategory` grid THEN the system renders images
using `object-cover` inside a fixed `aspect-square` container, causing portrait-oriented or
non-square product images to be cropped and bleed outside their intended visual boundaries.

1.10 WHEN product images are displayed in the `ProductDetail` page THEN the system applies
`lg:object-cover` without a consistent `object-position` setting, causing some product images
to be cropped at the top or bottom rather than centered on the subject.

**Bug 6 – Social Media Links Not Connected**

1.11 WHEN the footer renders in `cart-ecommerce` and `cart-ui` and no social links are returned
from the `/organization-settings` API endpoint THEN the system falls back to rendering
placeholder `<a href="#">` anchor tags for Instagram, Facebook, and LinkedIn icons that lead
nowhere, giving users non-functional social media buttons.

1.12 WHEN the `/organization-settings` API returns social links but the admin has not yet
configured them THEN the system shows dead placeholder icons instead of hiding the social
section or showing a meaningful fallback.

**Bug 7 – Warranty Page Content & Form**

1.13 WHEN a user submits the warranty registration form on `/Warranty-Policy` THEN the system
posts to `POST /register-warranty` but provides no visible success confirmation message to the
user after a successful submission, leaving the user uncertain whether their registration was
accepted.

1.14 WHEN a user views the warranty page THEN the system displays generic enclosure warranty
content that references returning items to a factory, which does not match the golf cart
accessory context of the Greengrass/Club Pro brand.

**Bug 8 – Color Differentiators in Product Descriptions**

1.15 WHEN a user views a product in the `GolfCartBuilder` option list that has a `color`
attribute THEN the system displays the color as a small gray sub-label below the product name,
but does not visually differentiate between color variants using any color swatch, badge, or
highlight, making it difficult to distinguish options at a glance.

1.16 WHEN a user views the `ProductDetail` page for a product that has color variants THEN the
system does not display any color swatch or visual color indicator in the product details panel.

**Bug 9 – Utility Section Icons Update**

1.17 WHEN a user views the Trust Badges / Utility section on the `cart-ecommerce` homepage THEN
the system renders a hardcoded `✓` checkmark emoji as the icon for every stats card regardless
of what the card represents, because `TrustBadge` ignores any icon data from the API response.

**Bug 10 – Manufacturer Logos Implementation**

1.18 WHEN a user views the "Top Brands" grid on the `cart-ecommerce` homepage THEN the system
fetches brand logos from the API and renders them, but brands that have no `logo` field set
in the database render with an empty image placeholder rather than a recognizable fallback
logo or brand initial.

1.19 WHEN a user views the `cart-ui` `ProductSection` THEN the system uses locally imported
static `.webp` images for Club Car, E-Z-GO, and Yamaha instead of the dynamically served
brand logos from the API, meaning logo updates in the admin dashboard are not reflected.

**Bug 11 – Remove RXV Models (Decision Pending)**

1.20 WHEN a user views the E-Z-GO product builder or any page listing E-Z-GO models THEN the
system displays RXV model options (e.g., "RXV2", "3-SIDED RXV", "RXV FIN") which are
pending a business decision on whether to keep or remove them, creating potential confusion
for customers if the decision is to discontinue RXV.

**Bug 12 – Quick Shop Remaining Image Optimizations**

1.21 WHEN a user navigates to the external Quick Shop URL (`https://clubpromfg.com/quick-shop/`)
via the "QUICK SHOP" button in `cart-ui` THEN the system performs a full `window.location.href`
redirect rather than opening in a new tab, causing the user to lose their current session
context in the `cart-ui` application.

1.22 WHEN product images load in the `ShopCategory` grid THEN the system does not use lazy
loading (`loading="lazy"`) or next-gen image formats for product thumbnails, causing slower
initial page load when many products are displayed.

**Bug 13 – E-Z-GO Navigation Labeling**

1.23 WHEN a user views the `cart-ui` navigation bar which is dynamically populated from the
`/all-brands` API THEN the system displays the E-Z-GO brand link using whatever label is
stored in the database, which may not match the correct hyphenated trademark format "E-Z-GO",
causing inconsistent labeling between the nav bar, hero section, and product cards.

1.24 WHEN a user views the `cart-ui` navigation bar THEN the system shows a route path for
E-Z-GO that may be `/ezgo` (the old static route) rather than the dynamic `/brand/e-z-go`
path used by the `GolfCartBuilder`, causing navigation to the wrong or non-existent page.

---

### Expected Behavior (Correct)

**Bug 1 – "Start Building" Button**

2.1 WHEN a user clicks the "START BUILDING" button on the `cart-ui` hero section THEN the system
SHALL navigate to a valid route that renders the `GolfCartBuilder` component with the
`club-car` brand slug, displaying the Club Car builder without a blank page.

**Bug 2 – Brand Name Spelling Corrections**

2.2 WHEN a user views any page referencing the E-Z-GO manufacturer THEN the system SHALL display
the brand name as "E-Z-GO" consistently across all UI surfaces (navigation, headings, product
cards, descriptions, and form options).

2.3 WHEN a user views any page referencing the Club Car manufacturer THEN the system SHALL
display the brand name as "Club Car" (two words, both capitalized) consistently across all UI
surfaces.

2.4 WHEN a user views any page referencing the Club Pro brand THEN the system SHALL display the
brand name as "Club Pro" (two words, both capitalized) consistently across all UI surfaces.

**Bug 3 – Out-of-Stock "Sold Out" Banner**

2.5 WHEN a product with `stock === 0` is displayed on the `ShopCategory` product grid THEN the
system SHALL overlay a visible "SOLD OUT" banner on the product card image so users can
immediately identify unavailable items.

2.6 WHEN a product with `stock === 0` is listed in the `GolfCartBuilder` option list THEN the
system SHALL disable the option (non-clickable, visually dimmed) and display a clear "Out of
Stock" indicator, and SHALL prevent that product from being added to the cart or build.

**Bug 4 – Cross-Category Selection Bug**

2.7 WHEN a user switches to a different model in the `GolfCartBuilder` THEN the system SHALL
clear all previous category selections (`selections.items`) before loading the new model's
products, ensuring no stale selections from the previous model carry over.

2.8 WHEN a user switches models in the `GolfCartBuilder` THEN the system SHALL reset the open
accordion section to the first category of the new model and auto-select only the first
product of that new model's first category.

**Bug 5 – Image Sizing & Bleeding**

2.9 WHEN product images are displayed in the `ShopCategory` grid THEN the system SHALL render
images with consistent dimensions that prevent cropping or bleeding, using `object-contain`
with a neutral background or a properly constrained `object-cover` with `object-center`
positioning.

2.10 WHEN product images are displayed in the `ProductDetail` page THEN the system SHALL render
the main product image with `object-contain` so the full product is visible without cropping,
centered within its container.

**Bug 6 – Social Media Links**

2.11 WHEN the footer renders and social links are available from the `/organization-settings`
API THEN the system SHALL render each social link as a functional anchor tag pointing to the
correct URL, opening in a new tab.

2.12 WHEN the footer renders and no social links are configured in the admin THEN the system
SHALL hide the social media icon row entirely rather than showing non-functional placeholder
links.

**Bug 7 – Warranty Page**

2.13 WHEN a user successfully submits the warranty registration form THEN the system SHALL
display a visible success confirmation message (e.g., "Your warranty has been registered
successfully!") on the page without requiring a page reload.

2.14 WHEN a user views the warranty page THEN the system SHALL display warranty content that
accurately reflects Club Pro's golf cart accessory warranty terms, replacing any generic
enclosure-factory language with brand-appropriate copy.

**Bug 8 – Color Differentiators**

2.15 WHEN a user views a product option in the `GolfCartBuilder` that has a `color` attribute
THEN the system SHALL display a color swatch (a small filled circle using the color value) or
a clearly styled color badge alongside the product name so variants are visually distinct.

2.16 WHEN a user views the `ProductDetail` page for a product with a `color` attribute THEN the
system SHALL display the color value as a labeled swatch or badge in the product details panel.

**Bug 9 – Utility Section Icons**

2.17 WHEN a user views the Trust Badges / Utility section on the homepage THEN the system SHALL
render the icon associated with each stats card as configured in the admin dashboard (e.g., an
SVG icon or emoji stored in the API response), falling back to a meaningful default icon per
card type rather than a generic `✓` for all cards.

**Bug 10 – Manufacturer Logos**

2.18 WHEN a brand in the "Top Brands" grid has no logo set in the database THEN the system SHALL
display a styled fallback showing the brand's initial letter or a generic cart icon rather than
a broken or empty image placeholder.

2.19 WHEN the `cart-ui` `ProductSection` renders manufacturer cards THEN the system SHALL source
brand logos from the API (`/all-brands`) rather than static local assets, so admin logo
updates are reflected without a code deployment.

**Bug 11 – Remove RXV Models**

2.20 WHEN the business decision to remove RXV models is confirmed THEN the system SHALL remove
all RXV model entries (e.g., "RXV2", "3-SIDED RXV", "RXV FIN") from the E-Z-GO builder
model list and product categories so they are no longer visible or selectable by customers.

**Bug 12 – Quick Shop Image Optimizations**

2.21 WHEN a user clicks the "QUICK SHOP" button in `cart-ui` THEN the system SHALL open the
external Quick Shop URL in a new browser tab (`target="_blank"`) rather than redirecting the
current window, preserving the user's session in the application.

2.22 WHEN product images load in the `ShopCategory` grid THEN the system SHALL apply
`loading="lazy"` to all product thumbnail `<img>` elements to defer off-screen image loading
and improve initial page performance.

**Bug 13 – E-Z-GO Navigation Labeling**

2.23 WHEN a user views the `cart-ui` navigation bar THEN the system SHALL display the E-Z-GO
brand link with the label "E-Z-GO" (correct trademark hyphenation) regardless of how the
brand name is stored in the database, applying a display-name normalization if needed.

2.24 WHEN a user clicks the E-Z-GO link in the `cart-ui` navigation bar THEN the system SHALL
navigate to `/brand/e-z-go` (the dynamic `GolfCartBuilder` route) rather than the legacy
static `/ezgo` route.

---

### Unchanged Behavior (Regression Prevention)

3.1 WHEN a user clicks the "QUICK SHOP" button THEN the system SHALL CONTINUE TO open the
correct external URL `https://clubpromfg.com/quick-shop/`.

3.2 WHEN a user selects a product in the `GolfCartBuilder` and the product is in stock THEN the
system SHALL CONTINUE TO allow selection, display the product image, update the total price,
and enable the "Save Build" / checkout flow.

3.3 WHEN a user views the `ShopCategory` page for any brand THEN the system SHALL CONTINUE TO
fetch and display products filtered by brand and model, with pagination and sort controls
functioning correctly.

3.4 WHEN a user views the `ProductDetail` page for an in-stock product THEN the system SHALL
CONTINUE TO display product images, description, price, and the "Add to Cart" button in a
functional state.

3.5 WHEN a user submits the warranty registration form with invalid or missing required fields
THEN the system SHALL CONTINUE TO show HTML5 validation errors and prevent form submission.

3.6 WHEN the footer fetches brands from `/all-brands` THEN the system SHALL CONTINUE TO render
the dynamic brand list in the Shop column with correct links.

3.7 WHEN a user navigates to Club Car, Yamaha, or Club Pro brand pages THEN the system SHALL
CONTINUE TO load the correct brand builder or brand page without regression.

3.8 WHEN the `GolfCartBuilder` loads for the `utility` brand slug THEN the system SHALL
CONTINUE TO use the static `utilityBrand` data object rather than making an API call.

3.9 WHEN a user views the `cart-ui` navigation bar THEN the system SHALL CONTINUE TO dynamically
render all brands fetched from the API with their correct route paths.

3.10 WHEN a user views the "Top Brands" grid on the homepage THEN the system SHALL CONTINUE TO
fetch and display all brands from the API with their logos and links to the correct shop pages.
