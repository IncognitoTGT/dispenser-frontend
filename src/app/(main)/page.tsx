import InfoCard from "@/components/info-card";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { domainsList, serversList, usersList } from "@/lib/cached";
import { prisma } from "@/lib/db";
import { LinkIcon, ServerIcon, User } from "lucide-react";
import { redirect } from "next/navigation";

export default async function Home() {
	const servers = await serversList();
	const domains = await domainsList();
	const users = await usersList({ select: { banned: true } });
	const bannedUsers = users.filter((u) => u.banned);
	const domainGroups = await prisma.domainGroup.count();
	return servers.length > 0 ? (
		<div className="flex justify-center items-center h-screen gap-2 flex-col bg-dotted-primary/20 bg-dotted-spacing-6">
			<h1 className="text-xl font-bold">Welcome</h1>
			<section className="flex justify-center items-start gap-4">
				<InfoCard
					heading="Servers"
					Icon={ServerIcon}
					description={servers.length}
					subtext={
						<>
							{servers.length > 0
								? servers
										.splice(0, 3)
										.map((server) => server.name)
										.join(", ")
										.slice(0, 20)
								: "No servers"}
							{servers.length > 3 ? `and ${servers.length - 3} more` : ""}
						</>
					}
				/>
				<InfoCard
					heading="Users"
					Icon={User}
					description={users.length}
					subtext={
						<>
							{bannedUsers.length} banned user
							{bannedUsers.length === 1 ? "" : "s"}
						</>
					}
				/>

				<InfoCard
					heading="Domains"
					Icon={LinkIcon}
					description={domains.length}
					subtext={
						<>
							{domainGroups} domain group
							{domainGroups === 1 ? "" : "s"}
						</>
					}
				/>
			</section>
		</div>
	) : (
		<div className="flex justify-center items-center h-screen gap-4 flex-col">
			<h1 className="text-xl font-bold">No servers found</h1>
			<h2 className="text-md text-muted-foreground">Add a server to get started</h2>
			<form
				className="flex flex-col gap-2"
				action={async (data) => {
					"use server";
					const id = data.get("server_id")?.toString() as string;
					await prisma.server.create({
						data: {
							serverId: id,
							createdAt: new Date(),
							updatedAt: new Date(),
						},
					});
					redirect(`/server/${id}`);
				}}
			>
				<Input placeholder="Server ID" name="server_id" type="number" required />
				<SubmitButton>Add server</SubmitButton>
			</form>
		</div>
	);
}
