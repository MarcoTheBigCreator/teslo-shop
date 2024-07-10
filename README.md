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
3. Install dependencies: `npm install`
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
2. Every build will run the seed script, so be careful if you are using a production database.
