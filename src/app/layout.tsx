import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

import { TooltipProvider } from "@/components/ui/tooltip";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Roboto_Flex } from "next/font/google";

const sans = Roboto_Flex({
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: {
		default: "Dispenser",
		template: "Dispenser > %s",
	},
	description: "Dashboard for Nebula's link dispenser",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={sans.className}>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					themes={[
						"light",
						"dark",
						"catppuccin-mocha",
						"catppuccin-macchiato",
						"catppuccin-frappe",
						"catppuccin-latte",
					]}
					enableSystem
					disableTransitionOnChange
				>
					<Toaster richColors theme="system" position="top-center" />
					<TooltipProvider>{children}</TooltipProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
