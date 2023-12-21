let AC_GAME_OBJECT = [];

class AcGameAbject {
    constructor() {
        AC_GAME_OBJECT.push(this);
        this.timedelta = 0;
        this.has_call_start = false;
    }

    start() {

    }
    update() {

    }

    destroy() {
        for (let k in AC_GAME_OBJECT) {
            if (AC_GAME_OBJECT[k] === this) {
                AC_GAME_OBJECT.splice(k, 1);
                break;
            }
        }
    }
}

let last_timeStamp;

let AC_GAME_OBJECT_FRAME = (timeStamp) => {

    for (let obj of AC_GAME_OBJECT) {
        if (!obj.has_call_start) {
            obj.start();
            obj.has_call_start = true;
        }
        else {
            obj.timedelta = timeStamp - last_timeStamp;
            obj.update();
        }
    }
    last_timeStamp = timeStamp;
    requestAnimationFrame(AC_GAME_OBJECT_FRAME);
};
requestAnimationFrame(AC_GAME_OBJECT_FRAME);

export {
    AcGameAbject
}