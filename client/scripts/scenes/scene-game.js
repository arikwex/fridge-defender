import bus from '../bus.js';
import ui from '../ui/ui-game.js';
import GameEngine from '../components/game-engine.js';
import { transition, SCENES } from '../scenes/scene-manager.js';
import controllerManager from '../managers/controller-manager.js';

let requestAnimate = null;
let gameEngine = null;

function initialize() {
  gameEngine = GameEngine();
  bus.on('control:left', onControlLeft);
  bus.on('control:right', onControlRight);
  bus.on('control:up', onControlUp);
  bus.on('control:punch', onControlPunch);
  animate();
}

function cleanup() {
  window.cancelAnimationFrame(requestAnimate);
  bus.off('control:left', onControlLeft);
  bus.off('control:right', onControlRight);
  bus.off('control:up', onControlUp);
  bus.off('control:punch', onControlPunch);
  gameEngine = null;
}

let lastRender = Date.now();
function animate() {
  let dT = (Date.now() - lastRender) / 1000;
  if (dT > 0.3) { dT = 0.3; }
  lastRender = Date.now();

  gameEngine.state.player.resetControl();
  controllerManager.tick();
  gameEngine.update(dT);
  ui.render(dT, gameEngine);
  requestAnimate = window.requestAnimationFrame(animate);
}

function onControlLeft() {
  gameEngine.state.player.move(-1);
}

function onControlRight() {
  gameEngine.state.player.move(1);
}

function onControlUp() {
  gameEngine.state.player.jump();
}

function onControlPunch() {
  gameEngine.state.player.punch();
}

export default {
  initialize,
  cleanup,
};
