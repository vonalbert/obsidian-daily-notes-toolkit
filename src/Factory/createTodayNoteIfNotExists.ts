import {moment} from "obsidian";
import {createDailyNote, getAllDailyNotes, getDailyNote} from "obsidian-daily-notes-interface";

export default async function createTodayNoteIfNotExists() {
	const today = moment();
	const all = getAllDailyNotes();

	if (!getDailyNote(today, all)) {
		await createDailyNote(today);
	}
}
