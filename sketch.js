var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex,trex_running,trex_collided;
var ground,groundImage;
var invisibleGround;
var cloudGroup,cloudImage;
var obstacleGroup,obstacle1Image,obstacle2Image,obstacle3Image,obstacle4Image,obstacle5Image,obstacle6Image;
var gameOver,gameOverImage;
var restart,restartImage;
var score = 0;
var jumpSound;
var dieSound;
var checkPointSound;

function preload(){
trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
groundImage = loadImage("ground2.png");
cloudImage = loadImage("cloud.png");
obstacle1Image = loadImage("obstacle1.png");
obstacle2Image = loadImage("obstacle2.png");
obstacle3Image = loadImage("obstacle3.png");
obstacle4Image = loadImage("obstacle4.png");
obstacle5Image = loadImage("obstacle5.png");
obstacle6Image = loadImage("obstacle6.png");
trex_collided = loadAnimation("trex_collided.png");
gameOverImage = loadImage("gameOver.png");
restartImage = loadImage("restart.png");

jumpSound = loadSound("jump.mp3");
checkPointSound = loadSound("checkPoint.mp3");
dieSound = loadSound("die.mp3");
}
function setup(){
  var canvas =createCanvas(displayWidth,displayHeight);

  trex = createSprite(displayWidth/2-200,displayHeight/2,40,40);
  trex.addAnimation("running",trex_running);
  trex.addAnimation("collided",trex_collided);
  trex.scale = 1;

  ground = createSprite(displayWidth/2,displayHeight/2+200,displayWidth*100,30);
  ground.addImage(groundImage);
  ground.scale = 1;
  
  invisibleGround = createSprite(displayWidth/2,displayHeight/2+200,displayWidth*100,30);
  invisibleGround.visible = false;
  obstacleGroup = createGroup();
  cloudGroup = createGroup();

  gameOver = createSprite(displayWidth/2-200,displayHeight/2-30,50,50);
  gameOver.addImage(gameOverImage);
  gameOver.scale = 1;

  restart = createSprite(displayWidth/2-200,displayHeight/2+50,50,50);
  restart.addImage(restartImage);
  restart.scale = 1;

  score = 0;
}

function draw(){
  background("white");
  if(gameState===PLAY){
    ground.velocityX = -5;
    gameOver.visible = false;
    restart.visible = false;

    if(keyDown("space")&& trex.y>=displayHeight/2-10){
      trex.velocityY = -10;
      //jumpSound.play();


    }

    spawnClouds();
spawnObstacles();

if(ground.x<0){
  ground.x = ground.width/2;
}
ground.velocityX = -(4+3*score/100);
  }
  if(gameState===END){
    ground.velocityX = 0;
    gameOver.visible = true;
    restart.visible = true;
  }
if(trex.isTouching(obstacleGroup)){
  gameState=END;
  cloudGroup.setVelocityXEach(0);
  obstacleGroup.setVelocityXEach(0);

  cloudGroup.setLifetimeEach(-1);
  obstacleGroup.setLifetimeEach(-1);

  trex.changeAnimation("collided",trex_collided);

score = score/score;
//dieSound.play();
trex.velocityY = -12;


  
}
  camera.position.x = trex.position.x;
  camera.position.y = trex.y;

  trex.velocityY = trex.velocityY+0.8;
  trex.collide(invisibleGround);

  trex.debug = false;
  trex.setCollider("rectangle",0,0,20,20);

  if(mousePressedOver(restart)){
    reset();
  }
  score = score+Math.round(getFrameRate()/60);
  textSize(30);
  text("score : "+score,displayWidth/2+100,displayHeight/2-200);

  if(score>0 && score%100===0){
    //checkPointSound.play();
  }
  drawSprites();
}

function spawnClouds(){
  if(frameCount%60===0){
    var cloud = createSprite(displayWidth,displayHeight/2-400,50,50);
    cloud.addImage(cloudImage);
    cloud.velocityX = -5;
    cloud.y = Math.round(random(400,100));
    cloud.lifetime = -200;
    cloud.scale = 1;
    cloudGroup.add(cloud);
  }


}
function spawnObstacles(){
  if(frameCount%120===0){
    var obstacle = createSprite(displayWidth,displayHeight/2+200,40,40);
    obstacle.velocityX = -(6+score/100);
    var rand = Math.round(random(1,6));
    switch(rand){
      case 1: obstacle.addImage(obstacle1Image);
      break;

      case 2 :obstacle.addImage(obstacle2Image);
      break;

      case 3: obstacle.addImage(obstacle3Image);
      break;

      case 4:obstacle.addImage(obstacle4Image);
      break;

      case 5: obstacle.addImage(obstacle5Image);
      break;

      case 6: obstacle.addImage(obstacle6Image);
      break;

      default: break;
    }
    obstacle.scale = 1;
    obstacle.lifetime = -1000;
    obstacleGroup.add(obstacle);
  }
}
function reset(){
  gameState = PLAY;
gameOver.visible = false;
restart.visible = false;

obstacleGroup.destroyEach();
cloudGroup.destroyEach();

trex.changeAnimation("running",trex_running);
score = 0;
}