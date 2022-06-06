import { ctx } from '../ui/canvas.js';

const STATE = {
  IDLE: 0,
  WALK: 1,
  PUNCH_1: 2,
  PUNCH_2: 3,
  UPPERCUT: 4,
  DASH: 5,
  DOWNSMASH: 6,
};

class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;

    // Animation (x, y, angle, flip vertical)
    this.state = STATE.IDLE;
    this.anim = 0;
    this.tx = 0;
    this.ty = 0;
    this.ta = 0;
    this.lfx = 40;
    this.lfy = 0;
    this.lfa = -0.7;
    this.lff = -1;
    this.rfx = 20;
    this.rfy = 8;
    this.rfa = -0.7;
    this.rff = -1;
  }

  update(dT) {
  }

  render(dT) {
    this.anim += dT;

    this.animate();

    ctx.save();
    ctx.translate(this.x, this.y);
    const baseXfm = ctx.getTransform();

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#3af';

    // Torso
    ctx.setTransform(baseXfm);
    ctx.translate(this.tx, this.ty);
    ctx.rotate(this.ta);
    ctx.font = '40px arial';
    ctx.fillText('🤖', 0, 0);

    // Left fist
    ctx.setTransform(baseXfm);
    ctx.translate(this.lfx, this.lfy);
    ctx.rotate(this.lfa);
    ctx.scale(1, Math.sign(this.lff));
    ctx.font = '30px arial';
    ctx.fillText('🤜', 0, 0);

    // Left fist
    ctx.setTransform(baseXfm);
    ctx.translate(this.rfx, this.rfy);
    ctx.rotate(this.rfa);
    ctx.scale(1, Math.sign(this.rff));
    ctx.font = '30px arial';
    ctx.fillText('🤜', 0, 0);

    ctx.restore();
  }

  animate() {
    // Animation tween targets
    let ttx = this.tx;
    let tty = this.ty;
    let tta = this.ta;
    let tlfx = this.lfx;
    let tlfy = this.lfy;
    let tlfa = this.lfa;
    let tlff = this.lff;
    let trfx = this.rfx;
    let trfy = this.rfy;
    let trfa = this.rfa;
    let trff = this.rff;

    if (this.state == STATE.IDLE) {
      ttx = 0;
      tty = -Math.abs(Math.sin((this.anim + 0.5) * 8.5)) * 4;
      tta = 0;
      tlfx = 40;
      tlfy = Math.pow(Math.sin(this.anim * 17) * 0.5 + 0.5, 1.5) * 7 - 8;
      trfx = 20;
      trfy = Math.pow(Math.sin((this.anim - 0.05) * 17) * 0.5 + 0.5, 1.5) * 7 + 0;
    }

    this.tx = ttx;
    this.ty = tty;
    this.ta = tta;
    this.lfx = tlfx;
    this.lfy = tlfy;
    this.lfa = tlfa;
    this.lff = tlff;
    this.rfx = trfx;
    this.rfy = trfy;
    this.rfa = trfa;
    this.rff = trff;
  }
}

export default Player;