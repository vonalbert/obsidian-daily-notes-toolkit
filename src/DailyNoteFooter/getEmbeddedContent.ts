import {Moment} from "moment";
import {EmbedConfig} from "./types";

export default async function getEmbeddedContent(date: Moment, embedConfig: EmbedConfig): Promise<string> {
	const fileToEmbed = this.app.vault.getFileByPath(embedConfig.filePath);

	if (!fileToEmbed) {
		return `**Embedded file ${embedConfig.filePath} was not found**`;
	}

	const dateIso = date.format('YYYY-MM-DD');
	const fileContent = await this.app.vault.read(fileToEmbed);
	return fileContent.replace(/\{\{\s*date\s*}}/gi, dateIso);
}
