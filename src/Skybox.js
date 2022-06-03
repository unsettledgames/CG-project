class Skybox {
    constructor() {
        this.createFrameBuffers();
        this.createTexture();
    }

    loadFace(faceId, type) {
        let img = document.getElementById(faceId);
        gl.texImage2D(type, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
    }

    createTexture() {
        this.texture = gl.createTexture();
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.texture);

        this.loadFace("negX", gl.TEXTURE_CUBE_MAP_NEGATIVE_X);
        this.loadFace("negZ", gl.TEXTURE_CUBE_MAP_NEGATIVE_Z);
        this.loadFace("posX", gl.TEXTURE_CUBE_MAP_POSITIVE_X);
        this.loadFace("posY", gl.TEXTURE_CUBE_MAP_POSITIVE_Y);
        this.loadFace("posZ", gl.TEXTURE_CUBE_MAP_POSITIVE_Z);
        this.loadFace("negY", gl.TEXTURE_CUBE_MAP_NEGATIVE_Y);

        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
    }

    createFrameBuffers() {
        this.buffers = [];
	    let faces = [gl.TEXTURE_CUBE_MAP_POSITIVE_X,gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
			gl.TEXTURE_CUBE_MAP_POSITIVE_Y,gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
			gl.TEXTURE_CUBE_MAP_POSITIVE_Z,gl.TEXTURE_CUBE_MAP_NEGATIVE_Z];
			
        for(let f = 0; f < 6; ++f){
            let newframebuffer = gl.createFramebuffer();
            gl.bindFramebuffer(gl.FRAMEBUFFER, newframebuffer);

            let renderbuffer = gl.createRenderbuffer();
            gl.bindRenderbuffer(gl.RENDERBUFFER, renderbuffer);
            gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, viewportSize.x, viewportSize.y);

            // TODO: reflection map
            /*
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, faces[f], reflectionMap, 0);
            */
            gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, renderbuffer);
            
            let status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
            if (status != gl.FRAMEBUFFER_COMPLETE)
                console.error("gl.checkFramebufferStatus() returned " + status);
            this.buffers.push(newframebuffer);
        }

        gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
        gl.bindRenderbuffer(gl.RENDERBUFFER, null);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }
}