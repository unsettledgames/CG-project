let reflectionsVert = `

precision highp float;

uniform mat4 u_ViewProjection;
uniform mat4 u_ModelTransform;

attribute vec3 a_Position;

void main()
{
    gl_Position = u_ViewProjection * u_ModelTransform * vec4(a_Position, 1.0);
}`;

let reflectionsFrag = `

precision highp float;
uniform vec4 u_Color;

void main() 
{
    gl_FragColor = vec4(1.0,1.0,1.0,1.0);
}`;