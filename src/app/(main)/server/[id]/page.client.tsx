"use client";
import { updateServerSettings } from "@/actions/guild";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Prisma } from "@prisma/client";
import { toast } from "sonner";
interface Props {
	selectedServer: Prisma.serverGetPayload<{
		include: {
			serverSettings: true;
		};
	}>;
}
export function WebhookForm({ selectedServer }: Props) {
	return (
		<form
			className="flex flex-col items-start justify-center gap-4"
			action={(data) =>
				toast.promise(() => updateServerSettings(data), {
					loading: "Saving...",
					success: "Settings saved",
					error: "Failed to save settings",
				})
			}
		>
			<Label htmlFor="logs">Logs</Label>
			<Input
				id="logs"
				name="logsWebhookUrl"
				type="url"
				className="w-full"
				defaultValue={selectedServer.serverSettings?.logsWebhookUrl as string}
			/>
			<Label htmlFor="reports">Reports</Label>
			<Input
				id="reports"
				name="reportsWebhookUrl"
				type="url"
				className="w-full"
				defaultValue={selectedServer.serverSettings?.reportsWebhookUrl as string}
			/>
			<input readOnly hidden name="serverId" value={selectedServer.serverId} />
			<SubmitButton>Save</SubmitButton>
		</form>
	);
}
export function GlobalForm({ selectedServer }: Props) {
	return (
		<form
			className="flex flex-col items-start justify-center gap-4"
			action={(data) =>
				toast.promise(() => updateServerSettings(data), {
					loading: "Saving...",
					success: "Settings saved",
					error: "Failed to save settings",
				})
			}
		>
			<Label htmlFor="usage">Usage per user</Label>
			<Input
				type="number"
				name="usagePerUser"
				id="usage"
				required
				defaultValue={selectedServer.serverSettings?.usagePerUser as number}
				className="w-auto"
			/>
			<input readOnly hidden name="serverId" value={selectedServer.serverId} />
			<SubmitButton>Save</SubmitButton>
		</form>
	);
}
