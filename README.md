# [MTBC Teslo Shop](https://mtbc-teslo-shop.vercel.app/)

### Technologies used:

- Framework: [Next.js](https://nextjs.org/)
- Authentication: [NextAuth.js](https://next-auth.js.org/)
- Database ORM: [Prisma](https://www.prisma.io/)
- Payment Integration: [PayPal React JS](https://www.npmjs.com/package/@paypal/react-paypal-js)
- Styling: [TailwindCSS](https://tailwindcss.com/)
- Icons: [Lucide React](https://lucide.dev/), [React Icons](https://react-icons.github.io/react-icons/)
- Form Handling: [React Hook Form](https://react-hook-form.com/)
- Utilities: [clsx](https://github.com/lukeed/clsx), [class-variance-authority](https://cva.style/docs), [tailwind-merge](https://github.com/dcastil/tailwind-merge), [zod](https://zod.dev/), [bcryptjs](https://github.com/dcodeIO/bcrypt.js), [cloudinary](https://cloudinary.com/), [react-hot-toast](https://react-hot-toast.com/), [react-loading-skeleton](https://github.com/dvtng/react-loading-skeleton), [zustand](https://zustand-demo.pmnd.rs/), [swiper](https://swiperjs.com/)
- Hosting: [Vercel](https://vercel.com/)

## Description

An e-commerce platform inspired by Tesla’s online store, developed on a Next.js course.

### Running in Development

1. Clone the repository.
2. Create a copy of the `.env.template` file, rename it to `.env`, and update the environment variables:
   - Set up your database and add the connection URL to your `.env` file.
   - Configure your authentication providers and add the necessary environment variables for NextAuth.js.
3. Install dependencies: `npm ci`
4. Start the database: `docker compose up -d`
5. Run Prisma migrations: `npx prisma migrate dev`
6. Seed the database: `npm run seed`
7. Start the project: `npm run dev`

### Running in Production

1. Ensure all environment variables are set up correctly in your hosting platform (e.g., Vercel).
2. Build the project: `npm run build`
3. Start the production server: `npm start`

### Notes

1. Consider images are located in the `public` folder, and the routes of the original seed corresponds to that folder. If you want to use your images, you must update the routes in the seed file or uploaded in the Cloudinary service.
2. Builds apply pending migrations and generate the Prisma client. The seed command is manual and is not part of the build.

### Runtime and security verification

Use Node.js 24.22.2 or a newer patched 24.x LTS release (.nvmrc). Keep the
deployment runtime on Node 24 and install the locked packages with npm ci.

- npm run build preserves automatic Prisma migrations and client generation,
  then builds Next.js. The build environment needs database access.
- npm run build:check generates Prisma and builds Next.js without applying
  migrations. Use this for local compilation checks.
- npm run typecheck checks generated Prisma/route types without a TypeScript
  cache. Ambient types are restricted to this project's Node and React types.
- npm run lint checks ESLint separately from the build.
- npm test verifies route permissions, admin action guards, address ownership,
  order quantities, same-origin login redirects and payment validation. All
  database, Cloudinary and payment-provider adapters in these tests are simulated.
- npm run test:smoke checks the running production app's public pages, anonymous
  access restrictions, auth endpoints and compiled assets. Start npm start first;
  set SMOKE_BASE_URL for another local port.
- npm run check:db executes a read-only SELECT 1 using the same environment loader
  as Next.js. A successful build does not prove database availability.
- npm audit --omit=dev checks production packages; npm audit checks all packages.

The update migrates Next.js/React, NextAuth, Prisma 6, Swiper 12, Zod 4 and
Cloudinary. Deployment still applies the existing migrations; no schema changes,
new migrations, seed runs or real payment operations were performed for validation.
The Docker image is patched within PostgreSQL 15; existing database data was not
restarted or modified.

Protected routes now require a valid identity, and admin actions check the role
on the server. Address actions require the current user to own the address.
Payment transaction IDs can only be attached to the current user's unpaid
orders. A payment is accepted only when its transaction, invoice, USD amount and
completed capture match the stored order. Order quantities must be positive
integers. Verify the complete checkout flow using a running database and the
PayPal sandbox before deployment.

The full audit retains ESLint's minimatch 3.x finding under
[GHSA-g3hv-75wg-m249](https://github.com/isaacs/minimatch/security/advisories/GHSA-g3hv-75wg-m249).
npm marks all versions below 11.0.1 as affected; the upstream report describes
10.2.6 preprocessing with optimizationLevel >= 2, absent from 3.x. Keep this
discrepancy under review. The TypeScript parser uses patched minimatch 11.x;
a global override would break the callable 3.x API used by other ESLint plugins.
