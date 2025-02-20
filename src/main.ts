import {Plugin} from 'obsidian';
import {appHasDailyNotesPluginLoaded} from "obsidian-daily-notes-interface";
import createTodayNoteIfNotExists from "./Factory/createTodayNoteIfNotExists";
import InlineTitleFormatter from "./InlineTitle/InlineTitleFormatter";
import NavigationCommandsReplacer from "./Navigation/NavigationCommandsReplacer";
import DailyNotesToolkitPluginSettingsTab from "./Settings/DailyNotesToolkitPluginSettingsTab";
import {DailyNotesToolkitSettings, DEFAULT_SETTINGS} from "./Settings/DailyNotesToolkitSettings";

export default class DailyNotesToolkitPlugin extends Plugin {
	settings: DailyNotesToolkitSettings;
	private navigationCommandsReplacer = new NavigationCommandsReplacer(this.app);
	private inlineTitleFormatter = new InlineTitleFormatter(
		DEFAULT_SETTINGS.shouldFormatDailyNoteInlineTitle,
		DEFAULT_SETTINGS.dailyNoteInlineTitleDateFormat,
	);

	async onload() {
		await this.loadSettings();

		if (!appHasDailyNotesPluginLoaded()) {
			console.error(`Daily Notes Toolkit: this plugin requires core daily-notes plugin to be enabled.`)
			return;
		}

		this.initComponentsFromSettings();

		if (this.settings.silentlyCreateDailyNoteFile) {
			this.app.workspace.onLayoutReady(() => createTodayNoteIfNotExists());
		}

		this.registerEvent(
			this.app.workspace.on('layout-change', () => {
				this.app.workspace.getLeavesOfType("markdown").forEach(leaf => this.inlineTitleFormatter.formatInlineTitle(leaf));
			})
		);

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

		this.initComponentsFromSettings();
	}

	private initComponentsFromSettings() {
		if (this.settings.replaceOriginalDailyNoteNavigationCommands) {
			this.navigationCommandsReplacer.replace();
		} else {
			this.navigationCommandsReplacer.restore();
		}

		this.inlineTitleFormatter.enabled = this.settings.shouldFormatDailyNoteInlineTitle;
		this.inlineTitleFormatter.momentFormat = this.settings.dailyNoteInlineTitleDateFormat;
	}
}
