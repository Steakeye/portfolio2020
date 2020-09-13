<script context="module">
  import content from '../resources/content.json'

  const copyRightMessage = content.global.partials.footer.copyright;
  const year = new Date().getFullYear();
</script>
<script>
  import styles from "./_layout.scss";

  import Nav from '../components/Nav.svelte'
</script>

<style>
  @use '../styles/colour';

  .content {
    position: relative;
  //max-width: 56em;
    padding: 2rem;
    margin: 0 auto;
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
  <title>Steakeye - Front End Development Services</title>
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