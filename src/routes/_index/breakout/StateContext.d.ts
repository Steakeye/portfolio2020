import type { State } from './State.ts'

export interface BreakoutStateContext {
    getState(): State;
    setState(updatedState: State): void;
}