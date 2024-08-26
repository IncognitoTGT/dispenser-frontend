"use server";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function updateServerSettings(data: FormData) {
	const serverId = data.get("serverId")?.toString();
	const logsWebhookUrl = data.get("logsWebhookUrl")?.toString();
	const reportsWebhookUrl = data.get("reportsWebhookUrl")?.toString();
	const usagePerUser = Number(data.get("usagePerUser")?.toString());
	await prisma.serverSettings.update({
		where: { serverId },
		data: {
			logsWebhookUrl,
			reportsWebhookUrl,
			usagePerUser,
			updatedAt: new Date(),
		},
	});
	revalidatePath(`/servers/${serverId}`);
}
