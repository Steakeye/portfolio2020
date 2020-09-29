import type Phaser from 'phaser';

export function getCanvas(game: Phaser.Game) {
  return game.canvas;
}

export function getSceneToCanvasRatio(game: Phaser.Game) {
  return game.scale.gameSize.width / game.canvas.clientWidth;
}
