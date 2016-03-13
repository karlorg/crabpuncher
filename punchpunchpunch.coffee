# out: punchpunchpunch.js

{Phaser} = window

brickSpawnDelayLower = 1500
brickSpawnDelayUpper = 3000
pgSpeed = 2

bricks = null
cursors = null
game = null
pgSolidBoxes = null
pgSprite = null
timer = null

main = ->
  game = new Phaser.Game 800, 600, Phaser.AUTO, '', {
    preload, create, render, update
  }
  return

preload = ->
  game.load.spritesheet 'punchguy', 'assets/punchguy.png', 64, 64
  game.load.spritesheet 'brick', 'assets/maybe brick.png'
  return

create = ->
  game.physics.startSystem Phaser.Physics.ARCADE
  timer = game.time.create false
  cursors = game.input.keyboard.createCursorKeys()
  game.stage.backgroundColor = 'rgb(128, 175, 168)'

  pgSprite = game.add.sprite(
    (game.world.width / 2) - 32, game.world.height - 64, 'punchguy', 0)
  pgSprite.animations.add 'stand', [0], 1, true
  pgSprite.animations.add 'walkright', [1, 2, 0], 6, true
  pgSprite.animations.add 'walkleft', [2, 1, 0], 6, true

  pgSolidBoxes = game.add.group pgSprite
  pgSolidBoxes.enableBody = true

  solidBox0 = pgSolidBoxes.create 0, 0, null
  solidBox0.body.setSize(8, 8, 0, 6)
  solidBox1 = pgSolidBoxes.create 0, 0, null
  solidBox1.body.setSize(8, 8, pgSprite.width - 8, 6)

  bricks = game.add.group()
  bricks.enableBody = true
  timer.add brickSpawnDelayUpper, spawnBrick
  timer.start()
  return

update = ->
  do ->
    velocity = 0
    if cursors.left.isDown
      velocity -= pgSpeed
    if cursors.right.isDown
      velocity += pgSpeed
    pgSprite.x += velocity
    pgSprite.animations.play switch
      when velocity < 0 then 'walkleft'
      when velocity > 0 then 'walkright'
      else 'stand'

  game.physics.arcade.overlap pgSolidBoxes, bricks, brickSolidCollision
  return

render = ->
  pgSolidBoxes.forEach game.debug.body, game.debug

spawnBrick = ->
  brick = bricks.create 300, -32, 'brick'
  brick.body.gravity.y = 250
  timer.add brickSpawnDelayUpper, spawnBrick
  return

brickSolidCollision = (box, brick) ->
  if brick.body.velocity.y > 0
    brick.body.y = box.body.y - box.body.height - brick.body.height
    brick.body.velocity.y *= -0.3
  boxCentreX = box.body.x + box.body.width * 0.5
  brickCentreX = brick.body.x + brick.body.width * 0.5
  leftOrRight = if brickCentreX < boxCentreX then -1 else +1
  brick.body.velocity.x += leftOrRight * 30

main()
