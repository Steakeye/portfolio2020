<script>
    import { onDestroy, onMount, afterUpdate } from 'svelte';
    import type { Phaser } from 'phaser';
    import { getScene } from 'svelte-phaser';

    const currentScene: Phaser.Scene = getScene();

    export let options = undefined;

    export const items: Phaser.GameObjects.GameObject[] = [];

    export const instance: Phaser.GameObjects.Group = currentScene.add.group(options);

    //setContext('phaser/group', instance);

    function addItems() {
        if (items.length) {
            instance.addMultiple(items);
        }
    }

    onMount(() => {
        console.log('Group.onMount()');
        console.log('items', items);
        addItems()
    })

    afterUpdate(() => {
        console.log('Group.afterUpdate()');
        console.log('items', items);
        addItems()
    })

    onDestroy(() => {
        console.log('Group.destroy()');
        instance.destroy(true);
    })
</script>