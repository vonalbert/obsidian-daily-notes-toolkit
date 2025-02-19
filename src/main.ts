import {Plugin} from 'obsidian';
import {appHasDailyNotesPluginLoaded} from "obsidian-daily-notes-interface";
import NavigationCommandsReplacer from "./Navigation/NavigationCommandsReplacer";
import DailyNotesToolkitPluginSettingsTab from "./Settings/DailyNotesToolkitPluginSettingsTab";
import {DailyNotesToolkitSettings, DEFAULT_SETTINGS} from "./Settings/DailyNotesToolkitSettings";

export default class DailyNotesToolkitPlugin extends Plugin {
	settings: DailyNotesToolkitSettings;

	navigationCommandsReplacer = new NavigationCommandsReplacer(this.app);

	async onload() {
		await this.loadSettings();

		if (!appHasDailyNotesPluginLoaded()) {
			console.error(`Daily Notes Toolkit: this plugin requires core daily-notes plugin to be enabled.`)
			return;
		}

		if (this.settings.replaceOriginalDailyNoteNavigationCommands) {
			this.navigationCommandsReplacer.replace();
		}

		this.addSettingTab(new DailyNotesToolkitPluginSettingsTab(this.app, this));
	}

	onunload() {
		this.navigationCommandsReplacer.restore();
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);

		if (this.settings.replaceOriginalDailyNoteNavigationCommands) {
			this.navigationCommandsReplacer.replace();
		} else {
			this.navigationCommandsReplacer.restore();
		}
	}
}
