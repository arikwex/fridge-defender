import { ctx } from '../ui/canvas.js';

class Enemy {
  constructor(x, y, t) {
    this.x = x;
    this.y = y;
    this.angle = 0;
    this.omega = 0;
    this.vx = 0;
    this.vy = 0;
    this.faceRight = true;
    this.hitRecently = 0;
    this.onGround = false;
    this.isMoving = false;
    this.deathTimer = 0;

    // Enemy type traits
    this.type = t;
    this.hp = 3;
    this.maxHp = this.hp;
    this.height = 40;
    this.barWidth = 30;
    this.dr = 25;
    this.mass = 3;
  }

  update(dT) {
    if (this.hp > 0) {
      this.hitRecently -= dT;
      this.x += this.vx * dT;
      this.y += this.vy * dT;
      this.angle += this.omega * dT;

      if (!this.isMoving && this.onGround) {
        this.vx -= this.vx * 4.0 * dT;
        this.omega -= this.omega * 4.0 * dT;
      }

      // Physics
      if (this.y < 0 && !this.onGround) {
        this.vy += 3020.0 * dT;
        this.onGround = false;
      } else {
        this.y = 0;
        this.vy = 0;
        this.onGround = true;
      }
    } else {
      this.deathTimer += dT;
    }
  }

  render(dT) {
    ctx.save();
    ctx.translate(this.x, this.y - 10);
    if (!this.faceRight) {
      ctx.scale(-1, 1);
    }
    const baseXfm = ctx.getTransform();

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#3af';

    // Shape
    ctx.setTransform(baseXfm);
    ctx.font = '40px arial';

    if (this.hp > 0) {
      ctx.rotate(this.angle);
      let sat = 1;
      let bright = 1;
      if (this.hitRecently > 0) {
        sat = 1 - this.hitRecently * 1.5;
        bright = 1 + Math.pow(this.hitRecently, 2) * 15;
      }
      ctx.filter = `saturate(${sat}) brightness(${bright})`;
      ctx.fillText('🍓', 0, 0);
      ctx.filter = 'brightness(1)';

      // HP bar
      ctx.rotate(-this.angle);
      ctx.fillStyle = '#222';
      ctx.fillRect(-this.barWidth/2, -this.height, this.barWidth, 6);
      ctx.fillStyle = '#f45';
      ctx.fillRect(-this.barWidth/2, -this.height, this.barWidth * this.hp / this.maxHp, 6);
    } else {
      ctx.fillStyle = `rgba(0, 0, 0, ${Math.exp(-this.deathTimer * 5)})`;
      ctx.font = `${(1 - Math.exp(-this.deathTimer * 5)) * 50 + 40}px arial`;
      ctx.fillText('💀', 0, 0);
    }

    ctx.restore();
  }

  hitCheck(punchEvt) {
    const dx = (this.x - punchEvt.x) * 0.5;
    const dy = this.y - punchEvt.y;
    if (dx * dx + dy * dy < this.dr * this.dr) {
      this.hit(1);
      this.vy -= (600 + Math.random() * 300) / this.mass;
      this.onGround = false;
      this.vx += punchEvt.dx * 10 / this.mass;
      this.omega = ((Math.random() - 0.5) * 40  + punchEvt.dx / 5) / this.mass;
    }
  }

  hit(hp) {
    this.hp -= hp;
    this.hitRecently = 0.5;
    if (this.hp <= 0) {
      this.hp = 0;
    }
  }
}

export default Enemy;