// @ts-check
import { writeFile } from "node:fs/promises";
import { join } from "node:path";

console.log("Adding database files");
const BASE_URL = "https://raw.githubusercontent.com/NebulaServices/Dispenser/main";

const schema = await (await fetch(`${BASE_URL}/prisma/schema.prisma`)).text();
const util = await (await fetch(`${BASE_URL}/src/classes/DB.ts`)).text();
await writeFile(join(import.meta.dirname, "src/lib/db/schema.prisma"), schema);
await writeFile(join(import.meta.dirname, "src/lib/db/index.ts"), util);
console.log("complete");
