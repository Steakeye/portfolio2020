import { onMount } from 'svelte';
import { writable, readable } from 'svelte/store';
import type { MediaQueryMap, MediaQueryMatchMap, MediaQueryEventListener } from './MediaQueryStore.d';

function matchMedia(mediaQuery: string): MediaQueryList {
    return window.matchMedia(mediaQuery);
}

function addMediaQueryEventListener(queryList: MediaQueryList, listener: MediaQueryEventListener): MediaQueryList {
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

function setupMediaQueryListsAndListeners(
    mediaQueries: MediaQueryMap,
    mediaQueryChangeHandler: () => void,
    readableSetter: (matchMat: MediaQueryMatchMap) => void)
    : [string, MediaQueryList][] {
    const updatedMatchMap = {};

    const mediaQueryLists: [string, MediaQueryList][] = Object.entries(mediaQueries).map(([key, query]: [string, string]) => {
            const mediaQueryList = matchMedia(query);

            addMediaQueryEventListener(mediaQueryList, mediaQueryChangeHandler);

            updatedMatchMap[key] = mediaQueryList.matches;

            return [key, mediaQueryList];
        }
    );

    readableSetter(updatedMatchMap);

    return mediaQueryLists;
}

function determineInitialMatchMap(mediaQueries?: MediaQueryMap): MediaQueryMatchMap {
    const matchMap = {};

    if (mediaQueries) {
        Object.keys(mediaQueries).forEach(key => matchMap[key] = false);
    }

    return matchMap;
}

function tearDownMediaQueryLists(mediaQueryLists: [string, MediaQueryList][], mediaQueryChangeHandler: () => void) {
    removeMediaQueryEventListeners(mediaQueryLists, mediaQueryChangeHandler);
    if (mediaQueryLists) { mediaQueryLists.length = 0; }
}

export function initMediaQueryStore(mediaQueries?: MediaQueryMap) {
    let readableSetter: (matchMat: MediaQueryMatchMap) => void;
    let mounted = false;
    let mediaQueryLists: [string, MediaQueryList][];

    const matches = readable(determineInitialMatchMap(mediaQueries),
        (setter: (matchMat: MediaQueryMatchMap) => void) => {
        readableSetter = setter;

        //teardown
        return () => {
            //best to not leave this reference hanging around!
            readableSetter = null;
        }
    })
    const queries = writable(mediaQueries);

    function handleMediaQueryChange() {
        const updatedMatchMap = {};

        mediaQueryLists.forEach(([key, query]: [string, MediaQueryList]) => {
            updatedMatchMap[key] = query.matches;
        });

        readableSetter(updatedMatchMap);
    }

    onMount(() => {
        mounted = true;

        if (mediaQueries) {
            mediaQueryLists = setupMediaQueryListsAndListeners(mediaQueries, handleMediaQueryChange, readableSetter)
        }

        return () => {
            //teardown
            tearDownMediaQueryLists(mediaQueryLists, handleMediaQueryChange);
            mediaQueryLists = undefined;
        }
    })

    queries.subscribe((updatedMediaQuery: MediaQueryMap) => {
        if (mounted) {
            mediaQueryLists = setupMediaQueryListsAndListeners(updatedMediaQuery, handleMediaQueryChange, readableSetter)
        }
    }, () => {
        //Called when old value is being unset
        tearDownMediaQueryLists(mediaQueryLists, handleMediaQueryChange);
        mediaQueryLists = undefined;
    })

    return { subscribe: matches.subscribe, set: queries.set }
}