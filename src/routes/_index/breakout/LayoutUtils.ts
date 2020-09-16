import type Phaser from 'phaser';

export function getSceneToCanvasRatio(game: Phaser.Game) {
    return game.scale.gameSize.width/game.canvas.clientWidth;
}
