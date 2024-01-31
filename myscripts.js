



    const canvas = document.getElementById('flappyBirdCanvas');
    const ctx = canvas.getContext('2d');

    let backgroundImage = new Image();
    backgroundImage.src = "damm.jpg"

    let treeImg = new Image();
    treeImg.src = "träd.png"
    const bird = {
      img: new Image (),
      x: 50,
      y: canvas.height / 2 - 15,
      width: 50,
      height: 50,
      color: '#FF0000',
      velocityY: 10,
      gravity: 0.2,
      jumpStrength: 4
    };
    bird.img.src = "./fågel.png";
    ctx.imageSmoothingEnabled = false
    const pipes = [];
    let pipeTimer = 0;
    let pipeThreshold =  60;

    const OGDASHCD = 320;
    let dashCD = 0;
    let isDashing = false;
    let dashTimer = 0;
    let dashThreshold = 60; 

    let keys = {};

    let score = 0;

    function update() {
        pipeTimer++;
        dashCD--;
      // Update bird position
      bird.velocityY += bird.gravity;
      bird.velocityY = Math.min(5, bird.velocityY);
      bird.y += bird.velocityY;

      // Check for collision with pipes
      let offset = 30;
      for (const pipe of pipes) {
        if (
          bird.x + offset < pipe.x + pipe.width &&
          bird.x + bird.width - offset> pipe.x &&
          bird.y + offset< pipe.y + pipe.height &&
          bird.y + bird.height - offset> pipe.y
        ) {
          resetGame();
        }
      }

      // Check for bird out of bounds
      if (bird.y > canvas.height - bird.height || bird.y < 0) {
        resetGame();
      }

      // Move pipes
      for (const pipe of pipes) {
        pipe.x -= 2;

        // Check if pipe is off-screen
        if (pipe.x + pipe.width < 0) {
          pipes.shift();
          score += 0.5;
        }
      }

      // Generate new pipes
      if (pipeTimer >= (pipeThreshold - score / 2)) {
        pipeTimer = 0;
        const pipeGap = 150;
        const pipeHeight = Math.floor(Math.random() * (canvas.height - pipeGap));
        pipes.push({ x: canvas.width, y: 0, width: 30, height: pipeHeight });
        pipes.push({ x: canvas.width, y: pipeHeight + pipeGap, width: 30, height: canvas.height - (pipeHeight + pipeGap) });
      }

      if(isDashing){
        dash();
        dashTimer++;
        if(dashTimer >= dashThreshold){
            isDashing = false;
            bird.gravity = 0.2;
        }
      }

      checkInput();
    }

    function draw() {
      // Clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
      // Draw bird
      ctx.drawImage(bird.img, bird.x, bird.y,  bird.width, bird.height);

      // Draw pipes
      ctx.fillStyle = '#00F';
      for (const pipe of pipes) {
        if(pipe.y === 0){
          ctx.save();
          ctx.scale(1, -1);
          ctx.drawImage(treeImg, pipe.x, pipe.y - pipe.height, pipe.width, pipe.height);
          ctx.restore();
        }else{
          ctx.drawImage(treeImg, pipe.x, pipe.y, pipe.width, pipe.height)
        }

      }

      // Draw score
      ctx.fillStyle = '#000';
      ctx.font = '20px Arial';
      ctx.fillText('Highscore: ' + localStorage.getItem("highscore"), 10, 30);
      ctx.fillText('Score: ' + Math.round(score), 10, 60);
    }

    function resetGame() {
        if(score > localStorage.getItem("highscore"))
            localStorage.setItem("highscore", Math.floor(score));
        bird.y = canvas.height / 2 - 15;
        bird.velocityY = 0;
        pipes.length = 0;
        score = 0;
    }

    function jump() {
      bird.velocityY = -bird.jumpStrength;
    }
    function dash() {
        bird.gravity = 0;
        bird.velocityY = 0;
    }
    

    function checkInput(){
        if(keys["d"] && dashCD <= 0){
            isDashing = true;
            dashCD = OGDASHCD;
            dashTimer = 0;
        }
    }

    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space' && !isDashing) {
        jump();
      }
    });

    document.addEventListener("keydown", (event) => {
        keys[event.key] = true;
    });

    document.addEventListener("keyup", (event) => {
        keys[event.key] = false;
    });

    function gameLoop() {
      update();
      draw();
      requestAnimationFrame(gameLoop);
    }

    gameLoop();