<script context="module">
    import { onMount } from 'svelte';
    import { initMediaQueryStore } from './MediaQueryStore.ts';
</script>
<script>
    export let mediaQueries: { [key: string]: string } | undefined;

    let mounted = false;
    let mediaQueryLists: MediaQueryList; // = MediaQueriesValues.map(q => window.matchMedia(q));
    //let matchers = {};
    //let mediaQueryStore;
    let mediaQueryStore = initMediaQueryStore(mediaQueries);

    const { queries, matchers } = mediaQueryStore;

    console.log('mediaQueries', mediaQueries);
    console.log('$queries ', $queries);

    onMount(() => {
        mounted = true;

        console.log('MediaQuery onMount')

        if (!mediaQueries) {
            console.error('No media queries passed to MediaQuery Component')
        }

        console.log('mediaQueryStore', $mediaQueryStore)

        //mediaQueryStore.set({ duff: 'next query' });

        setTimeout(() => {
            console.log('mediaQueryStore after being changed', $mediaQueryStore)
        }, 0);

        return () => {
            //teardown
        }
    });

    $: console.log('mediaQueryStore listener', mediaQueryStore)
</script>
<slot {matchers} />