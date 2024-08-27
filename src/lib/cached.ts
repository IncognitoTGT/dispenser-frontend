import type { APIGuild, APIRole, APIUser } from "discord-api-types/v10";
import { Routes } from "discord-api-types/v10";
import { cache } from "react";
import { prisma } from "./db";
import discordRest from "./discord";
export const serversList = cache(async <T>(...args: Parameters<typeof prisma.server.findMany>) => {
	const dbServers = await prisma.server.findMany(...args);
	return Promise.all(
		dbServers.map(async (server) => {
			const discord = (await discordRest.get(Routes.guild(server.serverId))) as APIGuild;
			return { ...(server as (typeof dbServers & T)[number]), ...discord };
		}),
	);
});
export const usersList = cache(
	async (prismaArgs?: Parameters<typeof prisma.user.findMany>[0], fetchDiscord = false) => {
		const dbUsers = await prisma.user.findMany(prismaArgs);
		return Promise.all(
			dbUsers.map(async (user) => {
				if (!fetchDiscord) return user;
				const discord = (await discordRest.get(Routes.user(user.userId))) as APIUser;
				return { ...user, ...discord };
			}),
		);
	},
);
export const domainsList = cache(prisma.domain.findMany);
export const domainGroupList = cache(prisma.domainGroup.findMany);
export const rolesList = cache(async (prismaArgs: Parameters<typeof prisma.role.findMany>[0]) => {
	const dbRoles = await prisma.role.findMany(prismaArgs);
	return Promise.all(
		dbRoles.map(async (role) => {
			const discord = (await discordRest.get(
				Routes.guildRole(
					typeof prismaArgs?.where?.serverId === "string" ? prismaArgs?.where?.serverId : "",
					role.roleId,
				),
			)) as APIRole;
			return { ...role, ...discord };
		}),
	);
});
