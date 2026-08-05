# 🌐 API Integration Layer, Loaders & Stripe Setup

> **Document Scope**: Axios API configuration, 23 domain request modules, runtime environment URL normalization, React Router data loader pattern, and Stripe Elements integration.

---

## 1. Axios Instance & URL Normalization

**Implementation**: [`src/lib/api.js`](../src/lib/api.js)

The API layer determines base URLs at runtime based on `NODE_ENV` and `REACT_APP_ENV`:

```javascript
const isDev =
  process.env.NODE_ENV !== "production" ||
  process.env.REACT_APP_ENV !== "production";

export const BASE_URL = getNormalizedBaseUrl(
  isDev
    ? process.env.REACT_APP_BASE_API_DEV || "http://127.0.0.1:8000"
    // Note: https://www.modellink.com is purely a fallback default for environment parsing,
    // not the actual canonical production domain (which is https://www.modellink.manakhly.tech).
    : process.env.REACT_APP_BASE_API_PROD || "https://www.modellink.com",
);

export const createAPI = () =>
  axios.create({
    baseURL: `${BASE_URL}/api/`,
    withCredentials: true,
  });
```

---

## 2. 23 Domain API Request Modules

API requests are organized under `src/lib/` across 23 modular domain services:

| Request Module | Domain | Primary Responsibilities |
| :--- | :--- | :--- |
| [`src/lib/authRequests.js`](../src/lib/authRequests.js) | Auth | User login, registration, OTP email verification, password reset |
| [`src/lib/modelRequests.js`](../src/lib/modelRequests.js) | Models | Model publishing, category filtering, detail view queries, versions |
| [`src/lib/orderRequests.js`](../src/lib/orderRequests.js) | Orders | Order intent creation, order history queries, order cancellation |
| [`src/lib/ChatRequests.js`](../src/lib/ChatRequests.js) | Conversations | User active conversation list, removing chats |
| [`src/lib/MessageRequests.js`](../src/lib/MessageRequests.js) | Messages | Fetching message history, sending messages & file attachments |
| [`src/lib/walletRequests.js`](../src/lib/walletRequests.js) | Wallet | Wallet balance queries, transaction logs |
| [`src/lib/payoutRequests.js`](../src/lib/payoutRequests.js) | Payouts | Developer payout requests, listing payout status |
| [`src/lib/stripeConnectRequests.js`](../src/lib/stripeConnectRequests.js) | Stripe Connect | Checking onboarding status, demo completion toggle |
| [`src/lib/reviewRequests.js`](../src/lib/reviewRequests.js) | Reviews | Submitting model reviews, fetching reviews by model ID |
| [`src/lib/taxonomyRequests.js`](../src/lib/taxonomyRequests.js) | Taxonomy | Categories, tags, modalities lookup queries |
| [`src/lib/verificationRequests.js`](../src/lib/verificationRequests.js) | Verification | Developer KYC document upload and status tracking |
| [`src/lib/adminRequests.js`](../src/lib/adminRequests.js) | Admin | Dashboard stats, user CRUD, admin settings |
| [`src/lib/disputeRequests.js`](../src/lib/disputeRequests.js) | Disputes | Opening disputes, admin dispute resolution |
| [`src/lib/notificationsRequests.js`](../src/lib/notificationsRequests.js) | Notifications | User notification stream, mark-all-as-read |
| [`src/lib/loaders.js`](../src/lib/loaders.js) | Router Loaders | Route data loaders (`getMeReq`, `getMyOrdersReq`) |
| [`src/lib/actions.js`](../src/lib/actions.js) | Router Actions | Form action handlers (`LoginAction`, `deletingModelAction`) |

---

## 3. Data Loader Pattern

Route data pre-fetching is implemented via React Router v6 loaders in `loaders.js`. For example, `getMyOrdersReq` fetches current orders for either developer or client roles:

```javascript
export const getMyOrdersReq = async () => {
  const api = createAPI();
  const token = getAuthToken();
  const response = await api.get("orders", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
```

---

## 4. Frontend Stripe Integration Setup

The client mounts Stripe Elements for payment processing using the publishable key configured in `.env`:

```env
# Client environment configuration (.env)
REACT_APP_STRIPE_PUBLIC_KEY="pk_test_..."
```

### Payment Confirmation Flow

Upon payment completion in the Stripe Elements card form, the client retrieves the `clientSecret` from the backend via `GET /api/orders/:id/payment-client-secret`. It then uses the Stripe SDK method `stripe.confirmCardPayment(clientSecret, ...)` to finalize the intent and handle 3D Secure authentication. This ensures that the client UI updates securely and immediately alongside background webhooks.
