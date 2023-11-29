import { InteractionHandler, InteractionHandlerTypes } from "@sapphire/framework";
import type { ModalSubmitInteraction } from "discord.js";
import { Logger } from "drpg-logger";
import { INTERACTION_ID_PREFIX, InteractionManager } from "../lib/InteractionManager";
import { LogError } from "../lib/ErrorHandler";

export class ModalHandler extends InteractionHandler {
	public constructor(context: InteractionHandler.LoaderContext, options: InteractionHandler.Options) {
		super(context, {
			...options,
			interactionHandlerType: InteractionHandlerTypes.ModalSubmit,
		});
	}

	public override parse(interaction: ModalSubmitInteraction) {
		if (interaction.customId.startsWith("drpgTemplate")) return this.none();
		if (!interaction.customId.startsWith(INTERACTION_ID_PREFIX)) return this.none();
		return this.some();
	}

	public async run(interaction: ModalSubmitInteraction) {
		const im = new InteractionManager();

		if (im.hasListeners(interaction.customId)) {
			try {
				im.emit(interaction.customId, interaction);
			} catch (err) {
				LogError(err, "ModalHandler.run");
			}
		} else {
			Logger.warn("TODO - Handle unbound Modal", "ModalHandler.run");
		}
	}
}
