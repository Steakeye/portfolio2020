import type Phaser from 'phaser';

export function getCanvas(game: Phaser.Game) {
    return game.canvas;
}

export function getSceneToCanvasRatio(game: Phaser.Game) {
    console.log('function getSceneToCanvasRatio');
    console.log('game.scale.gameSize.width/game.canvas.clientWidth', `${game.scale.gameSize.width}/${game.canvas.clientWidth}`, game.scale.gameSize.width/game.canvas.clientWidth);
    return game.scale.gameSize.width/game.canvas.clientWidth;
}
