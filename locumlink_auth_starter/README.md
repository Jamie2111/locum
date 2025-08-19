# LocumLink Auth Starter (Vercel-hardened)

This upgraded starter includes:
- Email/password auth using NextAuth (Credentials provider)
- Role-based dashboards (Doctor vs Facility)
- Prisma singleton pattern to avoid serverless connection issues
- Safe API handlers and OpenAI timeout
- Ingest + match endpoints for Zapier

## Quickstart (local)
1. `npm install`
2. Create `.env.local` with DATABASE_URL, NEXTAUTH_SECRET, OPENAI_API_KEY
3. `npx prisma migrate dev --name init`
4. `node scripts/seedDoctors.js`
5. `npm run dev`
6. Visit http://localhost:3000

Note: For production on Vercel, add the same env vars in Project Settings.

