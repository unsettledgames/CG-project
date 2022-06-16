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

function createDirectionalLightMatrix(dir) {
    var light_matrix = glMatrix.mat4.create();
    var proj = glMatrix.mat4.create();
    glMatrix.mat4.lookAt(light_matrix,[0.0,0.0,0.0],[-dir[0],-dir[1],-dir[2]],[1,0,0]);
    
    glMatrix.mat4.ortho(proj,-16.0,16.0,-16.0,16.0,-8.0,8.0);
    glMatrix.mat4.mul(light_matrix,proj,light_matrix);
    return light_matrix;
}