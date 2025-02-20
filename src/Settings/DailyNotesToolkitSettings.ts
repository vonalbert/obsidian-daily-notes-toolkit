export interface DailyNotesToolkitSettings {
	replaceOriginalDailyNoteNavigationCommands: boolean;
	silentlyCreateDailyNoteFile: boolean;
	shouldFormatDailyNoteInlineTitle: boolean,
	dailyNoteInlineTitleDateFormat: string;
}

export const DEFAULT_SETTINGS: DailyNotesToolkitSettings = {
	replaceOriginalDailyNoteNavigationCommands: false,
	silentlyCreateDailyNoteFile: false,
	shouldFormatDailyNoteInlineTitle: false,
	dailyNoteInlineTitleDateFormat: "",
}
