import bus from '../bus.js';
import { ctx, canvas } from '../ui/canvas.js';

const TYPE_MAP = {
  0: {
    hp: 2,
    skin: '🍓',
    dr: 25,
    mass: 1,
  },
  1: {
    hp: 3,
    skin: '🥝',
    dr: 20,
    mass: 1,
  },
  2: {
    hp: 4,
    skin: '🍋',
    dr: 35,
    mass: 1.5,
  },
  3: {
    hp: 5,
    skin: '🍌',
    dr: 40,
    mass: 1.5,
  },
  4: {
    hp: 6,
    skin: '🍎',
    dr: 40,
    mass: 2,
  },
  5: {
    hp: 7,
    skin: '🍉',
    dr: 55,
    mass: 3,
  },
  6: {
    hp: 8,
    skin: '🍍',
    dr: 65,
    mass: 4,
  }
};

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
    const data = TYPE_MAP[this.type];
    this.hp = data.hp;
    this.skin = data.skin;
    this.maxHp = this.hp;
    this.height = 40;
    this.barWidth = 30;
    this.dr = data.dr;
    this.mass = data.mass;
  }

  update(dT, gameEngine) {
    if (this.hp > 0) {
      this.hitRecently -= dT;
      this.x += this.vx * dT;
      this.y += this.vy * dT;
      this.angle += this.omega * dT;

      if (!this.isMoving && this.onGround) {
        this.vx -= this.vx * 4.0 * dT;
        this.angle += this.vx * 0.01 * dT;
        this.omega -= this.omega * 6.0 * dT;
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

      if (this.x < -canvas.width/2 + 20) {
        this.x = -canvas.width/2 + 20;
        this.vx = -this.vx;
      }
      if (this.x > canvas.width/2 - 20) {
        this.x = canvas.width/2 - 20;
        this.vx = -this.vx;
      }

      this.checkCollisions(gameEngine);
    } else {
      this.deathTimer += dT;
    }
  }

  render(dT) {
    ctx.save();
    ctx.translate(this.x, this.y - this.dr / 2);
    if (!this.faceRight) {
      ctx.scale(-1, 1);
    }
    const baseXfm = ctx.getTransform();

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#3af';

    // Shape
    ctx.setTransform(baseXfm);
    ctx.font = `${40 * this.dr / 25}px arial`;

    if (this.hp > 0) {
      ctx.rotate(this.angle);
      let sat = 1;
      let bright = 1;
      if (this.hitRecently > 0) {
        sat = 1 - this.hitRecently * 1.5;
        bright = 1 + Math.pow(this.hitRecently, 2) * 15;
      }
      ctx.filter = `saturate(${sat}) brightness(${bright})`;
      ctx.fillText(this.skin, 0, 0);
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
    if (this.hp <= 0) {
      return;
    }
    const dx = (this.x - punchEvt.x) * 0.5;
    const dy = this.y - punchEvt.y;
    if (dx * dx + dy * dy < this.dr * this.dr) {
      this.hit(1);
      this.vy -= (1000 + Math.random() * 700) / this.mass;
      this.onGround = false;
      this.vx += punchEvt.dx * 10 / this.mass;
      this.omega = ((Math.random() - 0.5) * 40) / this.mass;
    }
  }

  hit(hp) {
    if (this.hp <= 0) {
      return;
    }
    this.hp -= hp;
    this.hitRecently = 0.5;
    if (this.hp <= 0) {
      this.hp = 0;
      bus.emit('killed', this);
    }
  }

  checkCollisions(gameEngine) {
    for (const e of gameEngine.state.enemies) {
      if (e == this) { continue; }
      const dx = this.x - e.x;
      const dy = this.y - e.y;
      const dr = this.dr + e.dr - 5;
      const dM2 = dx * dx + dy * dy;
      if (dM2 < dr * dr) {
        const n = Math.sqrt(dM2);
        this.x = this.x + dx / n;
        this.y = this.y + dy / n;
        this.vx = e.vx * 0.9;
        this.vy = e.vy * 0.9;
      }
    }
  }
}

export default Enemy;