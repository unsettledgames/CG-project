class Shader {
    constructor (gl, name) {
        // Load source
        this.gl = gl;
        this.programID = this.gl.createProgram();

        switch (name) {
            case "uniform":
                this.fragSrc = uniformFrag;
                this.vertSrc = uniformVert;
                break;
            case "reflections":
                this.fragSrc = reflectionsFrag;
                this.vertSrc = reflectionsVert;
                break;
            default:
                console.log("Shader ", name, " not supported");
                return;
        }

        this.compile();
        this.link();
    }

    compile() {
        let vertShader = this.gl.createShader(this.gl.VERTEX_SHADER);
        let fragShader = this.gl.createShader(this.gl.FRAGMENT_SHADER);

        this.gl.shaderSource(vertShader, this.vertSrc);
        this.gl.shaderSource(fragShader, this.fragSrc);

        this.gl.compileShader(vertShader);
        this.gl.compileShader(fragShader);

        let compiled = gl.getShaderParameter(vertShader, gl.COMPILE_STATUS);
        if (!compiled) {
            let compilationLog = gl.getShaderInfoLog(vertShader);
            console.log('Shader compiler log: ' + compilationLog);
            return;
        }

        compiled = gl.getShaderParameter(fragShader, gl.COMPILE_STATUS);
        if (!compiled) {
            let compilationLog = gl.getShaderInfoLog(vertShader);
            console.log('Shader compiler log: ' + compilationLog);
            return;
        }

        this.vertShader = vertShader;
        this.fragShader = fragShader;
    }

    link() {
        this.gl.attachShader(this.programID, this.vertShader)
        this.gl.attachShader(this.programID, this.fragShader);
        this.linkProgram(this.programID);
    }

    use() {
        this.gl.useProgram(this.programID);
    }

    setVec4(name, value) {
        let location = this.gl.getUniformLocation(this.programID, name);
        this.gl.uniform4v(location, value);
        getGLError();
    }

    setMat4(name, value) {
        let location = this.gl.getUniformLocation(this.programID, name);
        this.gl.uniformMatrix4fv(location, value);
        getGLError();
    }

    setTexture(name, value) {
        let location = this.gl.getUniformLocation(this.programID, name);
        this.gl.uniform1i(location, value);
        getGLError();
    }

    unuse() {
        this.gl.useProgram(0);
    }
}