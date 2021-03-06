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
varying vec3 v_Tangent;

varying vec3 v_ViewDir;
varying vec3 v_ViewDirTS;
varying vec3 v_LightDirTS;
varying vec3 v_SpotLightsTS[12];
varying vec4 v_FragmentLightSpace;

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
    v_Tangent = normalize(a_Tangent);
    v_ViewDir = normalize(u_CameraPosition - v_FragPos);
    v_ViewDirTS = tangentSpace * v_ViewDir;
    v_LightDirTS = tangentSpace * normalize(u_EnvLightDir);
    for (int i=0; i<12; i++) {
        v_SpotLightsTS[i] = tangentSpace * u_SpotLights[i];
    }
    v_FragmentLightSpace = (u_LightMatrix *	u_ModelTransform * vec4(a_Position, 1.0)); 

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
uniform vec3 u_AmbientLight;
uniform float u_SpecularStrength;
uniform vec3 u_SpotLights[12];
uniform vec3 u_EnvLightDir;
uniform vec3 u_LightColor;

// Headlights
uniform mat4 u_HeadlightProj;
uniform mat4 u_LeftHeadlightView;
uniform mat4 u_RightHeadlightView;
uniform sampler2D u_HeadlightTexture;
uniform sampler2D u_LeftHeadlightShadows;
uniform sampler2D u_RightHeadlightShadows;

// Shadows
uniform sampler2D u_DepthSampler;
uniform vec2 u_ShadowmapSize;

varying vec2 v_TexCoords;
varying vec3 v_Normal;
varying vec3 v_FragPos;
varying vec3 v_Tangent;

varying vec3 v_ViewDir;
varying vec3 v_ViewDirTS;
varying vec3 v_LightDirTS;
varying vec3 v_SpotLightsTS[12];
varying vec4 v_FragmentLightSpace;

vec3 phong(vec3 normal, vec3 viewDirection, vec3 lightDir, float attenuation)
{
    // Diffuse component
    float diff = max(dot(normal, lightDir), 0.0);
    vec3 diffuse = diff * vec3(1.0, 1.0, 1.0);

    // Specular component
    vec3 reflected = reflect(-lightDir, normal);
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
    vec3 normal = normalize(v_Normal);
    float light_contr = 1.0;
    vec3 depthTexCoords = (v_FragmentLightSpace.xyz / v_FragmentLightSpace.w) * 0.5 + 0.5;
    float storedDepth;
    
    normal = texture2D(u_NormalMap, u_TilingFactor * texCoords).xyz * 2.0 - 1.0;

    // LIGHTING
    vec3 finalLight = phong(normal, v_ViewDirTS, v_LightDirTS, 1.0);
    vec3 spotLights = vec3(0.0);
    for (int i=0; i<12; i++) {
        vec3 lightDir = normalize(vec3(0.0, -1.0, 0.0));
        vec3 toLight = normalize(u_SpotLights[i] - v_FragPos);
        float dotProduct = dot(toLight, -lightDir);
        spotLights += vec3(1.0, 1.0, 1.0) * getAttenuation(dotProduct);
    }

    // SHADOWS
    for(float x=0.0; x<5.0; x+=1.0)
    {
        for(float y=0.0; y<5.0; y+=1.0)
        {
            storedDepth =  texture2D(u_DepthSampler, depthTexCoords.xy + vec2(-2.0 + x, -2.0 + y) / u_ShadowmapSize).x;
            if(storedDepth < depthTexCoords.z - 0.005 && dot(normal, normalize(v_LightDirTS)) > 0.2)
                light_contr  -= 0.6/25.0;
        }
    }

    // HEADLIGHTS
    vec4 headlightLeftTexCoords = u_HeadlightProj * u_LeftHeadlightView * vec4(v_FragPos, 1.0);
    vec4 headlightRightTexCoords = u_HeadlightProj * u_RightHeadlightView * vec4(v_FragPos, 1.0);

    headlightLeftTexCoords = (headlightLeftTexCoords / headlightLeftTexCoords.w) * 0.5 + 0.5;
    headlightRightTexCoords = (headlightRightTexCoords / headlightRightTexCoords.w) * 0.5 + 0.5;

    vec4 rightHeadlightCol, leftHeadlightCol; 

    float slopeDependentBias = clamp(0.01 * tan(acos(dot(v_Normal, u_EnvLightDir))), 0.01, 0.01);

    if (headlightRightTexCoords.x >= 0.0 && headlightRightTexCoords.x <= 1.0 
        && headlightRightTexCoords.y >= 0.0 && headlightRightTexCoords.y <= 1.0
        && headlightRightTexCoords.z >= 0.0 && headlightRightTexCoords.z <= 1.0)
    {
        storedDepth = texture2D(u_RightHeadlightShadows, headlightRightTexCoords.xy).x;
        if (storedDepth > headlightRightTexCoords.z - slopeDependentBias)
            rightHeadlightCol = texture2D(u_HeadlightTexture, headlightRightTexCoords.xy);
    }

    if (headlightLeftTexCoords.x >= 0.0 && headlightLeftTexCoords.x <= 1.0 
        && headlightLeftTexCoords.y >= 0.0 && headlightLeftTexCoords.y <= 1.0
        && headlightLeftTexCoords.z >= 0.0 && headlightLeftTexCoords.z <= 1.0)
    {
        storedDepth = texture2D(u_LeftHeadlightShadows, headlightLeftTexCoords.xy).x;
        if (storedDepth > headlightLeftTexCoords.z - slopeDependentBias)
            leftHeadlightCol = texture2D(u_HeadlightTexture, headlightLeftTexCoords.xy);
    }

    gl_FragColor = texColor * vec4(u_LightColor * finalLight * light_contr + spotLights +  ((rightHeadlightCol.rgb * rightHeadlightCol.a) + (leftHeadlightCol.rgb * leftHeadlightCol.a)), 1.0);
    //gl_FragColor = vec4(storedDepth, storedDepth, storedDepth, 1.0);
}`;