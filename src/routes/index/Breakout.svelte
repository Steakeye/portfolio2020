<script>
    import { onMount } from 'svelte';

    let beforeMount = true;

    let Game;
    let Scene;
    let Text;

    onMount(async () => {
        //import { Game, Scene, Text } from 'svelte-phaser'
        const sveltePhaser = await  import('svelte-phaser');

        Game = sveltePhaser.Game;
        Scene = sveltePhaser.Scene;
        Text = sveltePhaser.Text;

        beforeMount = false;
    });

</script>

{#if beforeMount}
    <div>Loading...</div>
{:else}
    <svelte:component this={Game} width={400} height={400}>
        <svelte:component this={Scene} key="main">
            <svelte:component this={Text} x={140} y={180} text="hello world" />
        </svelte:component>
    </svelte:component>
{/if}