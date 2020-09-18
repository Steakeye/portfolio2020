<script context="module">
  import content from '../resources/content.json'

  const siteTitle = content.global.title;
  const copyRightMessage = content.global.partials.footer.copyright;
  const year = new Date().getFullYear();
</script>
<script>
  import Nav from '../components/Nav.svelte'
</script>

<style>
  @use '../styles/colour';
  @use '../styles/type';

  .content {
    position: relative;
    padding: 2rem;
    margin: 0 auto;
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
  }
</style>

<svelte:head>
  <title>{siteTitle}</title>
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