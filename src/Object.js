class Object {
    constructor() {
        this.localTransform = glMatrix.mat4.create();
        this.globalTransform = glMatrix.mat4.create();
        this.children = [];
    }

    addChild(child) {
        this.children.push(child);
    }
}