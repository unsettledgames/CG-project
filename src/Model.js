class Object {

    constructor(properties) {
        this.localTransform = glMatrix.mat4.create();
        this.globalTransform = glMatrix.mat4.create();
        this.parent = undefined;

        this.shader = properties.shader;
        this.texture = properties.texture;
        this.mesh = properties.mesh;
    }

    addChild(child) {
        child.parent = this;
    }
}