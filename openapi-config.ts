import type { ConfigFile } from '@rtk-query/codegen-openapi';

const config: ConfigFile = {
  schemaFile: `http://45.79.121.129:3000/swagger.json`,
  apiFile: './src/store/emptyApi.ts',
  apiImport: 'baseApi',
  outputFile: './src/store/results.ts',
  exportName: 'coreApi',
  hooks: true,
};

export default config;
