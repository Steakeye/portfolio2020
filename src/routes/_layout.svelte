<script lang="ts">
  import styles from "./_layout.scss";

  import Nav from '../components/Nav.svelte'

  export let segment: string
</script>

<Nav {segment} />

<main class={styles.content}>
  <slot />
</main>
