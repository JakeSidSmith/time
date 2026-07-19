import { Config } from '@jakesidsmith/tsb';

const config: Config = {
  main: 'src/ts/index.tsx',
  indexHTMLPath: 'src/index.html',
  outDir: 'build',
  tsconfigPath: './tsconfig.dist.json',
  publicDir: './static',
};

export default config;
