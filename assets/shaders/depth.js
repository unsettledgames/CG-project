let depthVert = `

attribute vec3 a_Position;
uniform   mat4 u_LightMatrix;	
uniform   mat4 u_ModelTransform;

void main(void)										
{		
    gl_Position = u_LightMatrix * u_ModelTransform * vec4(a_Position, 1.0);  				
}`;
		
let depthFrag = `
#extension GL_OES_standard_derivatives : enable
precision highp float;					

float planeApprox(float depth) 
{   
    // Compute partial derivatives of depth.    
    float dx = dFdx(depth);   
    float dy = dFdy(depth);   
    // Compute second moment over the pixel extents.   
    return  depth*depth + 0.25*(dx*dx + dy*dy);
} 

void main(void)									
{	
    gl_FragColor = vec4(gl_FragCoord.z, planeApprox(gl_FragCoord.z),0.0,1.0);
}`;