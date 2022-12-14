import { Events, Listener, ListenerOptions, MessageCommandAcceptedPayload, PieceContext } from "@sapphire/framework";
import { ConsoleColor, Logger } from "drpg-logger";
import { DrpgColors } from "drpg-utils";

export class MessageCommandAccepted extends Listener<typeof Events.MessageCommandAccepted> {
	public constructor(context: PieceContext, options?: ListenerOptions) {
		super(context, { ...options, event: Events.MessageCommandAccepted });
	}

	public run({ message, command }: MessageCommandAcceptedPayload): void {
		const prefix = process.env.BOT_PREFIX;

		const fullCommand = `${prefix}${command.name}`;

		Logger.custom(
			{
				title: `Command Used`,
				embedColor: DrpgColors.pink,
				consoleColor: ConsoleColor.magentaBright,
				logTag: `CMD`,
				priority: 100,
				emoji: "🎮",
			},
			`${message.member} used \`${fullCommand}\` in ${message.channel}`,
			command.name,
		);
	}
}
