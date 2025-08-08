import type { Config } from '@jest/types';

// Sync object
const config: Config.InitialOptions = {
  testEnvironment: 'node',
  verbose: true,
  resetMocks: true,
  coverageProvider: "v8",
  setupFilesAfterEnv: ['./src/setupTests.ts'],
  transform: {
    '^.+\\.(t|j)sx?$': '@swc/jest',
  },
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  transformIgnorePatterns: ['node_modules/(?!(nanoid|poll|@sindresorhus/df)/)'],
  reporters: [
    'default',
    ['jest-junit', { outputDirectory: 'test-reports', outputName: 'jest-junit-report.xml' }],
    ['jest-sonar', { outputDirectory: 'test-reports', outputName: 'jest-sonar-report.xml' }],
  ],
};

export default config;
