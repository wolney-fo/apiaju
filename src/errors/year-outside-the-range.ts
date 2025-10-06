export class YearOutsideTheRange extends Error {
  constructor() {
    super("Year outside the range 1900 to 2199.");
  }
}
