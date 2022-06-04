function ComputeTangentFrame(obj){

  	obj.tangents = new Float32Array(3*obj.numVertices);
    var n_star =   Array(obj.numVertices).fill(0);
    tangent = glMatrix.vec3.create();

    function TangentFrame(t0,t1,t2){
      t10 = glMatrix.vec2.create();
      t20 = glMatrix.vec2.create();
      
      var t = glMatrix.vec2.create();
      
      
      glMatrix.vec2.subtract(t10,t1,t0);
      glMatrix.vec2.subtract(t20,t2,t0);
  
      var area  = glMatrix.vec3.create();
      var area1 = glMatrix.vec3.create();
      var area2 = glMatrix.vec3.create();
      
      glMatrix.vec2.cross(area1,[1,0],t20);
      glMatrix.vec2.cross(area2,t10,[1,0]);
      glMatrix.vec2.cross(area,t10,t20);
  
      coord_u = area1[2]/area[2];
      coord_v = area2[2]/area[2];
      return [coord_u,coord_v];
     }
  
  for(it = 0; it <obj.numTriangles;++it){
    var indices = obj.triangleIndices.slice(3*it,3*(it+1));
    var pos = [];
    pos[0] = obj.vertices.slice(3*indices[0],3*(indices[0]+1));
    pos[1] = obj.vertices.slice(3*indices[1],3*(indices[1]+1));
    pos[2] = obj.vertices.slice(3*indices[2],3*(indices[2]+1));
    var t = [];
    t[0] =   obj.texCoords.slice(2*indices[0],2*(indices[0]+1));
    t[1] =   obj.texCoords.slice(2*indices[1],2*(indices[1]+1));
    t[2] =   obj.texCoords.slice(2*indices[2],2*(indices[2]+1));
    for(iv = 0; iv < 3;++iv)
      {
        n_star[indices[iv]]++;
        
        coords = TangentFrame(t[iv],t[(iv+1)%3],t[(iv+2)%3]);

        var pos10 = glMatrix.vec3.create();
        var pos20 = glMatrix.vec3.create();
        glMatrix.vec3.subtract(pos10,pos[(iv+1)%3],pos[ iv]);
        glMatrix.vec3.subtract(pos20,pos[(iv+2)%3],pos[ iv]);
        
        
        glMatrix.vec3.scale(pos10,pos10,coords[0]);
        glMatrix.vec3.scale(pos20,pos20,coords[1]);
        glMatrix.vec3.add(tangent,pos10,pos20);
        obj.tangents[3*indices[iv]]   = tangent[0];
        obj.tangents[3*indices[iv]+1] = tangent[1];
        obj.tangents[3*indices[iv]+2] = tangent[2];
    }
  }
  
 for(iv = 0; iv <obj.numVertices;++iv){
   tangent = obj.tangents.slice(3*iv,3*(iv+1));
   glMatrix.vec3.scale(tangent,tangent,1.0/n_star[iv]);
   obj.tangents[3*iv]   = tangent[0];
   obj.tangents[3*iv+1] = tangent[1];
   obj.tangents[3*iv+2] = tangent[2];
 }
  
}