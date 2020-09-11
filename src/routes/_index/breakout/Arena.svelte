<script context="module">
    import config from '/src/resources/config.json';

    const { breakout: { sizeUnit, bricks: { columns, rows, widthSize, heightSize } } } = config;
    const maxBricks = columns * rows;
    const spacerUnit = sizeUnit * .6;
    const brickWidth = sizeUnit * widthSize;
    const brickHeight = sizeUnit * heightSize;
    const bricksXOffset = brickWidth/2 + sizeUnit/2;
    const bricksYOffset = brickHeight/2 + sizeUnit;
</script>
<script>
    import type { Phaser } from 'phaser'
    import { onMount } from 'svelte'
    import { onGameEvent, onInputEvent, getGame, getScene } from 'svelte-phaser';
    import Group from '/src/components/svelte-phaser/Group.svelte';
    import Bat from './Bat.svelte';
    import Ball from './Ball.svelte';
    import Brick from './Brick.svelte';

    // setup game
    function setup() {
        isBallLaunched = false

        const brickWidthPlusSpacer = brickWidth + spacerUnit;
        const brickHeightPlusSpacer = brickHeight + spacerUnit;

        // create an array of 60 bricksConfig
        bricksConfig = Array.from({ length: maxBricks }).map((_, index) => {
            return {
                x: (index % columns) * brickWidthPlusSpacer,
                y: Math.floor(index / columns) * brickHeightPlusSpacer,
                key: index,
            }
        })
    }

    function reset() {
        isBallLaunched = false

    }

    function onBallHitBrick(ball: Phaser.GameObjects.Sprite, brick: Phaser.GameObjects.Rectangle) {
        bricksGroup.killAndHide(brick as Phaser.GameObjects.GameObject);
        scene.physics.world.disable(brick);
    }

    const game: Phaser.Game = getGame();
    const scene = getScene();
    const sceneSize = scene.sys.game.scale.gameSize
    const { height: sceneHeight, width: sceneWidth } = sceneSize;

    // set collisions on all edges of world except bottom
    scene.physics.world.setBoundsCollision(true, true, true, false);

    let isBallLaunched = false;
    let bat;
    let ball;
    let bricksGroup: Phaser.GameObjects.Group;
    let bricksConfig = [];

    setup()

    onMount(() => {
        scene.physics.add.collider(ball, bricksGroup, onBallHitBrick)
    });

    onGameEvent('step', () => {
        // snap ball to bat
        if (!isBallLaunched) {
            ball.setPosition(bat.x, bat.y - sizeUnit)
        }
        // reset ball after it hits bottom of screen
        if (ball.y > sceneHeight) {
            ball.body.setVelocity(0)
            isBallLaunched = false
        }
        // you win!
        if (bricksGroup.countActive() === 0) {
            ball.body.setVelocity(0)
            reset()
        }
    })

    // launch ball on click
    onInputEvent('pointerdown', () => {
        if (!isBallLaunched) {
            isBallLaunched = true
            ball.body.setVelocity(-sizeUnit*2, -400)
        }
    })

    const bricks = [];
</script>

<Group options={{ name: 'bricks' }} bind:instance={bricksGroup} items={bricks} />
{#each bricksConfig as brickConfig, index (brickConfig.key)}
    <Brick
        x={brickConfig.x + bricksXOffset}
        y={brickConfig.y + bricksYOffset}
        bind:instance={bricks[index]}
    />
{/each}
<Bat bind:instance={bat} x={sceneWidth/2} y={sceneHeight - sizeUnit} />
<Ball bind:instance={ball} />