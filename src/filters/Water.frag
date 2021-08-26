// Default
varying vec2 vTextureCoord;
uniform sampler2D uSampler;

// Engine
uniform vec2 filterSize;
uniform vec2 filterCoord;

uniform float time;
uniform float animationSpeed;
uniform vec4 waterColor;
uniform float waterReflectivity;
uniform float waterLevel;

vec2 getPixelCoord(vec2 coordinates) {
    return coordinates * filterSize + filterCoord;
}

vec2 getTextureCoord(vec2 coordinates) {
    return (coordinates - filterCoord) / filterSize;
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
    
    if (pixelCoord.y >= waterLevel) {
        gl_FragColor = mixColors(textureColor, waterColor);
        float distanceFromWaterLevel = pixelCoord.y - waterLevel;
        float distortionX = sin(time * animationSpeed / distanceFromWaterLevel * 25.) * log(distanceFromWaterLevel + 250.0);
        vec2 reflectionCoord = getTextureCoord(vec2(pixelCoord.x + distortionX, waterLevel - distanceFromWaterLevel));
        vec4 reflectionColor = texture2D(uSampler, reflectionCoord);
        gl_FragColor = mixColors(gl_FragColor, vec4(reflectionColor.rgb, waterReflectivity));
        return;
    } else {
        gl_FragColor = textureColor;
        return;
    }
}