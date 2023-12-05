import { ApplyOptions } from "@sapphire/decorators";
import { ApplicationCommandRegistry, Command } from "@sapphire/framework";
import { Message } from "discord.js";
import { DrpgCommand, IDrpgCommandOptions } from "../../lib/structures/DrpgCommand";
import { DrpgCommandRequest } from "../../lib/structures/DrpgCommandRequest";
import { DrpgResponse } from "../../lib/structures/RichEmbed";

@ApplyOptions<IDrpgCommandOptions>({
	name: "ping",
	aliases: ["latency", "ms"],
	fullCategory: ["Debug"],
	showInHelpMenu: true,
	shortDesc: "Checks the bot's response time.",
})
export class PingCommand extends DrpgCommand {
	public override async registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand((builder) => builder.setName(this.name).setDescription((this.options as IDrpgCommandOptions).shortDesc));
	}

	public async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
		const request = new DrpgCommandRequest(interaction, this);

		const response = await this.pingCommandResponse(request);
		return await request.respond(response, false);
	}

	async messageRun(message: Message): Promise<Message> {
		const request = new DrpgCommandRequest(message, this);

		const response = await this.pingCommandResponse(request);

		return await request.respond(response, false);
	}

	async pingCommandResponse(request: DrpgCommandRequest): Promise<DrpgResponse> {
		const content = `Bot Latency ${Math.round(this.container.client.ws.ping)}ms.`;
		return content;
	}
}
