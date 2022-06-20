let reflectionsVert = `
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
    // Final color
    v_TexCoords = a_TexCoords;
    v_FragPos = (u_ModelTransform * vec4(a_Position, 1.0)).xyz;
    v_Normal = (u_ModelTransform * normalize(vec4(a_Normal, 0.0))).xyz;
    
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_ModelTransform * vec4(a_Position, 1.0);    
}`;

let reflectionsFrag = `
precision highp float;

// Lighting
uniform vec3 u_CameraPosition;
uniform vec3 u_EnvLightDir;
uniform vec3 u_AmbientLight;
uniform float u_SpecularStrength;
uniform vec3 u_LightColor;

uniform mat4 u_ViewMatrix;
uniform mat4 u_InverseView;
uniform samplerCube u_ReflectionMap;
uniform mat4 u_ModelTransform;

varying vec2 v_TexCoords;
varying vec3 v_Normal;
varying vec3 v_FragPos;

void main() 
{
    // POLISH: change light colour (the vec3(1.0, 1.0, 1.0) for day / night cycle

    vec2 texCoords = vec2(v_TexCoords.x, -v_TexCoords.y);
    vec4 texColor = vec4(1.0, 1.0, 1.0, 1.0);

    vec3 viewDirection = normalize(u_CameraPosition - v_FragPos);

    // Diffuse component
    vec3 lightDir = normalize(u_EnvLightDir);
    float diff = max(dot(normalize(v_Normal), lightDir), 0.0);
    vec3 diffuse = diff * vec3(1.0, 1.0, 1.0);

    // Specular component
    vec3 reflected = reflect(-lightDir, normalize(v_Normal));
    float spec = pow(max(dot(viewDirection, reflected), 0.0), 32.0);
    vec3 specular = u_SpecularStrength * spec * vec3(1.0, 1.0, 1.0);

    reflected = vec3(spec, spec, spec);

    vec3 ReflectedRay = normalize(vec4(reflect(-viewDirection, normalize(v_Normal)),0.0).xyz);
    vec3 ReflectedColor = textureCube(u_ReflectionMap, ReflectedRay).xyz;	

    gl_FragColor =  vec4(ReflectedColor, 1.0) * 0.2 + texColor * vec4(u_LightColor * (u_AmbientLight + diffuse + specular), 1.0);
}`;