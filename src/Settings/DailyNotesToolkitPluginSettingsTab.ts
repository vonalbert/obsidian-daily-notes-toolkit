import {App, PluginSettingTab, Setting} from "obsidian";
import InlineTitleFormatter from "../InlineTitle/InlineTitleFormatter";
import DailyNotesToolkitPlugin from "../main";
import {DEFAULT_SETTINGS} from "./DailyNotesToolkitSettings";

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

		new Setting(containerEl)
			.setName('Ensure a daily note exists for the current day')
			.setDesc('Core daily-notes plugin only offer the possibility to open a daily note on EVERY application startup. With this option you can create the daily-note without opening the file')
			.addToggle(toggle => {
				toggle.setValue(this.plugin.settings.silentlyCreateDailyNoteFile);
				toggle.onChange(async (value) => {
					this.plugin.settings.silentlyCreateDailyNoteFile = value;
					await this.plugin.saveSettings();
				});
			});

		new Setting(containerEl)
			.setName('Format inline title')
			.setDesc('Whether should replace daily note\'s inline title with a formatted version')
			.addToggle(toggle => {
				toggle.setValue(this.plugin.settings.shouldFormatDailyNoteInlineTitle);
				toggle.onChange(async (value) => {
					this.plugin.settings.shouldFormatDailyNoteInlineTitle = value;
					await this.plugin.saveSettings();
					this.display();
				});
			});

		if (this.plugin.settings.shouldFormatDailyNoteInlineTitle) {
			new Setting(containerEl)
				.setName('Daily note inline title format')
				.setDesc('Moment format of the inline title')
				.addText(text => {
					text.setValue(this.plugin.settings.dailyNoteInlineTitleDateFormat);
					text.setPlaceholder(InlineTitleFormatter.FALLBACK_FORMAT)
					text.onChange(async (value) => {
						this.plugin.settings.dailyNoteInlineTitleDateFormat = value;
						await this.plugin.saveSettings();
					});
				});
		}
	}
}
