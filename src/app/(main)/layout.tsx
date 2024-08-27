import Navigation from "@/components/navigation";
import { auth } from "@/lib/auth";
import { serversList } from "@/lib/cached";
import type { Session } from "next-auth";

export default async function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
	const session = (await auth()) as Session;
	return (
		<>
			<Navigation servers={await serversList()} session={session} />
			<main className="ml-[178px] md:ml-[219px] lg:ml-[279px] overflow-x-clip">{children}</main>
		</>
	);
}
