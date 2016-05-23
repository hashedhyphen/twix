import * as assert from 'power-assert';
import { getSignature } from '../src/signature';

import { config } from './resources/utils';

interface SignatureTest {
  desc: string,
  method: string,
  baseurl: string,
  params: Params,
  expected: string
}

// expected - an expected signature string (a value for `oauth_signature`).
const signatureTests: SignatureTest[] = [
  {
    desc: 'An official params exemplified at dev.twitter.com',
    method: 'POST',
    baseurl: 'https://api.twitter.com/1/statuses/update.json',
    params: {
      status: 'Hello Ladies + Gentlemen, a signed OAuth request!',
      include_entities: 'true',
      oauth_consumer_key: 'xvz1evFS4wEEPTGEFPHBog',
      oauth_nonce: 'kYjzVBB8Y0ZFabxSWbWovY3uYSQ2pTgmZeNu2VS4cg',
      oauth_signature_method: 'HMAC-SHA1',
      oauth_timestamp: '1318622958',
      oauth_token: '370773112-GmHxMAgYyLbNEtIKZeRNFsMKPR9EyMZeS9weJAEb',
      oauth_version: '1.0'
    },
    expected: 'tnnArxj06cWHq44gCs1OSKk/jLY='
  },
];

describe('Signature', () => {

  describe('getSignature()', () => {

    it('should return a signature string properly', () => {
      signatureTests.forEach(subtest => {
        assert.strictEqual(
          getSignature(config, subtest.method, subtest.baseurl, subtest.params),
          subtest.expected, subtest.desc);
      });
    });

  });

});
