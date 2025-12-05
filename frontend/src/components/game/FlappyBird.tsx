import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Play, RotateCcw, Gamepad2 } from "lucide-react";

const GRAVITY = 0.5;
const JUMP_STRENGTH = -8;
const PIPE_WIDTH = 50;
const PIPE_GAP = 150;
const PIPE_SPEED = 3;
const BIRD_SIZE = 30;

interface Pipe {
  x: number;
  topHeight: number;
  id: number;
}

export function FlappyBird() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    // Load high score from localStorage
    const saved = localStorage.getItem('flappyBirdHighScore');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [birdY, setBirdY] = useState(150);
  const [birdVelocity, setBirdVelocity] = useState(0);
  const [pipes, setPipes] = useState<Pipe[]>([]);
  const [scoredPipes, setScoredPipes] = useState<Set<number>>(new Set());
  const [isMinimized, setIsMinimized] = useState(true);
  const pipeIdCounter = useRef(0);
  const gameRef = useRef<HTMLDivElement>(null);
  const canvasWidth = 280;
  const canvasHeight = 350;

  const jump = useCallback(() => {
    if (!gameOver && isPlaying) {
      setBirdVelocity(JUMP_STRENGTH);
    }
  }, [gameOver, isPlaying]);

  const startGame = () => {
    setBirdY(150);
    setBirdVelocity(0);
    pipeIdCounter.current = 0;
    setPipes([{ x: canvasWidth, topHeight: Math.random() * 100 + 50, id: pipeIdCounter.current++ }]);
    setScore(0);
    setScoredPipes(new Set());
    setGameOver(false);
    setIsPlaying(true);
  };

  useEffect(() => {
    if (!isPlaying || gameOver) return;

    const gameLoop = setInterval(() => {
      // Update bird position
      setBirdVelocity((v) => v + GRAVITY);
      setBirdY((y) => {
        const newY = y + birdVelocity;
        // Check floor/ceiling collision
        if (newY <= 0 || newY >= canvasHeight - BIRD_SIZE) {
          setGameOver(true);
          setIsPlaying(false);
          setScore(0);
          setScoredPipes(new Set());
          return y;
        }
        return newY;
      });

      // Update pipes
      setPipes((currentPipes) => {
        const newPipes = currentPipes
          .map((pipe) => ({ ...pipe, x: pipe.x - PIPE_SPEED }))
          .filter((pipe) => pipe.x > -PIPE_WIDTH);

        // Add new pipe
        if (newPipes.length === 0 || newPipes[newPipes.length - 1].x < canvasWidth - 180) {
          newPipes.push({
            x: canvasWidth,
            topHeight: Math.random() * 100 + 50,
            id: pipeIdCounter.current++,
          });
        }

        // Check collision and score
        newPipes.forEach((pipe) => {
          const birdLeft = 50;
          const birdRight = 50 + BIRD_SIZE;
          const birdTop = birdY;
          const birdBottom = birdY + BIRD_SIZE;

          const pipeLeft = pipe.x;
          const pipeRight = pipe.x + PIPE_WIDTH;

          // Check collision
          if (birdRight > pipeLeft && birdLeft < pipeRight) {
            if (birdTop < pipe.topHeight || birdBottom > pipe.topHeight + PIPE_GAP) {
              setGameOver(true);
              setIsPlaying(false);
              setScore(0);
              setScoredPipes(new Set());
            }
          }

          // Score when bird passes the pipe (bird's left edge passes pipe's right edge)
          const birdPassedPipe = birdLeft > pipeRight;
          
          if (birdPassedPipe && !scoredPipes.has(pipe.id)) {
            setScore((s) => {
              const newScore = s + 1;
              // Update high score if new score is higher
              if (newScore > highScore) {
                const newHighScore = newScore;
                setHighScore(newHighScore);
                localStorage.setItem('flappyBirdHighScore', newHighScore.toString());
              }
              return newScore;
            });
            setScoredPipes((prev) => new Set([...prev, pipe.id]));
          }
        });

        return newPipes;
      });
    }, 1000 / 60);

    return () => clearInterval(gameLoop);
  }, [isPlaying, gameOver, birdVelocity, birdY, highScore, scoredPipes]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === "Space" && !isMinimized) {
        e.preventDefault();
        if (!isPlaying && !gameOver) {
          startGame();
        } else {
          jump();
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [jump, isPlaying, gameOver, isMinimized]);

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          variant="cyber"
          size="lg"
          onClick={() => setIsMinimized(false)}
          className="gap-2 shadow-glow animate-pulse-glow"
        >
          <Gamepad2 className="w-5 h-5" />
          Play Mini Game
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-scale-up">
      <div className="cyber-card p-4 w-[312px]">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Gamepad2 className="w-4 h-4 text-primary" />
            Flappy Bird
          </h4>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMinimized(true)}
            className="text-xs"
          >
            Minimize
          </Button>
        </div>

        <div className="flex items-center justify-between mb-2 text-sm">
          <span className="text-muted-foreground">Score: <span className="text-primary font-bold">{score}</span></span>
          <span className="text-muted-foreground">Best: <span className="text-secondary font-bold">{highScore}</span></span>
        </div>

        <div
          ref={gameRef}
          onClick={isPlaying ? jump : startGame}
          className="relative bg-gradient-to-b from-muted/50 to-background rounded-lg overflow-hidden cursor-pointer border border-border/50"
          style={{ width: canvasWidth, height: canvasHeight }}
        >
          {/* Background elements */}
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-secondary/20" />
          
          {/* Bird */}
          <div
            className="absolute transition-transform duration-75"
            style={{
              left: 50,
              top: birdY,
              width: BIRD_SIZE,
              height: BIRD_SIZE,
              transform: `rotate(${Math.min(birdVelocity * 3, 45)}deg)`,
            }}
          >
            <div className="w-full h-full rounded-full bg-gradient-to-br from-primary to-primary/60 shadow-glow flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-foreground absolute right-1 top-2" />
            </div>
          </div>

          {/* Pipes */}
          {pipes.map((pipe, index) => (
            <div key={index}>
              {/* Top pipe */}
              <div
                className="absolute bg-gradient-to-b from-secondary to-secondary/60 rounded-b-lg"
                style={{
                  left: pipe.x,
                  top: 0,
                  width: PIPE_WIDTH,
                  height: pipe.topHeight,
                  boxShadow: "0 0 15px hsl(148, 100%, 57%, 0.3)",
                }}
              />
              {/* Bottom pipe */}
              <div
                className="absolute bg-gradient-to-t from-secondary to-secondary/60 rounded-t-lg"
                style={{
                  left: pipe.x,
                  top: pipe.topHeight + PIPE_GAP,
                  width: PIPE_WIDTH,
                  height: canvasHeight - pipe.topHeight - PIPE_GAP,
                  boxShadow: "0 0 15px hsl(148, 100%, 57%, 0.3)",
                }}
              />
            </div>
          ))}

          {/* Score overlay during gameplay */}
          {isPlaying && !gameOver && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
              <div className="px-4 py-2 rounded-lg bg-background/90 backdrop-blur-sm border border-primary/30 shadow-glow">
                <span className="text-lg font-bold text-primary">Score: {score}</span>
              </div>
            </div>
          )}

          {/* Start/Game Over overlay */}
          {(!isPlaying || gameOver) && (
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
              {gameOver ? (
                <>
                  <p className="text-destructive font-bold text-lg">Game Over!</p>
                  <p className="text-muted-foreground text-sm">Score: {score}</p>
                  <Button variant="cyber-green" size="sm" onClick={startGame} className="gap-2">
                    <RotateCcw className="w-4 h-4" />
                    Play Again
                  </Button>
                </>
              ) : (
                <>
                  <p className="text-primary font-medium text-sm">Click or Press Space</p>
                  <Button variant="cyber" size="sm" onClick={startGame} className="gap-2">
                    <Play className="w-4 h-4" />
                    Start Game
                  </Button>
                </>
              )}
            </div>
          )}
        </div>

        <p className="text-xs text-muted-foreground text-center mt-2">
          Play while data loads!
        </p>
      </div>
    </div>
  );
}
