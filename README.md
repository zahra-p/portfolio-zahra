# Zahra Adelinia — Portfolio (Next.js + Tailwind)

**What you got**

- Next.js (App Router) portfolio template
- Tailwind CSS for styling
- Dark/Light theme toggle
- Framer Motion basic animation
- Contact form wired to Formspree via environment variable

## Quick setup (local)

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a Formspree form at https://formspree.io and get the form endpoint (looks like `https://formspree.io/f/xyzabc`).
3. Create `.env.local` in project root and add:
   ```
   NEXT_PUBLIC_FORMSPREE_ENDPOINT=https://formspree.io/f/your_form_id
   NEXT_PUBLIC_CONTACT_EMAIL=zahra.adelinia@gmail.com
   ```
4. Run dev:
   ```bash
   npm run dev
   ```
5. Open http://localhost:3000

## Deploy to Vercel

- Push the project to GitHub.
- Import project on Vercel (https://vercel.com/new).
- In Vercel dashboard, add the same environment variables.
- Deploy.

## Notes

- Replace demo links in `/data/projects.json` with your real demo & GitHub links when ready.
- If you prefer EmailJS or a backend, I can add instructions.

npm i @reduxjs/toolkit react-redux
npm i @tanstack/react-query
npm i @tanstack/react-query-devtools

npm i -D json-server
راه‌اندازی JSON Server (API لوکال)

چرا این ترکیب؟

React Query: کش، لودینگ/خطا، ریفچ، staleTime، retry—all-in-one برای داده‌های قابل دریافت از سرور.

Redux Toolkit: مدیریت cart، شمارنده، جمع قیمت، و تعاملات UI بین صفحات (Global UI state).

نتیجه: کد تمیزتر، تست‌پذیرتر، و آمادهٔ مقیاس.

الگوی صنعتی: React Query برای سرور استِیت، Redux برای اپ استِیت—ترکیب ایده‌آل برای مصاحبه‌ها و پروژه‌های واقعی.

npm run api
