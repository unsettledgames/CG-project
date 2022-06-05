let canvas = document.getElementById("canvas");
let gl = canvas.getContext("webgl");
let viewportSize = {x: 600, y: 600};

let posIndex = 0;
let texCoordsIndex = 1;
let normalIndex = 2;
let tangentIndex = 3;

let envLightDir = [-1, -1, 0.5];
let ambientLight = [0.5, 0.5, 0.5];