(function() {
  var Phaser, bounceBrick, brickHeadCollision, brickSolidCollision, brickSpawnDelayLower, brickSpawnDelayUpper, bricks, create, cursors, game, main, pgBonkTime, pgHeadBoxes, pgHeadState, pgSolidBoxes, pgSpeed, pgSprite, pgSquashTime, pgState, preload, processPgBonkState, processPgNormalState, render, spawnBrick, timer, update;

  Phaser = window.Phaser;

  brickSpawnDelayLower = 1500;

  brickSpawnDelayUpper = 3000;

  pgBonkTime = 300;

  pgSquashTime = 1000;

  pgSpeed = 2;

  bricks = null;

  cursors = null;

  game = null;

  pgHeadBoxes = null;

  pgSolidBoxes = null;

  pgSprite = null;

  pgState = 'normal';

  pgHeadState = 'normal';

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
    var headBox0, solidBox0, solidBox1;
    game.physics.startSystem(Phaser.Physics.ARCADE);
    timer = game.time.create(false);
    cursors = game.input.keyboard.createCursorKeys();
    game.stage.backgroundColor = 'rgb(128, 175, 168)';
    pgSprite = game.add.sprite((game.world.width / 2) - 32, game.world.height - 64, 'punchguy', 0);
    pgSprite.animations.add('stand', [0], 1, true);
    pgSprite.animations.add('walkright', [1, 2, 0], 6, true);
    pgSprite.animations.add('walkleft', [2, 1, 0], 6, true);
    pgSprite.animations.add('bonk', [3], 1, true);
    pgSprite.headGraphic = pgSprite.addChild(game.add.sprite(0, 0, 'punchguy'));
    pgSprite.headGraphic.animations.add('normal', [4], 1, true);
    pgSprite.headGraphic.animations.add('bonk', [5], 1, true);
    pgSprite.headGraphic.animations.add('squash', [6], 1, true);
    pgSprite.headGraphic.animations.play('normal');
    pgSolidBoxes = game.add.group(pgSprite);
    pgSolidBoxes.enableBody = true;
    solidBox0 = pgSolidBoxes.create(0, 0, null);
    solidBox0.body.setSize(8, 8, 0, 6);
    solidBox1 = pgSolidBoxes.create(0, 0, null);
    solidBox1.body.setSize(8, 8, pgSprite.width - 8, 6);
    pgHeadBoxes = game.add.group(pgSprite);
    pgHeadBoxes.enableBody = true;
    headBox0 = pgHeadBoxes.create(0, 0, null);
    headBox0.body.setSize(12, 12, 26, 2);
    bricks = game.add.group();
    bricks.enableBody = true;
    timer.add(brickSpawnDelayUpper, spawnBrick);
    timer.start();
  };

  update = function() {
    if (pgState === 'normal') {
      processPgNormalState();
    }
    if (pgState === 'bonk') {
      processPgBonkState();
    }
    pgSprite.headGraphic.animations.play((function() {
      switch (pgHeadState) {
        case 'normal':
          return 'normal';
        case 'squash':
          return 'squash';
        case 'bonk':
          return 'bonk';
      }
    })());
  };

  processPgNormalState = function() {
    game.physics.arcade.overlap(pgHeadBoxes, bricks, brickHeadCollision);
    if (pgState !== 'normal') {
      return;
    }
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
    return game.physics.arcade.overlap(pgSolidBoxes, bricks, brickSolidCollision);
  };

  processPgBonkState = function() {
    return pgSprite.animations.play('bonk');
  };

  render = function() {};

  spawnBrick = function() {
    var brick;
    brick = bricks.create(300, -32, 'brick');
    brick.body.gravity.y = 250;
    timer.add(brickSpawnDelayUpper, spawnBrick);
  };

  brickSolidCollision = function(box, brick) {
    return bounceBrick(brick, box);
  };

  brickHeadCollision = function(head, brick) {
    pgState = 'bonk';
    pgHeadState = 'bonk';
    timer.add(pgBonkTime, function() {
      pgState = 'normal';
      return pgHeadState = 'squash';
    });
    timer.add(pgSquashTime, function() {
      return pgHeadState = 'normal';
    });
    timer.start();
    return bounceBrick(brick, head);
  };

  bounceBrick = function(brick, box) {
    var boxCentreX, brickCentreX, leftOrRight;
    if (brick.body.velocity.y > 0) {
      brick.body.y = box.body.y - box.body.height - brick.body.height;
      brick.body.velocity.y *= -0.3;
    }
    boxCentreX = box.body.x + box.body.width * 0.5;
    brickCentreX = brick.body.x + brick.body.width * 0.5;
    leftOrRight = brickCentreX < boxCentreX ? -1 : +1;
    brick.body.velocity.x += leftOrRight * 30;
  };

  main();

}).call(this);
