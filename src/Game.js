let mainScene = new Scene(scene_0);
let skybox = new Skybox();
let skyboxCube;
let camera;
let car;

let frameBuffer = new FrameBuffer(viewportSize.x, viewportSize.y);

let models = [];
let shaders = {
    uniform: new Shader("uniform"),
    reflections: new Shader("reflections"),
    skybox: new Shader("skybox")
};

init();
run();

function init() {
    canvas.width = viewportSize.x;
    canvas.height = viewportSize.y;

    gl.viewport(0, 0, viewportSize.x, viewportSize.y);
    gl.enable(gl.DEPTH_TEST);

    let cube = new Cube();
    let cubeMesh = new Mesh({
        vertices: cube.vertices,
        indices: cube.triangleIndices
    }, cube.numTriangles);
    skyboxCube = new Model({
        mesh: cubeMesh,
        shader: shaders.skybox
    });

    // Merge facades and roofs
    let buildings = mainScene.scene.buildingsObjTex.slice();
    for (let i=0; i<mainScene.scene.buildingsObjTex.length; i++)
        buildings.push(mainScene.scene.buildingsObjTex[i].roof);

    // Create meshes and models for the buildings
    for (let i=0; i<buildings.length; i++) {
        let currBuilding = buildings[i];
        // Use a random facade texture if it's a facade, use the roof texture otherwise
        let texture = new Texture((i >= mainScene.scene.buildingsObjTex.length ? 
            "roof" : "facade" + Math.floor(Math.random()*3 + 1)), 0);
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
            texture: texture
        });

        models.push(model);
    }

    // Create meshes and models for the track and the street
    let ground = new Mesh({
        vertices: mainScene.groundObj.vertices,
        indices: mainScene.groundObj.triangleIndices,
        texCoords: mainScene.groundObj.texCoords
    }, mainScene.groundObj.numTriangles);
    let groundModel = new Model({
        mesh:ground,
        shader: shaders.uniform,
        texture: new Texture("grass_tile", 0)
    });
    models.push(groundModel);

    let track = new Mesh({
        vertices: mainScene.trackObj.vertices,
        indices: mainScene.trackObj.triangleIndices,
        texCoords: mainScene.trackObj.texCoords
    }, mainScene.trackObj.numTriangles);
    let trackModel = new Model({
        mesh:track,
        shader: shaders.uniform,
        texture: new Texture("street4", 0)
    });
    models.push(trackModel);

    let teapotObj = loadOnGPU(teapot);
    let teapotMesh = new Mesh({
        vertices: new Float32Array(teapotObj.vertices),
        indices: new Uint16Array(teapotObj.indices)
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
    gl.clear(gl.COLOR_BUFFER_BIT, gl.DEPTH_BUFFER_BIT);

    car.update();
    camera.update();

    updateTransformStack();
    render();

    window.requestAnimationFrame(run);
}

function updateTransformStack() {
    // Traverse the stack and set the global transforms of the models
}

function render() {
    drawSkybox();
    for (let i=0; i<models.length; i++) {
        models[i].render(camera.getViewProjection());
    }
}

function drawSkybox() {
    let skyboxMat = glMatrix.mat4.fromScaling(glMatrix.mat4.create(), [500,500,500]);
    glMatrix.mat4.mul(skyboxMat, camera.getViewProjection(), skyboxMat);
    shaders.skybox.use();

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, skybox.texture);
    shaders.skybox.setTexture("u_Cubemap", skybox.texture);
    
    gl.depthMask(false);
    skyboxCube.render(skyboxMat);
    gl.depthMask(true);
    
    shaders.skybox.unuse();
}