import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Users, Crown, MessageCircle, Car } from 'lucide-react';

interface Player {
  id: string;
  name: string;
  color: string;
  isReady: boolean;
  isHost: boolean;
}

interface Message {
  id: string;
  player: string;
  text: string;
  timestamp: Date;
}

const GameLobby = ({ onStartRace }: { onStartRace?: () => void }) => {
  const [players, setPlayers] = useState<Player[]>([
    { id: '1', name: 'Player 1', color: 'neon-blue', isReady: true, isHost: true },
    { id: '2', name: 'SpeedRacer', color: 'neon-green', isReady: true, isHost: false },
    { id: '3', name: 'NeonDrifter', color: 'neon-pink', isReady: false, isHost: false },
  ]);
  
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', player: 'SpeedRacer', text: 'Ready to race!', timestamp: new Date() },
    { id: '2', player: 'NeonDrifter', text: 'One moment, adjusting settings...', timestamp: new Date() },
  ]);
  
  const [newMessage, setNewMessage] = useState('');
  const [isReady, setIsReady] = useState(false);

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        player: 'Player 1',
        text: newMessage,
        timestamp: new Date()
      };
      setMessages([...messages, message]);
      setNewMessage('');
    }
  };

  const toggleReady = () => {
    setIsReady(!isReady);
  };

  const allPlayersReady = players.every(p => p.isReady) && isReady;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-4">
            CYBER RACING
          </h1>
          <p className="text-xl text-muted-foreground">Multiplayer Racing Lobby</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Players List */}
          <Card className="p-6 neon-border">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold">Players ({players.length}/4)</h2>
            </div>
            
            <div className="space-y-3">
              {players.map((player) => (
                <div key={player.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full bg-${player.color}`}></div>
                    <span className="font-medium">{player.name}</span>
                    {player.isHost && <Crown className="w-4 h-4 text-accent" />}
                  </div>
                  <Badge variant={player.isReady ? "default" : "outline"}>
                    {player.isReady ? 'Ready' : 'Not Ready'}
                  </Badge>
                </div>
              ))}
              
              {/* Current Player */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-primary/20 border border-primary/30">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-primary"></div>
                  <span className="font-medium">You</span>
                </div>
                <Badge variant={isReady ? "default" : "outline"}>
                  {isReady ? 'Ready' : 'Not Ready'}
                </Badge>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <Button 
                variant={isReady ? "secondary" : "racing"} 
                className="w-full"
                onClick={toggleReady}
              >
                {isReady ? 'Not Ready' : 'Ready Up'}
              </Button>
              
              {allPlayersReady && (
                <Button variant="winner" className="w-full" onClick={onStartRace}>
                  <Car className="w-4 h-4 mr-2" />
                  Start Race
                </Button>
              )}
            </div>
          </Card>

          {/* Game Preview */}
          <Card className="p-6 neon-border">
            <h2 className="text-xl font-semibold mb-4">Track Preview</h2>
            <div className="aspect-square bg-muted/30 rounded-lg relative overflow-hidden">
              <div className="absolute inset-0 racing-track opacity-20"></div>
              <div className="absolute inset-4 border-2 border-dashed border-primary/50 rounded-lg"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="text-4xl font-bold text-primary/70">NEON CIRCUIT</div>
              </div>
              
              {/* Racing Cars */}
              <div className="absolute bottom-6 left-6 w-6 h-3 bg-primary rounded-sm transform rotate-45"></div>
              <div className="absolute bottom-12 left-12 w-6 h-3 bg-secondary rounded-sm transform rotate-45"></div>
              <div className="absolute bottom-8 left-20 w-6 h-3 bg-accent rounded-sm transform rotate-45"></div>
            </div>
            
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Track:</span>
                <span className="text-primary">Neon Circuit</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Laps:</span>
                <span className="text-secondary">3</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Mode:</span>
                <span className="text-accent">Time Trial</span>
              </div>
            </div>
          </Card>

          {/* Chat */}
          <Card className="p-6 neon-border">
            <div className="flex items-center gap-2 mb-4">
              <MessageCircle className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold">Chat</h2>
            </div>
            
            <div className="h-64 bg-muted/30 rounded-lg p-3 mb-4 overflow-y-auto">
              <div className="space-y-2">
                {messages.map((message) => (
                  <div key={message.id} className="text-sm">
                    <span className="font-medium text-primary">{message.player}:</span>
                    <span className="ml-2 text-foreground">{message.text}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex gap-2">
              <Input
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                className="flex-1"
              />
              <Button variant="neon" onClick={sendMessage}>
                Send
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GameLobby;