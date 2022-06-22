import { Logger } from "@drpgdev/drpg-logger";
import { DrpgColors } from "@drpgdev/drpg-utils";
import { ApplyOptions } from "@sapphire/decorators";
import { ButtonInteraction, ColorResolvable, Message, MessageActionRow, MessageEmbed } from "discord.js";
import { DrpgCommand, IDrpgCommandOptions } from "../../lib/structures/DrpgCommand";
import { InteractionManager } from "./../../lib/InteractionManager";

@ApplyOptions<IDrpgCommandOptions>({
	name: "Button Test",
	aliases: ["buttontest", "buttons", "bt", "btest"],
	description: "Test command showing off the use of Buttons",
	showInHelpMenu: true,
})
export class ButtonTestCommand extends DrpgCommand {
	public async messageRun(message: Message): Promise<Message> {
		const embed = new MessageEmbed();

		embed.setTitle("Testing Buttons on this message!");
		embed.setColor(DrpgColors.red as ColorResolvable);
		embed.setDescription("Embed are particularly powerful, and great for making things look good!");

		const interactionManager = new InteractionManager();

		// const randomNumber: number = await new Promise((resolve) => {
		const btnRandomNumberGenerator = interactionManager.getButton({
			id: `btnRandomNumberGenerator:${message.member.id}:${new Date().getTime()}`, //I like to generate IDs like this because then they're always unique
			style: "PRIMARY",
			channel: message.channel,
			emoji: "🎲",
			label: "Generate Random Number",
			callback: async (interaction: ButtonInteraction) => {
				if (interaction.member.user.id != message.member.user.id) {
					interaction.reply({ content: `${interaction.member} - That is not meant for you!`, ephemeral: true });
				} else {
					const rNum = Math.floor(Math.random() * 10) + 1;

					//this Logger is my own NPM package I've created
					//It will auto log to console, and also log to a discord channel, based on your env settings and config in the Bot.ts
					//Here's a more advanced usage where you also give it a "field" for the MessageEmbed
					//Really, this is no different to building the Embed as above - but it automatically logs some stuff for you!
					const resultEmbed = Logger.debug(`${message.member} picked a random number!`, "Random Number Generator", message, {
						fields: [{ name: "Result", value: rNum.toString() }],
					});

					await message.reply({ embeds: [resultEmbed] });
				}

				interaction.deferUpdate();
				interactionManager.discardInteraction(btnRandomNumberGenerator.customId);

				//Want this to only happen once?
				//Edit the initial message, and remove the components
			},
		});

		const messageActionRow = new MessageActionRow({ components: [btnRandomNumberGenerator] });
		return message.reply({ embeds: [embed], components: [messageActionRow] });
	}
}
