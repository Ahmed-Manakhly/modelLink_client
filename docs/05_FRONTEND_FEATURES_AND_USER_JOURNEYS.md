# 05 — Frontend Features & Cross-Repo User Journeys

> **Repository**: [`modelLink_client`](../README.md) & [`modelLink_server`](../../modelLink_server/README.md)
> **Purpose**: Documents the actual user-facing functionality on the frontend and traces the end-to-end user journeys from the React UI to the PostgreSQL database.

---

## 1. Frontend Feature Inventory

The frontend application consists of ~38 pages and 60+ components. Below is the functional mapping of key features.

### 1.1 Public & Discovery Features

- **Landing Page (`/`)**: Displays the hero section, featured AI models, and recently published models. Uses dynamic SEO meta tags.
- **Model Catalog (`/models`)**: The primary search interface. Supports filtering by Category, Modality, BodyPart, Price, and rating.
- **Model Details (`/models/view/:id`)**: Displays full model information, author details, feature sets, technical specifications (versions), and client reviews.

### 1.2 User Identity & Onboarding

- **Authentication (`/auth`)**: Handles both Registration and Login via a toggle mode. Utilizes JWT Bearer tokens.
- **Role Routing Guards**: `App.js` enforces role-based access. For example:
  - `CLIENT` cannot access `/dashboard-dev`
  - `DEVELOPER` cannot access `/cart` or `/orders-client`
  - Unauthorized users are redirected to `/auth?mode=login`

### 1.3 Developer Features (Role: `DEVELOPER`)

- **Dashboard (`/dashboard-dev`)**: Overview of sales, active orders, and notifications.
- **Model Management (`/models/new`, `/models/edit/:id`)**: Multi-step forms for creating models, uploading image assets via `multer`, and defining model versions/specifications.
- **Wallet (`/wallet`)**: Displays `pendingBalance`, `availableBalance`, and `totalEarnings`. Allows developers to request payouts once funds are available.
- **Developer Profile Settings (`/profileSettings`)**: Manages public profile details and verification status submission.

### 1.4 Client Features (Role: `CLIENT`)

- **Shopping Cart (`/cart`)**: Managed globally via Redux Toolkit (`Cart-slice.js`). Allows checking out multiple models simultaneously.
- **Stripe Checkout (`/stripe`)**: Integrates Stripe Elements. Processes PaymentIntents and handles demo/live payment paths.
- **Order History (`/orders-client`)**: Lists purchased models and their delivery status.
- **Client Reviews (`/reviews-client`)**: Allows clients to rate and review models they have successfully purchased and received.

### 1.5 Real-Time Features (All Authenticated Users)

- **Messaging (`/chat`)**: Socket.io-powered real-time chat between Clients and Developers for pre-sales or post-sales support.
- **Notifications**: Live toast notifications (via `UI-slice.js`) for order updates, messages, and payout approvals.

---

## 2. Cross-Repository User Journeys

These journeys trace the complete lifecycle from the browser (React) down to the database (Prisma).

### 2.1 The Developer Onboarding & Publishing Journey

1. **Registration**:
   - **Frontend**: User fills out `/auth?mode=register` (Selects "Developer").
   - **Backend API**: `POST /api/auth/register` (creates User, hashes password, generates OTP).
2. **Verification**:
   - **Frontend**: Developer submits ID documents via `/profileSettings`.
   - **Backend API**: `POST /api/verification/request`. Status becomes `PENDING`.
   - **Admin Action**: Admin calls `PATCH /api/verification/:id` to approve.
3. **Publishing a Model**:
   - **Frontend**: Submits multipart form data from `/models/new`.
   - **Backend API**: `POST /api/aiModel`.
   - **Database**: Creates `AiModel` record. Handles category/modality references. Status defaults to `PUBLISHED`.

### 2.2 The Client Purchase Journey (The Payment Lifecycle)

1. **Intent Creation**:
   - **Frontend**: Client clicks checkout in `/cart`.
   - **Backend API**: `POST /api/orders/checkout-session`.
   - **Database**: Creates an `Order` record in `PENDING` state. Generates a Stripe `PaymentIntent`.
