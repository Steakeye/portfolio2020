<script lang="ts">
  import { onDestroy, onMount, afterUpdate } from 'svelte';
  import type { Phaser } from 'phaser';
  import { getScene } from 'svelte-phaser';

  const currentScene: Phaser.Scene = getScene();

  export let options = undefined;

  export const items: Phaser.GameObjects.GameObject[] = [];

  export const instance: Phaser.GameObjects.Group = currentScene.add.group(options);

  function addItems() {
    if (items.length) {
      instance.addMultiple(items);
    }
  }

  onMount(() => {
    addItems();
  });

  afterUpdate(() => {
    addItems();
  });

  onDestroy(() => {
    instance.destroy(true);
  });
</script>

<slot />
