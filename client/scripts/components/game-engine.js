import bus from '../bus.js';
import Player from '../components/player.js';
import Enemy from '../components/enemy.js';

const GameEngine = () => {
  const state = {
    player: new Player(0, 0),
    enemies: [],
  };

  state.enemies.push(new Enemy(-100, 0));

  function update(dT) {
    state.player.update(dT);

    for (const e of state.enemies) {
      e.update(dT);
    }
  }

  function onPunch(evt) {
    for (const e of state.enemies) {
      e.hitCheck(evt);
    }
  }

  // Game events
  bus.on('punch', onPunch);

  return {
    state,
    update,
  };
};

export default GameEngine;