<script>
    import { SvelteComponent } from 'svelte';
    import { onMount } from 'svelte';
    import fragment from 'svelte-fragment';
    //import Title from './breakout/Title.svelte';

    import roundelPath from '/src/assets/images/game/steakeye-roundel.svg';

    function loadAssets(scene: Phaser.Scene) {
        scene.load.image('ball', roundelPath);
    }

    let beforeMount = true;

    let Phaser;
    let Game;
    let Scene;
    let Text;
    let LoadingBar;
    let Arena;
    let Title: SvelteComponent;

    onMount(async () => {
        /*const sveltePhaser = await import('svelte-phaser');

        Phaser = await import('phaser');
        Game = sveltePhaser.Game;
        Scene = sveltePhaser.Scene;
        Text = sveltePhaser.Text;*/

        /*LoadingBar = await import('./breakout/LoadingBar.svelte');
        Arena = await import('./breakout/Arena.svelte');*/
        Title = (await import('./breakout/Title.svelte')).default;

        beforeMount = false;
    });

</script>

<!--Title /-->

{#if beforeMount}
    <div>Loading...</div>
{:else}
    <svelte:component
            this={Title} />
{/if}