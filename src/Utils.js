function getGLError() {
    let error = gl.getError();
    if (error == gl.NO_ERROR) {
        return false;
    }

    switch (error) {
        case gl.INVALID_ENUM:
            console.error("Invalid enum");
            break;
        case gl.INVALID_VALUE:
            console.error("Invalid value");
            break;
        case gl.INVALID_OPERATION:
            console.error("Invalid operation");
            break;
        case gl.INVALID_FRAMEBUFFER_OPERATION:
            console.error("Invalid frame buffer operation");
            break;
    }

    console.trace();
}

function createPositionalLightMatrix(pos, target){
    var light_matrix = glMatrix.mat4.create();
    var proj = glMatrix.mat4.create();
    glMatrix.mat4.lookAt(light_matrix, pos, target, [0,1,0]);

    glMatrix.mat4.ortho(proj, -shadowMapSize[0] / 2.0, shadowMapSize[0] / 2.0, -shadowMapSize[1] / 2.0, shadowMapSize[1] / 2.0, -1000, 1000.0);
    glMatrix.mat4.mul(light_matrix, proj, light_matrix);
    return light_matrix;
  }