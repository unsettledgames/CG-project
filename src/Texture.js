class Texture {
    constructor(id, texUnit) {
        let img = document.getElementById(id);

        gl.activeTexture(gl.TEXTURE0 + texUnit);
		this.texture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, this.texture);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
        gl.generateMipmap(gl.TEXTURE_2D);

        this.texUnit = texUnit;
    }

    getID() {
        return this.texture;
    }

    bind() {
        gl.activeTexture(gl.TEXTURE0 + this.texUnit);
        gl.bindTexture(gl.TEXTURE_2D, this.texture)
    }

    unbind() {
        gl.activeTexture(gl.TEXTURE0 + this.texUnit);
        gl.bindTexture(gl.TEXTURE_2D, null);
    }
}