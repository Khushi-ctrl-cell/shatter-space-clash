import { useState } from 'react';
import GameMenu from '@/components/GameMenu';
import GameLobby from '@/components/GameLobby';
import RacingGame from '@/components/RacingGame';

type GameState = 'menu' | 'lobby' | 'racing';

const Index = () => {
  const [gameState, setGameState] = useState<GameState>('menu');

  const handleJoinLobby = () => {
    setGameState('lobby');
  };

  const handleStartRace = () => {
    setGameState('racing');
  };

  const handleBackToMenu = () => {
    setGameState('menu');
  };

  switch (gameState) {
    case 'menu':
      return <GameMenu onJoinLobby={handleJoinLobby} onStartRace={handleStartRace} />;
    case 'lobby':
      return <GameLobby onStartRace={handleStartRace} />;
    case 'racing':
      return <RacingGame onBackToLobby={handleBackToMenu} />;
    default:
      return <GameMenu onJoinLobby={handleJoinLobby} onStartRace={handleStartRace} />;
  }
};

export default Index;
