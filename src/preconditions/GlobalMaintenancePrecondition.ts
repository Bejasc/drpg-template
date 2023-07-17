import { AllFlowsPrecondition, Command, Piece, Precondition, PreconditionResult } from "@sapphire/framework";
import { Message } from "discord.js";
import { client } from "../Bot";
import { getMaintenanceMode } from "../lib/PersistentStorage";
import { DrpgCommandRequest } from "../lib/structures/DrpgCommandRequest";
export class MaintenancePrecondition extends Precondition {
	public constructor(context: Piece.Context, options: AllFlowsPrecondition.Options) {
		super(context, {
			...options,
			position: 20,
		});
	}

	public override async chatInputRun(interaction: Command.ChatInputCommandInteraction, command: Command) {
		const request = new DrpgCommandRequest(interaction, command);
		return this.checkMaintenance(request);
	}

	public override async messageRun(message: Message, command: Command) {
		const request = new DrpgCommandRequest(message, command);
		return this.checkMaintenance(request);
	}

	private async checkMaintenance(request: DrpgCommandRequest): Promise<PreconditionResult> {
		const maintenanceActive = getMaintenanceMode();
		if (!maintenanceActive.active) return this.ok();

		const isOwner = request.author.user.id == process.env.OWNER;

		if (!isOwner) return this.error({ message: `${request.author} - ${client.user} is currently in Maintenance Mode.`, identifier: "Maintenance Mode" });
		else return this.ok();
	}
}
