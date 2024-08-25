"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
export function NavLink({ className, href, ...props }: React.ComponentProps<typeof Link>) {
	const pathname = usePathname();
	return (
		<Link
			href={href}
			className={cn(
				"flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
				pathname === href ? "bg-secondary text-primary" : undefined,
				className,
			)}
			{...props}
		/>
	);
}
