import { Events, Listener, ListenerOptions, MessageCommandDeniedPayload, PieceContext, UserError } from "@sapphire/framework";

export class MessageCommandDenied extends Listener<typeof Events.MessageCommandDenied> {
	public constructor(context: PieceContext, options?: ListenerOptions) {
		super(context, { ...options, event: Events.MessageCommandDenied });
	}

	public async run(error: UserError, { message }: MessageCommandDeniedPayload) {
		return message.reply({ content: error.message });
	}
}
