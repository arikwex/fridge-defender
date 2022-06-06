import bus from '../bus.js';
import ui from '../ui/ui-game.js';
import GameEngine from '../components/game-engine.js';
import { transition, SCENES } from '../scenes/scene-manager.js';

let requestAnimate = null;
let gameEngine = null;

function initialize() {
  gameEngine = GameEngine();
  animate(); 
}

function cleanup() {
  bus.off('control:up', onControlUp);
  bus.off('control:down', onControlDown);
  bus.off('control:left', onControlLeft);
  bus.off('control:right', onControlRight);
  bus.off('control:reset', onControlReset);
  bus.off('control:undo', onControlUndo);
  bus.off('level-complete', onLevelComplete);
  window.cancelAnimationFrame(requestAnimate);
  gameEngine = null;
}

function animate() {
  ui.render(gameEngine);
  requestAnimate = window.requestAnimationFrame(animate);
}

function onControlUp() {
  if (gameEngine.state.levelPassed) { return; }
  const charPos = gameEngine.getCurrentCharacterInfo(); charPos[1] -= 1;
  if (gameEngine.isValidMove(charPos, charPos[0], charPos[1])) { gameEngine.move(charPos); }
}

function onControlDown() {
  if (gameEngine.state.levelPassed) { return; }
  const charPos = gameEngine.getCurrentCharacterInfo(); charPos[1] += 1;
  if (gameEngine.isValidMove(charPos, charPos[0], charPos[1])) { gameEngine.move(charPos); }
}

function onControlLeft() {
  if (gameEngine.state.levelPassed) { return; }
  const charPos = gameEngine.getCurrentCharacterInfo(); charPos[0] -= 1;
  if (gameEngine.isValidMove(charPos, charPos[0], charPos[1])) { gameEngine.move(charPos); }
}

function onControlRight() {
  if (gameEngine.state.levelPassed) { return; }
  const charPos = gameEngine.getCurrentCharacterInfo(); charPos[0] += 1;
  if (gameEngine.isValidMove(charPos, charPos[0], charPos[1])) { gameEngine.move(charPos); }
}

function onControlReset() {
  if (gameEngine.state.levelPassed) { return; }
  gameEngine.loadLevel(levelManager.getLevel());
}

function onControlUndo() {
  if (gameEngine.state.levelPassed) { return; }
  gameEngine.undo();
}

function onLevelComplete() {
  setTimeout(() => {
    levelManager.nextLevel();
    if (levelManager.hasLevelData()) {
      transition(SCENES.GAME);
    } else {
      transition(SCENES.MAIN_MENU);
    }
  }, 2000);
}

export default {
  initialize,
  cleanup,
};
