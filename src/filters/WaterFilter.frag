// Basic
varying vec2 vTextureCoord;
//uniform vec4 filterArea;
uniform sampler2D uSampler;

// Animation
uniform float time;
uniform bool animated;
uniform float animationSpeed;

// Water
uniform float waterLevel;

// Water Surface
uniform bool waterSurface;
uniform bool waterSurfaceLengthLimit;
uniform float waterSurfaceLength;
uniform vec4 waterSurfaceColor;
uniform vec4 waterSurfaceRayColor;
uniform float waterSurfaceReflectivity;

// Water (Shallow)
uniform bool water;
uniform bool waterLengthLimit;
uniform float waterLength;
uniform vec4 waterColor;

// Pixelization
uniform vec2 pixelSize;

vec4 filterArea = vec4(1920, 1080, 0, 0);

// Utils

vec2 getTextureCoord(vec2 coordinates) {
    return (coordinates - filterArea.zw) / filterArea.xy;
}

vec4 mixColors(vec4 color1, vec4 color2) {
    return vec4(mix(color1.rgb, color2.rgb, color1.a * color2.a), color1.a);
}

float random(vec2 co) {
    return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
}

void main(void) {
    // filterArea.s = width
    // filterArea.t = height
    // filterArea.p = x
    // filterArea.q = y

    vec4 textureColor = texture2D(uSampler, vTextureCoord);

    vec2 pixelCoordinates = vTextureCoord * filterArea.xy + filterArea.zw;
    vec2 bigPixelCoordinates = floor(pixelCoordinates / pixelSize) * pixelSize;

    if ((!waterSurface && !water) || pixelCoordinates.y < waterLevel) {
        gl_FragColor = textureColor;
        return;
    }

    if (waterSurface && !(waterSurfaceLengthLimit && pixelCoordinates.y > (waterLevel + waterSurfaceLength))) {
        vec2 textureReflectionCoordinates = (vec2(bigPixelCoordinates.x, 2.0 * waterLevel - bigPixelCoordinates.y) - filterArea.zw) / filterArea.xy;
        vec4 reflectionColor = texture2D(uSampler, textureReflectionCoordinates);

        vec4 color = mixColors(textureColor, waterSurfaceColor);

        float lengthRay = floor(random(bigPixelCoordinates) * 5.0);
        bool rayChecked = false;

        for(float i = 0.0; i < 6.0; i += 1.0)
        {
            if (i > lengthRay) {
                break;
            }

            if (random(vec2(bigPixelCoordinates.x - i * pixelSize.x, bigPixelCoordinates.y)) > 0.99) {
                rayChecked = true;
            }
        }

        if (rayChecked) {
            color = mixColors(color, waterSurfaceRayColor);
        }

        color = mixColors(color, vec4(reflectionColor.rgb, waterSurfaceReflectivity));

        gl_FragColor = color;
        return;
    }

    if (water && !(waterLengthLimit && pixelCoordinates.y > (waterLevel + (waterSurfaceLengthLimit ? waterSurfaceLength : 0.0) + waterLength))) {
        gl_FragColor = mixColors(textureColor, waterColor);
        return;
    }

    gl_FragColor = textureColor;
    return;
}