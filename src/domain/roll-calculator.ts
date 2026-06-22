export type RollMeasurement = {
  outerDiameter: number;
  coreDiameter: number;
  thickness: number;
  width: number;
};

export function calculateRollLength(input: RollMeasurement): number {
  const usableArea = Math.PI * (input.outerDiameter ** 2 - input.coreDiameter ** 2) / 4;
  return Number((usableArea / input.thickness).toFixed(4));
}
