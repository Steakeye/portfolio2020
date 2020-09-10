<script context="module">
    import config from '/src/resources/config.json';
    import getter from "ramda/src/path";

    const gameUnit = getter('breakout.sizeUnit'.split('.'), config)
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
        // create an array of 60 bricksConfig
        bricksConfig = Array.from({ length: 60 }).map((_, index) => {
            return {
                x: (index % 10) * 64,
                y: 10 * Math.floor(index / 10) * 3.2,
                key: index,
            }
        })
    }

    function onBallHitBrick() {
        //bricksConfig = bricksConfig.filter(b => b !== brickConfig)
        console.log('onBallHitBrick', arguments)
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
    let group: Phaser.GameObjects.Group;
    let bricksConfig = [];

    setup()

    onMount(() => {
        console.log('Arena.onMount')
        console.log('group', group)
        console.log('bricks', bricks)
        //group.addMultiple(bricks)
        //game.physics.arcade.collide(ball, bricks, ballHitBrick);
        //scene.physics.add.overlap(bat, bricks, onBallHitBrick) // <-- TODO: start here, memory leak? Why is the event always firing?
    });

    onGameEvent('step', () => {
        // snap ball to bat
        if (!isBallLaunched) {
            ball.setPosition(bat.x, bat.y - gameUnit)
        }
        // reset ball after it hits bottom of screen
        if (ball.y > sceneHeight) {
            ball.body.setVelocity(0)
            isBallLaunched = false
        }
        // you win!
        if (bricksConfig.length === 0) {
            ball.body.setVelocity(0)
            setup()
        }
    })
    // launch ball on click
    onInputEvent('pointerdown', () => {
        if (!isBallLaunched) {
            isBallLaunched = true
            ball.body.setVelocity(-gameUnit*2, -400)
        }
    })

    const bricks = [];
</script>

<Group options={{ name: 'bricks' }} bind:instance={group} items={bricks} />
{#each bricksConfig as brickConfig, index (brickConfig.key)}
    <Brick
        x={brickConfig.x}
        y={brickConfig.y}
        onBallHit={() => {
            bricksConfig = bricksConfig.filter(b => b !== brickConfig)
        }}
        bind:instance={bricks[index]}
    />
{/each}
<Bat bind:instance={bat} x={sceneWidth} y={sceneHeight - gameUnit} />
<Ball bind:instance={ball} />