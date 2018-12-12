//declare global variables
var falling = false;
var jumping = false;
var score = 0;
var scoreText;
var GameStates = { "START": 1, "TUTORIAL":2, "PLAY": 3, "GAMEOVER": 4 };
var state;
var playButton;
var replayButton;
var obstacle1, obstacle2, obstacle3, obstacle4, obstacle5;
var ground1, ground2, ground3;
var clickPoint;
var soundMgr;
var context
var music;
var obstacles = [];
var grounds = [];
var gameElements = [];
var highScore = 0;
var retrievedScore;
var tutButton;

//declare the object and image variables
var player,
    runAnim,
    jumpAnim,
    groundImage,
    canvas,
    backgroundImage,
    obstacle1Image,
    obstacle2Image,
    obstacle3Image,
    scoreBar,
    bgStart,
    playButtonImage,
    replayButtonImage,
    highscoreBar,
    tutorialScreen;

//the load function is the first function called and gets the canvas and the canvas context and also starts the game music
function load() {
    canvas = document.getElementById("gameCanvas");
    canvas.width = 1020;
    canvas.height = 512;
    context = canvas.getContext("2d");
    init();
};
 
function init(){

    //Background
    backgroundImage = new Image();
    backgroundImage.src = "GameAssets/BG.png";

    //Start Background
    bgStart = new Image();
    bgStart.src = "StartScreen/BGStart.png";

    // Create sprite sheet
    runAnim = new Image();
    // Load sprite sheet
    runAnim.addEventListener("load", gameLoop);
    runAnim.src = "GameAssets/Run1.png";

    // Create sprite sheet
    jumpAnim = new Image();
    // Load sprite sheet
    jumpAnim.src = "GameAssets/jump1.png";

    //create the ground image
    groundImage = new Image();
    groundImage.src = "GameAssets/ground.png";

    //create the obstacle images
    obstacle1Image = new Image();
    obstacle1Image.src = "GameAssets/obstacle-1.png";
    obstacle2Image = new Image();
    obstacle2Image.src = "GameAssets/obstacle2.png";
    obstacle3Image = new Image();
    obstacle3Image.src = "GameAssets/obstacle3.png";

    //create score bar image
    scoreBar = new Image();
    scoreBar.src = "GameAssets/Score.png";

    //create play button image
    playButtonImage = new Image();
    playButtonImage.src = "StartScreen/Play.png";

    //create replaybutton image
    replayButtonImage = new Image();
    replayButtonImage.src = "Gameover/Replay.png";

    //create replaybutton image
    highscoreBar = new Image();
    highscoreBar.src = "GameAssets/highscore.png";

    //create tutorial screen
    tutorialScreen = new Image();
    tutorialScreen.src = "StartScreen/Tutorial.png";

    

    // Create sprite object
    player = sprite({
        context: context,
        width: 1280,
        height: 160,
        image: runAnim,
        numberOfFrames: 8,
        ticksPerFrame: 4,
        x: canvas.width / 2 - 250,
        y: canvas.height / 2 + 20
    });

    //create button objects
    playButton = {
        thisImage: playButtonImage,
        x: canvas.width/2-100,
        y: canvas.height/2
    };

    tutButton = {
        thisImage: playButtonImage,
        x: canvas.width/2-100,
        y: canvas.height/2+180
    };

    replayButton = {
        thisImage: replayButtonImage,
         x: canvas.width/2-100,
         y: canvas.height/2
    };    

    //create ground objects
    ground1 = {
        thisImage: groundImage,
        x: 10,
        y: 416,
        startx: 10
    }

    ground2 = {
        thisImage: groundImage,
        x: 2100,
        y: 416,
        startx: 2100
    }

    ground3 = {
        thisImage: groundImage,
        x: 4200,
        y: 416,
        startx: 4200
    }

    //create obstacle objects
    obstacle1 = {
        thisImage: obstacle1Image,
        x: 1200,
        y: 306,
        startx: 1200
    };

    obstacle2 = {
        thisImage: obstacle2Image,
        x: 2400,
        y: 300,
        startx: 2400
    };

    obstacle3 = {
        thisImage: obstacle3Image,
        x: 3200,
        y: 280,
        startx: 3200
    };

    obstacle4 = {
        thisImage: obstacle2Image,
        x: 4400,
        y: 300,
        startx: 4400
    };

    obstacle5 = {
        thisImage: obstacle3Image,
        x: 5600,
        y: 280,
        startx: 5600
    };

    //create game objects arrays
    obstacles = [obstacle1,obstacle2,obstacle3,obstacle4,obstacle5];
    grounds = [ground1,ground2,ground3];
    gameElements = obstacles.concat(grounds);
    
    //add event listeners to mouse down for jumping
    canvas.addEventListener('mousedown', mouseDown, false);   

    //play the game music
    if (soundMgr != null)
        soundMgr.playAudio("music.mp3",true);

    if(localStorage.getItem("highscore") != null)
                    highScore = localStorage.getItem("highscore");

    //change gamestate to start to go to start menu
    state = GameStates.START;
}

