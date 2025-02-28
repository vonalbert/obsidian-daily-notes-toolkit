export type EmbedDisplayMode = "show"|"hide"|"show-collapsed";

export interface EmbedConfig {
	title: string,
	filePath: string,
	pastDisplayMode: EmbedDisplayMode,
	presentDisplayMode: EmbedDisplayMode,
	futureDisplayMode: EmbedDisplayMode,
	useDailyNoteSourcePath?: boolean,
}

export interface EmbedHTMLElementLayout {
	container: HTMLElement,
	title: HTMLElement,
	content: HTMLElement,
}
