<script context="module">
    import config from '/src/resources/config.json';
    import getter from "ramda/src/path";

    const gameUnit = getter('breakout.sizeUnit'.split('.'), config)
</script>
<script>
    import { onGameEvent, onInputEvent, getScene } from 'svelte-phaser';
    import Group from '/src/components/svelte-phaser/Group.svelte';
    import Bat from './Bat.svelte';
    import Ball from './Ball.svelte';
    import Brick from './Brick.svelte';

    const spacingUnit = 50;

    // setup game
    function setup() {
        isBallLaunched = false
        // create an array of 60 bricksConfig
        bricksConfig = Array.from({ length: 60 }).map((_, index) => {
            // possible sprites to use for block
            const blockFrames = [
                'blue1',
                'red1',
                'green1',
                'yellow1',
                'silver1',
                'purple1',
            ]
            return {
                x: (index % 10) * 64,
                y: 10 * Math.floor(index / 10) * 3.2,
                // each row uses same sprite
                //frame: blockFrames[Math.floor(index / 10)],
                key: index,
            }
        })
    }

    const scene = getScene();
    const sceneSize = scene.sys.game.scale.gameSize
    const { height: sceneHeight, width: sceneWidth } = sceneSize;
    // set collisions on all edges of world except bottom
    scene.physics.world.setBoundsCollision(true, true, true, false);
    let isBallLaunched = false;
    let bat;
    let ball;
    let bricksConfig = [];

    setup()
    onGameEvent('step', () => {
        // snap ball to bat
        if (!isBallLaunched) {
            ball.setPosition(bat.x, bat.y - spacingUnit)
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

<Group items={bricks} />
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
<Bat bind:instance={bat} x={sceneWidth} y={sceneHeight - spacingUnit} />
<Ball bind:instance={ball} />