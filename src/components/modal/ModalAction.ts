import { createEventDispatcher } from 'svelte';

type EventDispatcher = (type: string, detail?: any) => void;

const modalEventTriggerKey = 'modal-trigger';

function handleModalTrigger() {
    console.log('modal trigger fired');
}

function dispatchModalTriggerEvent(dispatcher: EventDispatcher, originalEvent: Event) {
    dispatcher(modalEventTriggerKey, { originalEvent });
}

export function modalTrigger(node: Node, targetId?: string) {
    const dispatch: EventDispatcher = createEventDispatcher();

    const temp = () => console.log('hit');

    node.addEventListener('click', temp);

    return {
        destroy() {
            // ...cleanup goes here
            node.removeEventListener('click', temp);
        }
    };
}