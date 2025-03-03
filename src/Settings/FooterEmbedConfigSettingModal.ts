import {App, Modal, Setting} from "obsidian";
import {EmbedConfig, EmbedDisplayMode} from "../FooterEmbeds/types";
import DailyNotesToolkitPlugin from "../main";

export default class FooterEmbedConfigSettingModal extends Modal {
    constructor(
		app: App,
		private readonly plugin: DailyNotesToolkitPlugin,
		embedConfig: EmbedConfig,
		index: number,
		private readonly onCloseCallback: () => any
	) {
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

        new Setting(this.contentEl)
            .setName('Use daily note source path')
			.setDesc('If set to true, the embedded note will treat the daily note as the current file; otherwise, it will reference itself as the current file. This also applies to properties.')
			.addToggle(toggle => {
				toggle.setValue(embedConfig.useDailyNoteSourcePath || false);
				toggle.onChange(async (value) => {
					this.plugin.settings.dailyNotesEmbeds[index].useDailyNoteSourcePath = value;
					await this.plugin.saveSettings();
				})
			})
    }

    public onClose() {
        this.onCloseCallback();
    }
}
