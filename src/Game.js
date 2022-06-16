/** TODO
 * - Asset caching
 */

// Scene and controllers
let mainScene = new Scene(scene_0);
let skybox = new Skybox();
let skyboxCube;
let camera;
let car;

// Models and lights
let models = [];
let spotLights = [];

// Shaders
let shaders = {
    uniform: new Shader("uniform"),
    reflections: new Shader("reflections"),
    skybox: new Shader("skybox"),
    depth: new Shader("depth"),
    basic: new Shader("basic")
};

// Structures
let frameBuffer;

// Delta time
let lastUpdate = Date.now();

init();
run();

function init() {
    console.log(mainScene);
    canvas.width = viewportSize.x;
    canvas.height = viewportSize.y;

    gl.viewport(0, 0, viewportSize.x, viewportSize.y);
    gl.enable(gl.DEPTH_TEST);

    frameBuffer = new FrameBuffer(shadowMapSize[0], shadowMapSize[1]);

    let cube = new Cube();
    let cubeMesh = new Mesh({
        vertices: cube.vertices,
        indices: cube.triangleIndices
    }, cube.numTriangles);
    skyboxCube = new Model({
        mesh: cubeMesh,
        shader: shaders.skybox
    });

    skyboxCube.globalTransform.setTransform(glMatrix.mat4.fromScaling(glMatrix.mat4.create(), [500, 500, 500]));

    // Merge facades and roofs
    let buildings = mainScene.scene.buildingsObjTex.slice();
    for (let i=0; i<mainScene.scene.buildingsObjTex.length; i++)
        buildings.push(mainScene.scene.buildingsObjTex[i].roof);

    // Create meshes and models for the buildings
    for (let i=0; i<buildings.length; i++) {
        let currBuilding = ComputeNormals(buildings[i]);
        ComputeTangentFrame(currBuilding);

        // Use a random facade texture if it's a facade, use the roof texture otherwise
        let texture;
        let normalMap = undefined;
        if (i >= mainScene.scene.buildingsObjTex.length) {
            texture = new Texture("assets/textures/roof.jpg");
        }
        else {
            let number =  Math.floor(Math.random() * 3 + 1);
            let normalPath = "assets/textures/normals/facade" + number + "_normal.png";
            texture = new Texture("assets/textures/facade" + number + ".jpg", 0, Math.floor(Math.random() * 3 + 1));
            normalMap = new Texture(normalPath, 1, 1);
        }
        let currMesh = new Mesh({
            vertices: currBuilding.vertices,
            indices: currBuilding.triangleIndices,
            texCoords: currBuilding.texCoords,
            normals: currBuilding.normals,
            tangents: currBuilding.tangents
        }, currBuilding.numTriangles);

        let model = new Model({
            mesh: currMesh,
            shader: shaders.uniform,
            texture: texture,
            normalMap: normalMap
        });

        models.push(model);
    }

    // Add lamps
    for (let i=0; i<mainScene.scene.lamps.length; i++) {
        let lampObj = loadOnGPU(lamp);
        ComputeTangentFrame(lampObj);
        let lampMesh = new Mesh({
            vertices: new Float32Array(lampObj.vertices),
            normals: new Float32Array(lampObj.normals),
            indices: new Uint16Array(lampObj.indices),
            tangents: new Float32Array(lampObj.tangents)
        }, lampObj.nTriangles);
        let lampModel = new Model({
            mesh: lampMesh,
            shader: shaders.reflections
        });

        lampModel.globalTransform.setTranslation(mainScene.scene.lamps[i]._position);
        lampModel.globalTransform.setScale([0.2, 0.2, 0.2]);
        
        models.push(lampModel);
        mainScene.scene.lamps[i]._position[1] = 2;
        spotLights.push(mainScene.scene.lamps[i]._position);
    }

    ComputeNormals(mainScene.groundObj);
    ComputeTangentFrame(mainScene.groundObj);
    // Create meshes and models for the track and the street
    let ground = new Mesh({
        vertices: mainScene.groundObj.vertices,
        indices: mainScene.groundObj.triangleIndices,
        texCoords: mainScene.groundObj.texCoords,
        tangents: mainScene.groundObj.tangents,
        normals: mainScene.groundObj.normals
    }, mainScene.groundObj.numTriangles);
    let groundModel = new Model({
        mesh:ground,
        shader: shaders.uniform,
        texture: new Texture("assets/textures/grass_tile.png", 0, 3),
        normalMap: new Texture("assets/textures/normals/grass.png", 1, 3),
        parallaxMap: new Texture("assets/textures/normals/grass_parallax.png", 2, 3)
    });
    models.push(groundModel);

    ComputeNormals(mainScene.trackObj);
    let trackTangents = [];
    let trackNormals = [];
    for (let i=0; i<152; i++) {
        trackTangents.push(0);
        trackTangents.push(0);
        trackTangents.push(1);

        trackNormals.push(0);
        trackNormals.push(-1);
        trackNormals.push(0);
    }
    console.log(mainScene.trackObj.tangents);
    let track = new Mesh({
        vertices: mainScene.trackObj.vertices,
        indices: mainScene.trackObj.triangleIndices,
        texCoords: mainScene.trackObj.texCoords,
        tangents: new Float32Array(trackTangents),
        normals: new Float32Array(trackNormals)
    }, mainScene.trackObj.numTriangles);
    let trackModel = new Model({
        mesh:track,
        shader: shaders.uniform,
        texture: new Texture("assets/textures/street4.png", 0),
        normalMap: new Texture("assets/textures/normals/asphalt.jpg", 1)
    });
    models.push(trackModel);

    let teapotObj = loadOnGPU(teapot);
    ComputeTangentFrame(teapotObj);
    let teapotMesh = new Mesh({
        vertices: new Float32Array(teapotObj.vertices),
        indices: new Uint16Array(teapotObj.indices),
        normals: new Float32Array(teapotObj.normals),
        tangents: new Float32Array(teapotObj.tangents)
    }, teapotObj.nTriangles);
    let teapotModel = new Model({
        mesh:teapotMesh,
        shader:shaders.reflections
    });
    models.push(teapotModel);

    car = new CarController(teapotModel, undefined, undefined);
    camera = new Camera(viewportSize.x / viewportSize.y, 1.0, 1000.0, 0.785, car);
}

