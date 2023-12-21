import { AcGameAbject } from '/static/js/ac_game_objects/base.js';
export class Player extends AcGameAbject {
    constructor(root, info) {
        super();

        this.root = root;
        this.id = info.id;
        this.x = info.x;
        this.y = info.y;
        this.width = info.width;
        this.height = info.height;
        this.color = info.color;

        this.direction = 1;

        this.vx = 0;
        this.vy = 0;

        this.speedx = 400;  // 水平速度
        this.speedy = -1000;  // 跳起的初始速度

        this.gravity = 50;
        this.scale = 2;

        this.ctx = this.root.game_map.ctx;
        this.pressed_keys = this.root.game_map.controller.pressKey;

        this.status = 3;  // 0: idle, 1: 向前，2：向后，3：跳跃，4：攻击，5：被打，6：死亡
        this.animations = new Map();
        this.frame_current_cnt = 0;
        this.hps = this.root.$kof.find(`.div-head-hp${this.id} > div > div`);
        this.hps_red = this.root.$kof.find(`.div-head-hp${this.id} > div`);
        this.begin = parseInt(this.hps.width() / 5);
    }

    start() {

    }

    update_move() {
        this.vy += this.gravity;

        this.x += this.vx * this.timedelta / 1000;
        this.y += this.vy * this.timedelta / 1000;

        if (this.y > 450) {
            this.y = 450;
            this.vy = 0;

            if (this.status === 3)
                this.status = 0;
        }

        if (this.x < 0) {
            this.x = 0;
        } else if (this.x + this.width > this.root.game_map.$canvas.width()) {
            this.x = this.root.game_map.$canvas.width() - this.width;
        }
    }

    update_direction() {
        if (this.status === 6) return;
        let player = this.root.players;
        if (player[0] && player[1]) {
            let me, you;
            me = this, you = player[1 - this.id];
            if (me.x < you.x) me.direction = 1;
            else me.direction = -1;
        }
    }

    update_control() {
        let w, a, d, space;
        if (this.id === 0) {
            w = this.pressed_keys.has('w');
            a = this.pressed_keys.has('a');
            d = this.pressed_keys.has('d');
            space = this.pressed_keys.has(' ');
        } else {
            w = this.pressed_keys.has('ArrowUp');
            a = this.pressed_keys.has('ArrowLeft');
            d = this.pressed_keys.has('ArrowRight');
            space = this.pressed_keys.has('Enter');
        }

        if (this.status === 0 || this.status === 1) {
            if (space) {
                this.status = 4;
                this.vx = 0;
                this.frame_current_cnt = 0;
            } else if (w) {
                if (d) {
                    this.vx = this.speedx;
                } else if (a) {
                    this.vx = -this.speedx;
                } else {
                    this.vx = 0;
                }
                this.vy = this.speedy;
                this.status = 3;
                this.frame_current_cnt = 0;
            } else if (d) {
                this.vx = this.speedx;
                this.status = 1;
            } else if (a) {
                this.vx = -this.speedx;
                this.status = 1;
            } else {
                this.vx = 0;
                this.status = 0;
            }
        }
    }

    update() {
        this.update_control();
        this.update_move();
        this.update_direction();
        this.is_attact();
        this.render();
    }

    is_check(r1, r2) {
        if (Math.max(r1.x1, r2.x1) > Math.min(r1.x2, r2.x2))
            return false;
        if (Math.max(r1.y1, r2.y1) > Math.min(r1.y2, r2.y2))
            return false;
        return true;
    }

    is_attact() {
        if (this.status === 4 && this.frame_current_cnt === 16) {
            let me = this; let you = this.root.players[1 - this.id];
            if (you.status === 6) return;
            let r1, r2;
            if (this.direction > 0) {
                r1 = {
                    x1: me.x + 120,
                    x2: me.x + 120 + 100,
                    y1: me.y + 45,
                    y2: me.y + 45 + 20,
                }
            } else {
                r1 = {
                    x1: me.x - 120 + 20,
                    x2: me.x - 120 + 20 + 100,
                    y1: me.y + 45,
                    y2: me.y + 45 + 20,
                }
            }
            r2 = {
                x1: you.x,
                x2: you.x + this.width,
                y1: you.y,
                y2: you.y + this.height,
            }

            if (this.is_check(r1, r2)) {
                console.log(you.begin);
                you.status = 5;
                you.frame_current_cnt = 0;
                you.hps.animate({
                    width: (you.hps.width() - you.begin)
                }, 300);
                you.hps_red.animate({
                    width: (you.hps.width() - you.begin)
                }, 800);
                if (you.hps.width() <= you.begin + 1) {
                    you.status = 6;
                    you.frame_current_cnt = 0;
                }
            }
        }
    }

    render() {
        /*----------- Test--------------*/
        // this.ctx.fillStyle = "blue";
        // this.ctx.fillRect(this.x, this.y, this.width, this.height);
        // if (this.direction > 0) {
        //     this.ctx.fillStyle = "red";
        //     this.ctx.fillRect(this.x + 120, this.y + 45, 100, 20);
        // }
        // else {
        //     this.ctx.fillStyle = "red";
        //     this.ctx.fillRect(this.x - 120 + 20, this.y + 45, 100, 20);
        // }
        //  console.log(this.time);

        let status = this.status;
        console.log(status);
        if (this.status === 1 && this.direction * this.vx < 0) status = 2;

        let obj = this.animations.get(status);
        if (obj && obj.loaded) {
            if (this.direction > 0) {
                let k = parseInt(this.frame_current_cnt / obj.frame_rate) % obj.frame_cnt;
                let image = obj.gif.frames[k].image;
                let temp = this.y;
                if (this.status === 1 || this.status == 3)
                    temp = this.y + obj.offset_y[this.status];
                this.ctx.drawImage(image, this.x, temp, image.width * this.scale, image.height * this.scale);
            }
            else {
                this.ctx.save();
                this.ctx.scale(-1, 1);
                this.ctx.translate(-this.root.game_map.$canvas.width(), 0);
                let k = parseInt(this.frame_current_cnt / obj.frame_rate) % obj.frame_cnt;
                let image = obj.gif.frames[k].image;
                let temp = this.y;
                if (this.status === 1 || this.status == 3)
                    temp = this.y + obj.offset_y[this.status];

                this.ctx.drawImage(image, this.root.game_map.$canvas.width() - this.x - this.width, temp, image.width * this.scale, image.height * this.scale);
                this.ctx.restore();
            }
        }
        if (status === 4 || status === 5 || status === 6) {
            if (this.frame_current_cnt == obj.frame_rate * (obj.frame_cnt - 1)) {
                if (status === 6) {
                    this.frame_current_cnt--;
                } else {
                    this.status = 0;
                }

            }

        }
        this.frame_current_cnt++;
    }
}