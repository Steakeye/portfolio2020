import { getContext, setContext } from 'svelte';
import { State } from './State';

export const contextKey = 'breakout:gameState';

let initialised = false;
const initialState = State.UNINITIALIZED;

export function init(): void {
  if (!initialised) {
    initialised = true;

    setContext<State>(contextKey, initialState);
  }
}

export function context(state?: State): State {
  if (state !== undefined) {
    setContext(contextKey, state);
  }

  return getContext(contextKey);
}
