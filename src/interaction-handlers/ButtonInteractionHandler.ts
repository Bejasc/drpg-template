import { InteractionHandler, InteractionHandlerTypes } from "@sapphire/framework";
import type { ButtonInteraction } from "discord.js";
import { INTERACTION_ID_PREFIX, InteractionManager } from "../lib/InteractionManager";

export class ButtonHandler extends InteractionHandler {
	public constructor(context: InteractionHandler.LoaderContext, options: InteractionHandler.Options) {
		super(context, {
			...options,
			interactionHandlerType: InteractionHandlerTypes.Button,
		});
	}

	public override parse(interaction: ButtonInteraction) {
		if (interaction.customId.startsWith("drpgTemplate")) return this.none();
		if (!interaction.customId.startsWith(INTERACTION_ID_PREFIX)) return this.none();
		return this.some();
	}

	public async run(interaction: ButtonInteraction) {
		const im = new InteractionManager();

		if (!im.hasListeners(interaction.customId)) {
			im.handleUnboundButton(interaction);
		} else {
			im.emit(interaction.customId, interaction);
		}
	}
}
