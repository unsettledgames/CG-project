let headlightTexture = new Texture("assets/textures/headlight.png", 6, 1);
let headlightMatrixLeft;
let headlightMatrixRight;

let rightHeadlightDir = [1, 0.5, -3, 1];
let leftHeadlightDir= [-1, 0.5, -3, 1];
let leftHeadlightOrigin = [-0.95, 1, -1, 1];
let rightHeadlightOrigin = [0.95, 1, -1, 1];

let leftHeadlightMatrix, rightHeadlightMatrix;
let headlightsProjection =  glMatrix.mat4.perspective(glMatrix.mat4.create(), 0.45, 1, 0.0, 0.0);