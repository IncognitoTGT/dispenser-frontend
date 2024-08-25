"use server";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function updateServerSettings(data: FormData) {
	"use server";
	const logsWebhookUrl = data.get("logsWebhookUrl")?.toString();
	const reportsWebhookUrl = data.get("reportsWebhookUrl")?.toString();
	const serverId = data.get("serverId")?.toString() as string;
	await prisma.serverSettings.update({
		where: { serverId },
		data: {
			logsWebhookUrl,
			reportsWebhookUrl,
			reportsEnabled: Boolean(reportsWebhookUrl),
			logsEnabled: Boolean(logsWebhookUrl),
		},
	});
	revalidatePath(`/servers/${serverId}`);
}
