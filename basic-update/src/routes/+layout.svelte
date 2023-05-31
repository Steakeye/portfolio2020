<style lang="scss">
    @use '$lib/styles/colour';
    @use '$lib/styles/type';
    @use '$lib/styles/layout';

    @import "$lib/styles/global";

    .content {
        flex: 1;
        display: flex;
        flex-direction: column;
        position: relative;
        padding: 2rem;
        margin-bottom: 2rem;
        font-size: 2em;
    }

    @function contextualisedHeader($context)
    {
      $result: ();
      @each $size in type.$headers {
        $result: append($result, $context + ' > ' + #{$size}, 'comma');
      }

      @return $result
    }

    :global(#{contextualisedHeader('.content')}, .content > p) {
      color: colour.$brand-white;
    }

    header {
        position: sticky;
        top: layout.$navMarginTopRem;
        z-index: 5;
    }

    footer {
        position: fixed;
        bottom: 0;
        width: 100vw;
        background-color: colour.$brand-black;
        color: colour.$brand-white;
        font-size: 1.2rem;
        padding: 0.25rem 0.5rem;
        height: layout.$footer-height;

        .copyright {
            line-height: 1.62;
        }
    }
</style>
<script context="module" lang="ts">
    import SvelteSEO from 'svelte-seo';
    import { unquoteString } from '$lib/utils/String.ts';
    import MediaQuery from '$lib/components/media-query/MediaQuery.svelte';
    import { type MediaQueryMap, type MediaQueryMatchMap } from '$lib/components/media-query/MediaQueryStore.d';
    import { ui, appRootURL } from '$lib/resources/config.json';
    import { siteWide } from '$lib/resources/content.json';
    import SteakeyeMetaLinks from "./+layout/SteakeyeMetaLinks.svelte";
    import TwitterMetaData from "./+layout/TwitterMetaData.svelte";
    import Nav from "./+layout/Nav.svelte";

    import steakeyeRoundel from '$lib/assets/images/steakeye-roundel.svg';
    import steakeyeRoundelPNG from '$lib/assets/images/steakeye-roundel.png';

    function unquoteMediaQueries(mediaQueryMap: MediaQueryMap) {
        const updatedMap = {};

        for (let key in mediaQueryMap) {
            const query = mediaQueryMap[key];

            updatedMap[key] = unquoteString(query);
        }

        return updatedMap;
    }

    const {
        layout: { mediaQueries },
        metaData,
    } = ui;
    const {
        twitter: { cardType: twitterCardType, userName: twitterAccount },
    } = metaData;
    const {
        title,
        metaData: {
            description,
            openGraph: { imageAlt },
        },
        partials: {
            footer: { copyright },
        },
    } = siteWide;
    const startYear = 2020;
    const year = new Date().getFullYear();
    const copyRightYears = year > startYear ? `${startYear} - ${year}` : year;
    const unquotedMediaQueries = unquoteMediaQueries(mediaQueries as MediaQueryMap);
    const url = unquoteString(appRootURL);
    const twitterUserName = unquoteString(twitterAccount);
</script>
<SvelteSEO
        {title}
        {description}
        openGraph="{{ title, description, url, type: 'website', images: [{ url: steakeyeRoundel, width: 512, height: 512, alt: imageAlt }] }}"
/>
<svelte:head>
    <TwitterMetaData
            {title}
            {description}
            card="{twitterCardType}"
            site="{twitterUserName}"
            creator="{twitterUserName}"
            image="{steakeyeRoundelPNG}"
            {imageAlt}
    />
    <SteakeyeMetaLinks />
</svelte:head>
<MediaQuery mediaQueries="{unquotedMediaQueries}">
    <header>
        <Nav />
    </header>
    <main class="content">
        <slot />
    </main>
    <footer>
        <p class="copyright">
            {@html copyright}
            {copyRightYears}
        </p>
    </footer>
</MediaQuery>