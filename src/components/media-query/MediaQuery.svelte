<script context="module">
    import { getContext, setContext } from 'svelte';
    import type { MediaQueryMatchMap } from './MediaQueryStore.d';
    import { initMediaQueryStore } from './MediaQueryStore.ts';

    export const contextKey = 'mediaQueries';

    export function getMediaQueryContext(): SvelteStore<MediaQueryMatchMap> {
        return getContext(contextKey)
    }
</script>
<script lang="ts">
    export let mediaQueries: { [key: string]: string } | undefined = undefined;

    if (!mediaQueries) {
        console.warn('No media queries passed to MediaQuery Component')
    }

    let mediaQueryStore;

    $: {
        if (!mediaQueryStore) {
            mediaQueryStore = initMediaQueryStore(mediaQueries);
        } else {
            mediaQueryStore.set(mediaQueries)
        }

        //Pass down the matches as read only for the context
        setContext(contextKey, { subscribe: mediaQueryStore.subscribe });
    }
</script>
<slot matches={$mediaQueryStore} />