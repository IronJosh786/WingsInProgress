import NextAuth, { type DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      _id?: string;
      email?: string;
      profilePicture?: string;
      username?: string;
    } & DefaultSession["user"];
  }
}
