/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+\\.(ts|tsx|js|jsx)$": "babel-jest",
  },
  testMatch: [
    "**/backend/tests/**/*.test.js",
    "**/backend/tests/**/*.test.ts",
    "**/blockchain/tests/**/*.test.js",
    "**/blockchain/tests/**/*.test.ts",
    "**/simple.test.js",
  ],
  setupFiles: ["./jest.setup.js"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
  clearMocks: false,
  restoreMocks: false,
};
