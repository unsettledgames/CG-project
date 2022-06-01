class Camera {
    constructor(aspectRatio, near, far, fov) {
        this.transform = glMatrix.mat4.create();
        this.offset = glMatrix.vec3.create();

        this.near = near;
        this.far = far;
        this.FOV = fov;

        this.view = glMatrix.mat4.create();
        this.projection = glMatrix.mat4.perspective(glMatrix.mat4.create(), fov, ratio, near, aspectRatio);
    }

    getView() {
        return this.view;
    }
    
    getProjection() {
        return this.projection;
    }

    getViewProjection() {
        return this.projection * glMatrix.mat4.invert(this.view);
    }
}