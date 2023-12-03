import { AttachmentBuilder, TextChannel } from "discord.js";

import { EmbedBuilder } from "@discordjs/builders";

type DrpgResponsePayload = { content?: string; embeds?: EmbedBuilder[]; files?: AttachmentBuilder[] };

export type DrpgReponseOptions = {
	content?: string;
	embeds?: EmbedBuilder | EmbedBuilder[];
	attachments: AttachmentBuilder | AttachmentBuilder[];
};

export class DrpgCommandResponse {
	private _content: string;
	private _embeds: EmbedBuilder[] = [];
	private _files: AttachmentBuilder[] = [];

	private _logOutputChannel: TextChannel;

	constructor(values?: DrpgReponseOptions, logOptions?: { channel: TextChannel }) {
		if (values) {
			if (values.content) this.setContent(values.content);
			if (values.embeds) this.addEmbed(values.embeds);
			if (values.attachments) this.addAttachment(values.attachments);
		}

		if (logOptions) {
			this._logOutputChannel = logOptions.channel;
		}
	}

	public setContent(content: string) {
		this._content = content;
		return this;
	}

	public addEmbed(embed: EmbedBuilder | EmbedBuilder[]) {
		this._embeds.push(...(Array.isArray(embed) ? embed : [embed]));
		return this;
	}

	public addAttachment(attachment: AttachmentBuilder | AttachmentBuilder[]) {
		this._files.push(...(Array.isArray(attachment) ? attachment : [attachment]));
		return this;
	}

	public get payload(): DrpgResponsePayload {
		const payload: DrpgResponsePayload = {};

		if (this._content) payload.content = this._content;
		if (this._embeds?.length > 0) payload.embeds = this._embeds;
		if (this._files?.length > 0) payload.files = this._files;

		if (this._logOutputChannel) {
			//TODO put something in the console
			this._logOutputChannel.send(payload);
		}

		return payload;
	}
}
