// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv").config();
import { Client } from "discord.js";
import { Logger } from "drpg-logger";
import { DrpgClient } from "./lib/DrpgClient";

export const client: DrpgClient = new DrpgClient();

async function main() {
	try {
		const embedLogLevel = Number(process.env.LOG_EMBED_LEVEL ?? 40);
		const consoleLogLevel = Number(process.env.LOG_CONSOLE_LEVEL ?? 20);

		await client.login();

		Logger.setOptions({
			defaultLogChannel: process.env.LOG_CHANNEL_ID,
			includeFooterOnRespond: true,
			allowEmbedLevel: embedLogLevel,
			client: client as Client,
			allowLogLevel: consoleLogLevel,
		});
	} catch (err) {
		Logger.fatal(err);
		client.destroy();
		process.exit(1);
	}
}

main();
