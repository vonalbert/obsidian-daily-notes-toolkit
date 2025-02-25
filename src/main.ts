import {Notice, Plugin} from 'obsidian';
import {appHasDailyNotesPluginLoaded} from "obsidian-daily-notes-interface";
import FooterEmbedsRenderer from "./DailyNoteFooter/FooterEmbedsRenderer";
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
	private footerQueriesRenderer = new FooterEmbedsRenderer(this.app);

	async onload() {
		await this.loadSettings();

		if (!appHasDailyNotesPluginLoaded()) {
			new Notice(`obsidian-daily-notes-toolkit plugin requires core daily-notes plugin to be enabled to work.`)
			return;
		}

		this.initComponentsFromSettings();

		this.app.workspace.onLayoutReady(() => {
			if (this.settings.silentlyCreateDailyNoteFile) {
				createTodayNoteIfNotExists()
			}

			this.rerenderComponents();
			this.registerEvent(
				this.app.workspace.on('layout-change', () => {
					this.rerenderComponents();
				})
			);
		});

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
		this.rerenderComponents();
	}

	private initComponentsFromSettings() {
		if (this.settings.replaceOriginalDailyNoteNavigationCommands) {
			this.navigationCommandsReplacer.replace();
		} else {
			this.navigationCommandsReplacer.restore();
		}

		this.inlineTitleFormatter.enabled = this.settings.shouldFormatDailyNoteInlineTitle;
		this.inlineTitleFormatter.momentFormat = this.settings.dailyNoteInlineTitleDateFormat;

		this.footerQueriesRenderer.setEmbeds(this.settings.dailyNotesEmbeds);
	}

	private rerenderComponents() {
		this.app.workspace.getLeavesOfType("markdown").forEach(leaf => {
			this.inlineTitleFormatter.formatInlineTitle(leaf);
			this.footerQueriesRenderer.renderFooterEmbedsInLeaf(leaf);
		});
	}
}
