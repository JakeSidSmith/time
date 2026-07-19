export const getRadiansFromDegrees = (degrees: number): number => {
  return (degrees * Math.PI) / 180;
};

export const getDegreesFromRadians = (radians: number): number => {
  return (radians * 180) / Math.PI;
};

export const getSecondsFromMidnight = (date: Date) =>
  date.getHours() * 60 * 60 + date.getMinutes() * 60 + date.getSeconds();

export const getTimeString = (date: Date) =>
  `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;

const MATCHES_CAMEL = /(^|[A-Z])[a-z]+/g;

export const getTitleCaseFromCamelCase = (camelCase: string) =>
  camelCase
    .replace(
      MATCHES_CAMEL,
      (match) =>
        `${match.charAt(0).toUpperCase()}${match.substring(1).toLowerCase()} `
    )
    .trim();
