<script context="module">
  import content from '../resources/content.json'

  const{ title, metaDescription } = content.global;
  const copyRightMessage = content.global.partials.footer.copyright;
  const year = new Date().getFullYear();
</script>
<script>
  import Nav from '../partials/Nav.svelte'
</script>

<style>
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
    padding: .25rem .5rem;
    height: layout.$footer-height;
  }
</style>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={metaDescription}>
</svelte:head>

<header>
<Nav />
</header>

<main class:content>
  <slot />
</main>
<footer>
  <p>{@html copyRightMessage} {year}</p>
</footer>