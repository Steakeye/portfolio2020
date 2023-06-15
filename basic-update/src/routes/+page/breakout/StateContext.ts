import { getContext, setContext } from 'svelte';
import { writable, type Writable } from 'svelte/store';
import { State } from './State';

export const contextKey = `breakout:gameState`;

let initialised = false;
//const initialState = State.UNINITIALIZED;

export function init(): void {
  if (!initialised) {
    initialised = true;
    const stateStore = writable<State>(State.UNINITIALIZED);

    setContext<Writable<State>>(contextKey, stateStore);
  }
}

export function context(state?: State): Writable<State> {
  if (state !== undefined) {
    //setContext(contextKey, state);
    (getContext(contextKey) as Writable<State>).set(state);
  }

  return getContext(contextKey);
}
