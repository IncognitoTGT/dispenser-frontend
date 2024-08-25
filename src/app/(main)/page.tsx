import InfoCard from "@/components/info-card";
import { SubmitButton } from "@/components/submit-button";
import { buttonVariants } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { domainsList, serversList, usersList } from "@/lib/cached";
import { prisma } from "@/lib/db";
import { LinkIcon, PlusCircle, ServerIcon, User } from "lucide-react";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export default async function Home() {
	const servers = await serversList();
	const users = await usersList();
	const domains = await domainsList();
	const bannedUsers = users.filter((u) => u.banned);
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

				<InfoCard heading="Domains" Icon={LinkIcon} description={domains.length} subtext="&nbsp;" />
			</section>
		</div>
	) : (
		<div className="flex justify-center items-center h-screen gap-4 flex-col">
			<h1 className="text-xl font-bold">No servers found</h1>
			<h2 className="text-md font-semibold text-muted-foreground">Add a server to get started</h2>
			<Dialog>
				<DialogTrigger className={buttonVariants()}>
					<PlusCircle className="size-4 mr-2" /> Add server
				</DialogTrigger>
				<DialogContent className="flex flex-col">
					<DialogHeader>
						<DialogTitle>Add a server</DialogTitle>
						<DialogDescription>Make sure the bot is already invited to the server before continuing</DialogDescription>
					</DialogHeader>
					<form
						className="flex flex-col gap-2 w-full"
						action={async (data) => {
							"use server";
							const id = data.get("server_id")?.toString() as string;
							if (servers.some((server) => server.serverId === id)) redirect(`/server/${id}`);
							await prisma.server.create({
								data: {
									serverId: id,
								},
							});
							redirect(`/server/${id}`);
						}}
					>
						<Input placeholder="Server ID" name="server_id" type="number" required />
						<SubmitButton>Add server</SubmitButton>
					</form>
				</DialogContent>
			</Dialog>
		</div>
	);
}
