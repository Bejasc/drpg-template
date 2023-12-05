import { BaseMessageOptions, EmbedBuilder, GuildMember, InteractionResponse, Message, TextChannel } from "discord.js";
import { DrpgResponse, checkIsRichEmbed } from "./RichEmbed";

import { Command } from "@sapphire/framework";
import { DrpgCommand } from "./DrpgCommand";

export class DrpgCommandRequest {
	author: GuildMember;
	channel: TextChannel;
	command: DrpgCommand;
	subcommand?: DrpgCommand;
	message?: Message;
	interaction?: Command.ChatInputCommandInteraction;
	constructor(source: Message | Command.ChatInputCommandInteraction, command: DrpgCommand, subcommand?: DrpgCommand) {
		this.channel = source.channel as TextChannel;
		this.author = source.member as GuildMember;
		this.command = command;

		if (subcommand) this.subcommand = subcommand;

		if ((source as Message).content !== undefined) {
			this.message = source as Message;
		} else {
			this.interaction = source as Command.ChatInputCommandInteraction;
		}
	}

	isBaseMessageOptions(input: unknown): input is BaseMessageOptions {
		//return (input as RichEmbed).payload != null;
		return !!input && typeof input === "object" && ("content" in input || "embeds" in input);
	}

	public async respond<T extends Message | InteractionResponse>(response: DrpgResponse | BaseMessageOptions, privateResponse?: boolean): Promise<T> {
		if (!this.isBaseMessageOptions(response)) {
			if (checkIsRichEmbed(response)) {
				response = response.payload;
			} else {
				if (typeof response === "string" || response instanceof String) {
					response = { content: String(response) };
				} else {
					const embeds: EmbedBuilder[] = Array.isArray(response) ? response : [response];
					response = { embeds };
				}
			}
		}

		if (this.interaction) {
			if (!this.interaction.replied) {
				return (await this.interaction.reply(response)) as T;
			} else {
				return (await this.interaction.followUp(response)) as T;
			}
		} else {
			if (privateResponse) return (await this.author.send(response)) as T;
			else {
				try {
					return (await this.message?.reply(response)) as T;
				} catch {
					return (await this.channel.send(response)) as T;
				}
			}
		}
	}
}
