export function numberBand(lower: number, upper: number, number: number) {
  if (number > upper) {
    return upper;
  } else if (number < lower) {
    return lower;
  }

  return number;
}
