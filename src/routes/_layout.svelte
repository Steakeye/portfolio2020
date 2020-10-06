<style lang="scss">
  @use '../styles/colour';
  @use '../styles/type';
  @use '../styles/layout';

  .content {
    position: relative;
    padding: 2rem;
    margin-bottom: 2rem;
    font-size: 2em;

    > :global(#{type.$headers}, p) {
      color: colour.$brand-white;
    }
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
  import { unquoteString } from '../utils/String.ts';
  import MediaQuery from '../components/media-query/MediaQuery.svelte';
  import type { MediaQueryMap, MediaQueryMatchMap } from '../components/media-query/MediaQueryStore.d';
  import { ui, appRootURL } from '../resources/config.json';
  import { global } from '../resources/content.json';
  import Nav from '../partials/Nav.svelte';
  import SteakeyeMetaLinks from './_layout/SteakeyeMetaLinks.svelte';
  import TwitterMetaData from './_layout/TwitterMetaData.svelte';

  import steakeyeRoundel from '../assets/images/steakeye-roundel.svg';
  import steakeyeRoundelPNG from '../assets/images/steakeye-roundel.png';

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
  } = global;
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
