<script context="module">
    import config from '/src/resources/config.json';
    import getter from "ramda/src/path";

    const { breakout: { sizeUnit } } = config
    const { defaultColor, defaultStroke, widthSize, heightSize } = getter('breakout.bat'.split('.'), config)
    const width = sizeUnit * widthSize;
    const height = sizeUnit * heightSize;
</script>
<script>
    import type { Phaser } from 'phaser'
    import Phaser from 'phaser'
    import { onMount } from 'svelte'
    import { Rectangle, ArcadePhysics, onInputEvent, getScene } from 'svelte-phaser'
    export let x
    export let y
    export let fillColor = parseInt(defaultColor, 16);
    export let strokeColor = parseInt(defaultStroke, 16);
    export let instance = undefined

    let scene: Phaser.Scene;

    onInputEvent('pointermove', pointer => {
        x = pointer.x
    })

    onMount(() => {
        scene = getScene();

        scene.physics.world.enable(instance, Phaser.Physics.Arcade.DYNAMIC_BODY);
        instance.body.immovable = true;
    })

</script>
<Rectangle bind:instance name="bat" bind:x {y} {fillColor} {strokeColor} {width} {height}>
</Rectangle>