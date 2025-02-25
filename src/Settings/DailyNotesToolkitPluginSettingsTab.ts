import {App, Modal, PluginSettingTab, Setting} from "obsidian";
import getDefaultEmbedConfig from "../DailyNoteFooter/getDefaultEmbedConfig";
import {EmbedConfig, EmbedDisplayMode} from "../DailyNoteFooter/types";
import InlineTitleFormatter from "../InlineTitle/InlineTitleFormatter";
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
				.addMomentFormat(text => {
					text.setValue(this.plugin.settings.dailyNoteInlineTitleDateFormat);
					text.setDefaultFormat(InlineTitleFormatter.FALLBACK_FORMAT)
					text.onChange(async (value) => {
						this.plugin.settings.dailyNoteInlineTitleDateFormat = value;
						await this.plugin.saveSettings();
					});
				});
		}

		new Setting(containerEl)
			.setHeading()
			.setName('Embed other notes inside other notes (like Logseq\'s journal queries)')
			.addButton(btn => {
				btn.setButtonText('Add');
				btn.onClick(async () => {
					this.plugin.settings.dailyNotesEmbeds.push(getDefaultEmbedConfig());
					await this.plugin.saveSettings();
					this.display();

					const index = this.plugin.settings.dailyNotesEmbeds.length - 1;
					const embedConfig = this.plugin.settings.dailyNotesEmbeds[index];

					const modal = new EmbedDisplayModeModal(this.app, this.plugin, embedConfig, index, () => {
						this.display();
					});

					modal.open();
				});
			})
		;

		this.plugin.settings.dailyNotesEmbeds.forEach((embedConfig, index) => {
			new Setting(containerEl)
				.setName(embedConfig.title)
				.setDesc(`Embeds file ${embedConfig.filePath}`)
				.addExtraButton(cb => {
					cb.setIcon('edit');
					cb.onClick(() => {
						const modal = new EmbedDisplayModeModal(this.app, this.plugin, embedConfig, index, () => {
							this.display();
						});

						modal.open();
					});
				})
				.addExtraButton(cb => {
					cb.setIcon('arrow-up');
					cb.disabled = index === 0;
					cb.onClick(async () => {
						const element = this.plugin.settings.dailyNotesEmbeds.splice(index, 1)[0];
						this.plugin.settings.dailyNotesEmbeds.splice(index-1, 0, element);
						await this.plugin.saveSettings();
						this.display();
					});
				})
				.addExtraButton(cb => {
					cb.setIcon('arrow-down');
					cb.disabled = index === this.plugin.settings.dailyNotesEmbeds.length - 1;
					cb.onClick(async () => {
						const element = this.plugin.settings.dailyNotesEmbeds.splice(index, 1)[0];
						this.plugin.settings.dailyNotesEmbeds.splice(index+1, 0, element);
						await this.plugin.saveSettings();
						this.display();
					});
				})
				.addExtraButton(cb => {
					cb.setIcon('trash');
					cb.onClick(async () => {
						if (confirm(`Do you really want to remove embed "${embedConfig.title}"?`)) {
							this.plugin.settings.dailyNotesEmbeds.splice(index, 1);
							await this.plugin.saveSettings();
							this.display();
						}
					});
				})
			;
		});
	}
}

class EmbedDisplayModeModal extends Modal {
	constructor(app: App, private readonly plugin: DailyNotesToolkitPlugin, embedConfig: EmbedConfig, index: number, private readonly onCloseCallback) {
		super(app);

		this.titleEl.textContent = `Edit embed: ${embedConfig.title}`;

		new Setting(this.contentEl)
			.setName('Title')
			.addText(text => {
				text.setValue(embedConfig.title);
				text.onChange(async (value) => {
					this.plugin.settings.dailyNotesEmbeds[index].title = value;
					await this.plugin.saveSettings();
				});
			});

		new Setting(this.contentEl)
			.setName('File path')
			.addText(text => {
				text.setPlaceholder('File');
				text.setValue(embedConfig.filePath);
				text.onChange(async (value) => {
					this.plugin.settings.dailyNotesEmbeds[index].filePath = value;
					await this.plugin.saveSettings();
				});
			});

		new Setting(this.contentEl)
			.setName('On past daily notes')
			.addDropdown(dropdown => {
				dropdown.addOption('show', 'Show');
				dropdown.addOption('show-collapsed', 'Collapse');
				dropdown.addOption('hide', 'Hide');
				dropdown.setValue(embedConfig.pastDisplayMode);
				dropdown.onChange(async (value: EmbedDisplayMode) => {
					this.plugin.settings.dailyNotesEmbeds[index].pastDisplayMode = value;
					await this.plugin.saveSettings();
				});
			});

		new Setting(this.contentEl)
			.setName('On today daily note')
			.addDropdown(dropdown => {
				dropdown.addOption('show', 'Show');
				dropdown.addOption('show-collapsed', 'Collapse');
				dropdown.addOption('hide', 'Hide');
				dropdown.setValue(embedConfig.presentDisplayMode);
				dropdown.onChange(async (value: EmbedDisplayMode) => {
					this.plugin.settings.dailyNotesEmbeds[index].presentDisplayMode = value;
					await this.plugin.saveSettings();
				});
			});

		new Setting(this.contentEl)
			.setName('On future daily notes')
			.addDropdown(dropdown => {
				dropdown.addOption('show', 'Show');
				dropdown.addOption('show-collapsed', 'Collapse');
				dropdown.addOption('hide', 'Hide');
				dropdown.setValue(embedConfig.futureDisplayMode);
				dropdown.onChange(async (value: EmbedDisplayMode) => {
					this.plugin.settings.dailyNotesEmbeds[index].futureDisplayMode = value;
					await this.plugin.saveSettings();
				});
			});
	}

	public onClose() {
		this.onCloseCallback();
	}
}
