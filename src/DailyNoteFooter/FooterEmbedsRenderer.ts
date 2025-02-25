import {App, FileView, MarkdownRenderer, moment, WorkspaceLeaf} from "obsidian";
import {getDateFromFile} from "obsidian-daily-notes-interface";
import getEmbeddedContent from "./getEmbeddedContent";
import {
	createSingleEmbedLayout,
	ensureEmptyEmbedsContainerExistsInsideElement,
	removeEmbedsInsideElement
} from "./htmlElementsLayout";
import {EmbedConfig, EmbedDisplayMode} from "./types";

export default class FooterEmbedsRenderer {
	private embeds: EmbedConfig[] = [];

	constructor(
		private readonly app: App,
	) {
	}

	public setEmbeds(embeds: EmbedConfig[]) {
		this.embeds = [...embeds];
	}

	public async renderFooterEmbedsInLeaf(leaf: WorkspaceLeaf) {
		const view = leaf.view;

		if (!(view instanceof FileView)) {
			return;
		}

		let viewWrapper: HTMLElement;
		let footerElement: HTMLElement|null;

		const viewState = view.getState();
		if (viewState?.mode === "preview") {
			viewWrapper = view.containerEl.find('.markdown-reading-view');
			footerElement = viewWrapper.find('.mod-footer');
		} else {
			viewWrapper = view.containerEl.find('.markdown-source-view');
			footerElement = viewWrapper.find('.cm-contentContainer')?.parentElement || null;
		}

		if (!footerElement) {
			removeEmbedsInsideElement(viewWrapper);
			return;
		}

		if (!view.file) {
			removeEmbedsInsideElement(viewWrapper);
			return;
		}

		const dailyNoteDate = getDateFromFile(view.file, "day");
		if (!dailyNoteDate) {
			removeEmbedsInsideElement(viewWrapper);
			return;
		}

		const today = moment().startOf("day");
		const isPast = dailyNoteDate.isBefore(today);
		const isFuture = dailyNoteDate.isAfter(today);

		const container = ensureEmptyEmbedsContainerExistsInsideElement(footerElement);

		for (const embed of this.embeds) {
			let displayMode: EmbedDisplayMode;
			if (isPast) {
				displayMode = embed.pastDisplayMode;
			} else if (isFuture) {
				displayMode = embed.futureDisplayMode;
			} else {
				displayMode = embed.presentDisplayMode;
			}

			if (displayMode === "hide") {
				continue;
			}

			const embedLayout = createSingleEmbedLayout(displayMode === "show-collapsed");
			embedLayout.title.textContent = embed.title;
			container.append(embedLayout.container);

			const content = await getEmbeddedContent(dailyNoteDate, embed);
			await MarkdownRenderer.render(this.app, content, embedLayout.content, view.file.path, view);
		}
	}
}
