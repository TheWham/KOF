import { Player } from "./base.js";
import { GIF } from "../utils/gif.js";

class Kyo extends Player {
    constructor(root, info) {
        super(root, info);

        this.init_animation();
    }
    init_animation() {
        for (let i = 0; i < 7; i++) {
            let gif = new GIF();
            gif.load(`/static/images/player/kyo/${i}.gif`);
            this.animations.set(i, {
                gif: gif,
                frame_cnt: 0,
                frame_rate: 5,
                offset_y: [0, -22, 0, -100],
                loaded: false,
            });
            gif.onload = () => {
                let obj = this.animations.get(i);
                obj.frame_cnt = gif.frames.length;
                obj.loaded = true;
            };
        }

    }
}

export {
    Kyo
}