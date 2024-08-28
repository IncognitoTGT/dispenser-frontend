"use server";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateRoleSettings(data: FormData) {
	const roleId = data.get("roleId")?.toString();
	const serverId = data.get("serverId")?.toString();
	const specialLimit = Number(data.get("specialLimit")?.toString());
	const adminRole = Boolean(data.get("adminRole"));
	await prisma.role.update({
		where: { roleId },
		data: {
			specialLimit,
			adminRole,
			updatedAt: new Date(),
		},
	});
	revalidatePath(`/server/${serverId}/roles`);
}
export async function deleteRole(roleId: string) {
	const role = await prisma.role.delete({ where: { roleId } });
	redirect(`/server/${role.serverId}/roles`);
}
