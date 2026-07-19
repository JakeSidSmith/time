export const getRadiansFromDegrees = (degrees: number): number => {
  return (degrees * Math.PI) / 180;
};

export const getDegreesFromRadians = (radians: number): number => {
  return (radians * 180) / Math.PI;
};
