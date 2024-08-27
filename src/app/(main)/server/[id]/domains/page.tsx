import { DataTable } from "@/components/data-table/table";
import { domainsList, rolesList } from "@/lib/cached";
import { LinkIcon, Plus } from "lucide-react";
import { notFound } from "next/navigation";
import { columns } from "./columns";

export default async function Page({ params }: { params: { id: string } }) {
	const dbData = await domainsList({
		where: {
			serverId: params.id,
		},
		include: {
			domainGroup: true,
		},
	});
	const roles = await rolesList({
		where: { serverId: params.id },
	});
	if (roles.length <= 0) return notFound();
	const data = dbData.map((d) => {
		const role = roles.find((role) => role.roleId === d.domainGroup.requiredRoleId);
		return { ...d, role };
	});
	return (
		<div className="flex p-8 gap-4 flex-col">
			<h1 className="text-2xl font-bold">Domains</h1>
			<div className="flex flex-row gap-2 text-xl text-primary items-center">
				<LinkIcon /> Manage
			</div>
			<hr />
			<DataTable columns={columns} data={data} filterColumn="domainName" filterInputPlaceholder="Search for a domain" />
			<div className="flex flex-row gap-2 text-xl text-primary items-center">
				<Plus /> Add new
			</div>
			<hr />
		</div>
	);
}
