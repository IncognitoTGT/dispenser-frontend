import { LoaderCircle } from "lucide-react";

export default function Loading() {
	return (
		<div className="flex justify-center flex-col items-center h-screen">
			<LoaderCircle size={64} className="animate-spin" />
		</div>
	);
}
