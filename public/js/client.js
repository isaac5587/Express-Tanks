var win;
//var tank; // Just this instance of the tank
let tanks = []; // All tanks in the game
let deadTanks = [];
let shots = []; // All shots in the game
let weapons = []; //All weapons in the game
let powerups = [];//All powerups in the game
let dataWeapons = [{x:300,y:300,r:2}];
var weaponIndex = 0;
var socketID;
var mytankid;
var myTankIndex = -1;
var buzz = undefined;
var powerUpCount = 0;
var socket;
var oldTankx, oldTanky, oldTankHeading;
var fps = 60; // Frames per second
var PlayerName = "";
var DEBUG = 0;
var loopCount = 0.0;  // Keep a running counter to handle animations
let loop;

//FNs
const compareTanks = (t, tprev) => {
  if (t.tankid < tprev.tankid) return -1;
  if (t.tankid > tprev.tankid) return 1;
  return 0;
}
const sortTanks = (tankarr) => {
  let ids = [];
  tankarr.map(t => ids.push(t.tankid));
  ids = ids.sort();
  return tankarr.sort(compareTanks)
}

// Sounds activated
const soundLib = new sounds();


// Initial Setup
function setup() {

 

  // Start the audio context on a click/touch event
  userStartAudio().then(function () {
    // Audio context is started - Preload any needed sounds
    soundLib.loadLibSound('saw');
    soundLib.loadLibSound('cannon');
    soundLib.loadLibSound('tankfire');
    soundLib.loadLibSound('dpop');
  });

  // Get the Player
  PlayerName = document.getElementById('playerName').value;

  // Set drawing parmameters
  rectMode(CENTER);
  textAlign(CENTER, CENTER);

  // Set window size and push to the main screen
  // Good DEV size
  win = { width: 600, height: 600 };
  // Good PROD size
  //  win = { width: 900, height: 700 };
  var canvas = createCanvas(win.width, win.height);
  canvas.parent('sketch-holder');

  // Set the framerate so everyone is *hopefully* the same
  frameRate(fps); // As low as possible to not tax slow systems

  // Create a socket to the main server
  const server = window.location.hostname + ":" + location.port;
  socket = io.connect(server, { transports: ['polling'] });

  // All the socket method handlers
  socket.on('ServerReadyAddNew', ServerReadyAddNew);
  socket.on('ServerNewTankAdd', ServerNewTankAdd);
  socket.on('ServerTankRemove', ServerTankRemove);
  socket.on('ServerMoveTank', ServerMoveTank);
  socket.on('ServerResetAll', ServerResetAll);
  socket.on('ServerMoveShot', ServerMoveShot);
  socket.on('ServerNewShot', ServerNewShot);
  socket.on('ServerBuzzSawNewChaser', ServerBuzzSawNewChaser);
  socket.on('ServerBuzzSawMove', ServerBuzzSawMove);
  socket.on('ServerDamageTaken', ServerDamageTaken);

  // Join (or start) a new game //OnConnect
  socket.on('connect', data => {
    socketID = socket.io.engine.id;
    console.log('Player: ' + PlayerName + ', ID: ' + socketID);
    socket.emit('ClientNewJoin', socketID);
  });
  socket.on('disconnect', reason => {
    //remove tank and don't add it into destroyedTanks
    if (reason == 'ping timeout' || reason == 'transport close') {
      let id = socket.io.engine.id;
      deadTanks.map((deadTank, index) => {
        if (deadTank.tankid == id) {
          // deadTanks.splice(index, 1);
          // deadTank.show = false;
        };
      })
      tanks.map((tank, index) => {
        if (tank.id == id) tanks.splice(index, 1);
      });
    }
  })

  // Create a new Buzz
  //  buzz = new Buzzsaw(win.width/2, win.height/2, color('#ffdc49'));
}

