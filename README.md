# FixMate — Smart Device & Home Appliance Repair Platform (Client)

**FixMate** is a full-stack, role-based on-demand repair service booking platform built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, **BetterAuth**, **Recharts**, and **Stripe**. Verified technicians list the repair services they offer, customers browse and submit repair requests with live step-by-step tracking, and payments are processed online **only after** the repair is completed.

## Live URL
- **Live Site:** https://fixmatewz.vercel.app
- **API Server:** https://fixmate-server-coral.vercel.app

## Why FixMate?
Finding a trustworthy repair technician is often frustrating—customers rarely know the live status of their device and are frequently asked to pay upfront before work is done. FixMate brings structure and transparency to both sides: every repair job follows a strict status pipeline (`Requested → Accepted → In Progress → Completed → Paid`), and payment unlocks strictly after completion.

## Stakeholder Roles
- **Customer:** Browses approved services, submits repair requests, cancels requests while still `requested`, tracks live job timelines, pays for completed jobs via Stripe Checkout, downloads PDF invoices, and leaves ratings & reviews.
- **Technician:** Publishes repair services with ImgBB banner uploads, manages service availability and details, accepts/rejects incoming requests, updates job progress, and sets the final repair amount upon completion.
- **Admin:** Moderates service listings (approve/reject), manages user roles, monitors all platform bookings, and tracks Stripe revenue and transactions.

## Key Features
- **Authentication & Role-Based Routing:** BetterAuth with MongoDB adapter, custom user profile fields (`role`, `phone`, `area`, `bio`), email/password & Google OAuth sign-in, and a JWT token bridge (`/api/auth/token`) for protected Express API calls.
- **Server-Side Search, Filter, Sort & Pagination:** MongoDB-backed keyword search, category & service mode filters (`Home Visit` / `Shop Drop-off`), price/newest sorting, and pagination synced with URL query parameters.
- **Visual Job Timeline Tracker:** Real-time 5-step progress tracker (`Requested → Accepted → In Progress → Completed → Paid`) in My Bookings.
- **Pay-After-Service Stripe Checkout:** Checkout unlocks only when a job is `completed` and `unpaid`, with idempotent payment verification, PDF invoice downloads (`jsPDF`), and post-payment reviews.
- **ImgBB Image Uploads:** Direct image upload for technician service banners and user profile avatars.
- **Role Dashboards & Theme Support:** Responsive collapsible sidebar dashboards with `Recharts` analytics, Sonner toast notifications, confirmation modals, custom 404/loading/error pages, and dark/light theme toggle.

## NPM Packages Used
- **Core:** `next`, `react`, `react-dom`, `typescript`, `tailwindcss`
- **Authentication:** `better-auth`, `mongodb`, `jsonwebtoken`, `@types/jsonwebtoken`
- **UI, Charts & Utilities:** `lucide-react`, `sonner`, `recharts`, `jspdf`, `clsx`, `tailwind-merge`

## Environment Variables (`.env.local`)
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_IMGBB_API_KEY=your_imgbb_api_key

MONGODB_URI=your_mongodb_connection_string
MONGODB_DB_NAME=fixmate

BETTER_AUTH_SECRET=your_better_auth_secret
BETTER_AUTH_URL=http://localhost:3000

JWT_SECRET=your_shared_jwt_secret

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

## Running Locally
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000).
