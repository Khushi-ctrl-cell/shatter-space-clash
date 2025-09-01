import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Timer, Users, ArrowLeft, Play, Pause, RotateCcw } from 'lucide-react';
import { useGameEngine } from '@/hooks/useGameEngine';
import GameCanvas from '@/components/GameCanvas';

const RacingGame = ({ onBackToLobby }: { onBackToLobby?: () => void }) => {
  const { gameState, keys, resetGame, togglePause, TRACK_WIDTH, TRACK_HEIGHT, CAR_SIZE } = useGameEngine();
  const [raceFinished, setRaceFinished] = useState(false);

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const centiseconds = Math.floor((ms % 1000) / 10);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
  };

  const formatSpeed = (speed: number) => {
    return Math.round(speed * 20);
  };

  // Check for race finish
  useEffect(() => {
    const playerCar = gameState.cars.find(car => car.isPlayer);
    if (playerCar && playerCar.lap > gameState.totalLaps && !raceFinished) {
      setRaceFinished(true);
    }
  }, [gameState.cars, gameState.totalLaps, raceFinished]);

  const playerCar = gameState.cars.find(car => car.isPlayer);
  const sortedCars = [...gameState.cars].sort((a, b) => {
    if (a.lap !== b.lap) return b.lap - a.lap;
    return b.x - a.x;
  });
  const playerPosition = sortedCars.findIndex(car => car.isPlayer) + 1;

  const leaderboardData = sortedCars.map((car, index) => ({
    ...car,
    position: index + 1,
    lapTimeFormatted: formatTime(car.lapTime),
    totalTimeFormatted: formatTime(car.totalTime)
  }));

  const restartRace = () => {
    setRaceFinished(false);
    resetGame();
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header with Race Stats */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onBackToLobby} className="text-muted-foreground">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Lobby
            </Button>
            <Button variant="outline" onClick={togglePause}>
              {gameState.isRunning ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
              {gameState.isRunning ? 'Pause' : 'Resume'}
            </Button>
            <Button variant="outline" onClick={restartRace}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Restart
            </Button>
          </div>
          
          <div className="flex items-center gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">{playerPosition}</div>
              <div className="text-sm text-muted-foreground">Position</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-secondary">
                {playerCar?.lap || 1}/{gameState.totalLaps}
              </div>
              <div className="text-sm text-muted-foreground">Lap</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-accent">
                {playerCar ? formatTime(playerCar.totalTime) : '0:00.00'}
              </div>
              <div className="text-sm text-muted-foreground">Time</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-neon-green">
                {playerCar ? formatSpeed(playerCar.speed) : 0}
              </div>
              <div className="text-sm text-muted-foreground">KM/H</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant={gameState.isRunning ? "default" : "outline"}>
              {gameState.isRunning ? 'Racing' : 'Paused'}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Game Area */}
          <div className="lg:col-span-3">
            <Card className="p-6 neon-border">
              <div className="aspect-video bg-muted/30 rounded-lg relative overflow-hidden">
                <GameCanvas
                  cars={gameState.cars}
                  trackProgress={gameState.trackProgress}
                  trackWidth={TRACK_WIDTH}
                  trackHeight={TRACK_HEIGHT}
                  carSize={CAR_SIZE}
                  keys={keys}
                />
              </div>
              
              {/* Game Instructions */}
              <div className="mt-4 p-4 bg-muted/20 rounded-lg">
                <h3 className="font-bold mb-2 text-center">🏁 Cyber Racing Championship 🏁</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-semibold text-primary mb-1">🎮 How to Play:</p>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• Use WASD or Arrow Keys to control your car</li>
                      <li>• Hold SPACE for turbo boost</li>
                      <li>• Complete 3 laps to finish the race</li>
                      <li>• Stay on track for maximum speed</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold text-secondary mb-1">🏆 Race Features:</p>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• Real-time multiplayer simulation</li>
                      <li>• Live position tracking</li>
                      <li>• Physics-based car movement</li>
                      <li>• Dynamic speed effects</li>
                    </ul>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Leaderboard */}
          <div className="space-y-6">
            <Card className="p-4 neon-border">
              <div className="flex items-center gap-2 mb-4">
                <Trophy className="w-5 h-5 text-accent" />
                <h3 className="font-semibold">Live Leaderboard</h3>
              </div>
              
              <div className="space-y-2">
                {leaderboardData.map((car, index) => (
                  <div 
                    key={car.id} 
                    className={`flex items-center justify-between p-3 rounded-lg transition-all ${
                      car.isPlayer 
                        ? 'bg-primary/20 border border-primary/30 pulse-neon' 
                        : 'bg-muted/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                        index === 0 ? 'bg-accent text-accent-foreground' : 
                        index === 1 ? 'bg-secondary text-secondary-foreground' : 
                        'bg-muted text-muted-foreground'
                      }`}>
                        {car.position}
                      </div>
                      <div>
                        <div className="font-medium flex items-center gap-2">
                          {car.name}
                          {car.isPlayer && <span className="text-xs bg-primary px-1 rounded">YOU</span>}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Lap {car.lap} • {formatSpeed(car.speed)} KM/H
                        </div>
                      </div>
                    </div>
                    <div className="text-right text-xs">
                      <div className="font-mono">{car.lapTimeFormatted}</div>
                      <div className="text-muted-foreground">{car.totalTimeFormatted}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-4 neon-border">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Timer className="w-4 h-4" />
                Race Statistics
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Best Lap:</span>
                  <span className="font-mono text-secondary">
                    {Math.min(...gameState.cars.map(c => c.lapTime)) < Infinity 
                      ? formatTime(Math.min(...gameState.cars.map(c => c.lapTime)))
                      : '--:--'
                    }
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Your Speed:</span>
                  <span className="font-mono text-primary">
                    {playerCar ? formatSpeed(playerCar.speed) : 0} KM/H
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Race Time:</span>
                  <span className="font-mono text-accent">
                    {formatTime(gameState.gameTime)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Players:</span>
                  <span className="text-neon-green">
                    <Users className="w-4 h-4 inline mr-1" />
                    {gameState.cars.length}
                  </span>
                </div>
              </div>
            </Card>

            {/* Game Tips */}
            <Card className="p-4 border-accent/30">
              <h3 className="font-semibold mb-2 text-accent">💡 Pro Tips</h3>
              <div className="space-y-1 text-xs text-muted-foreground">
                <p>• Use boost sparingly - it drains quickly!</p>
                <p>• Turn gradually to maintain speed</p>
                <p>• Watch the minimap for track position</p>
                <p>• Stay in the center lanes for best speed</p>
              </div>
            </Card>
          </div>
        </div>

        {/* Race Finished Modal */}
        {raceFinished && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
            <Card className="p-8 max-w-md w-full mx-4 neon-border animate-scale-in">
              <div className="text-center">
                <Trophy className="w-16 h-16 text-accent mx-auto mb-4 animate-pulse" />
                <h2 className="text-3xl font-bold mb-2">Race Complete!</h2>
                <p className="text-xl text-muted-foreground mb-6">
                  You finished in position {playerPosition} of {gameState.cars.length}
                </p>
                
                <div className="space-y-2 mb-6 text-left bg-muted/20 p-4 rounded">
                  <div className="flex justify-between">
                    <span>Final Time:</span>
                    <span className="font-mono text-primary">
                      {playerCar ? formatTime(playerCar.totalTime) : '--:--'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Best Lap:</span>
                    <span className="font-mono text-secondary">
                      {playerCar ? formatTime(playerCar.lapTime) : '--:--'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Position:</span>
                    <span className="font-bold text-accent">{playerPosition}/{gameState.cars.length}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button variant="racing" className="w-full" onClick={restartRace}>
                    Race Again
                  </Button>
                  <Button variant="ghost" className="w-full" onClick={onBackToLobby}>
                    Back to Lobby
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default RacingGame;