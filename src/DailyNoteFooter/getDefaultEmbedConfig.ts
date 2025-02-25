import {EmbedConfig} from "./types";

export default function getDefaultEmbedConfig(): EmbedConfig {
	return {
		title: '',
		filePath: '',
		pastDisplayMode: "show",
		presentDisplayMode: "show",
		futureDisplayMode: "show",
	}
}
