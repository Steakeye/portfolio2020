<script>
  import styles from "./_layout.scss";

  import Nav from '../components/Nav.svelte'

  //export let segment: string
</script>

<svelte:head>
  <title>Steakeye - Front End Development Services</title>
</svelte:head>

<!--Nav {segment} /-->
<Nav />

<main class={styles.content}>
  <slot />
</main>
