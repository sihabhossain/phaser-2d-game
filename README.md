# Phaser Game 🎮

A simple platformer game built with **React** and **Phaser.js**. The game features a player character, collectible stars, enemies, a score system, and a restart functionality.

---

## Table of Contents 📚

- [Installation](#installation)
- [Getting Started](#getting-started)
- [Game Features](#game-features)
- [Game Logic](#game-logic)
- [Customization](#customization)
- [Credits](#credits)

---

## Installation 🛠️

To get started with the game, follow these steps:

1. **Clone the repository**:
    ```bash
    git clone https://github.com/your-username/phaser-game.git
    ```

2. **Navigate to the project directory**:
    ```bash
    cd phaser-game
    ```

3. **Install dependencies**:
    ```bash
    npm install
    ```

4. **Start the development server**:
    ```bash
    npm start
    ```

5. **Play the game**: Open the browser and visit `http://localhost:3000`.

---

## Getting Started 🎮

Once the app is running, you'll see a **"Start Game"** button. Click it to begin the game.

### The Game Components:

- **Player**: The character controlled by the user.
- **Stars**: Collectible items that increase the player's score.
- **Enemies**: Obstacles that end the game if collided with.
- **Score**: Displayed at the top left, showing the player's current score.
- **Restart Button**: Appears when the player hits an enemy, allowing them to restart the game.

---

## Game Features ✨

- **Responsive Design**: The game automatically scales based on the device size.
- **Physics**: Utilizes **Phaser's Arcade Physics** for gravity, collisions, and movement.
- **Animations**: The player character has different animations for movement.
- **Score System**: Every star collected increases the score, visible at the top left of the screen.
- **Game Over & Restart**: A restart button appears after a collision with an enemy.

---

## Game Logic ⚙️

### Preload
- **Assets loading**: The `preload` function loads all the necessary images and spritesheets.

```ts
function preload(this: Phaser.Scene) {
  this.load.image("sky", "assets/sky.png");
  this.load.image("ground", "assets/platform.png");
  this.load.image("star", "assets/star.png");
  this.load.image("enemy", "assets/bomb.png");
  this.load.spritesheet("player", "assets/dude.png", { frameWidth: 32, frameHeight: 48 });
}
Create
Setting up the game world: The create function initializes the background, platforms, player, stars, enemies, and score display.
ts
Copy
Edit
function create(this: Phaser.Scene) {
  // Setup code for background, platforms, and player initialization
}
Update
Continuous game state updates: The update function monitors player input (left, right, jump) and updates the game world accordingly.
ts
Copy
Edit
function update(this: Phaser.Scene) {
  // Player movement and physics updates
}
Customization 🛠️
You can easily customize the game to fit your preferences. Here are a few options:

Player Speed & Jumping
Adjust the movement and jump height in the update function:

ts
Copy
Edit
// Change speed
player.setVelocityX(-200);  // Move left
player.setVelocityX(200);   // Move right

// Adjust jump height
player.setVelocityY(-700);  // Increase/decrease jump height
Game Assets
To replace the default assets, place your custom images and spritesheets in the assets/ folder:

sky.png: Background image.
platform.png: Platforms.
star.png: Collectible star.
bomb.png: Enemies.
dude.png: Player character sprite.
Physics & Gravity
Modify the physics settings to adjust gravity and other parameters:

ts
Copy
Edit
gravity: { y: 800 }, 
Credits 🎉
Phaser.js: A powerful 2D game framework used for rendering and physics. Phaser.js
React: A JavaScript library for building the user interface. React
Thanks for checking out the Phaser Game! 🎮 Enjoy playing, and feel free to customize it to your liking! 🚀

markdown
Copy
Edit

### Key Changes:
- **Emoji icons** 🎮 📚 ✨ to make it more fun and visually engaging.
- **Markdown headers** (`##`) for better structure.
- **Code blocks** (` ```ts ... ``` `) for code snippets.
- **Links** to Phaser.js and React for quick access.
- **Clear sections** for each part of the game logic and customization options.
