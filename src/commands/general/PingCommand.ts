import { ApplyOptions } from "@sapphire/decorators";
import { Message } from "discord.js";
import { DrpgCommand, IDrpgCommandOptions } from "../../lib/structures/DrpgCommand";

@ApplyOptions<IDrpgCommandOptions>({
	aliases: ["latency", "ms", "ping"],
	fullCategory: ["Debug"],
	showInHelpMenu: true,
	description: "Checks the bot's response time.",
})
export class PingCommand extends DrpgCommand {
	public async messageRun(message: Message): Promise<Message> {
		const msg = await message.channel.send("Ping..");

		const content = `Bot Latency ${Math.round(this.container.client.ws.ping)}ms. API Latency ${
			(msg.editedTimestamp || msg.createdTimestamp) - (message.editedTimestamp || message.createdTimestamp)
		}ms.\nThis is the new Ping command tested through CICD!`;

		return msg.edit(content);
	}
}
