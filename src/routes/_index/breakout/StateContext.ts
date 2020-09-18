import { getContext, setContext } from 'svelte';
//import type { BreakoutStateContext } from './StateContext.d'
import { State } from './State'

export const contextKey = 'breakout:gameState';

let initialised = false;
let initialState = State.UNINITIALIZED;

export function init(): void {
    if (!initialised) {
        initialised = true;
/*
        setContext<BreakoutStateContext>(contextKey, {
            getState() { return initialState },
            setState(updatedState: State) { return initialState = updatedState },
        });*/
        setContext<State>(contextKey, initialState);
    }
}

export function context(state?: State): State {
    if (state !== undefined) {
        setContext(contextKey, state)
    }

    return getContext(contextKey);
}