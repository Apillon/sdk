import { exceptionHandler } from '@apillon/sdk';

export function enumValues(enumType: any): string[] {
  return Object.values(enumType)
    .filter((value) => typeof value === 'number')
    .map((value) => value.toString());
}

export async function withErrorHandler(handler: () => Promise<any>) {
  try {
    await handler();
  } catch (err) {
    exceptionHandler(err);
  }
}
