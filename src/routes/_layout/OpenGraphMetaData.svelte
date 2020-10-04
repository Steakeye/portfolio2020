<script context="module">
    import { global } from '/src/resources/content.json';

    const { metaData: { externalLinks } } = global;
</script>
{#each externalLinks as { relation, link }}
    <link rel={relation} href={link} />
{/each}
