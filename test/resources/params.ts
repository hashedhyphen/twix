interface ParamsTest {
  desc: string;
  params: Params;
  expected: string;
}

export const paramsTests: ParamsTest[] = [
  {
    desc: 'params including &',
    params: {
      oauth_version: '1.0',
      status: 's&b'
    },
    expected: 'oauth_version=1.0&status=s%26b'
  },
  {
    desc: 'params including UTF-8 characters',
    params: {
      oauth_version: '1.0',
      status: 'テスト'
    },
    expected: 'oauth_version=1.0&status=%E3%83%86%E3%82%B9%E3%83%88'
  },
];