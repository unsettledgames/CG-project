class DayNightCycle {
    constructor(speed) {
        this.speed = speed;
        this.ambientLightKeyframes = [0.4, 0.4, 0.4, 0.4, 0.4];
        this.lightDirectionKeyframes = [[1,0,0], [1, 1,0], [1,1,0], [1, 0.7, 0], [1,0,0]];
        this.lightColorKeyframes = [[0.1,0.1,0.2], [0.7,0.4,0.2],[1.0,1.0,1.0],[0.6,0.4,0.1], [0.1,0.1,0.2]];
        
        this.currSource = 2;
        this.currDestination = 3;
        this.currLerpFactor = 0.0;

        this.currAmbientLight = 0.2;
        this.currLightDirection = [0,0,0];
        this.currLightColor = [0.4,0.4,0.1];
    }

    update(dt) {
        if (Events.isKeyDown("L"))
            this.stopped = true;
        else if (Events.isKeyDown("K"))
            this.stopped = false;
            
        if (this.stopped)
            return;
        // Lerp
        this.currAmbientLight = this.lerpFloat(
            this.ambientLightKeyframes[this.currSource], this.ambientLightKeyframes[this.currDestination], 
            this.currLerpFactor);

        this.currLightDirection = this.lerpVector(
            this.lightDirectionKeyframes[this.currSource], this.lightDirectionKeyframes[this.currDestination], 
            this.currLerpFactor);

        this.currLightColor = this.lerpVector(
            this.lightColorKeyframes[this.currSource], this.lightColorKeyframes[this.currDestination], 
            this.currLerpFactor);

        // Update factor and change destinations
        this.currLerpFactor += dt * this.speed;
        if (this.currLerpFactor > 0.999999) {
            this.currSource = (this.currSource + 1) % 5;
            this.currDestination = (this.currDestination + 1) % 5;
            this.currLerpFactor = 0.0;
        }
    }

    getLightDirection() {
        return this.currLightDirection;
    }

    getLightColour() {
        return this.currLightColor;
    }

    getAmbientLightIntensity() {
        return [this.currAmbientLight, this.currAmbientLight, this.currAmbientLight];
    }

    lerpFloat(min, max, t) {
        let clampMin = Math.min(min, max);
        let clampMax = Math.max(min, max);

        return this.clampFloat(min + (max - min) * t, clampMin, clampMax);
    }

    lerpVector(min, max, t) {
        let ret = [min[0], min[1], min[2]];
        let diff = [max[0] - min[0],max[1] - min[1],max[2] - min[2]];
        let lerped = [ret[0] + diff[0] * t,ret[1] + diff[1] * t,ret[2] + diff[2] * t];

        return lerped;
    }

    clampFloat(val, min, max) {
        return Math.max(min, Math.min(max, val));
    }

    clampVector(val, min, max) {
        return [
            this.clampFloat(val[0], min[0], max[0]),
            this.clampFloat(val[1], min[1], max[1]),
            this.clampFloat(val[2], min[2], max[2]),
        ]
    }
}