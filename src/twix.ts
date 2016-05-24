import { post } from './core';

/**
 * Twix
 */
export default class Twix {
  constructor(public config: TwixConfig) {}

  tweet(message: string): Promise<Response> {
    const bodyParams: Params = {
      status: message
    };

    return post(this.config, 'statuses/update', {}, bodyParams);
  }
}
