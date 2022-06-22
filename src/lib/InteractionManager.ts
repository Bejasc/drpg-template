import { Logger } from "@drpgdev/drpg-logger";
import { bold, italic, red, white, yellow } from "colorette";
import { ButtonInteraction, Collection, Emoji, EmojiIdentifierResolvable, Message, MessageButton, MessageButtonStyle, MessageEditOptions, TextBasedChannel } from "discord.js";
import { EventEmitter } from "stream";

export interface ButtonCreationData {
	id: string;
	style?: MessageButtonStyle;
	label?: string;
	emoji?: string | Emoji;
	callback?: (interaction: ButtonInteraction) => void;
	timeoutCallback?: () => void;
	timeout?: number;
	channel: TextBasedChannel;
}

export class InteractionManager extends EventEmitter {
	private static instance: InteractionManager;
	private static buttons: Collection<string, MessageButton> = new Collection();

	constructor() {
		super();

		if (InteractionManager.instance) {
			return InteractionManager.instance;
		}

		InteractionManager.instance = this;
	}

	public hasListeners(interactionId: string): boolean {
		return this.listenerCount(interactionId) > 0;
	}

	public getButton({ id, style, label, emoji, callback, timeout, timeoutCallback, channel }: ButtonCreationData): MessageButton {
		const button = InteractionManager.buttons.has(id) ? InteractionManager.buttons.get(id) : new MessageButton().setCustomId(id);

		if (style) {
			button.setStyle(style);
		}

		if (label) {
			button.setLabel(label);
		}

		if (emoji) {
			button.setEmoji(emoji as EmojiIdentifierResolvable);
		}

		if (callback) {
			this.on(id, callback);
		}

		this.on(id, (interaction: ButtonInteraction) => {
			const title = `${yellow("BUTTON CLICK")}`;
			const buttonInfo = `${italic(button.customId)} (${white(bold(button.label))})`;

			Logger.debug(`[${title}] - ${buttonInfo} by ${interaction.user}`);
		});

		InteractionManager.buttons.set(id, button);

		if (timeout) {
			setTimeout(async () => {
				const title = `${red("BUTTON ")}`;
				const buttonInfo = `${italic(button.customId)} (${white(bold(button.label))})`;

				Logger.debug(`[${title}] - ${buttonInfo} timed out after ${timeout / 1000} seconds`);

				const message = channel.messages.cache.find((message) => {
					return message.components.some((row) => row.components.some((component) => component.customId === id));
				});

				if (timeoutCallback) {
					timeoutCallback();
				}

				if (message) {
					this.removeMessageComponentFromMessage(message);
				}

				this.removeAllListeners(button.customId);
			}, timeout);
		}

		return button;
	}

	public removeMessageComponentFromMessage(message: Message): void {
		const editOptions: MessageEditOptions = {
			components: [],
		};

		if (message.content && message.content.length > 0) {
			editOptions.content = message.content;
		}

		if (message.embeds && message.embeds.length > 0) {
			editOptions.embeds = message.embeds;
		}

		message.edit(editOptions);
	}

	public async handleUnboundButton(interaction: ButtonInteraction): Promise<void> {
		if (interaction.replied) {
			await interaction.editReply({
				content: "This button doesn't do anything anymore! You can try sending the command again.",
				components: [],
			});
		} else {
			await interaction.reply({
				content: "This button doesn't do anything anymore! You can try sending the command again.",
				components: [],
				ephemeral: true,
			});
		}

		const interactionMessage = interaction.message as Message;
		this.removeMessageComponentFromMessage(interactionMessage);
	}

	public discardInteraction(id: string): void {
		this.removeListener(id, () => {
			Logger.trace(`Interaction with ID ${id} was discarded`, "Interaction Discarded");
		});
	}
}
