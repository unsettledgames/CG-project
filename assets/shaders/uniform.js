let uniformVert = `
precision highp float;

// Transform
uniform mat4 u_ViewMatrix;
uniform mat4 u_ProjectionMatrix;
uniform mat4 u_ModelTransform;

// Lighting
uniform vec4 u_Color;
uniform vec3 u_EnvLightDir;

attribute vec3 a_Position;
attribute vec2 a_TexCoords;
attribute vec3 a_Normal;
attribute vec3 a_Tangent;

varying vec2 v_TexCoords;
varying vec3 v_Normal;
varying vec3 v_FragPos;

void main()
{
    // Assign varyings
    v_TexCoords = a_TexCoords;
    v_FragPos = (u_ModelTransform * vec4(a_Position, 1.0)).xyz;
    v_Normal = a_Normal;

    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_ModelTransform * vec4(a_Position, 1.0);

    
}`;

let uniformFrag = `
precision highp float;

// State
uniform int u_UseNormalMap;

// Texturing
uniform sampler2D u_Texture;
uniform sampler2D u_NormalMap;
uniform float u_TilingFactor;

// Lighting
uniform vec3 u_CameraPosition;
uniform vec3 u_EnvLightDir;
uniform vec3 u_AmbientLight;
uniform float u_SpecularStrength;

varying vec2 v_TexCoords;
varying vec3 v_Normal;
varying vec3 v_FragPos;

void main() 
{
    vec2 texCoords = vec2(v_TexCoords.x, -v_TexCoords.y);
    vec4 texColor = texture2D(u_Texture, u_TilingFactor * texCoords);

    vec3 viewDirection = normalize(u_CameraPosition - v_FragPos);

    vec3 normal;
    if (u_UseNormalMap == 1)
        normal = normalize(texture2D(u_NormalMap, u_TilingFactor * texCoords).xyz);
    else
        normal = v_Normal;

    // Diffuse component
    vec3 lightDir = normalize(u_EnvLightDir);
    float diff = max(dot(normalize(normal), lightDir), 0.0);
    vec3 diffuse = diff * vec3(1.0, 1.0, 1.0);

    // Specular component
    vec3 reflected = reflect(-lightDir, normalize(normal));
    float spec = pow(max(dot(viewDirection, reflected), 0.0), 4.0);
    vec3 specular = u_SpecularStrength * spec * vec3(1.0, 1.0, 1.0);

    reflected = vec3(spec, spec, spec);

    gl_FragColor = texColor * vec4(u_AmbientLight + diffuse + specular, 1.0);
}`;