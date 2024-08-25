"use client";
import { updateServerSettings } from "@/actions/guild";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Prisma } from "@prisma/client";
import { toast } from "sonner";

export function UpdateForm({
	selectedServer,
}: {
	selectedServer: Prisma.serverGetPayload<{
		include: {
			serverSettings: true;
		};
	}>;
}) {
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
			<Label htmlFor="logs">Logs webhook URL</Label>
			<Input
				id="logs"
				name="logs"
				type="url"
				className="w-full"
				defaultValue={selectedServer.serverSettings?.logsWebhookUrl as string}
			/>
			<Label htmlFor="reports">Reports webhook URL</Label>
			<Input
				id="reports"
				name="reports"
				type="url"
				className="w-full"
				defaultValue={selectedServer.serverSettings?.reportsWebhookUrl as string}
			/>
			<input readOnly hidden name="serverId" value={selectedServer.serverId} />
			<SubmitButton>Save</SubmitButton>
		</form>
	);
}
