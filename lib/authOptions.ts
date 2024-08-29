import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ;

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET as string,
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Admin Login",
      credentials: {
        email: {label : "Email" , type: "email"},
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Static password check
        if (credentials?.password === ADMIN_PASSWORD && credentials?.email === ADMIN_EMAIL) {
          return { id: "66bbafc1e42954de64aab897", name: "Admin" , email:"hahahaha" };
        } else {
          throw new Error("Invalid Password");
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          _id: token.id,
          email: token.email,
        },
      };
    },
  },
};
