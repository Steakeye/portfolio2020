<script>
  import styles from "./_layout.scss";

  import Nav from '../components/Nav.svelte'
</script>

<svelte:head>
  <title>Steakeye - Front End Development Services</title>
</svelte:head>

<Nav />

<main class={styles.content}>
  <slot />
</main>
