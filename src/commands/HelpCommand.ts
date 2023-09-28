/* eslint-disable no-loops/no-loops */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApplyOptions } from "@sapphire/decorators";
import { ApplicationCommandRegistry, Args, Command, RegisterBehavior } from "@sapphire/framework";
import { ColorResolvable, EmbedBuilder, EmbedField, Message } from "discord.js";
import { Logger } from "drpg-logger";
import { DrpgColors, groupByProperty, joinString, stringTitleCase } from "drpg-utils";
import { IDrpgCommandOptions, DrpgCommand } from "../lib/structures/DrpgCommand";
import { DrpgCommandRequest } from "../lib/structures/DrpgCommandRequest";
import { PaginateMessage } from "../lib/DrpgUtils";

@ApplyOptions<IDrpgCommandOptions>({
	name: "help",
	aliases: ["help"],
	shortDesc: "View a list of all commands",
})
export class HelpCommand extends DrpgCommand {
	public override async registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand(
			(builder) =>
				builder
					.setName(this.name)
					.setDescription((this.options as IDrpgCommandOptions).shortDesc)
					.addStringOption((e) => e.setName("command").setDescription("View detailed help for this command").setRequired(false)),
			{
				idHints: ["1055494144035913819"],
				behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
			},
		);
	}

	public async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
		const request = new DrpgCommandRequest(interaction, this);

		const target = interaction.options.getString("command");

		const embed = await this.helpCommandResponse(target, request);
		interaction.reply({ embeds: [embed], ephemeral: true });
	}

	async messageRun(message: Message, args: Args): Promise<Message> {
		const request = new DrpgCommandRequest(message, this);

		const target = await args.pick("string").catch(() => null);

		const embed = await this.helpCommandResponse(target, request);
		return message.reply({ embeds: [embed] });
	}

	async helpCommandResponse(target: string, request: DrpgCommandRequest): Promise<EmbedBuilder> {
		const prefix = process.env.BOT_PREFIX;

		//const hasGmRole = request.author.roles.cache.find((r) => r.id == process.env.GM_ROLE_ID);

		if (target) {
			//TODO - if a Category can be matched instead of a command, show the embed for that category instead
			//Category embeds should have other info ie ^help trade will show all sorts of other stuff like how to make most of trading, and not just commands
			//Category would also define it's own color, as well as its own logo, so this config makes sense to be put in a categoryConfig
			//Then category on the commands themselves should use a categoryconfig and not a string, and the category name should be a properrt of the category config

			const embed = new EmbedBuilder();

			embed.setColor(DrpgColors.blue as ColorResolvable);
			const fields: EmbedField[] = [];

			const cmd = this.store.get(target) as DrpgCommand;
			const opts = cmd.options as IDrpgCommandOptions;

			embed.setTitle(`Command Help - ${stringTitleCase(opts.name ?? cmd.name)}`);

			if (opts.description) embed.setDescription(opts.description);

			if (cmd.aliases?.length > 0) fields.push({ name: "Aliases", value: joinString(cmd.aliases.map((e) => `\`${prefix}${e}\``)), inline: false });

			const categoryString = cmd.fullCategory.join(" / ");
			fields.push({ name: "Category", value: categoryString, inline: false });

			if (opts.examples?.length > 0) {
				const longFields: EmbedField[] = [];
				const exampleText = opts.examples.map((example) => {
					longFields.push({ name: "\u200b", value: `**${example.title}**\n_${example.description ?? opts.shortDesc}_\n\`${prefix}${example.command}\``, inline: false });
					return `**${example.title}**\n_${example.description ?? opts.shortDesc}_\n\`${prefix}${example.command}\``;
				});

				const t = exampleText.join("\n\n");
				if (t.length <= 1023) {
					fields.push({ name: "Examples", value: t, inline: false });
				} else {
					fields.push(...longFields);
				}
			}

			embed.setFields(fields);

			return embed;
		} else {
			const commands = this.store.filter((e: DrpgCommand) => (e.options as IDrpgCommandOptions).showInHelpMenu ?? false).map((cmd: DrpgCommand) => cmd);
			//if (!hasGmRole) commands = commands.filter((e) => !e.options.preconditions?.includes("GmOnly"));

			const categoryChunkedCommands = groupByProperty<DrpgCommand>(commands, "options.fullCategory");

			if (categoryChunkedCommands.length <= 0) {
				Logger.warn(
					"There are no help commands. Make sure that commands you want help for have `showInHelpMenu: true` set in their CommandOptions(which should be of type DrpgCommandOptions)\nYou can use the other properties like `shortDesc` and `examples` to provide more info for the help commands.",
					"Help Command Configuration",
				);
				return Logger.info("There are no commands configured to show in the Help menu.", "No Commands with Help");
			}

			const embeds = categoryChunkedCommands.map((commandCategory) => {
				const embed: EmbedBuilder = new EmbedBuilder();

				const category = commandCategory.group;
				embed.setTitle(`Command Help - ${category ?? "Other"} Commands`);
				embed.setColor(DrpgColors.blue as ColorResolvable);
				const fields: EmbedField[] = [];

				const commands = commandCategory.value.map((cmd: DrpgCommand) => {
					//TODO - if there are more than 25 of these, then need to create an embed titled `Category X of Y` ie `Info Commands - 2 of 3`
					const opts = cmd.options as IDrpgCommandOptions;
					fields.push({ name: opts?.shortDesc ?? opts.description ?? cmd.name, value: `\`${prefix}${cmd.aliases[0] ?? cmd.name}\``, inline: false });
				});

				if (commands.length > 20) {
					Logger.warn(
						`Command Category '' is nearing the limit of commands to show on the help command. \nThere are currently \`${commands.length}\`.\n Once this hits \`25\` no more will be shown and the help command may break`,
						"Nearing Command Limit for Help Embed",
						request.message,
					);
				}

				embed.setFields(fields);

				embed.setDescription(`### _Use \`${prefix}help <command>\` for more info_\nIncluding examples, aliases, and other helpful info`);

				return embed;
			});

			//---

			let message: Message = undefined;
			// eslint-disable-next-line no-async-promise-executor
			const result = await new Promise<EmbedBuilder>(async () => {
				const pagination = await PaginateMessage(request, embeds);

				message = pagination.message;
			});

			message.edit({ embeds: [result] });
		}
	}
}
