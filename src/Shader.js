class Shader {
    constructor (name) {
        // Load source
        this.programID = gl.createProgram();

        switch (name) {
            case "uniform":
                this.fragSrc = uniformFrag;
                this.vertSrc = uniformVert;
                break;
            case "reflections":
                this.fragSrc = reflectionsFrag;
                this.vertSrc = reflectionsVert;
                break;
            case "skybox":
                this.fragSrc = skyboxFrag;
                this.vertSrc = skyboxVert;
                break;
            case "depth":
                this.fragSrc = depthFrag;
                this.vertSrc = depthVert;
                break;
            default:
                console.log("Shader ", name, " not supported");
                return;
        }

        this.compile();

        this.link();
    }

    compile() {
        let vertShader = gl.createShader(gl.VERTEX_SHADER);
        let fragShader = gl.createShader(gl.FRAGMENT_SHADER);

        gl.shaderSource(vertShader, this.vertSrc);
        gl.shaderSource(fragShader, this.fragSrc);

        gl.compileShader(vertShader);
        gl.compileShader(fragShader);

        let compiled = gl.getShaderParameter(vertShader, gl.COMPILE_STATUS);
        if (!compiled) {
            let compilationLog = gl.getShaderInfoLog(vertShader);
            console.log('Shader compiler log: ' + compilationLog);
            return;
        }

        compiled = gl.getShaderParameter(fragShader, gl.COMPILE_STATUS);
        if (!compiled) {
            let compilationLog = gl.getShaderInfoLog(fragShader);
            console.log('Shader compiler log: ' + compilationLog);
            return;
        }

        this.vertShader = vertShader;
        this.fragShader = fragShader;
    }

    link() {
        gl.attachShader(this.programID, this.vertShader)
        gl.attachShader(this.programID, this.fragShader);

        gl.bindAttribLocation(this.programID, posIndex, "a_Position");
        gl.bindAttribLocation(this.programID, texCoordsIndex, "a_TexCoords");
        
        gl.linkProgram(this.programID);

        let linked = gl.getProgramParameter(this.programID, gl.LINK_STATUS);
        if (!linked) {
            let linkLog = gl.getProgramInfoLog(this.programID);
            console.log("Shader linking log: " + linkLog);
            return;
        }
    }

    use() {
        gl.useProgram(this.programID);
        getGLError();
    }

    setFloat(name, value) {
        let location = gl.getUniformLocation(this.programID, name);
        gl.uniform1f(location, value);
        getGLError();
    }

    setVec2(name, value) {
        let location = gl.getUniformLocation(this.programID, name);
        gl.uniform2fv(location, value);
        getGLError();
    }

    setVec3(name, value) {
        let location = gl.getUniformLocation(this.programID, name);
        gl.uniform3fv(location, value);
        getGLError();
    }

    setVec4(name, value) {
        let location = gl.getUniformLocation(this.programID, name);
        gl.uniform4fv(location, value);
        getGLError();
    }

    setVec3Array(name, value) {
        let toSet = new Float32Array(value.length * 3);
        for (let i=0; i<value.length * 3; i++)
            toSet[i] = value[Math.floor(i / 3)][i%3];

        let location = gl.getUniformLocation(this.programID, name);
        gl.uniform3fv(location, toSet);
        getGLError();
    }

    setMat4(name, value) {
        let location = gl.getUniformLocation(this.programID, name);
        gl.uniformMatrix4fv(location, false, value);
        getGLError();
    }

    setInt(name, value) {
        let location = gl.getUniformLocation(this.programID, name);
        gl.uniform1i(location, value);
        getGLError();
    }

    setTexture(name, value) {
        this.setInt(name, value);
    }

    unuse() {
        gl.useProgram(null);
    }
}