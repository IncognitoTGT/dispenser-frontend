"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function notFound() {
	const router = useRouter();
	return (
		<div className="flex h-screen w-full justify-center items-center flex-col gap-4">
			<h1 className="text-destructive font-bold text-4xl">404</h1>
			<h2>Page not found</h2>
			<Button type="button" role="link" onClick={router.back}>
				<ChevronLeft className="mr-2" />
				Go back
			</Button>
		</div>
	);
}
