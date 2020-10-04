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
  import MediaQuery from '../components/media-query/MediaQuery.svelte';
  import type { MediaQueryMap, MediaQueryMatchMap } from '../components/media-query/MediaQueryStore.d';
  import { ui } from '../resources/config.json';
  import { global } from '../resources/content.json';
  import Nav from '../partials/Nav.svelte';
  import SteakeyeMetaLinks from './_layout/SteakeyeMetaLinks.svelte';

  function unquoteMediaQueries(mediaQueryMap: MediaQueryMap) {
    const nestedStringTest = /^('|")(.+)\1$/;
    const updatedMap = {};

    for (let key in mediaQueryMap) {
      const query = mediaQueryMap[key];

      updatedMap[key] = nestedStringTest.test(query) ? JSON.parse(query.replace(nestedStringTest, `"$2"`)) : query;
    }

    return updatedMap;
  }

  const {
    layout: { mediaQueries },
  } = ui;
  const { title, metaData: { description }, partials: { footer: { copyright } } } = global;
  const year = new Date().getFullYear();
  const unquotedMediaQueries = unquoteMediaQueries(mediaQueries as MediaQueryMap);
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content="{description}" />
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
      {year}
    </p>
  </footer>
</MediaQuery>
