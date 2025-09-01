import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play, Users, Trophy, Settings, Car, Zap } from 'lucide-react';
import heroImage from '@/assets/racing-hero.jpg';

interface GameMode {
  id: string;
  name: string;
  description: string;
  players: string;
  icon: any;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

const GameMenu = ({ onJoinLobby, onStartRace }: { onJoinLobby: () => void; onStartRace: () => void }) => {
  const [selectedMode, setSelectedMode] = useState<string>('time-trial');

  const gameModes: GameMode[] = [
    {
      id: 'time-trial',
      name: 'Time Trial',
      description: 'Race against the clock on the neon circuit',
      players: '1-4 Players',
      icon: Zap,
      difficulty: 'Easy'
    },
    {
      id: 'multiplayer',
      name: 'Multiplayer Race',
      description: 'Compete with up to 4 players in real-time',
      players: '2-4 Players',
      icon: Users,
      difficulty: 'Medium'
    },
    {
      id: 'championship',
      name: 'Championship',
      description: 'Series of races with points and rankings',
      players: '2-4 Players',
      icon: Trophy,
      difficulty: 'Hard'
    }
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Hero Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/40" />

      <div className="relative z-10 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 pt-12">
            <h1 className="text-8xl font-bold mb-6">
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                CYBER
              </span>
              <br />
              <span className="bg-gradient-to-r from-accent via-primary to-secondary bg-clip-text text-transparent">
                RACING
              </span>
            </h1>
            <p className="text-2xl text-muted-foreground mb-8">
              Experience the future of multiplayer racing
            </p>
            <div className="flex justify-center gap-4 mb-8">
              <Badge variant="outline" className="text-primary border-primary">
                Real-time Multiplayer
              </Badge>
              <Badge variant="outline" className="text-secondary border-secondary">
                Live Leaderboards
              </Badge>
              <Badge variant="outline" className="text-accent border-accent">
                Chat System
              </Badge>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex justify-center gap-6 mb-12">
            <Button variant="racing" size="lg" onClick={onJoinLobby} className="text-lg px-8 py-4">
              <Users className="w-6 h-6 mr-3" />
              Join Lobby
            </Button>
            <Button variant="neon" size="lg" onClick={onStartRace} className="text-lg px-8 py-4">
              <Play className="w-6 h-6 mr-3" />
              Quick Race
            </Button>
          </div>

          {/* Game Modes */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-center mb-8">Choose Your Mode</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {gameModes.map((mode) => {
                const IconComponent = mode.icon;
                return (
                  <Card 
                    key={mode.id} 
                    className={`p-6 cursor-pointer transition-all duration-300 hover:scale-105 ${
                      selectedMode === mode.id 
                        ? 'neon-border bg-primary/10' 
                        : 'border-muted hover:border-primary/50'
                    }`}
                    onClick={() => setSelectedMode(mode.id)}
                  >
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                        <IconComponent className="w-8 h-8 text-foreground" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">{mode.name}</h3>
                      <p className="text-muted-foreground mb-4">{mode.description}</p>
                      <div className="flex justify-between items-center">
                        <Badge variant="outline">{mode.players}</Badge>
                        <Badge 
                          variant={
                            mode.difficulty === 'Easy' ? 'default' : 
                            mode.difficulty === 'Medium' ? 'secondary' : 
                            'destructive'
                          }
                        >
                          {mode.difficulty}
                        </Badge>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Card className="p-6 text-center">
              <Car className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="font-bold mb-2">Real-time Racing</h3>
              <p className="text-sm text-muted-foreground">
                Experience lag-free multiplayer racing with instant responses
              </p>
            </Card>
            
            <Card className="p-6 text-center">
              <Trophy className="w-12 h-12 text-secondary mx-auto mb-4" />
              <h3 className="font-bold mb-2">Live Leaderboards</h3>
              <p className="text-sm text-muted-foreground">
                Track your progress with real-time rankings and statistics
              </p>
            </Card>
            
            <Card className="p-6 text-center">
              <Users className="w-12 h-12 text-accent mx-auto mb-4" />
              <h3 className="font-bold mb-2">Team Chat</h3>
              <p className="text-sm text-muted-foreground">
                Communicate with other racers in real-time chat
              </p>
            </Card>
            
            <Card className="p-6 text-center">
              <Settings className="w-12 h-12 text-neon-pink mx-auto mb-4" />
              <h3 className="font-bold mb-2">Customizable</h3>
              <p className="text-sm text-muted-foreground">
                Personalize your racing experience with custom settings
              </p>
            </Card>
          </div>

          {/* Bottom Actions */}
          <div className="text-center">
            <Button 
              variant="winner" 
              size="lg" 
              onClick={selectedMode === 'multiplayer' ? onJoinLobby : onStartRace}
              className="text-lg px-12 py-4"
            >
              <Play className="w-6 h-6 mr-3" />
              Start {gameModes.find(m => m.id === selectedMode)?.name}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameMenu;