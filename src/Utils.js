function getGLError(gl) {
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
}