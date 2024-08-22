import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";

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
		<html lang="en">
			<body className={sans.className}>{children}</body>
		</html>
	);
}
