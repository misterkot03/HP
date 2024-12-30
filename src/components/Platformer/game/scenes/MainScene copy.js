import Phaser from 'phaser'

export default class MainScene extends Phaser.Scene {
  constructor() {
    super('MainScene')
  }

  create() {
    const map = this.make.tilemap({ key: 'level1' });

    const floorTiles = map.addTilesetImage('floor', 'floor');
    const topTiles = map.addTilesetImage('top', 'top');
    const doorTiles = map.addTilesetImage('door', 'door');
    const flagTiles = map.addTilesetImage('flag', 'flag');
    

    const backgroundLayer = map.createLayer('Background', [floorTiles], 0, 0);
    const groundLayer = map.createLayer('Ground', [topTiles, doorTiles, flagTiles], 0, 0);

    // Применяем коллизию к тайлам с property collides=true
    groundLayer.setCollisionByProperty({ collides: true });
    

    // Анимации игрока
    this.anims.create({
      key: 'walk',
      frames: this.anims.generateFrameNumbers('player', { frames: [0,1,2,3] }),
      frameRate: 8,
      repeat: -1
    });

    this.anims.create({
      key: 'idle',
      frames: this.anims.generateFrameNumbers('player', { frames: [5,6,7,8] }),
      frameRate: 8,
      repeat: -1
    });

    this.anims.create({
      key: 'kick',
      frames: this.anims.generateFrameNumbers('player', { frames: [10,11,12,13,10] }),
      frameRate: 8,
      repeat: -1,
      repeatDelay: 2000
    });

    this.anims.create({
      key: 'punch',
      frames: this.anims.generateFrameNumbers('player', { frames: [15,16,17,18,17,15] }),
      frameRate: 8,
      repeat: -1,
      repeatDelay: 2000
    });

    this.anims.create({
      key: 'jump',
      frames: this.anims.generateFrameNumbers('player', { frames: [20,21,22,23] }),
      frameRate: 8,
      repeat: -1
    });

    this.anims.create({
      key: 'jumpkick',
      frames: this.anims.generateFrameNumbers('player', { frames: [20,21,22,23,25,23,22,21] }),
      frameRate: 8,
      repeat: -1
    });

    this.anims.create({
      key: 'win',
      frames: this.anims.generateFrameNumbers('player', { frames: [30,31] }),
      frameRate: 8,
      repeat: -1,
      repeatDelay: 2000
    });

    this.anims.create({
      key: 'die',
      frames: this.anims.generateFrameNumbers('player', { frames: [35,36,37] }),
      frameRate: 8
    });

    this.player = this.physics.add.sprite(100, 100, 'player', 5);
    this.player.setCollideWorldBounds(true);

    this.physics.add.collider(this.player, groundLayer);

    this.player.play('idle');

    this.cursors = this.input.keyboard.createCursorKeys();
    this.keys = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D
    });

    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.shiftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);

    this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.setZoom(0.5);
    this.physics.world.setBounds(0, 0, map.widthInPixels * 2, map.heightInPixels);

  }

  update() {
    
    const left = this.cursors.left.isDown || this.keys.left.isDown;
    const right = this.cursors.right.isDown || this.keys.right.isDown;
    const up = this.cursors.up.isDown || this.keys.up.isDown;
    // Исходя из того, что вы хотите дальше вправо:


    const onGround = this.player.body.blocked.down || this.player.body.touching.down;

    if (left) {
      this.player.setVelocityX(-150);
      this.player.setFlipX(false); // Влево - смотрим влево
      if (onGround) {
        this.player.play('walk', true);
      }
    } else if (right) {
      this.player.setVelocityX(150);
      this.player.setFlipX(true); // Вправо - смотрим вправо
      if (onGround) {
        this.player.play('walk', true);
      }
    } else {
      this.player.setVelocityX(0);
      if (onGround) {
        this.player.play('idle', true);
      }
    }

    if (up && onGround) {
      this.player.setVelocityY(-200);
      this.player.play('jump', true);
    }

    if (!onGround) {
      this.player.play('jump', true);
    }

    if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
      this.player.play('punch', true);
    }

    if (Phaser.Input.Keyboard.JustDown(this.shiftKey)) {
      this.player.play('kick', true);
    }
  }
}
