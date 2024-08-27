import { DataTable } from "@/components/data-table/table";
import { SubmitButton } from "@/components/submit-button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { rolesList } from "@/lib/cached";
import { prisma } from "@/lib/db";
import { Plus, UserRoundCog } from "lucide-react";
import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";
import { metadata } from "../../metadata";
import { columns } from "./columns";
export default async function Page({ params }: { params: { id: string } }) {
	const roles = await rolesList({
		where: { serverId: params.id },
	});
	if (!roles) return notFound();
	return (
		<div className="flex p-8 gap-4 flex-col">
			<h1 className="text-2xl font-bold">Roles</h1>
			<div className="flex flex-row gap-2 text-xl text-primary items-center">
				<UserRoundCog /> Manage
			</div>
			<hr />
			<DataTable data={roles} columns={columns} />
			<div className="flex flex-row gap-2 text-xl text-primary items-center">
				<Plus /> Add new
			</div>
			<hr />
			<form
				className="flex flex-col gap-2 w-full"
				action={async (data) => {
					"use server";
					const roleId = data.get("roleId")?.toString() as string;
					const specialLimit = Number(data.get("specialLimit")?.toString());
					const adminRole = Boolean(data.get("adminRole"));
					await prisma.role.create({
						data: {
							serverId: params.id,
							roleId,
							specialLimit,
							adminRole,
						},
					});
					revalidatePath(`/server/${params.id}/roles`);
				}}
			>
				<Label htmlFor="roleId" className="flex flex-row items-center gap-2">
					Role ID
				</Label>
				<Input type="number" id="roleId" name="roleId" required />
				<Label htmlFor="specialLimit" className="flex flex-row items-center gap-2">
					Special Limit <span className="text-xs text-muted-foreground">(Leave empty for default)</span>
				</Label>
				<Input type="number" id="specialLimit" name="specialLimit" />
				<Label htmlFor="adminRole" className="flex flex-row items-center gap-2">
					<Checkbox id="adminRole" name="adminRole" />
					Admin
				</Label>
				<input readOnly hidden name="serverId" value={params.id} />
				<SubmitButton>Save</SubmitButton>
			</form>
		</div>
	);
}
export const generateMetadata = metadata("Roles");
