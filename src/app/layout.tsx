import "./globals.css";

import { TooltipProvider } from "@/components/ui/tooltip";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Roboto } from "next/font/google";

const sans = Roboto({
	style: "normal",
	weight: "400",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Dispenser Dashboard",
	description: "Nebula Link dispenser dashboard",
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
					<TooltipProvider>{children}</TooltipProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
