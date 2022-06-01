let uniformVert = `

uniform mat4 u_ViewProjection;

attribute vec3 a_Position;

void main()
{
    gl_Position = u_ViewProjection * vec4(a_Position, 1.0);
}`;

let uniformFrag = `

uniform sampler2D u_Texture;
uniform vec4 u_Color;

attribute vec2 a_TexCoords;

void main() 
{
    gl_FragColor = texture(u_Texture, a_TexCoords) * u_Color;
}`;