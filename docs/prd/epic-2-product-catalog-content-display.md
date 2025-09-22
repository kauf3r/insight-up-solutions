# Epic 2: Product Catalog & Content Display

**Goal:** Build out all product and solution pages, allowing users to browse, learn about, and compare the Trinity Pro and its payloads.

## **Story 2.1: Reusable Product Card Component**
**As a** developer, **I want** to create a reusable `ProductCard` component that displays a product's image, name, and a brief description, **so that** it can be used consistently on all catalog and feature pages.
**Acceptance Criteria:**
1.  The `ProductCard` component accepts props for an image, name, and summary text.
2.  The component styling is clean, professional, and responsive.
3.  Clicking anywhere on the card navigates the user to that product's detail page.
4.  The card includes a placeholder for a "Learn More" call-to-action.

## **Story 2.2: Product Catalog Page**
**As a** user, **I want** to view a catalog page that displays all available products in a clean grid, **so that** I can easily browse the offerings.
**Acceptance Criteria:**
1.  A new page is created at the `/shop` route.
2.  The page displays a responsive grid of `ProductCard` components using placeholder data.
3.  The grid layout adapts cleanly to mobile, tablet, and desktop screen sizes.
4.  The page includes a clear heading, such as "Product Catalog."

## **Story 2.3: Product Detail Page Template**
**As a** user, **I want** a detailed product page with a clear layout for images, descriptions, and technical data, **so that** I can thoroughly research a product before making an inquiry.
**Acceptance Criteria:**
1.  A dynamic route is created at `/shop/[slug]`.
2.  The page layout includes a main image gallery, product title, long description, and a primary call-to-action button (e.g., "Request a Quote").
3.  A tabbed interface is implemented with sections for "Specifications," "Downloads," and "What's in the Box."
4.  The page is populated with placeholder data to validate the layout.

## **Story 2.4: Populate Core Product Data**
**As a** developer, **I want** to populate the product detail pages with actual data for the Trinity Pro, Sony ILX-LR1, and Qube 640, **so that** users can view accurate and compelling information.
**Acceptance Criteria:**
1.  A data-fetching mechanism is implemented for the `/shop/[slug]` route to load product-specific data.
2.  The Trinity Pro, Sony ILX-LR1, and Qube 640 pages are populated with their correct images, descriptions, and technical specifications.
3.  Links to downloadable PDF spec sheets are functional.

## **Story 2.5: Solutions Page**
**As a** user, **I want** to view a "Solutions" page that explains the applications of the products for my industry, **so that** I can understand how they solve my specific problems.
**Acceptance Criteria:**
1.  A new page is created at a `/solutions` route.
2.  The page contains distinct sections for key industries (e.g., "Surveying & Mapping," "Precision Agriculture," "Public Safety").
3.  Each section provides a brief overview of the workflow and links to the relevant product pages.
4.  The page is styled consistently with the rest of the site.