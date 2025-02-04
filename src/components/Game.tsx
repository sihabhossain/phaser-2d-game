import React, { useEffect, useRef, useState } from "react";
import Phaser from "phaser";
import "./Game.css";

const PhaserGame: React.FC = () => {
  const gameContainer = useRef<HTMLDivElement>(null);
  const [game, setGame] = useState<Phaser.Game | null>(null);

  useEffect(() => {
    if (!gameContainer.current) return;

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      parent: gameContainer.current,
      scale: {
        mode: Phaser.Scale.RESIZE, // Dynamically fits screen
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
      physics: {
        default: "arcade",
        arcade: {
          gravity: { y: 800 },
          debug: false,
        },
      },
      scene: { preload, create, update },
    };

    const newGame = new Phaser.Game(config);
    setGame(newGame);

    function preload(this: Phaser.Scene) {
      this.load.image("sky", "assets/sky.png");
      this.load.image("ground", "assets/platform.png");
      this.load.image("star", "assets/star.png");
      this.load.image("enemy", "assets/bomb.png");
      this.load.spritesheet("player", "assets/dude.png", {
        frameWidth: 32,
        frameHeight: 48,
      });
    }

    function create(this: Phaser.Scene) {
      // Fullscreen background
      const bg = this.add.image(this.scale.width / 2, this.scale.height / 2, "sky");
      bg.setDisplaySize(this.scale.width, this.scale.height);

      // Platforms
      const platforms = this.physics.add.staticGroup();
      platforms.create(360, this.scale.height - 50, "ground").setScale(2).refreshBody();
      platforms.create(500, this.scale.height - 300, "ground");
      platforms.create(100, this.scale.height - 500, "ground");
      platforms.create(650, this.scale.height - 700, "ground");

      // Player setup
      const player = this.physics.add.sprite(100, this.scale.height - 150, "player");
      player.setBounce(0.2);
      player.setCollideWorldBounds(true);
      this.physics.add.collider(player, platforms);
      (this as any).player = player;
      (this as any).cursors = this.input.keyboard!.createCursorKeys();

      // Stars
      const stars = this.physics.add.group({
        key: "star",
        repeat: 10,
        setXY: { x: 50, y: 0, stepX: 65 },
      });
      stars.children.iterate((child) => {
        (child as Phaser.Physics.Arcade.Image).setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
      });
      this.physics.add.collider(stars, platforms);
      this.physics.add.overlap(player, stars, collectStar, undefined, this);

      // Enemies (baddies)
      const enemies = this.physics.add.group();
      const enemy = enemies.create(400, 300, "enemy");
      enemy.setBounce(1).setVelocityX(150).setCollideWorldBounds(true);
      this.physics.add.collider(enemies, platforms);
      this.physics.add.collider(player, enemies, hitEnemy, undefined, this);

      // Score text
      let score = 0;
      const scoreText = this.add.text(16, 16, "Score: 0", { fontSize: "32px", color: "#fff" });

      function collectStar(_player: Phaser.GameObjects.GameObject, star: Phaser.GameObjects.GameObject) {
        (star as Phaser.Physics.Arcade.Image).disableBody(true, true);
        score += 10;
        scoreText.setText("Score: " + score);

        // Respawn stars when all collected
        if (stars.countActive(true) === 0) {
          stars.children.iterate((child) => {
            (child as Phaser.Physics.Arcade.Image).enableBody(true, child.x, 0, true, true);
          });
        }
      }

      function hitEnemy(player: Phaser.GameObjects.GameObject) {
        (player as Phaser.Physics.Arcade.Sprite).setTint(0xff0000);
        (player as Phaser.Physics.Arcade.Sprite).setVelocity(0);
        this.physics.pause();
        showRestartButton();
      }

      // Camera follows player
      this.cameras.main.setBounds(0, 0, this.scale.width, this.scale.height);
      this.physics.world.setBounds(0, 0, this.scale.width, this.scale.height);
      this.cameras.main.startFollow(player, true, 0.05, 0.05);

      // Restart Button (Hidden initially)
      const restartButton = document.createElement("button");
      restartButton.innerText = "Restart";
      restartButton.className = "restart-button";
      restartButton.style.display = "none";
      document.body.appendChild(restartButton);
      restartButton.onclick = () => window.location.reload();

      function showRestartButton() {
        restartButton.style.display = "block";
      }
    }

    function update(this: Phaser.Scene) {
      const cursors = (this as any).cursors;
      const player = (this as any).player as Phaser.Physics.Arcade.Sprite;

      if (cursors.left.isDown) {
        player.setVelocityX(-200);
        player.anims.play("left", true);
      } else if (cursors.right.isDown) {
        player.setVelocityX(200);
        player.anims.play("right", true);
      } else {
        player.setVelocityX(0);
        player.anims.play("turn");
      }

      if (cursors.up.isDown && player.body!.touching.down) {
        player.setVelocityY(-700);
      }
    }

    return () => {
      newGame.destroy(true);
    };
  }, []);

  return (
    <div className="container">
      <div className="mobile-frame">
        <div className="game-container" ref={gameContainer} />
      </div>
    </div>
  );
};

export default PhaserGame;
