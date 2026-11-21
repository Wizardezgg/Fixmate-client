# FixMate — Smart Device & Home Appliance Repair Platform

**FixMate** is a full-stack, role-based on-demand repair service booking platform where verified technicians list repair services, customers request repairs and track every stage live, and payments are processed securely via Stripe **only after** the repair is completed.

## Live URL
- **Live Site:** `<Add your deployed Vercel URL here>`
- **API Server:** `<Add your deployed Express Server URL here>`

## Admin & Test Account Credentials
- **Admin:** `admin@fixmate.com` / `Admin123!`
- **Technician:** `arafat@fixmate.com` / `Arafat123!` (also `easin@fixmate.com` / `Easin123!`)
- **Customer:** `sumon@fixmate.com` / `Sumon123!` (also `rifat@fixmate.com` / `Rifat123!`)

## Key Features
- **Role-Based Authentication & Access Control:** BetterAuth (MongoDB adapter) with `customer`, `technician`, and `admin` roles, plus JWT bridge for Express API authorization.
- **Server-Side Search, Filter, Sort & Pagination:** MongoDB-powered filtering by keyword, category, service mode (`Home Visit` / `Shop Drop-off`), price sorting, and pagination synced with URL query parameters.
- **Job Status Pipeline & Timeline Tracker:** Server-enforced transitions (`requested -> accepted | rejected | cancelled`, `accepted -> in-progress`, `in-progress -> completed`) with a 5-step visual tracker (`Requested -> Accepted -> In Progress -> Completed -> Paid`).
- **Pay-After-Service Stripe Checkout:** Customers pay only after a job is marked `completed`, with idempotent payment verification, Stripe webhook support, PDF invoice download, and post-payment ratings & reviews.
- **ImgBB Image Uploads:** Direct image upload for technician service banners and user profile avatars.
- **Role Dashboards & Analytics:** Dedicated dashboards for Customers, Technicians, and Admins with Recharts visualizations and dark/light theme support.

## Tech Stack & NPM Packages
- **Framework:** `next`, `react`, `react-dom`, `typescript`, `tailwindcss`
- **Authentication:** `better-auth`, `mongodb`, `jsonwebtoken`
- **UI & Charts:** `lucide-react`, `sonner`, `recharts`, `jspdf`, `clsx`, `tailwind-merge`

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
```

## Running Locally
```bash
npm install
npm run dev
```
