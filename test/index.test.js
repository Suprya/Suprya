import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';

// TODO
function compile() {}

describe('webpack compilation smoke test (no optimization)', () => {
  it('should compile', async () => {
    const info = await compile('fixtures/basic/index.js', { disabled: true });
  });
});
