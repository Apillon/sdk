export function enumValues(enumType: any): string[] {
  return Object.values(enumType)
    .filter((value) => typeof value === 'number')
    .map((value) => value.toString());
}
