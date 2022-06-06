import bus from '../bus.js';

function ControllerManager() {

  const keymap = {};
  const releasemap = {};

  function initialize() {
    window.onkeydown = (evt) => {
      keymap[evt.key] = true;
      bus.emit('any-key');
    };

    window.onkeyup = (evt) => {
      delete keymap[evt.key];
      delete releasemap[evt.key];
    };
  };

  function tick() {
    if (keymap['ArrowLeft']) { bus.emit('control:left'); }
    if (keymap['ArrowRight']) { bus.emit('control:right'); }

    if (keymap['ArrowUp'] && releasemap['ArrowUp'] === undefined) { bus.emit('control:up'); releasemap['ArrowUp'] = true; }
    if (keymap['z'] && releasemap['z'] === undefined) { bus.emit('control:punch'); releasemap['z'] = true; }
  }

  return {
    initialize,
    tick,
  };
}

export default ControllerManager();