// this is the main gameloop
function gameLoop() {    

     window.requestAnimationFrame(gameLoop);
     context.clearRect(0, 0, canvas.width, canvas.height);

     switch(state){
        case GameStates.START:
            //draw startscreen
            context.drawImage(bgStart, 0, 0);
            context.drawImage(playButton.thisImage, playButton.x, playButton.y);  
        break;

        case GameStates.TUTORIAL:
            //draw tutorial screen
            context.drawImage(tutorialScreen, 0, 0);
            context.drawImage(tutButton.thisImage, tutButton.x, tutButton.y);

        break;

        case GameStates.PLAY:
            //draw game
            worldUpdate();

            //draw character
            player.render();
            playerUpdate();         

            //Create score based on distance covered
            context.drawImage(scoreBar, 730, 10);
            styleText('#ffffff', '32px impact', 'left', 'middle');
            context.fillText( scoreText, 820, 48);

            //create the highscore bar showing the players current highscore in this session
            context.drawImage(highscoreBar, 10, 10);
            styleText('#ffffff', '26px impact', 'left', 'middle');
            context.fillText("HighScore: " + highScore, 25, 40);
            
            //updates the score and rounds the number to create an int
            score = score + 0.1;
            scoreText = Math.round(score);
        break;

        case GameStates.GAMEOVER:

            if(highScore <= score)
            {
                localStorage.setItem("highscore", scoreText);
            }

            if(localStorage.getItem("highscore") != null)
                   highScore = localStorage.getItem("highscore");

            score = 0;

            //reset game elements            
            resetGameElements(gameElements);
            //draw gameover screen
            context.drawImage(bgStart, 0, 0);
            context.drawImage(replayButton.thisImage, replayButton.x, replayButton.y);
            context.drawImage(scoreBar, 730, 10);
            styleText('#ffffff', '28px impact', 'left', 'middle');
            context.fillText(scoreText, 820, 48);
            context.drawImage(highscoreBar, canvas.width/2-125, canvas.height-100);
            styleText('#ffffff', '22px impact', 'left', 'middle');
            context.fillText("HighScore: " + highScore, canvas.width/2-110, canvas.height-70);

        break;
    }   
 }

 function worldUpdate()
 {    
     //draw background
    context.drawImage(backgroundImage, 0, 0);   
    //draw ground & obstacles
    updateGameElements(gameElements);
    
    //move the obstacles and ground to create the endless running game element
    if (player.x > ground2.x && player.x < ground2.x + 10)
    {
        obstacle1.x = ground1.x + 1100;
        ground1.x = ground3.x + 2100;
    }
    if (player.x > ground3.x && player.x < ground3.x + 10)
    {
        obstacle2.x = ground2.x + 200;
        obstacle3.x = ground2.x + 1200;
        ground2.x = ground1.x + 2100;
    }
    if (player.x > ground1.x && player.x < ground1.x + 10)
    {
        obstacle4.x = ground3.x + 200;
        obstacle5.x = ground3.x + 1200;
        ground3.x = ground2.x + 2100;
    }
 }

//this function takes in an array and draws the elemnts of that array to the canvas
 function updateGameElements(array)
 {
    array.forEach(function(element){       
        context.drawImage(element.thisImage, element.x, element.y); 
        translateElements(element);      
    }); 
 }

//this tranlates the drawn objects in the game to give the illusion of player movement
 function translateElements(object, xpos) {    
    object.x -= 4;
}

