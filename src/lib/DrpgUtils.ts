import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, EmbedBuilder, Message } from "discord.js";
import { Logger } from "drpg-logger";
import { InteractionManager } from "./InteractionManager";
import { DrpgCommandRequest } from "./structures/DrpgCommandRequest";

export type paginationSelectOptions = {
	label?: string;
	style?: ButtonStyle;
	callback?: (selectedIndex: number) => void;
};

export async function PaginateMessage(
	request: DrpgCommandRequest,
	content: EmbedBuilder[],
	selectOptions: paginationSelectOptions = undefined,
): Promise<{ message: Message; selectedIndex: number }> {
	let currentPage = 0;

	let selectedIndex = -1;

	const interactionManager = new InteractionManager();

	const btnPreviousId = `${request.channel.id}:previous:${new Date().getTime()}`;
	const btnNextId = `${request.channel.id}:next:${new Date().getTime()}`;
	const btnSelectId = `${request.channel.id}:select:${new Date().getTime()}`;

	const btnPrevious = interactionManager.getButton({
		id: btnPreviousId,
		emoji: "◀",
		channel: request.channel,
		style: ButtonStyle.Primary,
		callback: async (interaction: ButtonInteraction) => {
			if (interaction.member != request.author) return;

			if (currentPage == 0) currentPage = content.length - 1;
			else currentPage--;

			content[currentPage].setFooter({ text: `${currentPage + 1} of ${content.length}` });

			await message.edit({ embeds: [content[currentPage]], components: [buttonRow] });
			interaction.deferUpdate();
		},
	});

	const btnNext = interactionManager.getButton({
		id: btnNextId,
		emoji: "▶",
		channel: request.channel,
		style: ButtonStyle.Primary,
		callback: async (interaction: ButtonInteraction) => {
			if (interaction.member != request.author) return;

			if (currentPage == content.length - 1) currentPage = 0;
			else currentPage++;

			content[currentPage].setFooter({ text: `${currentPage + 1} of ${content.length}` });

			await message.edit({ embeds: [content[currentPage]], components: [buttonRow] });
			interaction.deferUpdate();
		},
	});

	let buttonRow = new ActionRowBuilder<ButtonBuilder>({ components: [btnPrevious, btnNext] });

	if (selectOptions != undefined) {
		//TODO convert this into a callback to be propertly awaited
		const btnSelect = interactionManager.getButton({
			id: btnSelectId,
			label: selectOptions.label ?? "Select",
			style: selectOptions.style ?? ButtonStyle.Success,
			channel: request.channel,
			callback: async (interaction: ButtonInteraction) => {
				if (interaction.member != request.author) return;

				closePagination(interactionManager, btnSelectId, btnNextId, btnPreviousId, message);

				interaction.deferUpdate();

				selectedIndex = currentPage;
				Logger.debug(
					`${request.author} selected '${content[currentPage].data.title}' from a selection of ${content.length} options`,
					"Paginated Message Selection",
					message,
				);

				if (selectOptions.callback) selectOptions.callback(selectedIndex);
				return { message, selectedIndex: currentPage };
			},
		});

		buttonRow = new ActionRowBuilder({ components: [btnPrevious, btnSelect, btnNext] });
	}

	content[currentPage].setFooter({ text: `${currentPage + 1} of ${content.length}` });

	let message = null;
	if (request.interaction) {
		message = await request.interaction.reply({ embeds: [content[currentPage]], components: [buttonRow] });
	}
	if (request.message) {
		message = await request.message.reply({ embeds: [content[currentPage]], components: [buttonRow] });
	}

	return { message, selectedIndex };
}

function closePagination(interactionManager: InteractionManager, btnSelectId: string, btnNextId: string, btnPreviousId: string, message: Message<boolean>) {
	interactionManager.discardInteraction(btnSelectId);
	interactionManager.discardInteraction(btnNextId);
	interactionManager.discardInteraction(btnPreviousId);
	interactionManager.removeMessageComponentFromMessage(message);
}
