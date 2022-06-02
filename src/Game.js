let mainScene = new Scene(scene_0);
let models = [];
let shaders = {
    uniform: new Shader("uniform"),
    reflections: new Shader("reflections")
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

    // Create meshes and models for the buildings
    for (let i=0; i<mainScene.scene.buildingsObjTex.length; i++) {
        let currBuilding = mainScene.scene.buildingsObjTex[i];
        // Use a random facade texture if it's a facade, use the roof texture otherwise
        let texture = new Texture((i >= mainScene.scene.buildingsObjTex.length ? 
            "./assets/textures/roof.jpg" : "./assets/textures/facade"+ Math.floor(Math.random()*3 + 1) + ".jpg"), 0);
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
}

function run() {
    gl.clear(gl.COLOR_BUFFER_BIT, gl.DEPTH_BUFFER_BIT);

    renderModels();

    window.requestAnimationFrame(run);
}

function renderModels() {
    for (model in models) {

    }
}