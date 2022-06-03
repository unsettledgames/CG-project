let skyboxVert = `

uniform   mat4 u_ViewProjection;
attribute vec3 a_Position;					 
varying vec3 v_Position;								 
void main(void)										 
{							
    v_Position = normalize(a_Position);		 
    gl_Position = u_ViewProjection * vec4(a_Position, 1.0); 
}`;
		
let skyboxFrag = `
precision highp float;

uniform  samplerCube  u_Cubemap;	
varying vec3 v_Position;		

void main(void)									 
{														 
    gl_FragColor = textureCube(u_Cubemap, normalize(v_Position));
} `;