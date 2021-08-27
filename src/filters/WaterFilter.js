import { Filter } from '@pixi/core';

import fragment from './WaterFilter.frag';

var defaultsOptions = {
    animated: true,
    animationSpeed: 1,
    waterLevel: 1080 - 200,
    waterSurface: true,
    waterSurfaceLengthLimit: true,
    waterSurfaceLength: 80,
    waterSurfaceColor: [0.149, 0.839, 0.792, 0.2],
    waterSurfaceRayColor: [0.588, 0.619, 0.615, 0.5],
    waterSurfaceReflectivity: 0.3,
    water: false,
    waterLengthLimit: false,
    waterLength: 80,
    waterColor: [0.05, 0.349, 0.666, 0.2],
    pixelSize: 5,
};

/**
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @param {object} [options] Options to use for filter.
 */
class WaterFilter extends Filter {
    constructor(options) {
        super(Filter.defaultVertexSrc, fragment);

        // Colors
        this.uniforms.waterSurfaceColor = new Float32Array(4);
        this.uniforms.waterSurfaceRayColor = new Float32Array(4);
        this.uniforms.waterColor = new Float32Array(4);

        // Camera
        this.uniforms.cameraCoord = new Float32Array(2);

        // Pixelization
        this.uniforms.pixelSize = new Float32Array(2);

        // Animation
        this.time = 0;

        // Options
        Object.assign(this, defaultsOptions, options);
    }

    apply(filterManager, input, output, clear) {
        filterManager.applyFilter(this, input, output, clear);
    }

    get time() {
        return this.uniforms.time;
    }
    set time(value) {
        this.uniforms.time = value;
    }

    get animated() {
        return this.uniforms.animated;
    }
    set animated(value) {
        this.uniforms.animated = value;
    }

    get animationSpeed() {
        return this.uniforms.animationSpeed;
    }
    set animationSpeed(value) {
        this.uniforms.animationSpeed = value;
    }

    get waterLevel() {
        return this.uniforms.waterLevel;
    }
    set waterLevel(value) {
        this.uniforms.waterLevel = value;
    }

    get waterSurface() {
        return this.uniforms.waterSurface;
    }
    set waterSurface(value) {
        this.uniforms.waterSurface = value;
    }

    get waterSurfaceLengthLimit() {
        return this.uniforms.waterSurfaceLengthLimit;
    }
    set waterSurfaceLengthLimit(value) {
        this.uniforms.waterSurfaceLengthLimit = value;
    }

    get waterSurfaceLength() {
        return this.uniforms.waterSurfaceLength;
    }
    set waterSurfaceLength(value) {
        this.uniforms.waterSurfaceLength = Math.abs(value);
    }

    get waterSurfaceColor() {
        return [...this.uniforms.waterSurfaceColor];
    }
    set waterSurfaceColor(value) {
        for (let i = 0; i < 4; i++) {
            this.uniforms.waterSurfaceColor[i] = Math.min(Math.max(value[i], 0), 1);
        }
    }

    get waterSurfaceRayColor() {
        return [...this.uniforms.waterSurfaceRayColor];
    }
    set waterSurfaceRayColor(value) {
        for (let i = 0; i < 4; i++) {
            this.uniforms.waterSurfaceRayColor[i] = Math.min(Math.max(value[i], 0), 1);
        }
    }

    get waterSurfaceReflectivity() {
        return this.uniforms.waterSurfaceReflectivity;
    }
    set waterSurfaceReflectivity(value) {
        this.uniforms.waterSurfaceReflectivity = Math.min(Math.max(value, 0), 1);
    }

    get water() {
        return this.uniforms.water;
    }
    set water(value) {
        this.uniforms.water = value;
    }

    get waterLengthLimit() {
        return this.uniforms.waterLengthLimit;
    }
    set waterLengthLimit(value) {
        this.uniforms.waterLengthLimit = value;
    }

    get waterLength() {
        return this.uniforms.waterLength;
    }
    set waterLength(value) {
        this.uniforms.waterLength = Math.abs(value);
    }

    get waterColor() {
        return [...this.uniforms.waterColor];
    }
    set waterColor(value) {
        for (let i = 0; i < 4; i++) {
            this.uniforms.waterColor[i] = Math.min(Math.max(value[i], 0), 1);
        }
    }

    get pixelSize() {
        return this.uniforms.pixelSize[0];
    }
    set pixelSize(value) {
        this.uniforms.pixelSize[0] = Math.abs(value);
        this.uniforms.pixelSize[1] = Math.abs(value);
    }

    get cameraCoord() {
        return [...this.uniforms.cameraCoord];
    }
    set cameraCoord(value) {
        this.uniforms.pixelSize[0] = value[0];
        this.uniforms.pixelSize[1] = value[1];
    }
}

export default WaterFilter;