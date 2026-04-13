/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+\\.(ts|tsx|js|jsx)$": "babel-jest",
  },
  testMatch: [
    "**/tests/**/*.test.js",
    "**/tests/**/*.test.ts",
    "**/src/tests/**/*.test.ts",
    "**/simple.test.js",
  ],
  setupFiles: ["./jest.setup.js"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  testPathIgnorePatterns: ["/node_modules/"],
  // Kept for any legacy references that still use dist/ paths (e.g. UnitTesting.test.ts)
  moduleNameMapper: {
    "^../dist/(.*)$": "<rootDir>/src/$1",
    "^../../dist/(.*)$": "<rootDir>/src/$1",
    "^../dist$": "<rootDir>/src",
    "^../../dist$": "<rootDir>/src",
  },
  // Clear mock state between test files (not between tests – tests manage that themselves)
  clearMocks: false,
  restoreMocks: false,
};