// Draw the screen and process the position updates
function draw() {
  background(155, 155, 155);
  //check if the tank collides with a weapon if so assign that weapon t0 the tank
  checkIfTankWeaponCollide();
  //check if the tank collides with a powerup if so assign to tank
  checkIfTankPowerUpCollide();
  //weapon show
  for (i = 0; i < dataWeapons.length; i++) {
   updateWeapons();
  }
  for (i = 0; i < weapons.length; i++) {
    weapons[i].show();
  }
  //powerup show
  for (i = 0; i < powerups.length; i++) {
    powerups[i].show();
  }
  // Loop counter
  if (loopCount > 359 * 10000)
    loopCount = 0;
  else
    loopCount++;

  // Process shots
  for (var i = shots.length - 1; i >= 0; i--) {
    if (myTankIndex < 0) myTankIndex = sortTanks(tanks).findIndex(t => t.tankid == socketID);
    if (myTankIndex >= 0) {
      if (shots[i] == undefined || tanks.find(t => t.tankid == shots[i].tankid) == undefined) return;
      shots[i].render(tanks.find(t => t.tankid == shots[i].tankid).bulletRadius);
      shots[i].update();
      if (shots[i].offscreen()) {
        shots.splice(i, 1);
      }
      else {
        let shotData = {
          x: shots[i].pos.x, y: shots[i].pos.y,
          shotid: shots[i].shotid,
          damageTaken: tanks[myTankIndex] ? tanks[myTankIndex].damageTaken : 30,
          used: false
        };

        socket.emit('ClientMoveShot', shotData);
      }
    }
  }
  //Process dead tanks
  deadTanks.map(dt => {
    dt.render();
  })
  // Process all the tanks by iterating through the tanks array
  if (tanks && tanks.length > 0) {
    for (var t = 0; t < tanks.length; t++) {
      if (tanks[t].tankid == mytankid) {
        tanks[t].render();
        tanks[t].turn();
        tanks[t].update();

        // Check for off screen and don't let it go any further
        if (tanks[t].pos.x - tanks[t].r / 2 < 0)
          tanks[t].pos.x = tanks[t].r / 2;
        if (tanks[t].pos.x + tanks[t].r / 2 > win.width)
          tanks[t].pos.x = win.width - tanks[t].r / 2;
        if (tanks[t].pos.y - tanks[t].r / 2 < 0)
          tanks[t].pos.y = tanks[t].r / 2;
        if (tanks[t].pos.y + tanks[t].r / 2 > win.height)
          tanks[t].pos.y = win.height - tanks[t].r / 2;

      }
      else {  // Only render if within 150 pixels
        //          var dist = Math.sqrt( Math.pow((tanks[myTankIndex].pos.x-tanks[t].pos.x), 2) + Math.pow((tanks[myTankIndex].pos.y-tanks[t].pos.y), 2) );
        //          if(dist < 151)
        tanks[t].render();
      }
    }

    // Temporary Buzzsaw
    if (buzz) {
      buzz.render(this.loopCount);
      buzz.update(tanks[myTankIndex]);
      buzz.checkBuzzShot();
    }
  }

  // To keep this program from being too chatty => Only send server info if something has changed

  if (myTankIndex >= 0 && tanks[myTankIndex]) {
    if (tanks.findIndex(t => t.tankid == socketID) < 0) {
      alert('you died!');
      location.reload();
    };
    myTankIndex = sortTanks(tanks).findIndex(t => t.tankid == mytankid);
    if (oldTankx != tanks[myTankIndex].pos.x || oldTanky != tanks[myTankIndex].pos.y || oldTankHeading != tanks[myTankIndex].heading) {
      let newTank = {
        x: tanks[myTankIndex].pos.x, y: tanks[myTankIndex].pos.y,
        heading: tanks[myTankIndex].heading, tankColor: tanks[myTankIndex].tankColor,
        tankid: tanks[myTankIndex].tankid, damageTaken: 0,
        bulletRadius: 10
      };
      // redefined newTank to Tank object as is better practice
      // let myTank = tanks[myTankIndex];
      // let newTank = new Tank(createVector(myTank.pos), myTank.tankColor, myTank.tankid, myTank.PlayerName);
      // newTank.heading = myTank.heading;
      socket.emit('ClientMoveTank', newTank);
      oldTankx = tanks[myTankIndex].pos.x;
      oldTanky = tanks[myTankIndex].pos.y;
      oldTankHeading = tanks[myTankIndex].heading;
    }
  }
}


