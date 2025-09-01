import { useState, useEffect, useCallback, useRef } from 'react';

interface Car {
  id: string;
  name: string;
  color: string;
  x: number;
  y: number;
  speed: number;
  angle: number;
  lap: number;
  lapTime: number;
  totalTime: number;
  isPlayer: boolean;
}

interface GameState {
  cars: Car[];
  gameTime: number;
  isRunning: boolean;
  currentLap: number;
  totalLaps: number;
  trackProgress: number;
}

const TRACK_WIDTH = 600;
const TRACK_HEIGHT = 400;
const CAR_SIZE = 20;
const MAX_SPEED = 8;
const ACCELERATION = 0.3;
const FRICTION = 0.15;
const TURN_SPEED = 0.08;

export const useGameEngine = () => {
  const [gameState, setGameState] = useState<GameState>({
    cars: [
      { id: 'player', name: 'You', color: 'primary', x: 100, y: 200, speed: 0, angle: 0, lap: 1, lapTime: 0, totalTime: 0, isPlayer: true },
      { id: 'ai1', name: 'SpeedRacer', color: 'secondary', x: 100, y: 150, speed: 0, angle: 0, lap: 1, lapTime: 0, totalTime: 0, isPlayer: false },
      { id: 'ai2', name: 'NeonDrifter', color: 'accent', x: 100, y: 250, speed: 0, angle: 0, lap: 1, lapTime: 0, totalTime: 0, isPlayer: false },
      { id: 'ai3', name: 'CyberPilot', color: 'neon-pink', x: 100, y: 300, speed: 0, angle: 0, lap: 1, lapTime: 0, totalTime: 0, isPlayer: false },
    ],
    gameTime: 0,
    isRunning: true,
    currentLap: 1,
    totalLaps: 3,
    trackProgress: 0
  });

  const [keys, setKeys] = useState({
    up: false,
    down: false,
    left: false,
    right: false,
    boost: false
  });

  const gameLoopRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);

  // Keyboard controls
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    switch (event.key.toLowerCase()) {
      case 'arrowup':
      case 'w':
        setKeys(prev => ({ ...prev, up: true }));
        break;
      case 'arrowdown':
      case 's':
        setKeys(prev => ({ ...prev, down: true }));
        break;
      case 'arrowleft':
      case 'a':
        setKeys(prev => ({ ...prev, left: true }));
        break;
      case 'arrowright':
      case 'd':
        setKeys(prev => ({ ...prev, right: true }));
        break;
      case ' ':
        event.preventDefault();
        setKeys(prev => ({ ...prev, boost: true }));
        break;
    }
  }, []);

  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    switch (event.key.toLowerCase()) {
      case 'arrowup':
      case 'w':
        setKeys(prev => ({ ...prev, up: false }));
        break;
      case 'arrowdown':
      case 's':
        setKeys(prev => ({ ...prev, down: false }));
        break;
      case 'arrowleft':
      case 'a':
        setKeys(prev => ({ ...prev, left: false }));
        break;
      case 'arrowright':
      case 'd':
        setKeys(prev => ({ ...prev, right: false }));
        break;
      case ' ':
        setKeys(prev => ({ ...prev, boost: false }));
        break;
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  // Physics and AI
  const updateCarPhysics = useCallback((car: Car, deltaTime: number): Car => {
    let newCar = { ...car };

    if (car.isPlayer) {
      // Player controls
      if (keys.up) {
        newCar.speed = Math.min(newCar.speed + ACCELERATION, keys.boost ? MAX_SPEED * 1.5 : MAX_SPEED);
      } else if (keys.down) {
        newCar.speed = Math.max(newCar.speed - ACCELERATION, -MAX_SPEED * 0.5);
      } else {
        newCar.speed *= (1 - FRICTION);
      }

      if (Math.abs(newCar.speed) > 0.5) {
        if (keys.left) {
          newCar.angle -= TURN_SPEED * (newCar.speed / MAX_SPEED);
        }
        if (keys.right) {
          newCar.angle += TURN_SPEED * (newCar.speed / MAX_SPEED);
        }
      }
    } else {
      // Simple AI behavior
      const targetSpeed = MAX_SPEED * 0.7 + Math.sin(car.totalTime * 0.01 + car.id.length) * 0.3;
      newCar.speed += (targetSpeed - newCar.speed) * 0.05;
      
      // AI steering (simple track following)
      const centerY = TRACK_HEIGHT / 2;
      const distanceFromCenter = newCar.y - centerY;
      newCar.angle += -distanceFromCenter * 0.001;
      
      // Add some randomness
      newCar.angle += (Math.random() - 0.5) * 0.02;
    }

    // Update position
    newCar.x += Math.cos(newCar.angle) * newCar.speed;
    newCar.y += Math.sin(newCar.angle) * newCar.speed;

    // Track boundaries
    if (newCar.y < 50) {
      newCar.y = 50;
      newCar.speed *= 0.8;
    }
    if (newCar.y > TRACK_HEIGHT - 50) {
      newCar.y = TRACK_HEIGHT - 50;
      newCar.speed *= 0.8;
    }

    // Lap detection (simple)
    if (newCar.x > TRACK_WIDTH) {
      newCar.x = 0;
      newCar.lap += 1;
      newCar.lapTime = 0;
    }
    if (newCar.x < 0) {
      newCar.x = TRACK_WIDTH;
    }

    // Update timing
    newCar.lapTime += deltaTime;
    newCar.totalTime += deltaTime;

    return newCar;
  }, [keys]);

  // Game loop
  const gameLoop = useCallback((currentTime: number) => {
    if (!gameState.isRunning) return;

    const deltaTime = currentTime - lastTimeRef.current;
    lastTimeRef.current = currentTime;

    setGameState(prevState => {
      const updatedCars = prevState.cars.map(car => updateCarPhysics(car, deltaTime));
      
      return {
        ...prevState,
        cars: updatedCars,
        gameTime: prevState.gameTime + deltaTime,
        trackProgress: (prevState.trackProgress + 0.5) % 100
      };
    });

    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, [gameState.isRunning, updateCarPhysics]);

  useEffect(() => {
    if (gameState.isRunning) {
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    }
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameLoop, gameState.isRunning]);

  const resetGame = () => {
    setGameState(prev => ({
      ...prev,
      cars: prev.cars.map(car => ({
        ...car,
        x: 100,
        y: car.isPlayer ? 200 : 150 + Math.random() * 100,
        speed: 0,
        angle: 0,
        lap: 1,
        lapTime: 0,
        totalTime: 0
      })),
      gameTime: 0,
      trackProgress: 0
    }));
  };

  const togglePause = () => {
    setGameState(prev => ({ ...prev, isRunning: !prev.isRunning }));
  };

  return {
    gameState,
    keys,
    resetGame,
    togglePause,
    TRACK_WIDTH,
    TRACK_HEIGHT,
    CAR_SIZE
  };
};