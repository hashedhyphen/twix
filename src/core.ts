import * as crypto from 'crypto';
import * as https from 'https';
import * as qs from 'querystring';
import * as url from 'url';

import { getSignature } from './signature';
import { percentEncode } from './utils';

/**
 * Post given parameters to a given target.
 *
 * @param target - i.e. 'statuses/update'
 */
export function post(config: TwixConfig, target: string, queryParams: Params,
                     bodyParams: Params): Promise<Response> {
  const baseurl  = `https://api.twitter.com/1.1/${target}.json`;
  const queryStr = qs.stringify(queryParams);

  const endpoint = queryStr === '' ? baseurl
                                   : `${baseurl}?${queryStr}`;

  let oauthParams: Params = {
    oauth_consumer_key: config.consumerKey,
    oauth_nonce: getNonce(),
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp: getEpoch(),
    oauth_token: config.accessToken,
    oauth_version: '1.0'
  };

  // merge 3 sets of parameters
  const paramsSet: Params =
    Object.assign({}, oauthParams, queryParams, bodyParams);

  const signature = getSignature(config, 'POST', baseurl, paramsSet);
  oauthParams['oauth_signature'] = signature;

  const authValue = getAuthValue(oauthParams);

  return fetch('POST', endpoint, authValue, bodyParams);
}

/**
 * Generate a nonce for `oauth_nonce`.
 */
function getNonce(): string {
  const str = crypto.randomBytes(32).toString('base64');

  // strip non-word characters
  return str.replace(/[^A-Za-z0-9]/g, '');
}

/**
 * Return epoch time in second.
 */
function getEpoch(): string {
  // Date.now() returns a millisec value, so need to convert.
  const second = Math.floor(Date.now() / 1000);

  return second.toString();
}

/**
 * Generate a value for Authorization HTTP header.
 * Make a chunk such as 'key="value"', then concat them with ', '.
 */
function getAuthValue(oauthParams: Params): string {
  let chunks: string[] = [];

  for (let key in oauthParams) {
    const val = oauthParams[key];
    chunks.push(`${percentEncode(key)}="${percentEncode(val)}"`);
  }

  return `OAuth ${chunks.join(', ')}`;
}

/**
 * Handle network connections.
 *
 * @param method - The HTTP method.
 * @param endpoint - The URL from protocol to query parameters.
 * @param authValue - The value for Authorization HTTP header.
 * @param bodyParams - The body parameters.
 */
function fetch(method: string, endpoint: string, authValue: string,
               bodyParams: Params): Promise<Response> {
  const { hostname, path } = url.parse(endpoint);

  const options = {
    hostname,
    method,
    path,
    headers: {
      'User-Agent': 'Twix',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': authValue
    }
  };

  return new Promise<Response>(
    (resolve: Resolver<Response>, reject: Rejector) => {

    const req = https.request(options, res => {
      res.setEncoding('utf8');

      let buffer = '';
      res.on('data', (chunk: string) => buffer += chunk);

      res.on('end', () => resolve(JSON.parse(buffer)));
    });

    req.on('error', (err: Error) => reject(err));

    req.write(qs.stringify(bodyParams));
    req.end();
  });
}