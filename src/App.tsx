import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserPlus,
  RefreshCw,
  ChevronRight,
  Fingerprint,
  X,
  Settings,
  Users,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { TOPICS_WORDS } from './data/words';

type GamePhase = 'SETUP_PLAYERS' | 'SETUP_CATEGORY' | 'PASSING' | 'REVEALING' | 'END';

interface Player {
  id: string;
  name: string;
  word: string;
  isKallan: boolean;
  color: string;
}

interface TopicData {
  id: string;
  title: string;
  emoji: string;
  description: string;
}

const TOPICS_DATA: TopicData[] = [
  { id: "🎬 Malayalam Cinema", title: "Malayalam Cinema", emoji: "🎬", description: "Classic movies and current hits from Mollywood." },
  { id: "🎭 Movie Characters (Mal)", title: "Malayalam Characters", emoji: "🎭", description: "Iconic and legendary characters from Malayalam films." },
  { id: "🚗 Cars", title: "Cars", emoji: "🏎️", description: "Supercars, luxury SUVs, and legendary auto brands from around the world." },
  { id: "🏥 Medical", title: "Medical", emoji: "🏥", description: "Common medical terms, departments, and equipment." },
  { id: "🇬🇧 Life in UK", title: "Life in UK", emoji: "💂", description: "Culture, landmarks, and daily life in the United Kingdom." },
  { id: "☕ Java Programming", title: "Java Dev", emoji: "☕", description: "JVM concepts, frameworks, and backend engineering terms." },
  { id: "🏃 Agile Methodology", title: "Agile/Scrum", emoji: "🏃", description: "Common terminology used in agile workflows and sprint cycles." },
  { id: "🎭 Movie Characters (Tam)", title: "Tamil Characters", emoji: "🦁", description: "Memorable characters and stars from the Kollywood film industry." },
  { id: "📍 Places in Kerala", title: "God's Own Country", emoji: "🌴", description: "Explore vibrant locations across the districts of Kerala." },
  { id: "🏏 Indian Cricket", title: "Cricket Mania", emoji: "🏏", description: "Legendary Indian cricketers and iconic cricket venues." },
  { id: "📚 Kerala PSC", title: "PSC Quest", emoji: "📚", description: "Essential terms for competitive exams in Kerala." },
  { id: "🌍 Common Words", title: "Common Words", emoji: "🌍", description: "Easy and simple everyday words for everyone." }
];

const ANIME_COLORS = [
  '#FF416C', '#FF4B2B', '#4568DC', '#B06AB3', '#11998e', '#38ef7d', '#FC466B', '#3F5EFB', '#00F260', '#0575E6', '#f12711', '#f5af19'
];


