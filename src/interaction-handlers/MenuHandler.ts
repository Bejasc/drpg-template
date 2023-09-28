import { InteractionHandler, InteractionHandlerTypes, PieceContext } from "@sapphire/framework";
import type { SelectMenuInteraction } from "discord.js";
import { Logger } from "drpg-logger";
import { INTERACTION_ID_PREFIX, InteractionManager } from "../lib/InteractionManager";

export class MenuHandler extends InteractionHandler {
	public constructor(ctx: PieceContext, options: InteractionHandler.Options) {
		super(ctx, {
			...options,
			interactionHandlerType: InteractionHandlerTypes.SelectMenu,
		});
	}

	public override parse(interaction: SelectMenuInteraction) {
		if (interaction.customId.startsWith("drpgTemplate")) return this.none();
		if (!interaction.customId.startsWith(INTERACTION_ID_PREFIX)) return this.none();
		return this.some();
	}

	public async run(interaction: SelectMenuInteraction) {
		const im = new InteractionManager();
		if (im.hasListeners(interaction.customId)) {
			try {
				im.emit(interaction.customId, interaction);
			} catch (err) {
				Logger.error(err, "MenuHandler.Run");
			}
		} else {
			Logger.warn("TODO - Handle unbound select", "MenuHandler.run");
		}
	}
}
