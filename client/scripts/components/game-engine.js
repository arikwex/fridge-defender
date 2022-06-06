import bus from '../bus.js';
import Player from '../components/player.js';

const GameEngine = () => {
  const state = {
    player: new Player(50, 50)
  };

  return {
    state,
  };
};

export default GameEngine;