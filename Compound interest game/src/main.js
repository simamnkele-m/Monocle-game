const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: { debug: false }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

let player;
let cursors;
let bankZone, loanZone;

const game = new Phaser.Game(config);

function preload() {
    // Load background
    this.load.image('background', 'assets/NewCity2.png');

    // Load player sprite (spritesheet)
    this.load.spritesheet('player', 'assets/Pink_Monster.png', {
        frameWidth: 32,
        frameHeight: 32
    });
}

function create() {
    // Add and scale background to fill screen
    const bg = this.add.image(400, 300, 'background');
    bg.setDisplaySize(config.width, config.height);

    // Add player sprite with physics
    player = this.physics.add.sprite(400, 300, 'player');

    // Enable arrow key input
    cursors = this.input.keyboard.createCursorKeys();

    // Animation for walking
    this.anims.create({
        key: 'walk',
        frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
        frameRate: 8,
        repeat: -1
    });

    player.play('walk');

    // Bank zone
    bankZone = this.add.zone(150, 150, 80, 80);
    this.physics.world.enable(bankZone);
    bankZone.body.setAllowGravity(false);
    bankZone.body.moves = false;

    // Loan zone
    loanZone = this.add.zone(650, 150, 80, 80);
    this.physics.world.enable(loanZone);
    loanZone.body.setAllowGravity(false);
    loanZone.body.moves = false;

    // Overlap detection with calculator launch
    this.physics.add.overlap(player, bankZone, () => {
        openCalculator('savings');
    });

    this.physics.add.overlap(player, loanZone, () => {
        openCalculator('loan');
    });
}

function update() {
    // Reset velocity each frame
    player.setVelocity(0);

    if (cursors.left.isDown) {
        player.x -= 2;
    }
    if (cursors.right.isDown) {
        player.x += 2;
    }
    if (cursors.up.isDown) {
        player.y -= 2;
    }
    if (cursors.down.isDown) {
        player.y += 2;
    }
}

// === Show Calculator ===
function openCalculator(mode) {
    // Pause game
    game.scene.pause('default');

    // Show your HTML calculator overlay
    const calcDiv = document.getElementById('calcScreen');
    const homeDiv = document.getElementById('homeScreen');

    if (calcDiv && homeDiv) {
        homeDiv.style.display = 'none';
        calcDiv.style.display = 'block';
    }

    // Run your calculator's startPath function if it exists
    if (typeof startPath === 'function') {
        startPath(mode);
    }
}
