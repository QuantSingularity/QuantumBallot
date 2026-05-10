/** @type {import('jest').Config} */
module.exports = {
  // FIX 4: rootDir must be code/ so blockchain/tests/** is reachable
  rootDir: "..",
  testEnvironment: "node",
  transform: {
    "^.+\\.(ts|tsx|js|jsx)$": [
      "babel-jest",
      {
        presets: [
          ["@babel/preset-env", { targets: { node: "current" } }],
          ["@babel/preset-typescript", { allowDeclareFields: true, allowNamespaces: true }],
        ],
      },
    ],
  },
  testMatch: [
    "<rootDir>/backend/tests/**/*.test.js",
    "<rootDir>/backend/tests/**/*.test.ts",
    "<rootDir>/blockchain/tests/**/*.test.js",
    "<rootDir>/blockchain/tests/**/*.test.ts",
    "<rootDir>/backend/simple.test.js",
  ],
  setupFiles: ["<rootDir>/backend/jest.setup.js"],
  modulePaths: ["<rootDir>/backend/node_modules"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
  clearMocks: false,
  restoreMocks: false,
};