function run() {
    let now = Date.now();
    let dt = now - lastUpdate;
    lastUpdate = now;

    car.update(dt);
    camera.update(dt);

    updateTransformStack();

    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);
    shadowPass();

    gl.disable(gl.CULL_FACE);
    render();

    testQuad();

    window.requestAnimationFrame(run);
}

function updateTransformStack() {
    // Traverse the stack and set the global transforms of the models
}

function shadowPass() {
    
    gl.clearDepth(1.0);
    
    gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer.frameBuffer);
    gl.viewport(0, 0, shadowMapSize[0], shadowMapSize[1]);
    gl.clearColor(0.0, 1.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    shaders.depth.use();
    render(shaders.depth);
    shaders.depth.unuse();

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    getGLError();
}

function render(depthShader) {
    gl.viewport(0, 0, shadowMapSize[0], shadowMapSize[1]);
    
    if (!depthShader) {
        drawSkybox();
    }

    for (let i=0; i<models.length; i++) {
        models[i].render(camera, spotLights, depthShader);
    }
}

function drawSkybox() {
    shaders.skybox.use();

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, skybox.texture);
    shaders.skybox.setTexture("u_Cubemap", skybox.texture);
    
    gl.depthMask(false);
    skyboxCube.render(camera, spotLights);
    gl.depthMask(true);

    shaders.skybox.unuse();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
}

function testQuad() {
    let vertices = new Float32Array([0, 0, 0, 0, 16, 0, 16, 0, 0, 16, 16, 0]);
    let indices = new Uint16Array([0, 2, 1, 1, 2, 3]);
    let texCoords = new Float32Array([0, 0, 0, 1, 1, 0, 1, 1]);

    let texture = new Texture(undefined);
    texture.id = frameBuffer.colorTexture;
    texture.texUnit = 4;
    texture.tilingFactor = 1.0;
    let mesh = new Mesh({vertices: vertices, indices: indices, texCoords: texCoords}, 2);
    let model = new Model({mesh:mesh, shader: shaders.basic});

    model.render(camera, undefined);
}