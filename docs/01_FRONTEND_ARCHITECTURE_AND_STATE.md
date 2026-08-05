# 01 — Frontend Architecture & State Management

> **Repository**: [`modelLink_client`](../README.md)  
> **Framework**: React 18, React Router v6 Data API (`createBrowserRouter`), Redux Toolkit

---

## 1.1 Routing Architecture (React Router v6 Data API)

**Implementation**: [`src/App.js`](../src/App.js)

The application utilizes `createBrowserRouter` (Data API variant) enabling pre-render data fetching (`loader`), form mutation actions (`action`), and per-route error boundaries (`errorElement: <RouteErrorBoundary />`).

```mermaid
flowchart TD
    App["createBrowserRouter([ ... ])"]
    Root["RootLayout (Header, Nav, Footer, Modals)"]

    subgraph Pages["Application Routes"]
        Home["Home (/)"]
        Models["Models Catalog (/models)"]
        ModelView["Model Detail (/models/view/:id)"]
        Cart["Cart (/cart)"]
        Wallet["Wallet (/wallet)"]
        Admin["Admin Dashboard (/admin/*)"]
    end

    App --> Root
    Root --> Pages
```

---

## 1.2 Redux Toolkit Store & Slice Architecture

**Implementation**: [`src/store/index.js`](../src/store/index.js)

```mermaid
flowchart LR
    subgraph ReduxStore["Redux Toolkit Store"]
        AuthSlice["authSlice<br/>(User Session & JWT Token)"]
        RealtimeSlice["realtimeSlice<br/>(Socket.io Messages & Users)"]
        UISlice["UI-slice<br/>(Toasts & Spinners)"]
        CartSlice["Cart-slice<br/>(Shopping Cart Items)"]
    end

    AuthSlice -->|Sync| LocalStorage["localStorage ('userData')"]
    RealtimeSlice -->|Listen| SocketEvents["Socket.io Events ('receive_msg')"]
```

### 4 Store Slices

1. **`authSlice`** (`src/store/authSlice.js`): Stores user session data (`userData`). Automatically synchronizes state to `localStorage.userData`.
2. **`realtimeSlice`** (`src/store/realtimeSlice.js`): Manages real-time data from WebSockets: active conversations array (`chats`), unread notification count, online users list (`onlineUsers`).
3. **`UI-slice`** (`src/store/UI-slice.js`): Controls global toast notifications (`notification`) and loading spinner state.
4. **`Cart-slice`** (`src/store/Cart-slice.js`): Shopping cart items and price calculation.

---

## 1.3 Real-Time Hook Composition (`useSocket` & `useRealtimeSession`)

```mermaid
sequenceDiagram
    autonumber
    participant App as App.js Root Component
    participant Hook as useRealtimeSession Hook
    participant Socket as useSocket (Singleton Manager)
    participant Server as Socket.io Server Node

    App->>Hook: Initialize(userId, token)
    Hook->>Socket: Connect Socket Instance
    Socket->>Server: Connect with socket.handshake.auth.token = JWT
    Server-->>Socket: Socket Connected
    Socket->>Hook: Delegate Events via useRef
    Server->>Hook: Emit 'receive_msg'
    Hook->>App: Update Redux realtimeSlice
```

### Ref-Based Event Delegation Pattern

In [`src/hooks/useSocket.js`](../src/hooks/useSocket.js), event handlers are stored in a `useRef` (`handlersRef.current = handlers`). Socket listeners call `handlersRef.current[eventName]()`, allowing dynamic React state updates without re-binding Socket.io event listeners on every render.
