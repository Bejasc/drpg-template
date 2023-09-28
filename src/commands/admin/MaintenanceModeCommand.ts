import { ApplyOptions } from "@sapphire/decorators";
import { Message } from "discord.js";
import { Logger } from "drpg-logger";
import { dateToEpoch } from "drpg-utils";
import { DrpgCommand, IDrpgCommandOptions } from "../../lib/structures/DrpgCommand";
import { DrpgCommandRequest } from "../../lib/structures/DrpgCommandRequest";
import { getMaintenanceMode, setMaintenanceMode } from "../../lib/PersistentStorage";
import { client } from "../../Bot";

@ApplyOptions<IDrpgCommandOptions>({
	aliases: ["maintenance", "maint", "!maint"],
	description: "Checks the bot's response time.",
	showInHelpMenu: true,
	fullCategory: ["Admin"],
	preconditions: ["OwnerOnly"],
})
export class PingCommand extends DrpgCommand {
	public async messageRun(message: Message): Promise<Message> {
		const request = new DrpgCommandRequest(message, this);
		const maintenance = getMaintenanceMode();

		let embed = null;
		if (maintenance.active == true) {
			setMaintenanceMode(!maintenance.active);
			embed = Logger.info(`${client.user} is no longer in Maintenance Mode.`, "Maintenance Complete");
		} else {
			setMaintenanceMode(!maintenance.active);
			embed = Logger.info(`${client.user} has entered Maintenance Mode.`, "Down for Maintenance", null, {
				fields: [{ name: "Started", value: `<t:${dateToEpoch(new Date())}>`, inline: false }],
			});
		}

		await message.delete();
		return request.channel.send({ embeds: [embed] });
	}
}
