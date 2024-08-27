import InfoCard from "@/components/info-card";
import { serversList } from "@/lib/cached";
import type { serverSettings as ServerSettings } from "@prisma/client";
import { Globe, Info, Logs, Pencil, PlusIcon, ScrollText, UserSearch, Webhook } from "lucide-react";
import { notFound } from "next/navigation";
import { metadata } from "../metadata";
import { GlobalForm, WebhookForm } from "./page.client";
export default async function Page({ params }: { params: { id: string } }) {
	const [selectedServer] =
		(await serversList<
			{
				serverSettings: ServerSettings;
			}[]
		>({
			include: { serverSettings: true },
			where: { serverId: params.id },
		})) || [];
	if (!selectedServer) notFound();
	return (
		<div className="flex p-8 gap-4 flex-col">
			<h1 className="text-2xl font-bold">Settings</h1>
			<div className="flex flex-row gap-2 text-xl text-primary items-center">
				<Info /> Info
			</div>
			<hr />
			<section className="flex flex-row gap-2 flex-wrap">
				<InfoCard
					Icon={PlusIcon}
					heading="Created At"
					description={selectedServer.serverSettings.createdAt.toLocaleDateString()}
					subtext={selectedServer.serverSettings.createdAt.toLocaleTimeString()}
				/>
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
					description={selectedServer.serverSettings?.logsWebhookUrl ? "Enabled" : "Disabled"}
					subtext="Dispensed links, errors, etc."
				/>
				<InfoCard
					Icon={ScrollText}
					heading="Reports"
					description={selectedServer.serverSettings?.reportsWebhookUrl ? "Enabled" : "Disabled"}
					subtext="Blocked link reports"
				/>
			</section>
			<div className="flex flex-row gap-2 text-xl text-primary items-center">
				<Webhook /> Webhooks{" "}
				<span className="text-sm text-muted-foreground">(bot restart needed for changes to take effect)</span>
			</div>
			<hr />
			<WebhookForm selectedServer={selectedServer} />
			<div className="flex flex-row gap-2 text-xl text-primary items-center">
				<Globe /> Global
			</div>
			<hr />
			<GlobalForm selectedServer={selectedServer} />
		</div>
	);
}
export const generateMetadata = metadata();
