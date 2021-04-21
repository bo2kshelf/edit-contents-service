import type {Config} from '@jest/types';
import base from './jest.base.config';

const config: Config.InitialOptions = {
  ...base,
  collectCoverage: true,
  coverageDirectory: '../coverage/medium',
  reporters: ['default', ['jest-junit', {outputDirectory: 'coverage/medium'}]],
  testMatch: ['<rootDir>/**/test/medium/*.test.ts'],
};
export default config;
