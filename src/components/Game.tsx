import React, { useEffect, useRef } from "react";
import Phaser from "phaser";


const PhaserGame: React.FC = () => {
  const gameContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      parent: "game-container", // Attach the game to the container in the HTML/React component
      scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
      width: 720, // Fixed width for the phone size
      height: 1280, // Fixed height for the phone size
      physics: {
        default: "arcade",
        arcade: {
          gravity: { y: 300 },
          debug: false,
        },
      },
      scene: {
        preload,
        create,
        update,
      },
    };

    const game = new Phaser.Game(config);

    function preload(this: Phaser.Scene) {
      this.load.image("sky", "assets/sky.png");
      this.load.image("ground", "assets/platform.png");
      this.load.image("star", "assets/star.png");
      this.load.image("bomb", "assets/bomb.png");
      this.load.spritesheet("dude", "assets/dude.png", {
        frameWidth: 32,
        frameHeight: 48,
      });
    }

    function create(this: Phaser.Scene) {
      this.add.image(360, 640, "sky").setScale(1.5);

      const platforms = this.physics.add.staticGroup();
      platforms.create(360, 1200, "ground").setScale(2).refreshBody();
      platforms.create(500, 900, "ground");
      platforms.create(100, 600, "ground");
      platforms.create(650, 400, "ground");

      const player = this.physics.add.sprite(100, 1100, "dude");
      player.setBounce(0.2);
      player.setCollideWorldBounds(true);

      this.anims.create({
        key: "left",
        frames: this.anims.generateFrameNumbers("dude", { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1,
      });
      this.anims.create({
        key: "turn",
        frames: [{ key: "dude", frame: 4 }],
        frameRate: 20,
      });
      this.anims.create({
        key: "right",
        frames: this.anims.generateFrameNumbers("dude", { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1,
      });

      this.physics.add.collider(player, platforms);
      (this as any).player = player;
      (this as any).cursors = this.input.keyboard.createCursorKeys();

      // Adding stars
      const stars = this.physics.add.group({
        key: "star",
        repeat: 11,
        setXY: { x: 12, y: 0, stepX: 60 },
      });
      stars.children.iterate((child) => {
        (child as Phaser.Physics.Arcade.Image).setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
      });
      this.physics.add.collider(stars, platforms);
      this.physics.add.overlap(player, stars, collectStar, undefined, this);

      // Adding score
      let score = 0;
      const scoreText = this.add.text(16, 16, "Score: 0", { fontSize: "32px", color: "#fff" });

      function collectStar(player: Phaser.GameObjects.GameObject, star: Phaser.GameObjects.GameObject) {
        (star as Phaser.Physics.Arcade.Image).disableBody(true, true);
        score += 10;
        scoreText.setText("Score: " + score);
      }
    }

    function update(this: Phaser.Scene) {
      const cursors = (this as any).cursors;
      const player = (this as any).player as Phaser.Physics.Arcade.Sprite;

      if (cursors.left.isDown) {
        player.setVelocityX(-160);
        player.anims.play("left", true);
      } else if (cursors.right.isDown) {
        player.setVelocityX(160);
        player.anims.play("right", true);
      } else {
        player.setVelocityX(0);
        player.anims.play("turn");
      }

      if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-330);
      }
    }

    return () => {
      game.destroy(true);
    };
  }, []);

  return (
    <div className="mobile-frame">
      <div className="game-container" ref={gameContainer} />
    </div>
  );
};

export default PhaserGame;
