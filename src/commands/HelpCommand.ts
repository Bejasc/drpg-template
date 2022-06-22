import { DrpgColors, joinString, stringTitleCase } from "@drpgdev/drpg-utils";
import { ApplyOptions } from "@sapphire/decorators";
import type { Args } from "@sapphire/framework";
import { ColorResolvable, Message, MessageEmbed } from "discord.js";
import { DrpgCommand, IDrpgCommandOptions } from "./../lib/structures/DrpgCommand";

@ApplyOptions<IDrpgCommandOptions>({
	name: "help",
	aliases: ["help"],
	showInHelpMenu: false,
})
export class HelpCommand extends DrpgCommand {
	async messageRun(message: Message, args: Args): Promise<Message> {
		const prefix = process.env.BOT_PREFIX;

		const embed = new MessageEmbed();

		embed.setThumbnail("https://cdn.discordapp.com/attachments/964554539539771412/969049455963828294/badge_random.png");
		embed.setColor(DrpgColors.blue as ColorResolvable);

		if (!args.finished) {
			const target = await args.pick("string");

			const cmd = this.store.get(target) as DrpgCommand;
			const opts = cmd.options as IDrpgCommandOptions;

			embed.setTitle(stringTitleCase(opts.name ?? cmd.name));

			if (opts.description) embed.setDescription(opts.description);

			if (cmd.aliases?.length > 0) embed.addField("Aliases", joinString(cmd.aliases.map((e) => `\`${prefix}${e}\``)));

			const categoryString = cmd.fullCategory.join(" / ");
			embed.addField("Category", categoryString);

			if (opts.examples?.length > 0) {
				const exampleText = opts.examples.map((example) => {
					return `**${example.title}**\n_${example.description ?? opts.shortDesc}_\n\`${prefix}${example.command}\``;
				});

				embed.addField("Examples", exampleText.join("\n\n"));
			}
		} else {
			const commands = this.store.filter((e) => (e.options as IDrpgCommandOptions).showInHelpMenu ?? false);
			embed.setTitle("Command Help");

			//TODO chunk this up when over max field count
			//TODO split into Categories
			commands.map((cmd: DrpgCommand) => {
				const opts = cmd.options as IDrpgCommandOptions;

				embed.addField(
					`${stringTitleCase(opts.name ?? cmd.name)} - \`${prefix}${cmd.aliases[0]}\``,
					opts?.shortDesc ?? opts.description ?? `Use \`${prefix}help ${cmd.name}\` for more info.`,
				);
			});

			embed.setFooter({ text: `Use ${prefix}help <command> for more info` });
		}

		return message.reply({ embeds: [embed] });
	}
}
