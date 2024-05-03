import { NextAuthOptions } from "next-auth";
import UserModel from "@/models/user.model";
import dbConnection from "@/utils/dbConnection";
import GoogleProvider from "next-auth/providers/google";
import { GoogleProfile } from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  callbacks: {
    async signIn(params) {
      await dbConnection();
      const profile = params.profile as GoogleProfile;
      const userExists = await UserModel.findOne({ email: profile?.email });
      if (!userExists) {
        const email = profile?.email;
        const atIndex = email.indexOf("@");
        const username = email.slice(0, atIndex);
        await UserModel.create({
          email,
          name: profile?.name,
          profilePicture: profile?.picture,
          username,
        });
      }
      return true;
    },
    async session({ session }) {
      const user = await UserModel.findOne({ email: session.user.email });
      session.user._id = user?._id.toString();
      session.user.email = user?.email;
      session.user.profilePicture = user?.profilePicture;
      session.user.username = user?.username;
      return session;
    },
  },
};
