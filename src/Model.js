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
        this.shader.use();
        // Send uniforms
        this.shader.setMat4("u_ViewProjection", viewProj);
        this.shader.setVec4("u_Color", new Float32Array([1.0, 1.0, 1.0, 1.0]));
        this.shader.setTexture("u_Texture", this.texture.getID());

        this.texture.bind();
        getGLError();
        
        // Bind attribute buffers
        // Position
        gl.bindBuffer(gl.ARRAY_BUFFER, this.mesh.vertexBuffer);
        gl.enableVertexAttribArray(posIndex);
        gl.vertexAttribPointer(posIndex, 3, gl.FLOAT, false, 0, 0);

        getGLError();

        // Texture coordinates
        if (this.mesh.texCoords) {
            gl.bindBuffer(gl.ARRAY_BUFFER, this.mesh.texCoordsBuffer);	
            gl.enableVertexAttribArray(texCoordsIndex);
            gl.vertexAttribPointer(texCoordsIndex, 2, gl.FLOAT, false, 0, 0);
        }

        getGLError();

        // TODO: add indices for the other attributes
        // Tangents
        if(this.tangentsBuffer) { 
            gl.bindBuffer(gl.ARRAY_BUFFER, this.mesh.tangentsBuffer);
            gl.enableVertexAttribArray(this.shader.attributes["a_Tangent"]);
            gl.vertexAttribPointer(this.shader.attributes["a_Tangent"], 3, gl.FLOAT, false, 0, 0);
        }

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,this.mesh.indexBuffer);
        getGLError();

        gl.drawElements(gl.TRIANGLES, this.mesh.indices.length, gl.UNSIGNED_SHORT, 0);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        gl.disableVertexAttribArray(posIndex);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }
}