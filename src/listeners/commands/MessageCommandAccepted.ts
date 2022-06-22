import { Logger } from "@drpgdev/drpg-logger";
import { DrpgColors } from "@drpgdev/drpg-utils";
import { Events, Listener, ListenerOptions, MessageCommandAcceptedPayload, PieceContext } from "@sapphire/framework";
import { yellow } from "colorette";

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
				logTag: `${yellow("%T")}`,
				priority: 100,
				emoji: "🎮",
			},
			`${message.member} used \`${fullCommand}\` in ${message.channel}`,
			command.name,
		);
	}
}
