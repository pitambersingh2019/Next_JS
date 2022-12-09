// create a 'rem' value from a provided 'px'
const pxToRem = (pixels: number): string => `${(pixels / 10).toString()}rem`;

export default pxToRem;
