import { Events, Listener, ListenerOptions } from "@sapphire/framework";
import { LogLevel, Logger } from "drpg-logger";
import { client } from "../Bot";

export class UserListener extends Listener {
	public constructor(context: Listener.LoaderContext, options?: ListenerOptions) {
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
