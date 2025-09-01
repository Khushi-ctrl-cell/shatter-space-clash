import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Timer, Users, ArrowLeft } from 'lucide-react';
import racingCarsImage from '@/assets/racing-cars.png';

interface RacePosition {
  id: string;
  name: string;
  color: string;
  position: number;
  lapTime: string;
  totalTime: string;
  lap: number;
}

interface GameStats {
  currentLap: number;
  totalLaps: number;
  raceTime: string;
  position: number;
  speed: number;
}

const RacingGame = () => {
  const [raceData, setRaceData] = useState<RacePosition[]>([
    { id: '1', name: 'You', color: 'primary', position: 2, lapTime: '1:23.45', totalTime: '4:12.33', lap: 2 },
    { id: '2', name: 'SpeedRacer', color: 'secondary', position: 1, lapTime: '1:21.12', totalTime: '4:09.87', lap: 2 },
    { id: '3', name: 'NeonDrifter', color: 'accent', position: 3, lapTime: '1:25.67', totalTime: '4:18.92', lap: 2 },
    { id: '4', name: 'CyberPilot', color: 'neon-pink', position: 4, lapTime: '1:28.34', totalTime: '4:24.11', lap: 1 },
  ]);

  const [gameStats, setGameStats] = useState<GameStats>({
    currentLap: 2,
    totalLaps: 3,
    raceTime: '4:12.33',
    position: 2,
    speed: 145
  });

  const [raceStarted, setRaceStarted] = useState(true);
  const [raceFinished, setRaceFinished] = useState(false);
  const [keys, setKeys] = useState({ up: false, down: false, left: false, right: false });

  // Simulate race updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (raceStarted && !raceFinished) {
        setGameStats(prev => ({
          ...prev,
          speed: Math.floor(Math.random() * 50) + 120,
          raceTime: updateTime(prev.raceTime)
        }));
      }
    }, 100);

    return () => clearInterval(interval);
  }, [raceStarted, raceFinished]);

  const updateTime = (currentTime: string): string => {
    const [minutes, seconds] = currentTime.split(':');
    const [sec, ms] = seconds.split('.');
    let newMs = parseInt(ms) + 1;
    let newSec = parseInt(sec);
    let newMin = parseInt(minutes);

    if (newMs >= 100) {
      newMs = 0;
      newSec++;
    }
    if (newSec >= 60) {
      newSec = 0;
      newMin++;
    }

    return `${newMin}:${newSec.toString().padStart(2, '0')}.${newMs.toString().padStart(2, '0')}`;
  };

  // Keyboard controls
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        setKeys(prev => ({ ...prev, up: true }));
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        setKeys(prev => ({ ...prev, down: true }));
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        setKeys(prev => ({ ...prev, left: true }));
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        setKeys(prev => ({ ...prev, right: true }));
        break;
    }
  }, []);

  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        setKeys(prev => ({ ...prev, up: false }));
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        setKeys(prev => ({ ...prev, down: false }));
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        setKeys(prev => ({ ...prev, left: false }));
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        setKeys(prev => ({ ...prev, right: false }));
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

  const finishRace = () => {
    setRaceFinished(true);
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header with Race Stats */}
        <div className="flex justify-between items-center mb-6">
          <Button variant="ghost" className="text-muted-foreground">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Lobby
          </Button>
          
          <div className="flex items-center gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">{gameStats.position}</div>
              <div className="text-sm text-muted-foreground">Position</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-secondary">{gameStats.currentLap}/{gameStats.totalLaps}</div>
              <div className="text-sm text-muted-foreground">Lap</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-accent">{gameStats.raceTime}</div>
              <div className="text-sm text-muted-foreground">Time</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-neon-green">{gameStats.speed}</div>
              <div className="text-sm text-muted-foreground">KM/H</div>
            </div>
          </div>

          <Button variant="destructive" onClick={finishRace}>
            Finish Race
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Game Area */}
          <div className="lg:col-span-3">
            <Card className="p-6 neon-border">
              <div className="aspect-video bg-muted/30 rounded-lg relative overflow-hidden">
                {/* Racing Track */}
                <div className="absolute inset-0 bg-gradient-to-b from-background to-muted/50">
                  <div className="racing-track h-full opacity-30"></div>
                  
                  {/* Track borders */}
                  <div className="absolute top-0 left-0 w-full h-4 bg-gradient-to-r from-primary/50 to-secondary/50"></div>
                  <div className="absolute bottom-0 left-0 w-full h-4 bg-gradient-to-r from-primary/50 to-secondary/50"></div>
                  
                  {/* Racing cars */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <img 
                      src={racingCarsImage} 
                      alt="Racing cars on track" 
                      className="max-w-md opacity-80 animate-pulse"
                    />
                  </div>
                  
                  {/* Speed indicators */}
                  <div className="absolute inset-0 pointer-events-none">
                    {Array.from({ length: 20 }).map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-1 h-8 bg-primary/20 animate-pulse"
                        style={{
                          left: `${Math.random() * 100}%`,
                          top: `${Math.random() * 100}%`,
                          animationDelay: `${Math.random() * 2}s`
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Controls overlay */}
                <div className="absolute bottom-4 right-4 text-xs text-muted-foreground bg-background/80 p-2 rounded">
                  <div>Use WASD or Arrow Keys</div>
                  <div className="flex gap-1 mt-1">
                    <span className={`px-1 rounded ${keys.up ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>↑</span>
                    <span className={`px-1 rounded ${keys.left ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>←</span>
                    <span className={`px-1 rounded ${keys.down ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>↓</span>
                    <span className={`px-1 rounded ${keys.right ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>→</span>
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
                {raceData
                  .sort((a, b) => a.position - b.position)
                  .map((player, index) => (
                    <div 
                      key={player.id} 
                      className={`flex items-center justify-between p-3 rounded-lg ${
                        player.name === 'You' ? 'bg-primary/20 border border-primary/30' : 'bg-muted/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                          index === 0 ? 'bg-accent text-accent-foreground' : 
                          index === 1 ? 'bg-secondary text-secondary-foreground' : 
                          'bg-muted text-muted-foreground'
                        }`}>
                          {player.position}
                        </div>
                        <div>
                          <div className="font-medium">{player.name}</div>
                          <div className="text-xs text-muted-foreground">Lap {player.lap}</div>
                        </div>
                      </div>
                      <div className="text-right text-xs">
                        <div className="font-mono">{player.lapTime}</div>
                        <div className="text-muted-foreground">{player.totalTime}</div>
                      </div>
                    </div>
                  ))}
              </div>
            </Card>

            <Card className="p-4 neon-border">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Timer className="w-4 h-4" />
                Race Info
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Best Lap:</span>
                  <span className="font-mono text-secondary">1:21.12</span>
                </div>
                <div className="flex justify-between">
                  <span>Average Speed:</span>
                  <span className="font-mono text-primary">{gameStats.speed} KM/H</span>
                </div>
                <div className="flex justify-between">
                  <span>Track Record:</span>
                  <span className="font-mono text-accent">1:18.95</span>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Race Finished Modal */}
        {raceFinished && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
            <Card className="p-8 max-w-md w-full mx-4 neon-border">
              <div className="text-center">
                <Trophy className="w-16 h-16 text-accent mx-auto mb-4" />
                <h2 className="text-3xl font-bold mb-2">Race Finished!</h2>
                <p className="text-xl text-muted-foreground mb-6">You finished in position {gameStats.position}</p>
                
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between">
                    <span>Total Time:</span>
                    <span className="font-mono text-primary">{gameStats.raceTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Best Lap:</span>
                    <span className="font-mono text-secondary">1:23.45</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button variant="racing" className="w-full">
                    Race Again
                  </Button>
                  <Button variant="ghost" className="w-full">
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