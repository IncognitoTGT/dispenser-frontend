"use client";

import { deleteRole, updateRoleSettings } from "@/actions/role";
import { DataTableColumnHeader } from "@/components/data-table/col-header";
import { ClientDate } from "@/components/date";
import { SubmitButton } from "@/components/submit-button";
import { Button, buttonVariants } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { role as Role } from "@prisma/client";
import type { ColumnDef } from "@tanstack/react-table";
import type { APIRole } from "discord-api-types/v10";
import { MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
type Column = ColumnDef<Role & APIRole>;
export const columns: Column[] = [
	{
		accessorKey: "roleId",
		header: "ID",
	},
	{
		accessorKey: "name",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
	},
	{
		accessorKey: "adminRole",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Admin" />,
		cell: ({ cell }) => <span>{cell.getValue() ? "Yes" : "No"}</span>,
	},
	{
		accessorKey: "specialLimit",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Special Limit" />,
		cell: ({ cell }) => <span>{(cell.getValue() as number) || "Default"}</span>,
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
		cell: ({ row }) => (
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
						<DialogTitle>Edit role {row.original.name}</DialogTitle>
					</DialogHeader>
					<form
						className="flex flex-col gap-2 w-full"
						action={(data) =>
							toast.promise(() => updateRoleSettings(data), {
								loading: "Saving...",
								success: "Role settings updated",
								error: "Failed to update role settings",
							})
						}
					>
						<Label htmlFor="specialLimite" className="flex flex-row items-center gap-2">
							Special Limit <span className="text-xs text-muted-foreground">(Leave empty for default)</span>
						</Label>
						<Input
							type="number"
							id="specialLimite"
							name="specialLimit"
							defaultValue={row.original.specialLimit || undefined}
						/>
						<Label htmlFor="adminRole" className="flex flex-row items-center gap-2">
							<Checkbox id="adminRole" name="adminRole" defaultChecked={Boolean(row.original.adminRole)} />
							Admin <span className="text-muted-foreground text-xs">(bot restart required)</span>
						</Label>
						<input readOnly hidden name="roleId" value={row.original.roleId} />
						<input readOnly hidden name="serverId" value={row.original.serverId} />
						<div className="w-full flex flex-row gap-2">
							<SubmitButton className="w-full">Save</SubmitButton>
							<Button
								variant="destructive"
								className="w-full"
								onClick={(e) => {
									e.preventDefault();
									e.stopPropagation();
									toast.promise(() => deleteRole(row.original.roleId), {
										loading: "Deleting...",
										success: "Role deleted",
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
		),
	},
];
