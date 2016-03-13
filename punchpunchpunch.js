(function() {
  var Phaser, brickSolidCollision, brickSpawnDelayLower, brickSpawnDelayUpper, bricks, create, cursors, game, main, pgSolidBoxes, pgSpeed, pgSprite, preload, render, spawnBrick, timer, update;

  Phaser = window.Phaser;

  brickSpawnDelayLower = 1500;

  brickSpawnDelayUpper = 3000;

  pgSpeed = 2;

  bricks = null;

  cursors = null;

  game = null;

  pgSolidBoxes = null;

  pgSprite = null;

  timer = null;

  main = function() {
    game = new Phaser.Game(800, 600, Phaser.AUTO, '', {
      preload: preload,
      create: create,
      render: render,
      update: update
    });
  };

  preload = function() {
    game.load.spritesheet('punchguy', 'assets/punchguy.png', 64, 64);
    game.load.spritesheet('brick', 'assets/maybe brick.png');
  };

  create = function() {
    var solidBox0, solidBox1;
    game.physics.startSystem(Phaser.Physics.ARCADE);
    timer = game.time.create(false);
    cursors = game.input.keyboard.createCursorKeys();
    game.stage.backgroundColor = 'rgb(128, 175, 168)';
    pgSprite = game.add.sprite((game.world.width / 2) - 32, game.world.height - 64, 'punchguy', 0);
    pgSprite.animations.add('stand', [0], 1, true);
    pgSprite.animations.add('walkright', [1, 2, 0], 6, true);
    pgSprite.animations.add('walkleft', [2, 1, 0], 6, true);
    pgSolidBoxes = game.add.group(pgSprite);
    pgSolidBoxes.enableBody = true;
    solidBox0 = pgSolidBoxes.create(0, 0, null);
    solidBox0.body.setSize(8, 8, 0, 6);
    solidBox1 = pgSolidBoxes.create(0, 0, null);
    solidBox1.body.setSize(8, 8, pgSprite.width - 8, 6);
    bricks = game.add.group();
    bricks.enableBody = true;
    timer.add(brickSpawnDelayUpper, spawnBrick);
    timer.start();
  };

  update = function() {
    (function() {
      var velocity;
      velocity = 0;
      if (cursors.left.isDown) {
        velocity -= pgSpeed;
      }
      if (cursors.right.isDown) {
        velocity += pgSpeed;
      }
      pgSprite.x += velocity;
      return pgSprite.animations.play((function() {
        switch (false) {
          case !(velocity < 0):
            return 'walkleft';
          case !(velocity > 0):
            return 'walkright';
          default:
            return 'stand';
        }
      })());
    })();
    game.physics.arcade.overlap(pgSolidBoxes, bricks, brickSolidCollision);
  };

  render = function() {
    return pgSolidBoxes.forEach(game.debug.body, game.debug);
  };

  spawnBrick = function() {
    var brick;
    brick = bricks.create(300, -32, 'brick');
    brick.body.gravity.y = 250;
    timer.add(brickSpawnDelayUpper, spawnBrick);
  };

  brickSolidCollision = function(box, brick) {
    var boxCentreX, brickCentreX, leftOrRight;
    if (brick.body.velocity.y > 0) {
      brick.body.y = box.body.y - box.body.height - brick.body.height;
      brick.body.velocity.y *= -0.3;
    }
    boxCentreX = box.body.x + box.body.width * 0.5;
    brickCentreX = brick.body.x + brick.body.width * 0.5;
    leftOrRight = brickCentreX < boxCentreX ? -1 : +1;
    return brick.body.velocity.x += leftOrRight * 30;
  };

  main();

}).call(this);
