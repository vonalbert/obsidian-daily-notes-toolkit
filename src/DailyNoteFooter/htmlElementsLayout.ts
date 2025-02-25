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
		.forEach(element => element.parentElement.removeChild(element));
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
	if (embeddedBacklinks) {
		embeddedBacklinks.parentElement.insertBefore(container, embeddedBacklinks);
	}

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
		const embedContent = document.querySelector(`#${embedId} > .dnt-footer-embed-content`);
		if (embedContent instanceof HTMLElement) {
			embedContent.style.display = embedContent.style.display === 'none' ? '' : 'none';
		}
	});

	if (collapsedByDefault) {
		content.style.display = 'none';
	}

	return {
		container: container,
		title: title,
		content: content,
	};
}
