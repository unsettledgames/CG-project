class Transform {
    constructor() {
        this.translation = [0, 0, 0];
        this.rotation = [0, 0, 0];
        this.scale = [1, 1, 1];
        this.transform = glMatrix.mat4.create();
        this.update();
    }

    update() {
        this.transform = glMatrix.mat4.create();
        glMatrix.mat4.mul(this.transform, glMatrix.mat4.fromScaling(glMatrix.mat4.create(), this.scale), this.transform);

        glMatrix.mat4.mul(this.transform, glMatrix.mat4.fromRotation(glMatrix.mat4.create(), this.rotation[0], [1, 0, 0]), this.transform);
        glMatrix.mat4.mul(this.transform, glMatrix.mat4.fromRotation(glMatrix.mat4.create(), this.rotation[1], [0, 1, 0]), this.transform);
        glMatrix.mat4.mul(this.transform, glMatrix.mat4.fromRotation(glMatrix.mat4.create(), this.rotation[2], [0, 0, 1]), this.transform);

        glMatrix.mat4.mul(this.transform, glMatrix.mat4.fromTranslation(glMatrix.mat4.create(), this.translation), this.transform);
    }

    move(direction, speed) {
        glMatrix.vec3.normalize(direction, direction);
        glMatrix.vec3.scale(direction, direction, speed);
        glMatrix.vec3.add(this.translation, this.translation, direction);
        this.update();
    }

    rotate(amount, axis, speed) {
        this.rotation[axis] += amount * speed;
        this.update();
    }
    
    setTranslation(translation) {
        this.translation = translation;
        this.update();
    }
    setRotation(rotation) {
        this.rotation = rotation;
        this.update();
    }
    setScale(scale) {
        this.scale = scale;
        this.update();
    }

    setTransform(matrix) {
        for (let i=0; i<matrix.length; i++)
            if (matrix[i] == -0)
                matrix[i] = 0;
        this.transform = matrix;
    }

    getTransform() {
        return this.transform.slice();
    }
    getTranslation() {
        return this.translation;
    }
}