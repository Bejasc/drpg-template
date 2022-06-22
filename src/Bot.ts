// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv").config();
import { Logger } from "@drpgdev/drpg-logger";
import { Client } from "discord.js";
import { DrpgClient } from "./lib/DrpgClient";

export const client: DrpgClient = new DrpgClient();

async function main() {
	try {
		const embedLogLevel = Number(process.env.LOG_LEVEL_EMBED ?? 40);
		const consoleLogLevel = Number(process.env.LOG_LEVEL_CONSOLE ?? 20);

		await client.login();

		Logger.setOptions({
			defaultLogChannel: process.env.LOG_CHANNEL_ID,
			includeFooterOnRespond: false,
			allowEmbedLevel: embedLogLevel,
			client: client as Client,
			allowLogLevel: consoleLogLevel,
		});

		//Any startup stuff goes here
	} catch (err) {
		Logger.fatal(err);
		client.destroy();
		process.exit(1);
	}
}

main();
