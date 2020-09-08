<script>
    import {SvelteComponent} from 'svelte';
    import {onMount} from 'svelte';

    import testModule from './breakout/test.ts'

    import roundelPath from '/src/assets/images/game/steakeye-roundel.svg';

    console.log(testModule())

    function loadAssets(scene: Phaser.Scene) {
        scene.load.image('ball', roundelPath);
    }

    function assignExposedProgress(updatedValue: number) {
        exposedProgress = updatedValue;
    }

    let beforeMount = true;

    let bullshit = (...args) => {
        console.log('bs args', args)
    };
    let fragment;
    let Phaser: SvelteComponent;
    let Game: SvelteComponent;
    let Scene: SvelteComponent;
    let Text: SvelteComponent;
    let LoadingBar: SvelteComponent;
    let Arena: SvelteComponent;

    let exposedProgress;
    let sceneInstance;

    onMount(async () => {
        const sveltePhaser = await import('svelte-phaser');
        fragment = (await import('svelte-fragment')).default;
        Phaser = await import('phaser');

        /*console.log('sveltePhaser', sveltePhaser)
        console.log('Phaser', Phaser)*/

        Game = sveltePhaser.Game;
        Scene = sveltePhaser.Scene;
        Text = sveltePhaser.Text;

        LoadingBar = (await import('./breakout/LoadingBar.svelte')).default;
        Arena = (await import('./breakout/Arena.svelte')).default;

        beforeMount = false;
    });

    $: if (sceneInstance) {
        console.log('sceneInstance', sceneInstance)
        console.log('exposedProgress', exposedProgress)
    }
    $: console.log('exposedProgress', exposedProgress)
</script>

{#if beforeMount}
    <div>Loading...</div>
{:else}
    <Game
        width={400}
        height={400}
        physics={{ default: 'arcade' }}
        scale={{ mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH }}
        noop-transparent="true"
    >
        <Scene
            key="main"
            preload={loadAssets}
            bind:this={sceneInstance}
        >
            <p use:bullshit slot="loading" let:progress >Oh loadio! {console.log('progress', progress), assignExposedProgress(progress)}</p>
            <template>
                <LoadingBar x={400} y={400} progress={exposedProgress}/> <!--{progress} /-->
            </template>
            <Arena />
        </Scene>
    </Game>
{/if}