2. **Payment Confirmation**:
   - **Frontend**: Client enters card details in the Stripe Element on `/stripe`.
   - **Stripe**: Processes payment securely.
3. **Webhook Fulfillment (Atomic Transaction)**:
   - **Stripe**: Sends `payment_intent.succeeded` to backend webhook.
   - **Backend API**: `POST /api/orders/stripe-webhook`.
   - **Business Logic**: Invokes the `fulfillOrder()` atomic transaction.
   - **Database Mutations**:
     - `Order` status -> `PAID`.
     - Creates `Transaction` record (calculates gross vs. platform fee vs. developer payout).
     - Finds or creates developer `Wallet`.
     - Increments `Wallet.pendingBalance`.
4. **Real-time Notification**:
   - **Backend Socket**: Emits `receive_notification` to the developer's user room.
   - **Frontend**: `useRealtimeSession` hook catches event, updates Redux, displays toast.

### 2.3 The Order Delivery & Payout Journey

1. **Delivery Initiation**:
   - **Frontend**: Developer marks order as delivered (or automatic digital delivery occurs).
   - **Backend API**: `PATCH /api/orders/:id/deliver`.
   - **Database**: `Order` status -> `DELIVERED`.
2. **Funds Maturation**:
   - **Backend Logic**: Decrements `Wallet.pendingBalance`, increments `Wallet.availableBalance` and `Wallet.totalEarnings`.
3. **Payout Request**:
   - **Frontend**: Developer requests payout via `/wallet`.
   - **Backend API**: `POST /api/wallet/payout`.
   - **Database**: Decrements `Wallet.availableBalance`. Creates a `PAYOUT` transaction.
4. **Admin Approval**:
   - **Backend API**: Admin approves via `PATCH /api/wallet/payout/:id/approve`.
   - **Stripe Connect**: API transfers actual funds to developer's connected Stripe account.

### 2.4 Dispute Resolution Journey

1. **Opening a Dispute**:
   - **Client Action**: Client flags an issue on a `PAID` or `DELIVERED` order.
   - **Backend API**: `Order` status updates to `DISPUTED`. Previous status is cached.
2. **Admin Review**:
   - **Admin Dashboard**: Views dispute evidence.
   - **Resolution Rules**:
     - **Refund (Client Wins)**: Funds deducted from developer wallet, refunded via Stripe. Order status -> `CANCELLED`/`REFUNDED`.
     - **Reject (Developer Wins)**: Order reverts to `previousOrderStatus`.
     - **Replace**: Order status stays active, developer must provide new assets.

### 2.5 Real-Time Messaging Journey

1. **Connection**:
   - **Frontend**: User logs in. `useRealtimeSession` hook mounts.
   - **Socket.IO**: Connects with `socket.handshake.auth.token = JWT`.
   - **Backend**: Verifies JWT. Joins user to unique room: `{userId}__room`.
2. **Sending a Message**:
   - **Frontend**: Client types message in `/chat`. Emits `send_msg` event.
   - **Backend**: Validates authorization using a `pairKey` (ensuring client has an active order with the developer or vice versa).
   - **Database**: Persists message to `Conversation` and `Message` tables.
   - **Socket.IO**: Emits `receive_msg` to the recipient's `{userId}__room`.
3. **Receiving & State Update**:
   - **Frontend**: Recipient's `realtimeSlice` pushes the new message to state. UI updates instantly.

---

## 3. UI/UX Patterns & Standardization

- **Forms & Validation**: Standardized using React state, with visual error cues built into the custom input components.
- **Glassmorphism**: UI relies heavily on the `btn-glass-primary` and `card-glass` tokens defined in `src/styles/tokens.css`.
- **Responsive Layout**: Designed mobile-first. The sidebar navigation in `PortalLayout` collapses into a hamburger menu below the 1024px breakpoint.
- **Empty & Loading States**: Redux `UI-slice` manages a global loading overlay to prevent duplicate submissions during API requests. Data grids display custom empty-state SVGs when no records exist.
