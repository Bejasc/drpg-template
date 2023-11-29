import { Events, Listener, ListenerOptions, MessageCommandDeniedPayload, UserError } from "@sapphire/framework";
import { Logger } from "drpg-logger";
import { dateToEpoch } from "drpg-utils";

export class MessageCommandDenied extends Listener<typeof Events.MessageCommandDenied> {
	public constructor(context: Listener.LoaderContext, options?: ListenerOptions) {
		super(context, { ...options, event: Events.MessageCommandDenied });
	}

	public async run(error: UserError, { message }: MessageCommandDeniedPayload) {
		const embed = Logger.warn(error.message, error.identifier ?? "Command Denied");
		if (error.identifier == "Maintenance Mode") embed.addFields({ name: "Started", value: `<t:${dateToEpoch(new Date())}>`, inline: false });
		return message.reply({ embeds: [embed] });
	}
}
