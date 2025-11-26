import type { ConfigFile } from '@rtk-query/codegen-openapi';

const config: ConfigFile = {
  schemaFile: `http://localhost:5000/swagger.json`,
  apiFile: './src/store/emptyApi.ts',
  apiImport: 'baseApi',
  outputFile: './src/store/results.ts',
  exportName: 'coreApi',
  hooks: true,
};

export default config;
