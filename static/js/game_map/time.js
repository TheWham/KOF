
const time = (kof, callback) => {
    let number = $('.div-head-time');
    let load = number.text();
    let timer = setInterval(() => {
        if (load <= 0) {
            clearInterval(timer);
            callback(true);
        }
        number.text(load);
        load--;
    }, 1000);
}
export {
    time,
}