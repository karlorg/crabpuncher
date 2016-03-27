# out: punchpunchpunch.js

{Phaser} = window

brickSpawnDelayLower = 1500
brickSpawnDelayUpper = 3000
pgBonkTime = 300
pgSquashTime = 1000
pgSpeed = 2

bricks = null
cursors = null
game = null
pgHeadBoxes = null
pgSolidBoxes = null
pgSprite = null
pgState = 'normal'
pgHeadState = 'normal'
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
  pgSprite.animations.add 'bonk', [3], 1, true
  pgSprite.headGraphic = pgSprite.addChild(
    game.add.sprite(0, 0, 'punchguy'))
  pgSprite.headGraphic.animations.add 'normal', [4], 1, true
  pgSprite.headGraphic.animations.add 'bonk', [5], 1, true
  pgSprite.headGraphic.animations.add 'squash', [6], 1, true
  pgSprite.headGraphic.animations.play 'normal'

  pgSolidBoxes = game.add.group pgSprite
  pgSolidBoxes.enableBody = true

  solidBox0 = pgSolidBoxes.create 0, 0, null
  solidBox0.body.setSize(8, 8, 0, 6)
  solidBox1 = pgSolidBoxes.create 0, 0, null
  solidBox1.body.setSize(8, 8, pgSprite.width - 8, 6)

  pgHeadBoxes = game.add.group pgSprite
  pgHeadBoxes.enableBody = true
  headBox0 = pgHeadBoxes.create 0, 0, null
  headBox0.body.setSize(12, 12, 26, 2)

  bricks = game.add.group()
  bricks.enableBody = true
  timer.add brickSpawnDelayUpper, spawnBrick
  timer.start()
  return

update = ->
  if pgState == 'normal' then processPgNormalState()
  if pgState == 'bonk' then processPgBonkState()
  pgSprite.headGraphic.animations.play switch pgHeadState
    when 'normal' then 'normal'
    when 'squash' then 'squash'
    when 'bonk' then 'bonk'
  return

processPgNormalState = ->
  game.physics.arcade.overlap pgHeadBoxes, bricks, brickHeadCollision
  return if pgState != 'normal'
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

processPgBonkState = ->
  pgSprite.animations.play 'bonk'

render = ->
  # pgHeadBoxes.forEach game.debug.body, game.debug

spawnBrick = ->
  brick = bricks.create 300, -32, 'brick'
  brick.body.gravity.y = 250
  timer.add brickSpawnDelayUpper, spawnBrick
  return

brickSolidCollision = (box, brick) ->
  bounceBrick(brick, box)

brickHeadCollision = (head, brick) ->
  pgState = 'bonk'
  pgHeadState = 'bonk'
  timer.add pgBonkTime, ->
    pgState = 'normal'
    pgHeadState = 'squash'
  timer.add pgSquashTime, -> pgHeadState = 'normal'
  timer.start()
  bounceBrick(brick, head)

bounceBrick = (brick, box) ->
  if brick.body.velocity.y > 0
    brick.body.y = box.body.y - box.body.height - brick.body.height
    brick.body.velocity.y *= -0.3
  boxCentreX = box.body.x + box.body.width * 0.5
  brickCentreX = brick.body.x + brick.body.width * 0.5
  leftOrRight = if brickCentreX < boxCentreX then -1 else +1
  brick.body.velocity.x += leftOrRight * 30
  return

main()
