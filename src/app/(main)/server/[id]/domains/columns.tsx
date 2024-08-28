"use client";
import { deleteDomain, updateDomainSettings } from "@/actions/domain";
import { DataTableColumnHeader } from "@/components/data-table/col-header";
import { ClientDate } from "@/components/date";
import { SubmitButton } from "@/components/submit-button";
import { Button, buttonVariants } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { domainGroup as DomainGroup, Prisma } from "@prisma/client";
import type { ColumnDef } from "@tanstack/react-table";
import type { APIUser } from "discord-api-types/v10";
import { MoreHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
type Column = ColumnDef<
	Prisma.domainGetPayload<{
		include: {
			domainGroup: true;
		};
	}> & {
		creator?: APIUser;
		updater?: APIUser;
	}
>;
const buttonStyle = buttonVariants({
	variant: "link",
	size: "sm",
	className: "!p-0",
});
export const columns: Column[] = [
	{
		accessorKey: "domainName",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Domain" />,
		cell: ({ cell }) => (
			<a href={`https://${cell.getValue()}`} target="_blank" rel="noreferrer noopener" className={buttonStyle}>
				{cell.getValue() as string}
			</a>
		),
	},
	{
		accessorKey: "domainGroup.groupId",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Group" />,
	},
	{
		id: "creator",
		accessorFn: ({ creator }) => creator?.global_name || creator?.username,
		header: ({ column }) => <DataTableColumnHeader column={column} title="Created By" />,
		cell: ({ cell, row }) => (
			<a
				href={`https://discord.com/users/${row.original.creator?.id}`}
				target="_blank"
				rel="noreferrer noopener"
				className={buttonStyle}
			>
				{cell.getValue() as string}
			</a>
		),
	},
	{
		accessorKey: "createdAt",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Created At" />,
		cell: ({ cell }) => (
			<ClientDate>
				<span>{(cell.getValue() as Date).toLocaleString()}</span>
			</ClientDate>
		),
	},
	{
		id: "updater",
		accessorFn: ({ updater }) => updater?.global_name || updater?.username,
		header: ({ column }) => <DataTableColumnHeader column={column} title="Updated By" />,
		cell: ({ cell, row }) => (
			<a
				href={`https://discord.com/users/${row.original.updater?.id}`}
				target="_blank"
				rel="noreferrer noopener"
				className={buttonStyle}
			>
				{cell.getValue() as string}
			</a>
		),
	},
	{
		accessorKey: "updatedAt",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Updated At" />,
		cell: ({ cell }) => (
			<ClientDate>
				<span>{(cell.getValue() as Date).toLocaleString()}</span>
			</ClientDate>
		),
	},
	{
		id: "actions",
		cell: ({ row }) => {
			const [groups, setGroups] = useState<DomainGroup[]>([]);
			useEffect(() => {
				(async () => {
					const groups = await (
						await fetch(`/api/server/${row.original.serverId}/groups`, {
							next: { revalidate: 60 },
						})
					).json();
					setGroups(groups);
				})();
			}, [row]);
			return (
				<Dialog>
					<DialogTrigger
						className={buttonVariants({
							variant: "ghost",
							size: "icon",
							className: "p-0",
						})}
					>
						<MoreHorizontal className="size-4" />
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Edit {row.original.domainName}</DialogTitle>
						</DialogHeader>
						<form
							className="flex flex-col gap-2 w-full"
							action={(data) =>
								toast.promise(() => updateDomainSettings(data), {
									loading: "Saving...",
									success: "Domain settings updated",
									error: "Failed to update domain settings",
								})
							}
						>
							<Label htmlFor="domainGroupe">Domain Group</Label>
							<Select name="domainGroupId" defaultValue={row.original.domainGroupId}>
								<SelectTrigger id="domainGroupe">
									<SelectValue placeholder="Select a domain group" />
								</SelectTrigger>
								<SelectContent>
									{groups.map((group) => (
										<SelectItem key={group.groupId} value={group.groupId}>
											{group.groupId}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<input readOnly hidden name="id" value={row.original.id} />
							<input readOnly hidden name="serverId" value={row.original.serverId} />
							<div className="w-full flex flex-row gap-2">
								<SubmitButton className="w-full">Save</SubmitButton>
								<Button
									variant="destructive"
									className="w-full"
									onClick={(e) => {
										e.preventDefault();
										e.stopPropagation();
										toast.promise(() => deleteDomain(row.original.domainName), {
											loading: "Deleting...",
											success: "Domain deleted",
											error: "Failed to delete role",
										});
									}}
								>
									Delete
								</Button>
							</div>
						</form>
					</DialogContent>
				</Dialog>
			);
		},
	},
];
