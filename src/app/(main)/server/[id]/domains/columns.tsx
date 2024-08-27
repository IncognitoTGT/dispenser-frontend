"use client";
import { DataTableColumnHeader } from "@/components/data-table/col-header";
import { selectCell } from "@/components/data-table/select-cell";
import { ClientDate } from "@/components/date";
import type { Prisma } from "@prisma/client";
import type { ColumnDef } from "@tanstack/react-table";
import type { APIRole } from "discord-api-types/v10";
type Column = ColumnDef<
	Prisma.domainGetPayload<{
		include: {
			domainGroup: true;
		};
	}> & {
		role?: APIRole;
	}
>;
export const columns: Column[] = [
	selectCell as Column,
	{
		accessorKey: "domainName",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Domain" />,
	},
	{
		id: "role",
		accessorFn: ({ role }) => role?.name || "Default",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Required Role" />,
	},
	{
		accessorKey: "domainGroup.groupId",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Group" />,
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
];
