import * as https from 'https';
import * as qs from 'querystring';

import {
  getSignature
} from './signature';

import {
  percentEncode,
  getNonce,
  getAuthValue,
  getEpoch
} from './utils';

const HOSTNAME = 'api.twitter.com';
const API_VERSION = '1.1';

/**
 * Send a GET request to a given target.
 *
 * @param target - i.e. 'statuses/update'
 * @param queryParams - The query parameters (i.e. { include_entities: true }).
 * @param bodyParams - The body parameters (i.e. { status: 'Hello!' }).
 */
export function get(config: TwixConfig, target: string, queryParams: Params,
                    bodyParams: Params): Promise<Response> {
  return fetch(config, 'GET', target, queryParams, bodyParams);
}

/**
 * Send a POST request to a given target.
 *
 * @param target - i.e. 'statuses/update'
 * @param queryParams - i.e. { include_entities: true }
 * @param bodyParams - i.e. { status: 'Hello!' }
 */
export function post(config: TwixConfig, target: string, queryParams: Params,
                     bodyParams: Params): Promise<Response> {
  return fetch(config, 'POST', target, queryParams, bodyParams);
}

/**
 * Handle network connections.
 *
 * @param method - The HTTP method.
 */
function fetch(config: TwixConfig, method: string, target: string,
               queryParams: Params, bodyParams: Params): Promise<Response> {
  // `let` means `oauth_signature` will be added afterward
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

  const baseurl  = `https://${HOSTNAME}/${API_VERSION}/${target}.json`;

  const signature = getSignature(config, method, baseurl, paramsSet);
  oauthParams['oauth_signature'] = signature;

  const queryStr = qs.stringify(queryParams);
  const searchStr = queryStr === '' ? ''
                                    : `?${queryStr}`;

  const options = {
    hostname: HOSTNAME,
    method: method,
    path: `/${API_VERSION}/${target}.json${searchStr}`,
    headers: {
      'User-Agent': 'Twix',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': getAuthValue(oauthParams)
    }
  };

  return new Promise((resolve: Resolver<Response>, reject: Rejector) => {
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