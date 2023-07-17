import { ChatInputCommandDeniedPayload, Events, Listener, ListenerOptions, PieceContext, UserError } from "@sapphire/framework";
import { Logger } from "drpg-logger";
import { dateToEpoch } from "drpg-utils";

export class ChatInputCommandDenied extends Listener<typeof Events.ChatInputCommandDenied> {
	public constructor(context: PieceContext, options?: ListenerOptions) {
		super(context, { ...options, event: Events.ChatInputCommandDenied });
	}

	public async run(error: UserError, { interaction }: ChatInputCommandDeniedPayload) {
		const embed = Logger.warn(error.message, error.identifier ?? "Command Denied");

		if (error.identifier == "Maintenance Mode") embed.addFields({ name: "Started", value: `<t:${dateToEpoch(new Date())}>`, inline: false });
		return interaction.reply({ embeds: [embed], ephemeral: true });
	}
}