// Handling pressing a Key
function keyPressed() {
  if (!tanks[myTankIndex])
    return;
  // Can not be a destroyed tank!
  if (tanks[myTankIndex].destroyed)
    return;

  if (key == ' ') {             // Fire Shell
    clearInterval(loop);
    loop = setInterval(() => {
      const shotid = new Date().getTime();
      // const shotid = random(0, 50000);
      if (!tanks[myTankIndex]) return;
      shots.push(new Shot(shotid, mytankid, tanks[myTankIndex].pos,
        tanks[myTankIndex].heading, tanks[myTankIndex].tankColor, tanks[myTankIndex].damage));
      let newShot = {
        x: tanks[myTankIndex].pos.x, y: tanks[myTankIndex].pos.y, heading: tanks[myTankIndex].heading,
        tankColor: tanks[myTankIndex].tankColor, shotid: shotid, tankid: mytankid, damage: tanks[myTankIndex].damage,
        used: false
      };
      socket.emit('ClientNewShot', newShot);
      // Play a shot sound
      // soundLib.playSound('tankfire');
      soundLib.playSound('dpop');

      return;
    }, tanks[myTankIndex].currentweapon.delay * 100);
  } else if (keyCode == RIGHT_ARROW) {  // Move Right
    tanks[myTankIndex].setRotation(0.1);
  } else if (keyCode == LEFT_ARROW) {   // Move Left
    tanks[myTankIndex].setRotation(-0.1);
  } else if (keyCode == UP_ARROW) {     // Move Forward
    tanks[myTankIndex].moveForward(1.0);
  } else if (keyCode == DOWN_ARROW) {   // Move Back
    tanks[myTankIndex].moveForward(-1.0);
  }


}

// Release Key
function keyReleased() {
  if (!tanks[myTankIndex]) return;
  if (tanks[myTankIndex].destroyed) return;
  if (key == ' ') {
    clearInterval(loop)
  }
  if (keyCode == RIGHT_ARROW || keyCode == LEFT_ARROW)
    tanks[myTankIndex].setRotation(0.0);
  if (keyCode == UP_ARROW || keyCode == DOWN_ARROW)
    tanks[myTankIndex].stopMotion();
}


//  ***** Socket communication handlers ******

function ServerReadyAddNew(data) {
  console.log('Server Ready');

  // Reset the tanks
  tanks = [];
  mytankid = undefined;
  myTankIndex = -1;

  // Create the new tank
  // Make sure it's starting position is at least 20 pixels from the border of all walls
  let startPos = createVector(Math.floor(Math.random() * (win.width - 40) + 20), Math.floor(Math.random() * (win.height - 40) + 20));
  let startColor = color(Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255));
  let newTank = { x: startPos.x, y: startPos.y, heading: 0, tankColor: startColor, tankid: socketID, playername: PlayerName, damageTaken: 0, bulletRadius: 10 };

  mytankid = socketID;

  var newTankObj = new Tank(startPos, startColor, mytankid, PlayerName)
  tanks.push(newTankObj);
  tanks = sortTanks(tanks);

  // Create the new tank and add it to the array
  myTankIndex = tanks.findIndex(tank => tank.tankid === mytankid);
  // myTankIndex = tanks.length;

  // Send this new tank to the server to add to the list
  socket.emit('ClientNewTank', newTank);
}

