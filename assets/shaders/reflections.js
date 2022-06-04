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
attribute vec3 a_Normal;
attribute vec3 a_Tangent;

varying vec3 v_Normal;
varying vec3 v_ViewDirection;
varying vec4 v_ShadingColor;
varying vec3 v_LightTS;
varying vec3 v_ViewTS;
varying vec3 v_Tangent; //debug

void main()
{
    // Convert light direction to view space
    vec3 lightDirVS = normalize((u_ViewMatrix * vec4(u_EnvLightDir, 0.0))).xyz;
    // Convert normal to view space
    vec3 normalVS = normalize(u_ViewMatrix * vec4(a_Normal, 0.0)).xyz;

    vec3 V = -normalize((u_ViewMatrix * vec4(a_Position, 1.0)).xyz);
    
    // Shading terms
    float L = max(dot(lightDirVS, normalVS), 0.0);
    vec3 R = -lightDirVS + 2.0 * dot(lightDirVS, normalVS) * normalVS;
    vec3 K = u_Color.xyz + vec3(0.0, 0.0, u_Color.z * 1.3);
    float specular = max(0.0, pow(dot(V, R), 5.0));

    // Compute tangent frame
    vec3 tangent = a_Tangent;
    vec3 bitangent = cross(a_Tangent, a_Normal);
    mat3 tangentFrame;
    tangentFrame[0] = normalize(a_Tangent);
    tangentFrame[1] = normalize(bitangent);
    tangentFrame[2] = normalize(a_Normal);

    // Compute light in tangent frame
    tangentFrame = mat3(
        vec3(tangentFrame[0].x, tangentFrame[1].x, tangentFrame[2].x),
        vec3(tangentFrame[0].y, tangentFrame[1].y, tangentFrame[2].y),
        vec3(tangentFrame[0].z, tangentFrame[1].z, tangentFrame[2].z));

    // Assign varyings
    // Final color
    v_ShadingColor = u_Color * vec4(L + K * specular, 1.0);
    v_LightTS = tangentFrame * u_EnvLightDir;
    v_ViewTS = tangentFrame * V;
    v_Normal = a_Normal;
    v_Tangent = a_Normal; //DEBUG

    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_ModelTransform * vec4(a_Position, 1.0);

    
}`;

let reflectionsFrag = `
precision highp float;

// Lighting
uniform vec3 u_EnvLightDir;

varying vec3 v_Normal;
varying vec3 v_ViewDirection;
varying vec4 v_ShadingColor;
varying vec3 v_LightTS;
varying vec3 v_ViewTS;
varying vec3 v_Tangent; //DEBUG

vec3 phong(vec3 color, vec3 lightDir, vec3 normal, vec3 view) {
    float NdotL = dot(lightDir, normal);
    float L_diffuse = max(NdotL, 0.0);

    vec3 R = -lightDir + 2.0 * dot(lightDir, normal) * normal;
    vec3 k_spec = color * vec3(1.1, 1.1, 1.1);
    float specular = pow(max(0.0, dot(view,R)), 2.0);

    return color * L_diffuse + ((NdotL > 0.0) ? 1.0 : 0.0) * k_spec * specular;
}

void main() 
{
    vec3 finalColor = phong(vec3(1.0, 1.0, 1.0), normalize(v_LightTS), v_Normal, v_ViewTS);
    gl_FragColor = vec4(finalColor, 1.0);
}`;