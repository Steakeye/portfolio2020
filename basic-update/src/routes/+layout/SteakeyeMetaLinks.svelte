<script context="module">
  import { siteWide } from '$lib/resources/content.json';

  const {
    metaData: { externalLinks },
  } = siteWide;
</script>

{#each externalLinks as { relation, link }}
  <link rel="{relation}" href="{link}" />
{/each}
