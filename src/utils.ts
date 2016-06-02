import * as crypto from 'crypto';
import * as qs from 'querystring';

/**
 * A Percent encoder conformant to RFC 3986.
 * Encode ! ' ( ) * and charcters for which querystring.escape is responsible
 */
export function percentEncode(input: string): string {
  return qs.escape(input)
           .replace(/[!'()*]/g, c => `%${c.charCodeAt(0).toString(16)}`);
}

/**
 * Generate a nonce for `oauth_nonce`.
 */
export function getNonce(): string {
  const str = crypto.randomBytes(32).toString('base64');

  // strip non-word characters
  return str.replace(/[^A-Za-z0-9]/g, '');
}

/**
 * Return epoch time in second.
 */
export function getEpoch(): string {
  // Date.now() returns a millisec value, so need to convert.
  const second = Math.floor(Date.now() / 1000);

  return second.toString();
}

/**
 * Generate a value for Authorization HTTP header.
 * Make a chunk such as 'key="value"', then concat them with ', '.
 */
export function getAuthValue(oauthParams: Params): string {
  let chunks: string[] = [];

  for (let key in oauthParams) {
    const val = oauthParams[key];
    chunks.push(`${percentEncode(key)}="${percentEncode(val)}"`);
  }

  return `OAuth ${chunks.join(', ')}`;
}