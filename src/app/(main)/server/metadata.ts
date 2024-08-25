import discordRest from "@/lib/discord";
import { type APIGuild, Routes } from "discord-api-types/v10";
import type { Metadata } from "next";

export function metadata(title?: string) {
	return async ({ params }: { params: { id: string } }): Promise<Metadata> => {
		const serverName = ((await discordRest.get(Routes.guild(params.id))) as APIGuild).name;
		return {
			title: `${serverName}${title ? ` > ${title}` : ""}`,
		};
	};
}
