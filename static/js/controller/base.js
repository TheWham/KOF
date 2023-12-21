export class Controller {
    constructor($canvas) {
        this.$canvas = $canvas;
        this.pressKey = new Set();
        this.start();
    }
    start() {
        let outer = this;
        this.$canvas.keydown((e) => {
            console.log(e.key);
            outer.pressKey.add(e.key);
        });
        this.$canvas.keyup((e) => {
            outer.pressKey.delete(e.key);
        });
    }
}