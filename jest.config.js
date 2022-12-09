module.exports = {
  preset: 'ts-jest',
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.test.json'
    }
  },
  transform: {
    '^.+\\.(j|t)sx?$': 'ts-jest',
    '^.+\\.svg$': '<rootDir>/test/mocks/svgTransform.js'
  },
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^_assets/icons/(.*)$': '<rootDir>/src/assets/icons/$1',
    '^_utils(.*)$': '<rootDir>/src/utils$1',
    '^_hooks(.*)$': '<rootDir>/src/hooks$1',
    '^_context(.*)$': '<rootDir>/src/context$1',
    '^_atoms(.*)$': '<rootDir>/src/components/atoms$1',
    '^_molecules(.*)$': '<rootDir>/src/components/molecules$1',
    '^_organisms(.*)$': '<rootDir>/src/components/organisms$1',
    '^_navigation(.*)$': '<rootDir>/src/components/navigation$1',
    '^_vectors(.*)$': '<rootDir>/src/components/vectors$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy' 
  }
};
