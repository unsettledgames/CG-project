
var loadOnGPU = function( jsonMesh ) {
   var gpuMesh = {
    vertBuffer: null,
    indexBuffer: null
   }
   
   gpuMesh.vertices = jsonMesh.vertices[0].values;
   gpuMesh.normals = jsonMesh.vertices[1].values;
   gpuMesh.indices  = jsonMesh.connectivity[0].indices; 
   gpuMesh.nTriangles = gpuMesh.indices.length / 3;
 
   return gpuMesh;
}