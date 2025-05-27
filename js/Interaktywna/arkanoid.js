// ====================================
var canvas, context;
var last_time = 0;
var stop = false;
var balls = [];
var bricks = [];
var plate = {};
var area = { x: 0, y: 0, width: 480, height: 500 };
var drawGameOver = false;
var gameWon = false;
var gameStarted = false;
// -----
var ignoreSpaceUntil = 0;
var ignoreTime = 300;
// -----
var stickyActive = false;
var stuckBalls = []; // tablica piłek "przyklejonych"
// -----
var bonuses = [];
var bonusTimer = 0;
var activeEffects = [];

var score = 0;

var speedFactor = 0;
// ====================================

// Definicje bonusów
// Możesz dodać więcej bonusów, zmieniając szanse i efekty
const bonusDefinitions = [
  {
    type: "diamond",
    chance: 0.2,
    apply: () => {
      score += 50;
    },
    duration: 0,
    revert: null,
    color: "deepskyblue",
    stroke: "navy",
  },
  {
    type: "expand",
    chance: 0.1,
    apply: () => {
      plate.width = 160;
    },
    duration: 20000, // ms
    revert: () => {
      plate.width = 100;
    },
    color: "orange",
    stroke: "darkred",
  },
  {
    type: "multiBall",
    chance: 0.1,
    apply: () => {
      const newBalls = balls.map((b) => createBall(b.x, b.y, -b.vx, b.vy));
      balls.push(...newBalls);
    },
    duration: 0,
    revert: null,
    color: "mediumorchid",
    stroke: "purple",
  },
  {
    type: "shrink",
    chance: 0.05,
    apply: () => {
      plate.width = 50;
    },
    duration: 3000,
    revert: () => {
      plate.width = 100;
    },
    color: "red",
    stroke: "black",
  },
  {
    type: "sticky",
    chance: 0.1,
    apply: () => {
      stickyActive = true;
    },
    duration: 5000,
    revert: () => {
      stickyActive = false;
    },
    color: "limegreen",
    stroke: "darkgreen",
  },
];

const keys = { left: false, right: false };
const brick = {
  width: 48,
  height: 18,
  fillStyles: ["green", "blue", "yellow", "red"],
  strokeStyle: "black",
};

// ====================================
// Funkcja do tworzenia piłki
// ====================================
function createBall(x, y, vx, vy) {
  return {
    x: x,
    y: y,
    r: 8,
    vx: vx,
    vy: vy,
  };
}

