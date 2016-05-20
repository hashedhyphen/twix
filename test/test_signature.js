'use strict';

const assert = require('power-assert');
const getParameterString = require('../build/signature').getParameterString;

const paramsTests = require('./resources/params').paramsTests;

describe('Signature', function() {

  describe('getParameterString()', function() {

    it('should return a parameter string properly', function() {
      paramsTests.forEach(subtest => {
        assert.strictEqual(getParameterString(subtest.params),
                           subtest.expected,
                           subtest.desc);
      });
    });

  });
});
