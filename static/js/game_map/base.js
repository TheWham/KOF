import { AcGameAbject } from "../ac_game_objects/base.js";
import { Controller } from "../controller/base.js";
export class GameMap extends AcGameAbject {
    constructor(root) {
        super();
        this.root = root;
        this.$canvas = $('<canvas width="1280" height="720" tabindex = 0 ></canvas>')
        this.ctx = this.$canvas[0].getContext('2d');
        this.root.$kof.append(this.$canvas);
        this.root.$kof.append($(`
        <div class="div-head">
        <div class="div-head-hp0">
            <div><div></div></div>
        </div>
        <div class="div-head-time">60</div>
        <div class="div-head-hp1">
            <div><div></div></div>
        </div>
    </div>
        `));
        this.$canvas.focus();
        this.controller = new Controller(this.$canvas);
    }
    start() {

    }
    update() {
        this.render();

    }
    render() {
        // this.ctx.fillStyle = "red";
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }
}