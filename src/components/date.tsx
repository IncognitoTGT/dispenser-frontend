"use client";
import { Suspense, useEffect, useState } from "react";

export function ClientDate({ children }: { children: React.ReactNode }) {
	const [hydrated, setHydrated] = useState(false);
	useEffect(() => {
		setHydrated(true);
	}, []);
	return <Suspense key={hydrated ? "client" : "server"}>{hydrated ? children : "Loading..."}</Suspense>;
}
