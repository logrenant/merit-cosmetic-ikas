const unit = "px";

export const point = {
  xs: 480, 
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  xxl: 1536,
};

const breakpointValues = {
  xs: point.xs + unit,
  sm: point.sm + unit,
  md: point.md + unit,
  lg: point.lg + unit,
  xl: point.xl + unit,
  xxl: point.xxl + unit,
};

export const sliderBreakpoints = {
  xs: `(min-width: ${point.xs}${unit})`,
  sm: `(min-width: ${point.sm}${unit})`,
  md: `(min-width: ${point.md}${unit})`,
  lg: `(min-width: ${point.lg}${unit})`,
  xl: `(min-width: ${point.xl}${unit})`,
};

export default breakpointValues;