import { Command } from "@sapphire/framework";
import { GuildMember, Message, TextChannel } from "discord.js";
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
}
