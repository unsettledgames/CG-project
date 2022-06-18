class CarController {
    constructor(model, frontWheels, backWheels) {
        this.model = model;
        this.frontWheels = frontWheels;
        this.backWheels = backWheels;

        // Speed
        this.maxSpeed = 0.04;
        this.currSpeed = 0.0;
        this.speedIncrease = 0.001;

        // Rotation speed
        this.maxRotationSpeed = 0.002;
        this.currRotationSpeed = 0.0;
        this.rotationSpeedIncrease = 0.00008;

        // State
        this.goingForwards = true;
        this.rotatingLeft = true;
        this.transform = model.localTransform;
    }

    update(dt) {
        let translation = [0, 0, -1, 0];
        if (Events.isKeyDown("A")) {
            this.rotatingLeft = true;
            this.currRotationSpeed = Math.min(this.currRotationSpeed + this.rotationSpeedIncrease, this.maxRotationSpeed)
        }
        else if (Events.isKeyDown("D")) {
            this.rotatingLeft = false;
            this.currRotationSpeed = Math.max(this.currRotationSpeed - this.rotationSpeedIncrease, -this.maxRotationSpeed)
        }
        else {
            if (this.rotatingLeft)
                this.currRotationSpeed = Math.max(0.0, this.currRotationSpeed - this.rotationSpeedIncrease);
            else 
                this.currRotationSpeed = Math.min(0.0, this.currRotationSpeed + this.rotationSpeedIncrease);
        }

        if (Events.isKeyDown("W")) {
            this.goingForwards = true;
            this.currSpeed = Math.min(this.currSpeed + this.speedIncrease, this.maxSpeed);
        }
        else if (Events.isKeyDown("S")) {
            this.goingForwards = false;
            this.currSpeed = Math.max(this.currSpeed - this.speedIncrease, -this.maxSpeed);
        }
        else {
            if (this.goingForwards)
                this.currSpeed = Math.max(0.0, this.currSpeed - this.speedIncrease);
            else
                this.currSpeed = Math.min(0.0, this.currSpeed + this.speedIncrease);
        }

        // Convert the input vector to object space
        glMatrix.mat4.mul(translation, this.transform.getTransform(), translation);
        // Set the new values
        this.transform.move([translation[0], translation[1], translation[2]], this.currSpeed * dt);
        this.transform.rotate(1, 1, this.currRotationSpeed * dt);

        // Rotate wheels
        let wheels = [];
        wheels.push(...this.frontWheels);
        wheels.push(...this.backWheels);
        for (let i=0; i<wheels.length; i++) {
            wheels[i].localTransform.rotate(1, 0, this.currSpeed * dt / 32);
        }

        // Rotate front wheels if necessary
        for (let i=0; i<this.frontWheels.length; i++) {
            this.backWheels[i].localTransform.rotation[1] = this.currRotationSpeed / 16;
        }
    }
}