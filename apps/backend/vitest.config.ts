import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
    env: {
      NODE_ENV: "test",
      DATABASE_URL: "postgresql://user:password@localhost:5432/toyxona_test?schema=public",
      JWT_SECRET: "test_jwt_secret_value_change_me"
    }
  }
});
