class Camera {
    constructor(aspectRatio, near, far, fov) {
        this.transform = glMatrix.mat4.create();
        this.offset = glMatrix.vec3.create();

        this.near = near;
        this.far = far;
        this.FOV = fov;
        this.aspectRatio = aspectRatio;

        this.view = glMatrix.mat4.create();
        this.projection = glMatrix.mat4.perspective(glMatrix.mat4.create(), fov, aspectRatio, near, far);
    }

    getView() {
        return this.view;
    }
    
    getProjection() {
        return this.projection;
    }

    getViewProjection() {
        let ret = glMatrix.mat4.create();
        let inverted = glMatrix.mat4.invert(glMatrix.mat4.create(), this.view.slice());
        glMatrix.mat4.mul(ret, this.projection, inverted);
        return ret;
    }
}