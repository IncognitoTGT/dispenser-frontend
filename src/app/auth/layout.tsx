import ModeToggle from "@/components/mode-toggle";
import { Card, CardTitle } from "@/components/ui/card";
import { GlassWater } from "lucide-react";

export default function LoginLayout({ children }: Readonly<{ children: React.ReactNode }>) {
	return (
		<main className="w-screen h-screen bg-dotted-primary/20 bg-dotted-spacing-6">
			<section className="flex min-h-screen items-center left-6 fixed">
				<Card className="mx-auto flex h-[95vh] w-96 flex-col items-center justify-center py-12">
					<CardTitle className="mb-4 flex items-center justify-center text-left text-2xl font-bold">
						<GlassWater />
						<span className="ml-2 text-2xl font-bold">Dispenser</span>
					</CardTitle>
					{children}
				</Card>
				<ModeToggle className="fixed bottom-2 right-2" />
			</section>
		</main>
	);
}
