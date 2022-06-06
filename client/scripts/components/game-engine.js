import bus from '../bus.js';
import Player from '../components/player.js';

const GameEngine = () => {
  const state = {
    player: new Player(50, 50)
  };

  function update(dT) {
    state.player.update(dT);
  }

  return {
    state,
    update,
  };
};

export default GameEngine;