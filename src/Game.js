let canvas = document.getElementById("canvas");
let gl = canvas.getContext("webgl");

let viewportSize = {x: 600, y: 600};

init();
run();

function init() {
    canvas.width = viewportSize.x;
    canvas.height = viewportSize.y;

    gl.clearColor(0.1, 0.1, 0.2, 1.0);
}

function run() {
    gl.clear(gl.COLOR_BUFFER_BIT, gl.DEPTH_BUFFER_BIT);

    window.requestAnimationFrame(run);
}