<script lang="ts">
  export let image: string = null;
  export let imageAlt: string = null;
  export let description: string = null;
  export let card: string = null;
  export let site: string = null;
  export let creator: string = null;
  export let url: string = null;
  export let title: string = null;
</script>

{#if image}
  <meta property="twitter:image" content="{image}" />
{/if}
{#if image}
  <meta property="twitter:image:alt" content="{imageAlt}" />
{/if}
{#if description}
  <meta property="twitter:description" content="{description}" />
{/if}
{#if card}
  <meta name="twitter:card" content="{card}" />
{/if}
{#if site}
  <meta name="twitter:site" content="{site}" />
{/if}
{#if creator}
  <meta name="twitter:creator" content="{creator}" />
{/if}
{#if url}
  <meta name="twitter:url" content="{url}" />
{/if}
{#if title}
  <meta name="twitter:title" content="{title}" />
{/if}
