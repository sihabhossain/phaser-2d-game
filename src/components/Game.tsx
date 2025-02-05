import React, { useEffect, useRef, useState } from "react";
import Phaser from "phaser";
import "./Game.css"; // Import the updated CSS file

const PhaserGame: React.FC = () => {
  const gameContainer = useRef<HTMLDivElement>(null);
  const [game, setGame] = useState<Phaser.Game | null>(null);
  const [gameStarted, setGameStarted] = useState(false);

  const startGame = () => {
    setGameStarted(true);
  };

  useEffect(() => {
    if (!gameStarted || !gameContainer.current) return;

    const baseWidth = 720;
    const baseHeight = 1280;

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      parent: gameContainer.current,
      width: baseWidth,
      height: baseHeight,
      scale: {
        mode: Phaser.Scale.FIT,
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
      const { width, height } = this.scale;
      const bg = this.add.image(width / 2, height / 2, "sky");
      bg.setDisplaySize(width, height);

      const platforms = this.physics.add.staticGroup();
      platforms.create(width / 2, height - 50, "ground").setScale(2).refreshBody();
      platforms.create(width * 0.7, height - 300, "ground");
      platforms.create(width * 0.2, height - 500, "ground");
      platforms.create(width * 0.9, height - 700, "ground");

      const player = this.physics.add.sprite(width / 10, height - 150, "player");
      player.setBounce(0.2);
      player.setCollideWorldBounds(true);
      this.physics.add.collider(player, platforms);
      (this as any).player = player;
      (this as any).cursors = this.input.keyboard!.createCursorKeys();

      const stars = this.physics.add.group({
        key: "star",
        repeat: 10,
        setXY: { x: width * 0.1, y: 0, stepX: width * 0.08 },
      });

      stars.children.iterate((child) => {
        (child as Phaser.Physics.Arcade.Image).setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
      });

      this.physics.add.collider(stars, platforms);
      this.physics.add.overlap(player, stars, collectStar, undefined, this);

      const enemies = this.physics.add.group();
      const enemy = enemies.create(width / 2, height / 2, "enemy");
      enemy.setBounce(1).setVelocityX(150).setCollideWorldBounds(true);
      this.physics.add.collider(enemies, platforms);
      this.physics.add.collider(player, enemies, hitEnemy, undefined, this);

      let score = 0;
      const scoreText = this.add.text(16, 16, "Score: 0", { fontSize: "32px", color: "#fff" });

      function collectStar(_player: Phaser.GameObjects.GameObject, star: Phaser.GameObjects.GameObject) {
        (star as Phaser.Physics.Arcade.Image).disableBody(true, true);
        score += 10;
        scoreText.setText("Score: " + score);
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

      this.cameras.main.setBounds(0, 0, width, height);
      this.physics.world.setBounds(0, 0, width, height);
      this.cameras.main.startFollow(player, true, 0.05, 0.05);

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
  }, [gameStarted]);

  return (
    <div className="container">
      {!gameStarted ? (
        <button className="start-game-button" onClick={startGame}>
          Start Game
        </button>
      ) : (
        <div className="game-container" ref={gameContainer} />
      )}
    </div>
  );
};

export default PhaserGame;
