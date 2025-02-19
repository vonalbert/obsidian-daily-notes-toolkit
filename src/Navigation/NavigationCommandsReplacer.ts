import {App, Command, Notice} from "obsidian";
import {getDateFromFile} from "obsidian-daily-notes-interface";
import getNextDailyNote from "./getNextDailyNote";
import getPreviousDailyNote from "./getPreviousDailyNote";

export default class NavigationCommandsReplacer {
	private originalNextDailyNoteCommandCheckCallback?: (checking: boolean) => boolean | void;
	private originalPrevDailyNoteCommandCheckCallback?: (checking: boolean) => boolean | void;

	constructor(private readonly app: App) {
	}

	public isReplacing() {
		return this.originalNextDailyNoteCommandCheckCallback || this.originalPrevDailyNoteCommandCheckCallback;
	}

	public replace() {
		if (this.isReplacing()) {
			this.doRestore();
		}

		// @ts-ignore
		const prevCommand = this.app?.commands?.commands?.['daily-notes:goto-prev'] as Command;
		// @ts-ignore
		const nextCommand = this.app?.commands?.commands?.['daily-notes:goto-next'] as Command;

		this.originalPrevDailyNoteCommandCheckCallback = prevCommand.checkCallback;
		this.originalNextDailyNoteCommandCheckCallback = nextCommand.checkCallback;

		prevCommand.checkCallback  = (checking: boolean) => this.doExecuteCheckCallback(checking, true);
		nextCommand.checkCallback  = (checking: boolean) => this.doExecuteCheckCallback(checking, false);
	}

	public restore() {
		if (this.isReplacing()) {
			this.doRestore();
		}
	}

	private doRestore() {
		// @ts-ignore
		const prevCommand = this.app?.commands?.commands?.['daily-notes:goto-prev'] as Command;
		// @ts-ignore
		const nextCommand = this.app?.commands?.commands?.['daily-notes:goto-next'] as Command;
		prevCommand.checkCallback = this.originalPrevDailyNoteCommandCheckCallback;
		nextCommand.checkCallback = this.originalNextDailyNoteCommandCheckCallback;
	}

	private doExecuteCheckCallback(checking: boolean, previous: boolean): boolean|void {
		const file = this.app.workspace.getActiveFile();
		if (!file) {
			return false;
		}

		const fileDate = getDateFromFile(file, "day");
		if (!fileDate) {
			return false;
		}

		if (checking) {
			return true;
		}

		const previousFile = previous ? getPreviousDailyNote(fileDate) : getNextDailyNote(fileDate);

		if (!previousFile) {
			new Notice(`Nessuna nota del giorno ${previous ? 'precedente' : 'successiva'} trovata.`);
			return;
		}

		this.app.workspace.getLeaf().openFile(previousFile);
	}
}
