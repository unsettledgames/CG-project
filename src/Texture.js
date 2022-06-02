class Texture {
    constructor(url, texUnit) {
        let image = new Image();
        image.src = url;

        console.log(url);

        image.addEventListener('load',function() {	
            // Texture generation
            gl.activeTexture(gl.TEXTURE0 + texUnit);
            this.rendererID = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, this.rendererID);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

            // Texture parameters
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
            gl.generateMipmap(gl.TEXTURE_2D);
        });

        this.texUnit = texUnit;
    }

    bind() {
        gl.activeTexture(gl.TEXTURE0 + this.texUnit);
        gl.bindTexture(gl.TEXTURE_2D, this.rendererID)
    }

    unbind() {
        gl.activeTexture(gl.TEXTURE0 + this.texUnit);
        gl.bindTexture(gl.TEXTURE_2D, null);
    }
}