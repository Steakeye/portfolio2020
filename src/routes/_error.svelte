<style>
  h1,
  p {
    margin: 0 auto;
  }

  h1 {
    font-size: 2.8em;
    font-weight: 700;
    margin: 0 0 0.5em 0;
  }

  p {
    margin: 1em auto;
  }

  @media (min-width: 480px) {
    h1 {
      font-size: 4em;
    }
  }
</style>

<script lang="ts">
  import content from '../resources/content.json'

  export let status: number
  export let error: Error

  const dev = process.env.NODE_ENV === 'development'

  const { pages: { error: { backHomeLink: { text: homeText } } } } = content;
</script>

<svelte:head>
  <title>{status}</title>
</svelte:head>

<h1>{status}</h1>

<p>{error.message}</p>
<p><a href="/">{homeText}</a></p>

{#if dev && error.stack}
  <pre>{error.stack}</pre>
{/if}
