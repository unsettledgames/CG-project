let canvas = document.getElementById("canvas");
let gl = canvas.getContext("webgl");

let viewportSize = {x: 600, y: 600};
let models = [];
let shaders = {
    uniform: new Shader(gl, "assets/shaders/uniform.glsl"),
    reflections: new Shader(gl, "assets/shaders/reflections.glsl")
};

init();
run();

function init() {
    canvas.width = viewportSize.x;
    canvas.height = viewportSize.y;

    gl.clearColor(0.1, 0.1, 0.2, 1.0);
}

function run() {
    gl.clear(gl.COLOR_BUFFER_BIT, gl.DEPTH_BUFFER_BIT);


    renderObjects();

    window.requestAnimationFrame(run);
}

function renderObjects() {
    for (object in models) {

    }
}