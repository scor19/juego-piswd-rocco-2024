import { useState, useEffect } from "react";
import Sketch from "react-p5";

let player;
let target;
let obstacles = [];
let levelForObstacles = 15;
let minObstacleSize = 10;
let maxObstacleSize = 40;

function Game() {
  const [isGameOver, setIsGameOver] = useState(false); // Estado de fin de juego
  const [score, setScore] = useState(0); // Estado del puntaje
  const [speed, setSpeed] = useState(0); // Estado de la velocidad del jugador para mostrar
  const [p5Instance, setP5Instance] = useState(null); // Instancia de Proccesing (p5.js)
  const [touchDirection, setTouchDirection] = useState(null); // Dirección del touch
  const [isTouchDevice, setIsTouchDevice] = useState(false); // Estado de dispositivo movil
  const [topScore, setTopScore] = useState(0); // Estado del puntaje mas alto

  // Detecta si el dispositivo es móvil
  useEffect(() => {
    const checkTouchDevice = () => {
      setIsTouchDevice(
        "ontouchstart" in window ||
          window.matchMedia("(pointer: coarse)").matches
      );
    };

    checkTouchDevice(); // Comprueba si el dispositivo es movil
    window.addEventListener("resize", checkTouchDevice);

    // Carga el puntaje guardado en el localStorage
    const savedTopScore = localStorage.getItem("topScore");
    if (savedTopScore) {
      setTopScore(parseInt(savedTopScore, 10));
    }

    return () => {
      window.removeEventListener("resize", checkTouchDevice);
    };
  }, []);

  // Crea la instancia de p5
  const setup = (p) => {
    setP5Instance(p);
    const canvasSize = getCanvasSize(p);
    let canvas = p.createCanvas(canvasSize, canvasSize);
    canvas.parent("canvas-container");
    initializeGame(p);
  };

  // Dibuja el juego
  const draw = (p) => {
    if (!p5Instance) return;
    p.background(220);

    // Si el juego todavía no terminó, dibuja el personaje y el target
    if (!isGameOver) {
      p.fill(50, 150, 255);
      p.ellipse(player.x, player.y, player.size);

      p.fill(255, 100, 100);
      p.ellipse(target.x, target.y, target.size);

      movePlayer(p);

      if (
        p.dist(player.x, player.y, target.x, target.y) <
        player.size / 2 + target.size / 2
      ) {
        setScore((prevScore) => prevScore + 1);
        setSpeed((prevSpeed) => prevSpeed + player.velocityIncrement);
        target = createTarget(p);

        if (score >= levelForObstacles) {
          addObstacle(p);
        }
      }

      if (
        player.x <= 0 ||
        player.x >= p.width ||
        player.y <= 0 ||
        player.y >= p.height
      ) {
        endGame();
      }

      if (score >= levelForObstacles) {
        moveObstacles(p);
        checkObstacleCollision(p);
      }

      checkTargetWallCollision(p);
    } else {
      displayGameOver(p);
    }
  };

  // Maneja el redimensionamiento de la ventana
  const windowResized = (p) => {
    if (p5Instance) {
      const canvasSize = getCanvasSize(p);
      p.resizeCanvas(canvasSize, canvasSize);
      player.x = p.width / 2;
      player.y = p.height / 2;
    }
  };

  // Calcula el tamaão del canvas
  const getCanvasSize = (p) => {
    return p.windowWidth < 600 ? p.windowWidth - 40 : 600;
  };

  // Inicializa el juego con los valores de jugador por defecto y el puntaje en 0
  function initializeGame(p) {
    player = {
      x: p.width / 2,
      y: p.height / 2,
      size: 30,
      speed: 3,
      velocityIncrement: 0.2,
    };
    target = createTarget(p);
    setScore(0);
    setSpeed(0);
    setIsGameOver(false);
    obstacles = [];
  }

  // Finaliza el juego y muestra un mensaje
  function displayGameOver(p) {
    p.fill(0);
    p.textSize(32);
    p.textAlign(p.CENTER, p.CENTER);
    p.text("Perdiste!", p.width / 2, p.height / 2 - 20);
  }

  // Crea un target
  function createTarget(p) {
    return {
      x: Math.random() * (p.width - 40) + 20,
      y: Math.random() * (p.height - 40) + 20,
      size: 20,
    };
  }

  // Handlea el movimiento del personaje
  function movePlayer(p) {
    if (p.keyIsDown(p.LEFT_ARROW) || p.keyIsDown(65)) {
      player.x -= player.speed;
    }
    if (p.keyIsDown(p.RIGHT_ARROW) || p.keyIsDown(68)) {
      player.x += player.speed;
    }
    if (p.keyIsDown(p.UP_ARROW) || p.keyIsDown(87)) {
      player.y -= player.speed;
    }
    if (p.keyIsDown(p.DOWN_ARROW) || p.keyIsDown(83)) {
      player.y += player.speed;
    }

    if (touchDirection) {
      if (touchDirection === "left") player.x -= player.speed;
      if (touchDirection === "right") player.x += player.speed;
      if (touchDirection === "up") player.y -= player.speed;
      if (touchDirection === "down") player.y += player.speed;
    }

    player.x = p.constrain(player.x, 0, p.width);
    player.y = p.constrain(player.y, 0, p.height);
  }

  // Añade un obstaculo aleatorio
  function addObstacle(p) {
    let obstacle = {
      x: Math.random() * p.width,
      y: Math.random() * p.height,
      size:
        Math.random() * (maxObstacleSize - minObstacleSize) + minObstacleSize,
      speedX: Math.random() * 4 - 2,
      speedY: Math.random() * 4 - 2,
    };
    obstacles.push(obstacle);
  }

  // Handlea el movimiento de los obstaculos
  function moveObstacles(p) {
    for (let obstacle of obstacles) {
      obstacle.x += obstacle.speedX;
      obstacle.y += obstacle.speedY;

      if (obstacle.x <= 0 || obstacle.x >= p.width) {
        obstacle.speedX *= -1;
      }
      if (obstacle.y <= 0 || obstacle.y >= p.height) {
        obstacle.speedY *= -1;
      }

      p.fill(0, 255, 0);
      p.ellipse(obstacle.x, obstacle.y, obstacle.size);
    }
  }

  // Chequea la colision de los obstaculos
  function checkObstacleCollision(p) {
    for (let obstacle of obstacles) {
      if (
        p.dist(player.x, player.y, obstacle.x, obstacle.y) <
        player.size / 2 + obstacle.size / 2
      ) {
        endGame();
        break;
      }
    }
  }

  // Chequea la colision del jugador con las paredes
  function checkTargetWallCollision(p) {
    if (
      target.x <= 0 ||
      target.x >= p.width ||
      target.y <= 0 ||
      target.y >= p.height
    ) {
      target = createTarget(p);
    }

  const handlePlayAgain = () => {
    if (p5Instance) {
      initializeGame(p5Instance);
    }
  };

  function endGame() {
    setIsGameOver(true);

    // Chequea y actualiza el puntaje
    if (score > topScore) {
      setTopScore(score);
      localStorage.setItem("topScore", score); // Guarda el nuevo puntaje mas alto en el local host
    }
  }

  const handleTouchStart = (direction) => {
    setTouchDirection(direction);
  };

  const handleTouchEnd = () => {
    setTouchDirection(null);
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-slate-800">
      <span className="text-white">Movimiento: WASD o Flechas</span>
      <div id="canvas-container" className="relative shadow-2xl">
        <Sketch setup={setup} draw={draw} windowResized={windowResized} />
        <div className="absolute top-[10px] left-[10px] color-black z-1 select-none">
          <span className="select-none text-xl caret-black/0">
            Puntaje: {score}
          </span>
          <br />
          <span className="select-none text-xl caret-black/0">
            Velocidad: {speed.toFixed(2)}
          </span>
        </div>
        {isGameOver && (
          <div
            style={{
              position: "absolute",
              top: "60%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              textAlign: "center",
              zIndex: 2,
            }}
          >
            <button
              onClick={handlePlayAgain}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded select-none"
            >
              Juegar de nuevo
            </button>
          </div>
        )}
      </div>

      {/* Controles para dispositivos móviles */}
      {isTouchDevice && (
        <div className="mt-4 grid grid-cols-3 gap-4">
          <button
            onTouchStart={() => handleTouchStart("left")}
            onTouchEnd={handleTouchEnd}
            className="bg-gray-200 py-2 px-4 rounded select-none caret-black/0"
          >
            Left
          </button>
          <button
            onTouchStart={() => handleTouchStart("up")}
            onTouchEnd={handleTouchEnd}
            className="bg-gray-200 py-2 px-4 rounded select-none caret-black/0"
          >
            Up
          </button>
          <button
            onTouchStart={() => handleTouchStart("right")}
            onTouchEnd={handleTouchEnd}
            className="bg-gray-200 py-2 px-4 rounded select-none caret-black/0"
          >
            Right
          </button>
          <button
            onTouchStart={() => handleTouchStart("down")}
            onTouchEnd={handleTouchEnd}
            className="bg-gray-200 py-2 px-4 rounded col-span-3 select-none caret-black/0"
          >
            Down
          </button>
        </div>
      )}

      {/* Muestra el puntaje mas alto */}
      <div className="mt-4">
        <h2 className="text-xl font-bold text-white">
          Mejor puntaje: {topScore}
        </h2>
      </div>
    </div>
  );
}

export default Game;
