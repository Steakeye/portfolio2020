<style lang="scss">
  @use '../styles/colour';
  @use '../styles/type';
  @use '../styles/layout';

  .content {
    position: relative;
    padding: 2rem;
    //margin: 0 auto;
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
  import { ui } from '../resources/config.json';
  import content from '../resources/content.json';

  function unquoteMediaQueries(mediaQueryMap: { [key: string]: string }) {
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
  const { title, metaDescription } = content.global;
  const copyRightMessage = content.global.partials.footer.copyright;
  const year = new Date().getFullYear();
  const unquotedMediaQueries = unquoteMediaQueries(mediaQueries);
</script>

<script>
  import Nav from '../partials/Nav.svelte';
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content="{metaDescription}" />
</svelte:head>

<MediaQuery mediaQueries="{unquotedMediaQueries}">
  <header>
    <Nav />
  </header>

  <main class:content>
    <slot />
  </main>
  <footer>
    <p class="copyright">
      {@html copyRightMessage}
      {year}
    </p>
  </footer>
</MediaQuery>