// ====================================
// Funkcja do rozpoczęcia gry
// ====================================
function startGame() {
  document.getElementById("menu").style.display = "none"; // ukryj menu
  canvas = document.getElementById("AnimationCanvas");
  context = canvas.getContext("2d");

  // Wybierz poziom trudności
  const diff = document.getElementById("difficulty").value;
  speedFactor = 1; // domyślny współczynnik prędkości (Medium)
  if (diff === "easy") speedFactor = 0.7;
  if (diff === "hard") speedFactor = 1.3;
  if (diff === "extreme") speedFactor = 2;

  // Ustawienia początkowe
  last_time = Date.now();
  drawGameOver = false;
  gameWon = false;
  gameStarted = false;

  bonuses = [];
  bonusTimer = 0;
  plate.width = 100;
  activeEffects = [];

  score = 0;

  balls = [createBall(plate.x + plate.width / 2, plate.y - 10, 0, 0)];

  //   ball = {
  //     x: 100,
  //     y: 250,
  //     r: 8,
  //     vx: 120 * speedFactor,
  //     vy: -150 * speedFactor,
  //   };

  plate = {
    x: area.width / 2 - 50,
    y: area.height - 10,
    width: plate.width,
    height: 10,
    vx: 0,
    fillStyle: "green",
    strokeStyle: "black",
  };
  ignoreSpaceUntil = Date.now() + ignoreTime; // ignoruj spację przez 300 ms
  // Wybierz mapę
  const map = document.getElementById("map").value;
  setupBricks(map);

  // Rozpocznij animację
  window.requestAnimationFrame(drawAnimation);
}
// ====================================
// Funkcja do ustawienia cegiełek w zależności od wybranej mapy
// ====================================
function setupBricks(mapName) {
  bricks.length = 0;

  if (mapName === "classic") {
    bricks.push(
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 3, 3, 0, 0, 0, 0, 3, 3, 0],
      [0, 0, 0, 3, 3, 3, 3, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 1, 1, 1, 0, 0, 1, 1, 0, 0],
      [0, 0, 2, 2, 2, 2, 2, 2, 0, 0],
      [0, 3, 2, 3, 2, 3, 2, 1, 3, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    );
  } else if (mapName === "cross") {
    for (let j = 0; j < 10; j++) {
      bricks[j] = [];
      for (let i = 0; i < 10; i++) {
        bricks[j][i] = i === 5 || j === 5 ? 1 + ((i + j) % 4) : 0;
      }
    }
  } else if (mapName === "random") {
    j_size = Math.floor(Math.random() * 15) + 5; // losowa liczba wierszy
    //i_size = Math.floor(Math.random() * 5) + 5; // losowa liczba kolumn
    i_size = 10; // liczba kolumn
    for (let j = 0; j < j_size; j++) {
      bricks[j] = [];
      for (let i = 0; i < i_size; i++) {
        bricks[j][i] =
          Math.random() < 0.3 ? Math.floor(Math.random() * 4) + 1 : 0;
      }
    }
  } else if (mapName === "test") {
    bricks.push(
      [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
      [3, 0, 0, 0, 0, 0, 0, 0, 0, 3],
      [3, 3, 3, 0, 0, 0, 0, 3, 3, 3],
      [3, 0, 0, 3, 3, 3, 3, 0, 0, 3],
      [3, 0, 0, 0, 0, 0, 0, 0, 0, 3],
      [3, 0, 0, 1, 1, 1, 0, 0, 0, 3],
      [3, 1, 1, 1, 0, 0, 1, 1, 0, 3],
      [3, 0, 2, 2, 2, 2, 2, 2, 0, 3],
      [3, 3, 2, 3, 2, 3, 2, 1, 3, 3],
      [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
      [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
      [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
      [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
      [2, 2, 2, 2, 2, 2, 2, 2, 2, 2]
    );
  }
}
// ====================================
// Funkcja do próby spawnu bonusu
// na podstawie losowej szansy
// ====================================
function trySpawnBonus(x, y) {
  let rand = Math.random();
  let cumulative = 0;

  for (let def of bonusDefinitions) {
    cumulative += def.chance;
    if (rand < cumulative) {
      bonuses.push({
        x: x,
        y: y,
        r: 6,
        vy: 50 * speedFactor, // prędkość opadania bonusu
        collected: false,
        type: def.type,
      });
      break; // tylko jeden bonus jednocześnie
    }
  }
}

// ====================================
// Funkcja do wyświetlenia ekranu zwycięstwa
// ====================================
function showWinScreen() {
  context.save();
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "black";
  context.font = "40px Calibri";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText("Wygrałeś!", canvas.width / 2, canvas.height / 2);
  context.restore();

  setTimeout(() => {
    document.getElementById("menu").style.display = "block";
  }, 2000); // pokaż menu po 2 sekundach
}

// ====================================
// Główna funkcja animacji
// ====================================
function drawAnimation() {
  var currentTime = Date.now();
  var time_interval = currentTime - last_time;
  last_time = currentTime;

  context.clearRect(0, 0, area.width, area.height);

  // aktualizacja położenia piłki
  {
    for (let i = balls.length - 1; i >= 0; i--) {
      const ball = balls[i];

      let dx = (ball.vx * time_interval) / 1000;
      let dy = (ball.vy * time_interval) / 1000;

      if (ball.x + dx + ball.r > area.width || ball.x + dx - ball.r < 0) {
        ball.vx = -ball.vx;
        dx = (ball.vx * time_interval) / 1000;
      }

      if (ball.y + dy - ball.r < 0) {
        ball.vy = -ball.vy;
        dy = (ball.vy * time_interval) / 1000;
      }

      // Kolizja z paletką
      if (
        ball.y + dy + ball.r >= plate.y &&
        ball.x >= plate.x &&
        ball.x <= plate.x + plate.width
      ) {
        const center = plate.x + plate.width / 2;
        ball.vx += (ball.x - center) * 0.1;
        // Zatrzymanie piłki, jeśli aktywny jest efekt "sticky"
        if (stickyActive) {
          ball.vx = 0;
          ball.vy = 0;
          stuckBalls.push(ball);
        } else {
          ball.vy = -ball.vy;
        }
        dy = (ball.vy * time_interval) / 1000;
      }

      ball.x += dx;
      ball.y += dy;

      // Jeśli piłka wypadnie z dołu – usuń
      if (ball.y - ball.r > area.height) {
        balls.splice(i, 1);
      }
    }
  }

  // Ustal kierunek ruchu na podstawie aktualnie wciśniętych klawiszy
  {
    if (keys.left && !keys.right) {
      plate.vx = -300;
    } else if (keys.right && !keys.left) {
      plate.vx = 300;
    } else {
      plate.vx = 0;
    }

    // Przesunięcie paletki z ograniczeniem
    var pdx = (plate.vx * time_interval) / 1000;
    if (plate.x + pdx >= 0 && plate.x + pdx + plate.width <= area.width) {
      plate.x += pdx;
    }
  }

  // rysowanie piłek i paletki
  {
    for (let ball of balls) {
      context.beginPath();
      context.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
      context.fillStyle = "blue";
      context.fill();
      context.stroke();
      context.closePath();
    }
    // stara paletka
    // context.beginPath();
    // context.fillStyle = plate.fillStyle;
    // context.strokeStyle = plate.strokeStyle;
    // context.fillRect(plate.x, plate.y, plate.width, plate.height);
    // context.strokeRect(plate.x, plate.y, plate.width, plate.height);
    // context.closePath();
    context.beginPath();
    const arcX = plate.x + plate.width / 2;
    const arcY = plate.y;
    const radiusX = plate.width / 2;
    const radiusY = plate.height * 1.5;

    context.ellipse(arcX, arcY, radiusX, radiusY, 0, Math.PI, 0, true);
    context.fillStyle = plate.fillStyle;
    context.strokeStyle = plate.strokeStyle;
    context.fill();
    context.stroke();
    context.closePath();
  }

  // detekcja i rysowanie bonusów oraz ich efektów
  {
    for (let b of bonuses) {
      if (b.collected) continue;

      b.y += (b.vy * time_interval) / 1000;

      // Kolizja z paletką
      if (
        b.y + b.r >= plate.y &&
        b.x >= plate.x &&
        b.x <= plate.x + plate.width
      ) {
        b.collected = true;

        // Znajdź i zastosuj działanie z definicji
        const def = bonusDefinitions.find((d) => d.type === b.type);
        if (def.duration > 0 && typeof def.revert === "function") {
          const existing = activeEffects.find((e) => e.type === def.type);

          if (existing) {
            // Reset czasu i ponownie zastosuj efekt
            existing.timeLeft = def.duration;
            def.apply();
          } else {
            def.apply();
            activeEffects.push({
              type: def.type,
              timeLeft: def.duration,
              revert: def.revert,
            });
          }
        } else {
          // Efekt natychmiastowy (bez czasu trwania)
          def.apply();
        }

        continue;
      }

      // Rysowanie bonusu
      const def = bonusDefinitions.find((d) => d.type === b.type);
      context.beginPath();
      context.fillStyle = def?.color || "gray";
      context.strokeStyle = def?.stroke || "black";
      context.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      context.fill();
      context.stroke();
      context.closePath();
    }
    // Obsługa aktywnych efektów czasowych
    for (let i = activeEffects.length - 1; i >= 0; i--) {
      activeEffects[i].timeLeft -= time_interval;
      if (activeEffects[i].timeLeft <= 0) {
        activeEffects[i].revert();
        activeEffects.splice(i, 1);
      }
    }

    // Rysowanie aktywnych efektów
    if (activeEffects.length > 0) {
      context.save();
      context.font = "14px Arial";
      context.fillStyle = "black";
      context.textAlign = "left";

      const startY = area.height - 10;
      const barWidth = 100;
      const barHeight = 6;

      for (let i = 0; i < activeEffects.length; i++) {
        const effect = activeEffects[i];
        const def = bonusDefinitions.find((b) => b.type === effect.type);
        const total = def?.duration || 1;
        const percent = effect.timeLeft / total;

        const x = 10 + i * (barWidth + 10);
        const y = startY;

        // Pasek tła
        context.fillStyle = "#ccc";
        context.fillRect(x, y, barWidth, barHeight);

        // Pasek czasu
        context.fillStyle = def?.color || "green";
        context.fillRect(x, y, barWidth * percent, barHeight);

        // Etykieta
        context.fillStyle = "black";
        context.fillText(effect.type, x, y - 5);
      }

      context.restore();
    }

    // Utrzymuj piłki przyklejone do paletki
    for (let ball of stuckBalls) {
      ball.x = plate.x + plate.width / 2;
      ball.y = plate.y - ball.r - 1;
    }

    // Filtruj diamenciki, które zostały zebrane lub spadły poza obszar
    bonuses = bonuses.filter((d) => !d.collected && d.y < area.height + d.r);
  }
  // Sprawdzenie, czy gra została rozpoczęta
  if (!gameStarted) {
    // Utrzymuj piłkę na środku paletki
    if (balls.length > 0) {
      balls[0].x = plate.x + plate.width / 2;
      balls[0].y = plate.y - 25;
    }
  }

  // detekcja i rysowanie cegiełek
  for (let ball of balls) {
    for (let j = 0; j < bricks.length; j++) {
      for (let i = 0; i < bricks[j].length; i++) {
        if (bricks[j][i] > 0) {
          let brickX = i * brick.width;
          let brickY = j * brick.height;

          // Sprawdzenie kolizji
          if (
            ball.x + ball.r > brickX &&
            ball.x - ball.r < brickX + brick.width &&
            ball.y + ball.r > brickY &&
            ball.y - ball.r < brickY + brick.height
          ) {
            // Kolizja wykryta
            bricks[j][i] = 0;
            score += 10;

            ball.vy = -ball.vy;

            // Szansa na bonus
            trySpawnBonus(brickX + brick.width / 2, brickY + brick.height);

            // Przerwij po 1 kolizji (żeby nie zniszczyć wielu cegieł na raz)
            break;
          }
          context.beginPath();
          context.fillStyle = brick.fillStyles[bricks[j][i] - 1];
          context.strokeStyle = brick.strokeStyle;
          context.fillRect(brickX, brickY, brick.width, brick.height);
          context.strokeRect(brickX, brickY, brick.width, brick.height);
          context.closePath();
        }
      }
    }
  }

  // Sprawdzenie, czy wszystkie cegły zostały zniszczone
  if (!gameWon && bricks.flat().every((c) => c === 0)) {
    gameWon = true;
    showWinScreen();
    return; // zatrzymaj pętlę animacji
  }
  // Sprawdzenie, czy gra się skończyła
  if (!drawGameOver) {
    // Sprawdzenie, czy zostały jakieś piłki
    if (balls.length === 0) {
      drawGameOver = true;
    }
    // Wyświetlenie punktacji
    context.save();
    context.fillStyle = "white";
    context.strokeStyle = "black";
    context.lineWidth = 0.5;
    context.font = "20px Arial";
    context.textAlign = "right";
    context.fillText("Punkty: " + score, area.width - 10, 20);
    context.strokeText("Punkty: " + score, area.width - 10, 20);
    context.restore();
    context.save();
    // Wyświetlenie liczby piłek
    context.fillStyle = "white";
    context.strokeStyle = "black";
    context.lineWidth = 0.5;
    context.font = "20px Arial";
    context.textAlign = "right";
    context.fillText("Piłki: " + balls.length, area.width - 10, 40);
    context.strokeText("Piłki: " + balls.length, area.width - 10, 40);
    context.restore();
    window.requestAnimationFrame(drawAnimation);
  } else {
    context.save();
    context.fillStyle = "black";
    context.font = "40px Calibri";
    context.textAlign = "center";
    context.fillText("Game Over", area.width / 2, area.height / 2);
    context.restore();
  }
}
// ====================================
// Funkcja restartująca grę
// ====================================
function restartGame() {
  drawGameOver = false;
  gameWon = false;
  gameStarted = false;

  // Pobierz aktualne ustawienia trudności i mapy z formularza
  const diff = document.getElementById("difficulty").value;
  const map = document.getElementById("map").value;

  speedFactor = 1;
  if (diff === "easy") speedFactor = 0.7;
  if (diff === "hard") speedFactor = 1.3;
  if (diff === "extreme") speedFactor = 2;

  bonuses = [];
  bonusTimer = 0;
  plate.width = 100;
  activeEffects = [];

  score = 0;

  balls = [createBall(plate.x + plate.width / 2, plate.y - 10, 0, 0)];

  //   ball = {
  //     x: 100,
  //     y: 250,
  //     r: 8,
  //     vx: 120 * speedFactor,
  //     vy: -150 * speedFactor,
  //   };
  plate.x = area.width / 2 - plate.width / 2;
  plate.vx = 0;

  setupBricks(map);

  last_time = Date.now();
  ignoreSpaceUntil = Date.now() + ignoreTime; // ignoruj spację przez 300 ms
  window.requestAnimationFrame(drawAnimation);
}
// ====================================
// Sterowanie
// ====================================
{
  // Obsługa wciśnięcia klawiszy
  document.addEventListener("keydown", function (evt) {
    if (evt.key === "ArrowLeft") keys.left = true;
    if (evt.key === "ArrowRight") keys.right = true;

    if (drawGameOver && evt.code === "Space") {
      restartGame();
    }

    // Start gry po spacji
    if (!gameStarted && evt.code === "Space" && Date.now() > ignoreSpaceUntil) {
      gameStarted = true;

      if (balls.length > 0) {
        const paddleSpeed = plate.vx;

        if (paddleSpeed === 0) {
          // Jeśli paletka stoi, nadaj piłce domyślny kierunek
          balls[0].vx = 120 * speedFactor;
        } else {
          // Nadaj poziomy kierunek proporcjonalny do ruchu paletki (max 150 px/s)
          let vx = Math.max(-150, Math.min(150, paddleSpeed * 0.5));
          balls[0].vx = vx;
        }
        balls[0].vy = -150 * speedFactor;
      }
    }
    if (gameStarted && evt.code === "Space" && stuckBalls.length > 0) {
      for (let ball of stuckBalls) {
        ball.vx = 100 * (Math.random() < 0.5 ? -1 : 1); // losowy kierunek
        ball.vy = -150;
      }
      stuckBalls = [];
    }
  });
  // Obsługa zwolnienia klawiszy

  document.addEventListener("keyup", function (evt) {
    if (evt.key === "ArrowLeft") keys.left = false;
    if (evt.key === "ArrowRight") keys.right = false;
  });
}
