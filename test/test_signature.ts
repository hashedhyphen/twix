import * as assert from 'power-assert';
import { getParameterString } from '../src/signature';

import { paramsTests } from './resources/params';

describe('Signature', () => {

  describe('getParameterString()', () => {

    it('should return a parameter string properly', () => {
      paramsTests.forEach(subtest => {
        assert.strictEqual(getParameterString(subtest.params),
                           subtest.expected, subtest.desc);
      });
    });

  });
});
