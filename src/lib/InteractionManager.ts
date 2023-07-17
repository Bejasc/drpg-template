import { bold, italic, red, white, yellow } from "colorette";
import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonInteraction,
	ButtonStyle,
	Collection,
	Emoji,
	EmojiIdentifierResolvable,
	Message,
	MessageEditOptions,
	ModalBuilder,
	StringSelectMenuBuilder,
	StringSelectMenuInteraction,
	TextBasedChannel,
	TextInputBuilder,
	TextInputStyle,
} from "discord.js";
import { Logger } from "drpg-logger";
import { EventEmitter } from "stream";
import { client } from "../Bot";

export interface ButtonCreationData {
	id: string;
	style?: ButtonStyle;
	label?: string;
	emoji?: string | Emoji;
	callback?: (interaction: ButtonInteraction) => void;
	timeoutCallback?: () => void;
	timeout?: number;
	channel: TextBasedChannel;
}

export interface ISelectOption {
	id: string;
	label: string;
	callback?: (interaction: StringSelectMenuInteraction) => void;
}

export interface DropdownCreationData {
	id: string;
	placeholder: string;
	options: ISelectOption[];
	timeoutCallback?: () => void;
	timeout?: number;
	channel: TextBasedChannel;
}

export interface ModalInputCreationData {
	id: string;
	title: string;
	style?: "SHORT" | "LONG";
	placeholder: string;
	label: string;
	callback?: (inputValue: string) => void;
}

export function getTextPrompt({ id, title, placeholder, label, callback }: ModalInputCreationData): ModalBuilder {
	id = `swrpg-${id}`;

	const modal = new ModalBuilder().setCustomId(`modal:${id}`).setTitle(title);

	const input = new TextInputBuilder()
		.setCustomId(`prompt:${id}`)
		.setLabel(label)
		.setStyle(TextInputStyle.Short)
		.setPlaceholder(placeholder ?? "Enter text");

	const actionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(input);

	modal.addComponents(actionRow);

	client.on("interactionCreate", async (interaction) => {
		if (!interaction.isModalSubmit()) return;

		if (interaction.customId === `modal:${id}`) {
			const firstResponse = interaction.fields.getTextInputValue(`prompt:${id}`);
			Logger.debug(firstResponse);
			if (callback) callback(firstResponse);
			interaction.deferReply({ ephemeral: false });
			interaction.deleteReply();
			//DiscardInteraction?
		}
	});

	return modal;
}

export class InteractionManager extends EventEmitter {
	private static buttons: Collection<string, ButtonBuilder> = new Collection();
	private static dropdowns: Collection<string, StringSelectMenuBuilder> = new Collection();

	private static instance: InteractionManager;

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

	public getDropdown({ id, options }: DropdownCreationData): StringSelectMenuBuilder {
		id = `swrpg-${id}`;

		const dropdown = InteractionManager.dropdowns.has(id) ? InteractionManager.dropdowns.get(id) : new StringSelectMenuBuilder().setCustomId(id);

		if (options) {
			const selectOptions = options.map((o) => {
				return {
					label: o.label,
					value: o.label,
				};
			});

			dropdown.setOptions(selectOptions);
		}

		this.on(id, (interaction: StringSelectMenuInteraction) => {
			const selectedOption = options.find((x) => x.id == interaction.values[0]);
			if (selectedOption) {
				selectedOption.callback(interaction);
			}

			interaction.deferUpdate();
			this.removeListener(id, () => {
				Logger.trace(`Interaction with ID ${id} was discarded`, "Interaction Discarded");
			});
		});

		this.on(id, (interaction: StringSelectMenuInteraction) => {
			const title = `${yellow("DROPDOWN SELECT")}`;
			const selectInfo = `${italic(dropdown.data.custom_id)}`;

			Logger.debug(`[${title}] - ${selectInfo} by ${interaction.member}`);
		});

		InteractionManager.dropdowns.set(id, dropdown);

		return dropdown;
	}

	public getButton({ id, style, label, emoji, callback, timeout, timeoutCallback }: ButtonCreationData): ButtonBuilder {
		id = `swrpg-${id}`;

		const button = InteractionManager.buttons.has(id) ? InteractionManager.buttons.get(id) : new ButtonBuilder().setCustomId(id);

		if (style) {
			button.setStyle(style);
		}

		if (label) {
			button.setLabel(label);
		}

		if (emoji) {
			button.setEmoji(emoji as EmojiIdentifierResolvable);
		}

		this.on(id, (interaction: ButtonInteraction) => {
			const title = `${yellow("BUTTON CLICK")}`;
			const buttonInfo = `${italic(id)} (${white(bold(button.data.label))})`;

			Logger.debug(`[${title}] - ${buttonInfo} by ${interaction.user}`);
		});

		if (callback) {
			this.on(id, callback);
		}

		InteractionManager.buttons.set(id, button);

		if (timeout) {
			setTimeout(async () => {
				//FIXME Button is timing out even after being interacted with
				const title = `${red("BUTTON")}`;
				const buttonInfo = `${italic(id)} (${white(bold(button.data.label))})`;

				Logger.debug(`[${title}] - ${buttonInfo} timed out after ${timeout / 1000} seconds`);

				/*
				//! Can't think of a way that you'd be able to do this without performance becoming an linearly increasing issue, more messages, more time, why looping through all of t hem?
				const message = channel.messages.cache.find((message) => {
					return message.components.some((row) => row.components.some((component) => component.customId === id));
				});

				if (message) {
					this.removeMessageComponentFromMessage(message);
				}
				*/

				if (timeoutCallback) {
					timeoutCallback();
				}

				this.removeAllListeners(id);
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
