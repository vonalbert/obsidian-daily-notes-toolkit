import {Moment} from "moment/moment";
import {FileView, WorkspaceLeaf} from "obsidian";
import {getDateFromFile} from "obsidian-daily-notes-interface";

export default class InlineTitleFormatter {
	private static readonly CLASS_NAME = "dnt-formatted-inline-title";
	public static readonly FALLBACK_FORMAT = "DD/MM/YYYY";

	constructor(
		public enabled: boolean,
		public momentFormat: string,
	) {
	}

	public formatInlineTitle(leaf: WorkspaceLeaf) {
		const view = leaf.view;
		const container = view.containerEl;

		if (!this.enabled) {
			this.restoreOriginalInlineTitle(container);
			return;
		}

		if (!(view instanceof FileView)) {
			this.restoreOriginalInlineTitle(container);
			return;
		}

		if (!view.file) {
			this.restoreOriginalInlineTitle(container);
			return;
		}

		const date = getDateFromFile(view.file, "day");
		if (!date) {
			this.restoreOriginalInlineTitle(container);
			return;
		}

		this.formatInlineTitleAsDate(container, date);
	}

	private formatInlineTitleAsDate(container: HTMLElement, date: Moment) {
		let formattedTitleContainer: HTMLElement|null = container.querySelector(`.${InlineTitleFormatter.CLASS_NAME}`);
		const inlineTitle: HTMLElement|null = container.querySelector('.inline-title');

		if (!formattedTitleContainer) {
			formattedTitleContainer = document.createElement('h1');
			formattedTitleContainer.classList.add(InlineTitleFormatter.CLASS_NAME);
		}

		formattedTitleContainer.textContent = date.format(this.momentFormat || InlineTitleFormatter.FALLBACK_FORMAT);

		if (inlineTitle) {
			inlineTitle.style.display = 'none';
		}

		inlineTitle?.parentElement?.prepend(formattedTitleContainer);
	}

	private restoreOriginalInlineTitle(container: HTMLElement) {
		container.querySelectorAll(`.${InlineTitleFormatter.CLASS_NAME}`).forEach((element: HTMLElement) => {
			element.parentElement?.removeChild(element);
		});

		const inlineTitle: HTMLElement|null = container.querySelector('.inline-title');
		if (inlineTitle) {
			inlineTitle.style.display = '';
		}
	}
}
