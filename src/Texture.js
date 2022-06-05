class Texture {
    constructor(id, texUnit = 0, tilingFactor = 1.0) {
        let img = new Image();
        img.src = id;

        this.id = id;
        this.texUnit = texUnit;
        this.tilingFactor = tilingFactor;

        img.addEventListener('load',function(){	
            this.texture = gl.createTexture();
            gl.activeTexture(gl.TEXTURE0 + texUnit);
            gl.bindTexture(gl.TEXTURE_2D, this.texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
            gl.generateMipmap(gl.TEXTURE_2D);
            gl.bindTexture(gl.TEXTURE_2D, null);
        }.bind(this));
    }

    getID() {
        return this.texture;
    }

    bind() {
        if (this.texUnit == undefined)
            return;
        gl.activeTexture(gl.TEXTURE0 + this.texUnit);
        gl.bindTexture(gl.TEXTURE_2D, this.texture)
    }

    unbind() {
        if (this.texUnit == undefined)
            return;
        gl.activeTexture(gl.TEXTURE0 + this.texUnit);
        gl.bindTexture(gl.TEXTURE_2D, null);
    }
}