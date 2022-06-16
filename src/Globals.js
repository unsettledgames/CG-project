let canvas = document.getElementById("canvas");
let gl = canvas.getContext("webgl");
let viewportSize = {x: 700, y: 500};

let posIndex = 0;
let texCoordsIndex = 1;
let normalIndex = 2;
let tangentIndex = 3;

let shadowMapMultiplier = 2;
let shadowMapSize = [viewportSize.x * shadowMapMultiplier, viewportSize.y * shadowMapMultiplier];

let envLightDir = [40, 40, 0];
let ambientLight = [0.4, 0.4, 0.4];
let specularStrength = 0.5;

//ambientLight = [0.0, 0.0, 0.0];

gl.getExtension('OES_standard_derivatives');
gl.getExtension("EXT_frag_depth");
gl.getExtension('WEBGL_depth_texture');
gl.enable(gl.DEPTH_TEST);