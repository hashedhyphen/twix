/**
 * @file Helper functions to create a signature.
 * See https://dev.twitter.com/oauth/overview/creating-signatures
 */

'use strict';

import * as qs from 'querystring';

interface Params {
  [key: string]: string;
}

/*export function signature(method: string,
                          baseurl: string,
                          params: Params): string {

  const ps = getParameterString(params);

  const sbs = `${method.toUpperCase()}&${qs.escape(baseurl)}&${ps}`;

  const key = getSigningKey();

  const ss = getSignatureString();

  return ss;
}*/

/**
 * Sort params by those key, then make a chunk such as 'key=value'.
 * Finally, join the chunks with '&' and return the result (parameter string).
 *
 * @param {Params} params - The object contains query/body/oauth_xxx params
 *                          (each value is string).
 */
export function getParameterString(params: Params): string {
  let chunks: Array<string> = [];

  for (let key of Object.keys(params).sort()) {
    const val = params[key];
    chunks.push(`${qs.escape(key)}=${qs.escape(val)}`);
  }

  return chunks.join('&');
}