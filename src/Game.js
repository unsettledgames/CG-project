let canvas = document.getElementById("canvas");
let gl = canvas.getContext("webgl");

let viewportSize = {x: 600, y: 600};
let models = [];
let shaders = {
    uniform: new Shader(gl, "uniform"),
    reflections: new Shader(gl, "reflections")
};

init();
run();

function init() {
    canvas.width = viewportSize.x;
    canvas.height = viewportSize.y;

    gl.clearColor(0.1, 0.1, 0.2, 1.0);
    gl.viewport(0, 0, viewportSize.x, viewportSize.y);
    gl.enable(gl.DEPTH_TEST);
}

function run() {
    gl.clear(gl.COLOR_BUFFER_BIT, gl.DEPTH_BUFFER_BIT);


    renderModels();

    window.requestAnimationFrame(run);
}

function renderObjects() {
    for (model in models) {

    }
}