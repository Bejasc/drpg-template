import { Command, Precondition, PreconditionResult } from "@sapphire/framework";
import { Message } from "discord.js";
import { DrpgCommandRequest } from "../lib/structures/DrpgCommandRequest";
export class OwnerOnly extends Precondition {
	public override async chatInputRun(interaction: Command.ChatInputCommandInteraction, command: Command) {
		const request = new DrpgCommandRequest(interaction, command);
		return this.checkOwner(request);
	}

	public override async messageRun(message: Message, command: Command) {
		const request = new DrpgCommandRequest(message, command);
		return this.checkOwner(request);
	}

	private async checkOwner(request: DrpgCommandRequest): Promise<PreconditionResult> {
		const isOwner = request.author.user.id == process.env.OWNER;
		if (isOwner) return this.ok();
		else return this.error({ message: `${request.author} - This command can only be used by <@${process.env.OWNER}>`, identifier: "Invalid Permission" });
	}
}

declare module "@sapphire/framework" {
	interface Preconditions {
		OwnerOnly: never;
	}
}
