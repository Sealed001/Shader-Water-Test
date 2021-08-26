import { Filter } from '@pixi/core';
import { hex2rgb, rgb2hex } from '@pixi/utils';

import fragment from './Water.frag';

var defaultsWaterFilterOptions = {
    time: 0,
    animationSpeed: 10,
    waterColor: [35 / 255, 75 / 255, 87 / 255, 0.3],
    waterReflectivity: 0.3,
    waterLevel: 1080 - 200
};

/**
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @param {object} [options] Options to use for filter.
 */
class WaterFilter extends Filter {
    constructor(waterFilterOptions) {
        super(Filter.defaultVertexSrc, fragment);
        this.uniforms.waterColor = new Float32Array(4);

        this.uniforms.filterCoord = new Float32Array(2);
        this.uniforms.filterSize = new Float32Array(2);

        Object.assign(this, defaultsWaterFilterOptions, waterFilterOptions);
    }

    apply(filterManager, input, output, clear) {
        this.time += 0.016; // Need to be changed for deltaTime

        this.uniforms.filterCoord[0] = filterManager.renderer.screen.x;
        this.uniforms.filterCoord[1] = filterManager.renderer.screen.y;

        this.uniforms.filterSize[0] = filterManager.renderer.screen.width;
        this.uniforms.filterSize[1] = filterManager.renderer.screen.height;

        filterManager.applyFilter(this, input, output, clear);
    }

    set waterLevel(value) {
        this.uniforms.waterLevel = value;
    }
    get waterLevel() {
        return this.uniforms.waterLevel;
    }

    set waterReflectivity(value) {
        this.uniforms.waterReflectivity = Math.min(Math.max(value, 0), 1);
    }
    get waterReflectivity() {
        return this.uniforms.waterReflectivity;
    }

    set waterColor(value) {
        for (let i = 0; i < 4; i++) {
            this.uniforms.waterColor[i] = Math.min(Math.max(value[i], 0), 1);
        }
    }
    get waterColor() {
        return [...this.uniforms.waterColor];
    }

    set time(value) {
        this.uniforms.time = value;
    }
    get time() {
        return this.uniforms.time;
    }

    set animationSpeed(value) {
        this.uniforms.animationSpeed = value;
    }
    get animationSpeed() {
        return this.uniforms.animationSpeed;
    }
}

export { WaterFilter }