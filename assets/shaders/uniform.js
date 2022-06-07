let uniformVert = `
precision highp float;

// Transform
uniform mat4 u_ViewMatrix;
uniform mat4 u_ProjectionMatrix;
uniform mat4 u_ModelTransform;
uniform mat4 u_LightMatrix;
uniform vec3 u_CameraPosition;

// Lighting
uniform vec4 u_Color;
uniform vec3 u_EnvLightDir;
uniform vec3 u_SpotLights[12];

attribute vec3 a_Position;
attribute vec2 a_TexCoords;
attribute vec3 a_Normal;
attribute vec3 a_Tangent;

varying vec2 v_TexCoords;
varying vec3 v_Normal;
varying vec3 v_FragPos;

varying vec3 v_ViewDir;
varying vec3 v_ViewDirTS;
varying vec3 v_LightDirTS;
varying vec3 v_SpotLightsTS[12];
varying vec4 v_DepthTexCoords;

void main()
{
    vec3 tangent = normalize(a_Tangent);
    vec3 bitangent = normalize(cross(a_Tangent, a_Normal));
    mat3 tangentSpace;

    tangentSpace[0] = tangent;
    tangentSpace[1] = bitangent;
    tangentSpace[2] = normalize(a_Normal);

    // Assign varyings
    v_TexCoords = a_TexCoords;
    v_FragPos = (u_ModelTransform * vec4(a_Position, 1.0)).xyz;
    v_Normal = a_Normal;
    v_ViewDir = normalize(u_CameraPosition - v_FragPos);
    v_ViewDirTS = tangentSpace * v_ViewDir;
    v_LightDirTS = tangentSpace * normalize(u_EnvLightDir);
    for (int i=0; i<12; i++) {
        v_SpotLightsTS[i] = tangentSpace * u_SpotLights[i];
    }
    v_DepthTexCoords = (u_LightMatrix *	u_ModelTransform * vec4(a_Position, 1.0)); 

    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_ModelTransform * vec4(a_Position, 1.0);
}`;

let uniformFrag = `
precision highp float;

// State
uniform int u_UseNormalMap;
uniform int u_UseParallaxMap;

// Texturing
uniform sampler2D u_Texture;
uniform sampler2D u_NormalMap;
uniform sampler2D u_ParallaxMap;
uniform float u_TilingFactor;

// Lighting
uniform vec3 u_AmbientLight;
uniform float u_SpecularStrength;
uniform vec3 u_SpotLights[12];
uniform vec3 u_EnvLightDir;

// Shadows
uniform sampler2D u_DepthSampler;
uniform vec2 u_ShadowmapSize;

varying vec2 v_TexCoords;
varying vec3 v_Normal;
varying vec3 v_FragPos;

varying vec3 v_ViewDir;
varying vec3 v_ViewDirTS;
varying vec3 v_LightDirTS;
varying vec3 v_SpotLightsTS[12];
varying vec4 v_DepthTexCoords;

vec3 phong(vec3 normal, vec3 viewDirection, vec3 lightDir, float attenuation)
{
    // Diffuse component
    float diff = max(dot(normalize(normal), lightDir), 0.0);
    vec3 diffuse = diff * vec3(1.0, 1.0, 1.0);

    // Specular component
    vec3 reflected = reflect(-lightDir, normalize(normal));
    float spec = pow(max(dot(v_ViewDirTS, reflected), 0.0), 4.0);
    vec3 specular = u_SpecularStrength * spec * vec3(1.0, 1.0, 1.0);

    return (u_AmbientLight + diffuse + specular) * attenuation;
}

float getAttenuation(float cosine) 
{
    float intensity = clamp((cosine - 0.05) / 0.75, 0.0, 1.0);
    if (cosine > 0.8) return 1.0;
    return clamp((cosine - 0.05) / 0.75, 0.0, 1.0);
}

void main() 
{
    vec2 texCoords = vec2(v_TexCoords.x, -v_TexCoords.y);
    vec4 texColor = texture2D(u_Texture, u_TilingFactor * texCoords);
    vec3 normal;
    float light_contr = 1.0;
    vec3 depthTexCoords = (v_DepthTexCoords / v_DepthTexCoords.w).xyz;
    float storedDepth;

    depthTexCoords = depthTexCoords * 0.5 + 0.5;

    if (u_UseNormalMap == 1)
        normal = normalize(texture2D(u_NormalMap, u_TilingFactor * texCoords).xyz);
    else if (u_UseParallaxMap == 1) {
        float h =  4.0 * ((texture2D(u_ParallaxMap, v_TexCoords).x));
        vec3 V = v_ViewDirTS;
        vec3 intVh = vec3(v_TexCoords,0.0) + (h / V.z) * V / 600.0;
        vec2 uprime = intVh.st;
        texColor = texture2D(u_Texture, uprime);
        normal = normalize(texture2D(u_NormalMap, uprime).xyz);
    }
    else {
        normal = v_Normal;
    }

    vec3 finalLight = phong(normal, v_ViewDirTS, normalize(v_LightDirTS), 1.0);
    for (int i=0; i<12; i++) {
        vec3 lightDir = normalize(vec3(0.0, -1.0, 0.0));
        vec3 toLight = normalize(u_SpotLights[i] - v_FragPos);
        float dotProduct = dot(toLight, -lightDir);
        finalLight += vec3(1.0, 1.0, 1.0) * getAttenuation(dotProduct);
    }

    for(float x=0.0; x<5.0; x+=1.0)
    {
        for(float y=0.0; y<5.0; y+=1.0)
        {
            storedDepth =  texture2D(u_DepthSampler, depthTexCoords.xy + vec2(-2.0 + x, -2.0 + y) / u_ShadowmapSize).x;
            if(storedDepth  < depthTexCoords.z || dot(normal, u_EnvLightDir) < 0.0)
                light_contr  -= 0.5/25.0;
        }
    }

    //gl_FragColor = texColor * vec4(finalLight * light_contr, 1.0);
    gl_FragColor = vec4(storedDepth, storedDepth, storedDepth, 1.0);
}`;