/**
 * Returns a data URI for an SVG image representing a fractal noise texture.
 *
 * @param {number} baseFreq - The base frequency of the noise pattern.
 * @param {number} numOctaves - The number of octaves of the noise pattern.
 * @param {number} [seed=0] - An optional seed for the random noise generator.
 * @returns {string} - The data URI for the SVG image.
 */
export const createNoiseSVG = (baseFreq, numOctaves, seed = 0) =>
    `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='${baseFreq}' numOctaves='${numOctaves}' seed='${seed}' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`;
;