const App: React.FC = () => {
  const [phase, setPhase] = useState<GamePhase>('SETUP_PLAYERS');
  const [playerNames, setPlayerNames] = useState<string[]>([]);
  const [newName, setNewName] = useState('');
  const [selectedTopic, setSelectedTopic] = useState(TOPICS_DATA[0].id);
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (phase === 'SETUP_PLAYERS') {
      inputRef.current?.focus();
    }
  }, [phase]);

  // Update background color based on current player
  useEffect(() => {
    if (players.length > 0 && (phase === 'PASSING' || phase === 'REVEALING')) {
      const activePlayer = players[currentPlayerIndex];
      document.body.style.setProperty('--bg-gradient', `linear-gradient(180deg, ${activePlayer.color} 0%, #1C1B21 100%)`);
      document.body.style.setProperty('--grid-color', 'rgba(255, 255, 255, 0.2)');
    } else {
      document.body.style.setProperty('--bg-gradient', 'linear-gradient(180deg, #FF456A 0%, #FF1F4B 100%)');
      document.body.style.setProperty('--grid-color', 'rgba(255, 255, 255, 0.1)');
    }
  }, [phase, currentPlayerIndex, players]);

  const addPlayer = () => {
    if (newName.trim() && playerNames.length < 10 && !playerNames.includes(newName.trim())) {
      setPlayerNames([...playerNames, newName.trim()]);
      setNewName('');
      // Use setTimeout to ensure focus stays after state update
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  };

  const removePlayer = (name: string) => {
    setPlayerNames(playerNames.filter(n => n !== name));
  };

  const startGame = () => {
    const topicWords = [...TOPICS_WORDS[selectedTopic]];

    // Fisher-Yates shuffle for maximum randomness
    for (let i = topicWords.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [topicWords[i], topicWords[j]] = [topicWords[j], topicWords[i]];
    }

    const randomWord = topicWords[Math.floor(Math.random() * topicWords.length)];
    const kallanIndex = Math.floor(Math.random() * playerNames.length);

    const gamePlayers: Player[] = playerNames.map((name, index) => ({
      id: Math.random().toString(36).substr(2, 9),
      name,
      word: index === kallanIndex ? 'KALLAN' : randomWord,
      isKallan: index === kallanIndex,
      color: ANIME_COLORS[Math.floor(Math.random() * ANIME_COLORS.length)]
    }));

    setPlayers(gamePlayers);
    setCurrentPlayerIndex(0);
    setPhase('PASSING');
  };

  const nextAction = () => {
    if (phase === 'PASSING') {
      setPhase('REVEALING');
      setIsRevealed(false);
    } else if (phase === 'REVEALING') {
      if (currentPlayerIndex < players.length - 1) {
        setCurrentPlayerIndex(currentPlayerIndex + 1);
        setPhase('PASSING');
      } else {
        setIsRevealed(false);
        setPhase('END');
      }
    }
  };

  const resetGame = () => {
    setPhase('SETUP_PLAYERS');
    setPlayers([]);
    setCurrentPlayerIndex(0);
    setIsRevealed(false);
  };

  return (
    <div id="root">
      <AnimatePresence mode="wait">
        {phase === 'SETUP_PLAYERS' && (
          <motion.div
            key="setup_players"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <img
              src="/logo.png"
              alt="Kallan Logo"
              className="app-logo"
            />
            <div className="header">
              <button className="icon-btn"><Users size={24} /></button>
              <h1>Players</h1>
              <button className="icon-btn"><Settings size={24} /></button>
            </div>

            <div className="player-list">
              {playerNames.map((name) => (
                <motion.div
                  layout
                  key={name}
                  className="player-item"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <span>{name}</span>
                  <X
                    size={24}
                    onClick={() => removePlayer(name)}
                    style={{ cursor: 'pointer', opacity: 0.6 }}
                  />
                </motion.div>
              ))}
            </div>

            <div className="input-container">
              <input
                ref={inputRef}
                className="player-input"
                placeholder="Enter player name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addPlayer()}
              />
              <button className="add-btn" onClick={addPlayer}>
                <UserPlus size={24} />
              </button>
            </div>

            <div className="bottom-action">
              <button
                className="action-main"
                disabled={playerNames.length < 3}
                onClick={() => setPhase('SETUP_CATEGORY')}
              >
                Continue
              </button>
              <div className="action-divider"></div>
              <div className="action-info">
                {playerNames.length} Players
              </div>
            </div>
          </motion.div>
        )}

        {phase === 'SETUP_CATEGORY' && (
          <motion.div
            key="setup_category"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
          >
            <div className="header">
              <button className="icon-btn" onClick={() => setPhase('SETUP_PLAYERS')}><ChevronRight size={24} style={{ transform: 'rotate(180deg)' }} /></button>
              <h1>Categories</h1>
              <button className="icon-btn"><Info size={24} /></button>
            </div>

            <div className="category-list">
              {TOPICS_DATA.map((topic) => (
                <div
                  key={topic.id}
                  className={`category-card ${selectedTopic === topic.id ? 'selected' : ''}`}
                  onClick={() => setSelectedTopic(topic.id)}
                >
                  <div className="category-info">
                    <h2>{topic.title}</h2>
                    <p>{topic.description}</p>
                  </div>
                  <div style={{ fontSize: '48px' }} className="category-image">
                    {topic.emoji}
                  </div>
                </div>
              ))}
            </div>

            <div className="bottom-action">
              <button className="action-main" onClick={startGame}>
                Play
              </button>
              <div className="action-divider"></div>
              <div className="action-info">
                1 Category
              </div>
            </div>
          </motion.div>
        )}

        {phase === 'PASSING' && (
          <motion.div
            key="passing"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="game-card"
          >
            <div style={{ fontSize: '64px', marginBottom: '20px' }}>📱</div>
            <h2 style={{ fontSize: '28px', marginBottom: '10px' }}>Pass Device</h2>
            <p style={{ opacity: 0.6, marginBottom: '30px' }}>Give it to...</p>
            <div style={{ fontSize: '48px', fontWeight: 800, color: 'var(--primary)', marginBottom: '40px' }}>
              {players[currentPlayerIndex].name}
            </div>
            <button className="btn btn-primary" onClick={nextAction} style={{ width: '100%' }}>
              I am {players[currentPlayerIndex].name}
            </button>
          </motion.div>
        )}

        {phase === 'REVEALING' && (
          <motion.div
            key="revealing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="game-card"
          >
            <div style={{ fontSize: '24px', fontWeight: 800, marginBottom: '20px' }}>
              SECRET FOR {players[currentPlayerIndex].name.toUpperCase()}
            </div>
            <p style={{ opacity: 0.6, marginBottom: '20px' }}>Tap below to see your role</p>

            <div
              className="reveal-box"
              onClick={() => setIsRevealed(true)}
            >
              {isRevealed ? (
                players[currentPlayerIndex].isKallan ? (
                  <span className="kallan-text">KALLAN 🕵️‍♂️</span>
                ) : (
                  <span style={{ fontSize: '32px', fontWeight: 800 }}>{players[currentPlayerIndex].word}</span>
                )
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: 0.5 }}>
                  <Fingerprint size={48} />
                  <span style={{ marginTop: '10px' }}>TAP TO REVEAL</span>
                </div>
              )}
            </div>

            {isRevealed && (
              <button className="btn btn-primary" onClick={nextAction} style={{ width: '100%', marginTop: '20px' }}>
                Got it!
              </button>
            )}
          </motion.div>
        )}

        {phase === 'END' && (
          <motion.div
            key="end"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="game-card"
          >
            <h1 style={{ marginBottom: '10px' }}>Who is Kallan?</h1>
            <p style={{ opacity: 0.6, marginBottom: '30px' }}>Discuss and vote!</p>

            <div
              className="reveal-box"
              style={{ height: '120px' }}
              onClick={() => {
                setIsRevealed(true);
                confetti({
                  particleCount: 150,
                  spread: 70,
                  origin: { y: 0.6 }
                });
              }}
            >
              {isRevealed ? (
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '14px', opacity: 0.6 }}>KALLAN WAS</div>
                  <div className="kallan-text" style={{ fontSize: '32px' }}>{players.find(p => p.isKallan)?.name}</div>
                  <div style={{ fontSize: '18px', marginTop: '10px' }}>Word: {players.find(p => !p.isKallan)?.word}</div>
                </div>
              ) : (
                <span>TAP TO REVEAL IDENTITY</span>
              )}
            </div>

            {isRevealed && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="btn btn-primary"
                onClick={resetGame}
                style={{ width: '100%' }}
              >
                <RefreshCw size={20} style={{ marginRight: '10px' }} /> Play Again
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
