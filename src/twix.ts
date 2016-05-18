'use strict';

interface TwixConfig {
  consumerKey: string;
  consumerSecret: string;
  accessToken: string;
  accessTokenSecret: string;
}

/**
 * Twix
 */
export default class Twix {
  constructor(public config: TwixConfig) {}
}
