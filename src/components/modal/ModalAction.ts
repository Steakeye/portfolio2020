import { createEventDispatcher } from 'svelte';
import type { ModalActions, ModalTriggerAction } from './Modal.d';

type EventDispatcher = (type: string, detail?: any) => void;

export const ModalsActions: Map<string, ModalActions> = new Map();

const modalEventTriggerKey = 'modal-trigger';
const modalTriggerIdNodeAttribute = 'data-modal-trigger-id';

function handleModalTrigger(mapKey: string, action: ModalTriggerAction) {
  const actions = ModalsActions.get(mapKey);

  if (actions) {
    actions[action]();
  } else {
    console.error(`Modal actions not found for targetId: ${mapKey}`);
  }
}

function dispatchModalTriggerEvent(dispatcher: EventDispatcher, originalEvent: Event) {
  dispatcher(modalEventTriggerKey, { originalEvent });
}

const hrefErrorMessageNotFound = 'Tried to find targetId on href but no valid href was found.';
const hrefErrorMessageHelp = '\'href\' must start with \'#\' and contain at least one more character.';
const hrefErrorMessage = `${hrefErrorMessageNotFound} ${hrefErrorMessageHelp}`;

function tryToGetTargetIdFromHref(node: Node): string | undefined {
  // Could use hash property but would return true for external urls too.
  const href = (node as HTMLAnchorElement).getAttribute('href');
  let targetId;

  if (href && href.length > 1 && href.startsWith('#')) {
    targetId = href.slice(1);
  } else {
    console.error(hrefErrorMessage);
  }

  return targetId;
}

function determineTargetKey(node: Node, targetId?: string) {
  const targetKey = targetId || (node as HTMLElement).dataset.modalTargetId || tryToGetTargetIdFromHref(node);

  if (!targetKey) {
    /* eslint-disable-next-line max-len */
    throw new Error('No explicit targetId parameter passed, nor \'data-modal-target-id\' attribute set, nor valid \'href\'.');
  }

  return targetKey;
}

export function modalTrigger(node: Node, action: ModalTriggerAction = 'open', targetId?: string) {
  const dispatch: EventDispatcher = createEventDispatcher();
  const targetKey = determineTargetKey(node, targetId);

  const handler = (event: Event) => {
    handleModalTrigger(targetKey, action);
    dispatchModalTriggerEvent(dispatch, event);
  };

  node.addEventListener('click', handler);

  return {
    destroy() {
      node.removeEventListener('click', handler);
    },
  };
}
