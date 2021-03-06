window.addEventListener('load', function() {

    (function() {
        var lastTime = 0;
        var vendors = ['ms', 'moz', 'webkit', 'o'];
        for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
            window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
            window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] 
                                       || window[vendors[x]+'CancelRequestAnimationFrame'];
        }
     
        if (!window.requestAnimationFrame)
            window.requestAnimationFrame = function(callback, element) {
                var currTime = new Date().getTime();
                var timeToCall = Math.max(0, 16 - (currTime - lastTime));
                var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
                  timeToCall);
                lastTime = currTime + timeToCall;
                return id;
            };
     
        if (!window.cancelAnimationFrame)
            window.cancelAnimationFrame = function(id) {
                clearTimeout(id);
            };
    }());
    
    // A variable to store the requestID.
    var requestID;

    //declare canvas
    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");

    var GAME_WIDTH = canvas.width;
    var GAME_HEIGHT = canvas.height;

    var gameColor = "#22ad32"
    var gameStatus = 'start'; //start, running, pause, finish
    var gameLive = true;
    var level = 1;

    var startButton = {
        x: 120,
        y: 180,
        w: 120,
        h: 60,
        draw: function() {
            ctx.font = "25px 'minecraftmedium'";
            ctx.fillText("Press space to start The Game",this.x,this.y);
            // ctx.fillText("start The Game",this.x,this.y);
        }
    }

    var restartButton = {
        x: 90,
        y: 180,
        w: 100,
        h: 50,
        draw: function() {
            ctx.font = "30px 'minecraftmedium'";
            ctx.fillText("Game is Over - Space to Start",this.x,this.y);
        }
    }

    var pauseButton = {
        x: 150,
        y: 180,
        w: 100,
        h: 50,
        draw: function() {
            ctx.font = "40px 'minecraftmedium'";
            ctx.fillText("Game is Paused",this.x,this.y);
        }
    }

    //set enemy object
    var enemy = {
        name: "enemy",
        x: GAME_WIDTH - 30,
        y: (GAME_HEIGHT - 100) / 2,
        speedY: 2,
        w: 15,
        h: 100,
        isMovingDown: false,
        isMovingUp: false,
        score: 0
    }

    //set player object
    var player = {
        name: "player",
        x: 20,
        y: (GAME_HEIGHT - 100) / 2,
        speedY: 6,
        w: 15,
        h: 100,
        isMovingDown: false,
        isMovingUp: false,
        score: 0
    }
    // set ball object
    var ball = {
        x:  GAME_WIDTH - 50,
        y: (GAME_HEIGHT - 15) / 2,
        speedY: -6,
        speedX: -6,
        w: 15,
        h: 15
    }

    //make the player move or stop - functions
    function keyUp(e) {
        e.preventDefault();
        var keycode = e.keyCode;
        if(keycode == 40 || keycode == 83) {
            player.isMovingDown = false;    
        }
        if (keycode == 38 || keycode == 87) {
            player.isMovingUp = false;
        }
        
    }
    function keyDown(e) {
        e.preventDefault();
        var keycode = e.keyCode;
        if(keycode == 40 || keycode == 83) {
            player.isMovingDown = true; 
        }
        if (keycode == 38 || keycode == 87 ) {
            player.isMovingUp = true;
        }
        // var gameLive = true;
        if (keycode == 27) {
            if(gameLive && gameStatus == 'running') {
                gameLive = false;
                gameStatus = 'pause';
            } 
            else if (!gameLive && gameStatus == 'pause'){
                requestID = requestAnimationFrame(step);
                gameLive = true;
                gameStatus = 'running';
            }   
        }
        if (keycode == 32) {
            if(gameStatus == 'start') {
                // gameLive = false;
                requestID = requestAnimationFrame(step);
                gameStatus = 'running';
            } else if (gameStatus == 'finish') {
                requestID = requestAnimationFrame(step);
                // gameLive = true;
                gameStatus = 'running';
            }
        }
        
    }

    //control with mouse
    function mouseControl(element) {
      var y = element.pageY - 120;
      player.y = y;
      document.getElementById('myCanvas').style.cursor = "none";
    }


    //CONTROLS
    window.addEventListener('mousemove', mouseControl, false); //control with mouse
    window.addEventListener('keyup', keyUp);       //keyboard eventlistener up/down
    window.addEventListener('keydown', keyDown); 


    //MOVE ELEMENTS METHOD
    function moveElementY(element) {
        if(element.isMovingDown || typeof element.isMovingDown === "undefined") {
            return element.y += element.speedY;
        }
        else if (element.isMovingUp){
            return element.y += element.speedY * -1;
        } else {

        }
        
    }

    function moveElementX(element) {
        return element.x += element.speedX;
    }



    //CHECK COLLISION
    function checkCollision(rect1, ball) {
        var collisionWidth = Math.abs(rect1.x - ball.x) <= Math.max(rect1.w, ball.w);
        var collisionHeightTop = Math.abs(ball.y + ball.h) >= rect1.y;
        var collisionHeightBottom = ball.y <= Math.abs(rect1.y + rect1.h);              
        return collisionHeightBottom && collisionHeightTop && collisionWidth;
    }

    //GET RANDOM INT
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    //DRAW ELEMENTS FUNCTION
    function drawElements(element) {
        ctx.fillStyle = gameColor;
        ctx.fillRect( element.x, element.y, element.w, element.h );  
        ctx.shadowBlur = 20;
        ctx.shadowColor = gameColor;
    }

    //DRAW TEXT FUNCTION
    function drawText() {
        ctx.font = "60px 'minecraftmedium'";
        var fontWidth = 60;
        var canvasMiddle = (GAME_WIDTH/2);
        ctx.fillStyle = gameColor;
        ctx.shadowBlur = 20;
        ctx.shadowColor = gameColor;
        ctx.fillText(player.score, canvasMiddle - fontWidth, 80);
        ctx.fillText(enemy.score, canvasMiddle + fontWidth/2 , 80); 
    }

    //update elements speed
    function update() {

        //POSITIONS
        moveElementY(player);
        moveElementY(enemy);
        moveElementY(ball);
        moveElementX(ball);


        

        //MAKE ENEMY GO AFTER THE BALL
        if(ball.y <= enemy.y) {           // ball is above paddle
            enemy.isMovingUp = true;
            enemy.isMovingDown = false;
        } else {                          //ball is below paddle
            enemy.isMovingDown = true;
            enemy.isMovingUp = false;
        }



        //CHECK BORDER
        if(player.y <= 0) {
            player.y = 0;
            player.isMovingDown = false;
        }
        if (player.y >= GAME_HEIGHT - player.h) {
            player.y = GAME_HEIGHT - player.h;
            player.isMovingUp = false;
        }

        //check enemy border
        if(enemy.y <= 0) {
            enemy.y = 0;
            enemy.speedY *= -1;
        }
        else if (enemy.y >= GAME_HEIGHT - enemy.h) {
            enemy.y = GAME_HEIGHT - enemy.h;
            enemy.speedY *= -1;
        }


        //CHECK BALL BORDER
        if (ball.y >= GAME_HEIGHT - ball.h) { //check ball border y bottom
            ball.y = GAME_HEIGHT - ball.h;
            ball.speedY *= -1;
        }
        if(ball.y <= 0) { //check ball border y top
            ball.y = 0;
            ball.speedY *= -1;

        }
        if (ball.x >= GAME_WIDTH - ball.w) {  //check ball border x right
            ball.x = GAME_WIDTH - ball.w;
            ball.speedX *= -1;
        }
        if( ball.x <= 0) {    //check ball border x left
            ball.x = 0;
            ball.speedX *= -1;
        }



        //check if you won or lost
        if ((ball.x + ball.w) > (enemy.x + enemy.w)) {
            newGame(player);
        }
        if ( ball.x < player.x ) {
            newGame(enemy);
        }


        //check ball collision with player
        if (checkCollision(player, ball)) {
            ball.x = player.x + player.w;
            ball.speedX *= -1;
        }
        if (checkCollision(enemy, ball)) {
            ball.x = enemy.x - enemy.w;
            ball.speedX *= -1;
        }
    };
    
    function newGame(winner) {

        if (winner == player) {
            //reset ball near player
            ball.x = 40;
            ball.y = getRandomInt(10, GAME_HEIGHT - 10);
            ball.speedY = 6;
            ball.speedX = 6;

            //increase enemy speed
            if (enemy.speedY < 0) {
                enemy.speedY *= -1;
                enemy.speedY += 0.5;
            } else {
                enemy.speedY = enemy.speedY + 0.5;  
            }
            
        } else {
            //reset ball near enemy
            ball.x = GAME_WIDTH - 60;
            ball.y = getRandomInt(10, GAME_HEIGHT - 10);
            ball.speedY = -6;
            ball.speedX = -6;
        }
        //add points to enemy
        winner.score++;

        //set max score and check who won
        if(winner.score >= 10) {
            gameStatus = 'finish';
            enemy.score = 0;
            player.score = 0;
            ball.y = getRandomInt(10, GAME_HEIGHT - 10);
            // gameLive = false;
        }
    }

    //draw the elements (player, enemy and ball)
    function draw() {

        //draw the canvas
        ctx.clearRect( 0, 0, GAME_WIDTH, GAME_HEIGHT );
        //draw text
        drawText();
        //draw the player
        drawElements(player);

        //draw the enemy
        drawElements(enemy);

        //draw the ball
        drawElements(ball);

        
    }
    

    //call update and draw on everyframe
    function step() {
        update();
        draw();
        if(gameStatus == 'start') {
            cancelAnimationFrame(requestID);
            startButton.draw();
        }
        else if (gameStatus == 'running') {
            requestID = requestAnimationFrame(step);
        } 

        else if(gameStatus == 'finish') {
            // requestID = requestAnimationFrame(step);
            
            restartButton.draw();
            cancelAnimationFrame(requestID);
        } 
        
        else {
            cancelAnimationFrame(requestID);
            pauseButton.draw();    
        }
    }

    //call step method
    step();
    
});



