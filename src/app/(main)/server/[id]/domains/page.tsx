import { DataTable } from "@/components/data-table/table";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { auth } from "@/lib/auth";
import { domainGroupList, domainsList } from "@/lib/cached";
import { prisma } from "@/lib/db";
import discordRest from "@/lib/discord";
import { type APIUser, Routes } from "discord-api-types/v10";
import { FileJson, LinkIcon, Plus } from "lucide-react";
import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";
import { columns } from "./columns";
import { MassImportForm } from "./page.client";

export default async function Page({ params }: { params: { id: string } }) {
	const domainGroups = await domainGroupList();
	const dbData = await domainsList({
		where: {
			serverId: params.id,
		},
		include: {
			domainGroup: true,
		},
	});
	if (!dbData) notFound();
	const dedupUsers = await Promise.all(
		Array.from(new Set([...dbData.map((db) => db.createdBy), ...dbData.map((db) => db.updatedBy)])).map(
			async (id) => (await discordRest.get(Routes.user(id || "@me"))) as APIUser,
		),
	);
	const data = await Promise.all(
		dbData.map(async (db) => {
			return {
				...db,
				creator: dedupUsers.find((user) => user.id === db.createdBy),
				updater: dedupUsers.find((user) => user.id === db.updatedBy),
			};
		}),
	);
	return (
		<div className="flex p-8 gap-4 flex-col">
			<h1 className="text-2xl font-bold">Domains</h1>
			<div className="flex flex-row gap-2 text-xl text-primary items-center">
				<LinkIcon /> Manage
			</div>
			<hr className="-mb-4" />
			<DataTable columns={columns} data={data} filterColumn="domainName" filterInputPlaceholder="Search for a domain" />
			<div className="flex flex-row gap-2 text-xl text-primary items-center">
				<Plus /> Add new
			</div>
			<hr />
			<form
				className="flex flex-col items-start justify-center gap-4"
				action={async (data) => {
					"use server";
					const session = await auth();
					const domainName = data.get("domainName")?.toString() as string;
					const domainGroupId = data.get("domainGroupId")?.toString() as string;
					await prisma.domain.create({
						data: {
							domainName,
							serverId: params.id,
							createdBy: session?.user.id,
							createdAt: new Date(),
							domainGroup: {
								connect: {
									groupId: domainGroupId,
								},
							},
						},
					});
					revalidatePath(`/server/${params.id}/domains`);
				}}
			>
				<Label htmlFor="domainName">Domain Name</Label>
				<Input id="domainName" name="domainName" placeholder="example.com" required />
				<Label htmlFor="domainGroup">Domain Group</Label>
				<Select name="domainGroupId">
					<SelectTrigger id="domainGroup">
						<SelectValue placeholder="Select a domain group" />
					</SelectTrigger>
					<SelectContent>
						{domainGroups.map((group) => (
							<SelectItem key={group.groupId} value={group.groupId}>
								{group.groupId}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				<SubmitButton>Create Domain</SubmitButton>
			</form>
			<div className="flex flex-row gap-2 text-xl text-primary items-center">
				<FileJson /> Import
			</div>
			<hr />
			<MassImportForm />
		</div>
	);
}
