class Shader {
    constructor (gl, path) {
        // Load source
        this.gl = gl;
        this.programID = this.gl.createProgram();

    }

    compile() {

    }

    link() {

    }
    
    use() {
        this.gl.useProgram(this.programID);
    }

    unuse() {
        this.gl.useProgram(0);
    }
}