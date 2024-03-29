import { Events, Listener, ListenerOptions, MessageCommandAcceptedPayload } from "@sapphire/framework";
import { DrpgCommandRequest } from "../../lib/structures/DrpgCommandRequest";
import { logCommandUsed } from "../../lib/LogCommandUsed";

export class MessageCommandAccepted extends Listener<typeof Events.MessageCommandAccepted> {
	public constructor(context: Listener.LoaderContext, options?: ListenerOptions) {
		super(context, { ...options, event: Events.MessageCommandAccepted });
	}

	public run({ message, command }: MessageCommandAcceptedPayload): void {
		const request = new DrpgCommandRequest(message, command);
		logCommandUsed(request);
	}
}
