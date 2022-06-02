class Model {

    constructor(props) {
        this.localTransform = glMatrix.mat4.create();
        this.globalTransform = glMatrix.mat4.create();
        this.parent = undefined;

        this.shader = props.shader;
        this.texture = props.texture;
        this.mesh = props.mesh;
    }

    addChild(child) {
        child.parent = this;
    }

    render(viewProj) {
        // Bind shader
        // Send uniforms
        // Draw elements
    }
}