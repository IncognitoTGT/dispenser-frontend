import { Discord } from "@/components/icons";
import { SubmitButton } from "@/components/submit-button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CardContent, CardDescription } from "@/components/ui/card";
import { auth, signIn } from "@/lib/auth";
import { AlertCircle, Info } from "lucide-react";
import { redirect } from "next/navigation";

export default async function Login({
	searchParams,
}: {
	searchParams: { [key: string]: string | string[] | undefined };
}) {
	const session = await auth();
	if (session) redirect("/");
	const { error, message } = searchParams;
	return (
		<CardContent className="m-1 w-full flex-col flex justify-center items-center">
			<CardDescription>Welcome</CardDescription>
			{error ? (
				<Alert variant="destructive" className="w-full text-destructive my-4">
					<AlertCircle className="h-4 w-4" />
					<AlertTitle>Error logging in:</AlertTitle>
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			) : null}
			{message ? (
				<Alert className="w-full my-4">
					<Info className="h-4 w-4" />
					<AlertTitle>{message}</AlertTitle>
				</Alert>
			) : null}
			<div className="mx-auto mt-4 flex w-full flex-row items-center justify-center gap-2 flex-wrap">
				<form
					action={async () => {
						"use server";
						await signIn("discord");
					}}
				>
					<SubmitButton variant="default" size="lg" className="font-bold">
						<Discord className="size-4 mr-2 flex-shrink-0" />
						Login with Discord
					</SubmitButton>
				</form>
			</div>
		</CardContent>
	);
}
