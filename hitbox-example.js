function create() {
    player = game.add.sprite(0, 0, 'mario');
    // create a group for all the player's hitboxes
    hitboxes = game.add.group();
    // give all the hitboxes a physics body (I'm using arcade physics btw)
    hitboxes.enableBody = true;
    // make the hitboxes children of the player. They will now move with the player
    player.addChild(hitboxes);
    // create a "hitbox" (really just an empty sprite with a physics body)
    var hitbox1 = hitboxes.create(0, 0, null);
    // set the size of the hitbox, and its position relative to the player
    hitbox1.body.setSize(50, 50, player.width, player.height / 2);
    // add some properties to the hitbox. These can be accessed later for use in calculations
    hitbox1.name = "punch";
    hitbox1.damage = 50;
    hitbox1.knockbackDirection = 0.5;
    hitbox1.knockbackAmt = 600;
}

// activate a hitbox by name
function enableHitbox(hitboxName) {
    // search all the hitboxes
    for (var i = 0; i < hitboxes.children.length; i++) {
        // if we find the hitbox with the "name" specified
        if (hitboxes.children[i].name === hitboxName) {
            // reset it
            hitboxes.children[i].reset(0, 0);
        }
    }
}

// disable all active hitboxes
function disableAllHitboxes() {
    hitboxes.forEachExists(function(hitbox) {
        hitbox.kill();
    });
}
