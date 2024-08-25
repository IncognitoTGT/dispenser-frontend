import InfoCard from "@/components/info-card";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { serversList } from "@/lib/cached";
import { prisma } from "@/lib/db";
import type { serverSettings as ServerSettings } from "@prisma/client";
import { Info, Logs, Pencil, PlusIcon, ScrollText, UserSearch, Webhook } from "lucide-react";
import { revalidatePath } from "next/cache";
import { metadata } from "../metadata";
import { UpdateForm } from "./page.client";
export default async function Page({ params }: { params: { id: string } }) {
	const [selectedServer] = await serversList<
		{
			serverSettings: ServerSettings;
		}[]
	>({
		include: { serverSettings: true },
		where: { serverId: params.id },
	});
	return (
		<div className="flex p-8 gap-4 flex-col">
			<h1 className="text-2xl font-bold">Settings</h1>
			<div className="flex flex-row gap-2 text-xl text-primary items-center">
				<Info /> Info
			</div>
			<hr />
			<section className="flex flex-row gap-2 flex-wrap">
				{selectedServer.serverSettings?.createdAt ? (
					<InfoCard
						Icon={PlusIcon}
						heading="Created At"
						description={selectedServer.serverSettings.createdAt.toLocaleDateString()}
						subtext={selectedServer.serverSettings.createdAt.toLocaleTimeString()}
					/>
				) : null}
				{selectedServer.serverSettings?.updatedAt ? (
					<InfoCard
						Icon={Pencil}
						heading="Updated At"
						description={selectedServer.serverSettings.updatedAt.toLocaleDateString()}
						subtext={selectedServer.serverSettings.updatedAt.toLocaleTimeString()}
					/>
				) : null}

				<InfoCard
					Icon={UserSearch}
					heading="Dispense limit per user"
					description={selectedServer.serverSettings?.usagePerUser}
					subtext="Amount of links a user can dispense"
				/>
				<InfoCard
					Icon={Logs}
					heading="Logs"
					description={selectedServer.serverSettings?.logsEnabled ? "Enabled" : "Disabled"}
				/>
				<InfoCard
					Icon={ScrollText}
					heading="Reports"
					description={selectedServer.serverSettings?.reportsEnabled ? "Enabled" : "Disabled"}
					subtext="&nbsp;"
				/>
			</section>
			<div className="flex flex-row gap-2 text-xl text-primary items-center">
				<Webhook /> Webhooks
			</div>
			<hr />
			<UpdateForm selectedServer={selectedServer} />
		</div>
	);
}
export const generateMetadata = metadata();
