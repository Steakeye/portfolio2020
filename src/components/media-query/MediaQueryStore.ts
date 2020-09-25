import { onMount } from 'svelte';
import { writable, derived, readable } from 'svelte/store';
import type { MediaQueryMap, MediaQueryMatchMap, MediaQueryEventListener } from './MediaQueryStore.d';

/*export const time = writable(undefined, function start(set) {
    /*const interval = setInterval(() => {
        set(new Date());
    }, 1000);*\/

    return function stop() {
        clearInterval(interval);
    };
});*/

function matchMedia(mediaQuery: string): MediaQueryList {
    return window.matchMedia(mediaQuery);
}

function addMediaQueryEventListener(queryList: MediaQueryList, listener: MediaQueryEventListener): MediaQueryList {
    //return window.matchMedia(mediaQuery);
    queryList.addListener(listener);
    return  queryList;
}

function removeMediaQueryEventListeners(mediaQueryLists:  [string, MediaQueryList][], listener: MediaQueryEventListener) {
    if (mediaQueryLists) {
        mediaQueryLists.forEach(([, queryList]: [string, MediaQueryList]) => {
            //Using deprecated method because it has better compatibility
            queryList.removeListener(listener);
        })
    }
}

function determineInitialMatchMap(mediaQueries?: MediaQueryMap): MediaQueryMatchMap {
    const matchMap = {};

    if (mediaQueries) {
        Object.keys(mediaQueries).forEach(key => matchMap[key] = false);
    }

    return matchMap;
}

export function initMediaQueryStore(mediaQueries?: MediaQueryMap) {

    let readableSetter: (matchMat: MediaQueryMatchMap) => void;
    const initialMatchMap = determineInitialMatchMap(mediaQueries);

    const matches = readable(determineInitialMatchMap(mediaQueries), (setter: (matchMat: MediaQueryMatchMap) => void) => {
        readableSetter = setter;

        //teardown
        return () => {
            //best to not leave this reference hanging around!
            readableSetter = null;
        }
    })

    const queries = writable(mediaQueries);

    let mounted = false;
    let mediaQueryLists: [string, MediaQueryList][];

    let matchers;

    function handleMediaQueryChange() {
        console.log('handleMediaQueryChange', arguments);
        console.log('readableSetter', readableSetter);
    }

    onMount(() => {
        mounted = true;
        console.log('calling on mount within a util!');
        console.log('window && window.matchMedia', window && window.matchMedia)

        if (mediaQueries) {
            const updatedMatchMap = {};

            mediaQueryLists = Object.entries(mediaQueries).map(([key, query]: [string, string]) => {
                    const mediaQueryList = matchMedia(query);

                    addMediaQueryEventListener(mediaQueryList, handleMediaQueryChange);

                    updatedMatchMap[key] = mediaQueryList.matches;

                    return [key, addMediaQueryEventListener(matchMedia(query), handleMediaQueryChange)];
                }
            );

            readableSetter(updatedMatchMap)
        }

        return () => {
            //teardown
            removeMediaQueryEventListeners(mediaQueryLists, handleMediaQueryChange);
        }
    })

    //return { queries, get matchers() { return matchers } }
    return { subscribe: matches.subscribe, set: queries.set }
}