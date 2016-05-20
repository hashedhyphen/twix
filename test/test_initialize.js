'use strict';

const assert = require('power-assert');
const Twix = require('../build/twix').default;

const config = require('./resources/utils').config;

describe('initialization of Twix', function() {
  let twix = null;

  before(function() {
    twix = new Twix(config);
  });

  after(function() {
    twix = null;
  });

  it('should be `Twix`', function() {
    assert.ok(twix instanceof Twix);
  });

  it('should have the same properties as the input', function() {
    assert.strictEqual(twix.config.consumerKey, config.consumerKey);
    assert.strictEqual(twix.config.consumerSecret, config.consumerSecret);
    assert.strictEqual(twix.config.accessToken, config.accessToken);
    assert.strictEqual(twix.config.accessTokenSecret, config.accessTokenSecret);
  });
});
