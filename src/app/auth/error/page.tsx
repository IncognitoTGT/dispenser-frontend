import { buttonVariants } from "@/components/ui/button";
import { CardContent, CardHeader } from "@/components/ui/card";
import { ChevronLeft, ShieldX } from "lucide-react";
import Link from "next/link";

export default function AuthError({
	searchParams,
}: {
	searchParams: { [key: string]: string | string[] | undefined };
}) {
	const { error } = searchParams;
	return (
		<>
			<CardHeader className="mx-auto mb-2 flex flex-col items-center justify-center">
				<ShieldX className="mb-10 h-12 w-12" />
				There was an error logging in:
			</CardHeader>
			<CardContent className="flex flex-col gap-4 justify-center items-center">
				{error ? <code className="font-bold text-destructive">{error}</code> : null}
				<p className="text-center">Please try again. If the problem persists, please contact support.</p>
				<Link href="/auth/login" className={buttonVariants()}>
					<ChevronLeft className="mr-2 size-4" />
					Back to login
				</Link>
			</CardContent>
		</>
	);
}
