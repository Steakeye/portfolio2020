<script context="module">
    import config from '/src/resources/config.json';
    import getter from "ramda/src/path";

    const { breakout: { sizeUnit } } = config
    const { defaultColor, defaultStroke, widthSize, heightSize } = getter('breakout.bat'.split('.'), config)
    const width = sizeUnit * widthSize;
    const height = sizeUnit * heightSize;
</script>
<script lang="ts">
    import Phaser from 'phaser';
    import { onMount } from 'svelte';
    import { Rectangle, onInputEvent, getScene } from 'svelte-phaser';
    export let x: number;
    export let y: number;
    export let fillColor = parseInt(defaultColor, 16);
    export let strokeColor = parseInt(defaultStroke, 16);
    export let instance = undefined
    export let xMin = undefined
    export let xMax = undefined

    let scene: Phaser.Scene;

    onInputEvent('pointermove', (pointer: PointerEvent)=> {
        const pointerX = pointer.x;

        let updatedX = pointerX;

        if (pointerX < xMin) {
            updatedX = xMin;
        } else if (pointerX > xMax) {
            updatedX = xMax;
        }

        x = updatedX
    })

    onMount(() => {
        scene = getScene();

        scene.physics.world.enable(instance, Phaser.Physics.Arcade.DYNAMIC_BODY);
        instance.body.immovable = true;

        return () => {
            if (scene.children.exists(instance)) {
                scene.physics.world.disable(instance)
            }
        }
    })

</script>
<Rectangle bind:instance name="bat" bind:x {y} {fillColor} {strokeColor} strokeWidth="1" {width} {height} />
