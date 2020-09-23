export type ModalTriggerAction = 'open' | 'close';

export interface ModalActions {
    open(): void;
    close(): void;
}