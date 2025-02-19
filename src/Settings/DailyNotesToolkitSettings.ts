export interface DailyNotesToolkitSettings {
	replaceOriginalDailyNoteNavigationCommands: boolean;
	silentlyCreateDailyNoteFile: boolean;
}

export const DEFAULT_SETTINGS: DailyNotesToolkitSettings = {
	replaceOriginalDailyNoteNavigationCommands: false,
	silentlyCreateDailyNoteFile: false,
}
