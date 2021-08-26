// Basic
varying vec2 vTextureCoord;
uniform vec4 filterArea;
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
uniform float waterSurfaceReflectivity;

// Water (Shallow)
uniform bool water;
uniform bool waterLengthLimit;
uniform float waterLength;
uniform vec4 waterColor;

// Utils
vec2 getPixelCoord(vec2 coordinates) {
    return coordinates * filterArea.xy + filterArea.zw;
}
vec2 getTextureCoord(vec2 coordinates) {
    return (coordinates - filterArea.zw) / filterArea.xy;
}
vec4 mixColors(vec4 color1, vec4 color2) {
    return vec4(mix(color1.rgb, color2.rgb, color1.a * color2.a), color1.a);
}

void main(void) {
    // filterArea.s = width
    // filterArea.t = height
    // filterArea.p = x
    // filterArea.q = y

    vec2 pixelCoord = getPixelCoord(vTextureCoord);
    vec4 textureColor = texture2D(uSampler, vTextureCoord);

    if ((!waterSurface && !water) || pixelCoord.y < waterLevel) {
        gl_FragColor = textureColor;
        return;
    }

    if (waterSurface && !(waterSurfaceLengthLimit && pixelCoord.y > (waterLevel + waterSurfaceLength))) {
        vec2 reflectionCoord = getTextureCoord(vec2(pixelCoord.x, 2.0 * waterLevel - pixelCoord.y));
        vec4 reflectionColor = texture2D(uSampler, reflectionCoord);

        vec4 color = mixColors(textureColor, waterSurfaceColor);

        gl_FragColor = mixColors(color, vec4(reflectionColor.rgb, waterSurfaceReflectivity));
        return;
    }

    if (water && !(waterLengthLimit && pixelCoord.y > (waterLevel + (waterSurfaceLengthLimit ? waterSurfaceLength : 0.0) + waterLength))) {
        gl_FragColor = mixColors(textureColor, waterColor);
        return;
    }

    gl_FragColor = textureColor;
    return;
}