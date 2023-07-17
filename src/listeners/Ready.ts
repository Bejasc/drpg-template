import { Events, Listener, ListenerOptions, PieceContext } from "@sapphire/framework";
import { LogLevel, Logger } from "drpg-logger";
import { client } from "../Bot";

export class UserListener extends Listener {
	public constructor(context: PieceContext, options?: ListenerOptions) {
		super(context, {
			...options,
			event: Events.ShardReady,
			once: true,
		});
	}

	public run(): void {
		Logger.custom({ ...LogLevel.Info, priority: 25 }, `Logged in to Discord as ${client.user.tag}`, "Bot logged in");
	}
}
