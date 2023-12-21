import { GameMap } from "/static/js/game_map/base.js";
import { Kyo } from "/static/js/player/kyo.js";
class KOF {
    constructor(id) {
        this.$kof = $('#' + id);
        this.game_map = new GameMap(this);
        this.players = [
            new Kyo(this, {
                x: 200,
                y: 0,
                id: 0,
                width: 120,
                height: 200,
            }),
            new Kyo(this, {
                x: 900,
                y: 0,
                id: 1,
                width: 120,
                height: 200,
            }),
        ];
    }

}
export {
    KOF
}