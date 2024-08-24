import { handlers } from "@/lib/auth";
import { NextRequest } from "next/server";

const reqWithTrustedOrigin = (req: NextRequest): NextRequest => {
	const proto = req.headers.get("x-forwarded-proto");
	const host = req.headers.get("x-forwarded-host");
	if (!proto || !host) {
		console.warn("Missing x-forwarded-proto or x-forwarded-host headers.");
		return req;
	}
	const envOrigin = `${proto}://${host}`;
	const { href, origin } = req.nextUrl;
	return new NextRequest(href.replace(origin, envOrigin), req);
};

export const GET = (req: NextRequest) => handlers.GET(reqWithTrustedOrigin(req));

export const POST = (req: NextRequest) => handlers.POST(reqWithTrustedOrigin(req));
