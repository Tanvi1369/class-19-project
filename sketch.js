var PLAY = 1;
var END = 0;
var gameState = PLAY;
var backgroundimg;
var jumpSound, collidedSound, dieSound, checkpointSound;
var obsta1, obsta2, obsta3, obsta4, obsta5, obsta6, obsta7, obsta8, obsta9, obsta10;
var obstaclesGroup, cloudsGroup;
var gameOver, restart;
var running_ball, running_trex, ball, trex_collided ;
var ground, groundImage, ground2, edges, invisibleGround;
var goalImage, goal;
var cloudsGroup, cloudImage, cloud;
var score;

function preload(){
    running_ball = loadImage("ball.png");
    running_trex = loadAnimation("trex1.png","trex3.png","trex4.png");
    groundImage = loadImage("ground2.png");
    goalImage = loadImage("goal.jpg");
    trex_collided = loadImage("trex_collided.png");
    cloudImage = loadImage("cloud.png");
    jumpSound = loadSound("jump.wav");
    collidedSound = loadSound("collided.wav");
    backgroundImg = loadImage("backgroundimg.jpg");
    obsta2 = loadImage("obsta2.png");
    obsta3 = loadImage("obsta3.png");
    obsta4 = loadImage("obsta4.png");
    obsta5 = loadImage("obsta5.png");
    obsta6 = loadImage("obsta6.png");
    obsta7 = loadImage("obsta7.png");
    obsta8 = loadImage("obsta8.png");
    obsta9 = loadImage("obsta9.png");
    obsta10 = loadImage("obsta10.png");
    gameOverImg = loadImage("gameOver.png");
    restartImg = loadImage("restart.png");  
    dieSound = loadSound("die.mp3")
    checkpointSound = loadSound("checkPoint.mp3")
}

function setup() {

    createCanvas(600,200);

    createCanvas(windowWidth, windowHeight);

    ground = createSprite(200,180,400,20);
    ground.addImage("ground",groundImage);
    ground.x = ground.width/2;
    ground.velocityX = -4; 


    invisibleGround = createSprite(200,190,400,10);
    invisibleGround.visible=false;

    invisibleGround = createSprite(width/2,height-10,width,125);  

    edges = createEdgeSprites();

    ball = createSprite(130,160,20,50);
    ball.scale = 0.06;
    ball.x = 130;
    ball.addImage("running",running_ball);

    trex = createSprite(35,160,20,50);
    trex.addAnimation("running", running_trex);
    trex.addAnimation("collided", trex_collided);
    trex.scale = 0.6;
    trex.x = 35;

    gameOver = createSprite(300,100);
    gameOver.addImage(gameOverImg);

    restart = createSprite(300,140);
    restart.addImage(restartImg);
    
    gameOver.scale = 0.5;
    restart.scale = 0.3;
    
    obstaclesGroup = createGroup();
    cloudsGroup = createGroup();

    score = 0;

    goal= createSprite(1300,160,20,50);
    goal.addImage("goal", goalImage);
    goal.scale = 0.45;
    goal.x = 1300;
      

}

function draw() {

    background("white");
    
    text("Score: "+ score, 635,50);
    text("help the ball to reach the goal before the trex crushes it",500,200);

    trex.collide(ground)
    ground.velocityX=-2;

    ball.collide(ground)
    ground.velocityX=-2;
    
    if (ground.x<0){
      ground.x=ground.width/2;
    }

    if (keyDown("space")&& ball.y>=125) {
        ball.velocityY = -10;
        }
        ball.velocityY = ball.velocityY + 0.8
        
        ball.collide(invisibleGround);

        

        if(gameState === PLAY){

            gameOver.visible = false;
            restart.visible = false;
            
            ground.velocityX = -(4 + 3* score/100)
          
            score = score + Math.round(getFrameRate()/60);
            
            if(score>0 && score%100 === 0){
               checkPointSound.play() 
            }
            
            if (ground.x < 0){
              ground.x = ground.width/2;
            }
            
            if(keyDown("space")&& ball.y >= 100) {
                ball.velocityY = -12;
                jumpSound.play();
            }
            
            ball.velocityY = ball.velocityY + 0.8
          
            
            spawnClouds();
          
            
            spawnObstacles();
            
            if(obstaclesGroup.isTouching(ball)){
                trex.velocityX = 1;
                ball.velocityX = 0
                jumpSound.play();
                gameState = END;
                dieSound.play()
              
            }
          }
           else if (gameState === END) {
              
             
              trex.changeAnimation("collided", trex_collided);
            
              ground.velocityX = 0;
              trex.velocityY = 0
              
              obstaclesGroup.setLifetimeEach(-1);
              cloudsGroup.setLifetimeEach(-1);
             
              obstaclesGroup.setVelocityXEach(0);
              cloudsGroup.setVelocityXEach(0);  
              

              if (trex.isTouching(ball)){
                gameOver.visible = true;
                restart.visible = true;  
                trex.destroyEach();  
              }
           
           }
          
         
          //stop trex from falling down
          ball.collide(invisibleGround);
          
          if(mousePressedOver(restart)) {
              reset();
            }
        
    
        drawSprites();

}
  
function reset(){
    gameState = PLAY;
    restart.visible = false;
    gameOver.visible = false;
    obstaclesGroup.destroyEach();
    cloudsGroup.destroyEach();
    trex.changeAnimation("running",trex_running);
    score = 0;
   
   }
   function spawnObstacles(){
    if (frameCount % 60 === 0){
      var obstacle = createSprite(600,165,10,40);
      obstacle.velocityX = -(6 + score/100);
      
       
       var rand = Math.round(random(1,6));
       switch(rand) {
         case 1: obstacle.addImage(obsta7);
                 break;
         case 2: obstacle.addImage(obsta2);
                 break;
         case 3: obstacle.addImage(obsta3);
                 break;
         case 4: obstacle.addImage(obsta4);
                 break;
         case 5: obstacle.addImage(obsta5);
                 break;
         case 6: obstacle.addImage(obsta6);
                 break;
         case 7: obstacle.addImage(obsta8);
                 break;
         case 8: obstacle.addImage(obsta9);
                 break;        
         case 9: obstacle.addImage(obsta10);
                 break;
         default: break;
       }
                
       obstacle.scale = 0.2;
       obstacle.lifetime = 300;
      
      
       obstaclesGroup.add(obstacle);
    }
   }

   function spawnClouds() {
    
    if (frameCount % 60 === 0) {
      var cloud = createSprite(600,120,40,10);
      cloud.y = Math.round(random(80,120));
      cloud.addImage(cloudImage);
      cloud.scale = 0.5;
      cloud.velocityX = -3;
      
      
      cloud.lifetime = 200;
      
      cloud.depth = ball.depth;
      ball.depth = ball.depth + 1;
      
      cloudsGroup.add(cloud);
    }
  }
