# Mahalakshmi E-commerce – Codebase Overview

## 1. Tech Stack at a Glance

- **Framework**: Next.js 15 App Router with hybrid server/client components (`app/`).
- **UI**: React 19, Tailwind (via `globals.css`), Material UI, Radix UI primitives, React Hook Form.
- **State/Async**: Redux Toolkit + redux-persist (`store/`), TanStack React Query for data tables, custom hooks in `hooks/`.
- **Database**: MongoDB accessed through Mongoose models (`models/`).
- **APIs & Services**: Razorpay for payments, Cloudinary for media, Mailtrap for transactional emails.
- **Tooling**: ESLint 9, Turbopack dev server, PostCSS/Tailwind 4 config.

## 2. Repository Layout & Responsibilities

| Path | Purpose |
| --- | --- |
| `app/` | Next.js routes. `app/(root)/(website)` hosts the public storefront (product lists, checkout, orders). `app/(root)/(admin)` renders the admin dashboard. `app/api/` contains serverless API endpoints for auth, catalog management, orders, media, etc. |
| `components/` | Reusable UI for admin and website experiences (tables, upload widgets, carousels, global providers). |
| `lib/` | Cross-cutting utilities: database connection, authentication guard, Cloudinary config, mailing helper, common response helpers. |
| `models/` | Mongoose schemas for `User`, `Product`, `ProductVariant`, `Category`, `Coupon`, `Order`, `Review`, `Media`, and `Otp`. |
| `store/` | Redux Toolkit store configuration and slices backing client-side state (cart, filters, etc.). |
| `email/` | HTML email templates (OTP, verification, order notification). |
| `routes/` | Centralized path constants for admin/website navigation helpers. |
| `docs/` | Project documentation (this file). |

## 3. Application Flow Highlights

1. **Authentication**
   - Registration & login handled via `app/api/auth/*` routes. Users verify email through signed tokens generated with `SECRET_KEY`, stored as `access_token` cookies in `verify-otp`.
   - Middleware (`middleware.js`) and `lib/authentication.js` validate JWTs for protected admin/user areas.

2. **Catalog & Content Management**
   - Admin CRUD endpoints live under `app/api/category`, `product`, `product-variant`, `media`, etc.
   - Admin UI uses `components/Application/Admin/*` (e.g., `Datatable.jsx`, `UploadMedia.jsx`) and React Query to fetch through REST endpoints composed with `NEXT_PUBLIC_BASE_URL`.
   - Cloudinary uploads leverage a signed endpoint (`app/api/cloudinary-signature/route.js`) plus `next-cloudinary` widgets.

3. **Storefront**
   - Public pages (`app/(root)/(website)/...`) fetch data from internal APIs exposed through `NEXT_PUBLIC_API_BASE_URL`, e.g., product detail, cart checkout, order tracking.
   - Checkout integrates Razorpay: client obtains order ID via `/api/payment/get-order-id`, verifies payment server-side in `/api/payment/save-order`, and sends transactional emails.

4. **Emails & Notifications**
   - `lib/sendMail.js` sends transactional emails via Mailtrap SDK (token-based).
   - Email templates in `email/` are imported by auth/payment flows to deliver OTPs, verification links, and receipts.

## 4. Environment Variables

| Variable | Required | Scope | Description / Usage |
| --- | --- | --- | --- |
| `MONGODB_URI` | ✅ | Server | Connection string used by `lib/databaseConnection.js` to initialize Mongoose. |
| `SECRET_KEY` | ✅ | Server | Symmetric signing key for JWTs in auth routes and middleware (`app/api/auth/*`, `middleware.js`, `lib/authentication.js`). |
| `MAILTRAP_TOKEN` | ✅ | Server | Mailtrap API token used by `MailtrapClient` in `lib/sendMail.js`. |
| `MAILTRAP_SENDER_EMAIL` | ✅ | Server | Default “from” address for outgoing emails. |
| `MAILTRAP_SENDER_NAME` | ➖ | Server | Optional “from” display name. |
| `MAILTRAP_DEFAULT_TO` | ✅ | Server | Default admin recipient (used as fallback for order/contact notifications). |
| `MAILTRAP_CATEGORY` | ➖ | Server | Optional category label for Mailtrap messages. |
| `NEXT_PUBLIC_BASE_URL` | ✅ | Client & Server | Absolute site origin used to construct links in emails and admin data-fetch URLs (e.g., verification links, datatable pagination). |
| `NEXT_PUBLIC_API_BASE_URL` | ✅ | Client | Base URL for client-side data fetching in storefront pages/components (`product`, `order-details`, `FeaturedProduct`). |
| `NODE_ENV` | ➖ | Both | Standard environment flag. Controls error verbosity in `lib/helperFunction.js` and cookie security flags. |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | ✅ | Both | Cloudinary cloud identifier for uploads (`lib/cloudinary.js`, upload widgets). |
| `NEXT_PUBLIC_CLOUDINARY_API_KEY` | ✅ | Both | Public API key for Cloudinary SDK/widget initialization. |
| `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` | ✅ | Both | Upload preset referenced by admin/profile upload flows (`app/api/profile/update`). |
| `CLOUDINARY_SECRET_KEY` | ✅ | Server | Private API secret used to sign upload parameters and server-side Cloudinary SDK calls. |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | ✅ | Both | Public Razorpay key used by checkout client and server order creation. |
| `RAZORPAY_KEY_SECRET` | ✅ | Server | Razorpay secret used to create and verify orders (`app/api/payment/*`). |

> Copy `.env.example`, fill the above variables, and restart the dev server so Next.js can expose `NEXT_PUBLIC_*` values at build time.

## 5. Setup & Operational Notes

1. **Install & Dev Server**

   ```bash
   npm install
   npm run dev
   ```

   Turbopack handles hot reload; ensure MongoDB and external services (Razorpay, Cloudinary, SMTP) are reachable.

2. **Database & Models**
   - Models auto-pluralize collections; ensure indexes/unique constraints match expectations (e.g., slug uniqueness).
   - `lib/databaseConnection` caches connections for serverless functions.

3. **Security Considerations**
   - JWT cookies (`access_token`) are `httpOnly`/`secure` in production.
   - Cloudinary signatures and Razorpay verification run server-side; never expose `CLOUDINARY_SECRET_KEY` or `RAZORPAY_KEY_SECRET` on the client.

4. **Email Deliverability**
   - Update `email/` templates to match brand voice.
   - Use verified domains in SMTP credentials to avoid spam issues.

5. **Extending APIs**
   - Follow existing patterns: validate with Zod, call `connectDB`, wrap responses with `lib/helperFunction.response`, and centralize side-effects (mail, uploads) via `lib`.

This document should serve as the primary reference when onboarding, configuring environments, or extending the platform. Update it whenever new modules or configuration switches are introduced.
