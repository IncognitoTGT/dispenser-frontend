import { prisma } from "@/lib/db";
import type { NextRequest } from "next/server";

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
	const groups = await prisma.domainGroup.findMany({
		where: { serverId: params.id },
	});
	return Response.json(groups);
}
