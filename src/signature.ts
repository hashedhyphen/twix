/**
 * @file Helper functions to create a signature.
 * See https://dev.twitter.com/oauth/overview/creating-signatures
 */

import * as crypto from 'crypto';
import * as qs from 'querystring';

import { percentEncode } from './utils';

/**
 * Return a value for the `oauth_signature` parameter.
 *
 * @param method - The HTTP method.
 * @param baseurl - The URL with protocol and host (without query or hash).
 * @param config - The object containing access tokens etc.
 * @param params - The object containing query/body/oauth_xxx key-value pairs
 *                 (each value is string).
 */
export function getSignature(config: TwixConfig, method: string,
                             baseurl: string, params: Params): string {
  const ps = getParameterString(params);
  const sbs = method.toUpperCase() + '&' + percentEncode(baseurl) + '&' +
              percentEncode(ps);

  const key = percentEncode(config.consumerSecret) + '&' +
              percentEncode(config.accessTokenSecret);

  return digestHmacSha1(sbs, key);
}

/**
 * Sort params by those key, then make a chunk such as 'key=value'.
 * Finally, join the chunks with '&' and return the result (parameter string).
 */
function getParameterString(params: Params): string {
  let chunks: string[] = [];

  for (let key of Object.keys(params).sort()) {
    const val = params[key];
    chunks.push(percentEncode(key) + '=' + percentEncode(val));
  }

  return chunks.join('&');
}

/**
 * Calculate a signature string of input with a given signing key.
 *
 * @param input - The signature base string (SBS).
 * @param key - The signing key.
 */
function digestHmacSha1(input: string, key: string): string {
  const hmac = crypto.createHmac('sha1', key);

  hmac.update(input);
  return hmac.digest('base64');
}
