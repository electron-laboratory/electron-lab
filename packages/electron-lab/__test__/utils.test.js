const { getPkgName } = require('../lib/utils/getPkgName.js');

describe('The Pkg Analyze should work fine.', () => {
  it('normal package', () => {
    expect(getPkgName('fs')).toEqual('fs');
    expect(getPkgName('@foo/bar')).toEqual('@foo/bar');
  });
  it('deep require', () => {
    expect(getPkgName('fs/promise')).toEqual('fs');
    expect(getPkgName('@foo/bar/utils')).toEqual('@foo/bar');
  });
  it('path with node_modules', () => {
    expect(getPkgName('../a/node_modules/foo/bar')).toEqual('foo');
    expect(getPkgName('../node_modules/@foo/bar/utils')).toEqual('@foo/bar');
  });
  it('path without node_modules', () => {
    expect(getPkgName('../a/foo/bar')).toEqual(undefined);
    expect(getPkgName('../@foo/bar/utils')).toEqual(undefined);
  });
});
