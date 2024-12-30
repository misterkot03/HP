// src/scenes/MainScene.js
import Phaser from 'phaser';

export default class MainScene extends Phaser.Scene {
  constructor() {
    super('MainScene');
    this.currentFlag = null;      // Текущий активный флаг
    this.triggeredFlags = new Set(); // Набор активированных флагов
    this.modalContainer = null;   // Контейнер для модального окна
    this.isModalOpen = false;     // Флаг для модального окна
    this.isInitialized = false;   // Флаг для инициализации сцены
    this.onLevelComplete = null;  // Callback-функция для завершения уровня (из React)
    this.isMuted = false;         // Флаг для отключения звуков
  }

  init(data) {
    // Принимаем данные из PreloadScene
    this.onLevelComplete = data.onLevelComplete;
    this.isMuted = data.isMuted || false;
  }

  create() {
    // Создание карты уровня
    const map = this.make.tilemap({ key: 'level1' });
    
    // Подключение тайлсетов
    const floorTiles = map.addTilesetImage('floor', 'floor');
    const topTiles = map.addTilesetImage('top', 'top');
    const doorTiles = map.addTilesetImage('door', 'door');
    const flagTiles = map.addTilesetImage('flag', 'flag');

    // Создание слоёв
    const backgroundLayer = map.createLayer('Background', [floorTiles], 0, 0);
    const groundLayer = map.createLayer('Ground', [topTiles, doorTiles, flagTiles], 0, 0);

    if (!backgroundLayer || !groundLayer) {
      console.error('Не найдены слои Background или Ground в карте.');
      return;
    }

    groundLayer.setCollisionByProperty({ collides: true });

    // Создание игрока (5-й кадр в качестве стартового можно заменить на 0)
    this.player = this.physics.add.sprite(100, 100, 'player', 5);
    this.player.setCollideWorldBounds(true);

    // Коллизия игрока со слоем
    this.physics.add.collider(this.player, groundLayer);

    // Создаём группу флагов
    this.flags = this.physics.add.staticGroup();

    // Примерные тексты для трёх флагов
    const flagMessages = [
      {
        text: "Помнишь самый первый день этого года?\n, с очередного оказания услуги своему нагвому бватику :3 Ты забирал меня с Тельмы, до сих пор удивляюсь тволей выдержке)))",
      },
      {
        text: "А помнишь как я каждое утро вставал, ты приносил нам покуфоть, бувгевсы, энерджайзеры и всяких вкусняшек, я просыпался, прыгал от радости. А потом садился за комп и включал 2 трека, чтобы проснуться. До сих пор не понимаю как ты меня тогда не убил))",
      },
      {
        text: "Иди дальше путник, коль осмелишься! \nДальше будут краткие итоги года.",
      }
    ];

    let flagCount = 0;
    groundLayer.forEachTile(tile => {
      if (tile && tile.tileset && tile.tileset.name === 'flag') {
        const flag = this.flags.create(tile.getCenterX(), tile.getCenterY(), 'flag');
        flag.setSize(64, 64);
        flag.refreshBody();
        flag.messageContent = flagMessages[flagCount] || { text: "Нет сообщения." };
        flagCount++;
      }
    });

    console.log(`Всего флагов создано: ${flagCount}`);

    // Обработка пересечения игрока с флагами
    this.physics.add.overlap(this.player, this.flags, this.showFlagMessage, null, this);

    // Создание двери
    this.door = this.physics.add.staticSprite(map.widthInPixels - 100, map.heightInPixels / 2, 'door');
    this.door.setSize(64, 128);
    this.physics.add.collider(this.player, this.door, this.enterDoor, null, this);

    // Создание анимаций
    this.createPlayerAnimations();
    this.player.play('idle');

    // События завершения анимаций ударов
    this.player.on('animationcomplete-punch', () => {
      if (this.cursors.left.isDown || this.keys.left.isDown || this.cursors.right.isDown || this.keys.right.isDown) {
        this.player.play('walk', true);
      } else {
        this.player.play('idle', true);
      }
    });

    this.player.on('animationcomplete-kick', () => {
      if (this.cursors.left.isDown || this.keys.left.isDown || this.cursors.right.isDown || this.keys.right.isDown) {
        this.player.play('walk', true);
      } else {
        this.player.play('idle', true);
      }
    });

    // Настройки ввода
    this.cursors = this.input.keyboard.createCursorKeys();
    this.keys = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D
    });
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.shiftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
    this.eKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);

    // Камера
    this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.setZoom(1);
    this.physics.world.setBounds(0, 0, map.widthInPixels * 2, map.heightInPixels / 1.32);

    // Модальное окно и окно сообщения
    this.createModal();
    this.createMessageBox();

    // Звуки
    this.walkSound = this.sound.add('walk', { loop: true, volume: 0.5 });
    this.jumpSound = this.sound.add('jump', { volume: 0.5 });
    this.messageAppearSound = this.sound.add('message-appear', { volume: 0.5 });
    this.levelEndSound = this.sound.add('level-end', { volume: 0.7 });
    this.buttonClickSound = this.sound.add('button-click', { volume: 0.5 });
    this.backgroundMusic = this.sound.add('background-music', { loop: true, volume: 0.3 });

    // Устанавливаем флаг инициализации
    this.isInitialized = true;
  }

  createPlayerAnimations() {
    // Ниже — пример кадров, который вы приводили, 
    // но теперь при условии 48×48 в спрайте.

    // Ходьба
    this.anims.create({
      key: 'walk',
      frames: this.anims.generateFrameNumbers('player', { frames: [0, 1, 2, 3] }),
      frameRate: 8,
      repeat: -1
    });

    // Покой
    this.anims.create({
      key: 'idle',
      frames: this.anims.generateFrameNumbers('player', { frames: [5, 6, 7, 8] }),
      frameRate: 8,
      repeat: -1
    });

    // Удар ногой
    this.anims.create({
      key: 'kick',
      frames: this.anims.generateFrameNumbers('player', { frames: [10, 11, 12, 13, 10] }),
      frameRate: 8,
      repeat: -1,
      repeatDelay: 2000
    });

    // Удар кулаком
    this.anims.create({
      key: 'punch',
      frames: this.anims.generateFrameNumbers('player', { frames: [15, 16, 17, 18, 17, 15] }),
      frameRate: 8,
      repeat: -1,
      repeatDelay: 2000
    });

    // Прыжок
    this.anims.create({
      key: 'jump',
      frames: this.anims.generateFrameNumbers('player', { frames: [20, 21, 22, 23] }),
      frameRate: 8,
      repeat: -1
    });

    // Прыжок с ударом ногой
    this.anims.create({
      key: 'jumpkick',
      frames: this.anims.generateFrameNumbers('player', { frames: [20, 21, 22, 23, 25, 23, 22, 21] }),
      frameRate: 8,
      repeat: -1
    });

    // Победа
    this.anims.create({
      key: 'win',
      frames: this.anims.generateFrameNumbers('player', { frames: [30, 31] }),
      frameRate: 8,
      repeat: -1,
      repeatDelay: 2000
    });

    // Смерть
    this.anims.create({
      key: 'die',
      frames: this.anims.generateFrameNumbers('player', { frames: [35, 36, 37] }),
      frameRate: 8,
      repeat: 0
    });
  }

  createModal() {
    this.modalContainer = this.add.container(this.scale.width / 2, this.scale.height / 2)
      .setDepth(2000)
      .setVisible(false)
      .setScrollFactor(0);

    const modalBackground = this.add.graphics();
    modalBackground.fillStyle(0x000000, 0.8);
    modalBackground.fillRect(-200, -150, 400, 300);
    this.modalContainer.add(modalBackground);

    const modalTitle = this.add.text(0, -130, 'Сообщение', {
      font: '24px Roboto',
      fill: '#ffffff',
      align: 'center',
      wordWrap: { width: 380 }
    }).setOrigin(0.5);
    this.modalContainer.add(modalTitle);

    // Контейнер для текста
    this.modalContent = this.add.container(0, -50);
    this.modalContainer.add(this.modalContent);

    // Кнопка закрытия
    const closeButton = this.add.text(180, -140, 'Закрыть', {
      font: '18px Roboto',
      fill: '#ff0000',
      backgroundColor: '#ffffff',
      padding: { x: 10, y: 5 }
    }).setOrigin(0.5).setInteractive();

    closeButton.on('pointerdown', () => {
      console.log('Кнопка "Закрыть" нажата');
      this.closeModal();
    });

    this.modalContainer.add(closeButton);
  }

  createMessageBox() {
    const gameWidth = this.scale.width;
    const gameHeight = this.scale.height;

    this.messageBox = this.add.container(gameWidth / 2, gameHeight / 2)
      .setDepth(1001)
      .setVisible(false)
      .setScrollFactor(0);

    this.messageText = this.add.text(0, -40, '', {
      font: '20px Roboto',
      fill: '#ffffff',
      align: 'center',
      wordWrap: { width: gameWidth * 0.8 - 40 }
    }).setOrigin(0.5);
    this.messageBox.add(this.messageText);

    this.promptText = this.add.text(0, 40, 'Нажмите [E] для просмотра', {
      font: '18px Roboto',
      fill: '#ffffff',
      align: 'center',
      wordWrap: { width: gameWidth * 0.8 - 40 }
    }).setOrigin(0.5);
    this.messageBox.add(this.promptText);
  }

  updateMessageBoxBackground() {
    const existingBackground = this.messageBox.getByName('messageBackground');
    if (existingBackground) {
      existingBackground.destroy();
    }

    const padding = 20;
    const textBounds = this.messageText.getBounds();
    const promptBounds = this.promptText.getBounds();

    const maxWidth = Math.max(textBounds.width, promptBounds.width);
    const totalHeight = textBounds.height + promptBounds.height + padding;

    const background = this.add.graphics();
    background.name = 'messageBackground';
    background.fillStyle(0x000000, 0.8);
    background.fillRect(
      - (maxWidth / 2 + padding),
      - (totalHeight / 2 + padding),
      maxWidth + padding * 2,
      totalHeight + padding * 2
    );
    this.messageBox.addAt(background, 0);
  }

  showFlagMessage(player, flag) {
    if (this.isMessageBoxOpen || this.triggeredFlags.has(flag)) return;

    this.currentFlag = flag;
    this.isMessageBoxOpen = true;
    this.triggeredFlags.add(flag);

    const { text } = flag.messageContent;
    if (this.messageText) {
      this.messageText.setText(text);
    }

    if (this.messageBox) {
      this.messageBox.setVisible(true);
      this.updateMessageBoxBackground();
      if (!this.isMuted && this.messageAppearSound) {
        this.messageAppearSound.play();
      }
    }
  }

  openModal() {
    if (!this.currentFlag) return;

    const { text } = this.currentFlag.messageContent;
    this.modalContent.removeAll(true, true);

    const modalText = this.add.text(0, 0, text, {
      font: '18px Roboto',
      fill: '#ffffff',
      align: 'center',
      wordWrap: { width: 360 }
    }).setOrigin(0.5);

    this.modalContent.add(modalText);

    if (this.modalContainer) {
      this.modalContainer.setVisible(true);
      this.isModalOpen = true;
    }

    // Останавливаем движение
    this.player.setVelocity(0, 0);
  }

  closeModal() {
    if (this.modalContainer) {
      this.modalContainer.setVisible(false);
      this.isModalOpen = false;
    }
    this.hideFlagMessage();
  }

  hideFlagMessage() {
    this.isMessageBoxOpen = false;
    this.currentFlag = null;

    if (this.messageBox) {
      this.messageBox.setVisible(false);
    }
  }

  enterDoor() {
    console.log('Игрок вошел в дверь');
    this.playDoorAnimation();
  }

  playDoorAnimation() {
    const light = this.add.circle(this.player.x, this.player.y, 10, 0xffffff, 1);
    light.setDepth(3000);

    this.tweens.add({
      targets: light,
      radius: Math.max(this.scale.width, this.scale.height) * 1.5,
      alpha: 0,
      duration: 3000,
      ease: 'Power2',
      onComplete: () => {
        light.destroy();
        this.levelComplete();
      }
    });
  }

  levelComplete() {
    console.log('Уровень завершен');
    if (this.onLevelComplete && typeof this.onLevelComplete === 'function') {
      this.onLevelComplete();
    } else {
      console.error('onLevelComplete не определен или не является функцией');
    }
  }

  isPlayerOverlappingFlag(flag) {
    if (!flag) return false;
    const playerBounds = this.player.getBounds();
    const flagBounds = flag.getBounds();
    return Phaser.Geom.Intersects.RectangleToRectangle(playerBounds, flagBounds);
  }

  update() {
    if (!this.isInitialized) return;

    // Проверка выхода из зоны флага
    this.flags.getChildren().forEach(flag => {
      const isOverlapping = this.isPlayerOverlappingFlag(flag);
      if (!isOverlapping && this.triggeredFlags.has(flag)) {
        this.triggeredFlags.delete(flag);
      }
    });

    // Если сообщение открыто, проверяем нажатие E
    if (this.isMessageBoxOpen) {
      if (Phaser.Input.Keyboard.JustDown(this.eKey)) {
        if (!this.isModalOpen) {
          this.openModal();
        } else {
          this.closeModal();
        }
      }
    }

    if (this.isModalOpen) {
      // Если модалка открыта — блокируем управление
      this.player.setVelocity(0, 0);
      return;
    }

    // Управление
    const left = this.cursors.left.isDown || this.keys.left.isDown;
    const right = this.cursors.right.isDown || this.keys.right.isDown;
    const up = this.cursors.up.isDown || this.keys.up.isDown;

    const onGround = this.player.body.blocked.down || this.player.body.touching.down;

    if (left) {
      this.player.setVelocityX(-150);
      // Смотрим влево (flipX=false или true — на ваш вкус)
      this.player.setFlipX(false);
      if (onGround && this.player.anims.currentAnim.key !== 'walk') {
        this.player.play('walk', true);
        if (!this.walkSound.isPlaying && !this.isMuted) {
          this.walkSound.play();
        }
      }
    } else if (right) {
      this.player.setVelocityX(150);
      // Смотрим вправо
      this.player.setFlipX(true);
      if (onGround && this.player.anims.currentAnim.key !== 'walk') {
        this.player.play('walk', true);
        if (!this.walkSound.isPlaying && !this.isMuted) {
          this.walkSound.play();
        }
      }
    } else {
      this.player.setVelocityX(0);
      if (onGround && this.player.anims.currentAnim.key !== 'idle') {
        this.player.play('idle', true);
        this.walkSound.stop();
      }
    }

    if (up && onGround) {
      this.player.setVelocityY(-200);
      this.player.play('jump', true);
      if (!this.isMuted) {
        this.jumpSound.play();
      }
    }

    // Если в полёте — поддерживаем анимацию "jump"
    if (!onGround) {
      if (this.player.anims.currentAnim.key !== 'jump') {
        this.player.play('jump', true);
      }
    }

    // Атаки
    if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
      this.player.play('punch', true);
      if (!this.isMuted) {
        this.buttonClickSound.play();
      }
    }

    if (Phaser.Input.Keyboard.JustDown(this.shiftKey)) {
      this.player.play('kick', true);
      if (!this.isMuted) {
        this.buttonClickSound.play();
      }
    }
  }
}
