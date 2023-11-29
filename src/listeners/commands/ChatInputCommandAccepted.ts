import { ChatInputCommandAcceptedPayload, Events, Listener, ListenerOptions } from "@sapphire/framework";
import { DrpgCommandRequest } from "../../lib/structures/DrpgCommandRequest";
import { logCommandUsed } from "../../lib/LogCommandUsed";

export class ChatInputCommandAccepted extends Listener<typeof Events.ChatInputCommandAccepted> {
	public constructor(context: Listener.LoaderContext, options?: ListenerOptions) {
		super(context, { ...options, event: Events.ChatInputCommandAccepted });
	}

	public run({ interaction, command }: ChatInputCommandAcceptedPayload): void {
		//const subcommand = interaction.options.getSubcommand(true);
		//const subCmd: DrpgCommand = this.container.stores.get("commands").get(subcommand);

		//const request = new DrpgCommandRequest(interaction, command, subCmd);
		const request = new DrpgCommandRequest(interaction, command);
		logCommandUsed(request);
	}
}
