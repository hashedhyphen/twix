import * as qs from 'querystring';

/**
 * A Percent encoder conformant to RFC 3986.
 * Encode ! ' ( ) * and charcters for which querystring.escape is responsible
 */
export function percentEncode(input: string): string {
  return qs.escape(input)
           .replace(/[!'()*]/g, c => `%${c.charCodeAt(0).toString(16)}`);
}
