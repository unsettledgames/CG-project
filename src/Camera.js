class Camera {
    constructor(aspectRatio, near, far, fov, car) {
        this.transform = new Transform();
        this.offset = [0, 4, 12];

        this.near = near;
        this.far = far;
        this.FOV = fov;
        this.aspectRatio = aspectRatio;
        this.speed = 1;

        this.projection = glMatrix.mat4.perspective(glMatrix.mat4.create(), fov, aspectRatio, near, far);
        this.transform.setTranslation([0, 4, 0]);
        this.car = car;
    }

    update() {
        let translation = this.car.transform.translation.slice();
        let rotatedOffset = glMatrix.vec4.create();
        let rotationMatrix = glMatrix.mat4.fromRotation(glMatrix.mat4.create(), this.car.transform.rotation[1], [0,1,0]);

        // Rotate the offset so that the camera is aligned to the car
        glMatrix.mat4.mul(rotatedOffset, rotationMatrix, [this.offset[0], this.offset[1], this.offset[2], 1]);
        // Add the offset
        glMatrix.vec3.add(translation, translation, rotatedOffset);

        this.transform.setRotation(this.car.transform.rotation.slice());
        this.transform.setTranslation(translation);
        
    }

    getView() {
        return glMatrix.mat4.invert(glMatrix.mat4.create(), this.transform.getTransform());
    }
    
    getProjection() {
        return this.projection;
    }

    getViewProjection() {
        let ret = glMatrix.mat4.create();
        let inverted = glMatrix.mat4.invert(glMatrix.mat4.create(), this.transform.getTransform().slice());
        glMatrix.mat4.mul(ret, this.projection, inverted);
        return ret;
    }
}