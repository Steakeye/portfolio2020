<script context="module">
    import content from '../resources/content.json';

    const {
        pages: {
            error: {
                backHomeLink: { text: homeText },
            },
        },
    } = content;
</script>
<script lang="ts">
    import { page } from '$app/stores';

    const { status, error } = $page;
    const dev = process.env.NODE_ENV === 'development';


</script>
<style lang="scss">
  h1,
  p {
    margin: 0 auto;
  }

  h2 {
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
<svelte:head>
    <title>{status}</title>
</svelte:head>
<h1>{status}</h1>
<h2>{error.message}</h2>
<p>
    <a class="back" href="/">{homeText}</a>
</p>
{#if dev && error.stack}
    <pre>{error.stack}</pre>
{/if}
