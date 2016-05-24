interface TwixConfig {
  consumerKey: string;
  consumerSecret: string;
  accessToken: string;
  accessTokenSecret: string;
}

interface Params {
  [key: string]: string;
}

interface Response {
  [key: string]: any;
}

type Resolver<T> = (res: T) => any;
type Rejector = (err: Error) => any;