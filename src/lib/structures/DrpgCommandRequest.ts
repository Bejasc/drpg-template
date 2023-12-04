import { GuildMember, InteractionResponse, Message, TextChannel } from "discord.js";

import { Command } from "@sapphire/framework";
import { DrpgCommand } from "./DrpgCommand";
import { DrpgCommandResponse, checkIsCommandResponse } from "./DrpgCommandResponse";
import { EmbedBuilder } from "@discordjs/builders";

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

	public async respond<T extends Message | InteractionResponse>(response?: DrpgCommandResponse | EmbedBuilder | EmbedBuilder[], privateResponse?: boolean): Promise<T> {
		if (!checkIsCommandResponse(response)) {
			const embeds = Array.isArray(response) ? response : [response];

			response = new DrpgCommandResponse({ embeds });
		}

		if (this.interaction) {
			if (!this.interaction.replied) {
				return (await this.interaction.reply(response.payload)) as T;
			} else {
				if (privateResponse) {
					return (await this.author.send(response.payload)) as T;
				} else {
					return (await this.channel.send(response.payload)) as T;
				}
			}
		} else {
			if (privateResponse) return (await this.author.send(response.payload)) as T;
			else {
				try {
					return (await this.message?.reply(response.payload)) as T;
				} catch {
					return (await this.channel.send(response.payload)) as T;
				}
			}
		}
	}
}
