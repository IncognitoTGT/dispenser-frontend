// @ts-check
import { writeFile } from "node:fs/promises";
import { join } from "node:path";

console.log("Adding database files");
const ts = String.raw;
const BASE_URL = "https://raw.githubusercontent.com/NebulaServices/Dispenser/main";
const warnText =
	"// WARNING: This file is generated automatically from NebulaServices/Dispenser. Do not modify this file manually.\n\n";
/** @type {(v: string) => string} */
const prismaPrepend = (v) =>
	v.replace(
		ts`const prisma = new PrismaClient()`,
		ts`
const prismaClientSingleton = () => new PrismaClient()
declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;
export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()
if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma
`,
	);
const schema = await (await fetch(`${BASE_URL}/prisma/schema.prisma`)).text();
const util = await (await fetch(`${BASE_URL}/src/classes/DB.ts`)).text();
await writeFile(join(import.meta.dirname, "src/lib/db/schema.prisma"), warnText + schema);
await writeFile(join(import.meta.dirname, "src/lib/db/index.ts"), warnText + prismaPrepend(util));
