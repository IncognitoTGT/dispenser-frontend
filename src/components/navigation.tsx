"use client";
import type { server as Server } from "@prisma/client";
import type { APIGuild } from "discord-api-types/v10";
import type { LucideIcon } from "lucide-react";
import { Badge, GlassWater, Group, LogOut, ServerIcon, Settings, SwatchBook, Users } from "lucide-react";
import type { Session } from "next-auth";
import { useTheme } from "next-themes";
import { getImageProps } from "next/image";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { buttonVariants } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuPortal,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { NavLink } from "./ui/nav-link";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

export default function Navigation({
	servers,
	session,
}: {
	servers: (Server & APIGuild)[];
	session: Session;
}) {
	const router = useRouter();
	const { theme: currentTheme, setTheme, themes } = useTheme();
	const params = useParams();
	const pathname = usePathname();
	const [selectedServer, setSelectedServer] = useState<(Server & APIGuild) | undefined>(
		servers.find((s) => s.serverId === params.id),
	);
	const [display, setDisplay] = useState(session.user?.username);

	const [selectValue, setSelectValue] = useState<React.ComponentProps<typeof Select>["value"]>(undefined);
	useEffect(() => {
		if (pathname.includes(params.id as string)) {
			setSelectValue(servers.find((s) => s.serverId === params.id)?.serverId);
			setSelectedServer(servers.find((s) => s.serverId === params.id));
		} else {
			setSelectValue(undefined);
			setSelectedServer(undefined);
		}
	}, [params, pathname, servers]);
	const navItems: {
		Icon: LucideIcon;
		label: string;
		href: string;
	}[] = [
		{
			Icon: Settings,
			label: "Settings",
			href: "",
		},
		{
			Icon: Group,
			label: "Domain Groups",
			href: "/groups",
		},
		{
			Icon: Users,
			label: "Users",
			href: "/users",
		},
		{
			Icon: Badge,
			label: "Roles",
			href: "/roles",
		},
	];
	return (
		<nav className="grid min-h-screen md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] fixed">
			<div className="border-r bg-muted/40 block">
				<div className="flex h-full max-h-screen flex-col p-4 gap-2">
					<Link className="flex flex-row gap-2 font-bold text-2xl border-b border-spacing-10 pb-2" href="/">
						<GlassWater className="size-8" />
						Dispenser
					</Link>
					{selectedServer ? (
						<>
							<Select onValueChange={(v) => router.push(`/server/${v}`)} value={selectValue}>
								<SelectTrigger aria-label="dropdown to select a server">
									<SelectValue placeholder="Select a server" />
								</SelectTrigger>
								<SelectContent>
									{servers.map((server) => (
										<SelectItem key={server.id} value={server.serverId}>
											{server.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<div className="grid items-start text-sm font-medium lg:pre-4">
								{navItems.map(({ href, Icon, label }) => (
									<NavLink key={href} href={`/server/${params.id}${href}`} className="w-full">
										<Icon className="size-5" />
										{label}
									</NavLink>
								))}
							</div>
						</>
					) : (
						<>
							<h1 className="text-lg font-medium text-primary">Servers</h1>
							{servers.length > 0 ? (
								servers.map((server) => (
									<Link
										key={server.serverId}
										href={`/server/${server.serverId}`}
										className={buttonVariants({
											className: "w-full text-left",
											variant: "outline",
										})}
									>
										<ServerIcon className="size-5 mr-2" />
										{server.name}
									</Link>
								))
							) : (
								<p className="text-secondary-foreground/50">No servers found</p>
							)}
						</>
					)}
					<div className="mt-auto">
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Card
									className="flex items-center justify-start flex-row hover:bg-background/10 duration-150 cursor-pointer w-full"
									onMouseOver={() => setDisplay(session.user?.email as string)}
									onMouseLeave={() => setDisplay(session.user?.username as string)}
								>
									<CardContent className="p-2 pt-0 md:p-4 flex flex-row justify-between">
										<Avatar>
											<AvatarImage
												{...getImageProps({
													src: session.user?.image as string,
													width: 60,
													height: 60,
													alt: "Profile picture",
												}).props}
											/>
											<AvatarFallback>{session.user?.username?.charAt(0)}</AvatarFallback>
										</Avatar>
									</CardContent>
									<CardHeader className="p-2 pt-0 md:p-4">
										<CardTitle className="text-xl">{session.user?.name || session.user?.email?.split("@")}</CardTitle>
										<CardDescription className="text-xs">{display}</CardDescription>
									</CardHeader>
								</Card>
							</DropdownMenuTrigger>
							<DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width] h-[--radix-dropdown-menu-trigger-height	]">
								<DropdownMenuSub>
									<DropdownMenuSubTrigger>
										<SwatchBook className="mr-2 size-4" />
										Theme
									</DropdownMenuSubTrigger>
									<DropdownMenuPortal>
										<DropdownMenuSubContent>
											{themes.map((theme) => (
												<DropdownMenuCheckboxItem
													key={theme}
													checked={theme === currentTheme}
													onClick={() => setTheme(theme)}
												>
													{theme
														.split("-")
														.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
														.join(" ")}
												</DropdownMenuCheckboxItem>
											))}
										</DropdownMenuSubContent>
									</DropdownMenuPortal>
								</DropdownMenuSub>
								<DropdownMenuItem asChild>
									<Link type="submit" href="/auth/logout">
										<LogOut className="mr-2 size-4" />
										Log Out
									</Link>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>
			</div>
		</nav>
	);
}
