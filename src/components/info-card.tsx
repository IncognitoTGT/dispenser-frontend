import type { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export default function InfoCard({
	Icon,
	heading,
	description,
	subtext,
}: {
	Icon: LucideIcon;
	heading: React.ReactNode;
	description: React.ReactNode;
	subtext?: React.ReactNode;
}) {
	return (
		<Card className="w-64">
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="text-sm font-medium">{heading}</CardTitle>
				<Icon className="h-4 w-4 text-muted-foreground" />
			</CardHeader>
			<CardContent>
				<div className="text-2xl font-bold">{description}</div>
				<p className="text-xs text-muted-foreground">{subtext}</p>
			</CardContent>
		</Card>
	);
}
