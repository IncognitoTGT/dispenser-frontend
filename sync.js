// @ts-check
import { writeFile } from "node:fs/promises";
import { join } from "node:path";
console.log("Adding database files");
const BASE_URL = "https://raw.githubusercontent.com/NebulaServices/Dispenser/main";
const warnText =
	"// WARNING: This file is generated automatically from NebulaServices/Dispenser. Do not modify this file manually.\n\n";
const schema = await (await fetch(`${BASE_URL}/prisma/schema.prisma`)).text();
await writeFile(join(import.meta.dirname, "src/lib/db/schema.prisma"), warnText + schema);
