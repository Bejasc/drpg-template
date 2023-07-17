import { ConsoleColor, Logger } from "drpg-logger";
import { DrpgColors } from "drpg-utils";
import { DrpgCommandRequest } from "./structures/DrpgCommandRequest";

export function logCommandUsed(request: DrpgCommandRequest): void {
	console.log("aaaaa", request);
	const logCommandUsage = Number(process.env.LOG_COMMAND_USE ?? 0);
	const prefix = process.env.BOT_PREFIX;

	const fullCommand = `${request.command.name}${request.subcommand ? ` ${request.subcommand.name}` : ""}`;
	const commandName = request.interaction ? `/${fullCommand}` : `${prefix}${fullCommand}`;

	if (logCommandUsage === 0) {
		Logger.trace(`${request.author} used ${fullCommand}. Detailed command logging is disabled`);
		return;
	}

	const commandMethod = request.interaction ? "SLASH COMMAND" : "PREFIX COMMAND";

	Logger.custom(
		{
			embedColor: DrpgColors.pink,
			consoleColor: ConsoleColor.magenta,
			logTag: "CMD",
			priority: 100,
			emoji: "🎮",
		},
		`${request.author} used \`${commandName}\` in ${request.channel}`,
		`${commandMethod} Used`,
	);
}
