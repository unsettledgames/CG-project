class Mesh {
    constructor(props, nTriangles) {
        this.vertices = props.vertices;
        this.indices = props.indices;
        this.texCoords = props.texCoords;
        this.normals = props.normals;
        this.tangents = props.tangents;
        this.nTriangles = nTriangles;

        this.vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
      
        if(this.texCoords){
            this.texCoordsBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordsBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, this.texCoords, gl.STATIC_DRAW);
            gl.bindBuffer(gl.ARRAY_BUFFER, null);
        }
      
        // TODO: use the right index here
        if(this.tangents){ 
            this.tangentsBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.tangentsBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, this.tangents, gl.STATIC_DRAW);
            gl.bindBuffer(gl.ARRAY_BUFFER, null);
        }
           
        if(this.normals){
            obj.normalBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, this.normals, gl.STATIC_DRAW);
            gl.bindBuffer(gl.ARRAY_BUFFER, null);
        }
              
        this.indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    }
}