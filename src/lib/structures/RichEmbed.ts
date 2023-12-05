import { AttachmentBuilder, BaseMessageOptions, EmbedBuilder } from "discord.js";

export function checkIsRichEmbed(input: unknown): input is RichEmbed {
	return (input as RichEmbed).payload != null;
}

export type DrpgResponse = EmbedBuilder | EmbedBuilder[] | RichEmbed | string;

export class RichEmbed {
	private _embeds: EmbedBuilder[] = [];
	private _attachments: AttachmentBuilder[] = [];

	constructor(embeds: EmbedBuilder | EmbedBuilder[], attachments?: AttachmentBuilder | AttachmentBuilder[]) {
		this._embeds.push(...(Array.isArray(embeds) ? embeds : [embeds]));
		if (attachments) this._attachments.push(...(Array.isArray(attachments) ? attachments : [attachments]));

		//TODO, eventually may want to include components to this also
	}

	public addEmbed(embed: EmbedBuilder | EmbedBuilder[]) {
		this._embeds.push(...(Array.isArray(embed) ? embed : [embed]));
		return this;
	}

	public addAttachment(attachment: AttachmentBuilder | AttachmentBuilder[]) {
		this._attachments.push(...(Array.isArray(attachment) ? attachment : [attachment]));
		return this;
	}

	public get payload(): BaseMessageOptions {
		const result: BaseMessageOptions = { embeds: this._embeds };

		if (this._attachments) {
			result.files = this._attachments;
		}

		return result;
	}
}
