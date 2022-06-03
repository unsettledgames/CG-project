let mainScene = new Scene(scene_0);
let camera = new Camera(viewportSize.x / viewportSize.y, 1.0, 500.0, 0.785);
console.log(camera.getProjection());
let models = [];
let shaders = {
    uniform: new Shader("uniform", [0, 1]),
    reflections: new Shader("reflections", [0, 1])
};

init();
run();

function init() {
    canvas.width = viewportSize.x;
    canvas.height = viewportSize.y;

    gl.clearColor(0.1, 0.1, 0.2, 1.0);
    gl.viewport(0, 0, viewportSize.x, viewportSize.y);
    gl.enable(gl.DEPTH_TEST);

    // Merge facades and roofs
    let buildings = mainScene.scene.buildingsObjTex.slice();
    for (let i=0; i<mainScene.scene.buildingsObjTex.length; i++)
        buildings.push(mainScene.scene.buildingsObjTex[i].roof);
/*
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
    }*/

    console.log(mainScene);

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
}

function run() {
    gl.clear(gl.COLOR_BUFFER_BIT, gl.DEPTH_BUFFER_BIT);

    updateCamera();
    renderModels();

    window.requestAnimationFrame(run);
}

function updateCamera() {
    let translation = glMatrix.vec3.create();
    if (Events.isKeyDown('A')) {
        translation[0] = -1;
    }
    if (Events.isKeyDown('D')) {
        translation[0] = 1;
    }
    if (Events.isKeyDown('W')) {
        translation[2] = -1;
    }
    if (Events.isKeyDown('S')) {
        translation[2] = 1;
    }

    camera.move(translation);
}

function renderModels() {
    for (let i=0; i<models.length; i++) {
        models[i].render(camera.getViewProjection());
    }
}