import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
export const middleware = auth(async (req) => {
	if (req.auth || req.nextUrl.pathname.startsWith("/auth/login") || req.nextUrl.pathname.startsWith("/auth/error")) {
		return NextResponse.next();
	}

	const url = new URL("/auth/login", `${req.nextUrl.protocol}//${req.nextUrl.host}`);
	return NextResponse.redirect(url);
});
export const config = {
	matcher: ["/((?!_next/static|_next/image|icon.svg|api|manifest.webmanifest).*)"],
};
