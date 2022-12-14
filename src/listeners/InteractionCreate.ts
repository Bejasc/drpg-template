import { Listener } from "@sapphire/framework";
import { ButtonInteraction, Constants, Interaction } from "discord.js";
import { Logger } from "drpg-logger";
import { InteractionManager } from "../lib/InteractionManager";

export default class InteractionCreate extends Listener<typeof Constants.Events.INTERACTION_CREATE> {
	private interactionManager: InteractionManager = new InteractionManager();

	constructor(context: Listener.Context, options: Listener.Options) {
		super(context, { ...options, emitter: "ws", event: Constants.Events.INTERACTION_CREATE });
	}

	public run(interaction: Interaction): void {
		if (interaction.isCommand()) {
			//this.commandInteractionHandler(interaction);
		} else if (interaction.isButton()) {
			this.buttonInteractionHandler(interaction);
		}
	}

	private buttonInteractionHandler(interaction: ButtonInteraction): void {
		if (this.interactionManager.hasListeners(interaction.customId)) {
			try {
				this.interactionManager.emit(interaction.customId, interaction);
			} catch (error) {
				Logger.error(error, "Button interaction failed!");
			}
		} else {
			this.interactionManager.handleUnboundButton(interaction);
		}
	}
}
