class Camera {
    constructor(aspectRatio, near, far, fov, car) {
        this.mode = "chase";
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

        // Trackball
        this.dragging = false;
        this.lastMousePos = [viewportSize.x / 2, viewportSize.y / 2];
        /*
        
        this.start_point      = [0,0,0];
        this.trackball_center= [0,0,-10.0];
        this.trackball_matrix = glMatrix.mat4.create();
        this.trackball_rotation = glMatrix.mat4.create();
        this.trackball_scaling = glMatrix.mat4.create();
        this.invTrackball_matrix = glMatrix.mat4.create();
        this.scaling_factor = 1.0;
        this.l  = -0.1;
        this.r  =  0.1;
        this.b  = -0.1;
        this.t  =  0.1;
        this.n  =  0.1;
        this.f  = 15.0;
        */

        document.addEventListener("mousedown", this.mouseDown.bind(this));
        document.addEventListener("mouseup", this.mouseUp.bind(this));
        document.addEventListener("mousemove", this.mouseMove.bind(this));
    }

    update(dt) {
        if (Events.isKeyDown("P"))
            this.mode = "up";
        else if (Events.isKeyDown("O"))
            this.mode = "chase";
        else if (Events.isKeyDown("I"))
            this.mode = "free";

        switch (this.mode)
        {
            case "chase": {
                    this.offset = [0, 4, 12];

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
                break;
            case "up": {
                    this.offset = [0, 48, 0];
                    let translation = this.car.transform.translation.slice();
                    glMatrix.vec3.add(translation, translation, this.offset);
                    this.transform.setTranslation(translation);
                    this.transform.setRotation([-1.5, this.car.transform.rotation[1], 0]);
                }
                break;
            case "free": {
                let translation = [0,0,0,0];

                if (Events.isKeyDown("W")) {
                    translation[2] -= 1;
                }
                if (Events.isKeyDown("S")) {
                    translation[2] += 1;
                }

                if (Events.isKeyDown("A")) {
                    translation[0] -= 1;
                }
                if (Events.isKeyDown("D")) {
                    translation[0] += 1;
                }

                glMatrix.mat4.mul(translation, this.transform.transform, translation);
                this.transform.move(translation, dt * 0.04);
            }
        }
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

    mouseDown(e) {
        this.dragging = true;
    }

    mouseMove(e) {
        console.log(this.mode);

        if (!this.dragging || this.mode != "free")
            return;
        let pos = [e.clientX, e.clientY];
        let delta = [this.lastMousePos[0] - pos[0], this.lastMousePos[1] - pos[1]];

        this.transform.rotate(Math.sign(delta[0]), 1, 0.01);
        this.transform.rotate(Math.sign(delta[1]), 0, 0.02);

        this.lastMousePos = pos;
    }

    mouseUp(e) {
        this.dragging = false;
    }

}