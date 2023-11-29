import { Command, CommandOptions } from "@sapphire/framework";

const COMMAND_OPTIONS: IDrpgCommandOptions = {
	showInHelpMenu: false,
	generateDashLessAliases: true,
};

export interface IDrpgCommandOptions extends CommandOptions {
	shortDesc?: string;
	showInHelpMenu?: boolean;
	examples?: { title: string; command: string; description?: string }[];
}

export abstract class DrpgCommand extends Command {
	public readonly fullCategory: readonly string[] = [];

	public constructor(context: Command.LoaderContext, options: IDrpgCommandOptions) {
		super(context, { ...COMMAND_OPTIONS, ...options });

		if (options.fullCategory) {
			this.fullCategory = options.fullCategory;
		} else if (this.location.directories.length) {
			this.fullCategory = this.location.directories;
		} else {
			this.fullCategory = ["uncategorized"];
		}
	}
}
