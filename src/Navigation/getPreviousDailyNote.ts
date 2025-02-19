import {Moment} from "moment";
import {TFile} from "obsidian";
import {getAllDailyNotes, getDateUID} from "obsidian-daily-notes-interface";

export default function getPreviousDailyNote(date: Moment): TFile|null {
	const currentDate = getDateUID(date, "day");

	let previousDate: string|null = null;
	let previousFile: TFile|null = null;

	Object.entries(getAllDailyNotes()).forEach(([date, file]) => {
		if (date < currentDate && (!previousDate || date > previousDate)) {
			previousDate = date;
			previousFile = file;
		}
	});

	return previousFile;
}
