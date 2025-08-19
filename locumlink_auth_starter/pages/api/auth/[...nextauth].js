import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import prisma from '../../../lib/prisma';
import bcrypt from 'bcryptjs';

export default NextAuth({
  session: { strategy: 'jwt' },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: { email: {label:'Email', type:'email'}, password: {label:'Password', type:'password'} },
      async authorize(credentials) {
        const user = await prisma.user.findUnique({ where: { email: credentials.email }});
        if(!user) return null;
        const ok = await bcrypt.compare(credentials.password, user.password);
        if(!ok) return null;
        return { id: user.id, email: user.email, role: user.role };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if(user) token.role = user.role;
      if(user && user.email) token.email = user.email;
      return token;
    },
    async session({ session, token }) {
      session.user = session.user || {};
      session.user.email = token.email;
      session.user.role = token.role;
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET
});
