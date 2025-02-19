import {Moment} from "moment";
import {TFile} from "obsidian";
import {getAllDailyNotes, getDateUID} from "obsidian-daily-notes-interface";

export default function getNextDailyNote(date: Moment): TFile|null {
	const currentDate = getDateUID(date, "day");

	let nextDate: string|null = null;
	let nextFile: TFile|null = null;

	Object.entries(getAllDailyNotes()).forEach(([date, file]) => {
		if (date > currentDate && (!nextDate || date < nextDate)) {
			nextDate = date;
			nextFile = file;
		}
	});

	return nextFile;
}
