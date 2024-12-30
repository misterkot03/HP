// src/scenes/PreloadScene.js
import Phaser from 'phaser';

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super('PreloadScene');
  }

  /**
   * Если вам нужно что-то принять из React
   * (например, onLevelComplete и isMuted),
   * можно сохранить эти данные через init(data)
   */
  init(data) {
    this.onLevelComplete = data.onLevelComplete || null;
    this.isMuted = data.isMuted || false;
  }

  preload() {
    // -- Спрайты игрока (48x48!) --
    this.load.spritesheet('player', '/assets/player.png', {
      frameWidth: 48,
      frameHeight: 48
    });

    // -- Остальные ассеты --
    this.load.image('floor', '/assets/floor.png');
    this.load.image('top', '/assets/top.png');
    this.load.image('door', '/assets/door.png');
    this.load.image('flag', '/assets/flag.png');
    this.load.image('image1', '/assets/images/image1.png');

    // -- Видео --
    this.load.video('video1', '/assets/videos/video1.mp4', 'loadeddata', false, true);
    this.load.video('video2', '/assets/videos/video2.mp4', 'loadeddata', false, true);

    // -- Карта --
    this.load.tilemapTiledJSON('level1', '/assets/level1.json');

    // -- Звуки --
    this.load.audio('walk', '/assets/audio/walk.mp3');
    this.load.audio('jump', '/assets/audio/jump.mp3');
    this.load.audio('message-appear', '/assets/audio/message-appear.mp3');
    this.load.audio('level-end', '/assets/audio/level-end.mp3');
    this.load.audio('button-click', '/assets/audio/button-click.mp3');
    this.load.audio('background-music', '/assets/audio/background-music.mp3');

    // Обработчик ошибок загрузки
    this.load.on('loaderror', (fileObj) => {
      console.error(`Ошибка загрузки файла: ${fileObj.key} из ${fileObj.url}`);
    });
  }

  create() {
    // После окончания загрузки ассетов
    // переключаемся на MainScene, передав туда
    // onLevelComplete, isMuted и т.д.
    this.scene.start('MainScene', {
      onLevelComplete: this.onLevelComplete,
      isMuted: this.isMuted
    });
  }
}
