class Model {

    constructor(props) {
        this.localTransform = new Transform();
        this.globalTransform = this.localTransform;
        this.parent = undefined;

        this.shader = props.shader;
        this.texture = props.texture;
        this.normalMap = props.normalMap;
        this.mesh = props.mesh;
    }

    addChild(child) {
        child.parent = this;
    }

    render(camera, spotLights, depthShader) {
        let view = camera.getView();
        let proj = camera.getProjection();
        let cameraPos = camera.transform.getTranslation();

        if (!depthShader) {
            // Bind shader
            this.shader.use();
            // Send uniforms
            this.shader.setMat4("u_ViewMatrix", view);
            this.shader.setMat4("u_ProjectionMatrix", proj);
            this.shader.setMat4("u_ModelTransform", this.globalTransform.getTransform());
            this.shader.setVec4("u_Color", new Float32Array([1.0, 1.0, 1.0, 1.0]));
            this.shader.setVec3("u_AmbientLight", new Float32Array(ambientLight));
            this.shader.setVec3("u_EnvLightDir", new Float32Array(envLightDir));
            this.shader.setFloat("u_SpecularStrength", specularStrength);
            this.shader.setVec3("u_CameraPosition", new Float32Array(cameraPos));
            this.shader.setVec3Array("u_SpotLights", spotLights);

            if (this.texture) {
                this.texture.bind();
                this.shader.setTexture("u_Texture", this.texture.texUnit);
                this.shader.setFloat("u_TilingFactor", this.texture.tilingFactor);
            }

            if (this.normalMap) {
                this.normalMap.bind();
                this.shader.setTexture("u_NormalMap", this.normalMap.texUnit);
                this.shader.setInt("u_UseNormalMap", 1);
            }
            else {
                this.shader.setInt("u_UseNormalMap", 0);
            }

            if (this.parallaxMap) {
                this.parallaxMap.bind();
                this.shader.setTexture("u_ParallaxMap", this.parallaxMap.texUnit);
                this.shader.setInt("u_UseParallaxMap", 1);
            }
            else {
                this.shader.setInt("u_UseParallaxMap", 0);
            }

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

            // Tangents
            if(this.mesh.tangents) { 
                gl.bindBuffer(gl.ARRAY_BUFFER, this.mesh.tangentsBuffer);
                gl.enableVertexAttribArray(tangentIndex);
                gl.vertexAttribPointer(tangentIndex, 3, gl.FLOAT, false, 0, 0);
            }

            // Normals
            if(this.mesh.normals) { 
                gl.bindBuffer(gl.ARRAY_BUFFER, this.mesh.normalBuffer);
                gl.enableVertexAttribArray(normalIndex);
                gl.vertexAttribPointer(normalIndex, 3, gl.FLOAT, false, 0, 0);
            }

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,this.mesh.indexBuffer);
            getGLError();

            gl.drawElements(gl.TRIANGLES, this.mesh.indices.length, gl.UNSIGNED_SHORT, 0);

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
            gl.disableVertexAttribArray(posIndex);
            gl.bindBuffer(gl.ARRAY_BUFFER, null);
            if (this.texture)
                this.texture.unbind();
            if (this.normalMap)
                this.normalMap.unbind();
            if (this.parallaxMap) {
                this.parallaxMap.unbind();
            }
            this.shader.unuse();
        }
        else {
            depthShader.setMat4("u_ModelTransform", this.globalTransform.getTransform());
            // Bind attribute buffers
            // Position
            gl.bindBuffer(gl.ARRAY_BUFFER, this.mesh.vertexBuffer);
            gl.enableVertexAttribArray(posIndex);
            gl.vertexAttribPointer(posIndex, 3, gl.FLOAT, false, 0, 0);

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,this.mesh.indexBuffer);
            getGLError();

            gl.drawElements(gl.TRIANGLES, this.mesh.indices.length, gl.UNSIGNED_SHORT, 0);
        }
    }
}