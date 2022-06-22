import { Logger, LogLevel } from "@drpgdev/drpg-logger";
import { DrpgColors } from "@drpgdev/drpg-utils";
import { Events, Listener, ListenerOptions, PieceContext } from "@sapphire/framework";
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
		Logger.custom({ ...LogLevel.Info, embedColor: DrpgColors.green, priority: 25, emoji: "✅" }, `Logged in to Discord as ${client.user}`, "Bot Logged In");
	}
}
