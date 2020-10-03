<style lang="scss">
  @use '../styles/fonts';

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

  a.back:before {
    @include fonts.coreUIIcon(chevron-left);
    font-size: 0.8em;
    margin-right: 0.2em;
    vertical-align: text-top;
    text-decoration: none;
    display: inline-block;
  }

  @media (min-width: 480px) {
    h1 {
      font-size: 4em;
    }
  }
</style>
<script lang="ts">
  import content from '../resources/content.json'

<script lang="ts">
  import content from '../resources/content.json';

  export let status: number;
  export let error: Error;

  const dev = process.env.NODE_ENV === 'development';

  const {
    pages: {
      error: {
        backHomeLink: { text: homeText },
      },
    },
  } = content;
</script>

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
