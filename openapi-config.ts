import type { ConfigFile } from '@rtk-query/codegen-openapi';

const config: ConfigFile = {
  schemaFile: `http://localhost:8080/v1/swagger/v3/api-docs`,
  apiFile: './src/store/emptyApi.ts',
  apiImport: 'baseApi',
  outputFile: './src/store/results.ts',
  exportName: 'coreApi',
  hooks: true,
};

export default config;