// Server got new tank -- add it to the list
function ServerNewTankAdd(data) {
  // tanks = sortTanks(tanks.filter(t => !t.destroyed));
  myTankIndex = tanks.findIndex(tank => tank.tankid === mytankid);
  if (DEBUG && DEBUG == 1)
    console.log(data);

  // Add any tanks not yet in our tank array
  var tankFound = false;
  if (tanks !== undefined) {
    for (var d = 0; d < data.length; d++) {
      var foundIndex = -1;
      for (var t = 0; t < tanks.length; t++) {
        // If found a match, then stop looking
        if (tanks[t].tankid == data[d].tankid) {
          tankFound = true;
          foundIndex = t;
          break;
        }
      }
      if (!tankFound && foundIndex < 0) {
        // Add this tank to the end of the array
        let startPos = createVector(Number(data[d].x), Number(data[d].y));
        let c = color(data[d].tankColor.levels[0], data[d].tankColor.levels[1], data[d].tankColor.levels[2]);

        ////////////////NEW TANK///////////////

        let newTankObj = new Tank(startPos, c, data[d].tankid, data[d].playername);
        let defaultGun = new rpg();
        newTankObj.assignWeapon(defaultGun);
        tanks.push(newTankObj);
        tanks = sortTanks(tanks.filter(t => !t.destroyed));
        myTankIndex = tanks.findIndex(tank => tank.tankid === mytankid);
      }
      tankFound = false;
    }
  }

}

function ServerTankRemove(socketid) {
  //      console.log('Remove Tank: ' + socketid);

  if (!tanks || myTankIndex < 0)
    return;

  for (var i = tanks.length - 1; i >= 0; i--) {
    if (tanks[i].tankid == socketid) {
      tanks[i].destroyed = true;
      deadTanks.push(tanks[i]);
      tanks = sortTanks(tanks.filter(t => !t.destroyed));
      myTankIndex = tanks.findIndex(t => t.tankid == mytankid);
      return;
    }
  }
}

function ServerMoveTank(data) {

  if (DEBUG && DEBUG == 1)
    // console.log('Move Tank: ' + JSON.stringify(data));

    if (!tanks || !tanks[myTankIndex] || !data || !data.tankid || tanks[myTankIndex].tankid == data.tankid)
      return;

  for (var i = tanks.length - 1; i >= 0; i--) {
    if (tanks[i].tankid == data.tankid) {
      tanks[i].pos.x = Number(data.x);
      tanks[i].pos.y = Number(data.y);
      tanks[i].heading = Number(data.heading);
      break;
    }
  }
}

function ServerNewShot(data) {
  tanks = sortTanks(tanks.filter(t => !t.destroyed));
  myTankIndex = tanks.findIndex(tank => tank.tankid === mytankid);
  // let currentweapon = tanks[myTankIndex].currentweapon;
  // First check if this shot is already in our list
  if (shots !== undefined) {
    for (var i = 0; i < shots.length; i++) {
      if (shots[i].shotid == data.shotid) {
        return; // dont add it
      }
    }
  }
  // Add this shot to the end of the array
  let c = color(data.tankColor.levels[0], data.tankColor.levels[1], data.tankColor.levels[2]);
  // if (data.tankid !== socketID) return;
  shots.push(new Shot(data.shotid, data.tankid, createVector(data.x, data.y), data.heading, c, tanks[myTankIndex] ? tanks[myTankIndex].damage : 5));
  // console.log(tanks[myTankIndex])
}

function ServerMoveShot(data) {
  // console.log('moving shot')
  if (DEBUG && DEBUG == 1)
    // console.log('Move Shot: ' + data);

    for (var i = shots.length - 1; i >= 0; i--) {
      if (shots[i].shotid == data.shotid) {
        shots[i].pos.x = Number(data.x);
        shots[i].pos.y = Number(data.y);
        break;
      }
    }
}

//Taken Damage
function ServerDamageTaken(data) {
  let id = data.tankid;
  let damage = data.damageTaken;
  let tank = sortTanks(tanks).find(t=>t.tankid==id);
  if (!tank) return;
  let index = sortTanks(tanks).findIndex(t=>t.tankid==id);
  tank.damageTaken = damage;
  tanks[index] = tank;
  console.log('E')
}


