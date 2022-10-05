module.exports = {
    preset: 'ts-jest',
    testMatch: ['**/*.spec.ts', '**/*.test.ts'],
    transform: {
      '^.+\\.ts$': [
        'ts-jest',
        {
          tsconfig: './tsconfig.json',
        },
      ],
    },
  };