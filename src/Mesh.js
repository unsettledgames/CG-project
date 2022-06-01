class Model {
    constructor() {
        this.vertexBuffer = undefined;
        this.indexBuffer = undefined;
    }

    setTexture(toSet) {
        this.texture = toSet;
    }

    setVertexBuffer(toSet) {
        this.vertexBuffer = toSet;
    }

    setIndexBuffer(toSet) {
        this.indexBuffer = toSet;
    }
}