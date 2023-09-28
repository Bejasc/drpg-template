import { Message, EmbedBuilder } from "discord.js";
import { Logger } from "drpg-logger";

export function enableUncaughtErrorHandling() {
	process.on("unhandledRejection", (reason) => {
		try {
			if (reason instanceof Error) {
				Logger.error(reason.message, `Unhandled Promise Rejection: ${reason.name}`);
			} else if (typeof reason === "string") {
				Logger.error(reason, `Unhandled Promise Rejection`);
			} else {
				Logger.error("Unknown Reason", `Unhandled Promise Rejection`);
			}
		} catch (e) {
			console.error("Unhandled Promise Rejection", reason);
		}
	});

	process.on("uncaughtException", (err) => {
		try {
			LogError(err, "Uncaught Exception");
			Logger.error(`${err.message}\n\n\`\`\`${err.stack ?? "No Stack available"}\`\`\``, "Uncaught Exception");
		} catch (e) {
			console.error("Uncaught Exception", err);
		}
	});
}

export async function LogError(err: Error, title?: string, content?: string, message?: Message): Promise<EmbedBuilder> {
	const embed = Logger.error(
		`${content ? `${content}\n\n` : ""}${err?.message ?? err}\n\`\`\`${err.stack ?? "No stack available"}\`\`\``,
		title ?? err?.message ?? "An unknown error occurred.",
		message,
	);
	return embed;
}
