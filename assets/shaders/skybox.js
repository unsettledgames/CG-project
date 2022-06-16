let skyboxVert = `

uniform mat4 u_ModelTransform;
uniform mat4 u_ViewMatrix;
uniform mat4 u_ProjectionMatrix;

attribute vec3 a_Position;					 
varying vec3 v_Position;								 

void main(void)										 
{							
    v_Position = normalize(a_Position);		 
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_ModelTransform * vec4(a_Position, 1.0); 
}`;
		
let skyboxFrag = `
precision highp float;

uniform  samplerCube  u_Cubemap;	
varying vec3 v_Position;		

void main(void)									 
{
    vec3 pos = v_Position;
    pos.y = -pos.y;

    gl_FragColor = textureCube(u_Cubemap, pos);
} `;