import { REST } from "@discordjs/rest";
const discordRest = new REST({ version: "10" }).setToken(process.env.TOKEN as string);
export default discordRest;
