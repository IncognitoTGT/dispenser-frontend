"use client";

import { massImport } from "@/actions/domain";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { useParams } from "next/navigation";
import { toast } from "sonner";
export function MassImportForm() {
	function clientSideCatch<T extends object>(res: T) {
		if ("error" in res) {
			throw res.error;
		}
		return res as T;
	}
	const params = useParams();
	return (
		<form
			className="flex flex-col items-start justify-center gap-4"
			action={(data) =>
				toast.promise(async () => clientSideCatch(await massImport(data)), {
					loading: "Importing...",
					success: "Imported successfully",
					error: (err) => err,
				})
			}
		>
			<Input type="file" name="file" required />
			<input readOnly hidden name="serverId" value={params.id} />
			<SubmitButton>Import</SubmitButton>
		</form>
	);
}