// Handle a restart command
function Restart() {
  socket.emit('ClientResetAll');
}

// The call to reload all pages
function ServerResetAll(data) {
  console.log('Reset System');
  document.forms[0].submit();
  //      location.reload();
}

/************  Buzz Saw  ***************/

// Set the new target for Buzz
function ServerBuzzSawNewChaser(data) {
  if (buzz) {
    buzz.setTarget(data);
  }
}

// Set the position of the Buzz saw
function ServerBuzzSawMove(data) {
  if (buzz) {
    buzz.position.x = data.x;
    buzz.position.y = data.y;
    buzz.velocity.x = data.xvel;
    buzz.velocity.y = data.yvel;
  }
}
//switches weapons ,there can never be more than 3 weapons onscreen at a time 
// function switchWeapon() {
//   if (weapons.length < 3) {
//     let r = round(random(0, 3))
//     let machinegunTemp = new machinegun(random(0, 600), random(0, 600));
//     let rpgTemp = new rpg(random(0, 600), random(0, 600));
//     let sniperTemp = new sniper(random(0, 600), random(0, 600));
//     if (r == 1) {
//       weapons.push(machinegunTemp);
//     }
//     else if (r == 2) {
//       weapons.push(rpgTemp);
//     }
//     else if (r == 3) {
//       weapons.push(sniperTemp);
//     }
//   }
// }
//switches the medkit and shield can never be more than 2 onscreen at a time 
function switchPowerUp() {
  if (powerups.length < 2) {
    let r = round(random(0, 2))
    let shieldTemp = new shield(random(0, 600), random(0, 600));
    let medkitTemp = new medkit(random(0, 600), random(0, 600));
    if (r == 1) {
      powerups.push(shieldTemp);
    }
    else if (r == 2) {
      powerups.push(medkitTemp);
    }

  }
}
function checkIfTankWeaponCollide() {
  let weaponsToDelete = [];
  if (!weapons.length) return;
  // console.log(weapons)
  weapons.map(w => {
    tanks.map(t => {
      // let iterate = true;
      if (t.destroyed || tanks.findIndex(t => t.tankid == socketID) < 0) iterate = false;
      if (dist(w.xpos, w.ypos, t.pos.x, t.pos.y) < 25) {
        t.assignWeapon(w)
        weaponsToDelete.push(w);
        clearInterval(loop);
        key = ' ';
        keyPressed();
        //tanks = sortTanks(tanks);
        //tanks.findIndex(t=>t.tankid==socketID)
        // if (iterate) console.log(tanks[myTankIndex].currentweapon);

      }
    })
  });
  weapons = weapons.filter(weapon => !weaponsToDelete.includes(weapon));
}

function checkIfTankPowerUpCollide() {
  let weaponsToDelete = [];
  if (!powerups.length) return;
  // console.log(weapons)
  powerups.map(w => {
    tanks.map(t => {
      console.log(t)
      if (dist(w.xpos, w.ypos, t.pos.x, t.pos.y) < 25) {
        t.assignPowerup(w)
        weaponsToDelete.push(w);
        clearInterval(loop);

      }
    })
  });
  powerups = powerups.filter(powerups => !weaponsToDelete.includes(powerups));
}
function updateWeapons(){
  for(let i = 0; i < dataWeapons.length; i++){
    if(dataWeapons[i].type == 1 ){
     weapons.push(new machinegun(dataWeapons[i].x,dataWeapons[i].y))
    }
    else if(dataWeapons[i].type == 2){
      weapons.push(new rpg(dataWeapons[i].x,dataWeapons[i].y)) 
    }
    else if(dataWeapons[i].type == 3){
      weapons.push(new sniper(dataWeapons[i].x,dataWeapons[i].y)) 
    }
  }
  
}