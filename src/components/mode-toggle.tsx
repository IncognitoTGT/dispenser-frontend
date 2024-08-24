"use client";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { SwatchBook } from "lucide-react";
import { useTheme } from "next-themes";

export default function ModeToggle({ className }: Readonly<{ className?: string }>) {
	const { themes, setTheme } = useTheme();

	return (
		<DropdownMenu>
			<Tooltip>
				<TooltipTrigger asChild>
					<DropdownMenuTrigger asChild className={className}>
						<Button variant="outline" size="icon">
							<SwatchBook className="h-[1.2rem] w-[1.2rem] transition-all" />
							<span className="sr-only">Toggle theme</span>
						</Button>
					</DropdownMenuTrigger>
				</TooltipTrigger>
				<TooltipContent>Themes</TooltipContent>
			</Tooltip>

			<DropdownMenuContent align="end">
				<DropdownMenuLabel>Themes</DropdownMenuLabel>
				{themes.map((theme) => (
					<DropdownMenuItem key={theme} onClick={() => setTheme(theme)}>
						{theme
							.split("-")
							.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
							.join(" ")}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
