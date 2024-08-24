declare module "next-auth" {
	interface Session {
		user: {
			id: string;
			username: string;
		} & DefaultSession["user"];
	}
}
import { type APIUser, Routes } from "discord-api-types/v10";
import NextAuth, { type DefaultSession } from "next-auth";
import Discord from "next-auth/providers/discord";
import discordRest from "./discord";
export const { auth, handlers, signIn, signOut } = NextAuth({
	pages: {
		signIn: "/auth/login",
		signOut: "/auth/logout",
		error: "/auth/error",
	},
	callbacks: {
		signIn: async ({ account }) => account?.providerAccountId === process.env.OWNER_ID,
		async jwt({ token, account }) {
			const id = account?.providerAccountId;
			if (id) {
				token.id ||= id;
				const discordInfo = (await discordRest.get(Routes.user(id))) as {
					username: string;
					avatar: string;
				};
				console.log(discordInfo);
				const { avatar: image, username } = (await discordRest.get(Routes.user(id))) as APIUser;
				token.image = `https://cdn.discordapp.com/avatars/${token.id}/${image}.png`;
				token.username = username;
			}
			return token;
		},
		async session({ session, token }) {
			session.user.id = token.id as string;
			session.user.image = token.image as string;
			session.user.username = token.username as string;
			return session;
		},
	},
	providers: [
		Discord({
			clientId: process.env.CLIENT_ID,
			clientSecret: process.env.CLIENT_SECRET,
		}),
	],
});
