import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  pages: {
    signIn: '/auth/signin', // Custom sign-in page
    signOut: '/auth/signout', // Custom sign-out page
    error: '/auth/error', // Error handling page
    verifyRequest: '/auth/verify-request', // (for email sign-in)
  },
  secret: process.env.NEXTAUTH_SECRET,
});