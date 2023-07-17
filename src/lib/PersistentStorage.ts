import fs from "fs";

const CONFIG_FILE_PATH = "./config.json";

interface Config {
	maintenanceMode: boolean;
	maintenanceStart?: Date;
}

function ensureConfigFileExists(): void {
	if (!fs.existsSync(CONFIG_FILE_PATH)) {
		const initialConfig: Config = { maintenanceMode: false };
		fs.writeFileSync(CONFIG_FILE_PATH, JSON.stringify(initialConfig));
	}
}

export function setMaintenanceMode(enabled: boolean): void {
	ensureConfigFileExists();
	const config: Config = { maintenanceMode: enabled };
	if (enabled == true) config.maintenanceStart = new Date();
	fs.writeFileSync(CONFIG_FILE_PATH, JSON.stringify(config));
}

export function getMaintenanceMode(): { active: boolean; date?: Date } {
	ensureConfigFileExists();
	try {
		const config: Config = JSON.parse(fs.readFileSync(CONFIG_FILE_PATH, "utf-8"));
		return { active: config.maintenanceMode === true, date: config.maintenanceStart };
	} catch (error) {
		return { active: false }; // Default to false if the config file doesn't exist or is invalid
	}
}
