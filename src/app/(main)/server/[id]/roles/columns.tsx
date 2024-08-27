"use client";

import { updateRoleSettings } from "@/actions/role";
import { DataTableColumnHeader } from "@/components/data-table/col-header";
import { selectCell } from "@/components/data-table/select-cell";
import { SubmitButton } from "@/components/submit-button";
import { buttonVariants } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { role as Role } from "@prisma/client";
import { DialogTrigger } from "@radix-ui/react-dialog";
import type { ColumnDef } from "@tanstack/react-table";
import type { APIRole } from "discord-api-types/v10";
import { MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
type Column = ColumnDef<Role & APIRole>;
export const columns: Column[] = [
	selectCell as Column,
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
		cell: ({ cell }) => <span>{(cell.getValue() as Date).toLocaleString()}</span>,
	},
	{
		accessorKey: "updatedAt",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Updated At" />,
		cell: ({ cell }) => <span>{(cell.getValue() as Date).toLocaleString()}</span>,
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
						<Label htmlFor="specialLimit" className="flex flex-row items-center gap-2">
							Special Limit <span className="text-xs text-muted-foreground">(Leave empty for default)</span>
						</Label>
						<Input
							type="number"
							id="specialLimit"
							name="specialLimit"
							defaultValue={row.original.specialLimit || undefined}
						/>
						<Label htmlFor="adminRole" className="flex flex-row items-center gap-2">
							<Checkbox id="adminRole" name="adminRole" defaultChecked={Boolean(row.original.adminRole)} />
							Admin
						</Label>
						<input readOnly hidden name="roleId" value={row.original.roleId} />
						<input readOnly hidden name="serverId" value={row.original.serverId} />

						<SubmitButton>Save</SubmitButton>
					</form>
				</DialogContent>
			</Dialog>
		),
	},
];
