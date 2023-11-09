export class ApillonApiError extends Error {}
export class ApillonRequestError extends Error {}
export class ApillonNetworkError extends Error {}

/**
 * Convert value to boolean if defined, else return undefined.
 * @param value value converted
 */
export function toBoolean(value?: string) {
  if (value === undefined) {
    return undefined;
  }
  return value === 'true' || value === '1' || !!value;
}

/**
 * Convert value to integer if defined, else return undefined.
 * @param value value converted
 */
export function toInteger(value: string) {
  if (value === undefined) {
    return undefined;
  }

  return parseInt(value);
}

/**
 * Construct full URL from base URL and query parameters object.
 * @param url url without query parameters
 * @param parameters query parameters
 */
export function constructUrlWithQueryParams(url: string, parameters: object) {
  const cleanParams = {};
  for (const key in parameters) {
    const value = parameters[key];
    if (value != null && value !== '') {
      cleanParams[key] = value;
    }
  }
  const queryParams = new URLSearchParams(cleanParams).toString();

  return queryParams ? `${url}?${queryParams}` : url;
}

/**
 * Exception handler for requests sent by CLI service.
 * @param e exception
 */
export function exceptionHandler(e: any) {
  if (e instanceof ApillonApiError) {
    console.error(`Apillon API error:\n${e.message}`);
  } else if (e instanceof ApillonNetworkError) {
    console.error(`Error: ${e.message}`);
  } else {
    console.error(e);
  }
}
