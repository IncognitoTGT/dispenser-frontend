import { type APIGuild, type APIUser, Routes } from "discord-api-types/v10";
import { cache } from "react";
import { prisma } from "./db";
import discordRest from "./discord";
export const serversList = cache(
  async (...args: Parameters<typeof prisma.server.findMany>) => {
    const dbServers = await prisma.server.findMany(...args);
    return Promise.all(
      dbServers.map(async (server) => {
        const discord = (await discordRest.get(
          Routes.guild(server.serverId),
        )) as APIGuild;
        return { ...server, ...discord };
      }),
    );
  },
);
export const usersList = cache(
  async (...args: Parameters<typeof prisma.user.findMany>) => {
    const dbUsers = await prisma.user.findMany(...args);
    return Promise.all(
      dbUsers.map(async (user) => {
        const discord = (await discordRest.get(
          Routes.user(user.userId),
        )) as APIUser;
        return { ...user, ...discord };
      }),
    );
  },
);
export const domainsList = cache(prisma.domain.findMany);
