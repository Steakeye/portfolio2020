<script>
    export let noIndex: boolean = false;
    export let noFollow: boolean = false;
</script>
{#each ['robots', 'googlebot'] as robotName}
<meta
        name={robotName}
        content={`${noIndex ? 'noindex' : 'index'},${noFollow ? 'nofollow' : 'follow'}`} />
{/each}