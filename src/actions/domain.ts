"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
const domainImport = z.array(
	z.object({
		domain: z.string(),
		group: z.string(),
	}),
);

export async function deleteDomain(domainName: string) {
	const [{ id }] = await prisma.domain.findMany({ where: { domainName } });
	const domain = await prisma.domain.delete({ where: { id } });
	redirect(`/server/${domain.serverId}/domains`);
}
export async function updateDomainSettings(data: FormData) {
	const session = await auth();
	const id = data.get("id")?.toString();
	const domainGroupId = data.get("domainGroupId")?.toString();
	const serverId = data.get("serverId")?.toString();
	await prisma.domain.update({
		where: { id },
		data: {
			domainGroupId,
			updatedAt: new Date(),
			updatedBy: session?.user.id,
		},
	});
	revalidatePath(`/server/${serverId}/domains`);
}
export async function massImport(data: FormData) {
	try {
		const session = await auth();
		const file = data.get("file") as File;
		const serverId = data.get("serverId")?.toString() as string;
		const text = await file.text();
		const parsed = domainImport.safeParse(JSON.parse(text));
		if (!parsed.success) {
			const error = parsed.error.flatten().fieldErrors;
			// @ts-expect-error wtf zod?
			throw new Error(Object.keys(error).length > 0 ? error?.join(", ") : "Unknown Validation Error");
		}
		await prisma.$transaction(async (tx) => {
			for (const domain of parsed.data as { domain: string; group: string }[]) {
				await tx.domain.create({
					data: {
						domainName: domain.domain,
						serverId,
						createdAt: new Date(),
						createdBy: session?.user?.id,
						domainGroup: {
							connect: {
								groupId: domain.group,
							},
						},
					},
				});
			}
		});
		revalidatePath(`/server/${serverId}/domains`);
		return { success: true };
	} catch (error) {
		const { message, name, cause } = error as Error;
		return { error: `${name}: ${message} - ${cause}` };
	}
}
