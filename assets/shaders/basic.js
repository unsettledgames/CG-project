let basicVert = `

uniform mat4 u_ModelTransform;
uniform mat4 u_ViewMatrix;
uniform mat4 u_ProjectionMatrix;

attribute vec3 a_Position;					 
attribute vec2 a_TexCoords;
varying vec2 v_TexCoords;
varying vec3 v_Position;					 

void main(void)										 
{							
    v_TexCoords = a_TexCoords;
    v_Position = a_Position;
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_ModelTransform * vec4(a_Position, 1.0); 
}`;
		
let basicFrag = `
precision highp float;

uniform sampler2D u_LeftHeadlightShadows;
uniform sampler2D u_Texture;

varying vec2 v_TexCoords;
varying vec3 v_Position;

void main(void)						
{		
    gl_FragColor = vec4(v_TexCoords, 0.0, 1.0);
    gl_FragColor = texture2D(u_LeftHeadlightShadows, v_TexCoords);
} `;