# Epic 4: Accessory E-commerce & Checkout

**Goal:** Enable the complete e-commerce lifecycle for non-enterprise items, from adding accessories to a cart to completing a secure payment via Stripe.

## **Story 4.1: Shopping Cart State Management**
**As a** developer, **I want** to implement a client-side state management solution for the shopping cart, **so that** the user's selections can be tracked across their session.
**Acceptance Criteria:**
1.  A state management store is created for the cart.
2.  Functions are available to add, remove, and update the quantity of items in the cart.
3.  The cart's contents persist during page navigation.
4.  The total price is automatically calculated and updated when the cart changes.

## **Story 4.2: "Add to Cart" UI & Functionality**
**As a** user, **I want** to add accessories to my cart from their product pages, **so that** I can begin the purchasing process.
**Acceptance Criteria:**
1.  An "Add to Cart" button is displayed on product pages for items designated as accessories.
2.  Clicking the button adds the item to the cart state.
3.  A cart icon in the main site header displays a badge with the current number of items in the cart.
4.  Clicking the cart icon navigates the user to the cart page.

## **Story 4.3: Shopping Cart Review Page**
**As a** user, **I want** to view and manage the contents of my shopping cart, **so that** I can review my order before payment.
**Acceptance Criteria:**
1.  A new page is created at the `/cart` route.
2.  The page lists all items in the cart, showing their name, quantity, and price.
3.  The user can update quantities or remove items from this page.
4.  The page displays an order subtotal and a "Proceed to Checkout" button.

## **Story 4.4: Stripe Checkout Integration**
**As a** user, **I want** to complete my purchase using a secure, hosted payment page, **so that** I can pay for my items with confidence.
**Acceptance Criteria:**
1.  The Stripe React SDK is integrated into the application.
2.  Clicking "Proceed to Checkout" creates a Stripe Checkout Session via a secure backend action.
3.  The user is successfully redirected to the Stripe-hosted checkout page.
4.  Simple `/success` and `/cancel` pages are created to handle the return redirect from Stripe.

## **Story 4.5: Order Confirmation Notification**
**As a** business owner, **I want** to receive an email notification for successful orders, **so that** I can fulfill the order.
**Acceptance Criteria:**
1.  A Stripe webhook handler is created to listen for the `checkout.session.completed` event.
2.  The webhook securely validates the event and triggers a notification via Resend.
3.  The notification email, sent to a company address, contains the order details.
4.  The user's cart is cleared after they are redirected to the `/success` page.