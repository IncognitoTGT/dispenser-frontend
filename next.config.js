// @ts-check
/** @type {import("next").NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: discordRemotePatterns(["avatars", "icons"]),
	},
	experimental: {
		serverActions: {
		  allowedOrigins: ['*.app.github.dev', 'localhost:3000'],
		},
	  },
};

export default nextConfig;
/** @type {(pathname: string[]) => import("next/dist/shared/lib/image-config").RemotePattern[]} */
function discordRemotePatterns(pathnames) {
	return pathnames.map((pathname) => ({
		pathname: `/${pathname}/**`,
		hostname: "cdn.discordapp.com",
	}));
}
