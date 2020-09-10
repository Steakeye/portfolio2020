<script>
    import { onDestroy, onMount, afterUpdate /*setContext *\/ SvelteComponent*/ } from 'svelte';
    import type { Phaser } from 'phaser';
    import {getScene} from 'svelte-phaser';

    const currentScene: Phaser.Scene = getScene();

    export let options = undefined;

    export const items: unknown[] = [];

    $: console.log('items', items);

    export const instance: Phaser.Group = currentScene.add.group(options);

    function addItem(item) {
        console.log('Group.addItem', node, item)
    }

    //setContext('phaser/group', instance);

    //export let
    onMount(() => {
        console.log('Group.onMount()');
        console.log('arguments', arguments);
        console.log('slotInstance', slotInstance);
    })

    afterUpdate(() => {
        console.log('Group.afterUpdate()');
        console.log('arguments', arguments);
        console.log('slotInstance', slotInstance);
    })

    onDestroy(() => {
        console.log('Group.destroy()');
        instance.destroy(true);
    })

    console.log('Group arguments', arguments);

    let slotInstance;
</script>