function resetGameElements(array)
{
   player.y = 270;
   array.forEach(function(element){       
       element.x = element.startx;       
    }); 
}

 function playerUpdate()
 {
    //if players jumping change animation
    if (jumping && player.y > 55) {
        player.numberOfFrames = 5;
        player.image = jumpAnim;
        player.width = 800;
        player.y = player.y - 4;
    }

    if (player.y < 56) {
        jumping = false;
        falling = true;
    }

    if (falling) {
        jumping = false;
    }

    if (player.y > 250) {
        player.image = runAnim;
        falling = false;
    }   
    playerCollisons();
 }

 //this check what the player is colliding with
 function playerCollisons()
 {
    if (player.y > 450) {
        if (soundMgr != null) soundMgr.playSoundEffect("death.mp3");
        state = GameStates.GAMEOVER;
    }
    //gravity
    if (jumping == false)
        player.y = player.y + 4;

    //check is player is colliding with the ground if so it negates the gravity.    
    if (player.x < (ground1.x + ground1.thisImage.width - 60) && player.x > (ground1.x) && player.y > 270 || player.x < (ground2.x + ground2.thisImage.width - 60) && player.x > (ground2.x) && player.y > 270 || player.x < (ground3.x + ground3.thisImage.width - 60) && player.x > (ground3.x) && player.y > 270)
    {  
        player.y = player.y - 4;
    }

    if (player.x < (ground1.x + ground1.thisImage.width - 60) && player.x > (ground1.x) && player.y > 276 || player.x < (ground2.x + ground2.thisImage.width - 60) && player.x > (ground2.x) && player.y > 276 || player.x < (ground3.x + ground3.thisImage.width - 60) && player.x > (ground3.x) && player.y > 276)
    {  
        player.y = player.y - 6;
    }

    obstacles.forEach(function(element){
        if(obstacleColCheck(element,element.thisImage))
        {            
            if (soundMgr != null) soundMgr.playSoundEffect("death.mp3");
            state = GameStates.GAMEOVER;
        }
    });
 }

 //this changes the font color and alightment of the text
function styleText(txtColour, txtFont, txtAlign, txtBaseline) {
    context.fillStyle = txtColour;
    context.font = txtFont;
    context.textAlign = txtAlign;
    context.textBaseline = txtBaseline;
}

//mouse down event changes game states when buttons clicked
function mouseDown(evt) {    
    switch(state){
        case GameStates.START:
            if (mousClickCheck(getMousePos(evt), playButton)) {            
                state = GameStates.TUTORIAL;
            }
        break;
        case GameStates.TUTORIAL:
            if (mousClickCheck(getMousePos(evt), tutButton)) {
                jumping = false;
                state = GameStates.PLAY;
            }
        break;
        case GameStates.PLAY:
            if(!falling)
                jumping = true;
        break;
        case GameStates.GAMEOVER:
        if (mousClickCheck(getMousePos(evt), replayButton)) {
            jumping = false;
            state = GameStates.PLAY;
        }
        break;
    }
}

function obstacleColCheck(object, image) {
    if (player.x > (object.x - image.width) && player.x < (object.x) && player.y > object.y - image.height)
        return true;
    else
        return false;
}

function mousClickCheck(col1, col2) {
    if (col1.x > (col2.x-col2.thisImage.width) && col1.x < (col2.x + col2.thisImage.width) && (col1.y > (col2.y) && col1.y < (col2.y + col2.thisImage.height)))
        return true;
    else
        return false;
}

function  getMousePos(evt) {
  var rect = canvas.getBoundingClientRect(),
      scaleX = canvas.width / rect.width,
      scaleY = canvas.height / rect.height;

  return {
    x: (evt.clientX - rect.left) * scaleX,
    y: (evt.clientY - rect.top) * scaleY
  }
}

function sprite(options) {
    //set varibales based on the object created
    frameIndex = 0,
    tickCount = 0,
    ticksPerFrame = options.ticksPerFrame || 0,
    numberOfFrames = options.numberOfFrames || 1;

    this.context = options.context;
    this.width = options.width;
    this.height = options.height;
    this.image = options.image;
    this.x = options.x;
    this.y = options.y;

    //cycle through animation
    this.update = function () {
        tickCount += 1;
        if (tickCount > ticksPerFrame) {
            tickCount = 0;
            // If the current frame index is in range
            if (frameIndex < numberOfFrames - 1) {
                // Go to the next frame
                frameIndex += 1;
            } else {
                frameIndex = 0;
            }
        }
    };

    this.render = function () {
        this.update();
        // Draw the animation
        this.context.drawImage(
            this.image,
            frameIndex * this.width / numberOfFrames,
            0,
            this.width / numberOfFrames,
            this.height,
            this.x,
            this.y,
            this.width / numberOfFrames,
            this.height);
    };

    return this;
}




