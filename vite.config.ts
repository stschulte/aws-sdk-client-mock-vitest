import { coverageConfigDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      exclude: [
        ...coverageConfigDefaults.exclude,
        "dist-cjs/**",
        "dist-es/**",
        "dist-types/**"
      ],
      provider: "v8",
      reporter: ["text", "lcov"]
    },
    include: ["tests/**/*.test.ts"],
    reporters: ["verbose"]
  }
});
