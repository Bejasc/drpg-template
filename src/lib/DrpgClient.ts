import { SapphireClient } from "@sapphire/framework";
import { ClientOptions, GatewayIntentBits, Guild, Partials } from "discord.js";
import { client } from "../Bot";

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

	public get guild(): Guild {
		return client.guilds.cache.first();
	}
}

const CLIENT_OPTIONS: ClientOptions = {
	caseInsensitiveCommands: true,
	caseInsensitivePrefixes: true,
	loadMessageCommandListeners: true,
	defaultPrefix: "^",
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildEmojisAndStickers,
		GatewayIntentBits.GuildMessageReactions,
		GatewayIntentBits.GuildPresences,
		GatewayIntentBits.MessageContent,
	],
	partials: [Partials.User, Partials.GuildMember, Partials.Channel, Partials.Reaction, Partials.Message],
	shards: "auto",
	typing: true,
};
