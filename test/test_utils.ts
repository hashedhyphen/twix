import * as assert from 'power-assert';

import {
  getAuthValue,
  getEpoch,
  getNonce,
  percentEncode
} from '../src/utils';

interface GetAuthValueTest {
  desc: string;
  oauthParams: Params;
  expected: string;
}

describe('Utils', () => {

  describe('getAuthValue()', () => {
    const getAuthValueTests: GetAuthValueTest[] = [
      {
        desc: 'example values provided by dev.twitter.com',
        oauthParams: {
          oauth_consumer_key: 'xvz1evFS4wEEPTGEFPHBog',
          oauth_nonce: 'kYjzVBB8Y0ZFabxSWbWovY3uYSQ2pTgmZeNu2VS4cg',
          oauth_signature: 'tnnArxj06cWHq44gCs1OSKk/jLY=',
          oauth_signature_method: 'HMAC-SHA1',
          oauth_timestamp: '1318622958',
          oauth_token: '370773112-GmHxMAgYyLbNEtIKZeRNFsMKPR9EyMZeS9weJAEb',
          oauth_version: '1.0'
        },
        expected: 'OAuth oauth_consumer_key="xvz1evFS4wEEPTGEFPHBog", oauth_nonce="kYjzVBB8Y0ZFabxSWbWovY3uYSQ2pTgmZeNu2VS4cg", oauth_signature="tnnArxj06cWHq44gCs1OSKk%2FjLY%3D", oauth_signature_method="HMAC-SHA1", oauth_timestamp="1318622958", oauth_token="370773112-GmHxMAgYyLbNEtIKZeRNFsMKPR9EyMZeS9weJAEb", oauth_version="1.0"'
      },
    ];

    it('should return a value suitable for Authorization header', () => {
      getAuthValueTests.forEach((subtest) => {
        assert.strictEqual(getAuthValue(subtest.oauthParams), subtest.expected,
                           subtest.desc);
      });
    })
  });

  describe('getEpoch()', () => {
    it('should be a string representing an integer', () => {
      assert.ok(/^[0-9]+$/.test(getEpoch()));
    });
  });

  describe('getNonce()', () => {
    it('should have only word characters', () => {
      assert.ok(/^[A-Za-z0-9]+$/.test(getNonce()));
    });
  });

  describe('percentEncode()', () => {
    const percentEncodeTests = [
      {
        desc: 'string with space and +',
        input: 'Ladies + Gentlemen',
        expected: 'Ladies%20%2B%20Gentlemen'
      },
      {
        desc: 'string with !',
        input: 'An encoded string!',
        expected: 'An%20encoded%20string%21'
      },
      {
        desc: 'string with , and &',
        input: 'Dogs, Cats & Mice',
        expected: 'Dogs%2C%20Cats%20%26%20Mice'
      },
      {
        desc: 'emoji',
        input: '☃',
        expected: '%E2%98%83'
      },
    ];

    it('should return a percent encoded string conformant to RFC3986', () => {
      percentEncodeTests.forEach((subtest) => {
        assert.strictEqual(percentEncode(subtest.input), subtest.expected,
                           subtest.desc);
      });
    });
  });

});