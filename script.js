let objects = []
let scene = 0;
let nevilleImg;
let objImgs = [];
let health = 100;
let nevilleLocation = [500-64, 500-128];
let score = 0;
let messages = []
let powerups = []
let stats = {
  coins: 0,
  spikes: 0,
  heal:0,
  powerup:0
}
function findContains(item) {
  return powerups.filter((key) => key.type == item).length > 0;
}
class Obj {
  constructor(type) {
    if (type != 5) {
      this.x = 200 + rand(0, 500);
    } else {
      this.x = rand(0,1) ? rand(0,100) : rand(800,900);
    }
    this.y = -20;
    this.collided = false;
    this.type = type;
    if (type == 1) {
      stats.coins++;
    } 
    if (type == 2) {
      stats.spikes++;
    } 
    if (type == 3) {
      stats.heal++;
    }
    if (type == 4) {
      stats.powerup++;
    }
  }
  step() {
    this.y+=10;
    if ((this.y > 372 && Math.abs(this.x - nevilleLocation[0]) < 90) &&this.collided == false) {
      this.collided = true;
      return true
    } else {
      return false;
    }
  }
}

let font;
function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
let start;
function setup() {
  frameRate(55);
  nevilleImg = loadImage('assets/nevillereal.png');
  objImgs.push(loadImage('assets/coinreal.png'));
  objImgs.push(loadImage('assets/spikes.png'));
  objImgs.push(loadImage('assets/addhealth.png'));
  objImgs.push(loadImage('assets/powerup.png'));
  objImgs.push(loadImage('assets/bush.png'));

  font = loadFont('./assets/Pixel_Tandy.otf');
  createCanvas(1000, 500);
  start = createButton('Start');
  start.id("start")
  start.position(500 - 75, 250);
  start.mousePressed(handleStart);  
  textFont(font)
}
function handleStart() {
  start.hide();
  scene = 1;

}

function draw() {
  if (scene != 3) {
    clear();

    background(122, 247, 144);

    noStroke();
    fill(200, 168, 139)
    rect(200, 0, 600, 500)
    textAlign(LEFT);
  }

  if (scene == 0) {
    textSize(60);
    fill('black');
    textAlign(CENTER);
    text("The Neville Game", 500, 150)
    textSize(25)
    text("How long can Neville survive?", 500, 180)

  } else if (scene == 1) {
    if (keyIsDown(LEFT_ARROW)) {
      if (nevilleLocation[0] > 208) {
        nevilleLocation[0] -= 12;
      }

    } else if (keyIsDown(RIGHT_ARROW)) {
      if (nevilleLocation[0] < 670) {
        nevilleLocation[0] += 12;
      }

    }
    if (rand(1, 150) < 5) {
      //Spawn an object :)
      const obType = rand(1,100);
      if (obType < 3) {
        objects.push(new Obj(3));
      } else if (obType < 10) {
        objects.push(new Obj(4));
      } else if (obType < 15) {
        objects.push(new Obj(1));

      } else {
        objects.push(new Obj(2));

      }

    }
    if (rand(1,50) < 7) {
      objects.push(new Obj(5));

    }
    let toRemove = []

    for (var obj of objects) {
      var oldhealth = health;
      var oldScore = score;

      if (obj.step()) {
        if (obj.type == 2) {

          health-=rand(10,20)
          if (findContains(1)) {
            health+=rand(5,10);
          }
          if (findContains(2)) {
            health = oldhealth;
          }

        } else if (obj.type == 1) {
          score+=100;
        } else if (obj.type == 3) {
          health+=rand(5,10);
          if (health > 100) {
            health = 100;
          }
        } else if (obj.type == 4) {
          powerups.push({ type: rand(1,4), time: 280 })

        }
        const nLoc = nevilleLocation[0]
        if (obj.type == 2) {
          if (oldhealth != health) {
            messages.push({ message: "-" + (oldhealth - health) + " hp", type: 2, time: 40, x: nLoc })
          } else {
            messages.push({ message: "Immune!", type: 1, time: 40, x: nLoc })

          }

        } else if (obj.type == 1) {
          messages.push({ message: "+" + (score - oldScore) + " pts", type: 1, time: 40, x: nLoc })
        } else if (obj.type == 3) {
          messages.push({ message: "+" + (health - oldhealth) + " hp", type: 1, time: 40, x: nLoc })
        } else if (obj.type ==4) {
          messages.push({ message: "+ 1 powerup", type: 1, time: 40, x: nLoc })

        }
      } else {
        if (obj.y > 500 || obj.collided == true) {

          toRemove.push(obj)
        }
      }
      image(objImgs[obj.type-1], obj.x, obj.y, 100, 100);


    }
    for (var item of toRemove) {
      objects.splice(objects.indexOf(item), 1)
    }
    image(nevilleImg, nevilleLocation[0], nevilleLocation[1], 128, 128);
    if (findContains(2)) {
      const shieldColor = color(200, 73, 255);
      shieldColor.setAlpha(100);
      fill(shieldColor)
      shieldColor.setAlpha(255);
      stroke(shieldColor)
      arc(nevilleLocation[0] + 64, 450, 150, 150, 0, PI + PI);
    } else if (findContains(1)){
      const shieldColor = color(73, 197, 255);
      shieldColor.setAlpha(100);
      fill(shieldColor)
      shieldColor.setAlpha(255);
      stroke(shieldColor)
      arc(nevilleLocation[0] + 64, 450, 150, 150, 0, PI + PI);
    }
    noStroke();
    toRemove = []
    for (var message of messages) {
      if (message.type == 2) {
        fill(255, 145, 145);
      } else {
        fill(167, 255, 145);
      }
      text(message.message, message.x, 450)
      message.time -= 1
      if (message.time < 0) {
        toRemove.push(message);
      }


    }
    for (var item of toRemove) {
      messages.splice(messages.indexOf(item), 1)
    }
    score+=1;
    if (findContains(3)) {
      score+=1;
    }
    if (findContains(4)) {
      score += 2;
    }
    textSize(25);
    fill('black');
    text("Score: " + score, 20, 30)
    rect(20,40,100,30)
    fill(255,145,145);
    rect(22, 42, 96, 26)
    fill(167,255,145);
    if (health <= 0) {
      scene = 3;
      health = 0;
    }
    rect(22, 42, 96*(health/100), 26)
    textSize(20);
    let loc = 80;
    let pNames = ["Shield", "Immunity", "Points x2", "Points x3"]
    toRemove = []
    for (var powerup of powerups) {
      fill("black");
      rect(12,loc,175,40,20)
      fill("white");
      rect(14, loc+2, 171, 36,20)
      fill("black")
      textSize(18);
      text(pNames[powerup.type-1], 21, loc+25)
      arc(165, loc+20, 30, 30, 0, (PI + PI) * ((powerup.time) / 280));
      powerup.time -=1;
      loc+=44;
      if (powerup.time < 0) {
        toRemove.push(powerup)
      }
    }
    for (var item of toRemove) {
      powerups.splice(powerups.indexOf(item), 1)
    }
    if (health <= 0) {
      return
    }





  } else if (scene == 3) {
    textSize(60);
    fill('black');
    textAlign(CENTER);
    text("The Neville Game", 500, 150)
    textSize(50);
    text("Final Score: " + score, 500, 200)
    textSize(40);
    fill(51,51,51);
    text("Spikes: " + stats.spikes, 500, 240)
    text("Coins: " + stats.coins, 500, 280)
    text("Heals: " + stats.heal, 500, 320)
    text("Powerups: " + stats.powerup, 500, 360)

  }



}
