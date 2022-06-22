import { SapphireClient } from "@sapphire/framework";
import { ClientOptions } from "discord.js";

export const DEV_MODE = process.env.NODE_ENV !== "production";
export const CLIENT_VERSION = process.env.npm_package_version!;
export class DrpgClient extends SapphireClient {
	public readonly version = CLIENT_VERSION;

	public constructor() {
		super(CLIENT_OPTIONS);
	}

	public async login(token?: string): Promise<string> {
		const login = await super.login(token);
		return login;
	}
}

const CLIENT_OPTIONS: ClientOptions = {
	caseInsensitiveCommands: true,
	caseInsensitivePrefixes: true,
	loadMessageCommandListeners: true,
	defaultPrefix: process.env.BOT_PREFIX,
	intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_MEMBERS", "GUILD_EMOJIS_AND_STICKERS", "GUILD_MESSAGE_REACTIONS", "GUILD_PRESENCES"],
	partials: ["MESSAGE", "REACTION", "CHANNEL", "GUILD_MEMBER", "USER"],
	shards: "auto",
	typing: true,
};
