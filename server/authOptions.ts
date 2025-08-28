import Credentials from "next-auth/providers/credentials";
import IServerContainer from "./di/IServerContainer";
import type { AuthOptions } from "next-auth";
import { IUser } from "./models/users";
import Acl from "@/acl/Acl";
import { Cleaner } from "@/acl/cleaner";

export function authOptionsFactory(ctx: IServerContainer): AuthOptions {
  return {
    // Configure one or more authentication providers
    providers: [
      Credentials({
        name: "Credentials",
        credentials: {
          email: {
            label: "Email",
            type: "email",
            placeholder: "example@email.com",
          },
          password: { label: "Password", type: "password" },
        },
        async authorize(credentials) {
          try {
            const user: IUser = await ctx.UsersService.authorize(credentials);
            console.log("USER AUTH: ", user);
            return user;
          } catch (e) {
            console.error(e);
            return null;
          }
        },
      }),
      // ...add more providers here
    ],
    callbacks: {
      jwt({ token, user }) {
        if (user) token.user = user;
        console.log("JWT: ", token);
        return token;
      },
      session({ session, token }) {
        if (token.user) {
          const cleaner = new Cleaner(ctx);
          const acl = cleaner.cleanRolesAndRules(
            new Acl(ctx.roles, ctx.rules),
            token.user.role,
          );
          session.identity = { ...token.user, ...acl };
        }
        console.log("SESSION: ", session);
        return session;
      },
    },
  };
}
