<script>
    export let noIndex: boolean;
    export let noFollow: boolean;
</script>
{#each ['robots', 'googlebot'] as robotName}
<meta
        name={robotName}
        content={`${noIndex ? 'noindex' : 'index'},${noFollow ? 'nofollow' : 'follow'}`} />
{/each}