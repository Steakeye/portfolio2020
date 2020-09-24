import { onMount } from 'svelte';
import { writable, derived, readable } from 'svelte/store';
import type { MediaQueryMap, MediaQueryEventListener } from './MediaQueryStore.d';

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

export function initMediaQueryStore(mediaQueries?: MediaQueryMap) {
    const queries = writable(mediaQueries);

    let mounted = false;
    let mediaQueryLists: [string, MediaQueryList][];

    let matchers;
    /*const matchers = derived(queries, ($val) => {
        console.log('derived store', arguments);
        if (mounted) {
            debugger;
        } else {
            debugger;
        }
        return 'derived value';
    })*/

    function handleMediaQueryChange() {
        console.log('handleMediaQueryChange', arguments);
    }

    onMount(() => {
        mounted = true;
        console.log('calling on mount within a util!');
        console.log('window && window.matchMedia', window && window.matchMedia)

        if (mediaQueries) {
            /*mediaQueryLists = Object.entries(mediaQueries).map(([key, query]) => [key, matchMedia(query)]);
            console.log('mediaQueryLists', mediaQueryLists);*/
            matchers = derived(queries, queries => {
                removeMediaQueryEventListeners(mediaQueryLists, handleMediaQueryChange);

                debugger;
                mediaQueryLists = Object.entries(queries).map(([key, query]: [string, string]) => [key, addMediaQueryEventListener(matchMedia(query), handleMediaQueryChange)]);
            })
        }

        return () => {
            //teardown
            removeMediaQueryEventListeners(mediaQueryLists, handleMediaQueryChange);
        }
    })

    return { queries, get matchers() { return matchers } }
}