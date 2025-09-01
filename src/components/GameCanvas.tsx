import React from 'react';

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

interface GameCanvasProps {
  cars: Car[];
  trackProgress: number;
  trackWidth: number;
  trackHeight: number;
  carSize: number;
  keys: any;
}

const GameCanvas: React.FC<GameCanvasProps> = ({ 
  cars, 
  trackProgress, 
  trackWidth, 
  trackHeight, 
  carSize,
  keys 
}) => {
  const getCarColor = (color: string) => {
    switch (color) {
      case 'primary': return '#3B82F6';
      case 'secondary': return '#10B981';
      case 'accent': return '#F59E0B';
      case 'neon-pink': return '#EC4899';
      default: return '#3B82F6';
    }
  };

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const centiseconds = Math.floor((ms % 1000) / 10);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative w-full h-full bg-background rounded-lg overflow-hidden">
      {/* Track Background */}
      <div className="absolute inset-0 racing-track track-scroll opacity-30"></div>
      
      {/* Track Lanes */}
      <div className="absolute inset-0 track-lanes"></div>
      
      {/* Speed Lines */}
      {cars.find(car => car.isPlayer)?.speed > 3 && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-12 h-1 bg-primary/30 speed-lines"
              style={{
                top: `${20 + i * 40}px`,
                right: '0px',
                animationDelay: `${i * 0.1}s`
              }}
            />
          ))}
        </div>
      )}

      {/* Cars */}
      {cars.map((car) => (
        <div
          key={car.id}
          className={`car-sprite absolute ${car.speed > 5 ? 'car-engine' : ''} ${keys.boost && car.isPlayer ? 'boosting' : ''}`}
          style={{
            left: `${car.x}px`,
            top: `${car.y}px`,
            backgroundColor: getCarColor(car.color),
            transform: `translate(-50%, -50%) rotate(${car.angle}rad)`,
            boxShadow: car.isPlayer 
              ? `0 0 ${Math.min(car.speed * 2, 20)}px ${getCarColor(car.color)}50`
              : `0 0 ${Math.min(car.speed, 10)}px ${getCarColor(car.color)}30`
          }}
        >
          {/* Car Details */}
          <div 
            className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs font-bold whitespace-nowrap"
            style={{ color: getCarColor(car.color) }}
          >
            {car.name}
          </div>
          
          {car.isPlayer && (
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-primary font-mono">
              {Math.round(car.speed * 20)} KM/H
            </div>
          )}
        </div>
      ))}

      {/* Finish Line */}
      <div 
        className="absolute top-0 bottom-0 w-2 bg-gradient-to-b from-accent via-primary to-secondary opacity-80"
        style={{ right: '50px' }}
      >
        <div className="absolute top-1/2 -right-12 transform -translate-y-1/2 text-xs font-bold text-accent">
          FINISH
        </div>
      </div>

      {/* Track Boundaries */}
      <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-primary/50 to-transparent"></div>
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-secondary/50 to-transparent"></div>

      {/* Controls Hint */}
      <div className="absolute bottom-4 left-4 text-xs text-muted-foreground bg-background/80 p-2 rounded border">
        <div className="font-bold mb-1">Controls:</div>
        <div className="flex gap-1">
          <span className={`px-1 rounded ${keys.up ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>W</span>
          <span className={`px-1 rounded ${keys.left ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>A</span>
          <span className={`px-1 rounded ${keys.down ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>S</span>
          <span className={`px-1 rounded ${keys.right ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>D</span>
          <span className={`px-1 rounded ${keys.boost ? 'bg-accent text-accent-foreground' : 'bg-muted'}`}>SPACE</span>
        </div>
        <div className="text-xs mt-1">SPACE = Boost</div>
      </div>

      {/* Minimap */}
      <div className="absolute top-4 right-4 w-32 h-20 minimap rounded border-2 border-primary/30 overflow-hidden">
        <div className="relative w-full h-full bg-background/80">
          {cars.map((car) => (
            <div
              key={`minimap-${car.id}`}
              className="absolute w-2 h-1 rounded"
              style={{
                backgroundColor: getCarColor(car.color),
                left: `${(car.x / trackWidth) * 100}%`,
                top: `${(car.y / trackHeight) * 100}%`,
                transform: 'translate(-50%, -50%)',
                boxShadow: car.isPlayer ? `0 0 4px ${getCarColor(car.color)}` : 'none'
              }}
            />
          ))}
          <div className="absolute right-1 top-0 bottom-0 w-0.5 bg-accent opacity-60"></div>
        </div>
      </div>

      {/* Race Info Overlay */}
      <div className="absolute top-4 left-4 space-y-2">
        {(() => {
          const playerCar = cars.find(car => car.isPlayer);
          const sortedCars = [...cars].sort((a, b) => {
            if (a.lap !== b.lap) return b.lap - a.lap;
            return b.x - a.x;
          });
          const playerPosition = sortedCars.findIndex(car => car.isPlayer) + 1;
          
          return playerCar ? (
            <>
              <div className="bg-background/80 px-3 py-1 rounded border border-primary/30">
                <span className="text-primary font-bold">Position: {playerPosition}/{cars.length}</span>
              </div>
              <div className="bg-background/80 px-3 py-1 rounded border border-secondary/30">
                <span className="text-secondary font-bold">Lap: {playerCar.lap}/3</span>
              </div>
              <div className="bg-background/80 px-3 py-1 rounded border border-accent/30">
                <span className="text-accent font-bold font-mono">
                  {formatTime(playerCar.totalTime)}
                </span>
              </div>
            </>
          ) : null;
        })()}
      </div>
    </div>
  );
};

export default GameCanvas;