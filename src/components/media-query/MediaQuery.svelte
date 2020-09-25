<script context="module">
    import { onMount, getContext, setContext } from 'svelte';
    import { initMediaQueryStore } from './MediaQueryStore.ts';

    export const contextKey = 'mediaQueries';

    export function getMediaQueryContext() {
        return getContext(contextKey)
    }
</script>
<script>
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
<!--slot matches={mediaQueryStore ? $mediaQueryStore: {}} /-->
<slot matches={$mediaQueryStore} />