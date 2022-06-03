let uniformVert = `

precision highp float;

uniform mat4 u_ViewProjection;
uniform mat4 u_ModelTransform;

attribute vec3 a_Position;
attribute vec2 a_TexCoords;

varying vec2 v_TexCoords;

void main()
{
    gl_Position = u_ViewProjection * u_ModelTransform * vec4(a_Position, 1.0);
    v_TexCoords = a_TexCoords;
}`;

let uniformFrag = `

precision highp float;

uniform sampler2D u_Texture;
uniform vec4 u_Color;

varying vec2 v_TexCoords;

void main() 
{
    vec2 texCoords = vec2(v_TexCoords.x, -v_TexCoords.y);
    gl_FragColor = texture2D(u_Texture, texCoords);
}`;