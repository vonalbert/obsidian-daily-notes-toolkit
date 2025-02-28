import {FileView} from "obsidian";
import {EmbedHTMLElementLayout} from "./types";

let idCounter = 0;

function getNextEmbedId() {
	return `dnt-footer-embeds-${++idCounter}`;
}

export function removeEmbedsFromView(view: FileView) {
	removeEmbedsInsideElement(view.containerEl);
}

export function removeEmbedsInsideElement(element: HTMLElement) {
	element.querySelectorAll('.dnt-footer-embeds')
		.forEach(element => element.parentElement?.removeChild(element));
}

export function ensureEmptyEmbedsContainerExistsInsideElement(element: HTMLElement): HTMLElement {
	let container = element.find('.dnt-footer-embeds');
	if (container instanceof HTMLElement) {
		container.innerHTML = '';
	} else {
		container = document.createElement('div');
		container.classList.add('dnt-footer-embeds');
		element.append(container);
	}

	// Force the container to stay before embedded-backlinks div if applicable
	const embeddedBacklinks = element.find('.embedded-backlinks');
	embeddedBacklinks?.parentElement?.insertBefore(container, embeddedBacklinks);

	return container;
}

export function createSingleEmbedLayout(collapsedByDefault: boolean): EmbedHTMLElementLayout {
	const embedId = getNextEmbedId();

	const container = document.createElement('div');
	container.id = embedId;
	container.classList.add('dnt-footer-embed');

	const title = document.createElement('div');
	title.classList.add('dnt-footer-embed-title');
	container.append(title);

	const content = document.createElement('div');
	content.classList.add('dnt-footer-embed-content');
	container.append(content);

	title.addEventListener('click', () => {
		const embedContainer = document.getElementById(embedId);
		if (embedContainer instanceof HTMLElement) {
			if (embedContainer.classList.contains('dnt-footer-embed-collapsed')) {
				embedContainer.classList.remove('dnt-footer-embed-collapsed');
			} else {
				embedContainer.classList.add('dnt-footer-embed-collapsed');
			}
		}
	});

	if (collapsedByDefault) {
		container.classList.add('dnt-footer-embed-collapsed');
	}

	return {
		container: container,
		title: title,
		content: content,
	};
}
