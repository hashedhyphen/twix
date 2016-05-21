import * as assert from 'power-assert';
import Twix from '../src/twix';

import { config } from './resources/utils';

describe('initialization of Twix', () => {
  let twix: Twix;

  before(() => twix = new Twix(config));

  it('should have the same properties as the input', () => {
    assert.strictEqual(twix.config.consumerKey, config.consumerKey);
    assert.strictEqual(twix.config.consumerSecret, config.consumerSecret);
    assert.strictEqual(twix.config.accessToken, config.accessToken);
    assert.strictEqual(twix.config.accessTokenSecret, config.accessTokenSecret);
  });
});
