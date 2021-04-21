import type {Config} from '@jest/types';
import base from './jest.base.config';

const config: Config.InitialOptions = {
  ...base,
  testTimeout: 30000,
  testMatch: ['<rootDir>/**/test/e2e/*.test.ts'],
};
export default config;
