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

    // Create meshes and models for the buildings
    for (let i=0; i<buildings.length; i++) {
        let currBuilding = buildings[i];
        // Use a random facade texture if it's a facade, use the roof texture otherwise
        let texture = new Texture((i >= buildings.length ? 
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
}

function run() {
    gl.clear(gl.COLOR_BUFFER_BIT, gl.DEPTH_BUFFER_BIT);

    renderModels();

    window.requestAnimationFrame(run);
}

function testTriangle() {
    var vertices = [
        -0.5,0.5,0.0,
        -0.5,-0.5,0.0,
        0.5,-0.5,0.0, 
     ];
     
     indices = [0,1,2];
     
     // Create an empty buffer object to store vertex buffer
     var vertex_buffer = gl.createBuffer();

     // Bind appropriate array buffer to it
     gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
     
     // Pass the vertex data to the buffer
     gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

     // Unbind the buffer
     gl.bindBuffer(gl.ARRAY_BUFFER, null);

     // Create an empty buffer object to store Index buffer
     var Index_Buffer = gl.createBuffer();

     // Bind appropriate array buffer to it
     gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Index_Buffer);

     // Pass the vertex data to the buffer
     gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
     
     // Unbind the buffer
     gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

     /*================ Shaders ====================*/
     
     // Vertex shader source code
     var vertCode =
        'attribute vec3 coordinates;' +
            
        'void main(void) {' +
           ' gl_Position = vec4(coordinates, 1.0);' +
        '}';
        
     // Create a vertex shader object
     var vertShader = gl.createShader(gl.VERTEX_SHADER);

     // Attach vertex shader source code
     gl.shaderSource(vertShader, vertCode);

     // Compile the vertex shader
     gl.compileShader(vertShader);

     //fragment shader source code
     var fragCode =
        'void main(void) {' +
           ' gl_FragColor = vec4(0.0, 0.0, 0.0, 0.1);' +
        '}';
        
     // Create fragment shader object
     var fragShader = gl.createShader(gl.FRAGMENT_SHADER);

     // Attach fragment shader source code
     gl.shaderSource(fragShader, fragCode); 
     
     // Compile the fragmentt shader
     gl.compileShader(fragShader);

     // Create a shader program object to store
     // the combined shader program
     var shaderProgram = gl.createProgram();

     // Attach a vertex shader
     gl.attachShader(shaderProgram, vertShader);

     // Attach a fragment shader
     gl.attachShader(shaderProgram, fragShader);

     // Link both the programs
     gl.linkProgram(shaderProgram);

     // Use the combined shader program object
     gl.useProgram(shaderProgram);

     /*======= Associating shaders to buffer objects =======*/

     // Bind vertex buffer object
     gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);

     // Bind index buffer object
     gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Index_Buffer);
     
     // Get the attribute location
     var coord = gl.getAttribLocation(shaderProgram, "coordinates");

     // Point an attribute to the currently bound VBO
     gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 0, 0); 
     
     // Enable the attribute
     gl.enableVertexAttribArray(coord);

     /*=========Drawing the triangle===========*/

     // Clear the canvas
     gl.clearColor(0.5, 0.5, 0.5, 0.9);

     // Enable the depth test
     gl.enable(gl.DEPTH_TEST);

     // Clear the color buffer bit
     gl.clear(gl.COLOR_BUFFER_BIT);

     // Set the view port
     gl.viewport(0,0,canvas.width,canvas.height);

     // Draw the triangle
     gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT,0);
}

function renderModels() {
    for (let i=0; i<models.length; i++) {
        models[i].render(camera.getViewProjection());
    }
}