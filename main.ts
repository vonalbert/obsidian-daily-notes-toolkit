import {Plugin} from 'obsidian';
import {appHasDailyNotesPluginLoaded} from "obsidian-daily-notes-interface";
import NavigationCommandsReplacer from "./src/Navigation/NavigationCommandsReplacer";

interface DailyNotesToolkitSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: DailyNotesToolkitSettings = {
	mySetting: 'default'
}

export default class DailyNotesToolkitPlugin extends Plugin {
	settings: DailyNotesToolkitSettings;

	navigationCommandsReplacer = new NavigationCommandsReplacer(this.app);

	async onload() {
		await this.loadSettings();

		if (!appHasDailyNotesPluginLoaded()) {
			return;
		}

		this.navigationCommandsReplacer.replace();
	}

	onunload() {
		this.navigationCommandsReplacer.restore();
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
