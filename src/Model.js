class Model {

    constructor(props) {
        this.localTransform = new Transform();
        this.globalTransform = new Transform();
        this.children = [];

        this.shader = props.shader;
        this.texture = props.texture;
        this.normalMap = props.normalMap;
        this.mesh = props.mesh;
    }

    addChild(child) {
        this.children.push(child);
    }

    render(camera, spotLights, depthShader, lightMatrix, reflections) {
        let view = camera.getView().slice();
        let projection = camera.getProjection().slice();
        let inverseView = camera.transform.transform.slice();
        if (reflections != undefined) {
            view = currReflectionsMapView.slice();
            projection = reflectionsProjection.slice();
            glMatrix.mat4.invert(inverseView, view);
        }

        let cameraPos = camera.transform.getTranslation();

        if (!depthShader) {
            // Bind shader
            this.shader.use();
            // Send uniforms
            this.shader.setMat4("u_ViewMatrix", view);
            this.shader.setMat4("u_InverseView", inverseView);
            this.shader.setMat4("u_ProjectionMatrix", projection);
            this.shader.setMat4("u_ModelTransform", this.globalTransform.getTransform());
            this.shader.setMat4("u_LeftHeadlightView", leftHeadlightMatrix);
            this.shader.setMat4("u_RightHeadlightView", rightHeadlightMatrix);
            this.shader.setMat4("u_HeadlightProj", headlightsProjection);
            this.shader.setMat4("u_LightMatrix", createDirectionalLightMatrix(dayNightCycle.getLightDirection()));
            this.shader.setVec4("u_Color", new Float32Array([1.0, 1.0, 1.0, 1.0]));
            this.shader.setVec3("u_AmbientLight", new Float32Array(dayNightCycle.getAmbientLightIntensity()));
            this.shader.setVec3("u_LightColor", new Float32Array(dayNightCycle.getLightColour()));
            this.shader.setVec3("u_EnvLightDir", new Float32Array(dayNightCycle.getLightDirection()));
            this.shader.setFloat("u_SpecularStrength", specularStrength);
            this.shader.setVec3("u_CameraPosition", new Float32Array(cameraPos));
            if (spotLights != undefined)this.shader.setVec3Array("u_SpotLights", spotLights);
            // Submit shadowmaps
            gl.activeTexture(gl.TEXTURE4);
            gl.bindTexture(gl.TEXTURE_2D, frameBuffer.colorTexture);
            this.shader.setTexture("u_DepthSampler", 4);
            this.shader.setVec2("u_ShadowmapSize", new Float32Array(shadowMapSize));

            gl.activeTexture(gl.TEXTURE7);
            gl.bindTexture(gl.TEXTURE_2D, leftHeadlightBuffer.colorTexture);
            this.shader.setTexture("u_LeftHeadlightShadows", 7);

            gl.activeTexture(gl.TEXTURE8);
            gl.bindTexture(gl.TEXTURE_2D, rightHeadlightBuffer.colorTexture);
            this.shader.setTexture("u_RightHeadlightShadows", 8);

            // Submit reflection map
            gl.activeTexture(gl.TEXTURE9);
            gl.bindTexture(gl.TEXTURE_CUBE_MAP, reflectionMap);
            this.shader.setTexture("u_ReflectionMap", 9);

            headlightTexture.bind();
            this.shader.setTexture("u_HeadlightTexture", headlightTexture.texUnit);

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

            // Texture coordinates
            if (this.mesh.texCoords) {
                gl.bindBuffer(gl.ARRAY_BUFFER, this.mesh.texCoordsBuffer);	
                gl.enableVertexAttribArray(texCoordsIndex);
                gl.vertexAttribPointer(texCoordsIndex, 2, gl.FLOAT, false, 0, 0);
            }

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

            gl.drawElements(gl.TRIANGLES, this.mesh.indices.length, gl.UNSIGNED_SHORT, 0);

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
            gl.disableVertexAttribArray(posIndex);
            gl.bindBuffer(gl.ARRAY_BUFFER, null);
            
            this.shader.unuse();
            gl.activeTexture(gl.TEXTURE3);
            gl.bindTexture(gl.TEXTURE_2D, null);
        }
        else {
            depthShader.setMat4("u_LightMatrix", lightMatrix);
            depthShader.setMat4("u_ModelTransform", this.globalTransform.getTransform());
        
            // Bind attribute buffers
            // Position
            gl.bindBuffer(gl.ARRAY_BUFFER, this.mesh.vertexBuffer);
            gl.enableVertexAttribArray(posIndex);
            gl.vertexAttribPointer(posIndex, 3, gl.FLOAT, false, 0, 0);

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,this.mesh.indexBuffer);
            gl.drawElements(gl.TRIANGLES, this.mesh.indices.length, gl.UNSIGNED_SHORT, 0);

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
            gl.disableVertexAttribArray(posIndex);
            gl.bindBuffer(gl.ARRAY_BUFFER, null);
        }
    }
}