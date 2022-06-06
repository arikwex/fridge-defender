import { ctx } from '../ui/canvas.js';
import bus from '../bus.js';

const STATE = {
  IDLE: 0,
  WALK: 1,
  PUNCH_1: 2,
  PUNCH_2: 3,
  UPPERCUT: 4,
  DASH: 5,
  DOWNSMASH: 6,
  JUMP: 7,
};

class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.faceRight = true;
    this.isMoving = false;
    this.punchCount = 0;
    this.timeTillNextPunch = 0;
    this.timeTillPunchReset = 0;
    this.onGround = false;
    this.charge = 0;

    // Animation (x, y, angle, flip vertical)
    this.state = STATE.JUMP;
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
    this.x += this.vx * dT;
    this.y += this.vy * dT;
    this.timeTillNextPunch -= dT;
    this.timeTillPunchReset -= dT;

    if (!this.isMoving) {
      this.vx -= this.vx * 8.0 * dT;
    }

    // Physics
    if (this.y < 0 && !this.onGround) {
      this.vy += 3820.0 * dT;
      this.onGround = false;
    } else {
      this.y = 0;
      this.vy = 0;
      this.onGround = true;
    }
  }

  render(dT) {
    this.anim += dT;

    this.animate(dT);

    ctx.save();
    ctx.translate(this.x, this.y - 10);
    if (!this.faceRight) {
      ctx.scale(-1, 1);
    }
    const baseXfm = ctx.getTransform();

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#3af';

    // Left fist
    ctx.setTransform(baseXfm);
    ctx.translate(this.lfx, this.lfy);
    ctx.rotate(this.lfa);
    ctx.scale(1, Math.sign(this.lff));
    ctx.font = '30px arial';
    ctx.fillText('🤜', 0, 0);

    // Torso
    ctx.setTransform(baseXfm);
    ctx.translate(this.tx, this.ty);
    ctx.rotate(this.ta);
    ctx.font = '40px arial';
    ctx.fillText('🤖', 0, 0);

    // Right fist
    ctx.setTransform(baseXfm);
    ctx.translate(this.rfx, this.rfy);
    ctx.rotate(this.rfa);
    ctx.scale(1, Math.sign(this.rff));
    ctx.font = '30px arial';
    ctx.fillText('🤜', 0, 0);

    ctx.restore();
  }

  animate(dT) {
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
      tlfa = -0.7;
      tlff = -1;
      trfx = 20;
      trfy = Math.pow(Math.sin((this.anim - 0.05) * 17) * 0.5 + 0.5, 1.5) * 7 + 0;
      trfa = -0.7;
      trff = -1;
    }
    else if (this.state == STATE.WALK) {
      ttx = 0;
      tty = -Math.abs(Math.sin((this.anim + 0.5) * 8.5)) * 4;
      tta = 0;
      tlfx = 20 + Math.sin(this.anim * 17) * 11;
      tlfy = -1 + Math.abs(Math.cos(this.anim * 17)) * 5;
      tlfa = -Math.sin(this.anim * 17) * 0.2 - 0.2;
      tlff = -1;
      trfx = 0 + Math.sin((this.anim + 3.14) * 17) * 11;
      trfy = 5 + Math.abs(Math.cos((this.anim + 3.14) * 17)) * 5;
      trfa = -Math.sin((this.anim + 3.14) * 17) * 0.2 - 0.2;
      trff = -1;
    }
    else if (this.state == STATE.PUNCH_1) {
      const a = this.anim;
      const q = Math.exp(-a * 10);
      ttx = -q * 4;
      tty = 0;
      tta = (1 - q) * 0.3;
      tlfx = 20 + q * 30;
      tlfy = -8;
      tlfa = -0.7 - (1 - q) * 0.5;
      tlff = -1;
      trfx = -30 + (1 - q) * 100;
      trfy = 2;
      trfa = 0;
      trff = -q + 0.5;
    }
    else if (this.state == STATE.PUNCH_2) {
      const a = this.anim;
      const q = Math.exp(-a * 10);
      ttx = -q * 4;
      tty = 0;
      tta = (1 - q) * 0.3;
      tlfx = -30 + (1 - q) * 100;
      tlfy = -5;
      tlfa = 0;
      tlff = -q + 0.5;
      trfx = 10 + q * 30;
      trfy = -8;
      trfa = -0.7 - (1 - q) * 0.5;
      trff = -1;
    }
    else if (this.state == STATE.JUMP) {
      ttx = 0;
      tty = 0;
      tta = 0;
      tlfx = 20;
      tlfy = 20 - this.vy * 0.03;
      tlfa = 1.4;
      tlff = 1;
      trfx = 0;
      trfy = 30 - this.vy * 0.03;
      trfa = 1.4;
      trff = 1;
    }

    const k = 20;
    this.tx += (ttx - this.tx) * k * dT;
    this.ty += (tty - this.ty) * k * dT;
    this.ta += (tta - this.ta) * k * dT;
    this.lfx += (tlfx - this.lfx) * k * dT;
    this.lfy += (tlfy - this.lfy) * k * dT;
    this.lfa += (tlfa - this.lfa) * k * dT;
    this.lff += (tlff - this.lff) * k * dT;
    this.rfx += (trfx - this.rfx) * k * dT;
    this.rfy += (trfy - this.rfy) * k * dT;
    this.rfa += (trfa - this.rfa) * k * dT;
    this.rff += (trff - this.rff) * k * dT;
  }

  resetControl() {
    if (this.timeTillPunchReset > 0) {
      // Do nothing
    } else if (!this.onGround) {
      this.state = STATE.JUMP;
    } else if (this.state == STATE.WALK) {
      this.state = STATE.IDLE;
    } else {
      this.state = STATE.IDLE;
    }
    this.isMoving = false;
  }

  move(dir) {
    let speed = 330;
    if (this.timeTillPunchReset > 0 && this.onGround) {
      speed = 330 - this.timeTillPunchReset * 900;
    }
    if (dir > 0) {
      this.faceRight = true;
      this.vx = speed;
    } else {
      this.faceRight = false;
      this.vx = -speed;
    }
    if (this.timeTillPunchReset <= 0 && this.onGround) {
      this.state = STATE.WALK;
    }
    this.isMoving = true;
  }

  jump() {
    if (!this.onGround) {
      return;
    }
    this.vy = -1000;
    this.onGround = false;
  }

  punch() {
    if (this.timeTillNextPunch > 0) {
      return;
    }
    this.punchCount += 1;
    if (this.punchCount % 2 == 0) {
      this.state = STATE.PUNCH_1;
    }
    else {
      this.state = STATE.PUNCH_2;
    }
    if (!this.onGround) {
      if (this.faceRight) { this.vx += 400; }
      else { this.vx -= 400; }
    }
    let tx = this.x;
    let ty = this.y;
    let dx = 0;
    let dy = 0;
    if (this.faceRight) { tx += 60; dx = 60; }
    else { tx -= 60; dx = -60; }
    bus.emit('punch', { x: tx, y: ty, dx: dx, dy: dy });
    this.timeTillNextPunch = 0.0;
    this.timeTillPunchReset = 0.3;
  }

  chargeUp(c) {
    this.charge += c;
    if (this.charge >= 100) {
      this.charge = 100;
    }
  }
}

export default Player;