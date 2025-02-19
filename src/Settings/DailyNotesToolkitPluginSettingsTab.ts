import {App, PluginSettingTab, Setting} from "obsidian";
import DailyNotesToolkitPlugin from "../main";

export default class DailyNotesToolkitPluginSettingsTab extends PluginSettingTab {
	plugin: DailyNotesToolkitPlugin;

	constructor(app: App, plugin: DailyNotesToolkitPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Override original previous/next daily note command')
			.setDesc('Original commands do not work when the file format contains slashes (eg: YYYY/MM/YYYY-MM-DD)')
			.addToggle(toggle => {
				toggle.setValue(this.plugin.settings.replaceOriginalDailyNoteNavigationCommands);
				toggle.onChange(async (value) => {
					this.plugin.settings.replaceOriginalDailyNoteNavigationCommands = value;
					await this.plugin.saveSettings();
				});
			});
	}
}
