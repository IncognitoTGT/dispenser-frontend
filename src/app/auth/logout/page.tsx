import { SubmitButton } from "@/components/submit-button";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { signOut } from "@/lib/auth";
import { ChevronLeft, LogOut } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default function SignOut() {
	return (
		<CardContent>
			<p className="text-center">Are you sure you want to log out?</p>
			<form
				action={async () => {
					"use server";
					await signOut({ redirect: false });
					redirect("/auth/login");
				}}
			>
				<SubmitButton className="mt-6 w-full">
					<LogOut className="mr-2 size-4" />
					Log out
				</SubmitButton>
			</form>
			<Button asChild variant="outline" className="mt-4 w-full transition-all duration-200">
				<Link href="/">
					<ChevronLeft className="mr-2 size-4" />
					Go Home
				</Link>
			</Button>
		</CardContent>
	);
}
