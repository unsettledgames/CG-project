class Camera {
    constructor(aspectRatio, near, far, fov) {
        this.translation = [0,4,0];
        this.rotation = [0,0,0];
        this.scale = [1,1,1];

        this.transform = glMatrix.mat4.create();
        this.offset = glMatrix.vec3.create();

        this.near = near;
        this.far = far;
        this.FOV = fov;
        this.aspectRatio = aspectRatio;
        this.cameraSpeed = 1;

        this.view = glMatrix.mat4.create();
        this.projection = glMatrix.mat4.perspective(glMatrix.mat4.create(), fov, aspectRatio, near, far);

        this.view = glMatrix.mat4.fromTranslation(glMatrix.mat4.create(), [0,8,2]);
    }

    setTranslation(translation) {
        this.translation = translation;
        this.updateView();
    }
    setRotation(rotation) {
        this.rotation = rotation;
        this.updateView();
    }
    setScale(scale) {
        this.scale = scale;
        this.updateView();
    }

    move(direction) {
        glMatrix.vec3.normalize(direction, direction);
        glMatrix.vec3.scale(direction, direction, this.cameraSpeed);
        glMatrix.vec3.add(this.translation, this.translation, direction);
        this.updateView();
    }
    
    updateView() {
        this.view = glMatrix.mat4.create();
        glMatrix.mat4.mul(this.view, glMatrix.mat4.fromScaling(glMatrix.mat4.create(), this.scale), this.view);
        glMatrix.mat4.mul(this.view, glMatrix.mat4.fromTranslation(glMatrix.mat4.create(), this.translation), this.view);
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