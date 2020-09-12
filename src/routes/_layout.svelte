<script context="module">
  const year = new Date().getFullYear()
</script>
<script>
  import styles from "./_layout.scss";

  import Nav from '../components/Nav.svelte'
</script>

<style>
  @use '../styles/colour';

  footer {
    position: fixed;
    bottom: 0;
    width: 100vw;
    background-color: colour.$brand-black;
    color: colour.$brand-white;
    font-size: 1rem;
    padding: .25rem .5rem;
  }
</style>

<svelte:head>
  <title>Steakeye - Front End Development Services</title>
</svelte:head>

<header>
<Nav />
</header>

<main class={styles.content}>
  <slot />
</main>
<footer>
  <p>&copy; Steakye Ltd. {year}</p>
</footer>