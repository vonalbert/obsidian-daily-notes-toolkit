import {EmbedConfig} from "../DailyNoteFooter/types";

export interface DailyNotesToolkitSettings {
	replaceOriginalDailyNoteNavigationCommands: boolean;
	silentlyCreateDailyNoteFile: boolean;
	shouldFormatDailyNoteInlineTitle: boolean,
	dailyNoteInlineTitleDateFormat: string;
	dailyNotesEmbeds: EmbedConfig[],
}

export const DEFAULT_SETTINGS: DailyNotesToolkitSettings = {
	replaceOriginalDailyNoteNavigationCommands: false,
	silentlyCreateDailyNoteFile: false,
	shouldFormatDailyNoteInlineTitle: false,
	dailyNoteInlineTitleDateFormat: "",
	dailyNotesEmbeds: [],
}
